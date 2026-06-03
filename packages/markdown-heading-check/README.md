# markdown-heading-check

## English

Check Markdown headings for skipped levels and duplicates. It ignores headings inside fenced code blocks and is useful for documentation CI.

### Usage

```bash
node packages/markdown-heading-check/bin/markdown-heading-check.js --root .
node packages/markdown-heading-check/bin/markdown-heading-check.js --root docs --json
```

### API

```js
import { checkMarkdownHeadings } from "markdown-heading-check";

const result = await checkMarkdownHeadings({ root: "." });
```

## 中文

检查 Markdown 标题是否跳级或重复。它会忽略代码围栏中的标题，适合放进文档 CI。

### 用法

```bash
node packages/markdown-heading-check/bin/markdown-heading-check.js --root .
node packages/markdown-heading-check/bin/markdown-heading-check.js --root docs --json
```

### API

```js
import { checkMarkdownHeadings } from "markdown-heading-check";

const result = await checkMarkdownHeadings({ root: "." });
```
