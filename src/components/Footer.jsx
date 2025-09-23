import React from "react";
import { motion } from "framer-motion";
import {
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const Footer = () => {
    const socialLinks = [
        { icon: Instagram, href: "#", label: "Instagram" },
        { icon: Twitter, href: "#", label: "Twitter" },
        { icon: Facebook, href: "#", label: "Facebook" },
        { icon: Youtube, href: "#", label: "YouTube" },
    ];

    const footerLinks = [
        {
            title: "Team",
            links: [
                { label: "About Us", href: "#" },
                { label: "Players", href: "#" },
                { label: "Coaching Staff", href: "#" },
                { label: "History", href: "#" },
            ],
        },
        {
            title: "Fans",
            links: [
                { label: "Schedule", href: "#" },
                { label: "Tickets", href: "#" },
                { label: "Membership", href: "#" },
                { label: "Fan Zone", href: "#" },
            ],
        },
        {
            title: "Support",
            links: [
                { label: "Contact Us", href: "#" },
                { label: "FAQ", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
            ],
        },
    ];

    return (
        <footer className="relative overflow-hidden mt-20">
            {/* 🔮 Decorative Animated Blobs */}
            <motion.div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30"
                style={{
                    background: "radial-gradient(circle, hsl(var(--primary) / 0.25), transparent 70%)",
                }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-40 -right-40 w-[30rem] h-[30rem] rounded-full blur-3xl opacity-30"
                style={{
                    background: "radial-gradient(circle, hsl(var(--secondary) / 0.2), transparent 70%)",
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="glass-footer relative z-10">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid lg:grid-cols-4 gap-12 md:gap-8">
                        {/* 🏀 Brand Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-1"
                        >
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-liquid">
                                    <span className="text-primary-foreground font-bold text-xl">
                                        GH
                                    </span>
                                </div>
                                <div>
                                    <span className="text-2xl font-bold">GH GAMBIT</span>
                                    <p className="text-xs text-muted uppercase tracking-wider">
                                        Built Different
                                    </p>
                                </div>
                            </div>

                            <p className="text-sm md:text-base text-muted/90 mb-6 max-w-xs leading-relaxed">
                                Premium basketball club with a luxury digital ecosystem.
                                Experience the future of sports entertainment.
                            </p>

                            <div className="flex space-x-3 md:space-x-4">
                                {socialLinks.map((social, index) => {
                                    const IconComponent = social.icon;
                                    return (
                                        <a
                                            key={index}
                                            href={social.href}
                                            className="w-10 h-10 glass-base rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
                                            aria-label={social.label}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                            </div>
                        </motion.div>

                        {/* 🔗 Links */}
                        {footerLinks.map((section, index) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * (index + 1), duration: 0.6 }}
                            >
                                <span className="text-lg font-semibold mb-4 block">
                                    {section.title}
                                </span>
                                <ul className="space-y-2.5">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a
                                                href={link.href}
                                                className="text-muted hover:text-foreground transition-colors duration-300"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}

                        {/* 📞 Contact */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <span className="text-lg font-semibold mb-4 block">Contact</span>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span className="text-muted leading-snug">
                                        123 Basketball Ave <br /> Sports City, SC 12345
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span className="text-muted">+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span className="text-muted">info@ghgambit.com</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ⬇️ Bottom */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="border-t border-border pt-6 mt-12"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm">
                            <p className="text-muted">
                                © {new Date().getFullYear()} GH GAMBIT Basketball Club. All rights reserved.
                            </p>
                            <p className="text-muted">Built Different • Premium Sports Experience</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
