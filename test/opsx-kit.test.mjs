import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

import { initEnhancedMode } from "../dist/commands/enhanced.js";
import { initTemplates } from "../dist/commands/init.js";
import { updateConfig } from "../dist/commands/update.js";

async function createProjectRoot() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "opsx-kit-"));
  const projectDir = path.join(tempDir, "project");
  await fs.mkdir(projectDir, { recursive: true });
  return projectDir;
}

test("init scaffolds template files", async () => {
  const projectDir = await createProjectRoot();

  await initTemplates({ project: projectDir });

  const techStack = await fs.readFile(
    path.join(projectDir, "openspec", "tech-stack.md"),
    "utf8",
  );

  assert.ok(techStack.includes("# Tech Stack"));
});

test("update writes config.yaml with context", async () => {
  const projectDir = await createProjectRoot();

  await initTemplates({ project: projectDir });
  await updateConfig({ project: projectDir });

  const config = await fs.readFile(
    path.join(projectDir, "openspec", "config.yaml"),
    "utf8",
  );

  assert.ok(config.includes("schema: spec-driven"));
  assert.ok(config.includes("context: |"));
  assert.ok(config.includes("# Tech Stack"));
});

test("enhanced init patches schema and copies exploration template", async () => {
  const projectDir = await createProjectRoot();
  const openSpecDir = path.join(projectDir, "openspec");
  const schemaDir = path.join(openSpecDir, "schemas", "enhanced");
  const schemaTemplatesDir = path.join(schemaDir, "templates");
  const schemaFile = path.join(schemaDir, "schema.yaml");

  await fs.mkdir(schemaTemplatesDir, { recursive: true });
  await fs.writeFile(
    schemaFile,
    [
      "name: enhanced",
      "version: 1",
      "artifacts:",
      "  - id: proposal",
      "    generates: proposal.md",
      "    description: Proposal",
      "    template: proposal.md",
      "  - id: specs",
      "    generates: specs/**/*.md",
      "    description: Specs",
      "    template: spec.md",
    ].join("\n"),
    "utf8",
  );

  await initEnhancedMode({ project: projectDir, schemaName: "enhanced" });

  const patchedSchema = await fs.readFile(schemaFile, "utf8");
  assert.ok(patchedSchema.includes("- id: exploration"));
  assert.ok(patchedSchema.includes("requires: [exploration]"));

  const explorationTemplate = await fs.readFile(
    path.join(schemaTemplatesDir, "exploration.md"),
    "utf8",
  );
  assert.ok(explorationTemplate.includes("# Exploration"));
});
