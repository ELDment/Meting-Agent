#!/usr/bin/env node

import Meting from "./meting/meting.js";

const platformCatalog = Object.freeze([
  { name: "NetEase Cloud Music", code: "netease" },
  { name: "Tencent Music", code: "tencent" },
  { name: "KuGou Music", code: "kugou" },
  { name: "Baidu Music", code: "baidu" },
  { name: "Kuwo Music", code: "kuwo" },
]);

const cookieEnvNames = Object.freeze({
  netease: "METING_NETEASE_COOKIE",
  tencent: "METING_TENCENT_COOKIE",
  kugou: "METING_KUGOU_COOKIE",
  baidu: "METING_BAIDU_COOKIE",
  kuwo: "METING_KUWO_COOKIE",
});

function GetHelpText() {
  return [
    "meting-agent skill cli",
    "",
    "Usage:",
    "  node scripts/meting-cli.mjs platforms",
    '  node scripts/meting-cli.mjs search --platform netease --keyword "我怀念的" --limit 3',
    "  node scripts/meting-cli.mjs song --platform netease --id 33894312",
    "  node scripts/meting-cli.mjs album --platform netease --id 34209",
    "  node scripts/meting-cli.mjs artist --platform netease --id 6452 --limit 20",
    "  node scripts/meting-cli.mjs playlist --platform netease --id 3778678",
    "  node scripts/meting-cli.mjs url --platform netease --id 33894312 --br 320",
    "  node scripts/meting-cli.mjs lyric --platform netease --id 33894312",
    "  node scripts/meting-cli.mjs pic --platform netease --id 33894312 --size 300",
  ].join("\n");
}

function ReadEnvValue(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function ResolveCookie(platform, inputCookie) {
  const platformCookie = ReadEnvValue(cookieEnvNames[platform]);
  const fallbackCookie = ReadEnvValue("METING_COOKIE");
  return platformCookie ?? fallbackCookie ?? inputCookie;
}

function ParseArguments(argumentList) {
  const options = {};

  for (let index = 0; index < argumentList.length; index += 2) {
    const key = argumentList[index];
    const value = argumentList[index + 1];

    if (!key?.startsWith("--")) {
      throw new Error(`Invalid option: ${key}`);
    }

    if (value === undefined || value.startsWith("--")) {
      throw new Error(`Missing value for option: ${key}`);
    }

    options[key.slice(2)] = value;
  }

  return options;
}

function RequireOption(options, name) {
  const value = options[name];

  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing required option: --${name}`);
  }

  return value;
}

function ParsePositiveInteger(value, optionName) {
  const number = Number(value);

  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`Option --${optionName} must be a positive integer.`);
  }

  return number;
}

function NormalizeResult(rawValue) {
  if (typeof rawValue !== "string") {
    return rawValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return { raw: rawValue };
  }
}

function CreateClient(platform, options) {
  if (!Meting.isSupported(platform)) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const client = new Meting(platform);
  client.format(true);

  const cookie = ResolveCookie(platform, options.cookie);

  if (cookie) {
    client.cookie(cookie);
  }

  return client;
}

async function RunCommand(command, options) {
  if (command === "platforms") {
    return {
      ok: true,
      command,
      data: platformCatalog,
    };
  }

  const platform = RequireOption(options, "platform");
  const client = CreateClient(platform, options);

  if (command === "search") {
    const searchOptions = {};

    if (options.page) {
      searchOptions.page = ParsePositiveInteger(options.page, "page");
    }

    if (options.limit) {
      searchOptions.limit = ParsePositiveInteger(options.limit, "limit");
    }

    if (options.type) {
      searchOptions.type = ParsePositiveInteger(options.type, "type");
    }

    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.search(RequireOption(options, "keyword"), searchOptions)),
    };
  }

  if (command === "song") {
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.song(RequireOption(options, "id"))),
    };
  }

  if (command === "album") {
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.album(RequireOption(options, "id"))),
    };
  }

  if (command === "artist") {
    const limit = options.limit ? ParsePositiveInteger(options.limit, "limit") : undefined;
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.artist(RequireOption(options, "id"), limit)),
    };
  }

  if (command === "playlist") {
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.playlist(RequireOption(options, "id"))),
    };
  }

  if (command === "url") {
    const br = options.br ? ParsePositiveInteger(options.br, "br") : undefined;
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.url(RequireOption(options, "id"), br)),
    };
  }

  if (command === "lyric") {
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.lyric(RequireOption(options, "id"))),
    };
  }

  if (command === "pic") {
    const size = options.size ? ParsePositiveInteger(options.size, "size") : undefined;
    return {
      ok: true,
      command,
      platform,
      data: NormalizeResult(await client.pic(RequireOption(options, "id"), size)),
    };
  }

  throw new Error(`Unsupported command: ${command}`);
}

async function Main() {
  const argumentsList = process.argv.slice(2);

  if (
    argumentsList.length === 0 ||
    argumentsList.includes("--help") ||
    argumentsList.includes("-h")
  ) {
    process.stdout.write(`${GetHelpText()}\n`);
    return;
  }

  const command = argumentsList[0];
  const options = ParseArguments(argumentsList.slice(1));
  const result = await RunCommand(command, options);

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

Main().catch((error) => {
  process.stderr.write(
    `meting-agent skill failed: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`
  );
  process.exit(1);
});
