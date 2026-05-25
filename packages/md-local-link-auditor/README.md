# md-local-link-auditor

Scan Markdown files and report broken local links. Remote links, email links, and pure anchors are ignored so the tool stays fast and offline-friendly.

## Usage

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root docs --json
```

## API

```js
import { auditMarkdownLinks } from "md-local-link-auditor";

const result = await auditMarkdownLinks({ root: process.cwd() });
```
