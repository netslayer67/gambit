import React, { useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
    Play,
    Calendar,
    ShoppingBag,
    Camera,
    Sparkles,
    Trophy,
    Users,
    Star,
    ArrowRight,
    Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

/**
 * Constants & transitions
 */
const TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] }; // 320ms premium easing

const RAW_QUICK_ACTIONS = [
    { key: "watch", icon: Play, label: "Highlights" },
    { key: "schedule", icon: Calendar, label: "Schedule" },
    { key: "store", icon: ShoppingBag, label: "Store" },
    { key: "gallery", icon: Camera, label: "Gallery" },
];

/**
 * Sanitizers & validators
 * - keep these very restrictive to avoid injection and weird inputs.
 */
const sanitizeKey = (str = "") =>
    String(str)
        .replace(/[^a-z0-9-_]/gi, "") // only allow alnum, dash, underscore
        .slice(0, 24)
        .toLowerCase();

const sanitizeLabel = (str = "") =>
    String(str)
        .replace(/<[^>]*>?/g, "") // strip tags
        .replace(/[\n\r\t]+/g, " ")
        .trim()
        .slice(0, 60);

const sanitizeInputValue = (value = "", maxLength = 200) => {
    // remove scripts/links-like patterns (basic but helpful), enforce max length
    const noTags = String(value).replace(/<[^>]*>?/g, "");
    const noUrls = noTags.replace(/https?:\/\/\S+|www\.\S+/gi, "");
    // remove suspicious chars often used in injection attempts (keeps unicode/text)
    const cleaned = noUrls.replace(/[\u0000-\u001F<>$`|;]/g, "");
    return cleaned.slice(0, maxLength);
};

/**
 * Premium stat card with liquid glass effect
 */
const StatCard = memo(function StatCard({ label, value, icon: Icon, tone = "primary" }) {
    const toneMap = {
        primary: "text-primary",
        gold: "text-gold",
        success: "text-success",
        velvet: "text-velvet",
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.03 }}
            transition={TRANSITION}
            className="glass-base p-4 md:p-5 border border-white/10 h-full"
            role="group"
            aria-label={`${label} stat`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <div className={`text-2xl md:text-3xl font-bold ${toneMap[tone] || toneMap.primary} leading-tight`}>
                        {value}
                    </div>
                    <div className="text-xs md:text-sm text-muted uppercase tracking-wider mt-1">
                        {label}
                    </div>
                </div>
                {Icon && (
                    <div className={`p-2 rounded-lg ${tone === 'primary' ? 'bg-primary/10' : tone === 'gold' ? 'bg-gold/10' : 'bg-success/10'}`}>
                        <Icon className={`w-5 h-5 ${toneMap[tone] || toneMap.primary}`} />
                    </div>
                )}
            </div>
        </motion.div>
    );
});

/**
 * Enhanced quick action button with premium styling
 */
const QuickActionButton = memo(function QuickActionButton({ action, onAction, index }) {
    const { key, icon: IconRaw, label: rawLabel } = action;
    const keySafe = sanitizeKey(key);
    const labelSafe = sanitizeLabel(rawLabel);
    const Icon = IconRaw;

    const handleClick = useCallback(
        (e) => {
            e.preventDefault();
            onAction(keySafe);
        },
        [onAction, keySafe]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...TRANSITION, delay: 0.1 * index }}
        >
            <Button
                size="lg"
                variant="ghost"
                onClick={handleClick}
                className="glass-base group flex items-center gap-2 transition-all duration-[320ms] hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 border border-white/10"
                aria-label={labelSafe}
                title={labelSafe}
            >
                <Icon className="w-5 h-5 text-primary transition-transform duration-[320ms] group-hover:scale-110" aria-hidden />
                <span className="hidden sm:inline text-sm font-medium text-foreground">{labelSafe}</span>
                <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-all duration-[320ms] sm:ml-1" />
            </Button>
        </motion.div>
    );
});

/**
 * Feature highlight component
 */
const FeatureHighlight = memo(function FeatureHighlight({ icon: Icon, title, description, tone = "primary" }) {
    const toneMap = {
        primary: "bg-primary/10 text-primary",
        gold: "bg-gold/10 text-gold",
        success: "bg-success/10 text-success",
        velvet: "bg-velvet/10 text-velvet",
    };

    return (
        <motion.div
            className="flex items-start gap-3 p-3 rounded-xl glass-base border border-white/10"
            whileHover={{ y: -3 }}
            transition={TRANSITION}
        >
            <div className={`p-2 rounded-lg ${toneMap[tone] || toneMap.primary}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="text-left">
                <h4 className="font-semibold text-foreground">{title}</h4>
                <p className="text-xs text-muted mt-1">{description}</p>
            </div>
        </motion.div>
    );
});

/**
 * Main Hero component
 */
