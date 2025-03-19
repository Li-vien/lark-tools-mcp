import axios from "axios";
import { Logger } from "../server.mjs";
const BaseUrl = {
  feishu: {
    url: "https://open.larkoffice.com/open-apis/bot/v2/hook/",
    headers: "X-Figma-Token",
  },
}
export class FeishuService {
  apiKey;
  baseUrl;
  headers;

  constructor(type, apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = `${BaseUrl[type].url}`;
    this.headers = {
      [BaseUrl[type].headers]: this.apiKey,
    };
  }

  async request(endpoint) {
    try {
      Logger.log(`Calling ${this.baseUrl}${endpoint}`);
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: this.headers
      });
      return response.data;
    } catch (error) {
      if (error && error.response) {
        throw {
          status: error.response.status,
          err: error.response.data.err || "Unknown error",
        }
      }
      throw new Error("Failed to make request to Feishu API");
    }
  }

  async getDoc(docId) {
    const response = await this.request(`/doc/${docId}`);
    return response;
  }
}
