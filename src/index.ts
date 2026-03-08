#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { meResource } from "./resources/me.js";
import { socialSetsResource } from "./resources/social-sets.js";
import { draftsResource } from "./resources/drafts.js";
import { mediaResource } from "./resources/media.js";
import { tagsResource } from "./resources/tags.js";
import { queueResource } from "./resources/queue.js";

const program = new Command();

program
  .name("typefully-cli")
  .description("CLI for the Typefully API (v2) — manage social media drafts, schedule posts, and publish content")
  .version("0.1.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

program.addCommand(authCommand);
program.addCommand(meResource);
program.addCommand(socialSetsResource);
program.addCommand(draftsResource);
program.addCommand(mediaResource);
program.addCommand(tagsResource);
program.addCommand(queueResource);

program.parse();
