# repo-todo-scan

## English

Scan repositories for `TODO`, `FIXME`, and optional `NOTE` maintenance comments. It is useful before releases, handoffs, and issue grooming.

### Usage

```bash
node packages/repo-todo-scan/bin/repo-todo-scan.js --root .
node packages/repo-todo-scan/bin/repo-todo-scan.js --root . --include-note --json
```

### API

```js
import { scanTodos } from "repo-todo-scan";

const result = await scanTodos({ root: ".", includeNote: true });
```

## 中文

扫描仓库中的 `TODO`、`FIXME`，以及可选的 `NOTE` 维护注释。它适合在发布、交接和整理 issue 前使用。

### 用法

```bash
node packages/repo-todo-scan/bin/repo-todo-scan.js --root .
node packages/repo-todo-scan/bin/repo-todo-scan.js --root . --include-note --json
```

### API

```js
import { scanTodos } from "repo-todo-scan";

const result = await scanTodos({ root: ".", includeNote: true });
```
