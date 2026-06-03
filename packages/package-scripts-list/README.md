# package-scripts-list

## English

List `package.json` scripts across a repository. The output is handy when documenting monorepos or auditing which packages expose build, test, or release commands.

### Usage

```bash
node packages/package-scripts-list/bin/package-scripts-list.js --root .
node packages/package-scripts-list/bin/package-scripts-list.js --root . --json
```

### API

```js
import { listPackageScripts } from "package-scripts-list";

const packages = await listPackageScripts({ root: "." });
```

## 中文

列出仓库中各个 `package.json` 的 scripts。它适合编写 monorepo 文档，或审计哪些包暴露了构建、测试、发布命令。

### 用法

```bash
node packages/package-scripts-list/bin/package-scripts-list.js --root .
node packages/package-scripts-list/bin/package-scripts-list.js --root . --json
```

### API

```js
import { listPackageScripts } from "package-scripts-list";

const packages = await listPackageScripts({ root: "." });
```
