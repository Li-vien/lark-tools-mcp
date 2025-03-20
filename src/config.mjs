import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { maskApiKey } from "./common.mjs";

// Load environment variables from .env file
config();

export function getServerConfig(isStdioMode) {
  // Parse command line arguments
  const argv = yargs(hideBin(process.argv))
    .options({
      "feishu-app-id": {
        type: "string",
        description: "Feishu App ID",
      },
      "feishu-app-secret": {
        type: "string",
        description: "Feishu App Secret",
      },
      "port": {
        type: "number",
        description: "Port to run the server on",
      },
    })  
    .help()
    .parseSync();

  const config = {
    feishuAppId: "",
    feishuAppSecret: "",
    port: 3334,
    configSources: {
      feishuAppId: "env",
      feishuAppSecret: "env",
      port: "default",
    },
  };

  // Handle FEISHU_APP_ID
  if (argv["feishu-app-id"]) {
    config.feishuAppId = argv["feishu-app-id"];
    config.configSources.feishuAppId = "cli";
  } else if (process.env.FEISHU_APP_ID) {
    config.feishuAppId = process.env.FEISHU_APP_ID;
    config.configSources.feishuAppId = "env";
  }

  // Handle FEISHU_API_ID
  if (argv["feishu-app-secret"]) {
    config.feishuAppSecret = argv["feishu-app-secret"];
    config.configSources.feishuAppSecret = "cli";
  } else if (process.env.FEISHU_APP_SECRET) {
    config.feishuAppSecret = process.env.FEISHU_APP_SECRET;
    config.configSources.feishuAppSecret = "env"; 
  }

  // Handle PORT
  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = "cli";
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
    config.configSources.port = "env";
  }

  // Validate feishu configuration
  if (!config.feishuAppId || !config.feishuAppSecret) {
    console.error("FEISHU_APP_ID and FEISHU_APP_SECRET are required (via CLI argument --feishu-app-id and --feishu-app-secret or .env file)");
    process.exit(1);
  }

  // Log configuration sources
  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- FEISHU_APP_ID: ${maskApiKey(config.feishuAppId)} (source: ${config.configSources.feishuAppId})`,
    );
    console.log(
      `- FEISHU_APP_SECRET: ${maskApiKey(config.feishuAppSecret)} (source: ${config.configSources.feishuAppSecret})`,
    );
    console.log(`- PORT: ${config.port} (source: ${config.configSources.port})`);
    console.log();
  }

  return config;
}