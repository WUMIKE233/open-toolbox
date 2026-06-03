# package-entrypoint-check

[English](#english) | [中文](#中文)

## English

Check `package.json` entrypoint declarations across a repository and report missing files before they break publish or runtime flows.

### What It Checks

- `main`
- `module`
- `types`
- `bin`
- relative file targets inside `exports`

### Usage

```bash
node packages/package-entrypoint-check/bin/package-entrypoint-check.js --root .
node packages/package-entrypoint-check/bin/package-entrypoint-check.js --root . --json
```

The CLI exits with code `1` when any declared entrypoint is missing.

### API

```js
import { checkPackageEntrypoints } from "package-entrypoint-check";

const result = await checkPackageEntrypoints({ root: "." });
```

## 中文

检查仓库里的 `package.json` 入口声明，在发布前或运行前提前发现缺失文件。

### 检查范围

- `main`
- `module`
- `types`
- `bin`
- `exports` 中指向相对路径的文件目标

### 用法

```bash
node packages/package-entrypoint-check/bin/package-entrypoint-check.js --root .
node packages/package-entrypoint-check/bin/package-entrypoint-check.js --root . --json
```

只要发现缺失入口文件，CLI 就会以退出码 `1` 结束。

### API

```js
import { checkPackageEntrypoints } from "package-entrypoint-check";

const result = await checkPackageEntrypoints({ root: "." });
```
