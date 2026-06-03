# changelog-fragment-check

## English

Check that changelog fragments use allowed categories. This is useful for projects that collect small release-note files before generating a full changelog.

### Usage

```bash
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes --categories added,fixed,changed
```

### API

```js
import { checkChangelogFragments } from "changelog-fragment-check";

const result = await checkChangelogFragments({
  directory: ".changes",
  categories: ["added", "fixed"]
});
```

## 中文

检查 changelog 片段是否使用允许的分类。它适合那些先收集小型发布说明文件，再生成完整 changelog 的项目。

### 用法

```bash
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes
node packages/changelog-fragment-check/bin/changelog-fragment-check.js --dir .changes --categories added,fixed,changed
```

### API

```js
import { checkChangelogFragments } from "changelog-fragment-check";

const result = await checkChangelogFragments({
  directory: ".changes",
  categories: ["added", "fixed"]
});
```
