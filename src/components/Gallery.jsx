import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Camera,
    Video,
    X,
    ChevronLeft,
    ChevronRight,
    Play,
    Search,
    Filter,
    Calendar,
    Heart,
    Share,
    Download,
    Sparkles,
    Zap
} from "lucide-react";

// -------------------------
// Constants & Utilities
// -------------------------
const TRANS_MS = 320;
const TRANS = { duration: TRANS_MS / 1000, ease: [0.22, 1, 0.36, 1] };

// Sanitize user input to prevent malicious content
const sanitizeText = (s = "", max = 160) =>
    String(s || "")
        .replace(/<[^>]*>/g, "") // strip tags
        .replace(/https?:\/\/\S+|www\.\S+/gi, "") // strip urls
        .replace(/["'<>`\u0000-\u001F]/g, "") // strip weird control chars
        .trim()
        .slice(0, max);

const sanitizeQuery = (q = "", max = 80) => sanitizeText(q, max).toLowerCase();

// simple debounce hook (for search input) to avoid rerenders
function useDebounced(value, delay = 200) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

// Respect reduced-motion
const useShouldReduceMotion = () => useReducedMotion();

// -------------------------
// Subcomponents (memoized)
// -------------------------
const Badge = memo(({ children, variant = "photo" }) => (
    <span className={`badge-glass text-xs px-2 py-1 rounded-full inline-flex items-center gap-2`}>
        {children}
    </span>
));

const MediaTile = memo(function MediaTile({ item, index, onOpen, compact, liked, onToggleLike }) {
    return (
        <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ...TRANS, delay: (index % 6) * 0.03 }}
            className="relative group"
        >
            <div className="glass-base rounded-2xl overflow-hidden cursor-pointer transition-all duration-320 hover:scale-[1.02] h-full">
                <div className="aspect-video relative">
                    <img
                        src={item.thumbnail}
                        alt={sanitizeText(item.title)}
                        className="w-full h-full object-cover"
                        loading={compact ? "lazy" : "eager"}
                        decoding="async"
                    />

                    {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` }}>
                                <Play className="w-6 h-6 text-primary-foreground" />
                            </div>
                        </div>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2">
                        <Badge variant={item.type} className="glass-base">
                            {item.type === "video" ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                            <span className="hidden sm:inline text-xs">{item.type === "video" ? "Video" : "Photo"}</span>
                        </Badge>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleLike(item.id);
                            }}
                            className="w-8 h-8 rounded-full glass-base flex items-center justify-center"
                            aria-pressed={liked}
                        >
                            <Heart className={`w-4 h-4 ${liked ? 'fill-error text-error' : 'text-white'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">{sanitizeText(item.title, 50)}</h3>
                    <p className="text-muted text-xs line-clamp-2 mb-3">{sanitizeText(item.description, 80)}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-muted/80">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpen(item, index);
                            }}
                            className="text-xs text-primary font-medium flex items-center gap-1"
                        >
                            View
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

// -------------------------
// Lightbox (keyboard accessible)
// -------------------------
const Lightbox = ({ items, index, onClose, onNavigate, liked, onToggleLike }) => {
    const reduce = useShouldReduceMotion();
    const idxRef = useRef(index);
    idxRef.current = index;

    // keyboard handling
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onNavigate("next");
            if (e.key === "ArrowLeft") onNavigate("prev");
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, onNavigate]);

    if (!items?.length) return null;
    const item = items[index] || items[0];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
                aria-modal="true"
                role="dialog"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: reduce ? 1 : 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: reduce ? 1 : 0.95, opacity: 0 }}
                    transition={{ ...TRANS }}
                    className="relative max-w-5xl w-full glass-base rounded-3xl overflow-hidden border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass-base flex items-center justify-center"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {items.length > 1 && (
                        <>
                            <button
                                onClick={() => onNavigate("prev")}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-base flex items-center justify-center"
                                aria-label="Previous"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onNavigate("next")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-base flex items-center justify-center"
                                aria-label="Next"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div className="relative bg-black/20">
                        {item.type === "video" ? (
                            <video
                                controls
                                className="w-full max-h-[70vh] object-contain"
                                src={item.url}
                                poster={item.thumbnail}
                            />
                        ) : (
                            <img
                                src={item.url}
                                alt={sanitizeText(item.title)}
                                className="w-full max-h-[70vh] object-contain"
                            />
                        )}
                    </div>

                    <div className="p-6">
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">{sanitizeText(item.title, 80)}</h3>
                                <p className="text-muted mb-2">{sanitizeText(item.description, 220)}</p>
                                <div className="flex items-center gap-2 text-sm text-muted/80">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => onToggleLike(item.id)}
                                    className="w-10 h-10 rounded-full glass-base flex items-center justify-center"
                                    aria-pressed={liked}
                                >
                                    <Heart className={`w-5 h-5 ${liked ? 'fill-error text-error' : 'text-muted'}`} />
                                </button>
                                <button className="w-10 h-10 rounded-full glass-base flex items-center justify-center">
                                    <Share className="w-5 h-5 text-muted" />
                                </button>
                                <button className="w-10 h-10 rounded-full glass-base flex items-center justify-center">
                                    <Download className="w-5 h-5 text-muted" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <Badge variant={item.type} className="glass-base">
                                    {item.type === "video" ? <Video className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                                    <span className="text-xs">{item.type === "video" ? "Video" : "Photo"}</span>
                                </Badge>
                            </div>

                            <div className="text-sm text-muted">
                                {index + 1} of {items.length}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// -------------------------
// Decorative Blobs
// -------------------------
const DecorativeBlobs = memo(({ enabled = true }) => {
    const reduce = useShouldReduceMotion();
    if (!enabled || reduce) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.3), transparent 70%)` }}
                animate={{
                    x: [0, 20, 0, -20, 0],
                    y: [0, -20, 0, 20, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-20"
                style={{ background: `radial-gradient(circle, hsl(var(--gold) / 0.3), transparent 70%)` }}
                animate={{
                    x: [0, -15, 0, 15, 0],
                    y: [0, 15, 0, -15, 0]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </div>
    );
});

// -------------------------
// Main Gallery component
// -------------------------
const Gallery = () => {
    const [mediaItems, setMediaItems] = useState(() => []);
    const [selected, setSelected] = useState({ item: null, index: 0 });
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [compact, setCompact] = useState(false);
    const [likedItems, setLikedItems] = useState(() => new Set());

    const debouncedSearch = useDebounced(search, 220);

    // compact responsive behaviour
    useEffect(() => {
        const onResize = () => setCompact(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // load media from localStorage or fallback mocks
    useEffect(() => {
        try {
            const raw = localStorage.getItem("ghgambit_media");
            if (raw) {
                setMediaItems(JSON.parse(raw));
                return;
            }
        } catch (e) {
            console.warn("Failed to read local media, falling back to mocks.");
        }

        // fallback sample (small list to keep perf)
        const mock = [
            {
                id: 1,
                type: "photo",
                title: "Championship Victory",
                description: "Team celebrating after winning the championship",
                thumbnail: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=50&w=800&auto=format&fit=crop",
                url: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=1600&auto=format&fit=crop",
                date: "2024-01-10"
            },
            {
                id: 2,
                type: "video",
                title: "Game Highlights",
                description: "Best moments from last game",
                thumbnail: "https://images.unsplash.com/photo-1505842465776-3d90f616310d?q=50&w=800&auto=format&fit=crop",
                url: "https://www.w3schools.com/html/mov_bbb.mp4",
                date: "2024-01-08"
            },
            {
                id: 3,
                type: "photo",
                title: "Team Training",
                description: "Behind the scenes training session",
                thumbnail: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=50&w=800&auto=format&fit=crop",
                url: "https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=1600&auto=format&fit=crop",
                date: "2024-01-05"
            },
            {
                id: 4,
                type: "photo",
                title: "Fan Appreciation",
                description: "Players interacting with fans after the game",
                thumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=50&w=800&auto=format&fit=crop",
                url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1600&auto=format&fit=crop",
                date: "2024-01-03"
            },
            {
                id: 5,
                type: "video",
                title: "Player Interview",
                description: "Exclusive interview with team captain",
                thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b21fddf8?q=50&w=800&auto=format&fit=crop",
                url: "https://www.w3schools.com/html/mov_bbb.mp4",
                date: "2024-01-01"
            },
            {
                id: 6,
                type: "photo",
                title: "Team Huddle",
                description: "Players in pre-game huddle",
                thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=50&w=800&auto=format&fit=crop",
                url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
                date: "2023-12-28"
            }
        ];

        setMediaItems(mock);
        try {
            localStorage.setItem("ghgambit_media", JSON.stringify(mock));
        } catch (e) {
            console.error("Failed to save media to localStorage", e);
        }
    }, []);

    // filtered list memoized for performance
    const filtered = useMemo(() => {
        const q = sanitizeQuery(debouncedSearch);
        return mediaItems
            .filter((it) => filter === "all" || it.type === (filter === "photos" ? "photo" : filter === "videos" ? "video" : it.type))
            .filter((it) => {
                if (!q) return true;
                return (`${it.title} ${it.description}`.toLowerCase().includes(q));
            });
    }, [mediaItems, filter, debouncedSearch]);

    const openLightbox = useCallback((item, index) => setSelected({ item, index }), []);
    const closeLightbox = useCallback(() => setSelected({ item: null, index: 0 }), []);

    const navigate = useCallback((dir) => {
        if (!filtered.length) return;
        const current = selected.index || 0;
        const next = dir === "next" ? (current + 1) % filtered.length : (current - 1 + filtered.length) % filtered.length;
        setSelected({ item: filtered[next], index: next });
    }, [filtered, selected.index]);

    const toggleLike = useCallback((itemId) => {
        setLikedItems(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId);
            else next.add(itemId);
            return next;
        });
    }, []);

    // lightweight grid columns responsive choice
    const gridCols = compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

    return (
        <section className="relative py-12 px-4 md:px-8 min-h-screen bg-gradient-to-br from-background via-background to-pearl dark:from-onyx dark:via-background dark:to-onyx">
            {/* Decorative Blobs */}
            <DecorativeBlobs enabled={!compact} />

            <div className="container mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANS, delay: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` }}>
                            <Camera className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-gold to-platinum bg-clip-text text-transparent">Gallery</h1>
                    </div>
                    <p className="text-muted max-w-2xl mx-auto">Relive GH GAMBIT's most iconic moments — select to view photos & videos.</p>
                </motion.div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div className="flex flex-wrap gap-3">
                        {[
                            { id: "all", label: "All", icon: null },
                            { id: "photos", label: "Photos", icon: Camera },
                            { id: "videos", label: "Videos", icon: Video }
                        ].map((b) => (
                            <button
                                key={b.id}
                                onClick={() => setFilter(b.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all duration-320 ${filter === b.id ? "shadow-lg bg-gradient-to-r from-primary to-gold text-white" : "glass-base hover:bg-white/10"}`}
                                aria-pressed={filter === b.id}
                            >
                                {b.icon && <b.icon className="w-4 h-4" />}
                                {b.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value.slice(0, 80))}
                            placeholder="Search moments..."
                            className="input-glass w-full pl-12 py-3"
                            aria-label="Search gallery"
                        />
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="glass-base rounded-2xl p-4 mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-muted" />
                        <span className="text-sm font-medium text-muted">
                            Showing {filtered.length} of {mediaItems.length} moments
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-error" />
                        <span className="text-sm font-medium text-muted">
                            {likedItems.size} favorites
                        </span>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <motion.div
                        layout
                        className={`grid ${gridCols} gap-6`}
                    >
                        {filtered.map((it, i) => (
                            <MediaTile
                                key={it.id}
                                item={it}
                                index={i}
                                onOpen={openLightbox}
                                compact={compact}
                                liked={likedItems.has(it.id)}
                                onToggleLike={toggleLike}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="glass-base rounded-3xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: `linear-gradient(135deg, hsl(var(--muted) / 0.2), hsl(var(--border) / 0.1))` }}>
                            <Camera className="w-8 h-8 text-muted" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No moments found</h3>
                        <p className="text-muted max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                )}

                {/* Lightbox */}
                <AnimatePresence>
                    {selected.item && (
                        <Lightbox
                            items={filtered}
                            index={selected.index}
                            onClose={closeLightbox}
                            onNavigate={navigate}
                            liked={likedItems.has(selected.item.id)}
                            onToggleLike={toggleLike}
                        />
                    )}
                </AnimatePresence>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {[
                        { icon: Heart, text: "Save Favorites", color: "from-error/10 to-error/5" },
                        { icon: Share, text: "Share Moments", color: "from-primary/10 to-primary/5" },
                        { icon: Download, text: "Download Media", color: "from-gold/10 to-gold/5" },
                        { icon: Zap, text: "Fast Loading", color: "from-info/10 to-info/5" }
                    ].map((feature, i) => (
                        <div key={i} className="glass-base rounded-2xl p-5 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3" style={{ background: `linear-gradient(135deg, ${feature.color})` }}>
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{feature.text}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(Gallery);