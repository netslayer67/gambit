import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    User,
    Gamepad2,
    Mail,
    Sparkles,
    ShieldCheck,
    CheckCircle,
    ArrowRight,
    LoaderCircle,
    ChevronDown,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

// tiny classnames helper
const cn = (...parts) => parts.filter(Boolean).join(' ');

/**
 * sanitizeInput
 * - remove html tags
 * - strip urls
 * - remove suspicious control chars
 * - collapse whitespace
 */
const sanitizeInput = (raw = '', maxLen = 140) => {
    if (typeof raw !== 'string') return '';
    let v = raw
        .replace(/<[^>]*>/g, '') // strip tags
        .replace(/https?:\/\/[^\s]+/gi, '') // remove http urls
        .replace(/www\.[^\s]+/gi, '') // remove www
        .replace(/(javascript:|data:|mailto:)/gi, '') // remove dangerous schemes
        .replace(/[\x00-\x1F\x7F]/g, '') // control chars
        .replace(/["'`\\]/g, '') // quotes/backslash
        .replace(/\s{2,}/g, ' ') // collapse spaces
        .trim();

    if (v.length > maxLen) v = v.slice(0, maxLen);
    return v;
};

// Simple suspicious input detector to reduce obviously malicious payloads
const isSuspicious = (str = '') => {
    if (!str) return false;
    const urlLike = /https?:\/\//i;
    const longSymbolRun = /[^\w\s]{6,}/; // many special chars in a row
    const scriptLike = /<\/?(script|iframe|svg)/i;
    return urlLike.test(str) || longSymbolRun.test(str) || scriptLike.test(str) || /\.{6,}/.test(str);
};

// Minimal validators
const validators = {
    fullName: (v) => !!v && v.trim().length >= 2,
    ign: (v) => !!v && /^[A-Za-z0-9_\-]{2,20}$/.test(v),
    email: (v) => !!v && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v),
};

// Reusable Input component (token-driven styling only)
const FormInput = React.memo(
    React.forwardRef(({ icon: Icon, placeholder, type = 'text', name, value, onChange, error, ...props }, ref) => {
        return (
            <label className="relative w-full group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors duration-[320ms]" />
                <input
                    ref={ref}
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={type}
                    placeholder={placeholder}
                    autoComplete={name === 'email' ? 'email' : 'off'}
                    className={cn(
                        'input-glass pl-12 transition-all duration-[320ms] ease-[cubic-bezier(.4,0,.2,1)]',
                        error ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/40',
                        'hover:scale-[1.01]'
                    )}
                    aria-invalid={!!error}
                    {...props}
                />
                {error && <div role="status" className="mt-1 text-xs text-error">{error}</div>}
            </label>
        );
    })
);
FormInput.displayName = 'FormInput';

// Small, elegant feature row
const FeatureItem = React.memo(({ icon: Icon, title, text, tone = 'primary' }) => {
    const toneMap = {
        primary: 'text-primary bg-primary/12',
        success: 'text-success bg-success/12',
        gold: 'text-gold bg-gold/12',
    };
    return (
        <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-full shrink-0', toneMap[tone] || toneMap.primary)}>
                <Icon className="w-4 h-4" />
            </div>
            <div>
                <div className="text-sm font-semibold text-foreground">{title}</div>
                <div className="text-xs text-primary-foreground">{text}</div>
            </div>
        </div>
    );
});
FeatureItem.displayName = 'FeatureItem';

const motionBackdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.32 } },
};
const motionPanel = {
    hidden: { opacity: 0, scale: 0.985, y: 18 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, scale: 0.985, y: 18, transition: { duration: 0.32 } },
};

