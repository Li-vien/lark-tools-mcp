import axios from "axios";
import fs from "fs";
import { Logger } from "../server";

export interface FeishuError {
  status: number;
  err: string;
}


export class FeishuService {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.figma.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    try {
      Logger.log(`Calling ${this.baseUrl}${endpoint}`);
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          "X-Figma-Token": this.apiKey,
        },
      });

      return response.data;
    } catch (error) {
      if (error && error.response) {
        throw {
          status: error.response.status,
          err: (error.response.data as { err?: string }).err || "Unknown error",
        } as FeishuError;
      }
      throw new Error("Failed to make request to Figma API");
    }
  } 

  async getDoc(docId: string): Promise<any> {
    const response = await this.request(`/doc/${docId}`);
    return response;
  }
}
