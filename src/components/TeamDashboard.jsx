import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Upload, MessageSquare, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TeamDashboard = () => {
    const [activeTab, setActiveTab] = useState('schedule');
    const [teamData, setTeamData] = useState({
        schedule: [],
        documents: [],
        messages: [],
        uploads: []
    });

    useEffect(() => {
        // Load team data from localStorage
        const savedData = localStorage.getItem('ghgambit_team_data');
        if (savedData) {
            setTeamData(JSON.parse(savedData));
        } else {
            // Initialize with mock data
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

    const tabs = [
        { id: 'schedule', label: 'Schedule & Training', icon: Calendar },
        { id: 'documents', label: 'Team Documents', icon: FileText },
        { id: 'communication', label: 'Team Chat', icon: MessageSquare },
        { id: 'content', label: 'Content Upload', icon: Upload }
    ];

    const handleFileUpload = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleSendMessage = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'schedule':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Training Schedule</h3>
                            <Button onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                                Add Event
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {teamData.schedule.map((event) => (
                                <div key={event.id} className="glass-base rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xl font-bold">{event.title}</h4>
                                        <div className={`badge-glass ${event.type === 'practice' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                            }`}>
                                            {event.type}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4 text-muted">
                                        <div>
                                            <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <strong>Time:</strong> {event.time}
                                        </div>
                                        <div>
                                            <strong>Location:</strong> {event.location}
                                        </div>
                                    </div>

                                    {event.notes && (
                                        <div className="mt-3 p-3 bg-muted/10 rounded-lg">
                                            <strong>Notes:</strong> {event.notes}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'documents':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Team Documents</h3>
                            <Button onClick={handleFileUpload}>
                                Upload Document
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            {teamData.documents.map((doc) => (
                                <div key={doc.id} className="glass-base rounded-xl p-6">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <FileText className="w-8 h-8 text-primary" />
                                        <div>
                                            <h4 className="font-bold">{doc.title}</h4>
                                            <p className="text-muted text-sm">{doc.type} • {doc.size}</p>
                                        </div>
                                    </div>

                                    <div className="text-muted text-sm mb-4">
                                        Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                                    </div>

                                    <Button variant="outline" size="sm" className="w-full">
                                        Download
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'communication':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Team Communication</h3>

                        <div className="glass-base rounded-xl p-6 space-y-4 max-h-96 overflow-y-auto">
                            {teamData.messages.map((msg) => (
                                <div key={msg.id} className="border-b border-border pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{msg.author}</span>
                                        <span className="text-muted text-sm">{msg.timestamp}</span>
                                    </div>
                                    <p className="text-muted">{msg.message}</p>
                                </div>
                            ))}
                        </div>

                        <div className="glass-base rounded-xl p-4">
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="input-glass flex-1"
                                />
                                <Button onClick={handleSendMessage}>
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 'content':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">Content Upload</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">Upload Photos</h4>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                                    <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
                                    <p className="text-muted mb-4">Drag & drop photos or click to browse</p>
                                    <Button onClick={handleFileUpload}>
                                        Choose Photos
                                    </Button>
                                </div>
                            </div>

                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">Upload Videos</h4>
                                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                                    <Upload className="w-12 h-12 text-muted mx-auto mb-4" />
                                    <p className="text-muted mb-4">Drag & drop videos or click to browse</p>
                                    <Button onClick={handleFileUpload}>
                                        Choose Videos
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-base rounded-xl p-6">
                            <h4 className="text-xl font-bold mb-4">Behind the Scenes Content</h4>
                            <textarea
                                placeholder="Share what's happening behind the scenes..."
                                rows={4}
                                className="input-glass mb-4"
                            />
                            <Button onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                                Post Update
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <section className="py-20 px-4">
            <div className="container mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Team Dashboard</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Welcome to your private team space. Access training schedules, documents, and team communication.
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid md:grid-cols-4 gap-6 mb-12"
                >
                    {[
                        { label: 'Next Practice', value: 'Tomorrow 6PM', icon: Calendar },
                        { label: 'Team Members', value: '25', icon: Users },
                        { label: 'Win Rate', value: '78%', icon: Target },
                        { label: 'Documents', value: teamData.documents.length, icon: FileText }
                    ].map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <div key={index} className="glass-base rounded-xl p-6 text-center">
                                <IconComponent className="w-8 h-8 text-primary mx-auto mb-3" />
                                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                                <div className="text-muted text-sm">{stat.label}</div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="glass-base rounded-2xl p-2 mb-8"
                >
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                                            ? 'bg-primary text-primary-foreground'
                                            : 'hover:bg-muted/20'
                                        }`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                    <span className="hidden md:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="glass-base rounded-2xl p-8"
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </section>
    );
};

export default TeamDashboard;