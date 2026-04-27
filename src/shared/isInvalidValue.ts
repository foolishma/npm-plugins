/**
 * check if the value is null / undefined / ''
 * used in utils to ensure "invalid value" is a valid value
 */
export function isInvalidValue(v: unknown): boolean {
  return v === null || v === undefined || v === ''
}
