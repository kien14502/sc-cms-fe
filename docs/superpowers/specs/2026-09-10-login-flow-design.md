# Thiết kế màn hình đăng nhập (mockup) — HomeHub CMS

- Ngày: 10/09/2026
- Nguồn yêu cầu: `docs/HomeHub_CMS_v1.022082026.docx.md`, UC001 Đăng nhập, UC002 Đăng xuất
- Trạng thái: đã triển khai
- Cập nhật 10/09/2026: `docs/api-be.json` xuất hiện, backend giả bị bỏ và luồng
  nối thẳng vào API thật. Các mục 6, 8, 9 và 11 đã viết lại theo hợp đồng đó.

## 1. Bối cảnh

Repo hiện chỉ có một màn hình là console RBAC. Không có route `/login`, trong khi
`lib/api-client.ts` lại redirect về `/login` khi refresh token thất bại, nên cú
redirect đó đang rơi vào 404. `stores/auth-store.ts` khởi tạo sẵn một Super Admin
hardcode, `setUser` chưa được gọi từ đâu, và không có lớp nào chặn truy cập console.

Backend chưa sẵn sàng: `API_ENPOINT.USER.LOGIN` vẫn là chuỗi rỗng. Vì vậy bản này
dựng đầy đủ giao diện và luồng của UC001 trên một backend giả, đặt sau một ranh
giới hàm rõ ràng để khi API thật xuất hiện chỉ cần thay tầng gọi.

## 2. Phạm vi

Trong phạm vi:

- Bốn màn theo UC001: SCR-1 đăng nhập, SCR-2 quên mật khẩu, SCR-3 nhập OTP,
  SCR-4 đặt mật khẩu mới sau xác thực OTP.
- Chặn toàn bộ console sau lớp đăng nhập.
- Đăng xuất theo UC002.
- Mô phỏng quy tắc khoá: sai mật khẩu 5 lần liên tiếp khoá 1 tiếng, sai OTP 5 lần
  liên tiếp khoá 30 phút.

Ngoài phạm vi, ghi lại thành nợ kỹ thuật ở mục 11:

- Phiên 120 phút và tự đăng xuất sau 30 phút không thao tác.
- Gọi API thật, lưu token, cookie phiên, middleware phía server.
- Màn thông tin tài khoản và đổi mật khẩu trong console, UC003 và UC075.
- Ghi log audit cho hành vi đăng nhập.

## 3. Cấu trúc route

```
app/
  layout.tsx                 # giữ nguyên: font, ThemeProvider, Toaster
  (auth)/
    layout.tsx               # server component, khung nền và thẻ căn giữa
    login/page.tsx           # server component, metadata riêng, render <LoginFlow />
  (console)/
    layout.tsx               # server component, bọc children trong <AuthGuard>
    page.tsx                 # chuyển từ app/page.tsx, render <RbacConsole />
```

Hai nhóm route không tranh nhau đường dẫn: `(console)/page.tsx` phục vụ `/`,
`(auth)/login/page.tsx` phục vụ `/login`. Giữ hai layout ở dạng server component
để vẫn khai báo được `metadata`; toàn bộ phần cần trạng thái nằm trong các client
component bên dưới.

`app/(auth)/login/page.tsx` khai báo `metadata` với `title` là
`"Đăng nhập | HomeHub CMS"`, đè lên title mặc định ở root layout.

## 4. Trạng thái phiên

`stores/auth-store.ts` sửa như sau:

- `user` khởi tạo `null`, bỏ hằng `superAdminPermissions` hardcode.
- Thay `setUser` bằng `login(user: AuthUser)` và `logout()`. Không chỗ nào đang gọi
  `setUser` nên không cần giữ lại.
- Bọc store trong middleware `persist` của zustand, key `homehub-cms-auth`,
  `partialize` chỉ lưu `user`.
- Chuyển hai kiểu `AuthUser` và `Permission` sang `shared/interfaces/auth.ts` cho
  đúng quy ước xếp file theo loại, store import ngược lại.

Vì `persist` đọc localStorage bất đồng bộ so với lần render đầu, thêm
`hooks/useAuthHydrated.ts` dùng `useSyncExternalStore` đăng ký vào
`useAuthStore.persist.onFinishHydration`. Không dùng `useEffect` để set state vì
lint của dự án chặn mẫu đó, xem ghi chú về `hooks/use-mobile.ts` trong CLAUDE.md.

`components/auth/auth-guard.tsx` là client component:

1. Chưa hydrate xong thì render skeleton toàn trang.
2. Hydrate xong mà `user` là `null` thì gọi `router.replace("/login")` và tiếp tục
   render skeleton cho tới khi điều hướng xong.
3. Có `user` thì render `children`.

Chiều ngược lại nằm trong `login-flow.tsx`: đã có `user` mà vào `/login` thì đẩy về
`/` ngay, tránh việc đăng nhập lại đè lên phiên đang mở.

