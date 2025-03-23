export function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    const parsed = JSON.parse(raw ?? '')
    return parsed ?? fallback
  } catch {
    return fallback
  }
}
