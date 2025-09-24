import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Mail,
    Phone,
    MapPin,
    Send,
    ShieldCheck,
    Command
} from 'lucide-react';

// -----------------------------
// Tiny helpers & tokens
// -----------------------------
const t320 = { transitionDuration: '320ms', transitionTimingFunction: 'cubic-bezier(.2,.9,.3,1)' };

// Lightweight client-side sanitizer for footer inputs (NOT a replacement for server-side checks)
const sanitizeInput = (val = '') =>
    String(val)
        .replace(/<[^>]*>?/gm, '') // strip tags
        .replace(/(http|https):\/\/[^\s]+/gi, '') // strip urls
        .replace(/javascript:\s*[^\s]+/gi, '') // strip javascript: links
        .slice(0, 240)
        .trim();

// Very small email-ish validator
const looksLikeEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// -----------------------------
// Small presentational components (memoized)
// -----------------------------
const SocialButton = React.memo(({ Icon, label, href, compact }) => (
    <motion.a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={label}
        whileHover={{ scale: compact ? 1.06 : 1.08, rotate: compact ? 0 : 6 }}
        transition={t320}
        className={`glass-base rounded-xl ${compact ? 'p-2 w-10 h-10' : 'p-3 w-12 h-12'} flex items-center justify-center`}
        style={{ ...t320 }}
    >
        <Icon className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
    </motion.a>
));

const LinksColumn = React.memo(({ title, links }) => (
    <div>
        <div className="text-sm font-semibold mb-3">{title}</div>
        <ul className="space-y-2">
            {links.map((l, i) => (
                <li key={i}>
                    <a className="text-muted hover:text-foreground transition-colors duration-300 text-sm" href={l.href}>
                        {l.label}
                    </a>
                </li>
            ))}
        </ul>
    </div>
));

// -----------------------------
// Main Footer
// -----------------------------
export default function Footer() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null); // null | 'ok' | 'error'
    const [compact, setCompact] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const onResize = () => setCompact(window.innerWidth < 640);
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

    const social = useMemo(
        () => [
            { icon: Instagram, href: '#', label: 'Instagram' },
            { icon: Twitter, href: '#', label: 'Twitter' },
            { icon: Facebook, href: '#', label: 'Facebook' },
            { icon: Youtube, href: '#', label: 'YouTube' }
        ],
        []
    );

    const footerLinks = useMemo(
        () => [
            {
                title: 'Team',
                links: [
                    { label: 'About', href: '#' },
                    { label: 'Players', href: '#' },
                    { label: 'Coaches', href: '#' },
                    { label: 'History', href: '#' }
                ]
            },
            {
                title: 'Fans',
                links: [
                    { label: 'Schedule', href: '#' },
                    { label: 'Tickets', href: '#' },
                    { label: 'Membership', href: '#' },
                    { label: 'Fan Zone', href: '#' }
                ]
            },
            {
                title: 'Support',
                links: [
                    { label: 'Contact', href: '#' },
                    { label: 'FAQ', href: '#' },
                    { label: 'Privacy', href: '#' },
                    { label: 'Terms', href: '#' }
                ]
            }
        ],
        []
    );

    // handle newsletter subscribe (client side) — sanitize and basic checks only
    const onSubscribe = useCallback(
        (e) => {
            e.preventDefault();
            const raw = sanitizeInput(email);
            if (!raw || !looksLikeEmail(raw)) {
                setStatus('error');
                setTimeout(() => setStatus(null), 2200);
                return;
            }
            // simulate lightweight optimistic UX
            setStatus('ok');
            setEmail('');
            setTimeout(() => setStatus(null), 2200);

            // NOTE: replace this with real API call. Do NOT rely on client-only for security.
        },
        [email]
    );

    return (
        <footer className="relative overflow-hidden mt-20">
            {/* blobs */}
            <motion.div
                aria-hidden
                className="absolute -top-28 -left-28 w-80 h-80 rounded-full blur-3xl opacity-24"
                style={{ background: 'radial-gradient(circle, hsl(var(--primary)/0.24), transparent 70%)' }}
                animate={!reduceMotion ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.div
                aria-hidden
                className="absolute -bottom-36 -right-36 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-18"
                style={{ background: 'radial-gradient(circle, hsl(var(--gold)/0.22), transparent 70%)' }}
                animate={!reduceMotion ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="glass-footer relative z-10">
                <div className="container mx-auto px-4 py-10 md:py-14">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Brand */}
                        <div className="md:col-span-4">
                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-gradient-start to-gold rounded-2xl flex items-center justify-center shadow-liquid">
                                        <span className="text-primary-foreground font-bold">GH</span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">GH GAMBIT</div>
                                        <div className="text-xs text-muted uppercase tracking-wider">Built Different</div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted max-w-xs leading-relaxed">Premium basketball club. Clean UX, fast pages, and a luxe digital experience.
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    {social.map((s, i) => (
                                        <SocialButton key={i} Icon={s.icon} href={s.href} label={s.label} compact={compact} />
                                    ))}
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Secure & privacy-focused. We never sell your data.</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Links */}
                        <div className="md:col-span-5 md:col-start-5 md:col-end-10 grid grid-cols-2 md:grid-cols-3 gap-6">
                            {footerLinks.map((col) => (
                                <motion.div key={col.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
                                    <LinksColumn title={col.title} links={col.links} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Newsletter / Contact */}
                        <div className="md:col-span-3">
                            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                                <div className="text-sm font-semibold mb-3">Stay informed</div>

                                <form onSubmit={onSubscribe} className="flex gap-2">
                                    <label htmlFor="footer-email" className="sr-only">Email</label>
                                    <input
                                        id="footer-email"
                                        inputMode="email"
                                        placeholder="you@coolmail.com"
                                        value={email}
                                        onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                                        className="input-glass flex-1"
                                        maxLength={240}
                                        aria-invalid={status === 'error'}
                                    />
                                    <button type="submit" aria-label="subscribe" className="btn-glass rounded-xl flex items-center gap-2 px-3">
                                        <Send className="w-4 h-4" />
                                        <span className={`text-sm ${compact ? 'hidden' : ''}`}>Subscribe</span>
                                    </button>
                                </form>

                                <div className="mt-3 text-xs">
                                    {status === 'ok' && <div className="text-sm text-success">Thanks — check your inbox.</div>}
                                    {status === 'error' && <div className="text-sm text-warning">Please enter a valid email (no links or scripts).</div>}
                                </div>

                                <div className="mt-6 text-sm text-muted space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-primary mt-1" />
                                        <div>123 Basketball Ave, Sports City</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-primary" />
                                        <div>+1 (555) 123-4567</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-primary" />
                                        <div>info@ghgambit.com</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* bottom */}
                    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12, duration: 0.45 }} className="border-t border-border pt-6 mt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
                            <div className="text-muted">© {new Date().getFullYear()} GH GAMBIT. All rights reserved.</div>
                            <div className="flex items-center gap-4">
                                <a className="text-muted hover:text-foreground transition-colors duration-300 text-xs" href="#">Privacy</a>
                                <a className="text-muted hover:text-foreground transition-colors duration-300 text-xs" href="#">Terms</a>
                                <div className="hidden md:flex items-center gap-2 text-muted text-xs">
                                    <Command className="w-4 h-4" />
                                    <span>Built Different • Premium UX</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
}
