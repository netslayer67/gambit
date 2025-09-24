import React, { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Calendar,
    MapPin,
    Clock,
    Filter,
    Home,
    Plane,
    Trophy,
    Star,
    Ticket,
    ChevronDown,
    Sparkles,
    Crown,
    Zap,
    Shield,
    Eye,
    Crown as CrownIcon
} from "lucide-react";

/*
  Schedule.refactor.jsx
  - Token-driven visuals only (no hardcoded hexes)
  - Liquid glass look, compact mobile variant, and perf-aware animations
  - Defensive sanitizers (client-side UX guard; still do server validation)
  - Memoized components to reduce re-renders
  - Consistent 320ms transitions for premium feel
*/

const TRANS_MS = 320;
const TRANS = { duration: TRANS_MS / 1000, ease: [0.22, 1, 0.36, 1] };

/* ----------------------------- Utilities ----------------------------- */
const sanitizeInput = (value = "", max = 150) =>
    String(value || "")
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]*>/g, "")
        .replace(/https?:\/\/\S+/gi, "")
        .replace(/["'<>`\u0000-\u001F]/g, "")
        .trim()
        .slice(0, max);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ------------------------------ Decorative Blobs ------------------------------ */
const EliteBlobs = memo(function EliteBlobs({ enabled = true }) {
    const reduce = useReducedMotion();
    if (!enabled || reduce) return null;

    return (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <motion.div
                className="absolute -top-24 -left-20 w-72 h-72 rounded-full blur-3xl opacity-80"
                style={{ background: `radial-gradient(circle, hsl(var(--primary) / 0.12), hsl(var(--gold) / 0.08), transparent 70%)` }}
                animate={{ rotate: [0, 45, -30, 0], scale: [1, 1.08, 0.96, 1] }}
                transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
            />

            <motion.div
                className="absolute -bottom-32 -right-28 w-80 h-80 rounded-full blur-3xl opacity-70"
                style={{ background: `radial-gradient(circle, hsl(var(--velvet) / 0.15), hsl(var(--platinum) / 0.1), transparent 70%)` }}
                animate={{ rotate: [0, -60, 120, 0], scale: [1, 0.93, 1.06, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
            />
        </div>
    );
});

/* ------------------------------ Filters ------------------------------ */
const EliteFilters = memo(function EliteFilters({ filter, setFilter, competition, setCompetition, competitions }) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function onDoc(e) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("pointerdown", onDoc);
        return () => document.removeEventListener("pointerdown", onDoc);
    }, []);

    const filterOptions = useMemo(() => [
        { id: "all", label: "All", icon: Trophy },
        { id: "home", label: "Home", icon: Home },
        { id: "away", label: "Away", icon: Plane }
    ], []);

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...TRANS, delay: 0.08 }} className="glass-base relative p-4 mb-6 overflow-hidden">
            <div aria-hidden className="absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.03), transparent)" }} />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--gold) / 0.12))` }}>
                        <Filter className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-foreground">Match Filters</h4>
                        <p className="text-sm text-muted">Refine the schedule</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {filterOptions.map((opt) => {
                        const Icon = opt.icon;
                        const active = filter === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setFilter(opt.id)}
                                aria-pressed={active}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all duration-[320ms] ${active ? "shadow-liquid" : ""}`}
                                style={{
                                    background: active ? `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` : undefined,
                                    color: active ? `hsl(var(--primary-foreground))` : undefined
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{opt.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div ref={containerRef} className="relative">
                    <button onClick={() => setOpen((s) => !s)} className="w-full glass-base px-4 py-3 rounded-xl flex items-center justify-between" aria-expanded={open}>
                        <span className="text-foreground font-medium">{competition === "all" ? "All Competitions" : sanitizeInput(competition)}</span>
                        <ChevronDown className="w-4 h-4 text-muted" />
                    </button>

                    <AnimatePresence>
                        {open && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={TRANS} className="absolute top-full mt-2 w-full glass-base rounded-xl shadow-liquid z-20 overflow-hidden">
                                <div className="p-2">
                                    <button onClick={() => { setCompetition("all"); setOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">All Competitions</button>
                                    {competitions.map((c) => (
                                        <button key={c} onClick={() => { setCompetition(sanitizeInput(c)); setOpen(false); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">{c}</button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
});

/* ------------------------- Score display ------------------------- */
const ScoreDisplay = memo(function ScoreDisplay({ score }) {
    if (!score) return null;
    const left = score.home ?? score.teamA ?? score.a ?? "-";
    const right = score.away ?? score.teamB ?? score.b ?? "-";
    return (
        <div className="flex items-center gap-3 justify-center mt-3">
            <div className="text-2xl font-bold text-foreground">{left}</div>
            <div className="text-lg text-muted">-</div>
            <div className="text-2xl font-bold text-foreground">{right}</div>
        </div>
    );
});

/* ------------------------- EliteGameCard ------------------------- */
const EliteGameCard = memo(function EliteGameCard({ game, index, onBuy }) {
    const gameDate = useMemo(() => new Date(game.date), [game.date]);
    const isUpcoming = gameDate > new Date();
    const month = gameDate.toLocaleDateString(undefined, { month: "short" });
    const day = gameDate.getDate();
    const dayOfWeek = gameDate.toLocaleDateString(undefined, { weekday: "short" });

    const handleBuy = useCallback(() => onBuy(game.id), [onBuy, game.id]);

    return (
        <article aria-labelledby={`game-${game.id}`} className="relative z-10">
            <div className="hidden sm:block">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...TRANS, delay: index * 0.04 }} className="glass-base rounded-2xl overflow-hidden hover:shadow-liquid hover:scale-[1.02] transition-transform duration-[320ms]">
                    <div className="p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="px-2 py-1 rounded-xl" style={{ background: game.type === "home" ? `hsl(var(--success) / 0.12)` : `hsl(var(--info) / 0.12)` }}>
                                    {game.type === "home" ? <Home className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                                </div>
                                {game.competition?.toLowerCase().includes("final") && (
                                    <div className="badge-glass text-gold" style={{ backgroundColor: `hsl(var(--gold) / 0.12)` }}>
                                        <CrownIcon className="w-3 h-3" />
                                    </div>
                                )}
                            </div>

                            <div className="badge-glass text-primary font-semibold" style={{ backgroundColor: `hsl(var(--primary) / 0.12)` }}>{game.competition}</div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl" style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--gold) / 0.12))` }}>
                                <span className="text-xs font-semibold text-primary uppercase">{month}</span>
                                <span id={`game-${game.id}`} className="text-2xl font-bold text-foreground">{day}</span>
                                <span className="text-xs text-muted">{dayOfWeek}</span>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-foreground mb-1">vs {sanitizeInput(game.opponent)}</h3>
                                <div className="flex items-center gap-2">
                                    {isUpcoming && <Sparkles className="w-4 h-4 text-gold" />}
                                    <span className="text-sm text-muted">{isUpcoming ? "Upcoming Match" : "Past Match"}</span>
                                </div>

                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 rounded-lg" style={{ backgroundColor: `hsl(var(--primary) / 0.08)` }}><Clock className="w-4 h-4 text-primary" /></div>
                                        <span className="text-foreground font-medium">{sanitizeInput(game.time)}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="p-1 rounded-lg" style={{ backgroundColor: `hsl(var(--info) / 0.08)` }}><MapPin className="w-4 h-4 text-info" /></div>
                                        <span className="text-foreground font-medium">{sanitizeInput(game.venue)}</span>
                                    </div>

                                    {!isUpcoming && game.score && <ScoreDisplay score={game.score} />}
                                </div>
                            </div>
                        </div>

                        <div>
                            <motion.button onClick={handleBuy} whileHover={{ scale: isUpcoming ? 1.02 : 1 }} whileTap={{ scale: 0.98 }} disabled={!isUpcoming} className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2" style={{ background: isUpcoming ? `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` : `hsl(var(--glass))`, color: isUpcoming ? `hsl(var(--primary-foreground))` : `hsl(var(--muted))`, transitionDuration: "320ms" }} aria-disabled={!isUpcoming}>
                                {isUpcoming ? (<><Ticket className="w-5 h-5" /><span>Get VIP Tickets</span><Star className="w-4 h-4" /></>) : (<><Shield className="w-5 h-5" /><span>Match Completed</span></>)}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile compact card */}
            <div className="block sm:hidden">
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={TRANS} className="flex items-center justify-between glass-base rounded-xl p-3 gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex flex-col items-center justify-center rounded-lg" style={{ background: `linear-gradient(135deg, hsl(var(--primary) / 0.16), hsl(var(--gold) / 0.08))` }}>
                            <span className="text-xs font-semibold text-primary">{month}</span>
                            <span className="text-base font-bold text-foreground">{day}</span>
                        </div>

                        <div>
                            <div className="text-sm font-semibold text-foreground">vs {sanitizeInput(game.opponent)}</div>
                            <div className="text-xs text-muted">{sanitizeInput(game.time)} • {sanitizeInput(game.venue)}</div>
                            {!isUpcoming && game.score && (<div className="text-sm font-bold text-foreground mt-1">{game.score.home ?? game.score.teamA ?? game.score.a} - {game.score.away ?? game.score.teamB ?? game.score.b}</div>)}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleBuy} disabled={!isUpcoming} aria-label={isUpcoming ? "Buy tickets" : "Match completed"} className="inline-flex items-center justify-center rounded-full p-2" style={{ background: isUpcoming ? `hsl(var(--primary))` : `hsl(var(--glass))`, color: isUpcoming ? `hsl(var(--primary-foreground))` : `hsl(var(--muted))` }}>
                            <Ticket className="w-4 h-4" />
                        </button>

                        <button onClick={() => alert("Quick view")} aria-label="Quick view" className="inline-flex items-center justify-center rounded-full p-2 glass-base">
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </article>
    );
});

/* --------------------------- Main Schedule Component --------------------------- */
const Schedule = () => {
    const [games, setGames] = useState([]);
    const [filter, setFilter] = useState("all");
    const [competition, setCompetition] = useState("all");
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let mounted = true;
        const timer = setTimeout(() => {
            if (!mounted) return;
            const mockGames = [
                { id: 1, opponent: "Thunder Bolts", date: "2024-12-15", time: "19:00", venue: "GH Elite Arena", type: "home", competition: "Champions League", status: "upcoming" },
                { id: 2, opponent: "Fire Hawks", date: "2024-12-22", time: "20:30", venue: "Hawks Stadium", type: "away", competition: "Elite Cup", status: "upcoming" },
                { id: 3, opponent: "Storm Riders", date: "2024-12-29", time: "18:00", venue: "GH Elite Arena", type: "home", competition: "Championship Final", status: "upcoming" },
                { id: 4, opponent: "Lightning Wolves", date: "2024-11-15", time: "17:30", venue: "Wolves Den", type: "away", competition: "Champions League", status: "completed", score: { home: 112, away: 98 } },
                { id: 5, opponent: "Ice Dragons", date: "2025-01-05", time: "19:45", venue: "GH Elite Arena", type: "home", competition: "Elite Cup", status: "upcoming" },
                { id: 6, opponent: "River Kings", date: "2024-10-20", time: "20:00", venue: "King Dome", type: "away", competition: "Autumn Cup", status: "completed", score: { home: 78, away: 82 } }
            ];
            setGames(mockGames);
            setLoaded(true);
        }, 500);

        return () => { mounted = false; clearTimeout(timer); };
    }, []);

    const competitions = useMemo(() => Array.from(new Set(games.map((g) => g.competition).filter(Boolean))), [games]);

    const filteredGames = useMemo(() => games.filter((g) => {
        const byType = filter === "all" ? true : g.type === filter;
        const byComp = competition === "all" ? true : g.competition === competition;
        return byType && byComp;
    }), [games, filter, competition]);

    const handleBuy = useCallback((id) => {
        const g = games.find((x) => x.id === id);
        // lightweight client feedback; integrate with your payment flow in backend
        window.requestAnimationFrame(() => {
            // intentionally plain text notification to avoid unsafe HTML
            alert(`VIP tickets requested for "${sanitizeInput(g?.opponent ?? String(id))}" — checkout coming soon.`);
        });
    }, [games]);

    if (!loaded) {
        return (
            <section className="relative py-20 px-4 min-h-[60vh] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <CrownIcon className="w-12 h-12 text-primary" />
                </motion.div>
            </section>
        );
    }

    return (
        <section className="relative py-12 px-4 min-h-screen">
            <EliteBlobs enabled={true} />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.header initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...TRANS }} className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 mb-3 justify-center">
                        <div className="p-3 rounded-2xl" style={{ background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.8))` }}>
                            <Trophy className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-gold to-platinum">Elite Schedule</h1>
                            <div className="flex items-center gap-2 mt-1 justify-center"><Zap className="w-4 h-4 text-gold" /><span className="text-muted">Premium Matches</span></div>
                        </div>
                    </div>
                    <p className="text-muted max-w-2xl mx-auto mt-3">Witness greatness — concise schedule with VIP access.</p>
                </motion.header>

                <EliteFilters filter={filter} setFilter={setFilter} competition={competition} setCompetition={setCompetition} competitions={competitions} />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.length ? filteredGames.map((game, idx) => (
                        <EliteGameCard key={game.id} game={game} index={idx} onBuy={handleBuy} />
                    )) : (
                        <div className="col-span-full text-center py-12">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6" style={{ background: `linear-gradient(135deg, hsl(var(--muted) / 0.2), hsl(var(--border) / 0.1))` }}>
                                <Calendar className="w-12 h-12 text-muted" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">No Matches Found</h3>
                            <p className="text-muted">Try different filters to discover upcoming matches.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(Schedule);