const LoginModal = ({ isOpen = false, onClose = () => { } }) => {
    const { toast } = useToast();

    const [form, setForm] = useState({ fullName: '', ign: '', email: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mobileInfoOpen, setMobileInfoOpen] = useState(true); // visible by default

    const change = useCallback((e) => {
        const { name, value } = e.target;
        const clean = sanitizeInput(value, name === 'email' ? 80 : 60);
        // if suspicious, silently drop the suspicious fragments
        if (isSuspicious(value) && !/\s$/.test(value)) {
            setErrors((s) => ({ ...s, [name]: 'Terdeteksi input tidak valid' }));
            setForm((p) => ({ ...p, [name]: clean }));
            return;
        }
        setErrors((s) => ({ ...s, [name]: undefined }));
        setForm((p) => ({ ...p, [name]: clean }));
    }, []);

    const validate = useCallback(() => {
        const next = {};
        if (!validators.fullName(form.fullName)) next.fullName = 'Nama minimal 2 karakter';
        if (!validators.ign(form.ign)) next.ign = 'IGN: huruf, angka, - atau _ (2-20)';
        if (!validators.email(form.email)) next.email = 'Email tidak valid';

        // final suspicious check
        if (isSuspicious(form.fullName) || isSuspicious(form.ign) || isSuspicious(form.email)) {
            toast({ title: 'Input bermasalah', description: 'Hapus tautan atau karakter aneh.', variant: 'destructive' });
            return false;
        }

        setErrors(next);
        if (Object.keys(next).length) {
            toast({ title: 'Form belum lengkap', description: 'Periksa bidang berwarna.', variant: 'destructive' });
            return false;
        }
        return true;
    }, [form, toast]);

    const submit = useCallback(
        async (e) => {
            e?.preventDefault();
            if (!validate()) return;

            setIsSubmitting(true);
            try {
                // emulate network latency — keep it short
                await new Promise((r) => setTimeout(r, 700));

                toast({ title: 'Tersimpan', description: 'Permintaan pendaftaran berhasil dikirim.', action: <CheckCircle className="text-success" /> });

                setForm({ fullName: '', ign: '', email: '' });
                onClose();
            } catch (err) {
                toast({ title: 'Gagal', description: 'Terjadi kesalahan. Coba lagi.', variant: 'destructive' });
            } finally {
                setIsSubmitting(false);
            }
        },
        [validate, toast, onClose]
    );

    const disabled = useMemo(() => isSubmitting, [isSubmitting]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 font-sans">
                    <motion.button
                        className="absolute inset-0 bg-overlay-dark backdrop-blur-md"
                        onClick={onClose}
                        aria-label="Close modal backdrop"
                        variants={motionBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    />

                    {/* decorative blobs — token driven */}
                    <div className="pointer-events-none absolute -left-20 -top-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-40 bg-[conic-gradient(hsl(var(--primary)/0.18),hsl(var(--gold)/0.12))]" />
                    <div className="pointer-events-none absolute -right-28 -bottom-24 w-[360px] h-[360px] rounded-full blur-2xl opacity-30 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--pearl)/0.12),transparent_40%)]" />

                    {/* Desktop / Tablet */}
                    <motion.div
                        className="relative glass-base w-full max-w-3xl overflow-hidden shadow-liquid hidden sm:block"
                        variants={motionPanel}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="register-title"
                    >
                        <div className="glass-overlay absolute inset-0 z-0" />

                        <div className="relative z-10 grid md:grid-cols-2">
                            <aside className="p-6 md:p-10 flex flex-col justify-between bg-onyx/40 dark:bg-onyx/70 border-r border-border/20">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-7 h-7 text-gold" />
                                        <h2 id="register-title" className="text-2xl lg:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold uppercase">
                                            Join GH Gambit
                                        </h2>
                                    </div>
                                    <p className="mt-3 text-sm text-primary-foreground max-w-xs">Daftar singkat — dapatkan spot di roster dan beasiswa.</p>

                                    <div className="mt-6 space-y-3">
                                        <FeatureItem icon={ShieldCheck} title="Official Roster" text="Terdaftar resmi di roster kompetitif." tone="primary" />
                                        <FeatureItem icon={CheckCircle} title="Scholarships" text="Beasiswa untuk talenta potensial." tone="success" />
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-border/40">
                                    <div className="text-sm text-primary-foreground">Biaya Keanggotaan</div>
                                    <div className="mt-2 text-3xl font-extrabold text-primary">Rp 200.000 <span className="text-sm font-medium text-primary-foreground">/ bulan</span></div>
                                </div>
                            </aside>

                            <section className="p-6 md:p-10">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-foreground">Form Pendaftaran Talent</h3>
                                    <button
                                        onClick={onClose}
                                        className="btn-glass p-2 rounded-full !bg-transparent hover:!bg-error/10 active:scale-95 transition duration-[320ms]"
                                        aria-label="Tutup"
                                    >
                                        <X className="w-5 h-5 text-primary-foreground hover:text-error transition-colors duration-[320ms]" />
                                    </button>
                                </div>

                                <form onSubmit={submit} className="space-y-4" noValidate>
                                    <FormInput
                                        icon={User}
                                        name="fullName"
                                        placeholder="Nama Lengkap"
                                        value={form.fullName}
                                        onChange={change}
                                        maxLength={60}
                                        error={errors.fullName}
                                        required
                                    />

                                    <FormInput
                                        icon={Gamepad2}
                                        name="ign"
                                        placeholder="In-Game Name"
                                        value={form.ign}
                                        onChange={change}
                                        maxLength={20}
                                        error={errors.ign}
                                        pattern="[A-Za-z0-9_\\-]{2,20}"
                                        required
                                    />

                                    <FormInput
                                        icon={Mail}
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={change}
                                        maxLength={80}
                                        error={errors.email}
                                        required
                                    />

                                    <div>
                                        <Button
                                            type="submit"
                                            disabled={disabled}
                                            className="w-full btn-glass bg-primary text-primary-foreground flex items-center justify-center gap-3 transition duration-[320ms] hover:shadow-lg"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center">
                                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                                    <span className="ml-2">Sedang mengirim...</span>
                                                </span>
                                            ) : (
                                                <>
                                                    <span>Apply</span>
                                                    <ArrowRight className="w-4 h-4 transform transition-transform duration-[320ms] group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </Button>

                                        <div className="text-xs text-primary-foreground text-center mt-2">Dengan mendaftar, Anda setuju ke TOS & Privacy.</div>
                                    </div>
                                </form>
                            </section>
                        </div>
                    </motion.div>

                    {/* Mobile compact panel (icon-first, compact spacing) */}
                    <motion.div
                        className="relative glass-base w-full max-h-[92vh] overflow-y-auto rounded-t-3xl sm:hidden scrollbar-hide"
                        variants={{ hidden: { y: '100%' }, visible: { y: 0, transition: { duration: 0.32 } }, exit: { y: '100%', transition: { duration: 0.32 } } }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="register-title-mobile"
                    >
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-border/40 rounded-full" />

                        <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-gold" />
                                    <h3 id="register-title-mobile" className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary uppercase">Join GH Gambit</h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button onClick={() => setMobileInfoOpen((s) => !s)} aria-expanded={mobileInfoOpen} className="p-2 rounded-md btn-glass flex items-center gap-2">
                                        <span className="text-xs text-primary-foreground">Info</span>
                                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-[320ms]', mobileInfoOpen ? 'rotate-180' : '')} />
                                    </button>

                                    <button onClick={onClose} aria-label="Close" className="p-2 rounded-md btn-glass" title="Close">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Mobile info block — visible by default to address your feedback */}
                            <AnimatePresence initial={false}>
                                {mobileInfoOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -6 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.28 } }}
                                        exit={{ opacity: 0, y: -6, transition: { duration: 0.22 } }}
                                        className="mb-3 p-3 rounded-lg bg-onyx/10 dark:bg-onyx/30 border border-border/30"
                                    >
                                        <p className="text-sm text-primary-foreground mb-2">Daftar singkat — dapatkan spot di roster resmi, akses beasiswa, dan exposure ke sponsor.</p>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                                    <div className="text-xs font-medium text-foreground">Official Roster</div>
                                                </div>
                                                <div className="text-xs text-green-400">Verified</div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-success" />
                                                    <div className="text-xs font-medium text-foreground">Scholarships</div>
                                                </div>
                                                <div className="text-xs text-warning">Free trial & seleksi</div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs text-primary-foreground">Biaya</div>
                                                    <div className="text-lg font-bold text-primary">Rp 200.000 <span className="text-xs text-primary-foreground">/ bulan</span></div>
                                                </div>
                                                <div className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-md font-semibold">Limited</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={submit} className="space-y-3" noValidate>
                                <FormInput icon={User} name="fullName" placeholder="Nama" value={form.fullName} onChange={change} maxLength={60} error={errors.fullName} required />

                                <div className="grid grid-cols-2 gap-3">
                                    <FormInput icon={Gamepad2} name="ign" placeholder="IGN" value={form.ign} onChange={change} maxLength={20} error={errors.ign} required />
                                    <FormInput icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={change} maxLength={80} error={errors.email} required />
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" className="flex-1 btn-glass bg-primary text-primary-foreground transition duration-[320ms]" disabled={isSubmitting}>
                                        {isSubmitting ? <LoaderCircle className="animate-spin w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                    </Button>

                                    <button type="button" onClick={() => setForm({ fullName: '', ign: '', email: '' })} className="btn-glass p-2 rounded-md">
                                        Clear
                                    </button>
                                </div>

                                <div className="text-xs text-primary-foreground text-center mt-1">Dengan daftar, Anda setuju ke TOS & Privacy.</div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(LoginModal);
