import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export function applyServerFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fieldErrors: Record<string, string[]> | undefined,
  fields: readonly Path<T>[],
): void {
  for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
    const known = fields.find((candidate) => candidate === field);
    if (known && messages[0]) setError(known, { message: messages[0] });
  }
}
