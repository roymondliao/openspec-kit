import { Command } from "commander";
import { initTemplates } from "./commands/init.js";
import { updateConfig } from "./commands/update.js";

export async function run(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("opsx-kit")
    .description("Project-scoped helpers for OpenSpec context templates")
    .showHelpAfterError()
    .showSuggestionAfterError();

  program
    .command("init")
    .description("Scaffold blank template files for editing")
    .option("--dir <target>", "Target directory for scaffolded files")
    .option("--project <dir>", "Project root (used to locate openspec/)")
    .option("--files <list>", "Comma-separated list of files to initialize")
    .action(async (options: { dir?: string; project?: string; files?: string }) => {
      await initTemplates({ dir: options.dir, project: options.project, files: options.files });
    });

  program
    .command("update")
    .description("Inject template content into openspec/config.yaml")
    .option("--files <list>", "Comma-separated list of files to inject")
    .option("--source <dir>", "Source directory containing filled-in templates")
    .option("--project <dir>", "Project root (used to locate openspec/)")
    .action(
      async (options: { files?: string; source?: string; project?: string }) => {
        await updateConfig({
          files: options.files,
          source: options.source,
          project: options.project,
        });
      },
    );

  await program.parseAsync(argv);
}
