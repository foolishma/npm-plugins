# CHANGELOG

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [0.0.1] - 2026-04-22

### 新增

- 首版发布，工程基础：
  - TypeScript 源码 + tsup 打包输出 ESM / CJS / `.d.ts`。
  - vitest 单元测试框架。
  - `sideEffects: false` + 分目录源码，支持 Tree-Shaking。
- `formatAmount(options)` 金额格式化：
  - 基于 options 对象入参：`amount / isDecimal / isThousand / decimalN / stripTrailingZeros / invalidText / locale`。
  - 新增 `stripTrailingZeros`：支持舍弃末尾 0（`1.20` → `1.2`；`1.00` → `1`）。
  - 新增 `invalidText`：`null` / `undefined` / 空串 / `NaN` 统一返回可配置占位（默认空串）。
  - 新增 `locale`：支持多地区千分符格式（默认 `zh-CN`）。
- 通用工具 `isInvalidValue`：统一判空逻辑，后续新增函数可复用。
