/**
 * Counts Unicode code points, matching the backend's `EnumerateRunes().Count()`
 * (`String.length` counts UTF-16 units, so emoji would be counted twice).
 */
export function countCodePoints(value: string): number {
  return Array.from(value).length;
}
