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
      "feishu-api-id": {
        type: "string",
        description: "Feishu API ID",
      },
      "feishu-api-secret": {
        type: "string",
        description: "Feishu API Secret",
      },
      "port": {
        type: "number",
        description: "Port to run the server on",
      },
    })  
    .help()
    .parseSync();

  const config = {
    feishuApiId: "",
    feishuApiSecret: "",
    port: 3334,
    configSources: {
      feishuApiId: "env",
      feishuApiSecret: "env",
      port: "default",
    },
  };

  // Handle FEISHU_APP_ID
  if (argv["feishu-api-id"]) {
    config.feishuApiId = argv["feishu-api-id"];
    config.configSources.feishuApiId = "cli";
  } else if (process.env.FEISHU_API_ID) {
    config.feishuApiId = process.env.FEISHU_API_ID;
    config.configSources.feishuApiId = "env";
  }

  // Handle FEISHU_API_ID
  if (argv["feishu-api-secret"]) {
    config.feishuApiSecret = argv["feishu-api-secret"];
    config.configSources.feishuApiSecret = "cli";
  } else if (process.env.FEISHU_API_SECRET) {
    config.feishuApiSecret = process.env.FEISHU_API_SECRET;
    config.configSources.feishuApiSecret = "env"; 
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
  if (!config.feishuApiId || !config.feishuApiSecret) {
    console.error("FEISHU_API_ID and FEISHU_API_SECRET are required (via CLI argument --feishu-api-id and --feishu-api-secret or .env file)");
    process.exit(1);
  }

  // Log configuration sources
  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- FEISHU_APP_ID: ${maskApiKey(config.feishuApiId)} (source: ${config.configSources.feishuApiId})`,
    );
    console.log(
      `- FEISHU_APP_SECRET: ${maskApiKey(config.feishuApiSecret)} (source: ${config.configSources.feishuApiSecret})`,
    );
    console.log(`- PORT: ${config.port} (source: ${config.configSources.port})`);
    console.log();
  }

  return config;
}

export const GlobalConfig =  {
  BASE_URL: {
      feishu: {
        url: "https://open.feishu.cn/open-apis/",
        headers: {
          key: "Authorization",
          value: (token) => {
            return `Bearer ${token}`;
          },
        },
      },
  }
}