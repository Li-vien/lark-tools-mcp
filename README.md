# feishu-tools-mcp
MCP server provides Feishu related operations to AI encoding agents such as cursor  
飞书MCP插件
通过打通飞书与cursor，向LLM提供读取文档、发送消息、合同审批、数据处理.....
可能会有意想不到的组合方式，积极共创~~~

## 创建自建应用
MCP服务运行基于token，需要创建一个应用并做发布 [https://open.feishu.cn/document/server-docs/api-call-guide/terminolog](https://open.feishu.cn/document/server-docs/api-call-guide/terminology)  

然后对应用进行文档授权，这一步较为繁琐，参考文档，选择合适的方案：[https://open.feishu.cn/document/uAjLw4CM/ugTN1YjL4UTN24CO1UjN/trouble-shooting/how-to-add-permissions-to-app](https://open.feishu.cn/document/uAjLw4CM/ugTN1YjL4UTN24CO1UjN/trouble-shooting/how-to-add-permissions-to-app)  

## 运行服务
1. 拷贝 .env.example 为 .env 文件 
2. 修改 .env 文件中的 FEISHU_APP_ID 为飞书自建应用的 app_id
3. 修改 .env 文件中的 FEISHU_APP_SECRET 为飞书自建应用的 app_secret
4. 运行 MCP Server
```yarn install```
```yarn start```
5. Add MCP to cursor


## tools 
### get_feishu_doc
> 获取飞书文档信息（纯文本）