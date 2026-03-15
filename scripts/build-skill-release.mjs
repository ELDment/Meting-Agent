#!/usr/bin/env node

import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const generatedBanner = [
  "/**",
  " * Generated from shared/core-src by scripts/build-skill-release.mjs.",
  " * Do not edit this copy directly.",
  " */",
  "",
].join("\r\n");

const staticFiles = Object.freeze([
  "SKILL.md",
  "agents/openai.yaml",
  "scripts/package.json",
  "scripts/meting-cli.mjs",
]);

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);
const repositoryRoot = resolve(scriptDirectory, "..");
const sharedRoot = resolve(repositoryRoot, "shared", "core-src");
const skillSourceRoot = resolve(repositoryRoot, "skills", "meting-agent");
const outputRoot = resolve(repositoryRoot, "dist", "meting-agent-skill");
const outputCoreRoot = resolve(outputRoot, "scripts", "core");

async function PathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function NormalizeContent(content) {
  return content.replace(/\r?\n/g, "\r\n");
}

async function CollectRelativeFiles(rootPath, currentPath = rootPath) {
  const entries = await readdir(currentPath, { withFileTypes: true });
  const relativeFiles = [];

  for (const entry of entries) {
    const absolutePath = resolve(currentPath, entry.name);

    if (entry.isDirectory()) {
      relativeFiles.push(...(await CollectRelativeFiles(rootPath, absolutePath)));
      continue;
    }

    relativeFiles.push(relative(rootPath, absolutePath));
  }

  return relativeFiles;
}

async function CopyStaticFile(relativePath) {
  const sourcePath = resolve(skillSourceRoot, relativePath);
  const targetPath = resolve(outputRoot, relativePath);

  await mkdir(dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { force: true });
  process.stdout.write(
    `[build-skill] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

async function CopyGeneratedCoreFile(relativePath) {
  const sourcePath = resolve(sharedRoot, relativePath);
  const targetPath = resolve(outputCoreRoot, relativePath);
  const sourceContent = NormalizeContent(await readFile(sourcePath, "utf8"));
  const nextContent = `${generatedBanner}${sourceContent}`;

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, nextContent, "utf8");
  process.stdout.write(
    `[build-skill] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

async function Main() {
  if (!(await PathExists(sharedRoot))) {
    throw new Error("shared/core-src not found.");
  }

  if (!(await PathExists(skillSourceRoot))) {
    throw new Error("skills/meting-agent not found.");
  }

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  for (const relativePath of staticFiles) {
    await CopyStaticFile(relativePath);
  }

  const relativeFiles = await CollectRelativeFiles(sharedRoot);

  for (const relativePath of relativeFiles) {
    await CopyGeneratedCoreFile(relativePath);
  }
}

Main().catch((error) => {
  process.stderr.write(
    `[build-skill] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
