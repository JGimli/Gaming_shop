import { createContext, useContext, useState } from 'react';

const SESSION_KEY = 'gaming-shop-user';
const AuthContext = createContext(null);

const getStoredUser = () => {
    const storedUser = sessionStorage.getItem(SESSION_KEY);
    if (!storedUser) {
        return null;
    }

    try {
        const user = JSON.parse(storedUser);
        if (typeof user?.username === 'string' && typeof user?.email === 'string') {
            return { username: user.username, email: user.email };
        }
    } catch {
        // Discard malformed session data and start signed out.
    }

    sessionStorage.removeItem(SESSION_KEY);
    return null;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredUser);

    const startSession = (authenticatedUser) => {
        if (
            typeof authenticatedUser?.username !== 'string' ||
            typeof authenticatedUser?.email !== 'string'
        ) {
            throw new Error('The server returned invalid user details');
        }

        const sessionUser = {
            username: authenticatedUser.username,
            email: authenticatedUser.email,
        };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
    };

    const endSession = () => {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, startSession, endSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
