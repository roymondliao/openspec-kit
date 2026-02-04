# enhanced-mode-cli Specification

## Purpose
TBD - created by archiving change add-enhanced-mode-cli. Update Purpose after archive.
## Requirements
### Requirement: Scaffold enhanced schema from spec-driven
The CLI SHALL create or update a custom schema forked from `spec-driven` using a user-defined schema name.

#### Scenario: Creating a new enhanced schema
- **WHEN** a user runs the enhanced-mode CLI with a new schema name
- **THEN** a schema directory is created at `openspec/schemas/<my-workflow>/` with the forked contents

### Requirement: Copy exploration template into schema
The CLI SHALL copy `templates/exploration-template.md` into the forked schema as `templates/exploration.md`.

#### Scenario: Injecting exploration template
- **WHEN** the enhanced-mode CLI runs after forking the schema
- **THEN** `openspec/schemas/<my-workflow>/templates/exploration.md` exists with the exploration template content

### Requirement: Insert exploration before proposal
The CLI SHALL update the forked `schema.yaml` so the `proposal` artifact requires `exploration` and the exploration artifact is present.

#### Scenario: Ordering exploration before proposal
- **WHEN** the enhanced-mode CLI patches `schema.yaml`
- **THEN** the `exploration` artifact exists and `proposal` lists `requires: [exploration]`

### Requirement: Handle existing schemas safely
The CLI SHALL allow updating an existing custom schema without modifying built-in schemas.

#### Scenario: Updating an existing enhanced schema
- **WHEN** the enhanced-mode CLI targets a schema that already exists
- **THEN** it updates the exploration template and schema ordering without touching `spec-driven`

