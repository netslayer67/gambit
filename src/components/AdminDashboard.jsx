import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, ShoppingBag, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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

    useEffect(() => {
        // Load admin data from localStorage
        const savedGames = localStorage.getItem('ghgambit_games');
        const savedProducts = localStorage.getItem('ghgambit_products');

        setAdminData(prev => ({
            ...prev,
            games: savedGames ? JSON.parse(savedGames) : [],
            products: savedProducts ? JSON.parse(savedProducts) : []
        }));
    }, []);

    const tabs = [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'games', label: 'Game Management', icon: Calendar },
        { id: 'products', label: 'Merchandise', icon: ShoppingBag },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const handleAddGame = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleEditGame = (gameId) => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleDeleteGame = (gameId) => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleAddProduct = () => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleEditProduct = (productId) => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const handleDeleteProduct = (productId) => {
        toast({
            title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'analytics':
                return (
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold">Analytics Overview</h3>

                        {/* Key Metrics */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Users', value: adminData.analytics.totalUsers.toLocaleString(), change: '+12%', color: 'text-green-400' },
                                { label: 'Total Sales', value: `$${adminData.analytics.totalSales.toLocaleString()}`, change: '+8%', color: 'text-green-400' },
                                { label: 'Tickets Sold', value: adminData.analytics.ticketsSold.toLocaleString(), change: '+15%', color: 'text-green-400' },
                                { label: 'Memberships', value: adminData.analytics.membershipCount.toLocaleString(), change: '+5%', color: 'text-green-400' }
                            ].map((metric, index) => (
                                <div key={index} className="glass-base rounded-xl p-6">
                                    <div className="text-2xl font-bold mb-2">{metric.value}</div>
                                    <div className="text-muted text-sm mb-1">{metric.label}</div>
                                    <div className={`text-sm ${metric.color}`}>{metric.change} from last month</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Placeholder */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">Revenue Trend</h4>
                                <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
                                    <p className="text-muted">Chart visualization would go here</p>
                                </div>
                            </div>

                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">User Growth</h4>
                                <div className="h-64 bg-muted/10 rounded-lg flex items-center justify-center">
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
                            <h3 className="text-2xl font-bold">Game Management</h3>
                            <Button onClick={handleAddGame} className="flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>Add Game</span>
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {adminData.games.map((game) => (
                                <div key={game.id} className="glass-base rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-xl font-bold">vs {game.opponent}</h4>
                                            <div className="text-muted">
                                                {new Date(game.date).toLocaleDateString()} at {game.time} • {game.venue}
                                            </div>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <div className={`badge-glass ${game.type === 'home' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {game.type}
                                                </div>
                                                <div className="badge-glass bg-primary/20 text-primary">
                                                    {game.competition}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditGame(game.id)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteGame(game.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'products':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold">Merchandise Management</h3>
                            <Button onClick={handleAddProduct} className="flex items-center space-x-2">
                                <Plus className="w-4 h-4" />
                                <span>Add Product</span>
                            </Button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {adminData.products.map((product) => (
                                <div key={product.id} className="glass-base rounded-xl p-6">
                                    <div className="aspect-square mb-4 rounded-xl overflow-hidden bg-muted/10">
                                        <img
                                            className="w-full h-full object-cover"
                                            alt={product.name}
                                            src="https://images.unsplash.com/photo-1635865165118-917ed9e20936" />
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-bold">{product.name}</h4>
                                            <p className="text-muted text-sm">{product.category}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-xl font-bold text-primary">${product.price}</div>
                                            <div className="text-muted text-sm">{product.stock} in stock</div>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product.id)} className="flex-1">
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'users':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">User Management</h3>

                        <div className="glass-base rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-xl font-bold">User Statistics</h4>
                                <Button onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                                    Export Users
                                </Button>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { label: 'Total Users', value: '1,250', description: 'Registered users' },
                                    { label: 'Active Members', value: '156', description: 'Paid memberships' },
                                    { label: 'Team Members', value: '25', description: 'Internal team access' }
                                ].map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                                        <div className="font-semibold mb-1">{stat.label}</div>
                                        <div className="text-muted text-sm">{stat.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-base rounded-xl p-6">
                            <h4 className="text-xl font-bold mb-4">Recent User Activity</h4>
                            <div className="space-y-4">
                                {[
                                    { user: 'John Doe', action: 'Purchased VIP membership', time: '2 hours ago' },
                                    { user: 'Sarah Smith', action: 'Bought game tickets', time: '4 hours ago' },
                                    { user: 'Mike Johnson', action: 'Joined fan club', time: '6 hours ago' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                                        <div>
                                            <div className="font-semibold">{activity.user}</div>
                                            <div className="text-muted text-sm">{activity.action}</div>
                                        </div>
                                        <div className="text-muted text-sm">{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold">System Settings</h3>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">General Settings</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Site Title</label>
                                        <input type="text" defaultValue="GH GAMBIT Basketball Club" className="input-glass" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Contact Email</label>
                                        <input type="email" defaultValue="info@ghgambit.com" className="input-glass" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                        <input type="tel" defaultValue="+1 (555) 123-4567" className="input-glass" />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-base rounded-xl p-6">
                                <h4 className="text-xl font-bold mb-4">Payment Settings</h4>
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
                                        <input type="number" defaultValue="8.5" className="input-glass" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button onClick={() => toast({ title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀" })}>
                                Save Settings
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
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Admin Dashboard</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Complete control over your GH GAMBIT platform. Manage games, products, users, and analytics.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
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
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="glass-base rounded-2xl p-8"
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </section>
    );
};

export default AdminDashboard;