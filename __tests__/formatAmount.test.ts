import { describe, it, expect } from 'vitest'
import { formatAmount } from '../src'

describe('formatAmount - default', () => {
  it('number default + default decimalN + default isThousand', () => {
    expect(formatAmount({ amount: 1234567.89 })).toBe('1,234,567.89')
  })

  it('string to number', () => {
    expect(formatAmount({ amount: '1234567.89' })).toBe('1,234,567.89')
  })

  it('default decimalN', () => {
    expect(formatAmount({ amount: 1000 })).toBe('1,000.00')
  })

  it('keep decimal', () => {
    expect(formatAmount({ amount: 1.235 })).toBe('1.24')
  })
})

describe('formatAmount - isDecimal / isThousand / decimalN ���', () => {
  it('isDecimal=false ȡ�����Լ�ǧ�ַ�', () => {
    expect(formatAmount({ amount: 1234567.89, isDecimal: false })).toBe(
      '1,234,568'
    )
  })

  it('isThousand=false ȥ��ǧ�ַ�������С��', () => {
    expect(formatAmount({ amount: 1234567.89, isThousand: false })).toBe(
      '1234567.89'
    )
  })

  it('decimalN=3 ������λС��', () => {
    expect(formatAmount({ amount: 1234567.891, decimalN: 3 })).toBe(
      '1,234,567.891'
    )
  })

  it('isDecimal=false + isThousand=false �������ַ���', () => {
    expect(
      formatAmount({ amount: 1234567.89, isDecimal: false, isThousand: false })
    ).toBe('1234568')
  })
})

describe('formatAmount - stripTrailingZeros', () => {
  it('С��λȫ 0 �Ҵ�ǧ�ַ���1000.00 -> 1,000', () => {
    expect(
      formatAmount({ amount: 1000, stripTrailingZeros: true })
    ).toBe('1,000')
  })

  it('С��λ���� 0��1.20 -> 1.2', () => {
    expect(
      formatAmount({ amount: 1.2, stripTrailingZeros: true })
    ).toBe('1.2')
  })

  it('С��λ�� 0��1.23 ���ֲ���', () => {
    expect(
      formatAmount({ amount: 1.23, stripTrailingZeros: true })
    ).toBe('1.23')
  })

  it('stripTrailingZeros=false Ĭ�ϱ���β 0', () => {
    expect(formatAmount({ amount: 1.2 })).toBe('1.20')
  })

  it('isDecimal=false ʱ stripTrailingZeros ��Ӱ���������', () => {
    expect(
      formatAmount({
        amount: 1000,
        isDecimal: false,
        stripTrailingZeros: true
      })
    ).toBe('1,000')
  })

  it('decimalN=4 ĩβ�� 0 ȫ��������1.2000 -> 1.2', () => {
    expect(
      formatAmount({
        amount: 1.2,
        decimalN: 4,
        stripTrailingZeros: true
      })
    ).toBe('1.2')
  })
})

describe('formatAmount - ��Чֵ & NaN', () => {
  it('null Ĭ�Ϸ��ؿմ�', () => {
    expect(formatAmount({ amount: null })).toBe('')
  })

  it('undefined Ĭ�Ϸ��ؿմ�', () => {
    expect(formatAmount({ amount: undefined })).toBe('')
  })

  it('���ַ���Ĭ�Ϸ��ؿմ�', () => {
    expect(formatAmount({ amount: '' })).toBe('')
  })

  it('NaN �ı�Ĭ�Ϸ��ؿմ�������Чֵ�ϲ���', () => {
    expect(formatAmount({ amount: 'abc' })).toBe('')
  })

  it('invalidText ���Զ���Ϊ "-"', () => {
    expect(formatAmount({ amount: null, invalidText: '-' })).toBe('-')
    expect(formatAmount({ amount: 'abc', invalidText: '-' })).toBe('-')
  })
})

describe('formatAmount - locale', () => {
  it('locale=en-US ���Ӣ��ǧ�ַ���ʽ', () => {
    expect(
      formatAmount({ amount: 1234567.89, locale: 'en-US' })
    ).toBe('1,234,567.89')
  })

  it('locale=de-DE ŷ�޸�ʽ�����ǧλ�����ŷ�С��', () => {
    expect(
      formatAmount({ amount: 1234567.89, locale: 'de-DE' })
    ).toBe('1.234.567,89')
  })
})
