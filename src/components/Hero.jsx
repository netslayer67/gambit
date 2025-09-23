import React from "react";
import { motion } from "framer-motion";
import { Play, Calendar, ShoppingBag, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const Hero = () => {
    const handleQuickAction = (action) => {
        toast({
            title: "🚧 Soon",
            description: `${action.toUpperCase()} is coming soon! 🚀`,
        });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1649030572264-6d234fd9f148?auto=format&fit=crop&w=1920&q=80"
                    alt="GH GAMBIT Team Action"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-background/20 backdrop-blur-xl" />
                {/* Decorative blobs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-2000" />
            </div>

            {/* Content */}
            <div className="relative z-20 container mx-auto px-4 py-16 text-center">
                {/* Glass panel */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto max-w-3xl bg-glass/40 backdrop-blur-2xl border border-border/50 rounded-3xl px-6 py-12 md:px-12 md:py-16 shadow-xl"
                >
                    {/* Badge */}
                    <div className="inline-block mb-6 px-4 py-1 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium uppercase tracking-wider">
                        🏀 Premium Basketball Club
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-foreground drop-shadow">
                        GH <span className="text-primary">GAMBIT</span>
                    </h1>

                    {/* Tagline */}
                    <p className="mt-4 text-lg md:text-xl text-secondary-foreground max-w-xl mx-auto">
                        Built Different. Experience basketball with elegance and innovation.
                    </p>

                    {/* Quick Actions */}
                    <div className="mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
                        {[
                            { icon: Play, label: "Highlights", action: "watch" },
                            { icon: Calendar, label: "Schedule", action: "schedule" },
                            { icon: ShoppingBag, label: "Store", action: "store" },
                            { icon: Camera, label: "Gallery", action: "gallery" },
                        ].map(({ icon: Icon, label, action }) => (
                            <Button
                                key={label}
                                size="lg"
                                variant="ghost"
                                className="btn-glass flex items-center gap-2 transition-all duration-300 hover:text-primary hover:border-primary"
                                onClick={() => handleQuickAction(action)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="hidden sm:inline">{label}</span>
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-12"
                >
                    {[
                        { label: "Championships", value: "12" },
                        { label: "Members", value: "25" },
                        { label: "Fans", value: "50K+" },
                        { label: "Years Active", value: "8" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-glass/40 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-border/50 transition-transform duration-300 hover:scale-[1.04]"
                        >
                            <div className="text-2xl md:text-3xl font-bold text-primary">
                                {stat.value}
                            </div>
                            <div className="text-xs md:text-sm text-muted uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
