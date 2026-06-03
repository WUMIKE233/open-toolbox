# env-example-check

## English

Compare `.env.example` with a local `.env` file or the current process environment. The tool reports missing required keys and extra local keys that are not documented in the example file.

### Usage

```bash
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
node packages/env-example-check/bin/env-example-check.js --example .env.example --process
```

### API

```js
import { compareEnvText } from "env-example-check";

const result = compareEnvText("API_KEY=\n", "API_KEY=abc\n");
```

## 中文

对比 `.env.example` 与本地 `.env` 文件或当前进程环境变量。工具会报告缺失的必需键，以及未写入示例文件的额外本地键。

### 用法

```bash
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
node packages/env-example-check/bin/env-example-check.js --example .env.example --process
```

### API

```js
import { compareEnvText } from "env-example-check";

const result = compareEnvText("API_KEY=\n", "API_KEY=abc\n");
```
