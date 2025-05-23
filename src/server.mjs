import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FeishuService } from "./services/feishu.mjs";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

export const Logger = {
  log: (...args) => {},
  error: (...args) => {},
};

export class BaseMcpServer {
  server;
  feishuService;
  sseTransport = null;

  constructor(config = {}) {
    const { feishuAppId, feishuAppSecret } = config;
    this.feishuService = new FeishuService(feishuAppId, feishuAppSecret);
    this.server = new McpServer(
      {
        name: "feishu MCP Server",
        version: "0.0.1",
      },
      {
        capabilities: {
          logging: {},
          tools: {},
        },
      },
    );

    this.registerTools();
  }

  registerTools() {
     // Tool to get doc information
     this.server.tool(
      "get_feishu_doc_raw",
      "Retrieve the content of Feishu document based on documentId",
      {
        docId: z
          .string()
          .describe(
            "The documentId of the feishu file to fetch, often found in a provided URL like feishu.cn/wiki/<documentId>...",
          ),
      },
      async ({ docId }) => {
        try {
          Logger.log(
            `Reading feishu doc ${docId}`,
          );
          const doc = await this.feishuService.getNode(docId);
          return {
            content: [{ type: "text", text: doc }],
          };
        } catch (error) {
          Logger.error(`Error fetching file ${docId}:`, error);
          return {
            content: [{ type: "text", text: `Error fetching doc: ${error}` }],
          };
        }
      },
    );
  }

  async connect(transport) {
    // Logger.log("Connecting to transport...");
    await this.server.connect(transport);

    Logger.log = (...args) => {
      this.server.server.sendLoggingMessage({
        level: "info",
        data: args,
      });
    };
    Logger.error = (...args) => {
      this.server.server.sendLoggingMessage({
        level: "error",
        data: args,
      });
    };

    Logger.log("Server connected and ready to process requests");
  }

  async startHttpServer(port) {
    const app = express();

    app.get("/sse", async (req, res) => {
      console.log("New SSE connection established");
      this.sseTransport = new SSEServerTransport(
        "/messages",
        res,
      );
      await this.server.connect(this.sseTransport);
    });

    app.post("/messages", async (req, res) => {
      if (!this.sseTransport) {
        // @ts-expect-error Not sure why Express types aren't working
        res.sendStatus(400);
        return;
      }
      await this.sseTransport.handlePostMessage(
        req,
        res,
      );
    });

    Logger.log = console.log;
    Logger.error = console.error;

    app.listen(port, () => {
      Logger.log(`HTTP server listening on port ${port}`);
      Logger.log(`SSE endpoint available at http://localhost:${port}/sse`);
      Logger.log(`Message endpoint available at http://localhost:${port}/messages`);
    });
  }
}
