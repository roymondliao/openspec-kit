import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const ref = process.env.GITHUB_REF || "";
  if (!ref.startsWith("refs/tags/v")) {
    return;
  }

  const tagVersion = ref.replace("refs/tags/v", "").trim();
  if (!tagVersion) {
    throw new Error("Tag version not found in GITHUB_REF.");
  }

  const pkgPath = path.join(process.cwd(), "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
  const pkgVersion = String(pkg.version || "").trim();

  if (pkgVersion !== tagVersion) {
    throw new Error(
      `Tag version (${tagVersion}) does not match package.json version (${pkgVersion}).`,
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
