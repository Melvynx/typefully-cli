import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tagsResource = new Command("tags")
  .description("Manage tags for a social set");

// ── LIST ──────────────────────────────────────────────
tagsResource
  .command("list")
  .description("List all tags for a social set")
  .argument("<social-set-id>", "Social set ID")
  .option("--limit <n>", "Max results (max 50)", "50")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli tags list 12345\n  typefully-cli tags list 12345 --json",
  )
  .action(async (socialSetId: string, opts: Record<string, string | undefined>) => {
    try {
      const data = (await client.get(
        `/v2/social-sets/${socialSetId}/tags`,
        { limit: opts.limit ?? "50", offset: opts.offset ?? "0" },
      )) as { results: unknown[] };
      output(data.results, {
        json: !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
tagsResource
  .command("create")
  .description("Create a new tag")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--name <name>", "Tag display name")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  typefully-cli tags create 12345 --name "Marketing"\n  typefully-cli tags create 12345 --name "Product Updates" --json',
  )
  .action(async (socialSetId: string, opts: { name: string; json?: boolean }) => {
    try {
      const data = await client.post(
        `/v2/social-sets/${socialSetId}/tags`,
        { name: opts.name },
      );
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
