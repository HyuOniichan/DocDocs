import { Code, Target, Users, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";

const About = () => {
    const values = [
        {
            icon: Target,
            title: "Focused Learning",
            description: "We believe in targeted, efficient learning that gets you productive faster."
        },
        {
            icon: Users,
            title: "Developer-First",
            description: "Built by developers, for developers. We understand your challenges and goals."
        },
        {
            icon: Lightbulb,
            title: "Clear Explanations",
            description: "Complex concepts broken down into digestible, practical insights."
        }
    ];

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mx-auto mb-6">
                        <Code className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        About DocDocs
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We're on a mission to make technical documentation and programming concepts
                        accessible to developers of all skill levels.
                    </p>
                </div>

                {/* Story Section */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Story</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="mb-4">
                            Every developer has been there - staring at dense technical documentation,
                            trying to piece together how to implement a concept or understand a framework.
                            The learning curve can be steep, and finding clear, practical explanations
                            often feels like searching for a needle in a haystack.
                        </p>
                        <p className="mb-4">
                            DocDocs was born from this frustration. We wanted to create a tool that
                            could bridge the gap between complex technical documentation and practical
                            understanding. Our AI companion doesn't just regurgitate documentation -
                            it explains concepts in ways that make sense for your specific context and skill level.
                        </p>
                        <p>
                            Whether you're a beginner trying to understand your first framework or an
                            experienced developer diving into a new technology, DocDocs adapts its
                            explanations to meet you where you are in your learning journey.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
                        What Drives Us
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <Card key={index} className="p-6 text-center">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                                    <value.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {value.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Mission Section */}
                <div className="text-center bg-muted/30 rounded-2xl p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Our Mission
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        To democratize programming knowledge by making technical documentation
                        understandable, accessible, and actionable for every developer, regardless
                        of their experience level.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;