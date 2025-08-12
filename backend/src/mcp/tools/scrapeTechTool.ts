import { z } from 'zod';
import { InfoType } from '../../types';
import { scrapeNpmPage } from '../services';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';

const scrapeTechTool = (server: McpServer) => {
    server.tool(
        "scrape-tech",
        "Scraping a tech's basic information (repository and homepage link) from npmjs",
        {
            name: z.string()
        },
        {
            title: "Scrape Tech",
            readOnlyHint: false,
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: false
        },
        async ({ name }) => {
            let info: InfoType = {
                repository: "",
                homepage: ""
            }

            try {
                info = await scrapeNpmPage(name);
            } catch (e) {
                console.error('Failed to get tech info', e);
            }

            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(info)
                }]
            }
        }
    )
}

export default scrapeTechTool;
