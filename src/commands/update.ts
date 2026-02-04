import fs from "node:fs/promises";
import path from "node:path";

import { CONTEXT_FILES, CONTEXT_NAMES, DEFAULT_SCHEMA } from "../utils/constants.js";
import { ensureDir, fileExists } from "../utils/fs.js";
import { resolveOpenSpecDir } from "../utils/paths.js";
import { indentBlock } from "../utils/text.js";

interface UpdateOptions {
  files?: string;
  source?: string;
  project?: string;
}

export async function updateConfig(options: UpdateOptions): Promise<void> {
  const baseDir = options.project ? path.resolve(options.project) : process.cwd();
  const openSpecDir = resolveOpenSpecDir(baseDir);

  if (!(await fileExists(openSpecDir))) {
    throw new Error(
      `openspec directory not found at ${openSpecDir}. ` +
        "Run openspec init or pass --project to set the root.",
    );
  }

  const configFile = path.join(openSpecDir, "config.yaml");
  const sourceDir = options.source
    ? path.resolve(options.source)
    : process.env.OPENSPEC_TEMPLATE_DIR
      ? path.resolve(process.env.OPENSPEC_TEMPLATE_DIR)
      : openSpecDir;

  console.log(`Source directory: ${sourceDir}`);

  const injectFiles: string[] = [];
  if (options.files) {
    const requested = options.files.split(",").map((name) => name.trim());
    for (const name of requested) {
      if (!name) {
        continue;
      }
      if ((CONTEXT_NAMES as readonly string[]).includes(name)) {
        injectFiles.push(`${name}.md`);
      } else {
        console.warn(
          `  [warn] Unknown file: ${name} (valid: ${CONTEXT_NAMES.join(" ")})`,
        );
      }
    }
  } else {
    injectFiles.push(...CONTEXT_FILES);
  }

  if (injectFiles.length === 0) {
    throw new Error("No valid files to inject.");
  }

  const existingConfig = (await fileExists(configFile))
    ? await fs.readFile(configFile, "utf8")
    : "";

  const schemaMatch = existingConfig.match(/^schema:\s*(.+)\s*$/m);
  const schema = schemaMatch ? schemaMatch[1].trim() : DEFAULT_SCHEMA;

  const rulesIndex = existingConfig.search(/^rules:\s*/m);
  const rulesSection = rulesIndex >= 0 ? existingConfig.slice(rulesIndex).trimEnd() : "";

  const outputLines: string[] = [`schema: ${schema}`, "", "context: |"]; 
  let foundAny = false;
  let injected = 0;
  let skipped = 0;

  for (const file of injectFiles) {
    const filepath = path.join(sourceDir, file);
    if (await fileExists(filepath)) {
      const content = await fs.readFile(filepath, "utf8");
      outputLines.push(indentBlock(content));
      outputLines.push("");
      foundAny = true;
      injected += 1;
      console.log(`  [+] Injected ${file}`);
    } else {
      skipped += 1;
      console.log(`  [-] Skipped ${file} (not found in ${sourceDir})`);
    }
  }

  if (!foundAny) {
    outputLines.push("  (no context files found)");
  }

  if (rulesSection) {
    outputLines.push("", rulesSection);
  }

  await ensureDir(openSpecDir);
  await fs.writeFile(configFile, `${outputLines.join("\n")}\n`, "utf8");

  console.log("");
  console.log(
    `Done. Injected ${injected} file(s), skipped ${skipped}. Updated ${configFile} (schema: ${schema})`,
  );
}
