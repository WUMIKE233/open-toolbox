# repo-language-stats

## English

Summarize repository files, bytes, and line counts by language. It skips common build folders and ignores binary-looking files.

### Usage

```bash
node packages/repo-language-stats/bin/repo-language-stats.js --root .
node packages/repo-language-stats/bin/repo-language-stats.js --root . --json
```

### API

```js
import { collectRepoLanguageStats } from "repo-language-stats";

const result = await collectRepoLanguageStats({ root: "." });
```

## 中文

按语言汇总仓库中的文件数、字节数和行数。它会跳过常见构建目录，并忽略看起来像二进制内容的文件。

### 用法

```bash
node packages/repo-language-stats/bin/repo-language-stats.js --root .
node packages/repo-language-stats/bin/repo-language-stats.js --root . --json
```

### API

```js
import { collectRepoLanguageStats } from "repo-language-stats";

const result = await collectRepoLanguageStats({ root: "." });
```
