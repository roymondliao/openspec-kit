## Context

We want a CLI helper that scaffolds Enhanced Mode by forking `spec-driven`, copying the exploration template, and patching the forked schema to insert `exploration` before `proposal`. This should be a lightweight addition to the existing `opsx-kit` CLI without changing OpenSpec core behavior.

## Goals / Non-Goals

**Goals:**
- Add a CLI command that creates or updates a custom schema fork with a user-defined name.
- Automate copying `templates/exploration-template.md` into the forked schema as `templates/exploration.md`.
- Update the forked `schema.yaml` so `proposal` depends on `exploration`.
- Provide clear usage and safe handling when the target schema already exists.

**Non-Goals:**
- Modifying the built-in `spec-driven` schema in place.
- Introducing new OpenSpec runtime behavior or plugin systems.
- Changing proposal/spec/design/tasks content requirements.

## Decisions

- **Command shape:** Add an `opsx-kit enhanced init` (or equivalent) command that accepts a schema name argument (defaulting to a recommended name if omitted).
- **Schema source:** Use OpenSpec’s recommended flow by forking `spec-driven` into `<my-workflow>` before applying changes.
- **Patch strategy:** Insert a new `exploration` artifact and set `proposal` to require it; keep other artifacts untouched.
- **Template source:** Reuse `templates/exploration-template.md` as the canonical template for `exploration.md`.

## Risks / Trade-offs

- **Existing schema conflicts** → If target exists, decide whether to patch in-place or require an explicit `--force`/`--update` flag.
- **Schema format drift** → Keep the patch logic minimal and targeted to avoid breaking future schema changes.
- **User confusion on naming** → Document that `<my-workflow>` is user-defined with examples.

## Migration Plan

- Implement the CLI command and update documentation in the same release.
- Existing users can keep manual steps; new users can adopt the CLI helper.

## Open Questions

- Should the CLI prompt before overwriting an existing `schema.yaml`?
  > No, it is a costomization schema.
- Do we want a default schema name (e.g., `exploration-first`) if none is provided?
  > Sure.
