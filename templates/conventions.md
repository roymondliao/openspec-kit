# Development Conventions

This document defines the development philosophy and high-level conventions for this project. AI assistants should follow these conventions when implementing or modifying code.

---

## Purpose & Scope

This document captures the project's development philosophy and high-level conventions.

It MUST NOT define:
- Tooling choices, versions, or commands (see `tech-stack.md`)
- Repository layout, module boundaries, API contracts, error formats, or security/performance architecture (see `architecture.md`)

## Development Philosophy

### TDD Loop (Red / Green / Refactor)

- **Red**: Write a failing test for exactly one behavior. The failure reason MUST be clear and relevant to the requirement.
- **Green**: Implement the smallest change to pass the test. Avoid speculative design and unnecessary abstractions.
- **Refactor**: Keep all tests green while improving names, structure, and removing duplication without changing behavior.

### Incremental Delivery

- Prefer small, reviewable changes over large rewrites.
- Do not introduce abstractions until at least two concrete use cases exist.

## Design Principles

- Follow SOLID principles as a default. In practice, prefer single-purpose modules, clear interfaces, and testable dependencies.
- Aim for high cohesion within modules and low coupling between modules.
- Keep side effects (I/O) at the edges. Core logic SHOULD be deterministic and easy to test.
- Prefer explicit dependencies and clear ownership boundaries.

## Code Readability Principles

- Names SHOULD reflect domain intent. Avoid unclear abbreviations.
- Functions SHOULD do one thing. Extract helper functions before adding branches.
- Public interfaces MUST be documented in a project-appropriate format.
- Prefer typed interfaces where the language supports it.

## Definition of Done (Conceptual)

- The change is covered by automated tests for the intended behavior.
- The design is simpler than or equal to before (no unnecessary new abstractions).
- A future reader can understand the change without external context.

---


## References

- `tech-stack.md` - Tooling choices, languages, frameworks, and versions
- `architecture.md` - Repository layout, module boundaries, API contracts, error handling, security, and performance strategies

---

## Notes for AI Assistants

When implementing or modifying code:

1. Ask 1-2 clarifying questions if requirements or constraints are ambiguous.
2. Follow the TDD loop (Red / Green / Refactor) and avoid speculative features.
3. Do not introduce new tools or dependencies. Use what is defined in `tech-stack.md`.
4. Place new code according to `architecture.md` boundaries and module ownership.
5. Keep changes small and readable; refactor only when tests are green.
