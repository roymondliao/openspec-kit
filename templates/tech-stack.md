# Tech Stack

This document describes the technology choices for this project. AI assistants should reference this when generating code to ensure consistency with the project's technical decisions.

---

## Purpose & Scope

This document defines the project's technology choices and versions (language/runtime, frameworks, infrastructure, and development tools).

It MUST NOT define:
- Repository layout, module boundaries, API contracts, error formats, or security/performance architecture (see `architecture.md`)
- Development philosophy and coding conventions (see `conventions.md`)

### Core vs Optional

- **Core (MUST fill)**: Languages & Runtime, Package Management, Development Tools
- **Optional (fill when applicable)**: Frontend, Backend, Database, Infrastructure, External Services & APIs

## Languages & Runtime

### Primary Language
- **Language**: [e.g., TypeScript, Python, Go, Rust, Java]
- **Version**: [e.g., 5.x, 3.12+, 1.21+]
- **Module System**: [e.g., ESM, CommonJS, Go modules]

### Secondary Languages (if applicable)
- [Language]: [Purpose, e.g., "SQL for database queries"]
- [Language]: [Purpose]

---

## Package Management

- **Package Manager**: [e.g., pnpm, npm, yarn, pip, poetry, cargo, go mod]
- **Lock File**: [e.g., pnpm-lock.yaml, package-lock.json, poetry.lock]
- **Registry**: [e.g., npm, PyPI, crates.io, or private registry URL]

---

## Frontend (if applicable)

### Framework
- **Framework**: [e.g., React, Vue, Svelte, Angular, None]
- **Version**: [e.g., 18.x, 3.x]

### UI & Styling
- **UI Library**: [e.g., shadcn/ui, MUI, Ant Design, None]
- **CSS Approach**: [e.g., Tailwind CSS, CSS Modules, Styled Components, SCSS]

### State Management
- **Solution**: [e.g., Zustand, Redux, Pinia, Vuex, None]

### Build Tool
- **Bundler**: [e.g., Vite, Webpack, Turbopack, esbuild]

---

## Backend (if applicable)

### Framework
- **Framework**: [e.g., Express, Fastify, FastAPI, Django, Gin, Actix]
- **Version**: [e.g., 4.x, 0.100+]

### API Style
- **Type**: [e.g., REST, GraphQL, gRPC, tRPC]
- **Specification**: [e.g., OpenAPI 3.0, GraphQL SDL, Protocol Buffers]

### Authentication
- **Method**: [e.g., JWT, Session-based, OAuth2, API Keys]
- **Libraries**: [e.g., Passport.js, python-jose, authlib]

---

## Database

### Primary Database
- **Type**: [e.g., PostgreSQL, MySQL, MongoDB, SQLite]
- **Version**: [e.g., 15+, 8.0+]
- **ORM/Query Builder**: [e.g., Prisma, SQLAlchemy, GORM, Diesel, TypeORM]

### Cache (if applicable)
- **Solution**: [e.g., Redis, Memcached, In-memory]
- **Purpose**: [e.g., Session storage, Query caching, Rate limiting]

### Search (if applicable)
- **Solution**: [e.g., Elasticsearch, Meilisearch, Algolia, PostgreSQL FTS]

---

## Infrastructure

### Deployment
- **Platform**: [e.g., AWS, GCP, Azure, Vercel, Railway, Self-hosted]
- **Container**: [e.g., Docker, Podman, None]
- **Orchestration**: [e.g., Kubernetes, ECS, Docker Compose, None]

### CI/CD
- **Platform**: [e.g., GitHub Actions, GitLab CI, CircleCI, Jenkins]
- **Pipeline**: [Describe key stages: lint, test, build, deploy]

### Monitoring & Logging
- **APM**: [e.g., Datadog, New Relic, Sentry, None]
- **Logging**: [e.g., Structured JSON, ELK Stack, CloudWatch]

---

## Development Tools

### Code Quality
- **Linter**: [e.g., ESLint, Ruff, golangci-lint, Clippy]
- **Formatter**: [e.g., Prettier, Black, gofmt, rustfmt]
- **Type Checking**: [e.g., TypeScript, mypy, go vet]

### Testing
- **Unit Tests**: [e.g., Vitest, Jest, pytest, go test]
- **Integration Tests**: [e.g., Supertest, pytest, testcontainers]
- **E2E Tests**: [e.g., Playwright, Cypress, Selenium]

### Documentation
- **API Docs**: [e.g., Swagger UI, Redoc, Sphinx]
- **Code Docs**: [e.g., TypeDoc, pdoc, godoc]

---

## Version Requirements

| Component | Minimum Version | Recommended |
|-----------|-----------------|-------------|
| [Runtime] | [version] | [version] |
| [Database] | [version] | [version] |
| [Package Manager] | [version] | [version] |

---

## External Services & APIs

| Service | Purpose | Documentation |
|---------|---------|---------------|
| [Service name] | [What it's used for] | [Link to docs] |
| [Service name] | [What it's used for] | [Link to docs] |

---

## Notes for AI Assistants

When generating code for this project:
1. Use the specified language version features
2. Import from the listed frameworks/libraries
3. Do not introduce new tools or dependencies without updating this file
4. Follow system structure, boundaries, and contracts in `architecture.md`
5. Follow development philosophy and conventions in `conventions.md`
