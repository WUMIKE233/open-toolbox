# repo-todo-scan

Scan repositories for `TODO`, `FIXME`, and optional `NOTE` maintenance comments. It is useful before releases, handoffs, and issue grooming.

## Usage

```bash
node packages/repo-todo-scan/bin/repo-todo-scan.js --root .
node packages/repo-todo-scan/bin/repo-todo-scan.js --root . --include-note --json
```

## API

```js
import { scanTodos } from "repo-todo-scan";

const result = await scanTodos({ root: ".", includeNote: true });
```
