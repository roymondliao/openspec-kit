# Templates

This directory contains universal templates for project documentation and OpenSpec workflows. These templates are **language-agnostic** and can be used with any technology stack.

---

## Overview

| Template | Purpose | When to Use |
|----------|---------|-------------|
| [tech-stack.md](#tech-stackmd) | Define technology choices | Project setup, AI context |
| [conventions.md](#conventionsmd) | Define coding standards | Team onboarding, AI code generation |
| [architecture.md](#architecturemd) | Document system design | Project planning, AI understanding |
| [exploration-template.md](#exploration-templatemd) | Deep analysis before implementation | OpenSpec Enhanced Mode |
| [task_template.md](#task_templatemd) | Structured task analysis | Complex task planning |

---

## Template Descriptions

### tech-stack.md

**Purpose**: Document all technology choices for a project.

**Use When**:
- Starting a new project
- Onboarding AI assistants to understand the codebase
- Ensuring consistent technology usage across the team

**Key Sections**:
- Languages & Runtime (primary language, version, module system)
- Package Management (manager, registry)
- Frontend (framework, UI library, state management)
- Backend (framework, API style, authentication)
- Database (type, ORM, cache)
- Infrastructure (deployment, CI/CD, monitoring)
- Development Tools (linting, testing, documentation)
- Version Requirements

**Example Usage**:
```bash
# Reference in OpenSpec init
openspec init --tech-stack ./docs/tech-stack.md

# AI prompt
"Read @docs/tech-stack.md and generate code using the specified frameworks"
```

---

### conventions.md

**Purpose**: Define coding standards, workflows, and best practices.

**Use When**:
- Establishing team coding standards
- Ensuring AI generates consistent code
- Onboarding new team members
- Code review standardization

**Key Sections**:
- Code Style (naming conventions, formatting rules)
- Git Workflow (branch strategy, commit messages, PR process)
- Testing Standards (test types, coverage, naming)
- Error Handling (error types, response format, logging)
- API Design (URL structure, response format, status codes)
- Documentation (comments, required docs)
- Security Practices (input validation, auth, sensitive data)
- Performance Guidelines (database, caching, frontend)

**Example Usage**:
```bash
# Reference in OpenSpec init
openspec init --conventions ./CONTRIBUTING.md

# AI prompt
"Follow the conventions in @conventions.md when writing this feature"
```

---

### architecture.md

**Purpose**: Document the system's high-level design and structure.

**Use When**:
- Planning system design
- Helping AI understand where code belongs
- Making architectural decisions
- Onboarding developers to the codebase

**Key Sections**:
- System Overview (purpose, high-level diagram)
- Architecture Style (pattern, rationale)
- Layer Architecture (layers, responsibilities, dependencies)
- Module Structure (modules, communication)
- Data Flow (request flow, data movement)
- Key Components (purpose, location, interfaces)
- External Integrations (services, methods)
- Data Architecture (schema, entities, storage decisions)
- Security Architecture (auth flow, authorization, boundaries)
- Deployment Architecture (environments, topology)
- Design Decisions Log (ADRs)

**Example Usage**:
```bash
# Reference in OpenSpec init
openspec init --architecture ./docs/architecture.md

# AI prompt
"Based on @architecture.md, where should I add the new payment module?"
```

---

### exploration-template.md

**Purpose**: Structured deep analysis before committing to an implementation approach.

**Use When**:
- Using OpenSpec Enhanced Mode
- Complex features requiring multiple solution options
- Need to document decision rationale
- Want explicit user confirmation before proceeding

**Key Sections**:
- Task Requirement (scope, success criteria, out of scope)
- Extra Information (context, constraints)
- Self Reflection (problem understanding, considerations, assumptions)
- Ideas (minimum 3 solutions with pros/cons)
  - Solution 1: Best Practice / Industry Standard
  - Solution 2: Recommended for This Project
  - Solution 3: Alternative Approach
- Comparison Matrix (effort, risk, scalability, etc.)
- Questions (critical and clarification)
- Recommendation (selected solution with rationale)
- Discussion Log (conversation history with user)

**Workflow**:
```
1. AI creates exploration.md with 3+ solutions
2. User reviews and answers questions
3. User approves selected solution
4. AI proceeds to create proposal.md, tasks.md, specs/
```

**Example Usage**:
```markdown
# In OpenSpec Enhanced Mode

User: "Add user authentication"

AI creates: openspec/changes/add-auth/exploration.md
- Solution 1: JWT (best practice)
- Solution 2: Session + Redis (recommended)
- Solution 3: Auth0 (managed service)

User: Reviews, answers questions, approves Solution 2

AI proceeds to: proposal.md, tasks.md, specs/
```

---

### task_template.md

**Purpose**: Structured analysis and planning for complex tasks.

**Use When**:
- Planning a complex implementation
- Need to compare multiple approaches
- Want documented discussion with user before coding
- Require explicit approval before proceeding

**Key Sections**:
1. **Task Requirement**: Scope and success criteria
2. **Extra Information**: Additional context and references
3. **Self Reflection**: AI's analysis and understanding
4. **Ideas**: Multiple implementation approaches (minimum 3)
5. **Questions**: Clarifications needed from user
6. **Plans**: Final agreed-upon approach

**Workflow**:
```
1. Fill out Task Requirement
2. AI completes Self Reflection and Ideas
3. AI lists Questions
4. User and AI discuss Plans
5. Only after plan approval -> proceed to implementation
```

---

## Template Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│  templates/                         openspec/                       │
│  (scaffold source)                  (project files)                 │
│  ┌─────────────┐    init            ┌─────────────┐                 │
│  │ tech-stack  │ ──────────────▶    │ tech-stack  │                 │
│  │ conventions │    copies          │ conventions │                 │
│  │ architecture│                    │ architecture│                 │
│  └─────────────┘                    └──────┬──────┘                 │
│                                            │                        │
│                                     update │                        │
│                                            ▼                        │
│                                     ┌─────────────┐                 │
│                                     │ config.yaml │                 │
│                                     │ (AI context)│                 │
│                                     └─────────────┘                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     OpenSpec Workflow                               │
│                                                                     │
│  ┌─────────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  exploration    │ ──▶ │ proposal.md │ ──▶ │  tasks.md   │       │
│  │   template.md   │     │ design.md   │     │  specs/     │       │
│  └─────────────────┘     └─────────────┘     └─────────────┘       │
│        (Phase 1)             (Phase 2)           (Phase 3)          │
│                                                                     │
│  └─────────────── OpenSpec Enhanced Mode ──────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How to Use These Templates

### Option 1: Scaffold with opsx-kit

Use `init` to scaffold editable template files into `openspec/`, fill them in, then `update` to inject into `openspec/config.yaml`.

```bash
# Install the CLI in your project
pnpm add -D openspec-kit

# 1. Scaffold templates into openspec/ (copies from templates/, skips existing)
pnpm exec opsx-kit init

# 2. Edit the files with your project details
#    vim openspec/tech-stack.md
#    vim openspec/conventions.md
#    vim openspec/architecture.md

# 3. Inject all into config.yaml
pnpm exec opsx-kit update

# Inject only specific files
pnpm exec opsx-kit update --files tech-stack,conventions

# Scaffold to a custom directory instead
pnpm exec opsx-kit init --dir ./docs

# Read from a shared template directory
pnpm exec opsx-kit update --source /path/to/shared/templates
```

### Option 2: Copy and Fill

1. Copy the template to your project
2. Replace `[placeholder]` with your content
3. Delete sections that don't apply

```bash
cp templates/tech-stack.md docs/tech-stack.md
# Edit docs/tech-stack.md with your project details
```

### Option 3: Reference Mode (with OpenSpec)

```bash
# Initialize OpenSpec with references to your filled templates
openspec init --reference-mode \
    --tech-stack ./docs/tech-stack.md \
    --conventions ./CONTRIBUTING.md \
    --architecture ./docs/architecture.md
```

### Option 4: AI-Assisted Filling

```
User: "Based on my package.json and existing code, help me fill out
       @templates/tech-stack.md for my project"

AI: [Analyzes project and fills template]
```

---

## Team-Level Usage

Templates support sharing across teams and repositories.

### Within a Repository

Commit the `templates/` directory (scaffold source) to git. Team members run `init` + `update`:

```bash
# Team member clones repo, then:
pnpm exec opsx-kit init    # copies scaffolds to openspec/
pnpm exec opsx-kit update  # injects into config.yaml
```

### Across Repositories

Point to a shared template directory using `--source` or the `OPENSPEC_TEMPLATE_DIR` environment variable:

```bash
# Using --source flag
pnpm exec opsx-kit update --source /path/to/shared/templates

# Using environment variable (add to shell profile)
export OPENSPEC_TEMPLATE_DIR="/path/to/shared/templates"
pnpm exec opsx-kit update
```

**Resolution order**: `--source` flag > `$OPENSPEC_TEMPLATE_DIR` > `./openspec/`

### Personal Additions

For user-specific context not shared with the team, edit `openspec/config.yaml` directly. The `update` command preserves the `schema` and `rules` sections.

---

## Best Practices

### For Project Documentation (tech-stack, conventions, architecture)

1. **Keep Updated**: Review quarterly or after major changes
2. **Be Specific**: Use exact versions, not ranges
3. **Include Rationale**: Document "why" for key decisions
4. **Link to Details**: Reference external docs for complex topics

### For Task Templates (task_template, exploration-template)

1. **Always Include 3+ Solutions**: Forces thorough analysis
2. **Include Best Practice**: Even if not chosen, document it
3. **Answer All Questions**: Before proceeding to implementation
4. **Log Discussions**: Preserve decision history

### For AI Integration

1. **Reference in Prompts**: "Follow conventions in @conventions.md"
2. **Check Before Generating**: AI should read templates first
3. **Validate Output**: Ensure generated code matches templates
4. **Update When Needed**: Keep AI context current

---

## Template Customization

These templates are starting points. Customize based on your needs:

### Adding Sections

```markdown
## [New Section Name]

### [Subsection]
[Content]
```

### Removing Sections

Delete entire section blocks that don't apply to your project.

### Creating Variants

```bash
# Create language-specific variants if needed
templates/
├── tech-stack.md           # Generic
├── tech-stack-python.md    # Python-specific
└── tech-stack-node.md      # Node.js-specific
```

---

## Related Documentation

- [requirements.md](../requirements.md) - Reference Mode implementation details
- [requirement-enhanced.md](../requirement-enhanced.md) - Enhanced Mode workflow specification
- [openspec/AGENTS.md](../openspec/AGENTS.md) - AI assistant instructions

---

## Notes for AI Assistants

When working with these templates:

1. **Read before generating**: Check relevant templates before writing code
2. **Follow conventions**: Match naming, formatting, and patterns
3. **Respect architecture**: Put code in the correct modules/layers
4. **Use correct versions**: Match the specified technology versions
5. **Ask if unclear**: If template info is incomplete, ask the user
