import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, CreditCard, MapPin, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// 🛡️ simple sanitizer biar input aman
const sanitizeInput = (value) =>
    value.replace(/<[^>]*>?/gm, "").replace(/(http|https):\/\/\S+/g, "");

const Ticketing = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [games, setGames] = useState([]);

    useEffect(() => {
        const savedGames = localStorage.getItem("ghgambit_games");
        if (savedGames) {
            setGames(JSON.parse(savedGames));
        }
    }, []);

    const ticketSections = [
        {
            id: "vip",
            name: "VIP Courtside",
            price: 150,
            description: "Exclusive courtside + lounge access",
            icon: Star,
            style: "text-gold border-gold/40 hover:bg-gold/10",
        },
        {
            id: "premium",
            name: "Premium Seats",
            price: 75,
            description: "Comfort + prime viewing spots",
            icon: Users,
            style: "text-primary border-primary/40 hover:bg-primary/10",
        },
        {
            id: "general",
            name: "General Admission",
            price: 35,
            description: "Solid seats, great atmosphere",
            icon: Ticket,
            style: "text-foreground border-muted/40 hover:bg-muted/10",
        },
    ];

    const handlePurchase = () => {
        if (!selectedGame || !selectedSection) {
            toast({
                title: "Please select a game and ticket section",
                variant: "destructive",
            });
            return;
        }
        const total = selectedSection.price * ticketQuantity;
        toast({
            title: "🚧 Purchase flow coming soon",
            description: `Your total: $${total}`,
        });
    };

    const getTotal = () =>
        selectedSection ? selectedSection.price * ticketQuantity : 0;

    return (
        <section className="relative py-20 px-4 overflow-hidden">
            {/* Decorative Blobs */}
            <motion.div
                className="absolute -top-40 -left-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--primary)/0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--secondary)/0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                        Get Your Tickets
                    </h1>
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">
                        Experience GH GAMBIT like never before. Choose your game and seat.
                    </p>
                </motion.div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Game Selection */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold">Select Game</h2>
                        <div className="space-y-4">
                            {games
                                .filter((game) => game.status === "upcoming")
                                .map((game) => (
                                    <div
                                        key={game.id}
                                        onClick={() => setSelectedGame(game)}
                                        className={`glass-base rounded-2xl p-6 cursor-pointer transition-all duration-300 ${selectedGame?.id === game.id
                                                ? "ring-2 ring-primary bg-primary/5"
                                                : "hover:bg-overlay-light/20"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-bold">vs {game.opponent}</h3>
                                            <span
                                                className={`badge-glass ${game.type === "home"
                                                        ? "text-success bg-success/15"
                                                        : "text-info bg-info/15"
                                                    }`}
                                            >
                                                {game.type}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-muted">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{sanitizeInput(game.venue)}</span>
                                            </div>
                                            <div>
                                                {new Date(game.date).toLocaleDateString()} at {game.time}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Ticket Sections */}
                        {selectedGame && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold">Select Ticket Type</h3>
                                {ticketSections.map((section) => {
                                    const Icon = section.icon;
                                    return (
                                        <div
                                            key={section.id}
                                            onClick={() => setSelectedSection(section)}
                                            className={`glass-base rounded-2xl p-6 cursor-pointer transition-all duration-300 border ${selectedSection?.id === section.id
                                                    ? section.style
                                                    : "border-transparent hover:border-border"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-6 h-6" />
                                                    <h4 className="text-lg font-bold">{section.name}</h4>
                                                </div>
                                                <div className="text-2xl font-bold">
                                                    ${section.price}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted">{section.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* Purchase Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold">Purchase Summary</h2>
                        <div className="glass-base rounded-2xl p-6 space-y-6">
                            {selectedGame ? (
                                <>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Game Details</h3>
                                        <div className="space-y-1 text-sm text-muted">
                                            <div>GH GAMBIT vs {selectedGame.opponent}</div>
                                            <div>
                                                {new Date(selectedGame.date).toLocaleDateString()} at{" "}
                                                {selectedGame.time}
                                            </div>
                                            <div>{selectedGame.venue}</div>
                                        </div>
                                    </div>

                                    {selectedSection && (
                                        <>
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">
                                                    Ticket Details
                                                </h3>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span>Section</span>
                                                        <span className="font-semibold">
                                                            {selectedSection.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Price</span>
                                                        <span className="font-semibold">
                                                            ${selectedSection.price}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold mb-2">
                                                    Quantity
                                                </label>
                                                <select
                                                    value={ticketQuantity}
                                                    onChange={(e) =>
                                                        setTicketQuantity(
                                                            parseInt(sanitizeInput(e.target.value))
                                                        )
                                                    }
                                                    className="input-glass"
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                                        <option key={num} value={num}>
                                                            {num} ticket{num > 1 ? "s" : ""}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="border-t border-border pt-4">
                                                <div className="flex justify-between text-2xl font-bold">
                                                    <span>Total</span>
                                                    <span className="text-primary">${getTotal()}</span>
                                                </div>
                                            </div>

                                            <Button
                                                size="lg"
                                                className="w-full flex items-center justify-center gap-2 transition-colors duration-300 hover:bg-primary/80"
                                                onClick={handlePurchase}
                                            >
                                                <CreditCard className="w-5 h-5" />
                                                <span>Purchase</span>
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <Ticket className="w-14 h-14 text-muted mx-auto mb-4" />
                                    <p className="text-muted">Select a game to continue</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Ticketing;
