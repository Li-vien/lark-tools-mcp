import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { BaseMcpServer } from "./server.mjs";
import { getServerConfig } from "./config.mjs";

export async function startServer() {
  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  const config = getServerConfig(isStdioMode);
  const server = new BaseMcpServer(config);

  if (isStdioMode) {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    console.log(`Initializing Feishu MCP Server in HTTP mode on port ${config.port}...`);
    await server.startHttpServer(config.port);
  }
}

// If this file is being run directly, start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
