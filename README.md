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

## Usage

```bash
typefully-cli auth set "your-token"
typefully-cli auth test
typefully-cli --help
```

## Resources

### me

| Command | Description |
|---------|-------------|
| `typefully-cli me --json` | Get current authenticated user |

### social-sets

| Command | Description |
|---------|-------------|
| `typefully-cli social-sets list --json` | List all social sets (accounts) |
| `typefully-cli social-sets get <id> --json` | Get social set details with platform accounts |
| `typefully-cli social-sets resolve-linkedin <social-set-id> --url <url> --json` | Resolve LinkedIn company URL to mention syntax |

### drafts

| Command | Description |
|---------|-------------|
| `typefully-cli drafts list <social-set-id> --json` | List all drafts |
| `typefully-cli drafts list <social-set-id> --status scheduled --json` | List scheduled drafts |
| `typefully-cli drafts get <social-set-id> <draft-id> --json` | Get a draft by ID |
| `typefully-cli drafts create <social-set-id> --text "Hello!" --platform x,linkedin --json` | Create a draft |
| `typefully-cli drafts create <social-set-id> --text "Now!" --publish-at now --json` | Publish immediately |
| `typefully-cli drafts create <social-set-id> --text "Queued" --publish-at next-free-slot --json` | Schedule to next slot |
| `typefully-cli drafts update <social-set-id> <draft-id> --text "Updated" --json` | Update draft text |
| `typefully-cli drafts delete <social-set-id> <draft-id> --json` | Delete a draft |

### media

| Command | Description |
|---------|-------------|
| `typefully-cli media upload <social-set-id> --file-name "photo.jpg" --json` | Get presigned upload URL |
| `typefully-cli media status <social-set-id> <media-id> --json` | Check media processing status |

### tags

| Command | Description |
|---------|-------------|
| `typefully-cli tags list <social-set-id> --json` | List all tags |
| `typefully-cli tags create <social-set-id> --name "Marketing" --json` | Create a new tag |

### queue

| Command | Description |
|---------|-------------|
| `typefully-cli queue view <social-set-id> --start 2026-03-01 --end 2026-03-31 --json` | View queue slots |
| `typefully-cli queue schedule <social-set-id> --json` | Get queue schedule rules |
| `typefully-cli queue schedule-set <social-set-id> --rules '<json>' --json` | Replace queue schedule |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
