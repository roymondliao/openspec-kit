# OpenSpec-Kit Architecture

This document describes how to implement Reference Mode and Enhanced Mode using OPSX's native features — Custom Schemas and project configuration. No fork, no plugin system, no code changes required.

---

## Background

The original design proposed a plugin system to extend OpenSpec with Reference Mode (project context injection) and Enhanced Mode (structured exploration before proposal). After analyzing the OPSX workflow architecture, we concluded that both modes can be fully implemented using OPSX's existing extension mechanisms.

### Why No Plugin System

| Original Plugin Feature            | OPSX Native Solution                             |
| ---------------------------------- | ------------------------------------------------ |
| Reference Mode init hook           | Manual `config.yaml` editing (or shell script) |
| Enhanced Mode exploration workflow | Custom Schema with `exploration` artifact      |
| APPROVED status gate               | User controls when to run `/opsx:continue`     |
| Dependency enforcement             | Artifact Graph DAG (`requires: []`)            |
| Template injection                 | Schema `templates/` directory                  |

The plugin system was designed before understanding OPSX's capabilities. OPSX already provides the extensibility needed.

---

## OPSX Architecture (Relevant Components)

### Schema System

```
Schema Resolution Order:
  1. Project-local:   openspec/schemas/<name>/schema.yaml
  2. User-level:      ~/.local/share/openspec/schemas/<name>/schema.yaml
  3. Package built-in: <npm-package>/schemas/<name>/schema.yaml
```

Each schema contains artifact definitions (DAG), instructions, and markdown templates:

```
schemas/<name>/
├── schema.yaml          # Artifacts + dependencies + instructions
└── templates/           # Per-artifact markdown templates
```

### Workflow Commands

| Command            | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `/opsx:explore`  | Free-form thinking mode (AI skill, no file output) |
| `/opsx:new`      | Create change folder + scaffold                    |
| `/opsx:continue` | Create the next READY artifact                     |
| `/opsx:ff`       | Create all planning artifacts in DAG order         |
| `/opsx:apply`    | Implement tasks                                    |
| `/opsx:archive`  | Archive completed change                           |

### State Detection

Artifact completion is **filesystem-based**: file exists = DONE. No content-level checks. This is sufficient because `/opsx:continue` is user-initiated — the user decides when to advance.

### Project Config

```yaml
# openspec/config.yaml
schema: exploration-first        # Default schema for new changes
context: |                       # Injected into ALL artifact instructions
  Project-level context for AI
rules:                           # Per-artifact constraints
  exploration:
    - Minimum 3 solutions required
```

---

## Reference Mode Implementation

**Goal**: Provide project context (tech stack, conventions, architecture) to AI across all artifacts.

**Solution**: Edit `openspec/config.yaml` directly.

```yaml
# openspec/config.yaml
schema: exploration-first

context: |
  ## Tech Stack
  - TypeScript, React 18, Node.js 20
  - Vitest for unit tests, Playwright for e2e
  - pnpm workspaces monorepo

  ## Conventions
  - RESTful API, JSON responses
  - ESLint + Prettier, strict TypeScript
  - Conventional commits

  ## Architecture
  - src/core/ for business logic
  - src/commands/ for CLI handlers
  - src/utils/ for shared utilities

rules:
  proposal:
    - Reference existing architecture documentation
    - Identify affected modules in src/core/
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for cross-module flows
```

OPSX's instruction-loader wraps `context` in `<project_context>` tags and injects it into every artifact instruction. Rules are injected per-artifact in `<rules>` tags.

**Automation alternative**: A shell script can populate context from external files:

```bash
#!/bin/bash
# populate-context.sh
cat > openspec/config.yaml << 'EOF'
schema: exploration-first

context: |
EOF
for file in templates/tech-stack.md templates/conventions.md templates/architecture.md; do
  if [ -f "$file" ]; then
    echo "  ## $(basename "$file" .md)" >> openspec/config.yaml
    sed 's/^/  /' "$file" >> openspec/config.yaml
    echo "" >> openspec/config.yaml
  fi
done
```

---

## Enhanced Mode Implementation

**Goal**: Add a structured exploration phase before proposal, with 3+ solutions, comparison matrix, and critical questions.

**Solution**: Custom Schema via `openspec schema fork`.

### Setup

```bash
# 1. Fork the default schema
openspec schema fork spec-driven exploration-first

# 2. Add exploration template
cp templates/exploration-template.md openspec/schemas/exploration-first/templates/exploration.md

# 3. Edit schema.yaml to add exploration artifact (see below)

# 4. Validate
openspec schema validate exploration-first
```

### Schema Definition

Edit `openspec/schemas/exploration-first/schema.yaml`:

```yaml
name: exploration-first
version: 1
description: Exploration-driven workflow with structured pre-proposal analysis

artifacts:
  - id: exploration
    generates: exploration.md
    description: Structured exploration with 3+ solutions and approval gate
    template: exploration.md
    instruction: |
      Create a structured exploration document. You MUST:
      - Provide minimum 3 solutions (including one Best Practice approach)
      - Create a Comparison Matrix across all solutions
      - List Critical Questions that need answers before proceeding
      - Include a Recommendation with rationale
      - Set status to PENDING

      Follow the template structure exactly. The user will review this
      document and decide when to proceed to the proposal phase.
    requires: []

  - id: proposal
    generates: proposal.md
    description: Initial proposal document outlining the change
    template: proposal.md
    instruction: |
      Create the proposal based on the exploration document.
      Reference the selected solution and incorporate answers to
      the critical questions.

      Sections: Why, What Changes, Capabilities, Impact.
      Keep it concise (1-2 pages). Focus on "why" not "how".
    requires: [exploration]

  - id: specs
    generates: "specs/**/*.md"
    description: Detailed specifications for the change
    template: spec.md
    instruction: |
      Create specification files based on the proposal's Capabilities section.
      Use delta operations: ADDED, MODIFIED, REMOVED, RENAMED.
      Every requirement MUST have at least one scenario with WHEN/THEN.
    requires: [proposal]

  - id: design
    generates: design.md
    description: Technical design document
    template: design.md
    instruction: |
      Create the design document explaining HOW to implement the change.
      Reference the exploration's selected solution for technical approach.
    requires: [proposal]

  - id: tasks
    generates: tasks.md
    description: Implementation checklist
    template: tasks.md
    instruction: |
      Break down the implementation into trackable checkbox tasks.
      Reference specs for what to build, design for how to build it.
    requires: [specs, design]

apply:
  requires: [tasks]
  tracks: tasks.md
  instruction: |
    Read context files, work through pending tasks, mark complete as you go.
```

