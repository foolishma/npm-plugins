# com-utils

通用 TypeScript 工具函数库，发布包名：`@dearcury/com-utils`。

## 安装

```bash
npm i @dearcury/com-utils
pnpm add @dearcury/com-utils
yarn add @dearcury/com-utils
```

## 引入方式（ESM）

```ts
import {
  formatAmount,
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
} from '@dearcury/com-utils'
```

## API 文档

### formatAmount（金额格式化）

**签名**

```ts
formatAmount(options: FormatAmountOptions): string
```

**参数**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `options.amount` | `number \| string \| null \| undefined` | — | 待格式化金额 |
| `options.isDecimal` | `boolean` | `true` | 是否保留小数 |
| `options.isThousand` | `boolean` | `true` | 是否使用千分位分隔符 |
| `options.decimalN` | `number` | `2` | 小数位数（`isDecimal=true` 时生效） |
| `options.stripTrailingZeros` | `boolean` | `false` | 是否去除小数末尾 0 |
| `options.invalidText` | `string` | `''` | 无效值占位文本（`null/undefined/''/NaN`） |
| `options.locale` | `string` | `'zh-CN'` | 地区格式（影响千分符和小数点） |

**返回值**

- `string`：格式化后的金额字符串

**示例**

```ts
formatAmount({ amount: 1234567.89 })                     // "1,234,567.89"
formatAmount({ amount: 1234567.89, isDecimal: false })  // "1,234,568"
formatAmount({ amount: 1.2, stripTrailingZeros: true }) // "1.2"
formatAmount({ amount: null, invalidText: '-' })        // "-"
```

---

### maskString（字符串脱敏）

**签名**

```ts
maskString(value: string, options?: MaskStringOptions): string
```

**参数**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | — | 需要脱敏的字符串 |
| `options.startVisible` | `number` | `3` | 前缀保留可见字符数 |
| `options.endVisible` | `number` | `4` | 后缀保留可见字符数 |
| `options.maskChar` | `string` | `'*'` | 脱敏字符（只取首字符） |

**返回值**

- `string`：脱敏后的字符串

**示例**

```ts
maskString('13812345678') // "138****5678"
maskString('abcdefg', { startVisible: 1, endVisible: 1 }) // "a*****g"
```

---

### isBlank（空白字符串判断）

**签名**

```ts
isBlank(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 任意待判断值 |

**返回值**

- `boolean`：是否为空白字符串（仅字符串类型且 `trim()` 后为空）

**示例**

```ts
isBlank('   ') // true
isBlank('abc') // false
```

---

### groupBy（分组聚合）

**签名**

```ts
groupBy<T>(
  list: T[],
  selector: ((item: T) => string | number | symbol) | keyof T
): Record<string, T[]>
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `list` | `T[]` | 待分组数组 |
| `selector` | `((item: T) => string \| number \| symbol) \| keyof T` | 分组规则（字段名或回调） |

**返回值**

- `Record<string, T[]>`：按分组键聚合后的对象

**示例**

```ts
groupBy(
  [
    { type: 'a', value: 1 },
    { type: 'b', value: 2 },
    { type: 'a', value: 3 }
  ],
  'type'
)
// { a: [{...}, {...}], b: [{...}] }
```

---

### deepClone（深拷贝）

**签名**