## 5. Máy trạng thái luồng đăng nhập

`hooks/useLoginFlow.ts` giữ toàn bộ trạng thái của bốn bước.

`shared/interfaces/auth.ts` giữ `AuthUser`, `Permission`, `AuthChallenge` và hai
kiểu bước dưới đây:

```ts
export type LoginStep = "credentials" | "forgot" | "otp" | "reset"
export type OtpPurpose = "login" | "reset"
```

Trạng thái hook nắm giữ: `step`, `username` đang xử lý, `maskedEmail` để hiển thị
ở SCR-3, `otpPurpose`, và `isSubmitting`.

Chuyển bước:

| Từ | Hành động | Tới |
| --- | --- | --- |
| credentials | Đăng nhập thành công | otp, purpose `login` |
| credentials | Nhấn Quên mật khẩu | forgot |
| forgot | Gửi OTP qua email thành công | otp, purpose `reset` |
| forgot | Nhấn Quay lại đăng nhập | credentials |
| otp, purpose `login` | OTP đúng | gọi `login(user)` rồi `router.replace("/")` |
| otp, purpose `reset` | OTP đúng | reset |
| otp | Sai OTP quá 5 lần | credentials |
| reset | Lưu mật khẩu mới thành công | credentials |

## 6. Tầng service

`services/auth-service.ts` gọi thẳng các endpoint trong `docs/api-be.json`. Luồng
mang theo `otpToken` do bước trước trả về, chứ không mang username, nên hai màn OTP
buộc phải là hai bước của cùng một route.

| Bước | Endpoint | Trả về |
| --- | --- | --- |
| Đăng nhập | `POST /api/v1/auth/login` | `otpToken`, `maskedEmail` |
| Xác thực OTP | `POST /api/v1/auth/verify-otp` | `accessToken`, `refreshToken`, `passwordExpired` |
| Gửi lại OTP | `POST /api/v1/auth/resend-otp` | `otpToken` mới |
| Quên mật khẩu | `POST /api/v1/auth/forgot-password` | `otpToken`, `maskedEmail` |
| OTP nhánh quên | `POST /api/v1/auth/forgot-password/verify-otp` | `resetToken` |
| Đặt mật khẩu mới | `POST /api/v1/auth/reset-password` | rỗng |
| Đăng xuất | `POST /api/v1/auth/logout` | rỗng |

Bốn lời gọi trước khi có phiên đi kèm `skipAuthRefresh` và `skipAuthHeader`, vì chưa
có bearer token nào để gắn và một lỗi 401 ở đây là sai mật khẩu chứ không phải hết phiên.

Sau khi `verify-otp` trả token, luồng gọi tiếp `GET /api/v1/account/me` để dựng
`AuthUser`. Các service còn lại là `account-service`, `user-service`, `role-service`
và `permission-service`.

`lib/api-client.ts` phải sửa theo hợp đồng thật, khác hẳn phần mô tả trong CLAUDE.md:

- Envelope là `{ code, message, data }`, không có cờ `success`. Client bóc `data`.
- Danh sách trả `data.items` kèm `totalElements`, không phải `data` kèm `total`.
- Xác thực bằng bearer token, refresh gửi `refreshToken` trong body tới
  `POST /api/v1/auth/refresh`, không còn dựa vào cookie same-origin.
- Client tự gắn `Authorization` và `Content-Type`, nên call site không phải lặp lại.
- Đường dẫn tương đối được ghép vào `NEXT_PUBLIC_API_BASE_URL`, mặc định
  `http://localhost:8080` theo `servers` trong tài liệu OpenAPI.

## 7. Schema và validate

Thêm `shared/schemas/auth-schema.ts`, xoá `shared/schemas/user-schema.ts` và sửa
import trong `services/user-service.ts`. Đây cũng là chỗ sửa lỗi chính tả
`passowrd` thành `password` mà CLAUDE.md yêu cầu sửa dứt điểm kèm mọi tham chiếu.

| Schema | Trường | Ràng buộc theo spec |
| --- | --- | --- |
| `loginSchema` | `username` | bắt buộc, tối đa 50 ký tự, chỉ chữ số và `._-` |
| | `password` | bắt buộc, tối đa 50 ký tự |
| | `remember` | boolean, mặc định `false` |
| `forgotPasswordSchema` | `username` | như trên |
| `otpSchema` | `otp` | bắt buộc, đúng 6 chữ số, chỉ nhận số |
| `resetPasswordSchema` | `password` | tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt |

Ô OTP chặn ký tự không phải số ngay khi gõ, không đợi submit. Ô username chặn nhập
quá 50 ký tự bằng `maxLength` để khớp mô tả "quá 50 ký tự không cho nhập".

## 8. Hằng số

`shared/constants/auth.ts` chỉ còn `OTP_LENGTH`. Các hằng đếm số lần sai và thời gian
khoá đã bỏ: quy tắc khoá nằm ở backend, client chỉ hiển thị thông điệp trả về.

