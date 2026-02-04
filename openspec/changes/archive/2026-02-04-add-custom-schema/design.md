## Context

We need to capture the Enhanced Mode workflow in a way that matches OpenSpec’s recommended usage: fork `spec-driven`, then insert an `exploration` artifact before `proposal`. The change is documentation-led and should keep the rest of the workflow compatible with existing OpenSpec tooling and schema resolution.

## Goals / Non-Goals

**Goals:**
- Document a repeatable Enhanced Mode setup based on `openspec schema fork spec-driven <my-workflow>`.
- Ensure the exploration template from `templates/exploration-template.md` is added to the forked schema.
- Specify the artifact ordering so `proposal` depends on `exploration` without changing proposal content.

**Non-Goals:**
- Introducing new CLI commands or automations.
- Modifying OpenSpec core behavior or built-in schemas.

## Decisions

- **Use a user-defined schema name (`<my-workflow>`).**
  This keeps the instructions flexible and avoids hard-coding a new schema name in the repo.
- **Base Enhanced Mode on a `spec-driven` fork.**
  This aligns with OpenSpec’s recommended workflow and preserves standard artifacts (proposal/specs/design/tasks).
- **Insert `exploration` before `proposal`.**
  The `proposal` artifact requires `exploration`, ensuring exploration happens first while leaving proposal content unchanged.
- **Reuse the existing exploration template.**
  Copy `templates/exploration-template.md` into the forked schema as `templates/exploration.md` to keep structure consistent.

## Risks / Trade-offs

- **Docs drift from actual schema fork output** → Keep the steps explicit and minimal, and avoid assumptions about built-in schema contents.
- **User confusion about naming** → Explicitly note `<my-workflow>` is user-defined and show examples.

## Migration Plan

- Update documentation only. No code or runtime behavior changes are required.
- Users can adopt the enhanced workflow by forking the schema and setting `schema: <my-workflow>` in `openspec/config.yaml`.

## Open Questions

- Should we add an optional CLI helper to automate the fork + template copy + schema edit steps?
