#!/usr/bin/env node

import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const generatedBanner = [
  "/**",
  " * Generated from shared/meting by scripts/build-skill-release.mjs.",
  " * Do not edit this copy directly.",
  " */",
  "",
].join("\r\n");

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);
const repositoryRoot = resolve(scriptDirectory, "..");
const sharedRoot = resolve(repositoryRoot, "shared", "meting");
const skillRoot = resolve(repositoryRoot, "skills", "meting-agent");
const targetRoot = resolve(skillRoot, "scripts", "meting");

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

async function WriteGeneratedCoreFile(relativePath) {
  const sourcePath = resolve(sharedRoot, relativePath);
  const targetPath = resolve(targetRoot, relativePath);
  const sourceContent = NormalizeContent(await readFile(sourcePath, "utf8"));
  const nextContent = `${generatedBanner}${sourceContent}`;

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, nextContent, "utf8");
  process.stdout.write(
    `[sync-skill] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

async function Main() {
  if (!(await PathExists(sharedRoot))) {
    throw new Error("shared/meting not found.");
  }

  if (!(await PathExists(skillRoot))) {
    throw new Error("skills/meting-agent not found.");
  }

  await rm(targetRoot, { recursive: true, force: true });

  const relativeFiles = await CollectRelativeFiles(sharedRoot);

  for (const relativePath of relativeFiles) {
    await WriteGeneratedCoreFile(relativePath);
  }
}

Main().catch((error) => {
  process.stderr.write(
    `[sync-skill] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
