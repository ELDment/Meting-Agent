<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <a href="./CONTRIBUTING.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

<p align="right"><a href="../README.md">⬅️ Back to Home</a></p>

# CONTRIBUTING

This repository uses a "shared source + generated copies" maintenance model. Before you submit changes, understand the sync relationships first, or it is easy to modify the wrong location.

## Why you cannot build immediately after cloning

The repository keeps the shared source by default. It does not commit the skill release artifacts, and it does not permanently maintain every runtime copy from `shared/meting/` inside each target directory.

After a fresh clone, you will hit two practical constraints:

- The distributable skill artifacts live under `dist/skills/meting-agent/scripts/meting/`, and that directory is generated only after running the build script.
- The `mcp/` build runs `sync:core` automatically inside its npm scripts, but if you skip the sync prerequisite and debug generated files directly, you can easily reach the wrong conclusion.

The simplified mental model is: this repository does not keep a complete, static, directly maintained source copy inside every deliverable directory. You maintain `shared/meting/` first, then generate copies for `mcp/src/meting/` and the skill bundle.

## Recommended workflow

1. Update core logic in `shared/meting/` first
2. Run the sync script to generate the `mcp` copy
3. Run the build script to generate the skill release bundle
4. Verify the `mcp` package and the skill artifacts separately

## Common commands

Sync the shared core into `mcp/`:

```powershell
node scripts/sync-mcp-core.mjs
```

Build the skill release bundle:

```powershell
node scripts/build-skill-release.mjs
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
- Did you regenerate the copies or artifacts that should be committed?
- Did you finish `mcp` verification?
- If you changed documents, did `npm run format:check` pass?
