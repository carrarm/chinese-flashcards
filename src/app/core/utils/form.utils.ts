import { Nullable, Optional } from "@core/types";

export function toOptional<T>(value: Nullable<T>): Optional<T> {
  return value ?? undefined;
}
