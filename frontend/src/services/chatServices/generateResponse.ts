import { DocLink } from "@/types";
import { MCPService } from "../McpService";

const generateResponse = (mcpService: MCPService, userMessage: string, selectedLinks: DocLink[] = []): string => {
    // Get context from selected documentation links
    const contextPrompt = mcpService.generateContextPrompt();

    let baseResponse = "";

    // Hardcode
    if (userMessage.toLowerCase().includes("react")) {
        baseResponse = "React is a JavaScript library for building user interfaces. It uses a component-based architecture where you create reusable UI components. Key concepts include:\n\n• **Components**: Reusable pieces of UI\n• **Props**: Data passed to components\n• **State**: Component's internal data\n• **Hooks**: Functions that let you use state and lifecycle features\n\nWould you like me to explain any of these concepts in more detail?";
    } else if (userMessage.toLowerCase().includes("typescript")) {
        baseResponse = "TypeScript is a superset of JavaScript that adds static type checking. Benefits include:\n\n• **Type Safety**: Catch errors at compile time\n• **Better IDE Support**: Autocomplete and refactoring\n• **Self-documenting Code**: Types serve as documentation\n• **Easier Refactoring**: Confidence when changing code\n\nHere's a simple example:\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: \"John\",\n  age: 30\n};\n```";
    } else {
        baseResponse = "I understand you're asking about development concepts. Could you be more specific about what you'd like to learn? I'm here to help explain technical documentation, programming concepts, and best practices in a clear and beginner-friendly way.";
    }

    // Add context from selected links if available
    if (selectedLinks.length > 0) {
        baseResponse += `
            \n\n**📚 I also have access to these documentation resources:**
            \n\n${selectedLinks.map(link => `- [${link.name}](${link.url})`).join('\n')}
            \n\nI can search through these resources to provide more detailed and accurate information.
        `;
    }

    return baseResponse + contextPrompt;
};

export default generateResponse;
