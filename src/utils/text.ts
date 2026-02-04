export function indentBlock(text: string, indent = "  "): string {
  return text.split(/\r?\n/).map((line) => `${indent}${line}`).join("\n");
}
