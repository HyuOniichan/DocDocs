import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { DocLink } from '../../types';
import { scrapeRelatedLinks } from '../services';

const setSitemapTool = (server: McpServer) => {
    server.tool(
        "set-sitemap",
        "Scraping related links from a given link and set sitemap",
        {
            startLink: z.string()
        },
        {
            title: "Set Sitemap",
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        },
        async ({ startLink }) => {
            let links: DocLink[] = []

            try {
                links = await scrapeRelatedLinks([startLink]);
            } catch (e) {
                console.error('Failed to get tech info', e);
            }

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(links)
                }]
            }
        }
    )
}

export default setSitemapTool;
