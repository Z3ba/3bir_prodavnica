import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const getSavedUser = () => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
};

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(getSavedUser);

    const login = (email) => {
        const normalizedEmail = email.trim().toLowerCase();
        const user = {
            email: normalizedEmail,
            name: normalizedEmail.split('@')[0],
            role: normalizedEmail === 'admin@3bir.rs' ? 'administrator' : 'korisnik',
        };

        localStorage.setItem('userInfo', JSON.stringify(user));
        setUserInfo(user);
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const value = useMemo(() => ({
        userInfo,
        login,
        logout,
    }), [userInfo]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
