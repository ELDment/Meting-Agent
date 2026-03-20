<p align="right"><a href="./CONTRIBUTING.md">简体中文</a> | <a href="./CONTRIBUTING.zh-Hant.md">繁體中文</a> | <strong>English</strong></p>

<p align="right"><a href="../README.md">⬅️ Back to Home</a></p>

# CONTRIBUTING

This repository uses a "shared source + generated copies" maintenance model. Before you submit changes, understand the sync relationships first, or it is easy to modify the wrong location.

## Directory responsibilities

- `shared/meting/`: the only core implementation source
- `skill-source/meting-agent/`: skill shell source, including `README`, `SKILL.md`, agent config, and CLI
- `skills/meting-agent/`: committed generated directory kept for GitHub repository based one-click installation
- `dist/skills/meting-agent/`: temporary release output, not committed
- `mcp/src/meting/`: generated MCP runtime copy from `shared/meting/`

The simplified mental model is: the only maintainable source of truth is `shared/meting/` plus `skill-source/meting-agent/`. Even though `skills/meting-agent/` is committed, it is still generated and must not be edited directly.

## Recommended workflow

1. Update core logic in `shared/meting/` first
2. Update skill shell files in `skill-source/meting-agent/`
3. Run the sync scripts to generate the `mcp` and `skills` copies
4. Run the build script to generate the skill release bundle
5. Verify the `mcp` package and the skill artifacts separately

## Common commands

Sync the shared core into `mcp/`:

```powershell
node scripts/sync-mcp-core.mjs
```

Sync the committed skill install directory:

```powershell
node scripts/sync-skills.mjs
```

Build the skill release bundle:

```powershell
node scripts/build-skill-release.mjs
```

Verify that `skills/` has not been edited manually:

```powershell
npm run verify:skills
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

## `skills/` directory rules

- `skills/meting-agent/` is a generated directory, not a handwritten source directory
- Do not edit `skills/meting-agent/` directly; CI runs `node scripts/sync-skills.mjs` and fails if that directory changes
- If you meant to edit `README.md`, `SKILL.md`, `scripts/meting-cli.mjs`, or `agents/openai.yaml`, edit `skill-source/meting-agent/` and sync again

## Pre-commit checklist

- Did the core change happen in `shared/meting/`?
- Did the skill shell change happen in `skill-source/meting-agent/` instead of `skills/meting-agent/`?
- Did you regenerate the copies or artifacts that should be committed?
- Did you finish `mcp` verification?
- If you changed documents, did `npm run format:check` pass?
