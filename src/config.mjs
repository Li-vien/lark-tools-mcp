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
      "feishu-api-key": {
        type: "string",
        description: "Feishu API key",
      },
      port: {
        type: "number",
        description: "Port to run the server on",
      },
    })
    .help()
    .parseSync();

  const config = {
    feishuApiKey: "",
    port: 3334,
    configSources: {
      feishuApiKey: "env",
      port: "default",
    },
  };

  // Handle FEISHU_API_KEY
  if (argv["feishu-api-key"]) {
    config.feishuApiKey = argv["feishu-api-key"];
    config.configSources.figmaApiKey = "cli";
  } else if (process.env.FEISHU_API_KEY) {
    config.feishuApiKey = process.env.FEISHU_API_KEY;
    config.configSources.feishuApiKey = "env";
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
  if (!config.feishuApiKey) {
    console.error("FEISHU_API_KEY is required (via CLI argument --feishu-api-key or .env file)");
    process.exit(1);
  }

  // Log configuration sources
  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- FEISHU_API_KEY: ${maskApiKey(config.feishuApiKey)} (source: ${config.configSources.figmaApiKey})`,
    );
    console.log(`- PORT: ${config.port} (source: ${config.configSources.port})`);
    console.log();
  }

  return config;
}
