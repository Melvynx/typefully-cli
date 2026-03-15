# typefully-cli

CLI for the Typefully API (v2). Made with [api2cli.dev](https://api2cli.dev).

Manage social media drafts, schedule posts, upload media, and publish content across X, LinkedIn, Mastodon, Threads, and Bluesky.

## Install

```bash
npx api2cli install Melvynx/typefully-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/typefully-cli
```

## Auth

```bash
typefully-cli auth set <token>      # Save your API token
typefully-cli auth show             # Display current token (masked)
typefully-cli auth show --raw       # Display full unmasked token
typefully-cli auth test             # Verify token with a test API call
typefully-cli auth remove           # Delete saved token
```

## Resources

### me

```bash
typefully-cli me                    # Get current authenticated user
typefully-cli me --json
```

### social-sets

```bash
# List all social sets
typefully-cli social-sets list
typefully-cli social-sets list --limit 10 --offset 0 --json

# Get social set details
typefully-cli social-sets get <id>
typefully-cli social-sets get <id> --json

# Resolve LinkedIn company URL to mention syntax
typefully-cli social-sets resolve-linkedin <social-set-id> --url "https://linkedin.com/company/typefully" --json
```

**list flags:** `--limit <n>` (max 50, default 50), `--offset <n>`, `--fields <cols>`

### drafts

```bash
# List drafts
typefully-cli drafts list <social-set-id>
typefully-cli drafts list <social-set-id> --status scheduled --json
typefully-cli drafts list <social-set-id> --limit 5 --tags marketing

# Get a draft
typefully-cli drafts get <social-set-id> <draft-id> --json

# Create a draft
typefully-cli drafts create <social-set-id> --text "Hello world!" --platform x,linkedin
typefully-cli drafts create <social-set-id> --text "Scheduled" --publish-at next-free-slot --json
typefully-cli drafts create <social-set-id> --text "Now!" --publish-at now

# Update a draft
typefully-cli drafts update <social-set-id> <draft-id> --text "Updated text"
typefully-cli drafts update <social-set-id> <draft-id> --publish-at now --json

# Delete a draft
typefully-cli drafts delete <social-set-id> <draft-id>
```

**list flags:** `--limit <n>` (max 50, default 20), `--offset <n>`, `--status <draft|scheduled|published|publishing|error>`, `--tags <slugs>`, `--fields <cols>`

**create flags:** `--text <text>`, `--platform <x,linkedin,mastodon,threads,bluesky>` (default: x), `--title <title>`, `--tags <slugs>`, `--publish-at <now|next-free-slot|ISO8601>`, `--share`, `--media-ids <ids>`, `--scratchpad <text>`

**update flags:** `--text <text>`, `--platform <platforms>`, `--title <title>`, `--tags <slugs>`, `--publish-at <when>`, `--share`, `--scratchpad <text>`

### media

```bash
# Get a presigned upload URL
typefully-cli media upload <social-set-id> --file-name "photo.jpg" --json

# Then upload the file
curl -T photo.jpg "$UPLOAD_URL"

# Check processing status
typefully-cli media status <social-set-id> <media-id> --json
```

**upload flags:** `--file-name <name>`

### tags

```bash
# List all tags
typefully-cli tags list <social-set-id>
typefully-cli tags list <social-set-id> --json

# Create a tag
typefully-cli tags create <social-set-id> --name "Marketing" --json
```

**list flags:** `--limit <n>` (max 50, default 50), `--offset <n>`, `--fields <cols>`

**create flags:** `--name <name>`

### queue

```bash
# View queue slots for a date range
typefully-cli queue view <social-set-id> --start 2026-03-01 --end 2026-03-31
typefully-cli queue view <social-set-id> --start 2026-03-01 --end 2026-03-07 --json

# Get schedule rules
typefully-cli queue schedule <social-set-id> --json

# Replace schedule rules
typefully-cli queue schedule-set <social-set-id> --rules '[{"h":9,"m":0,"days":["mon","wed","fri"]}]' --json
typefully-cli queue schedule-set <social-set-id> --rules '[]'
```

**view flags:** `--start <YYYY-MM-DD>`, `--end <YYYY-MM-DD>` (max 62 days range)

**schedule-set flags:** `--rules <json>` (JSON array of schedule rules)

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
