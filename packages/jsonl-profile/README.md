# jsonl-profile

Profile JSON Lines files and summarize line counts, parse errors, field coverage, and observed value types.

## Usage

```bash
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl
node packages/jsonl-profile/bin/jsonl-profile.js ./events.jsonl --json
```

## API

```js
import { profileJsonlFile } from "jsonl-profile";

const profile = await profileJsonlFile("./events.jsonl");
```
