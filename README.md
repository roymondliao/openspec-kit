# OpenSpec-Kit

Project-scoped helpers for OpenSpec context templates. This package provides a lightweight CLI that scaffolds template files and injects them into `openspec/config.yaml` so AI assistants have consistent project context.

> **Prerequisite:** Install OpenSpec first: https://github.com/Fission-AI/OpenSpec

## Install

```bash
pnpm add -D openspec-kit
```

## Usage

```bash
# Scaffold templates into openspec/ (copies from the package templates/ directory)
pnpm exec opsx-kit init

# Inject template content into openspec/config.yaml
pnpm exec opsx-kit update

# Scaffold an enhanced workflow schema (fork spec-driven + exploration)
pnpm exec opsx-kit enhanced init <my-workflow>
```

## Commands

### `opsx-kit init`

Scaffold blank template files for editing.

**Options**:

- `--dir <target>`: Target directory for scaffolded files (default: `<project>/openspec`)
- `--project <dir>`: Project root used to locate `openspec/` (default: current working directory)
- `--files <list>`: Comma-separated list of files to initialize (default: all)

**Example**:

```bash
pnpm exec opsx-kit init --dir ./docs
pnpm exec opsx-kit init --files tech-stack,conventions
```

### `opsx-kit update`

Inject template content into `openspec/config.yaml`.

**Options**:

- `--files <list>`: Comma-separated list of files to inject (valid: `tech-stack`, `conventions`, `architecture`)
- `--source <dir>`: Source directory containing filled-in templates
- `--project <dir>`: Project root used to locate `openspec/` (default: current working directory)

**Example**:

```bash
pnpm exec opsx-kit update --files tech-stack,conventions
```

### `opsx-kit enhanced init`

Scaffold an enhanced workflow schema by forking `spec-driven`, copying the exploration
template, and patching `schema.yaml` so exploration happens before proposal.

**Options**:

- `[schema]`: Optional schema name (defaults to `exploration-first`)
- `--schema <name>`: Schema name (overrides positional argument)
- `--project <dir>`: Project root used to locate `openspec/` (default: current working directory)

**Example**:

```bash
pnpm exec opsx-kit enhanced init exploration-first
```

## Workflow

```bash
pnpm exec opsx-kit init
# Edit openspec/tech-stack.md, openspec/conventions.md, openspec/architecture.md
pnpm exec opsx-kit update
```

## Environment Variables

- `OPENSPEC_TEMPLATE_DIR`: Default source directory for `update` when `--source` is not provided.

## Notes

- `update` preserves the existing `schema:` value and any `rules:` section in `openspec/config.yaml`.
- Templates are shipped inside the package under `templates/`.

## Testing

See [docs/testing.md](./docs/testing.md) for the test workflow.
