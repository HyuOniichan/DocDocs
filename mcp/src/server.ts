import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { getPackages, initStorage, setSitemap } from "./services/packageService"
import z from "zod"
import writeJson from "./utils/writeJson"
import config from "./config/config"
import importJson from "./utils/importJson"
import { StoredDepType } from "./types"
import "mcps-logger/console";

const server = new McpServer({
    name: "docdocs-mcp-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    }
})

server.resource(
    'packages',
    'packages://all',
    {
        title: 'Packages',
        description: 'Get all packages in package.json',
        mimeType: 'application/json'
    },
    async (uri) => {
        try {
            const deps = await getPackages();
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(deps),
                    mimeType: 'application/json'
                }]
            }
        } catch {
            return {
                contents: [{
                    uri: uri.href,
                    text: 'Failed to get packages',
                    mimeType: 'application/json'
                }]
            }
        }
    }
)

server.tool(
    'init-storage',
    'Create a storage json file for later scraping and retrieving',
    {
        title: "Init Storage",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
    },
    async () => {
        try {
            const storage = await initStorage();
            await writeJson(storage); 
            
            return {
                content: [{
                    type: "text", text: "Storage initialized"
                }]
            }
        } catch {
            return {
                content: [{
                    type: "text", text: "Failed to initialize storage"
                }]
            }
        }
    }
)

server.tool(
    'set-sitemap',
    'Set the sitemap for a specific package',
    {
        name: z.string()
    },
    {
        title: "Set Sitemap",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
    },
    async ({ name }) => {
        try {
            const sitemap = await setSitemap(name); 
            
            if (sitemap.name === "") {
                return {
                    content: [{
                        type: "text", text: "Package not found"
                    }]
                };
            }
            
            if (sitemap.info.repository === "" && sitemap.info.homepage === "") {
                return {
                    content: [{
                        type: "text", text: "Failed to get package's info"
                    }]
                };
            }
            
            const storage = await importJson(config.output); 
            const packageId = storage.storage.findIndex((p: StoredDepType) => p.name === name); 
            storage.storage[packageId] = sitemap; 
            await writeJson(storage); 
            
            return {
                content: [{
                    type: "text", text: "Sitemap set successfully"
                }]
            };
        } catch {
            return {
                content: [{
                    type: "text", text: "Failed to set sitemap"
                }]
            };
        }
    }
)



async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main()

