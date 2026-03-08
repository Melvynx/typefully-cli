import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const draftsResource = new Command("drafts")
  .description("Manage drafts for a social set");

// ── LIST ──────────────────────────────────────────────
draftsResource
  .command("list")
  .description("List drafts for a social set")
  .argument("<social-set-id>", "Social set ID")
  .option("--limit <n>", "Max results (max 50)", "20")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--status <status>", "Filter by status: draft, scheduled, published, publishing, error")
  .option("--tags <tags>", "Filter by tag slugs (comma-separated)")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli drafts list 12345\n  typefully-cli drafts list 12345 --status scheduled --json\n  typefully-cli drafts list 12345 --limit 5 --tags marketing",
  )
  .action(async (socialSetId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {
        limit: opts.limit ?? "20",
        offset: opts.offset ?? "0",
      };
      if (opts.status) params.status = opts.status;
      if (opts.tags) params.tags = opts.tags;

      const data = (await client.get(
        `/v2/social-sets/${socialSetId}/drafts`,
        params,
      )) as { results: unknown[] };
      output(data.results, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── GET ───────────────────────────────────────────────
draftsResource
  .command("get")
  .description("Get a specific draft by ID")
  .argument("<social-set-id>", "Social set ID")
  .argument("<draft-id>", "Draft ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli drafts get 12345 67890\n  typefully-cli drafts get 12345 67890 --json",
  )
  .action(async (socialSetId: string, draftId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(
        `/v2/social-sets/${socialSetId}/drafts/${draftId}`,
      );
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── CREATE ────────────────────────────────────────────
draftsResource
  .command("create")
  .description("Create a new draft")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--text <text>", "Post text content")
  .option("--platform <platforms>", "Comma-separated platforms: x,linkedin,mastodon,threads,bluesky", "x")
  .option("--title <title>", "Draft title (internal only)")
  .option("--tags <tags>", "Comma-separated tag slugs")
  .option("--publish-at <when>", 'When to publish: "now", "next-free-slot", or ISO 8601 datetime')
  .option("--share", "Generate a public share URL")
  .option("--media-ids <ids>", "Comma-separated media IDs to attach")
  .option("--scratchpad <text>", "Scratchpad notes")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  typefully-cli drafts create 12345 --text "Hello world!" --platform x,linkedin\n  typefully-cli drafts create 12345 --text "Scheduled post" --publish-at "next-free-slot" --json\n  typefully-cli drafts create 12345 --text "Now!" --publish-at now',
  )
  .action(async (socialSetId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const platforms = (opts.platform as string ?? "x").split(",");
      const mediaIds = opts.mediaIds ? (opts.mediaIds as string).split(",") : undefined;

      const platformConfig: Record<string, unknown> = {};
      for (const p of platforms) {
        const trimmed = p.trim();
        platformConfig[trimmed] = {
          enabled: true,
          posts: [
            {
              text: opts.text as string,
              ...(mediaIds && { media_ids: mediaIds }),
            },
          ],
          settings: {},
        };
      }

      const body: Record<string, unknown> = { platforms: platformConfig };
      if (opts.title) body.draft_title = opts.title;
      if (opts.tags) body.tags = (opts.tags as string).split(",");
      if (opts.publishAt) body.publish_at = opts.publishAt;
      if (opts.share) body.share = true;
      if (opts.scratchpad) body.scratchpad_text = opts.scratchpad;

      const data = await client.post(
        `/v2/social-sets/${socialSetId}/drafts`,
        body,
      );
      output(data, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── UPDATE ────────────────────────────────────────────
draftsResource
  .command("update")
  .description("Update an existing draft")
  .argument("<social-set-id>", "Social set ID")
  .argument("<draft-id>", "Draft ID")
  .option("--text <text>", "New post text (updates all enabled platforms)")
  .option("--platform <platforms>", "Comma-separated platforms to update")
  .option("--title <title>", "New draft title")
  .option("--tags <tags>", "New comma-separated tag slugs")
  .option("--publish-at <when>", 'When to publish: "now", "next-free-slot", or ISO 8601 datetime')
  .option("--share", "Generate a public share URL")
  .option("--scratchpad <text>", "New scratchpad notes")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  typefully-cli drafts update 12345 67890 --text "Updated text"\n  typefully-cli drafts update 12345 67890 --publish-at now --json',
  )
  .action(async (socialSetId: string, draftId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};

      if (opts.text && opts.platform) {
        const platforms = (opts.platform as string).split(",");
        const platformConfig: Record<string, unknown> = {};
        for (const p of platforms) {
          platformConfig[p.trim()] = {
            enabled: true,
            posts: [{ text: opts.text as string }],
            settings: {},
          };
        }
        body.platforms = platformConfig;
      } else if (opts.text) {
        body.platforms = {
          x: { enabled: true, posts: [{ text: opts.text as string }], settings: {} },
        };
      }

      if (opts.title) body.draft_title = opts.title;
      if (opts.tags) body.tags = (opts.tags as string).split(",");
      if (opts.publishAt) body.publish_at = opts.publishAt;
      if (opts.share) body.share = true;
      if (opts.scratchpad) body.scratchpad_text = opts.scratchpad;

      const data = await client.patch(
        `/v2/social-sets/${socialSetId}/drafts/${draftId}`,
        body,
      );
      output(data, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// ── DELETE ────────────────────────────────────────────
draftsResource
  .command("delete")
  .description("Delete a draft")
  .argument("<social-set-id>", "Social set ID")
  .argument("<draft-id>", "Draft ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli drafts delete 12345 67890\n  typefully-cli drafts delete 12345 67890 --json",
  )
  .action(async (socialSetId: string, draftId: string, opts: { json?: boolean }) => {
    try {
      await client.delete(
        `/v2/social-sets/${socialSetId}/drafts/${draftId}`,
      );
      output({ deleted: true, draft_id: draftId, social_set_id: socialSetId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
