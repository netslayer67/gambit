import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    FileText,
    Upload,
    MessageSquare,
    Users,
    Target,
    Clock,
    MapPin,
    Send,
    Image,
    Video,
    X,
    Plus,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

// Premium transitions
const TRANSITION = { duration: 0.32, ease: [0.22, 1, 0.36, 1] };
const HOVER_SCALE = { scale: 1.02, transition: TRANSITION };
const TAP_SCALE = { scale: 0.98 };

// Security sanitizers
const sanitizeInput = (value = "", maxLength = 200) => {
    const noTags = String(value).replace(/<[^>]*>?/g, "");
    const noUrls = noTags.replace(/https?:\/\/\S+|www\.\S+/gi, "");
    const cleaned = noUrls.replace(/[\u0000-\u001F<>$`|;]/g, "");
    return cleaned.slice(0, maxLength);
};

const sanitizeKey = (str = "") =>
    String(str)
        .replace(/[^a-z0-9-_]/gi, "")
        .slice(0, 24)
        .toLowerCase();

// Premium Stat Card Component
const StatCard = memo(({ label, value, icon: Icon, color }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        whileTap={TAP_SCALE}
        className="glass-base p-5 rounded-2xl border border-white/10 relative overflow-hidden group"
    >
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{ background: `hsl(var(--${color}))` }} />

        <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl glass-overlay" style={{ background: `hsl(var(--${color}) / 0.15)` }}>
                <Icon className="w-6 h-6" style={{ color: `hsl(var(--${color}))` }} />
            </div>
            <div className="text-left">
                <div className="text-2xl font-bold" style={{ color: `hsl(var(--${color}))` }}>{value}</div>
                <div className="text-sm text-muted">{label}</div>
            </div>
        </div>

        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-320 pointer-events-none"
            style={{ background: `radial-gradient(circle at center, hsl(var(--${color})), transparent 70%)` }} />
    </motion.div>
));

// Premium Tab Button Component
const TabButton = memo(({ tab, isActive, onClick }) => {
    const Icon = tab.icon;
    return (
        <motion.button
            whileHover={HOVER_SCALE}
            whileTap={TAP_SCALE}
            onClick={() => onClick(tab.id)}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-320 relative overflow-hidden ${isActive
                    ? 'text-white'
                    : 'text-muted hover:text-foreground'
                }`}
            style={isActive ? { background: `hsl(var(--${tab.color}))` } : {}}
        >
            {isActive && (
                <div className="absolute inset-0 rounded-xl opacity-20"
                    style={{ background: `radial-gradient(circle at center, white, transparent 70%)` }} />
            )}
            <Icon className="w-5 h-5" />
            <span className="hidden sm:inline font-medium">{tab.label}</span>
        </motion.button>
    );
});

// Premium Event Card Component
const EventCard = memo(({ event, color }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        className="glass-base rounded-2xl p-5 border border-white/10 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full overflow-hidden opacity-10">
            <div className="absolute inset-0" style={{ background: `hsl(var(--${color}))` }} />
        </div>

        <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold">{event.title}</h3>
            <div className="badge-glass text-xs px-3 py-1 rounded-full" style={{ background: `hsl(var(--${color}) / 0.15)`, color: `hsl(var(--${color}))` }}>
                {event.type}
            </div>
        </div>

        <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted">
                <Calendar className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
                <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
                <Clock className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
                <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted">
                <MapPin className="w-4 h-4" style={{ color: `hsl(var(--${color}))` }} />
                <span>{event.location}</span>
            </div>
        </div>

        {event.notes && (
            <div className="mt-3 p-3 rounded-xl text-sm" style={{ background: `hsl(var(--${color}) / 0.08)` }}>
                {event.notes}
            </div>
        )}
    </motion.div>
));

