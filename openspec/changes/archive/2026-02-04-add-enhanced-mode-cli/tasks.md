## 1. CLI command scaffolding

- [x] 1.1 Define the enhanced-mode CLI command signature (name + args + options)
- [x] 1.2 Add command registration in `src/cli.ts`
- [x] 1.3 Implement command handler to resolve project/schema paths and validate inputs

## 2. Schema fork and template setup

- [x] 2.1 Implement schema fork workflow from `spec-driven` to `<my-workflow>`
- [x] 2.2 Copy `templates/exploration-template.md` to `schemas/<my-workflow>/templates/exploration.md`
- [x] 2.3 Patch `schema.yaml` to insert `exploration` before `proposal`

## 3. Existing schema updates

- [x] 3.1 Support updating an existing schema directory without touching `spec-driven`
- [x] 3.2 Add safety checks or flags for overwrite behavior (per design)

## 4. Documentation and tests

- [x] 4.1 Update docs to reference the CLI workflow for Enhanced Mode
- [x] 4.2 Add tests for the new command and schema patching
