/**
 * 字符串脱敏参数。
 */
export interface MaskStringOptions {
  /** 保留前缀可见字符数，默认 3。 */
  startVisible?: number
  /** 保留后缀可见字符数，默认 4。 */
  endVisible?: number
  /** 脱敏填充字符，仅取首字符，默认 `*`。 */
  maskChar?: string
}

/**
 * 对字符串进行脱敏处理。
 *
 * @param value 原始字符串。
 * @param options 脱敏配置。
 * @returns 脱敏后的字符串；当原字符串为空时返回空串。
 *
 * @example
 * maskString('13812345678') // "138****5678"
 */
export function maskString(value: string, options: MaskStringOptions = {}): string {
  /** 前缀保留数、后缀保留数、脱敏字符。 */
  const { startVisible = 3, endVisible = 4, maskChar = '*' } = options
  /** 将输入值统一转为字符串，避免非字符串调用出错。 */
  const source = String(value ?? '')
  if (!source) return ''

  /** 修正后的前缀保留长度（防负数/小数）。 */
  const safeStart = Math.max(0, Math.floor(startVisible))
  /** 修正后的后缀保留长度（防负数/小数）。 */
  const safeEnd = Math.max(0, Math.floor(endVisible))
  /** 修正后的脱敏字符（仅取首字符）。 */
  const safeMask = maskChar ? String(maskChar)[0] : '*'

  if (safeStart + safeEnd >= source.length) {
    return safeMask.repeat(source.length)
  }

  /** 需要被脱敏字符的长度。 */
  const maskedLength = source.length - safeStart - safeEnd
  return `${source.slice(0, safeStart)}${safeMask.repeat(maskedLength)}${source.slice(-safeEnd)}`
}

/**
 * 判断一个值是否为空白字符串。
 *
 * 仅当值类型为字符串且 `trim()` 后为空时返回 `true`。
 *
 * @param value 待判断值。
 * @returns 是否为空白字符串。
 */
export function isBlank(value: unknown): boolean {
  return typeof value === 'string' && value.trim() === ''
}

/**
 * 按指定规则将数组分组。
 *
 * @typeParam T 数组元素类型。
 * @param list 待分组数组。
 * @param selector 分组选择器，支持键名或回调函数。
 * @returns 以分组键为 key 的对象。
 */
export function groupBy<T>(
  list: T[],
  selector: ((item: T) => string | number | symbol) | keyof T
): Record<string, T[]> {
  /** 分组结果容器。 */
  const result: Record<string, T[]> = {}
  /** 统一后的取 key 函数。 */
  const resolver =
    typeof selector === 'function'
      ? selector
      : (item: T): string | number | symbol => (item as Record<keyof T, unknown>)[selector] as string | number | symbol

  for (const item of list) {
    /** 当前项分组键，统一转为字符串。 */
    const key = String(resolver(item))
    if (!result[key]) result[key] = []
    result[key].push(item)
  }

  return result
}

/**
 * 深拷贝任意可处理的数据结构。
 *
 * 优先尝试 `structuredClone`，失败后降级为手动递归克隆，
 * 并使用 `WeakMap` 处理循环引用。
 *
 * @typeParam T 输入输出类型。
 * @param input 待拷贝值。
 * @param cache 循环引用缓存映射。
 * @returns 深拷贝结果。
 */
export function deepClone<T>(input: T, cache = new WeakMap<object, unknown>()): T {
  if (typeof input !== 'object' || input === null) return input

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(input)
    } catch {
      // fallback for non-cloneable values.
    }
  }

  /** 命中缓存说明存在循环引用，直接复用缓存结果。 */
  if (cache.has(input as object)) {
    return cache.get(input as object) as T
  }

  /** Date 类型深拷贝。 */
  if (input instanceof Date) return new Date(input.getTime()) as T
  /** RegExp 类型深拷贝。 */
  if (input instanceof RegExp) return new RegExp(input.source, input.flags) as T

  if (Array.isArray(input)) {
    /** 数组拷贝容器。 */
    const arr: unknown[] = []
    cache.set(input, arr)
    for (const item of input) arr.push(deepClone(item, cache))
    return arr as T
  }

  if (input instanceof Map) {
    /** Map 拷贝容器。 */
    const map = new Map<unknown, unknown>()
    cache.set(input, map)
    for (const [k, v] of input.entries()) {
      map.set(deepClone(k, cache), deepClone(v, cache))
    }
    return map as T
  }

  if (input instanceof Set) {
    /** Set 拷贝容器。 */
    const set = new Set<unknown>()
    cache.set(input, set)
    for (const v of input.values()) set.add(deepClone(v, cache))
    return set as T
  }

  /** 原型对象，保证拷贝后实例原型链不丢失。 */
  const proto = Object.getPrototypeOf(input)
  /** 普通对象/类实例拷贝容器。 */
  const cloned = Object.create(proto) as Record<string, unknown>
  cache.set(input as object, cloned)
  for (const key of Reflect.ownKeys(input as object)) {
    cloned[key as string] = deepClone((input as Record<string, unknown>)[key as string], cache)
  }
  return cloned as T
}

