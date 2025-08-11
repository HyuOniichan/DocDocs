import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus, Edit2, Trash2, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { DocLink, TechDoc } from "@/types";
import { techNames, mockDocs } from "@/types/variables";

interface DocumentationPanelProps {
    onSelectedLinksChange: (selectedLinks: DocLink[]) => void;
    userQuery?: string;
}

export const DocumentationPanel = ({ onSelectedLinksChange, userQuery }: DocumentationPanelProps) => {
    const [techDocs, setTechDocs] = useState<TechDoc[]>([]);
    const [editingLink, setEditingLink] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editUrl, setEditUrl] = useState("");
    const [isExtracting, setIsExtracting] = useState(false);
    const { toast } = useToast();

    // Extract technologies from user query
    const extractTechnologies = (query: string): string[] => {
        return techNames.filter(tech =>
            query.toLowerCase().includes(tech.toLowerCase()) ||
            query.toLowerCase().includes(tech.replace('.', '').toLowerCase()) || 
            query.toLowerCase().includes(tech.replace(' ', '').toLowerCase())
        );
    };

    // Simulate documentation scraping
    const scrapeDocumentation = async (tech: string): Promise<DocLink[]> => {
        return mockDocs[tech.toLowerCase()] || [];
    };

    // Handle tech extraction from user query
    useEffect(() => {
        if (userQuery) {
            setIsExtracting(true);
            const extractedTechs = extractTechnologies(userQuery);

            Promise.all(
                extractedTechs.map(async (tech) => {
                    const existingTech = techDocs.find(t => t.name.toLowerCase() === tech.toLowerCase());
                    if (!existingTech) {
                        const links = await scrapeDocumentation(tech);
                        return {
                            id: Date.now().toString() + tech,
                            name: tech,
                            links,
                            expanded: false
                        };
                    }
                    return null;
                })
            ).then((newTechs) => {
                const validTechs = newTechs.filter(Boolean) as TechDoc[];
                if (validTechs.length > 0) {
                    setTechDocs(prev => [...prev, ...validTechs]);
                    saveTechDocs([...techDocs, ...validTechs]);
                    toast({
                        title: "Documentation Found",
                        description: `Found docs for: ${validTechs.map(t => t.name).join(', ')}`,
                    });
                }
                setIsExtracting(false);
            });
        }
    }, [userQuery]);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('tech-docs');
        if (saved) {
            setTechDocs(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage
    const saveTechDocs = (docs: TechDoc[]) => {
        localStorage.setItem('tech-docs', JSON.stringify(docs));
    };

    // Update selected links callback
    useEffect(() => {
        const selectedLinks = techDocs.flatMap(tech =>
            tech.links.filter(link => link.selected)
        );
        onSelectedLinksChange(selectedLinks);
    }, [techDocs, onSelectedLinksChange]);

    const toggleTech = (techId: string) => {
        const updated = techDocs.map(tech =>
            tech.id === techId ? { ...tech, expanded: !tech.expanded } : tech
        );
        setTechDocs(updated);
        saveTechDocs(updated);
    };

    const toggleLink = (techId: string, linkId: string) => {
        const updated = techDocs.map(tech =>
            tech.id === techId
                ? {
                    ...tech,
                    links: tech.links.map(link =>
                        link.id === linkId ? { ...link, selected: !link.selected } : link
                    )
                }
                : tech
        );
        setTechDocs(updated);
        saveTechDocs(updated);
    };

    const startEdit = (link: DocLink) => {
        setEditingLink(link.id);
        setEditName(link.name);
        setEditUrl(link.url);
    };

    const saveEdit = (techId: string, linkId: string) => {
        const updated = techDocs.map(tech =>
            tech.id === techId
                ? {
                    ...tech,
                    links: tech.links.map(link =>
                        link.id === linkId
                            ? { ...link, name: editName, url: editUrl }
                            : link
                    )
                }
                : tech
        );
        setTechDocs(updated);
        saveTechDocs(updated);
        setEditingLink(null);
    };

    const deleteLink = (techId: string, linkId: string) => {
        const updated = techDocs.map(tech =>
            tech.id === techId
                ? {
                    ...tech,
                    links: tech.links.filter(link => link.id !== linkId)
                }
                : tech
        );
        setTechDocs(updated);
        saveTechDocs(updated);
    };

    const addLink = (techId: string) => {
        const newLink: DocLink = {
            id: Date.now().toString(),
            name: "New Link",
            url: "https://",
            selected: false
        };

        const updated = techDocs.map(tech =>
            tech.id === techId
                ? { ...tech, links: [...tech.links, newLink] }
                : tech
        );
        setTechDocs(updated);
        saveTechDocs(updated);
        startEdit(newLink);
    };

    const deleteTech = (techId: string) => {
        const updated = techDocs.filter(tech => tech.id !== techId);
        setTechDocs(updated);
        saveTechDocs(updated);
    };

    return (
        <div className="h-full bg-card border-l border-border flex flex-col">
            <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Documentation Links</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Auto-extracted from your queries
                </p>
                {isExtracting && (
                    <div className="mt-2 text-xs text-primary">Extracting technologies...</div>
                )}
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                    {techDocs.map((tech) => (
                        <Card key={tech.id} className="p-3">
                            <Collapsible open={tech.expanded} onOpenChange={() => toggleTech(tech.id)}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger className="flex items-center gap-2 hover:text-primary">
                                        {tech.expanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                        <span className="font-medium capitalize">{tech.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({tech.links.length})
                                        </span>
                                    </CollapsibleTrigger>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => addLink(tech.id)}
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteTech(tech.id)}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                <CollapsibleContent className="mt-3 space-y-2">
                                    {tech.links.map((link) => (
                                        <div key={link.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                                            <Checkbox
                                                checked={link.selected}
                                                onCheckedChange={() => toggleLink(tech.id, link.id)}
                                            />

                                            {editingLink === link.id ? (
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        placeholder="Link name"
                                                        className="h-8"
                                                    />
                                                    <Input
                                                        value={editUrl}
                                                        onChange={(e) => setEditUrl(e.target.value)}
                                                        placeholder="URL"
                                                        className="h-8"
                                                    />
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => saveEdit(tech.id, link.id)}
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setEditingLink(null)}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-medium truncate">{link.name}</div>
                                                        <div className="text-xs text-muted-foreground truncate">
                                                            {link.url}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => window.open(link.url, '_blank')}
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => startEdit(link)}
                                                        >
                                                            <Edit2 className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => deleteLink(tech.id, link.id)}
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </CollapsibleContent>
                            </Collapsible>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};