import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

interface ListOpts {
  json?: boolean;
  format?: string;
  fields?: string;
  limit?: string;
  offset?: string;
}

export const socialSetsResource = new Command("social-sets")
  .description("Manage social sets (accounts)");

socialSetsResource
  .command("list")
  .description("List all social sets you can access")
  .option("--limit <n>", "Max results (max 50)", "50")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli social-sets list\n  typefully-cli social-sets list --json",
  )
  .action(async (opts: ListOpts) => {
    try {
      const data = (await client.get("/v2/social-sets", {
        limit: opts.limit ?? "50",
        offset: opts.offset ?? "0",
      })) as { results: unknown[] };
      output(data.results, {
        json: opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

socialSetsResource
  .command("get")
  .description("Get social set details including platform accounts")
  .argument("<id>", "Social set ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli social-sets get 12345\n  typefully-cli social-sets get 12345 --json",
  )
  .action(
    async (id: string, opts: { json?: boolean; format?: string }) => {
      try {
        const data = await client.get(`/v2/social-sets/${id}/`);
        output(data, { json: opts.json, format: opts.format });
      } catch (err) {
        handleError(err, opts.json);
      }
    },
  );

socialSetsResource
  .command("resolve-linkedin")
  .description("Resolve a LinkedIn company URL into mention syntax")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--url <url>", "LinkedIn company/school URL")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  typefully-cli social-sets resolve-linkedin 12345 --url "https://linkedin.com/company/typefully" --json',
  )
  .action(
    async (
      socialSetId: string,
      opts: { url: string; json?: boolean; format?: string },
    ) => {
      try {
        const data = await client.get(
          `/v2/social-sets/${socialSetId}/linkedin/organizations/resolve`,
          { url: opts.url },
        );
        output(data, { json: opts.json, format: opts.format });
      } catch (err) {
        handleError(err, opts.json);
      }
    },
  );