// Premium Document Card Component
const DocumentCard = memo(({ doc, color }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        className="glass-base rounded-2xl p-5 border border-white/10 relative overflow-hidden group"
    >
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{ background: `hsl(var(--${color}))` }} />

        <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-xl glass-overlay" style={{ background: `hsl(var(--${color}) / 0.15)` }}>
                <FileText className="w-6 h-6" style={{ color: `hsl(var(--${color}))` }} />
            </div>
            <div>
                <h3 className="font-bold text-lg">{doc.title}</h3>
                <p className="text-sm text-muted">{doc.type} • {doc.size}</p>
            </div>
        </div>

        <div className="text-sm text-muted mb-4">
            Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
        </div>

        <Button
            variant="ghost"
            className="w-full justify-start gap-2 rounded-xl"
            style={{ background: `hsl(var(--${color}) / 0.1)`, color: `hsl(var(--${color}))` }}
        >
            <Download className="w-4 h-4" />
            <span>Download</span>
        </Button>
    </motion.div>
));

// Premium Message Component
const Message = memo(({ msg, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANSITION}
        className="glass-base rounded-2xl p-4 border border-white/10"
    >
        <div className="flex justify-between items-start mb-2">
            <div className="font-bold" style={{ color: `hsl(var(--${color}))` }}>{msg.author}</div>
            <div className="text-xs text-muted">{msg.timestamp}</div>
        </div>
        <p className="text-muted">{msg.message}</p>
    </motion.div>
));

// Premium Upload Area Component
const UploadArea = memo(({ type, icon: Icon, color, onClick }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        whileTap={TAP_SCALE}
        onClick={onClick}
        className="glass-base rounded-2xl p-6 border-2 border-dashed cursor-pointer flex flex-col items-center justify-center text-center group"
        style={{ borderColor: `hsl(var(--${color}) / 0.3)` }}
    >
        <div className="p-4 rounded-full mb-4 glass-overlay" style={{ background: `hsl(var(--${color}) / 0.15)` }}>
            <Icon className="w-8 h-8" style={{ color: `hsl(var(--${color}))` }} />
        </div>
        <h3 className="font-bold text-lg mb-2">Upload {type}</h3>
        <p className="text-sm text-muted mb-4 max-w-xs">Drag & drop or click to browse</p>
        <Button
            variant="ghost"
            className="rounded-xl group-hover:scale-105 transition-transform duration-320"
            style={{ background: `hsl(var(--${color}) / 0.1)`, color: `hsl(var(--${color}))` }}
        >
            Choose {type}
        </Button>
    </motion.div>
));

