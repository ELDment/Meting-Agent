#!/usr/bin/env node

import { rm } from "node:fs/promises";
import {
  BuildSkillOutput,
  legacyReleaseRoot,
  releaseOutputRoot,
  releaseSkillsRoot,
} from "./skill-layout.mjs";

async function Main() {
  await rm(legacyReleaseRoot, { recursive: true, force: true });
  await rm(releaseSkillsRoot, { recursive: true, force: true });
  await BuildSkillOutput(releaseOutputRoot, "build-skill");
}

Main().catch((error) => {
  process.stderr.write(
    `[build-skill] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