```ts
deepClone<T>(input: T): T
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `input` | `T` | 待拷贝数据 |

**返回值**

- `T`：深拷贝结果（支持对象、数组、Map、Set、Date、RegExp，并处理循环引用）

**示例**

```ts
const source = { a: 1, nested: { b: [1, 2, 3] } }
const cloned = deepClone(source)
cloned.nested.b.push(4)
```

---

### isEmail（邮箱校验）

**签名**

```ts
isEmail(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值 |

**返回值**

- `boolean`：是否为合法邮箱格式

**示例**

```ts
isEmail('test@example.com') // true
isEmail('bad-email') // false
```

---

### isPhoneCN（中国大陆手机号校验）

**签名**

```ts
isPhoneCN(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值，支持字符串或数字 |

**返回值**

- `boolean`：是否为合法中国大陆手机号（支持 `+86` 前缀）

**示例**

```ts
isPhoneCN('13812345678') // true
isPhoneCN('+8613812345678') // true
```

---

### isIDCardCN（中国大陆身份证校验）

**签名**

```ts
isIDCardCN(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值 |

**返回值**

- `boolean`：是否为合法 18 位中国大陆身份证号

**示例**

```ts
isIDCardCN('11010519491231002X') // true
isIDCardCN('110105194912310021') // false
```

---

### isUrl（URL 校验）

**签名**

```ts
isUrl(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值 |

**返回值**

- `boolean`：是否为合法 URL（仅允许 `http/https`）

**示例**

```ts
isUrl('https://example.com/path') // true
isUrl('ftp://example.com') // false
```

---

### isNumberLike（数字样式值判断）

**签名**

```ts
isNumberLike(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值 |

**返回值**

- `boolean`：是否可解析为有效有限数字

**示例**

```ts
isNumberLike('12.3') // true
isNumberLike('abc') // false
```

---

### isEmptyValue（空值判断）

**签名**

```ts
isEmptyValue(value: unknown): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `value` | `unknown` | 待判断值 |

**返回值**

- `boolean`：是否为空值（`null` / `undefined` / `''` / `NaN`）

**示例**

```ts
isEmptyValue(undefined) // true
isEmptyValue(NaN) // true
isEmptyValue(0) // false
```

---

### parseQuery（查询字符串解析）

**签名**

```ts
parseQuery(input: string): Record<string, string | string[]>
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `input` | `string` | URL 或 query 字符串 |

**返回值**

- `Record<string, string | string[]>`：解析结果；重复 key 聚合为数组

**示例**

```ts
parseQuery('?a=1&b=2&b=3')
// { a: '1', b: ['2', '3'] }
```

---

### getFileExt（文件扩展名获取）

**签名**

```ts
getFileExt(pathOrName: string): string
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `pathOrName` | `string` | 文件名、路径或 URL |

**返回值**

- `string`：扩展名（小写，不含 `.`）；无扩展名时返回空串

**示例**

```ts
getFileExt('https://x.com/path/demo.TS?x=1') // "ts"
getFileExt('README') // ""
```

---

### downloadBlob（浏览器 Blob 下载）

**签名**

```ts
downloadBlob(blob: Blob, filename: string): boolean
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `blob` | `Blob` | 待下载二进制对象 |
| `filename` | `string` | 下载文件名 |

**返回值**

- `boolean`：是否触发下载流程（非浏览器环境返回 `false`）

**示例**

```ts
downloadBlob(new Blob(['hello'], { type: 'text/plain' }), 'demo.txt')
```

---

### copyToClipboard（复制到剪贴板）

**签名**

```ts
copyToClipboard(text: string): Promise<boolean>
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `text` | `string` | 待复制文本 |

**返回值**

- `Promise<boolean>`：复制是否成功（优先 `navigator.clipboard`，失败自动降级）

**示例**

```ts
await copyToClipboard('hello world')
```

---

### debounce（防抖）

**签名**

```ts
debounce<T extends (...args: any[]) => unknown>(
  fn: T,
  wait?: number
): DebouncedFunction<T>
```

**参数**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fn` | `T` | — | 待防抖函数 |
| `wait` | `number` | `300` | 延迟执行时间（毫秒） |

**返回值**

- `DebouncedFunction<T>`：防抖函数，包含 `cancel()` 方法

**示例**

```ts
const onSearch = debounce((keyword: string) => {
  console.log(keyword)
}, 300)
```

---

### throttle（节流）

**签名**

```ts
throttle<T extends (...args: any[]) => unknown>(
  fn: T,
  wait?: number
): ThrottledFunction<T>
```

**参数**

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fn` | `T` | — | 待节流函数 |
| `wait` | `number` | `300` | 触发间隔（毫秒） |

**返回值**

- `ThrottledFunction<T>`：节流函数，包含 `cancel()` 方法

**示例**

```ts
const onScroll = throttle(() => {
  console.log('scroll')
}, 200)
```

---

### once（只执行一次）

**签名**

```ts
once<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T>
```

**参数**

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `fn` | `T` | 只允许执行一次的函数 |

**返回值**

- `(...args: Parameters<T>) => ReturnType<T>`：包装函数，首次执行后缓存返回值

**示例**

```ts
const init = once(() => {
  console.log('init')
  return 1
})
```

## 自动发版（CI/CD）

项目已配置自动发版流程：每次推送到 `main` 分支都会触发版本递增与 npm 发布。

- 工作流文件：`.github/workflows/release.yml`
- 必需密钥：`NPM_TOKEN`（GitHub Repository Secrets）

## License

[MIT](./LICENSE)
