export function toOptional<T>(value: T | null): T | undefined {
  return value ?? undefined;
}
