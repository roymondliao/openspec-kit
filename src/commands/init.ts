import fs from "node:fs/promises";
import path from "node:path";

import { CONTEXT_FILES } from "../utils/constants.js";
import { ensureDir, fileExists } from "../utils/fs.js";
import { resolveOpenSpecDir, templateDir } from "../utils/paths.js";

interface InitOptions {
  dir?: string;
  project?: string;
  files?: string;
}

export async function initTemplates(options: InitOptions): Promise<void> {
  const baseDir = options.project ? path.resolve(options.project) : process.cwd();
  const openSpecDir = resolveOpenSpecDir(baseDir);
  const targetDir = options.dir ? path.resolve(options.dir) : openSpecDir;

  console.log(`Scaffolding templates in: ${targetDir}`);
  await ensureDir(targetDir);

  const sourceDir = templateDir();
  let created = 0;
  let skipped = 0;

  const filesToProcess = options.files
    ? options.files.split(',').map(f => f.trim()).filter(f => (CONTEXT_FILES as readonly string[]).includes(f))
    : CONTEXT_FILES;

  for (const file of filesToProcess) {
    const targetPath = path.join(targetDir, file);
    if (await fileExists(targetPath)) {
      console.log(`  [skip] ${file} (already exists)`);
      skipped += 1;
      continue;
    }

    const sourcePath = path.join(sourceDir, file);
    if (await fileExists(sourcePath)) {
      await fs.copyFile(sourcePath, targetPath);
      console.log(`  [created] ${file}`);
      created += 1;
    } else {
      console.error(`  [missing] ${file} (not found in ${sourceDir})`);
    }
  }

  console.log("");
  console.log(`Done. Created ${created} file(s), skipped ${skipped} file(s).`);
}
