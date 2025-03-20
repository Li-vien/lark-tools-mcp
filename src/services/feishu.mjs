import * as lark from '@larksuiteoapi/node-sdk';

export class FeishuService {
  client;
  constructor(apiId, apiSecret) {
    this.client = new lark.Client({
      appId: apiId,
      appSecret: apiSecret
    });
  }
  // get docx content
  async getDocx(documentId) {
    const response = await this.client.docx.v1.document.rawContent({
      path: {
        document_id: documentId,
      },
      params: { 
        lang: 0,
      },
    });
    if (response.code !== 0) {
      throw new Error(`Failed to get doc from Feishu API ${response.msg}`);
    }
    return response.data.content;
  }
  // get node
  async getNode(token) {
    const response = await this.client.wiki.v2.space.getNode({
      params: {
        token,
      }
    });
    if (response.code !== 0) {
      throw new Error(`Failed to get node from Feishu API ${response.msg}`);
    }
    const { obj_type, obj_token } = response.data.node;
    if (obj_type === 'docx') {
      return this.getDocx(obj_token);
    }else{
      throw new Error(`This type of document is not currently supported`);
    }
  }
}
