# md-external-link-report

## English

Report external HTTP(S) links from Markdown files without making network requests. It is useful when maintainers want a quick inventory of documentation links before audits, migrations, or release checks.

### Usage

```bash
node packages/md-external-link-report/bin/md-external-link-report.js --root .
node packages/md-external-link-report/bin/md-external-link-report.js --root . --json
```

### API

```js
import { reportExternalMarkdownLinks } from "md-external-link-report";

const result = await reportExternalMarkdownLinks({ root: "." });
```

## 中文

统计 Markdown 文件中的外部 HTTP(S) 链接，但不会发起网络请求。它适合在文档审计、迁移或发布检查前，快速整理仓库里的外链清单。

### 用法

```bash
node packages/md-external-link-report/bin/md-external-link-report.js --root .
node packages/md-external-link-report/bin/md-external-link-report.js --root . --json
```

### API

```js
import { reportExternalMarkdownLinks } from "md-external-link-report";

const result = await reportExternalMarkdownLinks({ root: "." });
```
