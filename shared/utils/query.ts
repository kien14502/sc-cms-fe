/**
 * Flattens a params object onto a path. Arrays repeat the key, which is how
 * Spring binds Pageable's `sort`. Empty values are dropped.
 */
export function withQuery(
  path: string,
  params: Record<string, unknown> | undefined
) {
  if (!params) return path

  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue

    if (Array.isArray(value)) {
      value.forEach((entry) => search.append(key, String(entry)))
      continue
    }
    search.append(key, String(value))
  }

  const query = search.toString()
  return query ? `${path}?${query}` : path
}
