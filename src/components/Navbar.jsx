import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    LogOut,
    Shield,
    Users,
    PlayCircle,
    Calendar,
    ShoppingBag,
    Image as Gallery,
    Newspaper,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/LoginModal";
import { toast } from "@/components/ui/use-toast";

const Navbar = ({
    currentView,
    setCurrentView,
    userRole,
    isAuthenticated,
    onLogin,
    onLogout,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    const navItems = [
        { id: "home", label: "Home", icon: PlayCircle },
        { id: "schedule", label: "Schedule", icon: Calendar },
        { id: "tickets", label: "Tickets", icon: Star },
        { id: "merchandise", label: "Store", icon: ShoppingBag },
        { id: "gallery", label: "Gallery", icon: Gallery },
        { id: "news", label: "News", icon: Newspaper },
        { id: "membership", label: "Membership", icon: Users },
    ];

    const handleNavClick = (viewId) => {
        setCurrentView(viewId);
        setIsMenuOpen(false);
    };

    const handleLoginClick = () => setShowLoginModal(true);

    const handleLogoutClick = () => {
        onLogout();
        toast({
            title: "✅ Logout berhasil",
            description: "Sampai jumpa lagi!",
        });
    };

    const getRoleIcon = () => {
        switch (userRole) {
            case "admin":
                return <Shield className="w-4 h-4" />;
            case "team":
                return <Users className="w-4 h-4" />;
            default:
                return <User className="w-4 h-4" />;
        }
    };

    const getDashboardView = () =>
        userRole === "admin" ? "admin-dashboard" : "team-dashboard";

    return (
        <>
            {/* === Desktop / Tablet Navbar === */}
            <nav className="navbar-glass">
                {/* Left: Logo */}
                <motion.div
                    className="flex items-center space-x-2 cursor-pointer"
                    onClick={() => handleNavClick("home")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-liquid">
                        <span className="text-primary-foreground font-bold text-lg">GH</span>
                    </div>
                    <div className="hidden md:block">
                        <h1 className="text-xl font-bold text-foreground tracking-wide">
                            GH GAMBIT
                        </h1>
                        <p className="text-xs text-muted uppercase tracking-wider">
                            Built Different
                        </p>
                    </div>
                </motion.div>

                {/* Middle: Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-6">
                    {navItems.map((item) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleNavClick(item.id)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.96 }}
                            className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${currentView === item.id
                                    ? "bg-primary text-primary-foreground shadow-liquid"
                                    : "text-foreground hover:text-primary hover:bg-muted/20"
                                }`}
                        >
                            {item.label}
                            {currentView === item.id && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-foreground rounded-full"
                                />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* Right: User Actions */}
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-2">
                            {(userRole === "team" || userRole === "admin") && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleNavClick(getDashboardView())}
                                    className="hidden md:flex items-center space-x-2"
                                >
                                    {getRoleIcon()}
                                    <span>Dashboard</span>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogoutClick}
                                className="flex items-center space-x-2 hover:text-error"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden md:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            onClick={handleLoginClick}
                            className="btn-glass flex items-center space-x-2"
                        >
                            <User className="w-4 h-4" />
                            <span>Login</span>
                        </Button>
                    )}

                    {/* Mobile Trigger → Bottom Sheet */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="lg:hidden btn-glass p-2 rounded-xl"
                    >
                        <span className="text-sm font-medium">Menu</span>
                    </button>
                </div>
            </nav>

            {/* === Mobile Bottom Sheet Menu === */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex flex-col glass-base backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">Navigation</h2>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-glass px-3 py-1"
                            >
                                Close
                            </button>
                        </div>

                        {/* Nav Items */}
                        <div className="flex-1 overflow-y-auto p-6 grid gap-4">
                            {navItems.map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => handleNavClick(id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentView === id
                                            ? "bg-primary text-primary-foreground shadow-liquid"
                                            : "text-foreground hover:text-primary hover:bg-muted/20"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-base font-medium">{label}</span>
                                </button>
                            ))}

                            {isAuthenticated &&
                                (userRole === "team" || userRole === "admin") && (
                                    <button
                                        onClick={() => handleNavClick(getDashboardView())}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:text-primary hover:bg-muted/20"
                                    >
                                        {getRoleIcon()}
                                        <span>Dashboard</span>
                                    </button>
                                )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={onLogin}
            />
        </>
    );
};

export default Navbar;
