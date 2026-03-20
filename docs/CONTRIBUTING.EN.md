<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <a href="./CONTRIBUTING.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

<p align="right"><a href="../README.md">⬅️ Back to Home</a></p>

# CONTRIBUTING

This repository uses a "shared source + generated copies" maintenance model. Before you submit changes, understand the sync relationships first, or it is easy to modify the wrong location.

## How generated copies are maintained

The repository uses `shared/meting/` as the source of truth. The generated runtime copies under `mcp/src/meting/` and `skills/meting-agent/scripts/meting/` are branch artifacts that GitHub Actions force-syncs after pushes to `main` and `dev`.

That means:

- A later clone of `main` or `dev` should receive the latest synced copies after the workflow has pushed them back.
- You still should not treat those generated directories as hand-maintained source. Manual edits there can be overwritten by the next workflow sync.
- The `mcp/` build runs `sync:core` automatically inside its npm scripts, but if you debug only the generated files and ignore `shared/meting/`, you can easily reach the wrong conclusion.

The simplified mental model is: maintain `shared/meting/` first, sync the generated copies only for verification or release, and let GitHub Actions normalize the tracked copies on `main` and `dev`.

## Recommended workflow

1. Update core logic in `shared/meting/` first
2. Run the sync scripts to generate the `mcp` and skill copies
3. Verify the `mcp` package and the skill runtime files locally if needed
4. Push to `main` or `dev`, then let GitHub Actions overwrite, commit, and publish the synced copies

## Common commands

Sync the shared core into both generated directories:

```powershell
npm run sync:all
```

Sync only the `mcp/` copy:

```powershell
npm run sync:mcp
```

Sync only the skill copy:

```powershell
npm run sync:skill
```

Verify root-level document formatting:

```powershell
npm run format:check
```

Verify the `mcp` subproject:

```powershell
cd mcp
npm install
npm run verify
```

## Pre-commit checklist

- Did the core change happen in `shared/meting/`?
- Did you regenerate the local copies you needed for verification?
- Did you finish `mcp` verification?
- If you changed documents, did `npm run format:check` pass?
- Did you avoid treating generated copies as the primary edit target?
