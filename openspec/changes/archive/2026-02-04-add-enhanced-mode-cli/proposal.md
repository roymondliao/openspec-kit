## Why

We need a first-class CLI flow to help teams adopt Enhanced Mode quickly and consistently. The manual steps (fork `spec-driven`, copy the exploration template, and insert `exploration` before `proposal`) are easy to get wrong; a CLI helper ensures a repeatable, discoverable setup without changing OpenSpec core behavior.

## What Changes

- Add a CLI command to scaffold an Enhanced Mode schema fork from `spec-driven` with a user-defined schema name.
- Automate copying `templates/exploration-template.md` into the forked schema as `templates/exploration.md`.
- Patch the forked `schema.yaml` to insert `exploration` before `proposal` (proposal requires exploration).
- Provide clear CLI usage and error handling for existing schema directories.

## Capabilities

### New Capabilities
- `enhanced-mode-cli`: Provide a CLI command that creates or updates a custom schema fork (from `spec-driven`) and injects the exploration artifact/template so exploration precedes proposal.

### Modified Capabilities
- _None_

## Impact

- CLI: new command entry, parsing, and filesystem operations for schema scaffolding.
- Schema assets: ensure exploration template is copied and schema ordering is updated.
- Documentation: update usage guidance to point to the CLI flow.
