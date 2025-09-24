import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Shield,
    Star,
    Users,
    Crown,
    Award,
    ChevronRight,
    Instagram,
    Twitter,
    Youtube,
    Heart,
    Medal,
    User,
    Search as SearchIcon,
    X
} from 'lucide-react';

// -----------------------------
// Constants / Utilities
// -----------------------------
const t320 = { transitionDuration: '320ms', transitionTimingFunction: 'cubic-bezier(.2,.9,.3,1)' };

// Strict client-side sanitizer for lightweight UX-level protection
const sanitizeInput = (val = '') =>
    String(val)
        .replace(/<[^>]*>?/gm, '') // strip tags
        .replace(/(http|https):\/\/[^\s]+/gi, '') // remove urls
        .replace(/javascript:\s*[^\s]+/gi, '') // remove javascript: links
        .slice(0, 120) // soft length cap
        .trim();

const DEFAULT_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23c1c1c1' font-size='28' font-family='Inter, sans-serif'>No Image</text></svg>"
)} `;

// -----------------------------
// Mock Data (kept inline for single-file)
// -----------------------------
const CATEGORIES = [
    { id: 'elite', name: 'Special Elite', icon: Crown, tone: 'gold' },
    { id: 'u21m', name: 'U-21 Male', icon: Shield, tone: 'primary' },
    { id: 'u21f', name: 'U-21 Female', icon: Star, tone: 'velvet' },
    { id: 'u16m', name: 'U-16 Male', icon: Shield, tone: 'info' },
    { id: 'u16f', name: 'U-16 Female', icon: Star, tone: 'success' }
];

const COACHES = [
    {
        id: 1,
        name: 'Alexander Mitchell',
        role: 'Head Coach',
        experience: '15 years',
        achievements: ['3x National Champion', 'FIBA Licensed', 'Olympic Assistant Coach'],
        image: null,
        stats: { wins: 342, championships: 8, winRate: '78%' }
    },
    {
        id: 2,
        name: 'Sarah Johnson',
        role: 'Assistant Coach',
        experience: '8 years',
        achievements: ['Former WNBA Player', 'Youth Development Expert'],
        image: null,
        stats: { trained: 200, proPlayers: 15, rating: '4.9/5' }
    }
];

const TEAMS = {
    elite: {
        name: 'Special Elite Squad',
        description: 'Pinnacle of GH GAMBIT excellence.',
        achievements: ['National Champions 2024', 'International Cup Winners', 'Perfect Season 32-0'],
        players: [
            { id: 1, name: 'Marcus King', position: 'Point Guard', number: 7, photo: null, stats: { ppg: 28.5, apg: 9.2, spg: 2.8 }, awards: ['MVP 2024', 'All-Star'] },
            { id: 2, name: 'David Chen', position: 'Shooting Guard', number: 23, photo: null, stats: { ppg: 24.3, rpg: 5.1, fg: '48%' }, awards: ['Best Shooter'] },
            { id: 3, name: 'James Rodriguez', position: 'Small Forward', number: 11, photo: null, stats: { ppg: 18.7, rpg: 7.3, bpg: 1.5 }, awards: ['Defensive Player'] },
            { id: 4, name: 'Anthony Davis Jr.', position: 'Power Forward', number: 32, photo: null, stats: { ppg: 21.2, rpg: 11.4, bpg: 2.3 }, awards: ['Rising Star'] },
            { id: 5, name: 'Samuel Okonkwo', position: 'Center', number: 99, photo: null, stats: { ppg: 15.8, rpg: 13.2, bpg: 3.1 }, awards: ['Block Leader'] }
        ]
    },
    u21m: {
        name: 'U-21 Male Warriors',
        description: 'Future stars in the making.',
        achievements: ['Regional Champions', 'Tournament MVP', 'Best Defense Award'],
        players: [
            { id: 6, name: 'Ryan Smith', position: 'Point Guard', number: 3, photo: null, stats: { ppg: 22.1, apg: 7.5, spg: 2.2 } },
            { id: 7, name: 'Kevin Lee', position: 'Shooting Guard', number: 14, photo: null, stats: { ppg: 19.8, rpg: 4.3, fg: '45%' } },
            { id: 8, name: 'Michael Brown', position: 'Small Forward', number: 21, photo: null, stats: { ppg: 17.5, rpg: 6.8, apg: 3.2 } },
            { id: 9, name: 'Daniel Wilson', position: 'Power Forward', number: 44, photo: null, stats: { ppg: 16.2, rpg: 9.7, bpg: 1.8 } },
            { id: 10, name: 'Chris Johnson', position: 'Center', number: 55, photo: null, stats: { ppg: 14.3, rpg: 10.5, bpg: 2.5 } }
        ]
    },
    u21f: {
        name: 'U-21 Female Phoenix',
        description: 'Rising with unstoppable force.',
        achievements: ['State Champions', 'Perfect Home Record', 'Fastest Team Award'],
        players: [
            { id: 11, name: 'Emma Thompson', position: 'Point Guard', number: 8, photo: null, stats: { ppg: 21.3, apg: 8.7, spg: 3.1 } },
            { id: 12, name: 'Sophia Martinez', position: 'Shooting Guard', number: 24, photo: null, stats: { ppg: 18.9, rpg: 4.5, fg: '47%' } },
            { id: 13, name: 'Olivia Anderson', position: 'Small Forward', number: 10, photo: null, stats: { ppg: 16.4, rpg: 7.2, apg: 4.1 } },
            { id: 14, name: 'Isabella Garcia', position: 'Power Forward', number: 33, photo: null, stats: { ppg: 15.7, rpg: 8.9, bpg: 1.6 } },
            { id: 15, name: 'Ava Williams', position: 'Center', number: 50, photo: null, stats: { ppg: 13.2, rpg: 11.3, bpg: 2.8 } }
        ]
    },
    u16m: {
        name: 'U-16 Male Thunder',
        description: 'Young talents with explosive potential.',
        achievements: ['Junior League Winners', 'Rookie Team of the Year'],
        players: [
            { id: 16, name: 'Noah Davis', position: 'Point Guard', number: 2, photo: null, stats: { ppg: 18.5, apg: 6.3, spg: 2.0 } },
            { id: 17, name: 'Liam Miller', position: 'Shooting Guard', number: 15, photo: null, stats: { ppg: 16.7, rpg: 3.8, fg: '43%' } },
            { id: 18, name: 'Ethan Jones', position: 'Small Forward', number: 20, photo: null, stats: { ppg: 14.9, rpg: 5.7, apg: 2.8 } },
            { id: 19, name: 'Mason Taylor', position: 'Power Forward', number: 40, photo: null, stats: { ppg: 13.4, rpg: 8.2, bpg: 1.3 } },
            { id: 20, name: 'Lucas Moore', position: 'Center', number: 51, photo: null, stats: { ppg: 11.8, rpg: 9.5, bpg: 2.1 } }
        ]
    },
    u16f: {
        name: 'U-16 Female Lightning',
        description: 'Speed and precision define our game.',
        achievements: ['Undefeated Season', 'Best Offense Award', 'Youth Olympics Qualified'],
        players: [
            { id: 21, name: 'Mia Robinson', position: 'Point Guard', number: 5, photo: null, stats: { ppg: 19.2, apg: 7.8, spg: 2.7 } },
            { id: 22, name: 'Charlotte White', position: 'Shooting Guard', number: 12, photo: null, stats: { ppg: 17.3, rpg: 3.9, fg: '46%' } },
            { id: 23, name: 'Amelia Harris', position: 'Small Forward', number: 18, photo: null, stats: { ppg: 15.6, rpg: 6.4, apg: 3.5 } },
            { id: 24, name: 'Harper Clark', position: 'Power Forward', number: 31, photo: null, stats: { ppg: 14.1, rpg: 7.8, bpg: 1.4 } },
            { id: 25, name: 'Ella Lewis', position: 'Center', number: 45, photo: null, stats: { ppg: 12.3, rpg: 10.1, bpg: 2.3 } }
        ]
    }
};

// -----------------------------
// Subcomponents
// -----------------------------
const GlassCard = ({ children, className = '', ...props }) => (
    <div
        {...props}
        className={`glass-base rounded-2xl p-4 md:p-6 border border-white/10 backdrop-blur-xl ${className}`}
        style={{ ...t320 }}
    >
        {children}
    </div>
);

const CoachCard = React.memo(({ coach }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.995 }} className="w-full">
        <GlassCard className="flex gap-4 items-start">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center text-3xl" aria-hidden>
                {coach.image || <User className="w-8 h-8 text-gold" />}
            </div>

            <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h4 className="text-lg font-bold text-foreground">{coach.name}</h4>
                        <div className="text-sm text-primary">{coach.role}</div>
                    </div>
                    <div className="text-right text-xs text-muted">{coach.experience}</div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                    {Object.entries(coach.stats).map(([k, v]) => (
                        <div key={k} className="glass-base rounded-xl p-2">
                            <div className="text-lg font-bold text-gold">{v}</div>
                            <div className="text-[10px] uppercase text-muted">{k}</div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 flex-wrap mt-4">
                    {coach.achievements.map((a, i) => (
                        <span key={i} className="badge-glass text-xs bg-gradient-to-r from-gold/10 to-primary/10 text-gold">{a}</span>
                    ))}
                </div>
            </div>
        </GlassCard>
    </motion.div>
));

// Compact player (mobile) - icon/story-like card (3 columns)
const PlayerCompact = React.memo(({ player, liked, onToggleLike, onOpen }) => {
    const imgSrc = player.photo || DEFAULT_IMG;
    return (
        <motion.div
            layout
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => onOpen(player)}
            style={{ ...t320 }}
        >
            <div className="relative rounded-xl overflow-hidden glass-base p-1 flex flex-col items-center justify-center">
                <img src={imgSrc} alt={player.name} loading="lazy" className="w-full h-24 object-cover rounded-lg" onError={(e) => (e.currentTarget.src = DEFAULT_IMG)} />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <h5 className="text-sm font-bold text-white truncate">{player.name}</h5>
                    <div className="text-xs text-gold">#{player.number}</div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLike(player.id);
                    }}
                    aria-pressed={liked}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/30 backdrop-blur-sm"
                >
                    <Heart className={`${liked ? 'fill-error text-error' : 'text-white'} w-4 h-4`} />
                </button>
            </div>
        </motion.div>
    );
});

// Full player card for desktop/tablet
const PlayerFull = React.memo(({ player, liked, onToggleLike, onOpen }) => {
    const imgSrc = player.photo || DEFAULT_IMG;
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            className="cursor-pointer"
            onClick={() => onOpen(player)}
            style={{ ...t320 }}
        >
            <GlassCard className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h5 className="text-lg font-bold text-foreground">{player.name}</h5>
                        <div className="text-sm text-primary">{player.position}</div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-lg font-bold bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">#{player.number}</div>
                        <button
                            className="p-2 rounded-full glass-base"
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleLike(player.id);
                            }}
                            aria-pressed={liked}
                        >
                            <Heart className={`${liked ? 'fill-error text-error' : 'text-muted hover:text-error'} w-5 h-5`} />
                        </button>
                    </div>
                </div>

                <div className="relative rounded-xl overflow-hidden">
                    <img src={imgSrc} alt={`${player.name} portrait`} loading="lazy" onError={(e) => (e.currentTarget.src = DEFAULT_IMG)} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                        <div className="w-full">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-gold/80 uppercase tracking-wider">Stats</div>
                                    <div className="flex gap-3 mt-1">
                                        {Object.entries(player.stats).slice(0, 3).map(([k, v]) => (
                                            <div key={k} className="text-center">
                                                <div className="text-lg font-bold text-white">{v}</div>
                                                <div className="text-[10px] uppercase text-white/70">{k}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-white">
                                    <span className="text-sm">View</span>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {(player.awards || []).map((a, i) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-gold/10 to-primary/10 text-gold">
                            <Award className="w-3 h-3" />
                            {a}
                        </span>
                    ))}
                </div>
            </GlassCard>
        </motion.div>
    );
});

// -----------------------------
// Main Component
// -----------------------------
export default function Membership() {
    const [activeCategory, setActiveCategory] = useState('elite');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [likedPlayers, setLikedPlayers] = useState(() => new Set());
    const [query, setQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 768);
        onResize();
        window.addEventListener('resize', onResize);

        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduceMotion(mq.matches);
        const onMotionChange = () => setReduceMotion(mq.matches);
        mq.addEventListener?.('change', onMotionChange);

        return () => {
            window.removeEventListener('resize', onResize);
            mq.removeEventListener?.('change', onMotionChange);
        };
    }, []);

    const currentTeam = useMemo(() => TEAMS[activeCategory], [activeCategory]);

    // simple client-side filter using sanitized query
    const filteredPlayers = useMemo(() => {
        const q = sanitizeInput(query).toLowerCase();
        if (!q) return currentTeam.players;
        return currentTeam.players.filter((p) => `${p.name} ${p.position}`.toLowerCase().includes(q));
    }, [currentTeam, query]);

    const toggleLike = useCallback((playerId) => {
        setLikedPlayers((prev) => {
            const next = new Set(prev);
            if (next.has(playerId)) next.delete(playerId);
            else next.add(playerId);
            return next;
        });
    }, []);

    const openPlayer = useCallback((player) => setSelectedPlayer(player), []);
    const closePlayer = useCallback(() => setSelectedPlayer(null), []);

    // compact mobile variant: dense grid (3 cols) vs full cards on larger screens
    const compact = isMobile;

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-pearl dark:from-onyx dark:via-background dark:to-onyx">
            {/* Decorative blobs (token-based) */}
            <motion.div
                aria-hidden
                className="absolute -top-8 -left-4 w-72 h-72 rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.28), transparent 70%)' }}
                animate={!reduceMotion ? { rotate: [0, 12, 0, -8, 0] } : { rotate: 0 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                aria-hidden
                className="absolute -bottom-8 -right-4 w-64 h-64 rounded-full blur-3xl opacity-18"
                style={{ background: 'radial-gradient(circle, hsl(var(--gold)/0.24), transparent 70%)' }}
                animate={!reduceMotion ? { rotate: [0, -10, 0, 8, 0] } : { rotate: 0 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-3 leading-tight"
                        initial={{ y: -8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span style={{ background: 'linear-gradient(90deg, hsl(var(--gold)), hsl(var(--primary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            GH GAMBIT
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-base text-muted max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.12 }}
                    >
                        Elite basketball excellence. Discover our teams, coaches, and players who define the legacy of GH GAMBIT.
                    </motion.p>
                </div>

                {/* Coaches */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-gold" />
                            <span className="bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">Coaching Staff</span>
                        </h2>
                        <div className="hidden md:flex gap-3">
                            <button className="btn-glass text-sm px-4 py-2 bg-gradient-to-r from-gold/10 to-primary/10 text-gold" style={t320}>Contact</button>
                            <button className="btn-glass text-sm px-4 py-2" style={t320}>Roster</button>
                        </div>
                    </div>

                    <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2'} gap-6`}>
                        {COACHES.map((c) => <CoachCard key={c.id} coach={c} />)}
                    </div>
                </div>

                {/* Tabs + Search */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className={`flex gap-4 overflow-x-auto scrollbar-hide ${compact ? 'w-full' : ''}`} role="tablist" aria-label="Team categories">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const active = cat.id === activeCategory;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    role="tab"
                                    aria-selected={active}
                                    className={`flex items-center gap-2 whitespace-nowrap ${compact ? 'min-w-[80px] justify-center px-3 py-3' : 'px-6 py-3'} rounded-2xl font-bold ${active ? 'bg-gradient-to-r from-gradient-start to-gold text-white shadow-liquid' : 'glass-base hover:bg-white/10'}`}
                                    style={active ? { ...t320 } : { ...t320 }}
                                >
                                    <Icon className={`${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
                                    {!compact && <span>{cat.name}</span>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-1/3">
                        <div className="relative w-full">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                            <input
                                aria-label="Search players"
                                placeholder="Search players..."
                                value={query}
                                onChange={(e) => setQuery(sanitizeInput(e.target.value))}
                                className="input-glass pl-12 pr-4 w-full py-3 rounded-xl"
                                maxLength={120}
                                inputMode="search"
                                style={{ ...t320 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Team overview */}
                <motion.div key={activeCategory} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.36 }} className="mb-8">
                    <GlassCard className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">{currentTeam.name}</h3>
                                <p className="text-muted">{currentTeam.description}</p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {currentTeam.achievements.map((a, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-gold/10 to-primary/10 border border-gold/20">
                                        <Trophy className="w-5 h-5 text-gold" />
                                        <span className="text-sm font-medium">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>

                {/* Players grid: mobile compact = 3 columns (story-like), desktop = full cards */}
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`${compact ? 'grid grid-cols-3 gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}
                    >
                        {filteredPlayers.map((p) => compact ? (
                            <PlayerCompact key={p.id} player={p} liked={likedPlayers.has(p.id)} onToggleLike={toggleLike} onOpen={openPlayer} />
                        ) : (
                            <PlayerFull key={p.id} player={p} liked={likedPlayers.has(p.id)} onToggleLike={toggleLike} onOpen={openPlayer} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Fan stats & social */}
                <div className="mt-16 text-center">
                    <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">Join the Legacy</h4>
                    <div className={`grid ${compact ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6 max-w-4xl mx-auto mb-10`}>
                        {[
                            { icon: Users, title: '12k+', subtitle: 'Active Fans' },
                            { icon: Trophy, title: '47', subtitle: 'Championships' },
                            { icon: Star, title: '150+', subtitle: 'Pro Players' }
                        ].map((s, i) => (
                            <GlassCard key={i} className="text-center p-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gradient-start to-gold flex items-center justify-center mx-auto mb-4">
                                    <s.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-gold to-primary bg-clip-text text-transparent">{s.title}</div>
                                <div className="text-sm text-muted mt-1">{s.subtitle}</div>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 justify-center">
                        {[{ icon: Instagram, link: '#' }, { icon: Twitter, link: '#' }, { icon: Youtube, link: '#' }].map((s, i) => (
                            <motion.a
                                key={i}
                                href={s.link}
                                whileHover={!reduceMotion ? { scale: 1.1, rotate: 5 } : {}}
                                className="glass-base rounded-full p-4"
                                style={t320}
                            >
                                <s.icon className="w-6 h-6 text-gold" />
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Player modal */}
            <AnimatePresence>
                {selectedPlayer && (
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePlayer} role="dialog" aria-modal="true">
                        <div className="absolute inset-0 bg-overlay-dark backdrop-blur-sm" />
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.96, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.96, opacity: 0 }}
                            className="glass-base rounded-3xl p-8 max-w-lg w-full z-10 relative"
                        >
                            <button
                                onClick={closePlayer}
                                className="absolute top-4 right-4 p-2 rounded-full glass-base"
                                style={t320}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center mx-auto mb-6">
                                    {selectedPlayer.photo ? (
                                        <img src={selectedPlayer.photo} alt={selectedPlayer.name} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <User className="w-12 h-12 text-gold" />
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold mb-1">{selectedPlayer.name}</h3>
                                <div className="text-sm text-primary mb-6">#{selectedPlayer.number} • {selectedPlayer.position}</div>

                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {Object.entries(selectedPlayer.stats).map(([k, v]) => (
                                        <div key={k} className="glass-base rounded-xl p-4">
                                            <div className="text-xl font-bold text-gold">{v}</div>
                                            <div className="text-xs uppercase text-muted">{k}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 justify-center mb-6">
                                    {(selectedPlayer.awards || []).map((a, i) => (
                                        <span key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold/10 to-primary/10">
                                            <Medal className="w-4 h-4 text-gold" />
                                            <span className="text-sm">{a}</span>
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => { toggleLike(selectedPlayer.id); closePlayer(); }}
                                    className={`btn-glass w-full rounded-xl font-bold px-6 py-4 ${likedPlayers.has(selectedPlayer.id) ? 'bg-gradient-to-r from-error to-error/80 text-white' : 'bg-gradient-to-r from-primary to-gold text-white'}`}
                                    style={t320}
                                >
                                    {likedPlayers.has(selectedPlayer.id) ? 'Already a Fan ❤️' : 'Become a Fan'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}