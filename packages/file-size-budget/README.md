# file-size-budget

## English

Check files against a byte, KB, or MB budget. It helps keep fixtures, generated assets, and source files from quietly growing too large.

### Usage

```bash
node packages/file-size-budget/bin/file-size-budget.js --root . --max 200kb --ext js,md,json
node packages/file-size-budget/bin/file-size-budget.js --root . --max 1mb --json
```

### API

```js
import { checkFileSizeBudget } from "file-size-budget";

const result = await checkFileSizeBudget({ root: ".", maxBytes: "200kb" });
```

## 中文

按字节、KB 或 MB 预算检查文件大小。它可以防止 fixtures、生成资产和源文件在不知不觉中变得过大。

### 用法

```bash
node packages/file-size-budget/bin/file-size-budget.js --root . --max 200kb --ext js,md,json
node packages/file-size-budget/bin/file-size-budget.js --root . --max 1mb --json
```

### API

```js
import { checkFileSizeBudget } from "file-size-budget";

const result = await checkFileSizeBudget({ root: ".", maxBytes: "200kb" });
```