const Hero = () => {
    // pre-sanitize actions list once (avoid inline sanitization each render)
    const QUICK_ACTIONS = useMemo(
        () =>
            RAW_QUICK_ACTIONS.map((a) => ({
                key: sanitizeKey(a.key),
                icon: a.icon,
                label: sanitizeLabel(a.label),
            })),
        []
    );

    const handleQuickAction = useCallback((actionKey) => {
        // defensive guard
        if (!QUICK_ACTIONS.some((a) => a.key === actionKey)) {
            toast({
                title: "⚠️ Invalid action",
                description: "That action isn't available.",
            });
            return;
        }

        // short, plain-text feedback only
        toast({
            title: "🚧 Coming soon",
            description: `${actionKey.toUpperCase()} will be available shortly.`,
        });
    }, [QUICK_ACTIONS]);

    const stats = useMemo(
        () => [
            { label: "Championships", value: "12", icon: Trophy, tone: "gold" },
            { label: "Elite Members", value: "25", icon: Crown, tone: "primary" },
            { label: "Global Fans", value: "50K+", icon: Users, tone: "success" },
            { label: "Years Active", value: "8", icon: Star, tone: "velvet" },
        ],
        []
    );

    const features = useMemo(
        () => [
            {
                icon: Trophy,
                title: "Elite Competitions",
                description: "Compete in premium tournaments",
                tone: "gold"
            },
            {
                icon: Users,
                title: "Exclusive Community",
                description: "Connect with top players",
                tone: "primary"
            },
            {
                icon: Star,
                title: "Pro Coaching",
                description: "Learn from industry experts",
                tone: "success"
            }
        ],
        []
    );

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-16">
            {/* Background layers with animated blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-background/40 backdrop-blur-2xl" />

                {/* Token-based animated decorative blobs */}
                <motion.div
                    className="absolute -top-36 -left-28 w-72 h-72 rounded-full blur-3xl"
                    style={{ background: "hsl(var(--primary) / 0.14)" }}
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    aria-hidden
                />
                <motion.div
                    className="absolute -bottom-36 -right-28 w-80 h-80 rounded-full blur-3xl"
                    style={{ background: "hsl(var(--gold) / 0.12)" }}
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -30, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 1
                    }}
                    aria-hidden
                />
                <motion.div
                    className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-3xl"
                    style={{ background: "hsl(var(--velvet) / 0.1)" }}
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 15, 0],
                        y: [0, 15, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 2
                    }}
                    aria-hidden
                />

                {/* Large scenic image with optimized loading */}
                <picture>
                    <source
                        media="(min-width: 768px)"
                        srcSet="https://images.unsplash.com/photo-1649030572264-6d234fd9f148?auto=format&fit=crop&w=1600&q=60"
                    />
                    <img
                        alt="GH GAMBIT team"
                        decoding="async"
                        fetchPriority="low"
                        className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-30"
                        aria-hidden
                    />
                </picture>
            </div>

            {/* Content container */}
            <div className="relative z-20 container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left content */}
                    <motion.div
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...TRANSITION, delay: 0 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...TRANSITION, delay: 0.1 }}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            <div className="badge-glass text-xs px-3 py-1.5 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-gold" />
                                Premium Club
                            </div>
                        </motion.div>

                        {/* Main heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...TRANSITION, delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                        >
                            <span className="block">GH <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-gold">GAMBIT</span></span>
                            <span className="block text-xl md:text-2xl font-normal mt-2 text-foreground/80">- Built Different - </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...TRANSITION, delay: 0.3 }}
                            className="mt-4 text-base md:text-lg text-muted max-w-xl mx-auto lg:mx-0"
                        >
                            Elevate your game with exclusive access to premium tournaments, elite coaching, and a community of champions.
                        </motion.p>

                        {/* Quick actions - desktop layout */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...TRANSITION, delay: 0.4 }}
                            className="hidden md:flex flex-wrap justify-center lg:justify-start gap-3 mt-8"
                        >
                            {QUICK_ACTIONS.map((action, index) => (
                                <QuickActionButton
                                    key={action.key}
                                    action={action}
                                    onAction={handleQuickAction}
                                    index={index}
                                />
                            ))}
                        </motion.div>

                        {/* Features - mobile only */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ ...TRANSITION, delay: 0.5 }}
                            className="md:hidden mt-6 space-y-3"
                        >
                            {features.map((feature, index) => (
                                <FeatureHighlight key={index} {...feature} />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right content - stats and features */}
                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...TRANSITION, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="glass-base p-6 rounded-3xl border border-white/10">
                            <h3 className="text-xl font-bold text-foreground mb-6">Why Join GH GAMBIT?</h3>
                            <div className="space-y-4 mb-8">
                                {features.map((feature, index) => (
                                    <FeatureHighlight key={index} {...feature} />
                                ))}
                            </div>

                            <div className="text-center">
                                <Button
                                    size="lg"
                                    className="glass-base bg-gradient-to-r from-primary to-gold text-white hover:shadow-lg transition-all duration-[320ms] hover:scale-[1.02]"
                                >
                                    Join The Elite
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats grid */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto mt-10 md:mt-14"
                    role="list"
                    aria-label="Key statistics"
                >
                    {stats.map((s, i) => (
                        <StatCard key={i} {...s} />
                    ))}
                </motion.div>

                {/* Quick actions - mobile layout */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.6 }}
                    className="md:hidden flex flex-wrap justify-center gap-3 mt-8"
                >
                    {QUICK_ACTIONS.map((action, index) => (
                        <QuickActionButton
                            key={action.key}
                            action={action}
                            onAction={handleQuickAction}
                            index={index}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Decorative bottom wave */}
            <svg
                className="absolute left-0 right-0 bottom-0 h-16 md:h-24 w-full pointer-events-none"
                viewBox="0 0 1440 80"
                preserveAspectRatio="none"
                aria-hidden
            >
                <path
                    d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
                    fill="hsl(var(--foreground) / 0.04)"
                />
            </svg>
        </section>
    );
};

export default memo(Hero);