/**
 * 判断是否为合法邮箱。
 *
 * @param value 待判断值。
 * @returns 是否为合法邮箱格式。
 */
export function isEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

/**
 * 判断是否为中国大陆手机号。
 *
 * 支持以下格式：
 * - `13812345678`
 * - `+8613812345678`
 *
 * @param value 待判断值。
 * @returns 是否为合法中国大陆手机号。
 */
export function isPhoneCN(value: unknown): boolean {
  if (typeof value !== 'string' && typeof value !== 'number') return false
  /** 去除中间空白，便于宽松输入校验。 */
  const normalized = String(value).replace(/\s+/g, '')
  return /^(?:\+?86)?1[3-9]\d{9}$/.test(normalized)
}

/**
 * 校验日期文本是否能组成真实日期。
 *
 * @param yyyy 年份字符串。
 * @param mm 月份字符串。
 * @param dd 日期字符串。
 * @returns 是否为合法日期。
 */
function isValidDateText(yyyy: string, mm: string, dd: string): boolean {
  /** 年份数字。 */
  const y = Number(yyyy)
  /** 月份数字。 */
  const m = Number(mm)
  /** 日期数字。 */
  const d = Number(dd)
  /** 使用 Date 进行真实日期回算校验。 */
  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  )
}

/**
 * 判断是否为合法中国大陆二代身份证号（18 位）。
 *
 * 校验内容：
 * - 基础格式（17 位数字 + 校验位）
 * - 出生日期合法性
 * - 校验位算法（ISO 7064:1983, MOD 11-2）
 *
 * @param value 待判断值。
 * @returns 是否为合法身份证号。
 */
export function isIDCardCN(value: unknown): boolean {
  if (typeof value !== 'string') return false
  /** 统一大写，便于处理末位 x/X。 */
  const id = value.toUpperCase().trim()
  if (!/^\d{17}[\dX]$/.test(id)) return false

  if (!isValidDateText(id.slice(6, 10), id.slice(10, 12), id.slice(12, 14))) {
    return false
  }

  /** 加权因子。 */
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  /** 余数到校验位映射表。 */
  const checkMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  /** 前 17 位加权求和。 */
  const sum = id
    .slice(0, 17)
    .split('')
    .reduce((acc, digit, idx) => acc + Number(digit) * weights[idx], 0)

  return checkMap[sum % 11] === id[17]
}

/**
 * 判断字符串是否为合法 URL（仅接受 http/https）。
 *
 * @param value 待判断值。
 * @returns 是否为合法 URL。
 */
export function isUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 判断值是否可被视为“数字”。
 *
 * 规则：
 * - number 类型：必须是有限数值
 * - string 类型：去空白后可被 Number 正常解析且有限
 *
 * @param value 待判断值。
 * @returns 是否为数字样式值。
 */
export function isNumberLike(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'string') return false
  /** 去除首尾空白，避免 `'  1  '` 判错。 */
  const source = value.trim()
  if (source === '') return false
  return Number.isFinite(Number(source))
}

/**
 * 判断值是否为空值。
 *
 * 空值定义：
 * - `null`
 * - `undefined`
 * - 空字符串 `''`
 * - `NaN`
 *
 * @param value 待判断值。
 * @returns 是否为空值。
 */
export function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === '' || (typeof value === 'number' && Number.isNaN(value))
}

/**
 * 解析 query string 为对象。
 *
 * 特性：
 * - 支持完整 URL、`?a=1&b=2`、`a=1&b=2`
 * - 自动去掉 hash 片段
 * - 重复 key 聚合为数组
 * - 支持 `+` 作为空格
 *
 * @param input 查询字符串或 URL。
 * @returns 解析结果对象。
 */
export function parseQuery(input: string): Record<string, string | string[]> {
  if (!input) return {}

  /** 归一化后的 query 部分。 */
  let query = input
  if (query.includes('?')) query = query.slice(query.indexOf('?') + 1)
  /** hash 起始位置。 */
  const hashIndex = query.indexOf('#')
  if (hashIndex !== -1) query = query.slice(0, hashIndex)
  query = query.replace(/^\?/, '')
  if (!query) return {}

  /** 最终解析结果。 */
  const result: Record<string, string | string[]> = {}
  for (const pair of query.split('&')) {
    if (!pair) continue
    /** 原始 key 和 value（未解码）。 */
    const [rawKey, rawVal = ''] = pair.split('=')
    /** 解码后的 key。 */
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '))
    /** 解码后的 value。 */
    const value = decodeURIComponent(rawVal.replace(/\+/g, ' '))
    /** 已存在值（用于处理重复 key）。 */
    const existed = result[key]
    if (existed === undefined) {
      result[key] = value
    } else if (Array.isArray(existed)) {
      existed.push(value)
    } else {
      result[key] = [existed, value]
    }
  }

  return result
}

