import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import { ensureDir, fileExists } from "../utils/fs.js";
import { resolveOpenSpecDir, templateDir } from "../utils/paths.js";

interface EnhancedInitOptions {
  project?: string;
  schemaName?: string;
}

const DEFAULT_SCHEMA_NAME = "exploration-first";
const SCHEMA_NAME_PATTERN = /^[a-z0-9][a-z0-9-]*$/;
const EXPLORATION_TEMPLATE = "exploration.md";
const EXPLORATION_SOURCE = "exploration-template.md";

function normalizeSchemaName(schemaName?: string): string {
  const value = (schemaName ?? DEFAULT_SCHEMA_NAME).trim();
  if (!value) {
    throw new Error("Schema name is required.");
  }
  if (value.includes("/") || value.includes("\\")) {
    throw new Error("Schema name cannot include path separators.");
  }
  if (!SCHEMA_NAME_PATTERN.test(value)) {
    throw new Error(
      "Schema name must be kebab-case (lowercase letters, numbers, hyphens).",
    );
  }
  return value;
}

async function runOpenSpec(args: string[], cwd: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("openspec", args, { cwd, stdio: "inherit" });
    child.on("error", (error) => reject(error));
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`openspec ${args.join(" ")} failed with code ${code ?? "null"}`));
      }
    });
  });
}

function insertExplorationArtifact(schemaContent: string, indent: string): string {
  if (schemaContent.includes(`${indent}- id: exploration`)) {
    return schemaContent;
  }

  const proposalToken = `${indent}- id: proposal`;
  const proposalIndex = schemaContent.indexOf(proposalToken);
  if (proposalIndex === -1) {
    return schemaContent;
  }

  const blockIndent = indent;
  const fieldIndent = `${indent}  `;
  const explorationBlock = [
    `${blockIndent}- id: exploration`,
    `${fieldIndent}generates: exploration.md`,
    `${fieldIndent}description: Structured exploration with 3+ solutions and approval gate`,
    `${fieldIndent}template: ${EXPLORATION_TEMPLATE}`,
    `${fieldIndent}instruction: |`,
    `${fieldIndent}  Create a structured exploration document. You MUST:`,
    `${fieldIndent}  - Provide minimum 3 solutions (including one Best Practice approach)`,
    `${fieldIndent}  - Create a Comparison Matrix across all solutions`,
    `${fieldIndent}  - List Critical Questions that need answers before proceeding`,
    `${fieldIndent}  - Include a Recommendation with rationale`,
    `${fieldIndent}  - Set status to PENDING`,
    `${fieldIndent}  `,
    `${fieldIndent}  Follow the template structure exactly. The user will review this`,
    `${fieldIndent}  document and decide when to proceed to the proposal phase.`,
    `${fieldIndent}requires: []`,
  ].join("\n");

  return `${schemaContent.slice(0, proposalIndex)}${explorationBlock}\n\n${schemaContent.slice(
    proposalIndex,
  )}`;
}

function ensureProposalRequires(schemaContent: string, indent: string): string {
  const proposalToken = `${indent}- id: proposal`;
  const proposalIndex = schemaContent.indexOf(proposalToken);
  if (proposalIndex === -1) {
    return schemaContent;
  }

  const remainder = schemaContent.slice(proposalIndex + proposalToken.length);
  const nextMatch = remainder.search(new RegExp(`\n${indent}- id:`));
  const blockEnd = nextMatch === -1 ? schemaContent.length : proposalIndex + proposalToken.length + nextMatch;
  const proposalBlock = schemaContent.slice(proposalIndex, blockEnd);
  const fieldIndent = `${indent}  `;
  const requiresPattern = new RegExp(`^${fieldIndent}requires:.*$`, "m");

  let updatedBlock = proposalBlock;
  if (requiresPattern.test(proposalBlock)) {
    updatedBlock = proposalBlock.replace(requiresPattern, `${fieldIndent}requires: [exploration]`);
  } else {
    const trimmed = proposalBlock.replace(/\s*$/, "");
    updatedBlock = `${trimmed}\n${fieldIndent}requires: [exploration]\n`;
  }

  return `${schemaContent.slice(0, proposalIndex)}${updatedBlock}${schemaContent.slice(blockEnd)}`;
}

async function patchSchema(schemaFile: string): Promise<void> {
  const raw = await fs.readFile(schemaFile, "utf8");
  const indentMatch = raw.match(/^(\s*)- id: proposal/m);
  const indent = indentMatch ? indentMatch[1] : "  ";

  let updated = insertExplorationArtifact(raw, indent);
  updated = ensureProposalRequires(updated, indent);

  if (updated !== raw) {
    await fs.writeFile(schemaFile, `${updated.replace(/\s*$/, "")}\n`, "utf8");
  }
}

export async function initEnhancedMode(options: EnhancedInitOptions): Promise<void> {
  const baseDir = options.project ? path.resolve(options.project) : process.cwd();
  const openSpecDir = resolveOpenSpecDir(baseDir);

  if (!(await fileExists(openSpecDir))) {
    throw new Error(
      `openspec directory not found at ${openSpecDir}. ` +
        "Run openspec init or pass --project to set the root.",
    );
  }

  const schemaName = normalizeSchemaName(options.schemaName);
  if (schemaName === "spec-driven") {
    throw new Error("Refusing to modify the built-in spec-driven schema.");
  }
  const schemaDir = path.join(openSpecDir, "schemas", schemaName);
  const schemaTemplatesDir = path.join(schemaDir, "templates");
  const schemaFile = path.join(schemaDir, "schema.yaml");
  const templateSource = path.join(templateDir(), EXPLORATION_SOURCE);
  const templateTarget = path.join(schemaTemplatesDir, EXPLORATION_TEMPLATE);

  console.log(`Preparing enhanced schema: ${schemaName}`);

  if (!(await fileExists(schemaDir))) {
    console.log("Forking spec-driven schema...");
    await runOpenSpec(["schema", "fork", "spec-driven", schemaName], baseDir);
  } else {
    console.log("Schema directory exists; updating in place.");
  }

  await ensureDir(schemaTemplatesDir);

  if (!(await fileExists(templateSource))) {
    throw new Error(`Exploration template not found at ${templateSource}.`);
  }

  await fs.copyFile(templateSource, templateTarget);
  console.log(`Copied exploration template to ${templateTarget}`);

  if (!(await fileExists(schemaFile))) {
    throw new Error(`Schema file not found at ${schemaFile}.`);
  }

  await patchSchema(schemaFile);
  console.log(`Patched schema at ${schemaFile}`);
}
