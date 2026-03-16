---
name: meting-agent
description: Use when an AI agent needs direct music lookup capabilities through the bundled Meting scripts in this skill, including song search, album lookup, artist lookup, playlist lookup, lyrics, cover URLs, and playback URLs, or when it needs to maintain this skill's standalone music client implementation.
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
4. Remember the default cookie resolution order: environment variable `METING_<PLATFORM>_COOKIE` first, environment variable `METING_COOKIE` second, and CLI option `--cookie` only as the final override.

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

- Follow the default cookie resolution order used by the program: `METING_<PLATFORM>_COOKIE` first, `METING_COOKIE` second, and `--cookie <value>` last.
- Treat `METING_<PLATFORM>_COOKIE` and `METING_COOKIE` as environment variable names, not CLI options.
- Available environment variables include `METING_NETEASE_COOKIE`, `METING_TENCENT_COOKIE`, `METING_KUGOU_COOKIE`, `METING_BAIDU_COOKIE`, `METING_KUWO_COOKIE`, and shared fallback `METING_COOKIE`.
- Use CLI option `--cookie <value>` only when the call needs an explicit one-off override.
