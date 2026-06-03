# package-license-summary

## English

Summarize `license` fields from `package.json` files in a repository. It helps monorepo maintainers spot packages with missing or inconsistent license metadata.

### Usage

```bash
node packages/package-license-summary/bin/package-license-summary.js --root .
node packages/package-license-summary/bin/package-license-summary.js --root . --json
```

### API

```js
import { summarizePackageLicenses } from "package-license-summary";

const result = await summarizePackageLicenses({ root: "." });
```

## 中文

汇总仓库中 `package.json` 文件的 `license` 字段，帮助 monorepo 维护者发现缺失或不一致的许可证元数据。

### 用法

```bash
node packages/package-license-summary/bin/package-license-summary.js --root .
node packages/package-license-summary/bin/package-license-summary.js --root . --json
```

### API

```js
import { summarizePackageLicenses } from "package-license-summary";

const result = await summarizePackageLicenses({ root: "." });
```
