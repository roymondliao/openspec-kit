import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function packageRoot(): string {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);
  return path.resolve(dirname, "..", "..");
}

export function templateDir(): string {
  return path.join(packageRoot(), "templates");
}

export function findOpenSpecDir(startDir: string): string | null {
  let currentDir = path.resolve(startDir);
  while (true) {
    const candidate = path.join(currentDir, "openspec");
    if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
      return candidate;
    }
    const parent = path.dirname(currentDir);
    if (parent === currentDir) {
      return null;
    }
    currentDir = parent;
  }
}

export function resolveOpenSpecDir(startDir: string): string {
  return findOpenSpecDir(startDir) ?? path.join(startDir, "openspec");
}
