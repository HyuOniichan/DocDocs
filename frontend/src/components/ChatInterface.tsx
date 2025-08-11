import { useState, useEffect } from "react";
import { Send, Code, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { DocumentationPanel } from "@/components/DocumentationPanel";

interface Message {
    id: string;
    content: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

import { DocLink } from "@/components/DocumentationPanel";
import { MCPService } from "@/services/McpService";

const examplePrompts = [
    "Explain how React hooks work",
    "What's the difference between let, const, and var?",
    "How do I deploy a React app?",
    "Best practices for TypeScript types"
];

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            content: "Hello! I'm here to help you understand technical documentation and learn programming concepts. What would you like to know?",
            sender: "assistant",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLinks, setSelectedLinks] = useState<DocLink[]>([]);
    const [lastUserQuery, setLastUserQuery] = useState<string>("");
    const mcpService = MCPService.getInstance();

    // Update MCP service when selected links change
    useEffect(() => {
        mcpService.updateSelectedLinks(selectedLinks);
    }, [selectedLinks, mcpService]);

    const handleSendMessage = async (content: string) => {
        if (!content.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            sender: "user",
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue("");
        setIsLoading(true);
        setLastUserQuery(content);

        // Simulate AI response with MCP context
        setTimeout(() => {
            const response: Message = {
                id: (Date.now() + 1).toString(),
                content: generateResponse(content),
                sender: "assistant",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, response]);
            setIsLoading(false);
        }, 1500);
    };

    const generateResponse = (userMessage: string): string => {
        // Get context from selected documentation links
        const contextPrompt = mcpService.generateContextPrompt();

        let baseResponse = "";

        if (userMessage.toLowerCase().includes("react")) {
            baseResponse = "React is a JavaScript library for building user interfaces. It uses a component-based architecture where you create reusable UI components. Key concepts include:\n\n• **Components**: Reusable pieces of UI\n• **Props**: Data passed to components\n• **State**: Component's internal data\n• **Hooks**: Functions that let you use state and lifecycle features\n\nWould you like me to explain any of these concepts in more detail?";
        } else if (userMessage.toLowerCase().includes("typescript")) {
            baseResponse = "TypeScript is a superset of JavaScript that adds static type checking. Benefits include:\n\n• **Type Safety**: Catch errors at compile time\n• **Better IDE Support**: Autocomplete and refactoring\n• **Self-documenting Code**: Types serve as documentation\n• **Easier Refactoring**: Confidence when changing code\n\nHere's a simple example:\n```typescript\ninterface User {\n  name: string;\n  age: number;\n}\n\nconst user: User = {\n  name: \"John\",\n  age: 30\n};\n```";
        } else {
            baseResponse = "I understand you're asking about development concepts. Could you be more specific about what you'd like to learn? I'm here to help explain technical documentation, programming concepts, and best practices in a clear and beginner-friendly way.";
        }

        // Add context from selected links if available
        if (selectedLinks.length > 0) {
            baseResponse += `\n\n**📚 I also have access to these documentation resources:**\n${selectedLinks.map(link => `• [${link.name}](${link.url})`).join('\n')
                }\n\nI can search through these resources to provide more detailed and accurate information.`;
        }

        return baseResponse + contextPrompt;
    };

    return (
        <ResizablePanelGroup direction="horizontal" className="h-screen">
            {/* Main Chat Area */}
            <ResizablePanel defaultSize={70} minSize={50}>
                <div className="flex flex-col h-full bg-background relative">
                    {/* Chat Messages */}
                    <ScrollArea className="flex-1 p-6 pb-32">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {messages.length === 1 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-medium text-foreground mb-4">Try asking about:</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {examplePrompts.map((prompt, index) => (
                                            <Card
                                                key={index}
                                                className="p-4 cursor-pointer hover:bg-accent transition-colors"
                                                onClick={() => handleSendMessage(prompt)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <MessageCircle className="w-4 h-4 text-primary" />
                                                    <span className="text-sm text-foreground">{prompt}</span>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-6 py-4 ${message.sender === "user"
                                                ? "bg-chat-user text-chat-user-foreground"
                                                : "bg-chat-assistant text-chat-assistant-foreground border border-border"
                                            }`}
                                    >
                                        <div className="prose prose-sm max-w-none prose-headings:text-inherit prose-p:text-inherit prose-strong:text-inherit prose-code:text-inherit prose-pre:text-inherit [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                            {message.sender === "assistant" ? (
                                                <ReactMarkdown>
                                                    {message.content}
                                                </ReactMarkdown>
                                            ) : (
                                                <div className="whitespace-pre-wrap">{message.content}</div>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs opacity-70">
                                            {message.timestamp.toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-chat-assistant border border-border rounded-2xl px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area - Fixed at bottom */}
                    <div className="fixed bottom-0 left-0 right-0 p-6 border-t border-border bg-card/95 backdrop-blur-sm">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex gap-3">
                                <Input
                                    placeholder="Ask me anything about programming, frameworks, or documentation..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                                    className="flex-1 bg-background"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSendMessage(inputValue)}
                                    disabled={!inputValue.trim() || isLoading}
                                    size="icon"
                                    className="shrink-0"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Ask about React, TypeScript, JavaScript, or any programming concept
                            </p>
                        </div>
                    </div>
                </div>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Documentation Panel */}
            <ResizablePanel defaultSize={30} minSize={25} maxSize={50}>
                <DocumentationPanel
                    onSelectedLinksChange={setSelectedLinks}
                    userQuery={lastUserQuery}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
};