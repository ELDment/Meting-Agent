---
name: meting-agent
description: Use when Codex needs direct music lookup capabilities through bundled Meting scripts in this skill, including song search, album lookup, artist lookup, playlist lookup, lyrics, cover URLs, and playback URLs, or when it needs to maintain this skill's standalone music client implementation.
---

# Meting Agent

## Use The Bundled Implementation

- In the release bundle, treat `./scripts/meting` as the implementation root.
- Use `./scripts/meting-cli.mjs` for normal lookup tasks.
- Downloaded bundles are self-contained and should not rely on repository-relative paths.

## Core Workflow

1. Run `node scripts/meting-cli.mjs platforms` to inspect supported platforms.
2. Run `node scripts/meting-cli.mjs search --platform netease --keyword "我怀念的" --limit 3` for search tasks.
3. Run `node scripts/meting-cli.mjs song --platform netease --id <songId>` and related commands for detail lookups.
4. Set `METING_<PLATFORM>_COOKIE` or `METING_COOKIE` before commands that need authenticated access.

## Commands

- `platforms`
- `search --platform <code> --keyword <text> [--page <n>] [--limit <n>] [--type <n>]`
- `song --platform <code> --id <id>`
- `album --platform <code> --id <id>`
- `artist --platform <code> --id <id> [--limit <n>]`
- `playlist --platform <code> --id <id>`
- `url --platform <code> --id <id> [--br <n>]`
- `lyric --platform <code> --id <id>`
- `pic --platform <code> --id <id> [--size <n>]`

## Configuration Rules

- Prefer `METING_<PLATFORM>_COOKIE` for per-platform cookies.
- Use `METING_COOKIE` as a shared fallback.
- Use `--cookie <value>` only when the call needs an explicit override.
