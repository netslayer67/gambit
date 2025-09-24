import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    Calendar,
    ShoppingBag,
    Settings,
    Plus,
    Edit,
    Trash2,
    TrendingUp,
    Download,
    Save,
    DollarSign,
    UserCheck,
    Activity,
    Package
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

// Premium Stat Card Component
const StatCard = memo(({ label, value, change, icon: Icon, color }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        whileTap={TAP_SCALE}
        className="glass-base rounded-2xl p-5 border border-white/10 relative overflow-hidden group"
    >
        <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg" style={{ background: `hsl(var(--${color}))` }} />

        <div className="flex items-center justify-between mb-3">
            <div className="p-3 rounded-xl glass-overlay" style={{ background: `hsl(var(--${color}) / 0.15)` }}>
                <Icon className="w-6 h-6" style={{ color: `hsl(var(--${color}))` }} />
            </div>
            <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: `hsl(var(--${color}) / 0.1)`, color: `hsl(var(--${color}))` }}>
                {change}
            </div>
        </div>

        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted">{label}</div>

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

// Premium Game Card Component
const GameCard = memo(({ game, onEdit, onDelete }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        className="glass-base rounded-2xl p-5 border border-white/10 relative overflow-hidden group"
    >
        <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full overflow-hidden opacity-10">
            <div className="absolute inset-0" style={{ background: `hsl(var(--primary))` }} />
        </div>

        <div className="flex justify-between items-start mb-3">
            <div>
                <h3 className="text-xl font-bold">vs {game.opponent}</h3>
                <div className="text-sm text-muted mt-1">
                    {new Date(game.date).toLocaleDateString()} at {game.time} • {game.venue}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(game.id)}
                    className="p-2 rounded-lg"
                    style={{ background: `hsl(var(--gold) / 0.1)`, color: `hsl(var(--gold))` }}
                >
                    <Edit className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(game.id)}
                    className="p-2 rounded-lg"
                    style={{ background: `hsl(var(--error) / 0.1)`, color: `hsl(var(--error))` }}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>

        <div className="flex gap-2 mt-3">
            <div className="badge-glass text-xs px-3 py-1 rounded-full" style={{ background: `hsl(var(--primary) / 0.15)`, color: `hsl(var(--primary))` }}>
                {game.type}
            </div>
            <div className="badge-glass text-xs px-3 py-1 rounded-full" style={{ background: `hsl(var(--gold) / 0.15)`, color: `hsl(var(--gold))` }}>
                {game.competition}
            </div>
        </div>
    </motion.div>
));

