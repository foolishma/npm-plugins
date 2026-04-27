import type { FormatAmountOptions } from './types'
import { isInvalidValue } from '../shared/isInvalidValue'

/**
 * format amount
 *
 * reference src/utils/index.js formatAmount to options
 * add stripTrailingZeros / invalidText / locale
 *
 * default
 * - amount is null/undefined/'' return invalidText ''
 * - amount to NaN return invalidText
 * - isDecimal=true default decimalN keep N decimal, is false round to integer
 * - isThousand=true default use toLocaleString with thousand separator
 * - stripTrailingZeros=true strip trailing zeros "1.20" -> "1.2" "1.00" -> "1"
 *
 * @example
 * formatAmount({ amount: 1234567.89 })                              // "1,234,567.89"
 * formatAmount({ amount: 1234567.89, isDecimal: false })            // "1,234,568"
 * formatAmount({ amount: 1234567.89, isThousand: false })           // "1234567.89"
 * formatAmount({ amount: 1234567.891, decimalN: 3 })                // "1,234,567.891"
 * formatAmount({ amount: 1.2, stripTrailingZeros: true })           // "1.2"
 * formatAmount({ amount: 1,   stripTrailingZeros: true })           // "1"
 * formatAmount({ amount: null })                                    // ""
 * formatAmount({ amount: null, invalidText: '-' })                  // "-"
 */
export function formatAmount(options: FormatAmountOptions): string {
  const {
    amount,
    isDecimal = true,
    isThousand = true,
    decimalN = 2,
    stripTrailingZeros = false,
    invalidText = '',
    locale = 'zh-CN'
  } = options ?? ({} as FormatAmountOptions)

  if (isInvalidValue(amount)) return invalidText

  let num = Number(amount)
  if (Number.isNaN(num)) return invalidText

  if (isDecimal) {
    num = Number(num.toFixed(decimalN))
  } else {
    num = Math.round(num)
  }

  let str: string
  if (isThousand) {
    const localeOpts: Intl.NumberFormatOptions = isDecimal
      ? { minimumFractionDigits: decimalN, maximumFractionDigits: decimalN }
      : { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    str = num.toLocaleString(locale, localeOpts)
  } else {
    str = isDecimal ? num.toFixed(decimalN) : String(num)
  }

  if (stripTrailingZeros && isDecimal && str.includes('.')) {
    str = str.replace(/0+$/, '').replace(/\.$/, '')
  }

  return str
}

export type { FormatAmountOptions }
