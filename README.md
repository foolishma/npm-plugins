# com-utils

一个通用工具库，使用 TypeScript 编写，发布为 npm 包 `@dearcury/com-utils`。

## 安装

```bash
npm i @dearcury/com-utils
pnpm add @dearcury/com-utils
yarn add @dearcury/com-utils
```

## ESM 引入与使用

```ts
import { formatAmount } from '@dearcury/com-utils'

formatAmount({ amount: 1234567.89 })                      // "1,234,567.89"
formatAmount({ amount: 1234567.89, isDecimal: false })   // "1,234,568"
formatAmount({ amount: 1234567.89, isThousand: false })  // "1234567.89"
formatAmount({ amount: 1234567.891, decimalN: 3 })       // "1,234,567.891"
formatAmount({ amount: 1.2, stripTrailingZeros: true })  // "1.2"
formatAmount({ amount: 1, stripTrailingZeros: true })    // "1"
formatAmount({ amount: null })                            // ""
formatAmount({ amount: null, invalidText: '-' })         // "-"
formatAmount({ amount: 'abc' })                           // "" (NaN 视为无效值)
formatAmount({ amount: 1234567.89, locale: 'de-DE' })    // "1.234.567,89"
```

## API

### `formatAmount(options)`

| 字段                 | 类型                                    | 默认值    | 说明                                                    |
| -------------------- | --------------------------------------- | --------- | ------------------------------------------------------- |
| `amount`             | `number \| string \| null \| undefined` | —         | 待格式化金额                                            |
| `isDecimal`          | `boolean`                               | `true`    | 是否保留小数                                            |
| `isThousand`         | `boolean`                               | `true`    | 是否使用千分符                                          |
| `decimalN`           | `number`                                | `2`       | 保留的小数位数（仅 `isDecimal=true` 时生效）            |
| `stripTrailingZeros` | `boolean`                               | `false`   | 是否舍弃末尾 0（`1.20` -> `1.2`；`1.00` -> `1`）        |
| `invalidText`        | `string`                                | `''`      | 无效值（`null` / `undefined` / `''` / NaN）时的占位文本 |
| `locale`             | `string`                                | `'zh-CN'` | 千分符与小数点使用的地区格式                            |

返回值：`string`。

## License

[MIT](./LICENSE)
