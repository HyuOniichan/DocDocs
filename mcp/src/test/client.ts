import "dotenv/config"
import { input, select } from "@inquirer/prompts";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CoreMessage, generateText, jsonSchema, ToolSet } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const mcp = new Client({
    name: "test-client",
    version: "1.0.0",
}, {
    capabilities: {
        sampling: {}
    }
})

const transport = new StdioClientTransport({
    command: "node",
    args: ["build/server.js"],
    stderr: "inherit",
})

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY
})

async function handleTool(tool: Tool) {
    const args: Record<string, string> = {}

    for (const [key, value] of Object.entries(tool.inputSchema.properties ?? {})) {
        args[key] = await input({
            message: `Enter value for ${key} (${(value as { type: string }).type}): `
        })
    }

    const res = await mcp.callTool({
        name: tool.name,
        arguments: args
    })

    console.log((res.content as [{ text: string }])[0].text)
}

async function handleResource(uri: string) {
    let finalUri = uri
    const paramMatches = uri.match(/{([^}]+)}/g);

    for (const paramMatch of paramMatches ?? []) {
        const paramName = paramMatch.replace(/{|}/g, '');
        const paramValue = await input({
            message: `Enter value for ${paramName}:`
        })
        finalUri = finalUri.replace(paramMatch, paramValue);
    }

    const res = await mcp.readResource({
        uri: finalUri
    })

    console.log(JSON.stringify(JSON.parse(res.contents[0].text as string), null, 2))
}

async function handleQuery(tools: Tool[]) {
    const query = await input({ message: "Enter your query:" });

    const { text, toolResults} = await generateText({
        model: google("gemini-2.0-flash"),
        system: `
            You are an AI assistant that can solve user queries using tools. 
            Available tools: ${tools.map((t, index) => `(${index+1}) ${t.name} - ${t.description}`).join(", ")}. 
        `,
        prompt: query,
        tools: tools.reduce((obj, tool) => ({
            ...obj,
            [tool.name]: {
                description: tool.description,
                parameters: jsonSchema(tool.inputSchema),
                execute: async (args: Record<string, any>) => (
                    await mcp.callTool({
                        name: tool.name,
                        arguments: args
                    })
                )
            }
        }), {} as ToolSet)
    })

    console.log(
        // @ts-expect-error
        text || toolResults[0]?.result?.content[0]?.text || "No text generated."
    )
}

async function main() {
    await mcp.connect(transport);
    const [{ tools }, { resources }] = await Promise.all([
        mcp.listTools(),
        mcp.listResources()
    ])

    console.log("Connected");

    while (true) {
        const option = await select({
            message: "Select an option",
            choices: ['Tools', 'Resources', 'Query']
        })

        switch (option) {
            case 'Tools':
                const toolName = await select({
                    message: "Select a tool",
                    choices: tools.map(tool => ({
                        name: tool.annotations?.title ?? tool.name,
                        value: tool.name,
                        description: tool.description
                    }))
                })

                const tool = tools.find(tool => tool.name === toolName);
                if (tool == null) {
                    console.error("Tool not found");
                } else {
                    await handleTool(tool);
                }

                break;

            case 'Resources':
                const resourceUri = await select({
                    message: "Select a resource",
                    choices: [
                        ...resources.map(resource => ({
                            name: resource.name,
                            value: resource.uri,
                            description: resource.description
                        }))
                        // ...resourceTemplates.map(template => ({
                        //     name: template.name,
                        //     value: template.uriTemplate,
                        //     description: template.description
                        // }))
                    ]
                })

                const uri = resources.find(resource => resource.uri === resourceUri)?.uri
                // ?? resourceTemplates.find(template => template.uriTemplate === resourceUri)?.uriTemplate

                if (uri == null) {
                    console.error("Resource not found");
                } else {
                    await handleResource(uri);
                }

                break;

            case 'Query':
                await handleQuery(tools);
                break;
        }
    }
}

main()

