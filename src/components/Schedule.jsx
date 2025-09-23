import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Filter, Home, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Simple sanitizer biar input gak bisa masukin script / link aneh
const sanitizeInput = (value) => {
    return value.replace(/<[^>]*>?/gm, "").replace(/(http|https):\/\/\S+/g, "");
};

const Schedule = () => {
    const [games, setGames] = useState([]);
    const [filter, setFilter] = useState("all");
    const [selectedCompetition, setSelectedCompetition] = useState("all");

    useEffect(() => {
        const savedGames = localStorage.getItem("ghgambit_games");
        if (savedGames) {
            setGames(JSON.parse(savedGames));
        } else {
            const mockGames = [
                {
                    id: 1,
                    opponent: "Thunder Bolts",
                    date: "2024-01-15",
                    time: "19:00",
                    venue: "GH Arena",
                    type: "home",
                    competition: "League Championship",
                    status: "upcoming",
                },
                {
                    id: 2,
                    opponent: "Fire Hawks",
                    date: "2024-01-22",
                    time: "20:30",
                    venue: "Hawks Stadium",
                    type: "away",
                    competition: "League Championship",
                    status: "upcoming",
                },
                {
                    id: 3,
                    opponent: "Storm Riders",
                    date: "2024-01-29",
                    time: "18:00",
                    venue: "GH Arena",
                    type: "home",
                    competition: "Cup Final",
                    status: "upcoming",
                },
            ];
            setGames(mockGames);
            localStorage.setItem("ghgambit_games", JSON.stringify(mockGames));
        }
    }, []);

    const filteredGames = games.filter((game) => {
        const matchesType = filter === "all" || game.type === filter;
        const matchesCompetition =
            selectedCompetition === "all" || game.competition === selectedCompetition;
        return matchesType && matchesCompetition;
    });

    const competitions = [...new Set(games.map((game) => game.competition))];

    const handleBuyTickets = (gameId) => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Ticketing system is not ready yet, stay tuned!",
        });
    };

    return (
        <section className="relative py-20 px-4 overflow-x-hidden">
            {/* 🌀 Decorative Blobs */}
            <motion.div
                className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--primary)/0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--secondary)/0.15), transparent 70%)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                {/* 🔥 Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 px-2"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Game Schedule
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-xl mx-auto">
                        Stay updated with GH Gambit’s upcoming matches.
                    </p>
                </motion.div>

                {/* 🎛 Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="glass-base rounded-2xl p-6 mb-10"
                >
                    <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4">
                        <div className="flex items-center space-x-2 text-sm md:text-base">
                            <Filter className="w-4 h-4 text-primary" />
                            <span className="font-semibold">Filter Games</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: "all", label: "All Games" },
                                { id: "home", label: "Home", icon: Home },
                                { id: "away", label: "Away", icon: Plane },
                            ].map((filterOption) => {
                                const IconComponent = filterOption.icon;
                                return (
                                    <Button
                                        key={filterOption.id}
                                        variant={filter === filterOption.id ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setFilter(filterOption.id)}
                                        className="flex items-center space-x-2 transition-all duration-300"
                                    >
                                        {IconComponent && (
                                            <IconComponent className="w-4 h-4 shrink-0" />
                                        )}
                                        <span>{filterOption.label}</span>
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Competition Dropdown */}
                        <select
                            value={selectedCompetition}
                            onChange={(e) =>
                                setSelectedCompetition(sanitizeInput(e.target.value))
                            }
                            className="input-glass max-w-xs w-full md:w-auto"
                        >
                            <option value="all">All Competitions</option>
                            {competitions.map((comp) => (
                                <option key={comp} value={comp}>
                                    {comp}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* 🏀 Games Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGames.map((game, index) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index, duration: 0.5 }}
                            className="glass-base rounded-2xl p-6 hover:shadow-liquid hover:scale-[1.02] transition-all duration-300 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className={`badge-glass ${game.type === "home"
                                            ? "text-success bg-success/20"
                                            : "text-info bg-info/20"
                                        } flex items-center gap-1`}
                                >
                                    {game.type === "home" ? (
                                        <>
                                            <Home className="w-3 h-3" /> Home
                                        </>
                                    ) : (
                                        <>
                                            <Plane className="w-3 h-3" /> Away
                                        </>
                                    )}
                                </span>
                                <span className="badge-glass text-primary bg-primary/15">
                                    {game.competition}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold mb-3">vs {game.opponent}</h3>

                            <div className="space-y-2 text-sm text-muted flex-1">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>
                                        {new Date(game.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>{game.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{game.venue}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleBuyTickets(game.id)}
                                className="mt-6 w-full"
                            >
                                Buy Tickets
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* ❌ Empty State */}
                {filteredGames.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <p className="text-lg text-muted">
                            No games found for your current filters.
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Schedule;
