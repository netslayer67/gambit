import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Check, Gift, Calendar, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// 🛡️ Input sanitizer
const sanitizeInput = (val) =>
    val.replace(/<[^>]*>?/gm, "").replace(/(http|https):\/\/\S+/g, "").trim();

const Membership = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthDate: "",
        address: "",
    });

    const membershipPlans = [
        {
            id: "fan",
            name: "Fan Club",
            price: 29.99,
            period: "year",
            icon: Star,
            color: "bg-secondary text-secondary-foreground",
            features: [
                "Fan newsletter",
                "Early ticket access",
                "Wallpapers & ringtones",
                "Merch discounts",
                "Fan-only events",
            ],
            description: "Stay connected with your team",
        },
        {
            id: "premium",
            name: "Premium Member",
            price: 79.99,
            period: "year",
            icon: Gift,
            color: "bg-primary text-primary-foreground",
            popular: true,
            features: [
                "All Fan benefits",
                "Priority seating",
                "Meet & greet",
                "Exclusive merch",
                "Behind-the-scenes",
                "Game day access",
                "Free shipping",
            ],
            description: "Our most popular plan",
        },
        {
            id: "vip",
            name: "VIP Elite",
            price: 199.99,
            period: "year",
            icon: Crown,
            color: "bg-gold text-onyx",
            features: [
                "All Premium benefits",
                "Courtside upgrades",
                "Private events",
                "Autograph sessions",
                "VIP parking",
                "Concierge",
                "Annual dinner",
                "Custom jersey",
            ],
            description: "Ultimate experience for elites",
        },
    ];

    const handlePlanSelect = (plan) => setSelectedPlan(plan);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: sanitizeInput(e.target.value),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlan) {
            toast({
                title: "Select a membership plan",
                variant: "destructive",
            });
            return;
        }
        const required = ["firstName", "lastName", "email"];
        const missing = required.filter((f) => !formData[f]);
        if (missing.length) {
            toast({
                title: "Required fields missing",
                description: "First name, last name, and email are required",
                variant: "destructive",
            });
            return;
        }

        const data = {
            plan: selectedPlan,
            member: formData,
            joinDate: new Date().toISOString(),
            status: "active",
        };
        localStorage.setItem("ghgambit_membership", JSON.stringify(data));

        toast({
            title: "Success",
            description: "Your membership has been saved locally 🚀",
        });
    };

    return (
        <section className="relative py-20 px-4 overflow-hidden">
            {/* Decorative Blobs */}
            <motion.div
                className="absolute -top-40 -left-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-30"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--primary)/0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-32 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-25"
                style={{
                    background:
                        "radial-gradient(circle, hsl(var(--gold)/0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="container mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-gold to-secondary bg-clip-text text-transparent">
                        Join GH GAMBIT
                    </h1>
                    <p className="text-lg text-muted mt-3">
                        Unlock benefits, experiences & access to your team.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Plans */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-5"
                    >
                        <h2 className="text-2xl font-bold">Choose Plan</h2>
                        <div className="space-y-4">
                            {membershipPlans.map((plan) => {
                                const Icon = plan.icon;
                                const active = selectedPlan?.id === plan.id;
                                return (
                                    <div
                                        key={plan.id}
                                        onClick={() => handlePlanSelect(plan)}
                                        className={`glass-base rounded-2xl p-6 cursor-pointer transition-all duration-320 border-2 ${active
                                                ? "border-primary bg-primary/5 scale-[1.02]"
                                                : "border-transparent hover:border-primary/40"
                                            } ${plan.popular ? "ring-2 ring-primary/40" : ""}`}
                                    >
                                        {plan.popular && (
                                            <div className="badge-glass bg-primary/20 text-primary mb-3">
                                                Most Popular
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`p-3 rounded-xl ${plan.color} shadow-liquid`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">{plan.name}</h3>
                                                    <p className="text-sm text-muted">
                                                        {plan.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">
                                                    ${plan.price}
                                                </div>
                                                <div className="text-xs text-muted">
                                                    / {plan.period}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {plan.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <Check className="w-4 h-4 text-success" />
                                                    <span className="text-sm">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-5"
                    >
                        <h2 className="text-2xl font-bold">Member Info</h2>
                        <form
                            onSubmit={handleSubmit}
                            className="glass-base rounded-2xl p-6 space-y-6"
                        >
                            {selectedPlan && (
                                <div className="bg-primary/10 rounded-xl p-4 mb-2">
                                    <div className="flex justify-between items-center">
                                        <span>{selectedPlan.name}</span>
                                        <span className="font-bold text-primary">
                                            ${selectedPlan.price}/{selectedPlan.period}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="grid md:grid-cols-2 gap-4">
                                {["firstName", "lastName"].map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm mb-2 capitalize">
                                            {field.replace(/([A-Z])/g, " $1")} *
                                        </label>
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            className="input-glass"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="input-glass"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="input-glass"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-2">Birth Date</label>
                                    <input
                                        type="date"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleInputChange}
                                        className="input-glass"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-2">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="input-glass"
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 transition-colors duration-320"
                                disabled={!selectedPlan}
                            >
                                {selectedPlan
                                    ? `Join $${selectedPlan.price}/${selectedPlan.period}`
                                    : "Select a Plan"}
                            </Button>
                            <p className="text-xs text-muted text-center">
                                By joining, you agree to our Terms & Privacy.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Membership;