`shared/constants/api-endpoint.ts` viết lại theo `docs/api-be.json`, gom theo nhóm
`AUTH`, `ACCOUNT`, `USER`, `ROLE`, `PERMISSION`. Lỗi chính tả `API_ENPOINT` được sửa
thành `API_ENDPOINT` cùng lúc, chỉ có một chỗ tham chiếu nên sửa dứt điểm được.

## 9. Component

Tất cả dựng từ primitive trong `components/ui/`, không tự viết tay.

| File | Vai trò |
| --- | --- |
| `components/auth/auth-guard.tsx` | chặn console, xem mục 4 |
| `components/auth/login-flow.tsx` | gắn `useLoginFlow`, chọn bước để render |
| `components/auth/auth-card.tsx` | khung thẻ dùng chung, tiêu đề và mô tả |
| `components/auth/credentials-step.tsx` | SCR-1 |
| `components/auth/forgot-password-step.tsx` | SCR-2 |
| `components/auth/otp-step.tsx` | SCR-3 |
| `components/auth/reset-password-step.tsx` | SCR-4 |
| `components/auth/password-field.tsx` | ô mật khẩu kèm nút hiện, dựng trên `input-group` |
| `components/auth/auth-skeleton.tsx` | chỗ giữ khi đang đọc lại phiên |
| `components/auth/index.ts` | barrel |

Form dùng react-hook-form với `zodResolver`, giống `role-dialog.tsx` và
`user-dialog.tsx` hiện có. Checkbox ghi nhớ đăng nhập cần `Controller` vì checkbox
của shadcn không phải control gốc.

Spec mô tả ghi nhớ đăng nhập là lưu cả user lẫn mật khẩu. Bản này chỉ lưu tên đăng
nhập vào localStorage rồi điền sẵn ở lần sau, không lưu mật khẩu. Ghi lại đây để
lệch với spec là có chủ ý chứ không phải bỏ sót.

Màn OTP có thêm nút gửi lại mã, dùng `resend-otp`. Spec không mô tả nút này nhưng
endpoint có sẵn và không có nó thì OTP hết hạn là tắc luồng.

Cần cài thêm một primitive: `npx shadcn@latest add dropdown-menu`, phục vụ menu
đăng xuất.

Sửa `components/rbac/console-sidebar.tsx`: bọc khối người dùng ở `SidebarFooter`
trong dropdown menu, thêm mục Đăng xuất gọi `logout()` rồi `router.replace("/login")`.

## 10. Thông báo

Thông điệp lỗi lấy từ `message` trong envelope của backend, `apiClient` tự bắn toast,
nên hook không toast lại lần nữa. Lỗi validate hiện inline dưới từng field qua `Field`.
Các câu chữ trong UC001 về sai mật khẩu, sai OTP và khoá tài khoản giờ thuộc trách
nhiệm backend.

Phía client còn giữ ba thông điệp riêng: xoá trắng ô OTP khi mã bị từ chối theo AF-2,
toast "Cập nhật mật khẩu thành công" sau khi đặt lại, và cảnh báo khi `passwordExpired`
trả về `true`.

## 11. Nghiệm thu và nợ kỹ thuật

`npm run lint`, `npm run typecheck` và `npm run build` đều sạch. Trên trình duyệt đã
kiểm tra: vào `/` bị đẩy sang `/login`, form báo lỗi tiếng Việt khi bỏ trống, và nút
quên mật khẩu chuyển đúng sang SCR-2. Hai màn OTP và đặt mật khẩu mới chưa chạy thử
được vì cần backend ở cổng 8080.

Nợ kỹ thuật:

1. **Chặn nhất**: không endpoint nào trả quyền của tài khoản đang đăng nhập.
   `/account/me` chỉ có `roleName`, còn `/permissions/tree` là toàn bộ danh mục.
   Tạm thời `shared/utils/auth-user.ts` cấp full quyền cho mọi tài khoản, nghĩa là
   `usePermission` chưa chặn được gì. Cần backend bổ sung danh sách quyền hoặc `roleId`.
2. `passwordExpired` mới chỉ hiện cảnh báo, chưa có màn bắt buộc đổi mật khẩu.
3. Lớp chặn vẫn ở client. Chuyển sang cookie phiên kèm middleware khi có yêu cầu.
4. Phiên 120 phút và tự đăng xuất sau 30 phút không thao tác.
5. Console vẫn chạy trên `mocks/rbac.ts`. `user-service` và `role-service` đã sẵn sàng
   để `useRoleManager` và `useUserManager` chuyển sang dùng.
6. Hai bộ từ vựng quyền lệch nhau giữa `PERMISSION_GROUPS` và `PERMISSION_RESOURCES`,
   và cả hai đều chưa khớp với `code` mà `/permissions/tree` trả về.
