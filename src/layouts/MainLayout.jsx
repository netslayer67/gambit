import React, { useEffect, useState } from 'react';
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

    const [navHeight, setNavHeight] = useState(0);

    useEffect(() => {
        const nav = document.querySelector('nav');
        if (nav) setNavHeight(nav.offsetHeight);

        const handleResize = () => {
            if (nav) setNavHeight(nav.offsetHeight);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                <main className="relative" style={{ paddingTop: navHeight }}>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default MainLayout;
