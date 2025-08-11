import { DocLink } from "@/types/";

export interface MCPTool {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
}

export interface MCPResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}

export class MCPService {
    private static instance: MCPService;
    private tools: MCPTool[] = [];
    private resources: MCPResource[] = [];
    private selectedLinks: DocLink[] = [];

    static getInstance(): MCPService {
        if (!MCPService.instance) {
            MCPService.instance = new MCPService();
        }
        return MCPService.instance;
    }

    constructor() {
        this.initializeDefaultTools();
    }

    private initializeDefaultTools() {
        this.tools = [
            {
                name: "search_documentation",
                description: "Search through selected documentation links for relevant information",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Search query" },
                        technology: { type: "string", description: "Specific technology to search in" }
                    },
                    required: ["query"]
                }
            },
            {
                name: "extract_code_examples",
                description: "Extract code examples from documentation pages",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: { type: "string", description: "Documentation URL" },
                        language: { type: "string", description: "Programming language" }
                    },
                    required: ["url"]
                }
            },
            {
                name: "compare_approaches",
                description: "Compare different approaches or solutions from multiple documentation sources",
                inputSchema: {
                    type: "object",
                    properties: {
                        topic: { type: "string", description: "Topic to compare" },
                        sources: { type: "array", items: { type: "string" }, description: "Source URLs" }
                    },
                    required: ["topic"]
                }
            }
        ];
    }

    updateSelectedLinks(links: DocLink[]) {
        this.selectedLinks = links;
        this.updateResources();
    }

    private updateResources() {
        this.resources = this.selectedLinks.map(link => ({
            uri: link.url,
            name: link.name,
            description: `Documentation: ${link.name}`,
            mimeType: "text/html"
        }));
    }

    async executeRool(toolName: string, parameters: Record<string, string>): Promise<string> {
        switch (toolName) {
            case "search_documentation":
                return this.searchDocumentation(parameters.query, parameters.technology);

            case "extract_code_examples":
                return this.extractCodeExamples(parameters.url, parameters.language);

            case "compare_approaches":
                // hardcode sources as a string, seperated by commas ',' (originally an array of URLs)
                return this.compareApproaches(parameters.topic, parameters.sources);

            default:
                throw new Error(`Unknown tool: ${toolName}`);
        }
    }

    private async searchDocumentation(query: string, technology?: string): Promise<string> {
        const relevantLinks = this.selectedLinks.filter(link =>
            !technology || link.name.toLowerCase().includes(technology.toLowerCase())
        );

        if (relevantLinks.length === 0) {
            return "No documentation links selected or found for the specified technology.";
        }

        // Simulate searching through documentation
        const results = relevantLinks.map(link =>
            `Found in ${link.name}: Relevant information about "${query}" can be found at ${link.url}`
        );

        return `Search results for "${query}":\n\n${results.join('\n\n')}`;
    }

    private async extractCodeExamples(url: string, language?: string): Promise<string> {
        // Simulate code extraction
        const mockExamples = {
            'https://react.dev/learn': `
                // React Component Example
                function MyComponent() {
                const [count, setCount] = useState(0);
                
                return (
                    <div>
                    <p>Count: {count}</p>
                    <button onClick={() => setCount(count + 1)}>
                        Increment
                    </button>
                    </div>
                );
                }`,
                            'https://www.typescriptlang.org/docs/': `
                // TypeScript Interface Example
                interface User {
                id: number;
                name: string;
                email: string;
                }

                function greetUser(user: User): string {
                return \`Hello, \${user.name}!\`;
            }`
        };

        const example = mockExamples[url as keyof typeof mockExamples];
        if (example) {
            return `Code example extracted from ${url}:\n\n\`\`\`${language || 'javascript'}${example}\n\`\`\``;
        }

        return `No code examples found at ${url}`;
    }

    private async compareApproaches(topic: string, sources?: string): Promise<string> {
        // hardcode sources as a string (originally an array of URLs)
        const sourcesToUse = sources.split(',') || this.selectedLinks.map(link => link.url);

        if (sourcesToUse.length < 2) {
            return "Need at least 2 sources to compare approaches.";
        }

        // Simulate comparison
        return `Comparison of approaches for "${topic}":\n\n${sourcesToUse.map((source, index) =>
            `Approach ${index + 1} (${source}):\n- Simulated comparison point\n- Different methodology\n- Pros and cons`
        ).join('\n\n')}`;
    }

    getAvailableTools(): MCPTool[] {
        return this.tools;
    }

    getAvailableResources(): MCPResource[] {
        return this.resources;
    }

    generateContextPrompt(): string {
        if (this.selectedLinks.length === 0) {
            return "";
        }

        return `\n\nContext: I have access to the following documentation resources:\n${this.selectedLinks.map(link => `- ${link.name}: ${link.url}`).join('\n')
            }\n\nYou can use these resources to provide more accurate and detailed responses about the technologies mentioned.`;
    }
}