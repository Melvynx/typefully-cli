import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const mediaResource = new Command("media")
  .description("Manage media uploads for a social set");

// ── UPLOAD ────────────────────────────────────────────
mediaResource
  .command("upload")
  .description("Create a presigned upload URL for media")
  .argument("<social-set-id>", "Social set ID")
  .requiredOption("--file-name <name>", "Filename with extension (e.g. image.jpg, video.mp4)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  typefully-cli media upload 12345 --file-name "photo.jpg" --json\n\nAfter receiving the upload_url, PUT the raw file bytes to it:\n  curl -T photo.jpg "$UPLOAD_URL"',
  )
  .action(async (socialSetId: string, opts: { fileName: string; json?: boolean; format?: string }) => {
    try {
      const data = await client.post(
        `/v2/social-sets/${socialSetId}/media/upload`,
        { file_name: opts.fileName },
      );
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// ── STATUS ────────────────────────────────────────────
mediaResource
  .command("status")
  .description("Check processing status of uploaded media")
  .argument("<social-set-id>", "Social set ID")
  .argument("<media-id>", "Media UUID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  typefully-cli media status 12345 550e8400-e29b-41d4-a716-446655440000\n  typefully-cli media status 12345 550e8400-e29b-41d4-a716-446655440000 --json",
  )
  .action(async (socialSetId: string, mediaId: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(
        `/v2/social-sets/${socialSetId}/media/${mediaId}`,
      );
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
