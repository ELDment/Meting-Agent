#!/usr/bin/env node

import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = dirname(scriptPath);
const repositoryRoot = resolve(scriptDirectory, "..");
const sharedRoot = resolve(repositoryRoot, "shared", "meting");
const driftExitCode = 10;

const targetCatalog = Object.freeze({
  mcp: {
    label: "sync-mcp",
    bannerSource: "scripts/sync-generated.mjs sync mcp",
    targetRoot: resolve(repositoryRoot, "mcp", "src", "meting"),
    missingShared: "skip",
  },
  skill: {
    label: "sync-skill",
    bannerSource: "scripts/sync-generated.mjs sync skill",
    targetRoot: resolve(repositoryRoot, "skills", "meting-agent", "scripts", "meting"),
    requiredRoot: resolve(repositoryRoot, "skills", "meting-agent"),
    missingShared: "error",
  },
});

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

function GetGeneratedBanner(config) {
  return [
    "/**",
    ` * Generated from shared/meting by ${config.bannerSource}.`,
    " * Do not edit this copy directly.",
    " */",
    "",
  ].join("\r\n");
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

async function CreateGeneratedContent(config, relativePath) {
  const sourcePath = resolve(sharedRoot, relativePath);
  const sourceContent = NormalizeContent(await readFile(sourcePath, "utf8"));
  return `${GetGeneratedBanner(config)}${sourceContent}`;
}

async function EnsureTargetIsAvailable(config) {
  if (config.requiredRoot && !(await PathExists(config.requiredRoot))) {
    throw new Error(`${relative(repositoryRoot, config.requiredRoot)} not found.`);
  }

  if (await PathExists(sharedRoot)) {
    return true;
  }

  if (config.missingShared === "skip") {
    process.stdout.write(`[${config.label}] shared/meting not found, skipping sync.\n`);
    return false;
  }

  throw new Error("shared/meting not found.");
}

async function CheckTarget(config) {
  if (!(await EnsureTargetIsAvailable(config))) {
    return false;
  }

  const expectedFiles = (await CollectRelativeFiles(sharedRoot)).sort();
  const actualFiles = (
    (await PathExists(config.targetRoot)) ? await CollectRelativeFiles(config.targetRoot) : []
  ).sort();
  const expectedFileSet = new Set(expectedFiles);
  const actualFileSet = new Set(actualFiles);
  let hasDrift = false;

  for (const relativePath of actualFiles) {
    if (expectedFileSet.has(relativePath)) {
      continue;
    }

    hasDrift = true;
    process.stdout.write(
      `[${config.label}] extra file: ${relative(repositoryRoot, resolve(config.targetRoot, relativePath))}\n`
    );
  }

  for (const relativePath of expectedFiles) {
    const targetPath = resolve(config.targetRoot, relativePath);

    if (!actualFileSet.has(relativePath)) {
      hasDrift = true;
      process.stdout.write(
        `[${config.label}] missing file: ${relative(repositoryRoot, targetPath)}\n`
      );
      continue;
    }

    const currentContent = NormalizeContent(await readFile(targetPath, "utf8"));
    const expectedContent = await CreateGeneratedContent(config, relativePath);

    if (currentContent === expectedContent) {
      continue;
    }

    hasDrift = true;
    process.stdout.write(
      `[${config.label}] changed file: ${relative(repositoryRoot, targetPath)}\n`
    );
  }

  if (!hasDrift) {
    process.stdout.write(`[${config.label}] generated copy is already up to date.\n`);
  }

  return hasDrift;
}

async function SyncTarget(config) {
  if (!(await EnsureTargetIsAvailable(config))) {
    return;
  }

  await rm(config.targetRoot, { recursive: true, force: true });

  for (const relativePath of await CollectRelativeFiles(sharedRoot)) {
    const sourcePath = resolve(sharedRoot, relativePath);
    const targetPath = resolve(config.targetRoot, relativePath);
    const nextContent = await CreateGeneratedContent(config, relativePath);

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, nextContent, "utf8");
    process.stdout.write(
      `[${config.label}] ${relative(repositoryRoot, sourcePath)} -> ${relative(repositoryRoot, targetPath)}\n`
    );
  }
}

function ResolveTargets(targetName) {
  if (targetName === "all") {
    return Object.values(targetCatalog);
  }

  const config = targetCatalog[targetName];

  if (config) {
    return [config];
  }

  throw new Error(`Unsupported target: ${targetName}`);
}

export async function RunCli(mode, targetName) {
  const targets = ResolveTargets(targetName);

  if (mode === "check") {
    let hasDrift = false;

    for (const config of targets) {
      hasDrift = (await CheckTarget(config)) || hasDrift;
    }

    return hasDrift ? driftExitCode : 0;
  }

  if (mode === "sync") {
    for (const config of targets) {
      await SyncTarget(config);
    }

    return 0;
  }

  throw new Error(`Unsupported mode: ${mode}`);
}

async function Main() {
  const [mode, targetName = "all"] = process.argv.slice(2);

  if (!mode) {
    throw new Error("Usage: node scripts/sync-generated.mjs <check|sync> <mcp|skill|all>");
  }

  process.exitCode = await RunCli(mode, targetName);
}

if (process.argv[1] === scriptPath) {
  Main().catch((error) => {
    process.stderr.write(
      `[sync-generated] failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
    );
    process.exit(1);
  });
}
