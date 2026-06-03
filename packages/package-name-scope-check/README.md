# package-name-scope-check

## English

Check `package.json` names against an expected npm scope or package-name prefix. It helps monorepo maintainers catch accidental naming drift before publishing.

### Usage

```bash
node packages/package-name-scope-check/bin/package-name-scope-check.js --root . --scope @acme
node packages/package-name-scope-check/bin/package-name-scope-check.js --root . --prefix acme- --json
```

### API

```js
import { checkPackageNameScope } from "package-name-scope-check";

const result = await checkPackageNameScope({ root: ".", scope: "@acme" });
```

## 中文

检查 `package.json` 的包名是否符合预期的 npm scope 或包名前缀，帮助 monorepo 维护者在发布前发现命名漂移。

### 用法

```bash
node packages/package-name-scope-check/bin/package-name-scope-check.js --root . --scope @acme
node packages/package-name-scope-check/bin/package-name-scope-check.js --root . --prefix acme- --json
```

### API

```js
import { checkPackageNameScope } from "package-name-scope-check";

const result = await checkPackageNameScope({ root: ".", scope: "@acme" });
```
