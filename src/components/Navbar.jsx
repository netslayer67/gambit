import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    LogOut,
    Shield,
    Calendar,
    Star,
    ShoppingBag,
    Image,
    Newspaper,
    X,
    Sparkles,
    Crown,
    Menu as MenuIcon,
    ChevronRight,
    Gem,
    Trophy,
    Flame,
    Diamond,
    Award,
} from "lucide-react";

import LoginModal from './LoginModal';

// Ultra Premium Motion Config
const MOTION_CONFIG = {
    premium: {
        duration: 0.32,
        ease: [0.43, 0.13, 0.23, 0.96] // Custom premium ease
    },
    spring: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
    },
    liquid: {
        type: "spring",
        stiffness: 260,
        damping: 20
    }
};

// Enhanced Security Input Sanitization
const sanitizeInput = (value = "") => {
    const dangerous = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<embed\b/gi,
        /<object\b/gi,
        /data:text\/html/gi,
        /vbscript:/gi,
        /file:\/\//gi,
        /(https?:\/\/[^\s]+)/gi
    ];

    let clean = String(value);
    dangerous.forEach(pattern => {
        clean = clean.replace(pattern, '');
    });

    return clean
        .replace(/[<>\"\']/g, '')
        .trim()
        .slice(0, 50);
};

// Premium Liquid Glass Background
const LiquidGlassBackground = memo(function LiquidGlassBackground({ intensity = 1 }) {
    const reduce = useReducedMotion();
    if (reduce) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Dynamic Liquid Mesh */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
                <defs>
                    <filter id="liquid">
                        <feTurbulence baseFrequency="0.01" numOctaves="3" />
                        <feColorMatrix values="0 0 0 0 0.9 0 0 0 0 0.1 0 0 0 0 0.2 0 0 0 1 0" />
                        <feGaussianBlur stdDeviation="2" />
                    </filter>
                </defs>
                <rect width="100%" height="100%" filter="url(#liquid)" opacity={0.1 * intensity} />
            </svg>

            {/* Floating Premium Orbs */}
            <motion.div
                className="absolute w-96 h-96 -top-48 -right-48 rounded-full"
                style={{
                    background: `radial-gradient(circle at 30% 30%, 
                        hsl(var(--gold) / ${0.15 * intensity}), 
                        hsl(var(--primary) / ${0.1 * intensity}), 
                        transparent)`,
                    filter: 'blur(60px)'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
                className="absolute w-80 h-80 -bottom-40 -left-40 rounded-full"
                style={{
                    background: `radial-gradient(circle at 70% 70%, 
                        hsl(var(--velvet) / ${0.2 * intensity}), 
                        hsl(var(--gold) / ${0.05 * intensity}), 
                        transparent)`,
                    filter: 'blur(50px)'
                }}
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 25, repeat: Infinity }}
            />

            {/* Particle System */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                        background: `hsl(var(--gold))`,
                        left: `${15 + i * 18}%`,
                        top: `${20 + (i % 2) * 40}%`,
                        boxShadow: `0 0 10px hsl(var(--gold) / 0.5)`
                    }}
                    animate={{
                        y: [-30, 30, -30],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    );
});

// Ultra Premium Logo with Liquid Animation
const PremiumLogo = memo(function PremiumLogo({ onClick, isCompact = false }) {
    const [isHovered, setIsHovered] = useState(false);
    const isMobile = isCompact;

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={MOTION_CONFIG.spring}
            className="relative flex items-center gap-2 sm:gap-3 group"
            aria-label="GH GAMBIT Elite Club"
        >
            {/* Liquid Glass Icon Container */}
            <div className={`relative ${isMobile ? 'w-9 h-9' : 'w-10 h-10 sm:w-12 sm:h-12'}`}>
                <motion.div
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    style={{
                        background: `linear-gradient(145deg, 
                            hsl(var(--primary) / 0.9), 
                            hsl(var(--velvet) / 0.8))`,
                        boxShadow: `
                            0 10px 30px hsl(var(--primary) / 0.4),
                            inset 0 2px 4px hsl(var(--pearl) / 0.3),
                            inset 0 -2px 4px hsl(var(--velvet) / 0.4)
                        `
                    }}
                    animate={{
                        background: isHovered
                            ? `linear-gradient(145deg, hsl(var(--gold) / 0.9), hsl(var(--primary) / 0.9))`
                            : `linear-gradient(145deg, hsl(var(--primary) / 0.9), hsl(var(--velvet) / 0.8))`
                    }}
                    transition={MOTION_CONFIG.premium}
                >
                    {/* Inner Liquid Effect */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 50% 20%, 
                                hsl(var(--pearl) / 0.5), 
                                transparent 60%)`
                        }}
                        animate={{
                            opacity: isHovered ? 0.8 : 0.4
                        }}
                    />

                    {/* Liquid Waves */}
                    <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1/2"
                        style={{
                            background: `linear-gradient(to top, 
                                hsl(var(--gold) / 0.2), 
                                transparent)`,
                        }}
                        animate={{
                            y: isHovered ? [0, -5, 0] : 0
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                {/* Crown Icon with Glow */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                        rotate: isHovered ? [0, -5, 5, 0] : 0,
                        scale: isHovered ? 1.1 : 1
                    }}
                    transition={MOTION_CONFIG.liquid}
                >
                    <Crown className={`${isMobile ? 'w-5 h-5' : 'w-5 h-5 sm:w-6 sm:h-6'} text-pearl drop-shadow-2xl`}
                        style={{ filter: 'drop-shadow(0 2px 4px hsl(var(--gold) / 0.5))' }} />
                </motion.div>

                {/* Pulse Ring */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.8, opacity: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-2xl border-2"
                            style={{ borderColor: 'hsl(var(--gold))' }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Text Logo - Hidden on Mobile */}
            {!isMobile && (
                <div className="hidden sm:flex flex-col items-start">
                    <motion.div
                        className="font-black text-base sm:text-lg tracking-tight leading-none"
                        style={{
                            background: `linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary)))`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        GH GAMBIT
                    </motion.div>
                    <motion.div
                        className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-1"
                        style={{ color: 'hsl(var(--gold))' }}
                        animate={{
                            opacity: isHovered ? 1 : 0.7,
                            letterSpacing: isHovered ? '0.25em' : '0.2em'
                        }}
                    >
                        <Diamond className="w-2 h-2" />
                        Built Different
                    </motion.div>
                </div>
            )}
        </motion.button>
    );
});

// Desktop Navigation Item with Liquid Effects
const LuxuryNavItem = memo(function LuxuryNavItem({ item, isActive, onClick, index }) {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = item.icon;

    return (
        <motion.button
            onClick={onClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-3 py-2 lg:px-4 lg:py-2.5 rounded-xl overflow-hidden group"
            style={{
                background: isActive
                    ? `linear-gradient(135deg, hsl(var(--primary) / 0.9), hsl(var(--velvet) / 0.8))`
                    : isHovered
                        ? `hsl(var(--glass))`
                        : 'transparent'
            }}
        >
            {/* Active Liquid Animation */}
            {isActive && (
                <>
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 50% 0%, 
                                hsl(var(--gold) / 0.3), 
                                transparent 70%)`
                        }}
                        animate={{
                            y: [0, 10, 0],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute inset-x-0 bottom-0 h-[2px]"
                        style={{ background: 'hsl(var(--gold))' }}
                        layoutId="activeTab"
                        transition={MOTION_CONFIG.liquid}
                    />
                </>
            )}

            <div className="relative flex items-center gap-2">
                <motion.div
                    animate={{
                        rotate: isHovered ? 360 : 0,
                        scale: isActive ? 1.1 : 1
                    }}
                    transition={MOTION_CONFIG.premium}
                >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-pearl' : isHovered ? 'text-primary' : 'text-muted'
                        }`} />
                </motion.div>

                <span className={`font-semibold text-xs lg:text-sm ${isActive ? 'text-pearl' : 'text-foreground'
                    }`}>
                    {item.label}
                </span>

                {/* Premium Badge */}
                {item.premium && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                        style={{
                            background: 'hsl(var(--gold))',
                            boxShadow: '0 0 8px hsl(var(--gold))'
                        }}
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}

                {/* Live Badge */}
                {item.badge && (
                    <motion.span
                        className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black"
                        style={{
                            background: 'hsl(var(--error))',
                            color: 'hsl(var(--pearl))'
                        }}
                        animate={{ opacity: [1, 0.6, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        {item.badge}
                    </motion.span>
                )}
            </div>
        </motion.button>
    );
});

// Mobile Navigation Grid Card
const MobileNavCard = memo(function MobileNavCard({ item, isActive, onClick, index }) {
    const Icon = item.icon;
    const [isPressed, setIsPressed] = useState(false);

    return (
        <motion.button
            onClick={onClick}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, ...MOTION_CONFIG.spring }}
            whileTap={{ scale: 0.95 }}
            className="relative aspect-square p-3 rounded-2xl overflow-hidden"
            style={{
                background: isActive
                    ? `linear-gradient(145deg, hsl(var(--primary) / 0.95), hsl(var(--velvet) / 0.9))`
                    : isPressed
                        ? `hsl(var(--glass))`
                        : `hsl(var(--glass) / 0.5)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isActive ? 'hsl(var(--gold) / 0.4)' : 'hsl(var(--border) / 0.2)'}`,
                boxShadow: isActive
                    ? '0 8px 24px hsl(var(--primary) / 0.3), inset 0 2px 4px hsl(var(--pearl) / 0.2)'
                    : '0 4px 12px hsl(var(--overlay-dark) / 0.1)'
            }}
        >
            {/* Active Glow */}
            {isActive && (
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: `radial-gradient(circle at 50% 50%, 
                            hsl(var(--gold) / 0.2), 
                            transparent)`
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            <div className="relative h-full flex flex-col items-center justify-center gap-1.5">
                <motion.div
                    className={`p-2 rounded-xl ${isActive ? 'bg-pearl/15' : 'bg-overlay-light/5'
                        }`}
                    animate={{ scale: isPressed ? 0.9 : 1 }}
                    transition={MOTION_CONFIG.spring}
                >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-pearl drop-shadow-lg' : 'text-primary'
                        }`} />
                </motion.div>

                <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-pearl' : 'text-foreground'
                    }`}>
                    {item.label}
                </span>

                {/* Badges */}
                {item.badge && (
                    <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full"
                        style={{
                            background: 'hsl(var(--error))',
                            color: 'hsl(var(--pearl))',
                            fontSize: '8px',
                            fontWeight: 900
                        }}
                    >
                        {item.badge}
                    </div>
                )}

                {item.premium && (
                    <Gem className="absolute top-1.5 right-1.5 w-3 h-3 text-gold opacity-60" />
                )}
            </div>
        </motion.button>
    );
});

// Premium Mobile Drawer
const LuxuryMobileDrawer = memo(function LuxuryMobileDrawer({
    isOpen, onClose, navItems, currentView, onNavClick,
    isAuthenticated, userRole, onLogin, onLogout
}) {
    const getRoleBadge = useCallback(() => {
        switch (userRole) {
            case 'admin':
                return { icon: Shield, color: 'gold', label: 'Admin Elite' };
            case 'team':
                return { icon: Award, color: 'platinum', label: 'Team Pro' };
            default:
                return { icon: Star, color: 'primary', label: 'VIP Member' };
        }
    }, [userRole]);

    const roleBadge = getRoleBadge();
    const RoleIcon = roleBadge.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Premium Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={MOTION_CONFIG.premium}
                        onClick={onClose}
                        className="fixed inset-0 z-40"
                        style={{
                            background: 'hsl(var(--overlay-dark) / 0.8)',
                            backdropFilter: 'blur(20px)'
                        }}
                    />

                    {/* Luxury Drawer */}
                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={MOTION_CONFIG.liquid}
                        className="fixed right-0 top-0 h-full w-[85vw] max-w-sm z-50 overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, 
                                hsl(var(--background) / 0.98), 
                                hsl(var(--background) / 0.95))`,
                            backdropFilter: 'blur(30px)',
                            borderLeft: '1px solid hsl(var(--border) / 0.2)',
                            boxShadow: '-20px 0 40px hsl(var(--overlay-dark) / 0.3)'
                        }}
                    >
                        <LiquidGlassBackground intensity={0.5} />

                        {/* Header */}
                        <div className="relative p-4 border-b"
                            style={{ borderColor: 'hsl(var(--border) / 0.1)' }}>
                            <div className="flex items-center justify-between mb-3">
                                <PremiumLogo onClick={() => { onNavClick('home'); onClose(); }} isCompact />

                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9, rotate: -90 }}
                                    transition={MOTION_CONFIG.spring}
                                    className="p-2 rounded-xl"
                                    style={{
                                        background: 'hsl(var(--glass))',
                                        border: '1px solid hsl(var(--border) / 0.2)'
                                    }}
                                >
                                    <X className="w-5 h-5 text-muted" />
                                </motion.button>
                            </div>

                            {/* User Status Badge */}
                            {isAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{
                                        background: `hsl(var(--${roleBadge.color}) / 0.1)`,
                                        border: `1px solid hsl(var(--${roleBadge.color}) / 0.3)`
                                    }}
                                >
                                    <RoleIcon className="w-3.5 h-3.5"
                                        style={{ color: `hsl(var(--${roleBadge.color}))` }} />
                                    <span className="text-xs font-bold"
                                        style={{ color: `hsl(var(--${roleBadge.color}))` }}>
                                        {roleBadge.label}
                                    </span>
                                    <motion.div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: `hsl(var(--success))` }}
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            )}
                        </div>

                        {/* Navigation Grid */}
                        <div className="p-4 overflow-y-auto max-h-[55vh] scrollbar-hide">
                            <div className="grid grid-cols-3 gap-2.5">
                                {navItems.map((item, idx) => (
                                    <MobileNavCard
                                        key={item.id}
                                        item={item}
                                        index={idx}
                                        isActive={currentView === item.id}
                                        onClick={() => { onNavClick(item.id); onClose(); }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Bottom Actions - Liquid Glass Style */}
                        <div className="absolute bottom-0 left-0 right-0 p-4"
                            style={{
                                background: `linear-gradient(to top, 
                                     hsl(var(--background)), 
                                     hsl(var(--background) / 0.8), 
                                     transparent)`,
                                paddingTop: '2rem'
                            }}>
                            {isAuthenticated ? (
                                <div className="space-y-2.5">
                                    {(userRole === 'admin' || userRole === 'team') && (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                onNavClick(userRole === 'admin' ? 'admin-dashboard' : 'team-dashboard');
                                                onClose();
                                            }}
                                            className="w-full p-3 rounded-2xl flex items-center justify-between"
                                            style={{
                                                background: `linear-gradient(135deg, 
                                                    hsl(var(--${roleBadge.color}) / 0.15), 
                                                    hsl(var(--glass)))`,
                                                border: `1px solid hsl(var(--${roleBadge.color}) / 0.3)`,
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Shield className="w-4 h-4"
                                                    style={{ color: `hsl(var(--${roleBadge.color}))` }} />
                                                <span className="font-bold text-sm">Control Center</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted" />
                                        </motion.button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => { onLogout(); onClose(); }}
                                        className="w-full p-3 rounded-2xl flex items-center justify-center gap-2"
                                        style={{
                                            background: 'hsl(var(--error) / 0.1)',
                                            color: 'hsl(var(--error))',
                                            border: '1px solid hsl(var(--error) / 0.2)'
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-bold text-sm">Exit Elite</span>
                                    </motion.button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onLogin}
                                    className="w-full p-4 rounded-2xl relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            hsl(var(--primary)), 
                                            hsl(var(--gold) / 0.9))`,
                                        boxShadow: `
                                            0 10px 30px hsl(var(--primary) / 0.4),
                                            inset 0 2px 4px hsl(var(--pearl) / 0.3)
                                        `
                                    }}
                                >
                                    {/* Liquid Animation */}
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at 50% 100%, 
                                                hsl(var(--pearl) / 0.2), 
                                                transparent)`
                                        }}
                                        animate={{ y: [10, -10, 10] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />

                                    <div className="relative flex items-center justify-center gap-2 text-pearl font-black">
                                        <Trophy className="w-5 h-5" />
                                        <span>ACCESS ELITE</span>
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                </motion.button>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
});

// Main Elite Navbar Component
const Navbar = ({
    currentView,
    setCurrentView,
    userRole = null,
    isAuthenticated = false,
    onLogin = () => { },
    onLogout = () => { }
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Responsive Detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Scroll Handler with Performance
    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    setScrolled(scrollY > 20);
                    setScrollProgress(Math.min(scrollY / docHeight, 1));
                    ticking = false;
                });
                ticking = true;
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Premium Navigation Items
    const navItems = useMemo(() => [
        { id: 'home', label: 'Home', icon: Flame },
        { id: 'schedule', label: 'Events', icon: Calendar, badge: 'LIVE' },
        { id: 'tickets', label: 'VIP', icon: Diamond, premium: true },
        { id: 'merchandise', label: 'Store', icon: ShoppingBag },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'news', label: 'News', icon: Newspaper },
        { id: 'membership', label: 'Elite', icon: Crown, premium: true }
    ], []);

    // Secure Navigation Handler
    const handleNavClick = useCallback((id) => {
        const sanitized = sanitizeInput(id);
        if (sanitized && navItems.some(item => item.id === sanitized)) {
            setCurrentView(sanitized);
        }
    }, [setCurrentView, navItems]);

    // Handle login modal visibility
    const handleLoginClick = useCallback(() => {
        setShowLoginModal(true);
    }, []);

    // Handle login modal close
    const handleLoginModalClose = useCallback(() => {
        setShowLoginModal(false);
    }, []);

    return (
        <>
            {/* Premium Navbar Container */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={MOTION_CONFIG.liquid}
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-[320ms] ${scrolled ? 'py-2' : 'py-3 sm:py-4'
                    }`}
                style={{
                    background: scrolled
                        ? `hsl(var(--background) / 0.85)`
                        : `hsl(var(--background) / 0.7)`,
                    backdropFilter: `blur(${scrolled ? '30px' : '20px'})`,
                    borderBottom: `1px solid hsl(var(--border) / ${scrolled ? 0.15 : 0.1})`,
                    boxShadow: scrolled
                        ? `0 20px 40px hsl(var(--overlay-dark) / 0.15), 
                           0 0 0 1px hsl(var(--border) / 0.05) inset`
                        : 'none'
                }}
            >
                {/* Luxury Progress Bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px]"
                    style={{
                        background: `linear-gradient(90deg, 
                            hsl(var(--primary)), 
                            hsl(var(--gold)), 
                            hsl(var(--velvet)))`,
                        width: `${scrollProgress * 100}%`,
                        boxShadow: `0 0 10px hsl(var(--primary) / 0.5)`
                    }}
                />

                {/* Glass Background Effects */}
                <LiquidGlassBackground intensity={scrolled ? 0.3 : 0.5} />

                <div className="relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <PremiumLogo
                            onClick={() => handleNavClick('home')}
                            isCompact={isMobile}
                        />

                        {/* Desktop Navigation - Hidden on Mobile/Tablet */}
                        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                            {navItems.map((item, idx) => (
                                <LuxuryNavItem
                                    key={item.id}
                                    item={item}
                                    index={idx}
                                    isActive={currentView === item.id}
                                    onClick={() => handleNavClick(item.id)}
                                />
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {isAuthenticated ? (
                                <>
                                    {/* Admin/Team Dashboard Access - Desktop Only */}
                                    {(userRole === 'admin' || userRole === 'team') && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleNavClick(
                                                userRole === 'admin' ? 'admin-dashboard' : 'team-dashboard'
                                            )}
                                            className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl"
                                            style={{
                                                background: `linear-gradient(135deg, 
                                                    hsl(var(--${userRole === 'admin' ? 'gold' : 'platinum'}) / 0.15), 
                                                    hsl(var(--glass) / 0.5))`,
                                                border: `1px solid hsl(var(--${userRole === 'admin' ? 'gold' : 'platinum'
                                                    }) / 0.3)`,
                                                backdropFilter: 'blur(10px)'
                                            }}
                                        >
                                            <Shield className="w-4 h-4"
                                                style={{
                                                    color: `hsl(var(--${userRole === 'admin' ? 'gold' : 'platinum'
                                                        }))`
                                                }} />
                                            <span className="text-sm font-bold hidden xl:block">
                                                {userRole === 'admin' ? 'Admin' : 'Team'}
                                            </span>
                                        </motion.button>
                                    )}

                                    {/* Logout Button - Desktop Only */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onLogout}
                                        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl"
                                        style={{
                                            background: 'hsl(var(--error) / 0.1)',
                                            color: 'hsl(var(--error))'
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </motion.button>
                                </>
                            ) : (
                                /* Elite Join Button */
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLoginClick}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl relative overflow-hidden"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            hsl(var(--primary)), 
                                            hsl(var(--gold) / 0.9))`,
                                        color: 'hsl(var(--pearl))',
                                        boxShadow: `
                                            0 6px 20px hsl(var(--primary) / 0.3),
                                            inset 0 2px 4px hsl(var(--pearl) / 0.2)
                                        `
                                    }}
                                >
                                    {/* Inner Liquid Effect */}
                                    <motion.div
                                        className="absolute inset-0"
                                        style={{
                                            background: `radial-gradient(circle at 50% 100%, 
                                                hsl(var(--pearl) / 0.2), 
                                                transparent)`
                                        }}
                                        animate={{ y: [20, -20, 20] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />

                                    <div className="relative flex items-center gap-2">
                                        <Crown className="w-4 h-4 hidden lg:block" />
                                        <span className="text-sm font-bold">Join Elite</span>
                                        <Sparkles className="w-3 h-3" />
                                    </div>
                                </motion.button>
                            )}

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9, rotate: 180 }}
                                transition={MOTION_CONFIG.spring}
                                onClick={() => setIsMenuOpen(true)}
                                className="lg:hidden p-2 sm:p-2.5 rounded-xl relative"
                                style={{
                                    background: 'hsl(var(--glass))',
                                    border: '1px solid hsl(var(--border) / 0.2)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                aria-label="Menu"
                            >
                                {/* Menu Icon with Animation */}
                                <div className="relative w-5 h-5">
                                    <motion.span
                                        className="absolute top-1 left-0 w-5 h-0.5 rounded-full"
                                        style={{ background: 'hsl(var(--foreground))' }}
                                        animate={{
                                            width: isMenuOpen ? 0 : 20,
                                            rotate: isMenuOpen ? 45 : 0
                                        }}
                                    />
                                    <motion.span
                                        className="absolute top-1/2 -translate-y-1/2 left-0 w-5 h-0.5 rounded-full"
                                        style={{ background: 'hsl(var(--primary))' }}
                                        animate={{
                                            opacity: isMenuOpen ? 0 : 1
                                        }}
                                    />
                                    <motion.span
                                        className="absolute bottom-1 left-0 w-5 h-0.5 rounded-full"
                                        style={{ background: 'hsl(var(--foreground))' }}
                                        animate={{
                                            width: isMenuOpen ? 0 : 20,
                                            rotate: isMenuOpen ? -45 : 0
                                        }}
                                    />
                                </div>

                                {/* Notification Dot */}
                                {!isAuthenticated && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                                        style={{
                                            background: 'hsl(var(--gold))',
                                            boxShadow: '0 0 8px hsl(var(--gold))'
                                        }}
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Drawer */}
            <LuxuryMobileDrawer
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                navItems={navItems}
                currentView={currentView}
                onNavClick={handleNavClick}
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                onLogin={handleLoginClick}
                onLogout={onLogout}
            />

            {/* Login Modal - Using the imported LoginModal component */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={handleLoginModalClose}
                onLogin={onLogin}
            />
        </>
    );
};

export default memo(Navbar);