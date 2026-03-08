import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const meResource = new Command("me")
  .description("Get current authenticated user")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli me\n  typefully-cli me --json",
  )
  .action(async (opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get("/v2/me");
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
