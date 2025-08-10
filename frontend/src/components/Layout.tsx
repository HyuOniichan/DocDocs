import { Link, useLocation } from "react-router-dom";
import { Code, Github, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
    children: React.ReactNode;
}

const githubLink = "https://github.com/HyuOniichan/DocDocs"
const facebookLink = "https://www.facebook.com/uchuy.789289/";

export const Layout = ({ children }: LayoutProps) => {
    const location = useLocation();

    const navItems = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Chat", path: "/chat" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Navbar */}
            <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                                <Code className="w-4 h-4" />
                            </div>
                            <span className="font-semibold text-foreground">DocDocs</span>
                        </Link>

                        <div className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <Button
                                    key={item.path}
                                    asChild
                                    variant={location.pathname === item.path ? "default" : "ghost"}
                                    size="sm"
                                >
                                    <Link to={item.path}>{item.name}</Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card/30">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                                    <Code className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-foreground">DocDocs</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Your programming learning companion for understanding technical documentation and concepts.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
                            <div className="flex gap-3">
                                <Link to={githubLink} target="_blank" rel="noopener noreferrer">
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <Github className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link to={facebookLink} target="_blank" rel="noopener noreferrer">
                                    <Button size="icon" variant="ghost" className="h-8 w-8">
                                        <Facebook className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border mt-8 pt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            ©2025 DocDocs. Built with love for developers.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}