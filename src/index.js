#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CreateMcpServer, serviceMetadata } from "./mcp-server.js";

function GetHelpText() {
  return [
    "meting-mcp",
    "",
    "MCP server wrapper for the Meting multi-platform music API core.",
    "",
    "Usage:",
    "  meting-mcp            Start the MCP stdio server",
    "  meting-mcp --help     Show help",
    "  meting-mcp --version  Show version"
  ].join("\n");
}

async function StartServer() {
  const server = CreateMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  const Shutdown = async () => {
    await server.close();
    process.exit(0);
  };

  process.once("SIGINT", Shutdown);
  process.once("SIGTERM", Shutdown);
}

async function Main() {
  const argumentsList = process.argv.slice(2);

  if (argumentsList.includes("--help") || argumentsList.includes("-h")) {
    process.stdout.write(`${GetHelpText()}\n`);
    return;
  }

  if (argumentsList.includes("--version") || argumentsList.includes("-v")) {
    process.stdout.write(`${serviceMetadata.version}\n`);
    return;
  }

  await StartServer();
}

Main().catch(error => {
  process.stderr.write(`meting-mcp failed to start: ${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exit(1);
});
