import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    Calendar,
    User,
    ArrowRight,
    Tag,
    TrendingUp,
    Sparkles,
    Clock,
    Award,
    Zap,
    ChevronRight,
    Filter,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// --- Lightweight sanitizer (client-side UX defense) ---
const sanitizeInput = (value = '') => {
    if (!value) return '';
    return String(value)
        .replace(/<[^>]*>/g, '') // strip tags
        .replace(/https?:\/\/\S+/gi, '') // strip urls
        .replace(/(javascript:|data:|vbscript:)/gi, '')
        .replace(/[^\w\s\-.,()!?'"/:]/g, '') // allow basic punctuation
        .trim()
        .slice(0, 160);
};

// --- Small presentational pieces kept internal and memoized ---
const Pill = React.memo(({ children, className = '' }) => (
    <span className={`badge-glass text-xs px-3 py-1 rounded-full font-medium ${className}`}>{children}</span>
));

const FeaturedCard = React.memo(({ article, onReadMore }) => {
    if (!article) return null;
    return (
        <motion.article
            className="mb-12 md:mb-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
        >
            <div className="glass-base rounded-3xl overflow-hidden group hover:shadow-liquid transition-all duration-[320ms]">
                <div className="relative">
                    <div className="aspect-video md:aspect-[21/9] relative overflow-hidden">
                        <img
                            loading="lazy"
                            className="w-full h-full object-cover"
                            alt={article.title}
                            src={article.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc'}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-onyx via-transparent to-transparent opacity-60" />

                        <div className="absolute top-4 left-4 md:top-6 md:left-6">
                            <div className="glass-base px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 backdrop-blur-xl">
                                <Award className="w-4 h-4 text-gold" />
                                <span className="text-xs md:text-sm font-bold text-gold">FEATURED</span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                            <div>
                                <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                                    <Pill className={`bg-gradient-to-r ${getCategoryStyle(article.category)}`}>
                                        <Tag className="w-3 h-3 mr-1" />
                                        {article.category}
                                    </Pill>
                                    {article.trending && (
                                        <Pill className="bg-gradient-to-r from-error/20 to-error/10 text-error">
                                            <TrendingUp className="w-3 h-3 mr-1" /> Trending
                                        </Pill>
                                    )}
                                </div>

                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-tertiary mb-2 md:mb-4">{article.title}</h2>

                                <p className="text-pearl text-sm md:text-base lg:text-lg mb-4 md:mb-6 max-w-2xl">{article.excerpt}</p>

                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-pearl/80 text-xs md:text-sm">
                                    <span className="flex items-center gap-2"><User className="w-4 h-4" />{article.author}</span>
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{article.readTime}</span>
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />{formatDate(article.date)}</span>
                                </div>

                                <button
                                    onClick={() => onReadMore(article.id)}
                                    className="mt-6 md:mt-8 glass-base px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold flex items-center gap-2 group/btn hover:shadow-liquid transition-all duration-[320ms]"
                                >
                                    <span className="text-sm md:text-base">Unlock Full Story</span>
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-[320ms] group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
});

const ArticleCard = React.memo(({ article, onReadMore, reducedMotion }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.36 }}
            className="group relative"
        >
            <div className="glass-base rounded-2xl md:rounded-3xl overflow-hidden h-full hover:shadow-liquid transition-all duration-[320ms] hover:-translate-y-1 border border-border/50 hover:border-primary/30">
                <div className="aspect-[16/10] relative overflow-hidden">
                    <img loading="lazy" className="w-full h-full object-cover" alt={article.title} src={article.image || 'https://images.unsplash.com/photo-1546519638-68e109498ffc'} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                    <div className="absolute top-3 md:top-4 left-3 md:left-4">
                        <Pill className={`bg-gradient-to-r ${getCategoryStyle(article.category)} text-xs font-semibold`}>{article.category}</Pill>
                    </div>

                    {article.exclusive && (
                        <div className="absolute top-3 md:top-4 right-3 md:right-4">
                            <div className="badge-glass bg-gradient-to-r from-gold/30 to-gold/10 text-gold text-xs font-bold">VIP</div>
                        </div>
                    )}
                </div>

                <div className="p-5 md:p-6 flex flex-col">
                    <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-[320ms]">{article.title}</h3>
                    <p className="text-muted text-sm md:text-base mb-4 line-clamp-2">{article.excerpt}</p>

                    <div className="flex items-center justify-between text-xs md:text-sm text-muted/70 mb-4">
                        <span className="flex items-center gap-1.5"><User className="w-3 h-3" />{article.author}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{article.readTime || '3 min'}</span>
                    </div>

                    <button onClick={() => onReadMore(article.id)} className="mt-auto glass-base px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-[320ms] flex items-center justify-center gap-2 group/btn border border-border/50 hover:border-primary/30">
                        <span>Read More</span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-[320ms] group-hover/btn:translate-x-1" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
});

// --- helpers ---
const getCategoryStyle = (category) => {
    const styles = {
        games: 'from-success/20 to-success/5 text-success border-success/20',
        team: 'from-info/20 to-info/5 text-info border-info/20',
        players: 'from-primary/20 to-primary/5 text-primary border-primary/20',
        community: 'from-warning/20 to-warning/5 text-warning border-warning/20',
        announcements: 'from-gold/20 to-gold/5 text-gold border-gold/20',
    };
    return styles[category] || 'from-muted/20 to-muted/5 text-muted border-muted/20';
};

const formatDate = (iso) => {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
        return iso;
    }
};

// --- Main component ---
const News = () => {
    const reduce = useReducedMotion();
    const [articles, setArticles] = useState([]);
    const [category, setCategory] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const saved = localStorage.getItem('ghgambit_articles');
        if (saved) return setArticles(JSON.parse(saved));

        const seed = [
            { id: 1, title: 'Championship Glory', excerpt: 'Historic victory seals our legacy as champions.', author: 'Elite Desk', date: '2024-01-15', category: 'games', featured: true, readTime: '5 min', trending: true, exclusive: false },
            { id: 2, title: 'Elite Training Hub', excerpt: 'Next-gen facility redefines excellence.', author: 'Management', date: '2024-01-12', category: 'team', featured: false, readTime: '3 min' },
            { id: 3, title: 'MVP: Marcus Johnson', excerpt: 'Exceptional talent recognized.', author: 'Insider', date: '2024-01-10', category: 'players', featured: false, readTime: '4 min' },
            { id: 4, title: 'Community Impact', excerpt: 'Elevating futures through basketball.', author: 'Relations', date: '2024-01-08', category: 'community', featured: false, readTime: '6 min' },
            { id: 5, title: 'VIP Season Access', excerpt: 'Exclusive membership now available.', author: 'Concierge', date: '2024-01-05', category: 'announcements', featured: false, readTime: '2 min', exclusive: true },
        ];

        localStorage.setItem('ghgambit_articles', JSON.stringify(seed));
        setArticles(seed);
    }, []);

    const categories = useMemo(
        () => [
            { id: 'all', label: 'All', icon: <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> },
            { id: 'games', label: 'Games', icon: <TrendingUp className="w-3 h-3 md:w-4 md:h-4" /> },
            { id: 'team', label: 'Team', icon: <Award className="w-3 h-3 md:w-4 md:h-4" /> },
            { id: 'players', label: 'Players', icon: <User className="w-3 h-3 md:w-4 md:h-4" /> },
            { id: 'community', label: 'Community', icon: <Zap className="w-3 h-3 md:w-4 md:h-4" /> },
        ], []
    );

    const filtered = useMemo(() => articles.filter(a => category === 'all' || a.category === category), [articles, category]);
    const featured = useMemo(() => articles.find(a => a.featured), [articles]);
    const regular = useMemo(() => filtered.filter(a => !a.featured), [filtered]);

    const handleReadMore = useCallback((id) => {
        toast({ title: '✨ Premium Content', description: 'Full access coming soon for elite members.' });
    }, []);

    const setCat = useCallback((id) => setCategory(sanitizeInput(id)), []);

    return (
        <section className="relative min-h-screen py-12 md:py-20 px-4 overflow-hidden" ref={containerRef}>
            {/* Decorative blobs (token-based) - respects reduced motion */}
            {!reduce && (
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.12), transparent 60%)' }} />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, hsl(var(--gold)/0.08), transparent 60%)' }} />
                </div>
            )}

            <div className="container max-w-7xl mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.32 }} className="text-center mb-8 md:mb-16">
                    <div className="inline-flex items-center gap-2 glass-base px-4 py-1.5 rounded-full mb-4 md:mb-6">
                        <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                        <span className="text-xs md:text-sm font-medium text-gold">Elite Updates</span>
                    </div>

                    <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-4">
                        <span className="bg-gradient-to-r from-primary via-gold to-tertiary bg-clip-text text-transparent">EXCLUSIVE NEWS</span>
                    </h1>

                    <p className="text-muted text-sm md:text-base lg:text-lg max-w-md mx-auto">Premium insights for elite members</p>
                </motion.div>

                {/* Filter / tabs */}
                <div className="mb-8">
                    <div className="hidden md:flex justify-center">
                        <div className="glass-base p-1.5 rounded-2xl inline-flex gap-1">
                            {categories.map(cat => (
                                <button key={cat.id} onClick={() => setCat(cat.id)} className={`relative px-5 py-2 rounded-xl font-medium text-sm transition-all duration-[320ms] flex items-center gap-2 ${category === cat.id ? 'text-primary-foreground' : 'text-muted hover:text-foreground'}`}>
                                    {category === cat.id && <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary rounded-xl" />}
                                    <span className="relative z-10 flex items-center gap-2">{cat.icon}{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsFilterOpen(v => !v)} className="glass-base w-full px-4 py-3 rounded-2xl flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-medium"><Filter className="w-4 h-4" />{categories.find(c => c.id === category)?.label}</span>
                            <ChevronRight className={`w-5 h-5 transition-transform duration-[320ms] ${isFilterOpen ? 'rotate-90' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 glass-base rounded-2xl p-2 overflow-hidden">
                                    {categories.map(c => (
                                        <button key={c.id} onClick={() => { setCat(c.id); setIsFilterOpen(false); }} className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-[320ms] text-sm ${category === c.id ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary' : 'hover:bg-overlay-light'}`}>
                                            {c.icon}<span className="font-medium">{c.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Featured */}
                {featured && category === 'all' && <FeaturedCard article={featured} onReadMore={handleReadMore} />}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {regular.map((a) => (
                        <ArticleCard key={a.id} article={a} onReadMore={handleReadMore} reducedMotion={reduce} />
                    ))}
                </div>

                {/* Empty */}
                {filtered.length === 0 && (
                    <div className="text-center py-16 md:py-24">
                        <div className="glass-base inline-flex flex-col items-center p-8 md:p-12 rounded-3xl">
                            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-muted mb-4 opacity-50" />
                            <p className="text-lg md:text-xl text-muted mb-2">No exclusive content yet</p>
                            <p className="text-sm md:text-base text-muted/70">Check back soon for premium updates</p>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`\n        @keyframes gradient {\n          0% { background-position: 0% 50%; }\n          50% { background-position: 100% 50%; }\n          100% { background-position: 0% 50%; }\n        }\n        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }\n      `}</style>
        </section>
    );
};

export default React.memo(News);
