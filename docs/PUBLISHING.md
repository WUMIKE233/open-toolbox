# Publishing

This repository is ready to publish as a public GitHub project.

## Option 1: Push to an Empty GitHub Repository

Create an empty public repository on GitHub, then run:

```bash
git remote add origin https://github.com/<owner>/<repo>.git
git push -u origin main
```

## Option 2: Publish With the GitHub Connector

If the repository already exists, provide its `owner/repo` name. The project files can be uploaded through GitHub's contents API.

## Suggested Repository Settings

- Description: `Dependency-free CLI tools for open-source maintainers.`
- Visibility: public
- Topics: `cli`, `nodejs`, `markdown`, `jsonl`, `dotenv`, `maintainers`
- Default branch: `main`
- License: MIT