/**
 * 获取文件扩展名（不含 `.`，统一小写）。
 *
 * 支持处理：
 * - 普通文件名
 * - 含路径文件名
 * - 含 query/hash 的 URL
 *
 * @param pathOrName 文件名或路径/URL。
 * @returns 扩展名；无扩展名时返回空串。
 */
export function getFileExt(pathOrName: string): string {
  if (!pathOrName) return ''
  /** 去掉 query 与 hash 后的原始路径。 */
  const clean = pathOrName.split('?')[0].split('#')[0]
  /** 提取纯文件名。 */
  const filename = clean.split('/').pop()?.split('\\').pop() ?? ''
  /** 最后一个点的位置。 */
  const idx = filename.lastIndexOf('.')
  if (idx <= 0 || idx === filename.length - 1) return ''
  return filename.slice(idx + 1).toLowerCase()
}

/**
 * 在浏览器中下载 Blob 数据。
 *
 * @param blob Blob 数据对象。
 * @param filename 下载文件名。
 * @returns 是否触发下载成功（在非浏览器环境返回 false）。
 */
export function downloadBlob(blob: Blob, filename: string): boolean {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return false
  /** 临时下载锚点元素。 */
  const anchor = document.createElement('a')
  /** Blob 对应的临时对象 URL。 */
  const href = URL.createObjectURL(blob)
  anchor.href = href
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(href)
  return true
}

/**
 * 复制文本到剪贴板（包含降级方案）。
 *
 * 优先使用：
 * - `navigator.clipboard.writeText`
 *
 * 降级为：
 * - 隐藏 textarea + `document.execCommand('copy')`
 *
 * @param text 需要复制的文本。
 * @returns 复制是否成功。
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fallback to execCommand.
    }
  }

  if (typeof document === 'undefined') return false
  /** 降级复制使用的临时 textarea。 */
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  return ok
}

/**
 * 防抖函数类型。
 *
 * @typeParam T 原始函数类型。
 */
export type DebouncedFunction<T extends (...args: any[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & { cancel: () => void }

/**
 * 创建防抖函数。
 *
 * 在连续触发时，仅在最后一次触发后等待 `wait` 毫秒执行。
 *
 * @typeParam T 原始函数类型。
 * @param fn 原始函数。
 * @param wait 等待时间（毫秒），默认 300。
 * @returns 防抖后的函数，包含 `cancel` 方法。
 */
export function debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  wait = 300
): DebouncedFunction<T> {
  /** 当前防抖计时器。 */
  let timer: ReturnType<typeof setTimeout> | null = null
  /** 包装后的防抖函数。 */
  const wrapped = ((...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }) as DebouncedFunction<T>

  wrapped.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return wrapped
}

/**
 * 节流函数类型。
 *
 * @typeParam T 原始函数类型。
 */
export type ThrottledFunction<T extends (...args: any[]) => unknown> = ((
  ...args: Parameters<T>
) => void) & { cancel: () => void }

/**
 * 创建节流函数。
 *
 * 在 `wait` 时间窗口内最多执行一次。
 *
 * @typeParam T 原始函数类型。
 * @param fn 原始函数。
 * @param wait 节流间隔（毫秒），默认 300。
 * @returns 节流后的函数，包含 `cancel` 方法。
 */
export function throttle<T extends (...args: any[]) => unknown>(
  fn: T,
  wait = 300
): ThrottledFunction<T> {
  /** 上次执行时间戳。 */
  let last = 0
  /** 尾触发定时器。 */
  let timer: ReturnType<typeof setTimeout> | null = null

  /** 包装后的节流函数。 */
  const wrapped = ((...args: Parameters<T>) => {
    /** 当前时间戳。 */
    const now = Date.now()
    /** 距离下一次可执行还剩余的毫秒数。 */
    const remain = wait - (now - last)

    if (remain <= 0) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      last = now
      fn(...args)
      return
    }

    if (!timer) {
      timer = setTimeout(() => {
        last = Date.now()
        timer = null
        fn(...args)
      }, remain)
    }
  }) as ThrottledFunction<T>

  wrapped.cancel = () => {
    if (timer) clearTimeout(timer)
    timer = null
  }
  return wrapped
}

/**
 * 将函数包装为仅执行一次。
 *
 * 首次执行后会缓存返回值，后续调用直接返回首次结果。
 *
 * @typeParam T 原始函数类型。
 * @param fn 原始函数。
 * @returns 仅可执行一次的包装函数。
 */
export function once<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
  /** 标记是否已执行。 */
  let called = false
  /** 缓存首次执行结果。 */
  let result: ReturnType<T>
  return (...args: Parameters<T>) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}
