import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const HeroImage = () => {
    return (
        <section className="relative w-full overflow-hidden py-16 md:py-24">
            {/* Decorative Blobs */}
            <motion.div
                className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--primary)/0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-28 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--gold)/0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto relative z-10 flex flex-col items-center text-center">
                {/* Glass Container */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-base rounded-3xl p-6 md:p-10 max-w-4xl w-full"
                >
                    {/* Image */}
                    <div className="relative mb-6">
                        <img
                            src="https://images.unsplash.com/photo-1649030572264-6d234fd9f148"
                            alt="GH Gambit"
                            className="mx-auto w-3/4 md:w-full rounded-2xl shadow-liquid"
                        />
                    </div>

                    {/* Text */}
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-gold to-secondary bg-clip-text text-transparent">
                        GH GAMBIT
                    </h1>
                    <p className="mt-3 text-sm md:text-lg text-muted">
                        Premium. Exclusive. Be part of the elite circle.
                    </p>

                    {/* CTA */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            size="lg"
                            className="btn-glass bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-320"
                        >
                            Join Now
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="btn-glass bg-gold text-onyx hover:bg-gold/90 transition-all duration-320"
                        >
                            Learn More
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroImage;
