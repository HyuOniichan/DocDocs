import { Link } from "react-router-dom";
import { ArrowRight, Code, BookOpen, MessageCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
    const features = [
        {
            icon: MessageCircle,
            title: "Interactive Chat",
            description: "Ask questions in natural language and get detailed explanations tailored to your level."
        },
        {
            icon: BookOpen,
            title: "Documentation Helper",
            description: "Get help understanding complex technical documentation with simplified explanations."
        },
        {
            icon: Code,
            title: "Code Examples",
            description: "Receive practical code examples and best practices for real-world implementation."
        },
        {
            icon: Zap,
            title: "Instant Answers",
            description: "Get immediate responses to your programming questions and technical queries."
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 px-6 text-center bg-gradient-to-b from-background to-muted/20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground mx-auto mb-6">
                        <Code className="w-8 h-8" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                        Your Programming
                        <span className="text-primary block">Learning Companion</span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Master technical documentation and programming concepts with AI-powered explanations
                        designed for developers at every level.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="text-lg px-8">
                            <Link to="/chat">
                                Start Learning
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="text-lg px-8">
                            <Link to="/about">Learn More</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Everything you need to learn faster
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            DocDocs provides intelligent assistance to help you understand complex
                            programming concepts and documentation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mx-auto mb-4">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-muted/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Ready to accelerate your learning?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Join thousands of developers who are already using DocDocs to master
                        programming concepts faster than ever.
                    </p>
                    <Button asChild size="lg" className="text-lg px-8">
                        <Link to="/chat">
                            Get Started Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Home;