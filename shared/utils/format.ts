import dayjs from "dayjs"

/** Date formats the requirements document mandates. */
export const DATE_FORMAT = "DD/MM/YYYY"
export const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm:ss"

/** dd/MM/yyyy, used by every list and form. */
export function formatDate(value: dayjs.ConfigType = new Date()) {
  return dayjs(value).format(DATE_FORMAT)
}

/** dd/MM/yyyy HH:mm:ss, used by the lookup and report screens. */
export function formatDateTime(value: dayjs.ConfigType = new Date()) {
  return dayjs(value).format(DATE_TIME_FORMAT)
}

/** Last two words of a Vietnamese full name, e.g. "Nguyễn Minh Anh" -> "MA". */
export function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  const initials = `${parts.at(-2)?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`
  return initials.toLocaleUpperCase("vi")
}

/** Vietnamese-aware lowercase, for search and duplicate checks. */
export function normalize(value: string) {
  return value.trim().toLocaleLowerCase("vi")
}
