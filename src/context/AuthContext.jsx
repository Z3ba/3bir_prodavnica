import { createContext, useContext, useMemo, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '../api';

const AuthContext = createContext(null);

const getSavedUser = () => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
};

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(getSavedUser);

    const login = async (email, password) => {
        const user = await loginUser({ email: email.trim().toLowerCase(), password });
        localStorage.setItem('userInfo', JSON.stringify(user));
        setUserInfo(user);
        return user;
    };

    const register = async (name, email, password) => {
        const user = await registerUser({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
        });
        localStorage.setItem('userInfo', JSON.stringify(user));
        setUserInfo(user);
        return user;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            // Local logout should still work if the server is unavailable.
        }

        localStorage.removeItem('userInfo');
        setUserInfo(null);
    };

    const value = useMemo(() => ({
        userInfo,
        login,
        register,
        logout,
    }), [userInfo]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);