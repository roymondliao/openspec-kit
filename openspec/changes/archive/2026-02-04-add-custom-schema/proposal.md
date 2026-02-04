## Why

We need a clear, repeatable Enhanced Mode workflow that follows OpenSpec’s recommended path: fork the default `spec-driven` schema, then insert an `exploration` phase before `proposal`. This gives teams a structured exploration step and keeps the rest of the flow unchanged and compatible with existing OpenSpec tooling.

## What Changes

- Document the Enhanced Mode setup as a `spec-driven` fork using a user-defined schema name (e.g., `<my-workflow>`).
- Add the exploration template from `templates/exploration-template.md` into the forked schema’s templates.
- Update the forked `schema.yaml` to insert `exploration` before `proposal` (`proposal` requires `exploration`).
- Clarify usage and directory structure so teams can adopt the custom schema without changing core tooling.

## Capabilities

### New Capabilities
- `enhanced-schema-workflow`: Define a custom schema forked from `spec-driven` that adds an `exploration` artifact before `proposal`, using the exploration template as the structured pre-proposal step.

### Modified Capabilities
- _None_

## Impact

- Documentation: `docs/design_concept.md` and related guidance reflect the fork-and-insert flow with `<my-workflow>` as a user-defined schema name.
- Schema assets: the forked schema will include `templates/exploration.md` and updated artifact order.
- Workflow usage: teams can set `schema: <my-workflow>` in `openspec/config.yaml` without altering OpenSpec core behavior.
