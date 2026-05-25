# env-example-check

Compare `.env.example` with a local `.env` file or the current process environment. The tool reports missing required keys and extra local keys that are not documented in the example file.

## Usage

```bash
node packages/env-example-check/bin/env-example-check.js --example .env.example --env .env
node packages/env-example-check/bin/env-example-check.js --example .env.example --process
```

## API

```js
import { compareEnvText } from "env-example-check";

const result = compareEnvText("API_KEY=\n", "API_KEY=abc\n");
```
