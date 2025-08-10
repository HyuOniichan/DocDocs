import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { getPackages, getPage, getSitemaps, initSitemaps, setSitemap } from "./services/storageService"
import z from "zod"
import writeJson from "./utils/writeJson"
import config from "./config/config"
import importJson from "./utils/importJson"
import { LinkType, StoredDepType } from "./types"
// import "mcps-logger/console";

const server = new McpServer({
    name: "docdocs-mcp-server",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    }
})

server.resource('packages',
    'packages://all',
    {
        title: 'Packages',
        description: 'Extract dependencies (packages) in input package.json file',
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

server.resource('get-sitemaps', 
    'sitemaps://all',
    {
        title: 'Get All Sitemaps',
        description: 'Get the sitemaps including packages and their links to github repository and homepage',
        mimeType: 'application/json'
    }, 
    async (uri) => {
        try {
            const sitemaps = await getSitemaps(); 
            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(sitemaps),
                    mimeType: 'application/json'
                }]
            }
        } catch {
            return {
                contents: [{
                    uri: uri.href,
                    text: 'Failed to get sitemaps',
                    mimeType: 'application/json'
                }]
            }
        }
    }
)

server.resource('get-sitemap', 
    new ResourceTemplate('sitemaps://{name}', { list: undefined }), 
    {
        title: 'Get Sitemap', 
        description: 'Get the sitemap of a specific package',
        mimeType: 'application/json'
    }, 
    async (uri, { name }) => {
        try {
            const sitemaps = await getSitemaps(); 
            const sitemap = sitemaps.storage.find((s: StoredDepType) => s.name === name); 

            if (sitemap === undefined) {
                return {
                    contents: [{
                        uri: uri.href,
                        text: "Sitemap not found",
                        mimeType: 'application/json'
                    }]
                }
            }

            return {
                contents: [{
                    uri: uri.href,
                    text: JSON.stringify(sitemap),
                    mimeType: 'application/json'
                }]
            }
        } catch {
            return {
                contents: [{
                    uri: uri.href,
                    text: 'Failed to get sitemap',
                    mimeType: 'application/json'
                }]
            }
        }
    }
)

server.resource('get-page', 
    new ResourceTemplate('pages://{name}/{title}', { list: undefined }), 
    {
        title: 'Get Page', 
        description: 'Get the page content of a specific package',
        mimeType: 'application/json'
    }, 
    async (uri, { name, title }) => {
        try {
            if (name === "" || title === "") {
                return {
                    contents: [{
                        uri: uri.href,
                        text: "Package name or title isn't provided",
                        mimeType: 'application/json'
                    }]
                }
            }

            const page = await getPage(name as string, title as string);

            if (page === "") {
                return {
                    contents: [{
                        uri: uri.href,
                        text: "Page not found",
                        mimeType: 'application/json'
                    }]
                }
            }

            return {
                contents: [{
                    uri: uri.href,
                    text: page,
                    mimeType: 'text/plain'
                }]
            }
        } catch (e) {
            console.error('Failed to get page'); 
            console.error(e); 
            
            return {
                contents: [{
                    uri: uri.href,
                    text: 'Failed to get page',
                    mimeType: 'application/json'
                }]
            }
        }
    }
)

server.tool('init-sitemaps',
    'Initialize a sitemaps json file for saving packages sitemaps later',
    {
        title: "Init Sitemaps",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
    },
    async () => {
        try {
            const storage = await initSitemaps();
            await writeJson(storage); 
            
            return {
                content: [{
                    type: "text", text: "Sitemaps initialized"
                }]
            }
        } catch {
            return {
                content: [{
                    type: "text", text: "Failed to initialize sitemaps"
                }]
            }
        }
    }
)

server.tool('set-sitemap',
    'Set sitemap (links to github repository and homepage) for a specific package',
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

server.tool('set-page', 
    'Set scraped page content for a specific package', 
    {
        name: z.string(),
        title: z.string()
    },
    {
        title: "Set Page",
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
    },
    async ({ name, title }) => {
        try {
            const page = await getPage(name, title);
            
            if (page === "") {
                return {
                    content: [{
                        type: "text", text: "Page not found"
                    }]
                };
            }
            
            const storage = await importJson(config.output); 
            const packageId = storage.storage.findIndex((p: StoredDepType) => p.name === name); 
            if (packageId === -1) {
                return {
                    content: [{
                        type: "text", text: "Package not found"
                    }]
                };
            }
            
            const links = storage.storage[packageId].links; 
            const linkIndex = links.findIndex((l: LinkType) => l.title === title); 
            if (linkIndex === -1) {
                return {
                    content: [{
                        type: "text", text: "Link not found"
                    }]
                };
            }
            
            links[linkIndex].content = page; 
            await writeJson(storage); 
            
            return {
                content: [{
                    type: "text", text: "Page set successfully"
                }]
            };
        } catch (e) {
            console.error('Failed to set page'); 
            console.error(e); 
            
            return {
                content: [{
                    type: "text", text: 'Failed to set page'
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

