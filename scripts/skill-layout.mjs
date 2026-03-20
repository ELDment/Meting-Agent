#!/usr/bin/env node

import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const generatedBanner = [
  "/**",
  " * Generated from shared/meting by scripts/skill-layout.mjs.",
  " * Do not edit this copy directly.",
  " */",
  "",
].join("\r\n");

export const staticFiles = Object.freeze([
  "LICENSE",
  "README.md",
  "README.zh-Hant.md",
  "README.EN.md",
  "SKILL.md",
  "agents/openai.yaml",
  "scripts/package.json",
  "scripts/meting-cli.mjs",
]);

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);

export const repositoryRoot = resolve(scriptDirectory, "..");
export const sharedRoot = resolve(repositoryRoot, "shared", "meting");
export const skillSourceRoot = resolve(repositoryRoot, "skill-source", "meting-agent");
export const skillOutputRoot = resolve(repositoryRoot, "skills", "meting-agent");
export const releaseSkillsRoot = resolve(repositoryRoot, "dist", "skills");
export const releaseOutputRoot = resolve(releaseSkillsRoot, "meting-agent");
export const legacyReleaseRoot = resolve(repositoryRoot, "dist", "meting-agent-skill");

export async function PathExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function NormalizeContent(content) {
  return content.replace(/\r?\n/g, "\r\n");
}

export async function CollectRelativeFiles(rootPath, currentPath = rootPath) {
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

async function CopyStaticFile(outputRoot, relativePath, logPrefix) {
  const sourcePath = resolve(skillSourceRoot, relativePath);
  const targetPath = resolve(outputRoot, relativePath);

  await mkdir(dirname(targetPath), { recursive: true });
  await cp(sourcePath, targetPath, { force: true });
  process.stdout.write(
    `[${logPrefix}] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

async function CopyGeneratedCoreFile(outputRoot, relativePath, logPrefix) {
  const sourcePath = resolve(sharedRoot, relativePath);
  const targetPath = resolve(outputRoot, "scripts", "meting", relativePath);
  const sourceContent = NormalizeContent(await readFile(sourcePath, "utf8"));
  const nextContent = `${generatedBanner}${sourceContent}`;

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, nextContent, "utf8");
  process.stdout.write(
    `[${logPrefix}] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

export async function BuildSkillOutput(outputRoot, logPrefix) {
  if (!(await PathExists(sharedRoot))) {
    throw new Error("shared/meting not found.");
  }

  if (!(await PathExists(skillSourceRoot))) {
    throw new Error("skill-source/meting-agent not found.");
  }

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  for (const relativePath of staticFiles) {
    await CopyStaticFile(outputRoot, relativePath, logPrefix);
  }

  const relativeFiles = await CollectRelativeFiles(sharedRoot);

  for (const relativePath of relativeFiles) {
    await CopyGeneratedCoreFile(outputRoot, relativePath, logPrefix);
  }
}
