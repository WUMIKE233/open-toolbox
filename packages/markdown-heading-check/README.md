# markdown-heading-check

Check Markdown headings for skipped levels and duplicates. It ignores headings inside fenced code blocks and is useful for documentation CI.

## Usage

```bash
node packages/markdown-heading-check/bin/markdown-heading-check.js --root .
node packages/markdown-heading-check/bin/markdown-heading-check.js --root docs --json
```

## API

```js
import { checkMarkdownHeadings } from "markdown-heading-check";

const result = await checkMarkdownHeadings({ root: "." });
```
