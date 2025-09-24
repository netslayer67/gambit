import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Ticket,
    CreditCard,
    // MapPin,
    Users,
    Star,
    Crown,
    Diamond,
    Shield,
    Sparkles,
    Zap,
    Trophy,
    Clock,
    Calendar,
    ChevronRight,
    CheckCircle,
    Gift,
    Gem,
    X,
    ArrowRight
} from "lucide-react";

// -------------------------
// Constants & Utilities
// -------------------------
const TRANS_MS = 320;
const TRANSITION = { duration: TRANS_MS / 1000, ease: [0.22, 1, 0.36, 1] };

// Sanitize user input to prevent malicious content
const sanitizeText = (value = "") => {
    if (typeof value !== "string") return "";
    return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/javascript:/gi, "")
        .replace(/data:/gi, "")
        .replace(/vbscript:/gi, "")
        .replace(/on\w+\s*=/gi, "")
        .replace(/https?:\/\/\S+|www\.\S+/gi, "")
        .replace(/["'<>]/g, "")
        .replace(/[^\w\s\-@.:,\/]/g, "")
        .trim()
        .slice(0, 120);
};

const sanitizeNumber = (value, fallback = 1, min = 1, max = 100) => {
    const n = parseInt(String(value).replace(/[^0-9]/g, ""), 10);
    if (Number.isNaN(n)) return Math.max(min, Math.min(max, fallback));
    return Math.max(min, Math.min(max, n));
};

// Custom hook to respect user's reduced motion preference
const useShouldReduceMotion = () => {
    const prefersReducedMotion = useReducedMotion();
    return prefersReducedMotion;
};

// -------------------------
// Small presentational helpers
// -------------------------
const IconBadge = ({ children, style = {}, className = "p-3 rounded-2xl" }) => (
    <div className={className} style={style} aria-hidden>
        {children}
    </div>
);

// -------------------------
// Luxury blobs (performance-aware)
// -------------------------
const LuxuryBlobs = memo(function LuxuryBlobs({ enabled = true }) {
    const reduce = useShouldReduceMotion();
    if (!enabled || reduce) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl"
                style={{ background: `conic-gradient(from 0deg, hsl(var(--primary) / 0.15), hsl(var(--gold) / 0.12), hsl(var(--velvet) / 0.1), hsl(var(--primary) / 0.15))` }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full blur-3xl"
                style={{ background: `radial-gradient(ellipse, hsl(var(--gold) / 0.18), hsl(var(--platinum) / 0.12), transparent 70%)` }}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
});

// -------------------------
// EliteGameCard - lightweight & memoized
// -------------------------
const EliteGameCard = memo(function EliteGameCard({ game, isSelected, onSelect, compact = false }) {
    const gameDate = useMemo(() => new Date(game.date), [game.date]);
    const dayName = useMemo(() => gameDate.toLocaleDateString(undefined, { weekday: "short" }), [gameDate]);
    const monthName = useMemo(() => gameDate.toLocaleDateString(undefined, { month: "short" }), [gameDate]);
    const dayNumber = gameDate.getDate();

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            aria-pressed={isSelected}
            className={`relative glass-base p-4 ${compact ? "rounded-xl" : "rounded-2xl p-5"} cursor-pointer transition-all duration-[320ms] group overflow-hidden w-full text-left flex items-center gap-4`}
        >
            {isSelected && <div className="absolute inset-0 rounded-2xl opacity-20" style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.08), hsl(var(--gold) / 0.04))` }} />}

            <div className="z-10 flex items-center gap-4 w-full">
                <div className={`${compact ? "w-12 h-12" : "w-16 h-16"} flex-shrink-0 flex flex-col items-center justify-center rounded-lg`} style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--gold) / 0.12))` }}>
                    <span className={`text-[10px] font-bold text-primary uppercase`}>{monthName}</span>
                    <span className={`${compact ? "text-xl" : "text-2xl"} font-bold text-foreground`}>{dayNumber}</span>
                    <span className={`text-[10px] text-muted`}>{dayName}</span>
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className={`font-bold ${compact ? "text-sm" : "text-lg"} text-foreground`}>vs {sanitizeText(game.opponent)}</h3>

                        <div className="flex items-center gap-2">
                            <div className={`badge-glass text-xs px-2 py-1 rounded-full ${game.type === "home" ? "text-success" : "text-info"}`} style={{ backgroundColor: game.type === "home" ? `hsl(var(--success) / 0.12)` : `hsl(var(--info) / 0.12)` }}>
                                {/* <MapPin className="w-3 h-3" /> */}
                                <span className="ml-1 capitalize">{sanitizeText(game.type)}</span>
                            </div>

                            {game.competition?.includes("Final") && (
                                <div className="badge-glass text-xs px-2 py-1 rounded-full text-gold" style={{ backgroundColor: `hsl(var(--gold) / 0.12)` }}>
                                    <Crown className="w-3 h-3" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`flex items-center gap-4 text-muted mt-2 ${compact ? "text-xs" : "text-sm"}`}>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{sanitizeText(game.time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* <MapPin className="w-4 h-4" /> */}
                            <span>{sanitizeText(game.venue)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `hsl(var(--primary))` }}>
                    <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
            )}
        </motion.button>
    );
});

