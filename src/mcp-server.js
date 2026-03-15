import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import * as z from "zod/v4";
import Meting from "./meting.js";

export const serviceMetadata = Object.freeze({
  name: "meting-mcp",
  version: "1.6.2",
});

const platformCatalog = Object.freeze([
  { name: "NetEase Cloud Music", code: "netease" },
  { name: "Tencent Music", code: "tencent" },
  { name: "KuGou Music", code: "kugou" },
  { name: "Baidu Music", code: "baidu" },
  { name: "Kuwo Music", code: "kuwo" },
]);

const platformSchema = z.enum(Meting.getSupportedPlatforms());

const cookieEnvNames = Object.freeze({
  netease: "METING_NETEASE_COOKIE",
  tencent: "METING_TENCENT_COOKIE",
  kugou: "METING_KUGOU_COOKIE",
  baidu: "METING_BAIDU_COOKIE",
  kuwo: "METING_KUWO_COOKIE",
});

function ReadEnvValue(name) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export function ResolveCookie(platform, inputCookie) {
  const platformCookie = ReadEnvValue(cookieEnvNames[platform]);
  const fallbackCookie = ReadEnvValue("METING_COOKIE");
  return platformCookie ?? fallbackCookie ?? inputCookie;
}

function CreateClient(platform, inputCookie) {
  const meting = new Meting(platform);
  meting.format(true);

  const cookie = ResolveCookie(platform, inputCookie);

  if (cookie) {
    meting.cookie(cookie);
  }

  return meting;
}

function ParseResult(rawValue) {
  if (typeof rawValue !== "string") {
    return rawValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return { raw: rawValue };
  }
}

function CreateTextResult(result, isError = false) {
  return {
    isError,
    content: [
      {
        type: "text",
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

function CreateOperationResult(operation, platform, data) {
  return {
    ok: true,
    operation,
    platform,
    data,
  };
}

function CreateOperationError(operation, platform, error) {
  return {
    ok: false,
    operation,
    platform,
    message: error instanceof Error ? error.message : String(error),
  };
}

function WithCommonInput(extraSchema) {
  return {
    platform: platformSchema.describe("Music platform code."),
    cookie: z
      .string()
      .optional()
      .describe(
        "Optional platform cookie. Lower priority than METING_<PLATFORM>_COOKIE and METING_COOKIE."
      ),
    ...extraSchema,
  };
}

function RegisterTool(server, toolName, description, inputSchema, handler) {
  server.registerTool(
    toolName,
    {
      title: toolName,
      description,
      inputSchema,
    },
    async (input) => {
      try {
        const data = await handler(input);
        return CreateTextResult(CreateOperationResult(toolName, input.platform, data));
      } catch (error) {
        return CreateTextResult(CreateOperationError(toolName, input.platform, error), true);
      }
    }
  );
}

export function CreateMcpServer() {
  const server = new McpServer(serviceMetadata);

  server.registerTool(
    "platforms",
    {
      title: "platforms",
      description: "List supported music platforms.",
    },
    async () => {
      return CreateTextResult({
        ok: true,
        data: platformCatalog,
      });
    }
  );

  RegisterTool(
    server,
    "search",
    "Search songs, albums or artists on a specific platform.",
    WithCommonInput({
      keyword: z.string().min(1).describe("Search keyword."),
      type: z
        .number()
        .int()
        .positive()
        .optional()
        .describe("Optional platform-specific search type."),
      page: z.number().int().positive().optional().describe("Optional page number."),
      limit: z.number().int().positive().max(100).optional().describe("Optional page size."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      const options = {};

      if (input.type !== undefined) {
        options.type = input.type;
      }

      if (input.page !== undefined) {
        options.page = input.page;
      }

      if (input.limit !== undefined) {
        options.limit = input.limit;
      }

      return ParseResult(await meting.search(input.keyword, options));
    }
  );

  RegisterTool(
    server,
    "song",
    "Get song detail by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Song id."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.song(input.id));
    }
  );

  RegisterTool(
    server,
    "album",
    "Get album detail by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Album id."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.album(input.id));
    }
  );

  RegisterTool(
    server,
    "artist",
    "Get artist songs by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Artist id."),
      limit: z.number().int().positive().max(200).optional().describe("Optional result size."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.artist(input.id, input.limit));
    }
  );

  RegisterTool(
    server,
    "playlist",
    "Get playlist detail by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Playlist id."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.playlist(input.id));
    }
  );

  RegisterTool(
    server,
    "url",
    "Get playable song url by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Song id."),
      br: z.number().int().positive().optional().describe("Optional bitrate."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      WithCommonInput;
      return ParseResult(await meting.url(input.id, input.br));
    }
  );

  RegisterTool(
    server,
    "lyric",
    "Get song lyric by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Song id."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.lyric(input.id));
    }
  );

  RegisterTool(
    server,
    "pic",
    "Get cover or picture url by id.",
    WithCommonInput({
      id: z.string().min(1).describe("Picture id."),
      size: z.number().int().positive().optional().describe("Optional picture size."),
    }),
    async (input) => {
      const meting = CreateClient(input.platform, input.cookie);
      return ParseResult(await meting.pic(input.id, input.size));
    }
  );

  return server;
}
