import { Application } from 'express';
import mcpRoute from './mcpRoute';

function route(app: Application) {
    const prefix = '/api/v1';

    app.use(`${prefix}/mcp`, mcpRoute);

    app.get(`${prefix}/health`, (req, res) => {
        res.status(200).json({
            status: 'ok',
            message: 'Server is running',
        });
    });
}

export default route;
