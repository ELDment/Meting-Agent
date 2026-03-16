#!/usr/bin/env node

import { access, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const generatedBanner = [
  "/**",
  " * Generated from shared/meting by scripts/sync-mcp-core.mjs.",
  " * Do not edit this copy directly.",
  " */",
  "",
].join("\r\n");

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);
const repositoryRoot = resolve(scriptDirectory, "..");
const sharedRoot = resolve(repositoryRoot, "shared", "meting");
const targetRoot = resolve(repositoryRoot, "mcp", "src", "meting");

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

async function WriteGeneratedCopy(sourceRoot, destinationRoot, relativePath) {
  const sourcePath = resolve(sourceRoot, relativePath);
  const targetPath = resolve(destinationRoot, relativePath);
  const sourceContent = NormalizeContent(await readFile(sourcePath, "utf8"));
  const nextContent = `${generatedBanner}${sourceContent}`;

  await mkdir(dirname(targetPath), { recursive: true });

  const currentContent = (await PathExists(targetPath)) ? await readFile(targetPath, "utf8") : null;

  if (currentContent === nextContent) {
    return;
  }

  await writeFile(targetPath, nextContent, "utf8");
  process.stdout.write(
    `[sync-mcp] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
  );
}

async function Main() {
  if (!(await PathExists(sharedRoot))) {
    process.stdout.write("[sync-mcp] shared/meting not found, skipping sync.\n");
    return;
  }

  const relativeFiles = await CollectRelativeFiles(sharedRoot);

  for (const relativePath of relativeFiles) {
    await WriteGeneratedCopy(sharedRoot, targetRoot, relativePath);
  }
}

Main().catch((error) => {
  process.stderr.write(
    `[sync-mcp] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