// Premium Product Card Component
const ProductCard = memo(({ product, onEdit, onDelete }) => (
    <motion.div
        whileHover={HOVER_SCALE}
        className="glass-base rounded-2xl overflow-hidden border border-white/10 relative group"
    >
        <div className="aspect-square bg-muted/10 relative overflow-hidden">
            <img
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={product.name}
                src="https://images.unsplash.com/photo-1635865165118-917ed9e20936"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted">{product.category}</p>
                </div>
                <div className="text-lg font-bold" style={{ color: `hsl(var(--primary))` }}>${product.price}</div>
            </div>

            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted">{product.stock} in stock</div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product.id)}
                        className="p-2 rounded-lg"
                        style={{ background: `hsl(var(--gold) / 0.1)`, color: `hsl(var(--gold))` }}
                    >
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="p-2 rounded-lg"
                        style={{ background: `hsl(var(--error) / 0.1)`, color: `hsl(var(--error))` }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    </motion.div>
));

// Premium Activity Item Component
const ActivityItem = memo(({ activity }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={TRANSITION}
        className="glass-base rounded-2xl p-4 border border-white/10"
    >
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `hsl(var(--velvet) / 0.15)` }}>
                    <Activity className="w-5 h-5" style={{ color: `hsl(var(--velvet))` }} />
                </div>
                <div>
                    <div className="font-semibold">{activity.user}</div>
                    <div className="text-sm text-muted">{activity.action}</div>
                </div>
            </div>
            <div className="text-sm text-muted">{activity.time}</div>
        </div>
    </motion.div>
));

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [adminData, setAdminData] = useState({
        analytics: {
            totalUsers: 1250,
            totalSales: 45680,
            ticketsSold: 892,
            membershipCount: 156
        },
        games: [],
        products: [],
        users: []
    });

    // Initialize data
    useEffect(() => {
        const savedGames = localStorage.getItem('ghgambit_games');
        const savedProducts = localStorage.getItem('ghgambit_products');

        setAdminData(prev => ({
            ...prev,
            games: savedGames ? JSON.parse(savedGames) : [],
            products: savedProducts ? JSON.parse(savedProducts) : []
        }));
    }, []);

    // Tabs with colors
    const tabs = useMemo(() => [
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'primary' },
        { id: 'games', label: 'Games', icon: Calendar, color: 'gold' },
        { id: 'products', label: 'Products', icon: ShoppingBag, color: 'platinum' },
        { id: 'users', label: 'Users', icon: Users, color: 'velvet' },
        { id: 'settings', label: 'Settings', icon: Settings, color: 'onyx' }
    ], []);

    // Stats with colors
    const stats = useMemo(() => [
        {
            label: 'Total Users',
            value: adminData.analytics.totalUsers.toLocaleString(),
            change: '+12%',
            icon: Users,
            color: 'primary'
        },
        {
            label: 'Total Sales',
            value: `$${adminData.analytics.totalSales.toLocaleString()}`,
            change: '+8%',
            icon: DollarSign,
            color: 'gold'
        },
        {
            label: 'Tickets Sold',
            value: adminData.analytics.ticketsSold.toLocaleString(),
            change: '+15%',
            icon: TrendingUp,
            color: 'platinum'
        },
        {
            label: 'Memberships',
            value: adminData.analytics.membershipCount.toLocaleString(),
            change: '+5%',
            icon: UserCheck,
            color: 'velvet'
        }
    ], [adminData.analytics]);

    // User stats
    const userStats = useMemo(() => [
        { label: 'Total Users', value: '1,250', description: 'Registered users', color: 'primary' },
        { label: 'Active Members', value: '156', description: 'Paid memberships', color: 'gold' },
        { label: 'Team Members', value: '25', description: 'Internal team access', color: 'velvet' }
    ], []);

    // Recent activities
    const activities = useMemo(() => [
        { user: 'John Doe', action: 'Purchased VIP membership', time: '2 hours ago' },
        { user: 'Sarah Smith', action: 'Bought game tickets', time: '4 hours ago' },
        { user: 'Mike Johnson', action: 'Joined fan club', time: '6 hours ago' }
    ], []);

    // Event handlers
    const handleAddGame = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Game management will be available in the next update."
        });
    }, []);

    const handleEditGame = useCallback((gameId) => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Game editing will be available in the next update."
        });
    }, []);

    const handleDeleteGame = useCallback((gameId) => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Game deletion will be available in the next update."
        });
    }, []);

    const handleAddProduct = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Product management will be available in the next update."
        });
    }, []);

    const handleEditProduct = useCallback((productId) => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Product editing will be available in the next update."
        });
    }, []);

    const handleDeleteProduct = useCallback((productId) => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Product deletion will be available in the next update."
        });
    }, []);

    const handleExportUsers = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "User export will be available in the next update."
        });
    }, []);

    const handleSaveSettings = useCallback(() => {
        toast({
            title: "🚧 Feature coming soon",
            description: "Settings saving will be available in the next update."
        });
    }, []);

    // Tab content renderer
    const renderTabContent = useCallback(() => {
        switch (activeTab) {
            case 'analytics':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Analytics Overview</h2>
                            <Button
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--primary))` }}
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Report</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-base rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold mb-4">Revenue Trend</h3>
                                <div className="h-64 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(--muted) / 0.1)` }}>
                                    <p className="text-muted">Chart visualization would go here</p>
                                </div>
                            </div>

                            <div className="glass-base rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold mb-4">User Growth</h3>
                                <div className="h-64 rounded-xl flex items-center justify-center" style={{ background: `hsl(var(--muted) / 0.1)` }}>
                                    <p className="text-muted">Chart visualization would go here</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'games':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Game Management</h2>
                            <Button
                                onClick={handleAddGame}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--gold))` }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Game</span>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {adminData.games.map((game) => (
                                <GameCard
                                    key={game.id}
                                    game={game}
                                    onEdit={handleEditGame}
                                    onDelete={handleDeleteGame}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'products':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Merchandise</h2>
                            <Button
                                onClick={handleAddProduct}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--platinum))` }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Product</span>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adminData.products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">User Management</h2>
                            <Button
                                onClick={handleExportUsers}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--velvet))` }}
                            >
                                <Download className="w-4 h-4" />
                                <span>Export Users</span>
                            </Button>
                        </div>

                        <div className="glass-base rounded-2xl p-6 border border-white/10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {userStats.map((stat, index) => (
                                    <div key={index} className="text-center p-4 rounded-xl" style={{ background: `hsl(var(--${stat.color}) / 0.08)` }}>
                                        <div className="text-3xl font-bold mb-2" style={{ color: `hsl(var(--${stat.color}))` }}>{stat.value}</div>
                                        <div className="font-semibold mb-1">{stat.label}</div>
                                        <div className="text-sm text-muted">{stat.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xl font-bold">Recent Activity</h3>
                            {activities.map((activity, index) => (
                                <ActivityItem key={index} activity={activity} />
                            ))}
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold">System Settings</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="glass-base rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold mb-4">General Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Site Title</label>
                                        <input
                                            type="text"
                                            defaultValue="GH GAMBIT Basketball Club"
                                            className="input-glass"
                                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            defaultValue="info@ghgambit.com"
                                            className="input-glass"
                                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            defaultValue="+1 (555) 123-4567"
                                            className="input-glass"
                                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-base rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold mb-4">Payment Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Payment Gateway</label>
                                        <select className="input-glass">
                                            <option>Stripe</option>
                                            <option>PayPal</option>
                                            <option>Square</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Currency</label>
                                        <select className="input-glass">
                                            <option>USD</option>
                                            <option>EUR</option>
                                            <option>GBP</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            defaultValue="8.5"
                                            className="input-glass"
                                            onChange={(e) => e.target.value = sanitizeInput(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                onClick={handleSaveSettings}
                                className="gap-2 rounded-xl"
                                style={{ background: `hsl(var(--primary))` }}
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Settings</span>
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }, [activeTab, adminData, stats, userStats, activities,
        handleAddGame, handleEditGame, handleDeleteGame,
        handleAddProduct, handleEditProduct, handleDeleteProduct,
        handleExportUsers, handleSaveSettings]);

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
                            Admin Dashboard
                        </span>
                    </h1>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        Complete control over your GH GAMBIT platform
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...TRANSITION, delay: 0.1 }}
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
                    transition={{ ...TRANSITION, delay: 0.2 }}
                    className="glass-base rounded-2xl p-6"
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </section>
    );
};

export default memo(AdminDashboard);