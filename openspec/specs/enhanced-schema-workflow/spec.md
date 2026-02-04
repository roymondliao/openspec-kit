# enhanced-schema-workflow Specification

## Purpose
TBD - created by archiving change add-custom-schema. Update Purpose after archive.
## Requirements
### Requirement: User-defined enhanced schema fork
The workflow SHALL allow users to fork the `spec-driven` schema into a user-defined schema name (e.g., `<my-workflow>`) for Enhanced Mode usage.

#### Scenario: Forking a custom schema
- **WHEN** a user runs `openspec schema fork spec-driven <my-workflow>`
- **THEN** a new schema directory for `<my-workflow>` is created under `openspec/schemas/` (or user-level schema path)

### Requirement: Exploration artifact inserted before proposal
The enhanced schema SHALL include an `exploration` artifact that is required before `proposal`, and SHALL use the exploration template copied from `templates/exploration-template.md`.

#### Scenario: Exploration precedes proposal
- **WHEN** the enhanced schema’s `schema.yaml` declares `proposal` requires `exploration`
- **THEN** `/opsx:continue` creates `exploration.md` before `proposal.md` in the change folder

### Requirement: Project can adopt enhanced schema by configuration
Projects SHALL be able to activate the enhanced schema by setting `schema: <my-workflow>` in `openspec/config.yaml` and using the schema for new changes.

#### Scenario: Using the enhanced schema for a new change
- **WHEN** `openspec new change <name> --schema <my-workflow>` is executed
- **THEN** the change is created using the enhanced schema’s artifact order and templates

