import { useState } from "react";
import { Mail, MessageCircle, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            toast({
                title: "Message sent!",
                description: "We'll get back to you as soon as possible.",
            });
        }, 1000);
    };

    const contactMethods = [
        {
            icon: Mail,
            title: "Email Us",
            description: "Get in touch via email",
            contact: "hello@devdocs-ai.com",
            action: "mailto:hello@devdocs-ai.com"
        },
        {
            icon: Github,
            title: "GitHub",
            description: "Contribute or report issues",
            contact: "github.com/devdocs-ai",
            action: "https://github.com"
        },
        {
            icon: MessageCircle,
            title: "Community",
            description: "Join our developer community",
            contact: "Discord Server",
            action: "#"
        }
    ];

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have questions, suggestions, or feedback? We'd love to hear from you.
                        Let's build something amazing together.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                        <Card className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your name"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        placeholder="What's this about?"
                                        required
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="message">Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us more about your question or feedback..."
                                        required
                                        className="mt-1 min-h-[120px]"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* Contact Methods */}
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-6">Other ways to reach us</h2>
                        <div className="space-y-4">
                            {contactMethods.map((method, index) => (
                                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                                            <method.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-foreground mb-1">
                                                {method.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {method.description}
                                            </p>
                                            <a
                                                href={method.action}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                {method.contact}
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* FAQ */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="font-medium text-foreground">How accurate are the AI responses?</p>
                                    <p className="text-muted-foreground">Our AI is trained on extensive programming documentation and constantly updated to provide accurate, helpful responses.</p>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Can I suggest new features?</p>
                                    <p className="text-muted-foreground">Absolutely! We welcome feature suggestions and feedback to improve DocDocs.</p>
                                </div>
                                <div>
                                    <p className="font-medium text-foreground">Is DocDocs free to use?</p>
                                    <p className="text-muted-foreground">Yes, DocDocs is currently free to use for all developers.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;