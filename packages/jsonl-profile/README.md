# jsonl-profile

## English

Profile JSON Lines files and summarize line counts, parse errors, field coverage, and observed value types.

### Usage

```bash
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl --json
```

### API

```js
import { profileJsonlFile } from "jsonl-profile";

const profile = await profileJsonlFile("./events.jsonl");
```

## 中文

分析 JSON Lines 文件，汇总行数、解析错误、字段覆盖率以及观察到的值类型。

### 用法

```bash
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl --json
```

### API

```js
import { profileJsonlFile } from "jsonl-profile";

const profile = await profileJsonlFile("./events.jsonl");
```
