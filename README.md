# feishu-tools-mcp
MCP server provides Feishu related operations to AI encoding agents such as cursor  
飞书MCP插件
通过打通飞书与cursor，向LLM提供读取文档、发送消息、合同审批.....
可能会有意想不到的组合方式

## 如何使用
1. Copy .env.example to .env file 
2. Edit FEISHU_SPI_KEY to your application token
3. Run MCP Server
```yarn install```
```yarn start```
4. Add MCP to cursor


## tools 
### get_feishu_doc
> get Feishu document