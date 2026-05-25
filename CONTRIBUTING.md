# Contributing

Thanks for considering a contribution.

## Local Setup

```bash
npm test
```

The packages are dependency-free and use Node's built-in test runner.

## Pull Requests

- Keep changes focused.
- Add or update tests for behavior changes.
- Update the relevant package README when user-facing behavior changes.
- Prefer clear error messages over clever abstractions.

## Project Fit

This repository favors small tools that:

- solve a common maintenance or data-cleaning task;
- run without network access by default;
- avoid runtime dependencies unless there is a strong reason;
- are useful as both CLIs and importable modules.
