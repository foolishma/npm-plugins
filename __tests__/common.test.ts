import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  maskString,
  isBlank,
  groupBy,
  deepClone,
  isEmail,
  isPhoneCN,
  isIDCardCN,
  isUrl,
  isNumberLike,
  isEmptyValue,
  parseQuery,
  getFileExt,
  downloadBlob,
  copyToClipboard,
  debounce,
  throttle,
  once
} from '../src'

describe('maskString', () => {
  it('masks middle content with default options', () => {
    expect(maskString('13812345678')).toBe('138****5678')
  })

  it('supports custom visible positions', () => {
    expect(maskString('abcdefg', { startVisible: 1, endVisible: 1 })).toBe(
      'a*****g'
    )
  })
})

describe('isBlank', () => {
  it('returns true for empty and whitespace strings', () => {
    expect(isBlank('')).toBe(true)
    expect(isBlank('   ')).toBe(true)
  })

  it('returns false for non-blank values', () => {
    expect(isBlank('abc')).toBe(false)
    expect(isBlank(null)).toBe(false)
  })
})

describe('groupBy', () => {
  it('groups list by key', () => {
    const list = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 }
    ]
    expect(groupBy(list, 'type')).toEqual({
      a: [
        { type: 'a', value: 1 },
        { type: 'a', value: 3 }
      ],
      b: [{ type: 'b', value: 2 }]
    })
  })
})

describe('deepClone', () => {
  it('clones nested object without sharing reference', () => {
    const source = { a: 1, nested: { b: [1, 2, 3] } }
    const cloned = deepClone(source)
    cloned.nested.b.push(4)
    expect(source.nested.b).toEqual([1, 2, 3])
    expect(cloned.nested.b).toEqual([1, 2, 3, 4])
  })
})

describe('validators', () => {
  it('validates email', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('bad-email')).toBe(false)
  })

  it('validates cn phone', () => {
    expect(isPhoneCN('13812345678')).toBe(true)
    expect(isPhoneCN('+8613812345678')).toBe(true)
    expect(isPhoneCN('12345')).toBe(false)
  })

  it('validates cn id card', () => {
    expect(isIDCardCN('11010519491231002X')).toBe(true)
    expect(isIDCardCN('110105194912310021')).toBe(false)
  })

  it('validates url', () => {
    expect(isUrl('https://example.com/a')).toBe(true)
    expect(isUrl('ftp://example.com')).toBe(false)
  })

  it('validates number-like values', () => {
    expect(isNumberLike('12.3')).toBe(true)
    expect(isNumberLike(12.3)).toBe(true)
    expect(isNumberLike('abc')).toBe(false)
  })

  it('checks empty values', () => {
    expect(isEmptyValue(null)).toBe(true)
    expect(isEmptyValue(undefined)).toBe(true)
    expect(isEmptyValue('')).toBe(true)
    expect(isEmptyValue(Number.NaN)).toBe(true)
    expect(isEmptyValue(0)).toBe(false)
  })
})

describe('query and file helpers', () => {
  it('parses query string', () => {
    expect(parseQuery('?a=1&b=2&b=3')).toEqual({ a: '1', b: ['2', '3'] })
  })

  it('gets file extension', () => {
    expect(getFileExt('https://x.com/path/demo.TS?x=1')).toBe('ts')
    expect(getFileExt('README')).toBe('')
  })
})

describe('browser helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('downloadBlob returns false without document', () => {
    vi.stubGlobal('document', undefined)
    expect(downloadBlob(new Blob(['hello']), 'a.txt')).toBe(false)
  })

  it('copyToClipboard falls back to execCommand', async () => {
    const textarea = {
      value: '',
      setAttribute: vi.fn(),
      style: {},
      select: vi.fn()
    }
    const fakeDocument = {
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn()
      },
      createElement: vi.fn(() => textarea),
      execCommand: vi.fn(() => true)
    }

    vi.stubGlobal('navigator', {})
    vi.stubGlobal('document', fakeDocument)
    await expect(copyToClipboard('hello')).resolves.toBe(true)
  })
})

describe('debounce and throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounce triggers once after wait', () => {
    const fn = vi.fn()
    const wrapped = debounce(fn, 100)
    wrapped()
    wrapped()
    wrapped()
    vi.advanceTimersByTime(99)
    expect(fn).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('throttle limits frequent calls', () => {
    const fn = vi.fn()
    const wrapped = throttle(fn, 100)
    wrapped()
    wrapped()
    wrapped()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('once', () => {
  it('runs wrapped function only once', () => {
    const fn = vi.fn((x: number) => x + 1)
    const wrapped = once(fn)
    expect(wrapped(1)).toBe(2)
    expect(wrapped(2)).toBe(2)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
