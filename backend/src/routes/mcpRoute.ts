import express, { Request, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getServer } from '../mcp/server';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const server = getServer();

        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: undefined
        })

        res.on('close', () => {
            console.log('mcpRoute: Request closed');
            transport.close();
            server.close();
        })

        await server.connect(transport);

        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
            });
        }
    }
})

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        message: 'MCP server is running',
    });
});

export default router; 
