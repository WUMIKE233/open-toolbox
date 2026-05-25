# file-size-budget

Check files against a byte, KB, or MB budget. It helps keep fixtures, generated assets, and source files from quietly growing too large.

## Usage

```bash
node packages/file-size-budget/bin/file-size-budget.js --root . --max 200kb --ext js,md,json
node packages/file-size-budget/bin/file-size-budget.js --root . --max 1mb --json
```

## API

```js
import { checkFileSizeBudget } from "file-size-budget";

const result = await checkFileSizeBudget({ root: ".", maxBytes: "200kb" });
```
