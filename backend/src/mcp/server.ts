import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { setSitemapTool, scrapeTechTool } from './tools/';

function getServer() {
    const server = new McpServer({
        name: 'docdocs-mcp',
        version: '1.0.0',
        capabilities: {
            resources: {},
            tools: {},
            prompts: {},
        }
    })

    scrapeTechTool(server);
    setSitemapTool(server); 

    return server;
}

export {
    getServer
};