### Exploration Template

The template at `openspec/schemas/exploration-first/templates/exploration.md` provides:

- Task Requirement (scope, success criteria, out of scope)
- Self Reflection (problem understanding, assumptions)
- Ideas (minimum 3 solutions with pros/cons)
- Comparison Matrix
- Critical Questions + Clarification Questions
- Recommendation with rationale
- Discussion Log

Source: [templates/exploration-template.md](./templates/exploration-template.md)

### Artifact Graph (DAG)

```
exploration (root)
     │
     ▼
  proposal
     │
  ┌──┴──┐
  ▼     ▼
specs  design
  │     │
  └──┬──┘
     ▼
   tasks
     │
     ▼
  [apply]
```

### Usage

```bash
# Create a new change with exploration-first schema
openspec new change my-feature --schema exploration-first

# Or set as project default in openspec/config.yaml:
# schema: exploration-first
```

### Workflow

```
/opsx:new my-feature --schema exploration-first
  → Creates openspec/changes/my-feature/

/opsx:continue
  → Status: exploration=READY, rest=BLOCKED
  → AI creates exploration.md using schema template + instruction

  ← User reviews exploration.md
  ← User answers Critical Questions
  ← User confirms selected solution
  ← User updates status to APPROVED (optional, for record-keeping)

/opsx:continue
  → Status: exploration=DONE, proposal=READY
  → AI creates proposal.md referencing exploration

/opsx:continue → specs or design (both READY)
/opsx:continue → the other one
/opsx:continue → tasks (READY after specs + design)

/opsx:apply → implement tasks
/opsx:archive → archive completed change
```

The APPROVED gate is **naturally enforced by user behavior**: the user reviews the exploration and only runs `/opsx:continue` when satisfied. No programmatic status check is needed.

Alternatively, `/opsx:ff` creates all artifacts in one pass (useful when the scope is already clear).

### `/opsx:explore` vs `exploration` Artifact

These are two separate, complementary features:

|         | `/opsx:explore`                      | `exploration` artifact               |
| ------- | -------------------------------------- | -------------------------------------- |
| Type    | AI Skill (from `skill-templates.ts`) | Schema artifact (from `schema.yaml`) |
| Nature  | Free-form thinking partner             | Structured decision document           |
| Output  | No file — conversation is the output  | Produces `exploration.md`            |
| Trigger | User calls `/opsx:explore` manually  | `/opsx:continue` or `/opsx:ff`     |

A typical workflow might use both: `/opsx:explore` first for free-form thinking, then `/opsx:new` + `/opsx:continue` to formalize insights into a structured exploration document.

---

## Directory Structure

```
your-project/
├── openspec/
│   ├── config.yaml                     # Project config (context + rules + default schema)
│   ├── schemas/
│   │   └── exploration-first/          # Custom Schema (Enhanced Mode)
│   │       ├── schema.yaml             #   Artifact DAG: exploration → proposal → ...
│   │       └── templates/
│   │           ├── exploration.md      #   Structured exploration template
│   │           ├── proposal.md         #   (from spec-driven fork)
│   │           ├── spec.md
│   │           ├── design.md
│   │           └── tasks.md
│   ├── changes/
│   │   └── {change-id}/
│   │       ├── .openspec.yaml          #   schema: exploration-first
│   │       ├── exploration.md          #   Created by /opsx:continue
│   │       ├── proposal.md
│   │       ├── design.md
│   │       ├── tasks.md
│   │       └── specs/
│   └── specs/
│
└── templates/                          # External documentation (optional)
    ├── tech-stack.md                   #   Content can be copied into config.yaml context
    ├── conventions.md
    ├── architecture.md
    └── exploration-template.md         #   Source for schema template
```

---

## Implementation Steps

1. **Create Custom Schema**

   ```bash
   openspec schema fork spec-driven exploration-first
   ```
2. **Add exploration artifact** to `openspec/schemas/exploration-first/schema.yaml`
3. **Copy exploration template** to `openspec/schemas/exploration-first/templates/exploration.md`
4. **Configure project context** in `openspec/config.yaml`
5. **Validate schema**

   ```bash
   openspec schema validate exploration-first
   ```
6. **Use it**

   ```bash
   openspec new change my-feature --schema exploration-first
   ```

No fork. No npm publish. No code changes. All configuration.

---

## Related Documents

- [requirements.md](./requirements.md) - Reference Mode specification
- [requirement-enhanced.md](./requirement-enhanced.md) - Enhanced Mode specification
- [templates/README.md](./templates/README.md) - Template documentation
- [docs/opsx.md](./docs/opsx.md) - OPSX workflow documentation
- [templates/exploration-template.md](./templates/exploration-template.md) - Exploration template source
