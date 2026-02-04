# Changesets

This folder contains changeset files that describe user-facing changes.

## Usage

- Create a changeset for each PR that should bump the version:
  ```bash
  pnpm changeset
  ```
- Apply versions locally when you're ready to release:
  ```bash
  pnpm version-packages
  ```
- Push the version bump commit, then create a tag (e.g. v0.1.1) to trigger release.
