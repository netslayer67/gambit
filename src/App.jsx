import React from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import SchedulePage from '@/pages/SchedulePage';
import TicketingPage from '@/pages/TicketingPage';
import MerchandisePage from '@/pages/MerchandisePage';
import GalleryPage from '@/pages/GalleryPage';
import NewsPage from '@/pages/NewsPage';
import MembershipPage from '@/pages/MembershipPage';
import TeamDashboardPage from '@/pages/TeamDashboardPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import { Toaster } from '@/components/ui/toaster';
import { useAppStore } from '@/store/appStore';

function App() {
    const { currentView, userRole, isAuthenticated } = useAppStore();

    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <HomePage />;
            case 'schedule':
                return <SchedulePage />;
            case 'tickets':
                return <TicketingPage />;
            case 'merchandise':
                return <MerchandisePage />;
            case 'gallery':
                return <GalleryPage />;
            case 'news':
                return <NewsPage />;
            case 'membership':
                return <MembershipPage />;
            case 'team-dashboard':
                return isAuthenticated && userRole === 'team' ? <TeamDashboardPage /> : <HomePage />;
            case 'admin-dashboard':
                return isAuthenticated && userRole === 'admin' ? <AdminDashboardPage /> : <HomePage />;
            default:
                return <HomePage />;
        }
    };

    return (
        <>
            <Helmet>
                <title>GH GAMBIT Basketball Club - Built Different</title>
                <meta name="description" content="GH GAMBIT Basketball Club - Premium basketball club with luxury digital ecosystem. Built Different." />
            </Helmet>

            <MainLayout>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </MainLayout>

            <Toaster />
        </>
    );
}

export default App;