const TeamDashboard = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const [teamData, setTeamData] = useState({
        schedule: [],
        documents: [],
        messages: [],
        uploads: []
    });

    // Initialize data
    useEffect(() => {
        const savedData = localStorage.getItem('ghgambit_team_data');
        if (savedData) {
            setTeamData(JSON.parse(savedData));
        } else {
            const mockData = {
                schedule: [
                    {
                        id: 1,
                        type: 'practice',
                        title: 'Team Practice',
                        date: '2024-01-16',
                        time: '18:00',
                        location: 'Training Facility',
                        notes: 'Focus on defensive strategies'
                    },
                    {
                        id: 2,
                        type: 'strategy',
                        title: 'Strategy Meeting',
                        date: '2024-01-17',
                        time: '15:00',
                        location: 'Conference Room',
                        notes: 'Review upcoming game plan'
                    }
                ],
                documents: [
                    {
                        id: 1,
                        title: 'Playbook 2024',
                        type: 'PDF',
                        uploadDate: '2024-01-10',
                        size: '2.5 MB'
                    },
                    {
                        id: 2,
                        title: 'Training Schedule',
                        type: 'DOC',
                        uploadDate: '2024-01-08',
                        size: '1.2 MB'
                    }
                ],
                messages: [
                    {
                        id: 1,
                        author: 'Coach Johnson',
                        message: 'Great practice today team! Keep up the energy for tomorrow\'s game.',
                        timestamp: '2024-01-15 20:30'
                    },
                    {
                        id: 2,
                        author: 'Marcus',
                        message: 'Thanks coach! Ready to bring our A-game.',
                        timestamp: '2024-01-15 20:45'
                    }
                ],
                uploads: []
            };
            setTeamData(mockData);
            localStorage.setItem('ghgambit_team_data', JSON.stringify(mockData));
        }
    }, []);

    // Tabs with colors
    const tabs = useMemo(() => [
        { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'primary' },
        { id: 'documents', label: 'Documents', icon: FileText, color: 'gold' },
        { id: 'communication', label: 'Team Chat', icon: MessageSquare, color: 'velvet' },
        { id: 'content', label: 'Content', icon: Upload, color: 'platinum' }
    ], []);

    // Stats with colors
    const stats = useMemo(() => [
        { label: 'Next Practice', value: 'Tomorrow 6PM', icon: Calendar, color: 'primary' },
        { label: 'Team Members', value: '25', icon: Users, color: 'gold' },
        { label: 'Win Rate', value: '78%', icon: Target, color: 'velvet' },
        { label: 'Documents', value: teamData.documents.length, icon: FileText, color: 'platinum' }
    ], [teamData.documents.length]);

    // Event handlers
    const handleFileUpload = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "File upload will be available in the next update."
        });
    }, []);

    const handleSendMessage = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Team chat will be available in the next update."
        });
    }, []);

    const handleAddEvent = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Event scheduling will be available in the next update."
        });
    }, []);

    const handlePostUpdate = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Content posting will be available in the next update."
        });
    }, []);

    // Tab content renderer
    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case 'schedule':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Training Schedule</h2>
                            <Button
                                onClick={handleAddEvent}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--primary))` }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Event</span>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {teamData.schedule.map((event) => (
                                <EventCard key={event.id} event={event} color="primary" />
                            ))}
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Team Documents</h2>
                            <Button
                                onClick={handleFileUpload}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--gold))` }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Upload</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamData.documents.map((doc) => (
                                <DocumentCard key={doc.id} doc={doc} color="gold" />
                            ))}
                        </div>
                    </div>
                );

            case 'communication':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Team Communication</h2>

                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {teamData.messages.map((msg) => (
                                <Message key={msg.id} msg={msg} color="velvet" />
                            ))}
                        </div>

                        <div className="glass-base rounded-2xl p-4 flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="input-glass flex-1"
                                onChange={(e) => e.target.value = sanitizeInput(e.target.value)}
                            />
                            <Button
                                onClick={handleSendMessage}
                                className="p-3 rounded-xl"
                                style={{ background: `hsl(var(--velvet))` }}
                            >
                                <Send className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                );

            case 'content':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Content Upload</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadArea
                                type="Photos"
                                icon={Image}
                                color="platinum"
                                onClick={handleFileUpload}
                            />
                            <UploadArea
                                type="Videos"
                                icon={Video}
                                color="primary"
                                onClick={handleFileUpload}
                            />
                        </div>

                        <div className="glass-base rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">Behind the Scenes</h3>
                            <textarea
                                placeholder="Share what's happening behind the scenes..."
                                rows={4}
                                className="input-glass w-full mb-4"
                                onChange={(e) => e.target.value = sanitizeInput(e.target.value, 500)}
                            />
                            <Button
                                onClick={handlePostUpdate}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--platinum))` }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Post Update</span>
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }, [activeTab, teamData, handleAddEvent, handleFileUpload, handleSendMessage, handlePostUpdate]);

    return (
        <section className="relative min-h-screen py-12 px-4 overflow-hidden">
            {/* Premium Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background backdrop-blur-3xl" />

                {/* Token-based animated blobs */}
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl transform-gpu animate-pulse-slow"
                    style={{ background: `hsl(var(--primary) / 0.08)` }}
                    aria-hidden
                />
                <div
                    className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl transform-gpu animate-pulse-slow delay-1000"
                    style={{ background: `hsl(var(--gold) / 0.06)` }}
                    aria-hidden
                />
                <div
                    className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full blur-3xl transform-gpu animate-pulse-slow delay-2000"
                    style={{ background: `hsl(var(--velvet) / 0.05)` }}
                    aria-hidden
                />
            </div>

            <div className="relative z-10 container mx-auto max-w-6xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={TRANSITION}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-gold">
                            Team Dashboard
                        </span>
                    </h1>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Your exclusive team hub for schedules, documents, and communication.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.2 }}
                    className="glass-base rounded-2xl p-2 mb-8"
                >
                    <div className="flex flex-wrap justify-center gap-2">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                tab={tab}
                                isActive={activeTab === tab.id}
                                onClick={setActiveTab}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.3 }}
                    className="glass-base rounded-2xl p-6"
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(TeamDashboard);