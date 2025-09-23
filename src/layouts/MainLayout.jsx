import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppStore } from '@/store/appStore';

const MainLayout = ({ children }) => {
    const {
        currentView,
        setCurrentView,
        userRole,
        isAuthenticated,
        handleLogin,
        handleLogout,
    } = useAppStore();

    return (
        <div className="min-h-screen bg-background">
            <div className="hero-pattern blob-bg min-h-screen">
                <Navbar
                    currentView={currentView}
                    setCurrentView={setCurrentView}
                    userRole={userRole}
                    isAuthenticated={isAuthenticated}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                />
                <main className="relative">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;