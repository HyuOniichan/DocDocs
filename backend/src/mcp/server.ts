import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

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

    server.resource('test-resource',
        'test://resource',
        {
            title: 'Test Resource',
            description: 'Test resource for Model Context Protocol',
            mimeType: 'application/json'
        },
        async (uri) => {
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify({ message: 'This is a test resource' }),
                    mimeType: 'application/json'
                }]
            }
        }
    )

    return server;
}

export {
    getServer
};