// -------------------------
// PremiumTicketSection - memo'd
// -------------------------
const PremiumTicketSection = memo(function PremiumTicketSection({ section, isSelected, onSelect, compact = false }) {
    const Icon = section.icon;
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            aria-pressed={isSelected}
            className={`relative glass-base ${compact ? "p-3 rounded-xl" : "p-6 rounded-2xl"} cursor-pointer transition-all duration-[320ms] group overflow-hidden w-full text-left`}
        >
            <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-[320ms] ${isSelected ? "opacity-30" : ""}`} style={{ background: section.gradient }} />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-2xl" style={{ background: section.iconBg }}>
                        <Icon className={`w-5 h-5 ${section.iconColor}`} />
                    </div>

                    <div>
                        <h4 className={`font-bold ${compact ? "text-sm" : "text-xl"} text-foreground`}>{section.name}</h4>
                        <p className={`text-muted ${compact ? "text-xs" : "text-sm"}`}>{section.description}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className={`font-bold ${compact ? "text-lg" : "text-2xl"} bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent`}>${section.price}</div>
                    {section.originalPrice && <div className="text-sm text-muted line-through">${section.originalPrice}</div>}
                </div>
            </div>

            {section.features && !compact && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm">
                    {section.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-foreground">{f}</span>
                        </div>
                    ))}
                </div>
            )}

            {section.isPremium && (
                <div className="flex items-center gap-2 mt-4">
                    <Sparkles className="w-4 h-4 text-gold animate-spin-slow" />
                    <span className="text-xs font-semibold text-gold uppercase tracking-wider">Most Popular</span>
                </div>
            )}

            {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: section.checkColor }}>
                    <CheckCircle className="w-4 h-4 text-white" />
                </div>
            )}
        </motion.button>
    );
});

// -------------------------
// Main Ticketing component
// -------------------------
const Ticketing = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [games, setGames] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [compact, setCompact] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const reduce = useShouldReduceMotion();

    // responsive compact behaviour
    useEffect(() => {
        const onResize = () => setCompact(window.innerWidth < 768);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // mock load - keep lightweight and cancellable
    useEffect(() => {
        let isMounted = true;
        const timer = window.setTimeout(() => {
            if (!isMounted) return;
            setGames([
                { id: 1, opponent: "Thunder Bolts", date: "2024-12-15", time: "19:00", venue: "GH Elite Arena", type: "home", competition: "Champions League Final", status: "upcoming" },
                { id: 2, opponent: "Fire Hawks", date: "2024-12-22", time: "20:30", venue: "Hawks Colosseum", type: "away", competition: "Elite Championship", status: "upcoming" },
                { id: 3, opponent: "Storm Riders", date: "2024-12-29", time: "18:00", venue: "GH Elite Arena", type: "home", competition: "New Year Spectacular", status: "upcoming" },
                { id: 4, opponent: "Lightning Wolves", date: "2025-01-05", time: "17:30", venue: "GH Elite Arena", type: "home", competition: "Premium League", status: "upcoming" }
            ]);
            setIsLoaded(true);
        }, 500);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, []);

    const eliteTicketSections = useMemo(() => [
        {
            id: "emperor",
            name: "Emperor Suite",
            price: 500,
            originalPrice: 750,
            description: "Ultimate luxury experience",
            icon: Crown,
            iconColor: "text-gold",
            iconBg: `linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--ivory) / 0.15))`,
            gradient: `linear-gradient(135deg, hsl(var(--gold) / 0.08), hsl(var(--ivory) / 0.05))`,
            checkColor: `hsl(var(--gold))`,
            features: ["Private suite with concierge", "Premium champagne service", "Player meet & greet", "VIP parking"],
            isPremium: true
        },
        {
            id: "diamond",
            name: "Diamond VIP",
            price: 250,
            description: "Courtside with premium amenities",
            icon: Diamond,
            iconColor: "text-platinum",
            iconBg: `linear-gradient(135deg, hsl(var(--platinum) / 0.28), hsl(var(--pearl) / 0.2))`,
            gradient: `linear-gradient(135deg, hsl(var(--platinum) / 0.06), hsl(var(--pearl) / 0.04))`,
            checkColor: `hsl(var(--platinum))`,
            features: ["Courtside seating", "Complimentary dining", "VIP lounge access", "Priority entry"],
            isPremium: false
        },
        {
            id: "premium",
            name: "Elite Club",
            price: 125,
            description: "Premium viewing experience",
            icon: Star,
            iconColor: "text-primary",
            iconBg: `linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--velvet) / 0.15))`,
            gradient: `linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--velvet) / 0.04))`,
            checkColor: `hsl(var(--primary))`,
            features: ["Reserved seating", "Halftime refreshments", "Club merchandise", "Express entry"],
            isPremium: false
        },
        {
            id: "general",
            name: "General Admission",
            price: 65,
            description: "Great value with elite atmosphere",
            icon: Users,
            iconColor: "text-info",
            iconBg: `linear-gradient(135deg, hsl(var(--info) / 0.2), hsl(var(--secondary) / 0.1))`,
            gradient: `linear-gradient(135deg, hsl(var(--info) / 0.06), hsl(var(--secondary) / 0.03))`,
            checkColor: `hsl(var(--info))`,
            features: ["Stadium seating", "Game program", "Concession discounts", "Standard entry"],
            isPremium: false
        }
    ], []);

    const handlePurchase = useCallback(() => {
        if (!selectedGame || !selectedSection) {
            // lightweight client feedback
            window.alert("Please select a match and ticket type.");
            return;
        }

        const total = selectedSection.price * ticketQuantity;
        // Replace with real payment integration
        console.info(`Initiating purchase: $${total}`);
    }, [selectedGame, selectedSection, ticketQuantity]);

    const getTotal = useCallback(() => (selectedSection ? selectedSection.price * ticketQuantity : 0), [selectedSection, ticketQuantity]);
    const getSavings = useCallback(() => (selectedSection?.originalPrice ? (selectedSection.originalPrice - selectedSection.price) * ticketQuantity : 0), [selectedSection, ticketQuantity]);

    if (!isLoaded) {
        return (
            <section className="relative py-20 px-4 min-h-screen flex items-center justify-center">
                <motion.div animate={{ rotate: reduce ? 0 : 360 }} transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" } }} className="w-12 h-12">
                    <Crown className="w-full h-full text-primary" />
                </motion.div>
            </section>
        );
    }

    return (
        <section className="relative py-12 px-4 min-h-screen dark:from-onyx dark:via-background dark:to-onyx">
            {/* Decorative blobs disabled when compact for perf */}
            <LuxuryBlobs enabled={!compact} />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ ...TRANSITION, duration: 0.6 }} className="text-center mb-12">
                    <div className="inline-flex items-center gap-4 mb-6">
                        <IconBadge style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` }}>
                            <Ticket className="w-10 h-10 text-primary-foreground" />
                        </IconBadge>

                        <div className="text-left">
                            <h1 className={`font-bold ${compact ? "text-3xl" : "text-5xl"} bg-gradient-to-r from-primary via-gold to-platinum bg-clip-text text-transparent leading-tight`}>VIP Access</h1>
                            <div className="flex items-center gap-2 mt-2">
                                {/* <Gem className="w-5 h-5 text-gold" /> */}
                                <span className="text-muted font-medium">Exclusive Experiences</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted max-w-2xl mx-auto">Step into greatness. Every seat tells a story.</p>
                </motion.div>

                <div className={`grid gap-8 ${compact ? "grid-cols-1" : "lg:grid-cols-5"}`}>
                    {/* Games & Sections */}
                    <div className={`${compact ? "order-2" : "lg:col-span-3"} space-y-8`}>
                        <div>
                            <h2 className={`font-bold ${compact ? "text-xl" : "text-2xl"} text-foreground flex items-center gap-3 mb-2`}>
                                <Calendar className="w-6 h-6 text-primary" />
                                Select Your Match
                            </h2>
                            <p className="text-muted">Choose your elite experience</p>
                        </div>

                        <div className="grid gap-4">
                            {games.filter(g => g.status === "upcoming").map(g => (
                                <EliteGameCard key={g.id} game={g} isSelected={selectedGame?.id === g.id} onSelect={() => setSelectedGame(g)} compact={compact} />
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedGame && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.45 }} className="space-y-6 mt-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-2xl flex items-center gap-2"><Shield className="w-6 h-6 text-primary" />Choose Your Experience</h3>
                                        <button
                                            onClick={() => setShowDetails(!showDetails)}
                                            className="flex items-center gap-1 text-sm text-primary"
                                        >
                                            {showDetails ? "Hide Details" : "Show Details"}
                                            <ChevronRight className={`w-4 h-4 transition-transform ${showDetails ? "rotate-90" : ""}`} />
                                        </button>
                                    </div>

                                    <div className={`grid gap-4 ${compact ? "grid-cols-2" : "grid-cols-1"}`}>
                                        {eliteTicketSections.map(s => (
                                            <PremiumTicketSection key={s.id} section={s} isSelected={selectedSection?.id === s.id} onSelect={() => setSelectedSection(s)} compact={compact} />
                                        ))}
                                    </div>

                                    {showDetails && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-base rounded-2xl p-6 mt-4"
                                        >
                                            <h4 className="font-bold text-lg mb-4">Experience Details</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {eliteTicketSections.map(section => (
                                                    <div key={section.id} className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-xl" style={{ background: section.iconBg }}>
                                                                <section.icon className={`w-5 h-5 ${section.iconColor}`} />
                                                            </div>
                                                            <h5 className="font-bold">{section.name}</h5>
                                                        </div>
                                                        <ul className="space-y-2 pl-2">
                                                            {section.features.map((feature, idx) => (
                                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                                                    <span>{feature}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary */}
                    <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className={`${compact ? "order-1" : "lg:col-span-2"}`}>
                        <div className="sticky top-6">
                            <h2 className={`font-bold ${compact ? "text-xl" : "text-2xl"} mb-6 flex items-center gap-3`}><CreditCard className="w-6 h-6 text-primary" />Order Summary</h2>

                            <div className="glass-base p-6 rounded-3xl space-y-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5 opacity-50" />
                                <div className="relative z-10 space-y-6">
                                    {selectedGame ? (
                                        <>
                                            <div className="space-y-4">
                                                <h3 className="font-bold text-xl flex items-center gap-2"><Trophy className="w-5 h-5 text-primary" />Match Details</h3>

                                                <div className="glass-base rounded-2xl p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-muted">Match</span>
                                                        <span className="font-semibold text-foreground">GH GAMBIT vs {sanitizeText(selectedGame.opponent)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="text-muted">Date & Time</span>
                                                        <span className="font-semibold text-foreground">{new Date(selectedGame.date).toLocaleDateString()} at {sanitizeText(selectedGame.time)}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-muted">Venue</span>
                                                        <span className="font-semibold text-foreground">{sanitizeText(selectedGame.venue)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedSection && (
                                                <>
                                                    <div className="space-y-4">
                                                        <h4 className="font-bold text-xl flex items-center gap-2"><Ticket className="w-5 h-5 text-primary" />Ticket Details</h4>

                                                        <div className="glass-base rounded-2xl p-4">
                                                            <div className="flex justify-between items-center mb-3">
                                                                <span className="text-muted">Section</span>
                                                                <span className="font-semibold text-foreground">{selectedSection.name}</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-muted">Price</span>
                                                                <span className="font-semibold bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">${selectedSection.price}</span>
                                                            </div>
                                                        </div>

                                                        <div className="mt-4">
                                                            <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                                                            <div className="flex items-center gap-3">
                                                                <button
                                                                    onClick={() => setTicketQuantity(prev => Math.max(1, prev - 1))}
                                                                    className="glass-base w-10 h-10 rounded-xl flex items-center justify-center"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="text-lg font-semibold w-8 text-center">{ticketQuantity}</span>
                                                                <button
                                                                    onClick={() => setTicketQuantity(prev => Math.min(10, prev + 1))}
                                                                    className="glass-base w-10 h-10 rounded-xl flex items-center justify-center"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-4 border-t" style={{ borderColor: `hsl(var(--border))` }}>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted">Subtotal</span>
                                                            <span className="text-foreground">${selectedSection.price * ticketQuantity}</span>
                                                        </div>
                                                        {getSavings() > 0 && (
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-success">You save</span>
                                                                <span className="text-success font-semibold">-${getSavings()}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted">Service fee</span>
                                                            <span className="text-foreground">$0</span>
                                                        </div>

                                                        <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: `hsl(var(--border))` }}>
                                                            <span className="text-2xl font-bold">Total</span>
                                                            <div className="text-right">
                                                                <div className="text-2xl font-bold bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">${getTotal()}</div>
                                                                {selectedSection.originalPrice && (
                                                                    <div className="text-sm text-muted line-through">${selectedSection.originalPrice * ticketQuantity}</div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <motion.button
                                                            onClick={handlePurchase}
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full mt-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-[320ms] shadow-liquid hover:shadow-xl"
                                                            style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))`, color: `hsl(var(--primary-foreground))` }}
                                                        >
                                                            <CreditCard className="w-5 h-5" />
                                                            <span>Secure VIP Purchase</span>
                                                            <ArrowRight className="w-5 h-5" />
                                                        </motion.button>

                                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                                            <div className="flex items-center gap-2 glass-base p-3 rounded-xl">
                                                                <Shield className="w-4 h-4 text-success" />
                                                                <span className="text-xs text-muted">256-bit SSL</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 glass-base p-3 rounded-xl">
                                                                <Gift className="w-4 h-4 text-gold" />
                                                                <span className="text-xs text-muted">Free cancellation</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center py-10">
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6" style={{ background: `linear-gradient(135deg, hsl(var(--muted) / 0.2), hsl(var(--border) / 0.1))` }}>
                                                <Ticket className="w-10 h-10 text-muted" />
                                            </div>
                                            <h3 className="font-bold text-xl">Select Your Match</h3>
                                            <p className="text-muted mt-2">Pick a game to start</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: Shield, text: "Secure Payment", color: "from-primary/10 to-primary/5" },
                        { icon: Zap, text: "Instant Access", color: "from-gold/10 to-gold/5" },
                        { icon: Crown, text: "VIP Treatment", color: "from-platinum/10 to-platinum/5" },
                        { icon: Gift, text: "Premium Perks", color: "from-velvet/10 to-velvet/5" }
                    ].map((it, i) => (
                        <div key={i} className="glass-base p-5 rounded-2xl text-center">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3" style={{ background: `linear-gradient(135deg, ${it.color})` }}>
                                <it.icon className="w-7 h-7 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{it.text}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(Ticketing);