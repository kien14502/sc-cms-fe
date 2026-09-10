# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # next dev
npm run build      # next build
npm run start      # serve production build
npm run lint       # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write "**/*.{ts,tsx}"
```

`npm run lint` and `npm run typecheck` both pass clean on `main` — a failure after your edit is yours. Lint a single file with `npx eslint path/to/file.tsx` (the script passes no paths).

No test framework is installed — there is no test runner, config, or test file in the repo. If tests are needed, ask before adding one.

Adding UI primitives: `npx shadcn@latest add <component>` → lands in `components/ui/`.

## Critical version notes

- **Next.js 16.2.6 / React 19.2.4.** Per `AGENTS.md`: this Next.js version has breaking changes vs. most training data. Read the relevant guide under `node_modules/next/dist/docs/` (`01-app/`, `02-pages/`, `03-architecture/`) before writing framework-level code, and heed deprecation notices.
- **shadcn v4 on `@base-ui/react`, not Radix.** `components.json` sets style `base-vega`, base color `neutral`, icon library `remixicon`. `components/ui/button.tsx` wraps `@base-ui/react/button` and keys variants off `data-slot` / `aria-expanded` / `in-data-[slot=…]` selectors. Match that pattern; don't reach for Radix.
- **Tailwind v4**, configured entirely in `app/globals.css` (`@import "tailwindcss"`, `@import "shadcn/tailwind.css"`, `@theme inline`, oklch tokens in `:root` and `.dark`, `@custom-variant dark`). There is no `tailwind.config.*` — `components.json` deliberately leaves `tailwind.config` empty.
- **`cn` is an npm package**, not the usual clsx + tailwind-merge helper. `lib/utils.ts` is just `export { cn } from "cn"`. Import from `@/lib/utils` in app code; shadcn-generated files under `components/ui/` import from `"cn"` directly — leave those as generated.

Path alias: `@/*` → repo root (no `src/` directory).

## Architecture

Layered, barrel-exported. Each `shared/*` subdirectory has an `index.ts` re-export; `shared/enums` is still an empty placeholder.

```
app/            App Router shell (layout + single page)
components/rbac/    the console, composed from components/ui
components/ui/  shadcn primitives, written by the CLI
components/     theme-provider.tsx
mocks/          placeholder lists, delete when services/ returns real data
services/       API call modules → call lib/api-client
lib/api-client.ts   fetch wrapper: response envelope, 401 refresh, toasts
stores/         zustand stores (auth-store)
hooks/          usePermission, useRoleManager, useUserManager
shared/         constants (permissions, api endpoints), schemas (zod), enums, interfaces, utils
docs/           Vietnamese requirements spec (source of truth for features)
```

`app/` has exactly two routes' worth of files: `layout.tsx` and `page.tsx`, which renders `<RbacConsole />`. **There is no `/login` route yet**, even though `lib/api-client.ts` redirects there when a token refresh fails — that redirect currently lands on a 404.

### API client contract (`lib/api-client.ts`)

Every backend call goes through `apiClient<T>` (single resource) or `apiClientList<T>` (paginated list). Both are `"use client"`, so anything importing them — including `services/*` — is client-only.

The backend is expected to return a success envelope, which the client unwraps:

- `apiClient`: `{ success: true, data }` → returns `data`. `{ success: false, … }` → throws.
- `apiClientList`: `{ success: true, data: T[], total: number }` → returns `{ data, total }`. A response missing `data`/`total` throws `"Phản hồi danh sách không hợp lệ"`.

Behaviors to rely on rather than reimplement:

- **401 handling**: single-flight `POST /api/auth/refresh` (concurrent 401s share one `refreshingPromise`), then one retry via `_isRetry`. If refresh fails → error toast + redirect to `/login` after 1s.
- **Errors**: always thrown as `ApiClientError` (`message`, `status`, `body`). Error message is read from `body.errorMessage`, then `body.message`, then `fallbackErrorMessage`. Network/unknown failures get `status: 0`. `AbortError` is rethrown untouched.
- **Toasts**: sonner, wired up by `<Toaster richColors position="top-right" />` in `app/layout.tsx`. Error toasts fire automatically unless `showErrorToast: false`; pass `successToast` (string, or `{ message, type }`) to get a success toast.
- Opt out of refresh with `skipAuthRefresh` (use this for the login call itself).
- Neither function sets request headers. A JSON body needs an explicit `Content-Type: application/json` at the call site.

`services/user-service.ts` is the only service and is unfinished on all three counts: it posts a JSON body with no `Content-Type`, omits `skipAuthRefresh` on login, and targets `API_ENPOINT.USER.LOGIN`, which is still `""`.

Note the existing typos that code already depends on: `API_ENPOINT` in `shared/constants/api-endpoint.ts` and `passowrd` in `loginSchema`. Fix them deliberately, updating every reference, rather than half-renaming.

### RBAC model

Permissions are a `resource × action` matrix, not a flat string list:

- `shared/constants/permissions.ts` — `PERMISSION_RESOURCES` (`users`, `user-groups`, `permissions`) and `PERMISSION_ACTIONS` (`create`, `read`, `update`, `delete`), both `as const` with derived `PermissionResource` / `PermissionAction` types.
- `stores/auth-store.ts` — zustand store holding `AuthUser` with `permissions: Permission[]`. **It is currently seeded with a hardcoded mock Super Admin** (full cross-product of resources × actions). There is no real authentication yet; wiring `setUser` to a login flow is outstanding work.
- `hooks/usePermission.ts` — `usePermission(resource, action)` selects a boolean off the store. UI gates on these (`canCreateRole`, `canDeleteUser`, …) to conditionally render actions.

**Known divergence**: `PERMISSION_GROUPS` in `shared/constants/permission-groups.ts` declares five resources (`user-groups`, `users`, `services`, `products`, `customers`) with Vietnamese action labels and `"${group.id}:${action}"` ids, while `PERMISSION_RESOURCES` lists only three with English actions. These two vocabularies need reconciling before the permission editor can drive real authorization.

### The RBAC console (`components/rbac/`)

The only screen in the product today: sidebar, role table, user table, dialogs. `app/page.tsx` renders it through the `components/rbac` barrel.

- **`rbac-console.tsx`** owns view, search, filter and delete-confirmation state, and assembles everything else. Each list's data and mutations live in `hooks/useRoleManager.ts` and `hooks/useUserManager.ts`; the pure `filterRoles` / `filterUsers` helpers live in `shared/utils/rbac-filter.ts`.
- **All data is mock in-memory state**: `mocks/rbac.ts` feeds `useState`. Create, update and delete mutate local arrays and raise a sonner toast; nothing calls `services/`. Delete `mocks/` when the API lands.
- **Every element is a shadcn component.** The console composes `dialog`, `alert-dialog`, `field`, `input`, `textarea`, `select`, `checkbox`, `table`, `badge`, `avatar`, `empty`, `pagination`, `tabs`, `sidebar`, `tooltip`, `card` and `input-group` from `components/ui/`. The thin wrappers left in `components/rbac/` — `StatusBadge`, `UserAvatar`, `RowAction`, `ListEmpty`, `ListFooter`, `ConfirmDialog` — only map domain state onto those primitives.
- The layout is `SidebarProvider` plus `SidebarInset`, so the mobile drawer, the collapse state and the `cmd+b` shortcut come from the sidebar component rather than local state.
- **Pagination is decorative**: `ListFooter` prints the result count beside a disabled Trước / Sau pair and a hardcoded page "1". The spec's 20-records-per-page rule is not implemented anywhere.
- Only the roles and users views exist. The other four `navItems` in `console-sidebar.tsx` (`Tổng quan`, dịch vụ, sản phẩm, khách hàng) are inert labels.
- **Forms**: react-hook-form + `zodResolver` over `roleSchema` and `cmsUserSchema` in `shared/schemas/rbac-schema.ts`. Text inputs go through `register`; the two selects need `Controller`, because the shadcn select is not a native form control. Their limits (200/300/100 chars, `^(0|84)\d{9,10}$` phone) come from the spec's per-screen "Validate" tables; mine the doc for new forms instead of inventing limits.
- Search and duplicate checks go through `normalize` in `shared/utils/format.ts`, which applies `toLocaleLowerCase("vi")`.

### Theme

`components/theme-provider.tsx` wraps `next-themes` (`attribute="class"`, system default) and registers a global **`d` hotkey** that toggles dark mode, suppressed while typing in an input/textarea/select/contenteditable. `<html>` carries `suppressHydrationWarning` plus the Inter (`--font-sans`, includes the `vietnamese` subset) and Geist Mono (`--font-mono`) variables.

## Product spec

`docs/HomeHub_CMS_v1.022082026.docx.md` is the Vietnamese user requirements document (URD v1.0) for the VNPT **HomeHub CMS** — the authoritative feature source. It is a docx-to-markdown dump: screen specs live inside single wide table cells, and images are stripped to `![][imageN]` placeholders, so grep for a use-case id or a field label rather than expecting readable sections. Use-case ids are not unique — `UC003` labels both "Xem thông tin tài khoản" and "Tìm kiếm và xem danh sách nhóm quyền".

It specifies use cases `UC001`+ across: account access (2-layer login, OTP-by-email password reset, logout), account profile, role-group management, user management, services, products, customers, and lookup/reporting (MT history, system audit log, CDR, revenue reports).

The appendix ("PHỤ LỤC → Quy định chung") defines cross-cutting UI rules the implementation should follow: 20 records per page with no filler rows, searchable comboboxes with an empty-result message, alphabetical combobox ordering, `.`-thousands / `,`-decimal money formatting with HALF UP rounding to 2 decimals, audit logging of every change, and popup-based error / 3-second success notifications.

## Conventions

- **Every UI element is a shadcn component from `components/ui/`.** Install what is missing with `npx shadcn@latest add <component>` rather than hand-rolling it or wrapping `@base-ui/react` directly. Generated files keep their registry filenames, including kebab-case hooks such as `hooks/use-mobile.ts`. Two of them were edited on purpose: their English `sr-only` and `aria-label` strings are now Vietnamese, and `use-mobile.ts` was rewritten on `useSyncExternalStore` because the generated version set state inside an effect, which this project's lint rejects.
- **Dates go through dayjs**, wrapped in `shared/utils/format.ts` as `formatDate` and `formatDateTime` over the `DATE_FORMAT` and `DATE_TIME_FORMAT` constants. Never hand-roll date arithmetic or padding, and never call `dayjs().format("DD/MM/YYYY")` inline; add a helper beside those two instead. Parsing a `dd/MM/yyyy` string back needs the `customParseFormat` plugin, which is not registered yet.
- **All user-facing copy is Vietnamese** — error messages, toasts, labels, `aria-label`s, `metadata`. Keep it that way; code identifiers stay English.
- Prettier (`.prettierrc`): **no semicolons**, double quotes, 2-space indent, 80 columns, `es5` trailing commas, `prettier-plugin-tailwindcss` sorting classes in `cn()` and `cva()` against `app/globals.css`. Several newer files (`services/user-service.ts`, `shared/schemas/user-schema.ts`, `shared/constants/api-endpoint.ts`) are not yet formatted — run `npm run format` after touching them.
- Constants use `as const` arrays with types derived via `(typeof X)[number]` instead of TS enums.
- **Files are filed by kind, not by feature.** Hooks go in `hooks/`, stores in `stores/`, API modules in `services/`, types in `shared/interfaces/`, schemas in `shared/schemas/`, constants in `shared/constants/`, pure helpers in `shared/utils/`, components in `components/<module>/`. A hook never sits beside the component that calls it. Hook files are named for the hook (`usePermission.ts`); everything else is kebab-case.
- Add new exports to the relevant `index.ts` barrel and import through `@/shared/...`, `@/services`, etc.

## Project subagents

`.claude/agents/` holds five agents built around the requirements document. The intended order for a new module is: `urd-analyst` extracts the spec, `cms-screen-builder` implements the screen, `api-service-wirer` replaces the mock arrays with real calls, then `spec-compliance-reviewer` and `rbac-auditor` check the result against the document and the permission matrix. The last three are read-only.
