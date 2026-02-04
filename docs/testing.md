# Testing

This project uses Node’s built-in test runner and runs tests against the compiled `dist/` output.

## Prerequisites

- Node.js >= 20.19
- pnpm

Install dependencies:

```bash
pnpm install
```

## Run the Full Test Suite

```bash
pnpm run test
```

This command builds the project first (`pnpm run build`) and then runs `node --test`.

## Run Lint + Tests

```bash
pnpm run lint
pnpm run test
```

## Run a Single Test File

```bash
node --test test/opsx-kit.test.mjs
```

## Notes

- Tests import from `dist/`, so `pnpm run build` must run before executing tests.
- The enhanced-mode CLI tests create a temporary project directory and verify:
  - `schema.yaml` is patched to insert `exploration` before `proposal`
  - `templates/exploration.md` is copied from `templates/exploration-template.md`
