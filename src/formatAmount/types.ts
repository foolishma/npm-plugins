export interface FormatAmountOptions {
  /** format amount (number | string) */
  amount: number | string | null | undefined
  /** whether to keep decimal, default true */
  isDecimal?: boolean
  /** whether to use thousand separator, default true */
  isThousand?: boolean
  /** decimal places, default 2, only effective when isDecimal=true */
  decimalN?: number
  /** whether to strip trailing zeros, default false, 1.20 -> 1.2, 1.00 -> 1 */
  stripTrailingZeros?: boolean
  /** invalid value, null/undefined/'' / NaN return invalidText, default '' */
  invalidText?: string
  /** locale, default 'zh-CN', for thousand separator and decimal point */
  locale?: string
}
