import axios from "axios";
import { Logger } from "../server.mjs";
import { GlobalConfig } from "../config.mjs";

export class FeishuService {
  apiId;
  apiSecret;
  baseUrl;
  headers;
  token;
  tokenExpiry;

  constructor(type, apiId, apiSecret) {
    this.apiId = apiId;
    this.apiSecret = apiSecret;
    const baseConfig = GlobalConfig.BASE_URL[type];
    this.baseUrl = `${baseConfig.url}`;
    this.headers = {
      [baseConfig.headers.key]: baseConfig.headers.value(this.token),
    };
  }

  async request(endpoint) {
    try {
      Logger.log(`Calling ${this.baseUrl}${endpoint}`);
      if (!this.token || this.isTokenExpired()) {
        await this.getToken();
      }
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
  async getToken() {
    const token = await axios.post(`${this.baseUrl}/auth/v3/tenant_access_token/internal`, {
      app_id: this.apiId,
      app_secret: this.apiSecret,
    }); 
    if (token.data.code !== 0) {
      throw new Error("Failed to get token from Feishu API");
    }
    this.token = token.data.tenant_access_token;
    this.tokenExpiry = Date.now() + token.data.expire * 1000;
  }
  isTokenExpired() {
    return this.tokenExpiry < Date.now();
  }
  
  async getDoc(documentId) {
    const response = await this.request(`docx/v1/documents/${documentId}/raw_content`);
    if (response.code !== 0) {
      throw new Error(`Failed to get doc from Feishu API ${response.msg}`);
    }
    return response.data.content;
  }
}
