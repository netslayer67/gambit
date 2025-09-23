import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('');
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    if (!isOpen) return null;

    const roles = [
        {
            id: 'fan',
            label: 'Fan/User',
            icon: User,
            description: 'Access tickets, merchandise, and gallery',
            color: 'bg-blue-500'
        },
        {
            id: 'team',
            label: 'Team Member',
            icon: Users,
            description: 'Access team dashboard and internal tools',
            color: 'bg-green-500'
        },
        {
            id: 'admin',
            label: 'Administrator',
            icon: Shield,
            description: 'Full access to management tools',
            color: 'bg-red-500'
        }
    ];

    const handleLogin = () => {
        if (!selectedRole) {
            toast({
                title: "Please select a role",
                description: "Choose your access level to continue",
                variant: "destructive"
            });
            return;
        }

        // Mock authentication - in real app, validate credentials
        if (selectedRole === 'fan' || (credentials.username && credentials.password)) {
            onLogin(selectedRole);
            onClose();
            toast({
                title: "Login successful!",
                description: `Welcome to GH GAMBIT as ${selectedRole}`,
            });
        } else {
            toast({
                title: "Please enter credentials",
                description: "Username and password are required",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-overlay-dark backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative glass-base rounded-2xl p-6 w-full max-w-md"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Login to GH GAMBIT</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-muted/20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold">Select Your Role</h3>
                    {roles.map((role) => {
                        const IconComponent = role.icon;
                        return (
                            <button
                                key={role.id}
                                onClick={() => setSelectedRole(role.id)}
                                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${selectedRole === role.id
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg ${role.color}`}>
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-semibold">{role.label}</div>
                                        <div className="text-sm text-pretty">{role.description}</div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedRole && selectedRole !== 'fan' && (
                    <div className="space-y-4 mb-6">
                        <h3 className="text-lg font-semibold">Credentials</h3>
                        <input
                            type="text"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="input-glass"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="input-glass"
                        />
                    </div>
                )}

                <div className="flex space-x-3">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} className="flex-1">
                        Login
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;