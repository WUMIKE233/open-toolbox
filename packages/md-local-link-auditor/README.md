# md-local-link-auditor

## English

Scan Markdown files and report broken local links. Remote links, email links, and pure anchors are ignored so the tool stays fast and offline-friendly.

### Usage

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root docs --json
```

### API

```js
import { auditMarkdownLinks } from "md-local-link-auditor";

const result = await auditMarkdownLinks({ root: process.cwd() });
```

## 中文

扫描 Markdown 文件并报告失效的本地链接。远程链接、邮件链接和纯锚点会被忽略，因此工具运行很快，也适合离线使用。

### 用法

```bash
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root .
node packages/md-local-link-auditor/bin/md-local-link-auditor.js --root docs --json
```

### API

```js
import { auditMarkdownLinks } from "md-local-link-auditor";

const result = await auditMarkdownLinks({ root: process.cwd() });
```
