import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const queueResource = new Command("queue")
  .description("Manage posting queue and schedule");

// ── VIEW ──────────────────────────────────────────────
queueResource
  .command("view")
  .description("View queue slots and scheduled drafts for a date range")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--start <date>", "Start date (YYYY-MM-DD)")
  .requiredOption("--end <date>", "End date (YYYY-MM-DD, max 62 days range)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli queue view 12345 --start 2026-03-01 --end 2026-03-31\n  typefully-cli queue view 12345 --start 2026-03-01 --end 2026-03-07 --json",
  )
  .action(async (socialSetId: string, opts: { start: string; end: string; json?: boolean; format?: string }) => {
    try {
      const data = await client.get(
        `/v2/social-sets/${socialSetId}/queue`,
        { start_date: opts.start, end_date: opts.end },
      );
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SCHEDULE GET ──────────────────────────────────────
queueResource
  .command("schedule")
  .description("Get queue schedule rules")
  .argument("<social-set-id>", "Social set ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli queue schedule 12345\n  typefully-cli queue schedule 12345 --json",
  )
  .action(async (socialSetId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(
        `/v2/social-sets/${socialSetId}/queue/schedule`,
      );
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── SCHEDULE SET ──────────────────────────────────────
queueResource
  .command("schedule-set")
  .description("Replace queue schedule rules (full replacement)")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--rules <json>", "Schedule rules as JSON array, e.g. [{\"h\":9,\"m\":0,\"days\":[\"mon\",\"wed\",\"fri\"]}]")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    `\nExamples:\n  typefully-cli queue schedule-set 12345 --rules '[{"h":9,"m":0,"days":["mon","wed","fri"]}]' --json\n  typefully-cli queue schedule-set 12345 --rules '[]'`,
  )
  .action(async (socialSetId: string, opts: { rules: string; json?: boolean }) => {
    try {
      let rules: unknown;
      try {
        rules = JSON.parse(opts.rules);
      } catch {
        throw new Error("Invalid JSON for --rules. Provide a valid JSON array.");
      }
      const data = await client.put(
        `/v2/social-sets/${socialSetId}/queue/schedule`,
        { rules },
      );
      output(data, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
