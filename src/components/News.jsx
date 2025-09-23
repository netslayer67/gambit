import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// 🛡️ Simple sanitizer biar input aman
const sanitizeInput = (value) => {
    return value.replace(/<[^>]*>?/gm, "").replace(/(http|https):\/\/\S+/g, "");
};

const News = () => {
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        const savedArticles = localStorage.getItem("ghgambit_articles");
        if (savedArticles) {
            setArticles(JSON.parse(savedArticles));
        } else {
            const mockArticles = [
                {
                    id: 1,
                    title: "GH GAMBIT Wins Championship Title",
                    excerpt:
                        "After an intense season, GH GAMBIT secures the championship with a stunning 98-92 victory in the finals.",
                    author: "Sports Desk",
                    date: "2024-01-15",
                    category: "games",
                    featured: true,
                },
                {
                    id: 2,
                    title: "New Training Facility Opens",
                    excerpt:
                        "State-of-the-art training facility equipped with the latest technology opens to enhance player development.",
                    author: "Team Management",
                    date: "2024-01-12",
                    category: "team",
                    featured: false,
                },
                {
                    id: 3,
                    title: "Player of the Month: Marcus Johnson",
                    excerpt:
                        "Marcus Johnson receives Player of the Month award for outstanding performance in December.",
                    author: "Sports Reporter",
                    date: "2024-01-10",
                    category: "players",
                    featured: false,
                },
                {
                    id: 4,
                    title: "Community Outreach Program Launch",
                    excerpt:
                        "GH GAMBIT launches new community program to support local youth basketball development.",
                    author: "Community Relations",
                    date: "2024-01-08",
                    category: "community",
                    featured: false,
                },
                {
                    id: 5,
                    title: "Season Ticket Renewals Now Open",
                    excerpt:
                        "Secure your seats for next season. Early bird pricing available for loyal fans.",
                    author: "Ticket Office",
                    date: "2024-01-05",
                    category: "announcements",
                    featured: false,
                },
            ];
            setArticles(mockArticles);
            localStorage.setItem("ghgambit_articles", JSON.stringify(mockArticles));
        }
    }, []);

    const categories = [
        { id: "all", label: "All News" },
        { id: "games", label: "Games" },
        { id: "team", label: "Team" },
        { id: "players", label: "Players" },
        { id: "community", label: "Community" },
        { id: "announcements", label: "Announcements" },
    ];

    const filteredArticles = articles.filter(
        (article) => selectedCategory === "all" || article.category === selectedCategory
    );

    const featuredArticle = articles.find((article) => article.featured);
    const regularArticles = filteredArticles.filter((a) => !a.featured);

    const handleReadMore = (id) => {
        toast({
            title: "🚧 Feature Coming Soon",
            description: "Full article view belum tersedia, stay tuned! 🚀",
        });
    };

    const getCategoryColor = (category) => {
        const tokens = {
            games: "bg-success/15 text-success",
            team: "bg-secondary/15 text-secondary",
            players: "bg-info/15 text-info",
            community: "bg-warning/15 text-warning",
            announcements: "bg-error/15 text-error",
        };
        return tokens[category] || "bg-muted/15 text-muted";
    };

    return (
        <section className="relative py-20 px-4">
            {/* ✨ Decorative Blobs */}
            <motion.div
                className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background: "radial-gradient(circle, hsl(var(--primary)/0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-25"
                style={{
                    background: "radial-gradient(circle, hsl(var(--secondary)/0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto relative z-10">
                {/* 🏆 Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-foreground bg-clip-text text-transparent">
                        Latest News
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
                        Stay connected with the latest updates and announcements.
                    </p>
                </motion.div>

                {/* 🎛 Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <Button
                            key={category.id}
                            size="sm"
                            variant={selectedCategory === category.id ? "default" : "ghost"}
                            onClick={() => setSelectedCategory(sanitizeInput(category.id))}
                            className={`transition-all duration-300 ${selectedCategory === category.id
                                    ? "bg-primary text-primary-foreground shadow-liquid"
                                    : "glass-base hover:bg-foreground/5"
                                }`}
                        >
                            {category.label}
                        </Button>
                    ))}
                </motion.div>

                {/* 🌟 Featured Article */}
                {featuredArticle && selectedCategory === "all" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="glass-base rounded-3xl overflow-hidden mb-14 hover:shadow-liquid transition-all duration-300"
                    >
                        <div className="grid lg:grid-cols-2 gap-0">
                            <div className="aspect-video lg:aspect-auto">
                                <img
                                    className="w-full h-full object-cover"
                                    alt={featuredArticle.title}
                                    src="https://images.unsplash.com/photo-1683701844845-114d77be00ef"
                                />
                            </div>
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="badge-glass bg-primary/20 text-primary">Featured</span>
                                    <span className={`badge-glass ${getCategoryColor(featuredArticle.category)}`}>
                                        <Tag className="w-3 h-3 mr-1" />
                                        {featuredArticle.category}
                                    </span>
                                </div>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                    {featuredArticle.title}
                                </h2>
                                <p className="text-muted text-lg mb-6">{featuredArticle.excerpt}</p>
                                <div className="flex items-center flex-wrap gap-4 mb-6 text-sm text-muted">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> {featuredArticle.author}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />{" "}
                                        {new Date(featuredArticle.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={() => handleReadMore(featuredArticle.id)}
                                    className="flex items-center gap-2 w-fit"
                                >
                                    Read Full Article <ArrowRight className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 📑 Regular Articles */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularArticles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.6 }}
                            className="glass-base rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-liquid transition-all duration-300 flex flex-col"
                        >
                            <div className="aspect-video">
                                <img
                                    className="w-full h-full object-cover"
                                    alt={article.title}
                                    src="https://images.unsplash.com/photo-1595872018818-97555653a011"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center mb-3">
                                    <span className={`badge-glass ${getCategoryColor(article.category)}`}>
                                        <Tag className="w-3 h-3 mr-1" /> {article.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                                <p className="text-muted mb-4 line-clamp-3">{article.excerpt}</p>
                                <div className="flex items-center justify-between text-sm text-muted mb-4">
                                    <span className="flex items-center gap-2">
                                        <User className="w-4 h-4" /> {article.author}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />{" "}
                                        {new Date(article.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-auto"
                                    onClick={() => handleReadMore(article.id)}
                                >
                                    Read More
                                </Button>
                            </div>
                        </motion.article>
                    ))}
                </div>

                {filteredArticles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-xl text-muted">No articles found in this category.</p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default News;
