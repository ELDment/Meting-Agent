#!/usr/bin/env node

import { BuildSkillOutput, skillOutputRoot } from "./skill-layout.mjs";

async function Main() {
  await BuildSkillOutput(skillOutputRoot, "sync-skills");
}

Main().catch((error) => {
  process.stderr.write(
    `[sync-skills] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
