import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [currentView, setCurrentView] = useState('home');
    const [userRole, setUserRole] = useState('fan'); // fan, team, admin
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const savedRole = localStorage.getItem('ghgambit_user_role');
        const savedAuth = localStorage.getItem('ghgambit_authenticated');

        if (savedRole && savedAuth === 'true') {
            setUserRole(savedRole);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = (role) => {
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem('ghgambit_user_role', role);
        localStorage.setItem('ghgambit_authenticated', 'true');

        if (role === 'team') {
            setCurrentView('team-dashboard');
        } else if (role === 'admin') {
            setCurrentView('admin-dashboard');
        }
    };

    const handleLogout = () => {
        setUserRole('fan');
        setIsAuthenticated(false);
        setCurrentView('home');
        localStorage.removeItem('ghgambit_user_role');
        localStorage.removeItem('ghgambit_authenticated');
    };

    const value = {
        currentView,
        setCurrentView,
        userRole,
        isAuthenticated,
        handleLogin,
        handleLogout,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
    return useContext(AppContext);
};