'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type AuthActionResult = {
    success: boolean;
    error?: string;
};

type AuthContextType = {
    token: string | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<AuthActionResult>;
    signup: (username: string, password: string) => Promise<AuthActionResult>;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const res = await fetch('/api/session', {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                setToken(null);
                return;
            }

            const data: { token?: string | null; authenticated?: boolean } = await res.json();

            if (data.authenticated) {
                setToken(typeof data.token === 'string' ? data.token : null);
            } else {
                setToken(null);
            }
        } catch (error) {
            console.error('Failed to refresh session', error);
            setToken(null);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await refreshSession();
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refreshSession]);

    const handleAuthRequest = useCallback(
        async (url: string, payload: { username: string; password: string }): Promise<AuthActionResult> => {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                });

                const data: { success?: boolean; token?: string; error?: string } = await res.json().catch(
                    () => ({})
                );

                if (!res.ok || !data.success) {
                    return {
                        success: false,
                        error: data.error ?? 'Something went wrong. Please try again.',
                    };
                }

                if (typeof data.token === 'string') {
                    setToken(data.token);
                } else {
                    await refreshSession();
                }

                return { success: true };
            } catch (error) {
                console.error(`Failed to call ${url}`, error);
                return {
                    success: false,
                    error: 'Network error. Please try again.',
                };
            }
        },
        [refreshSession]
    );

    const login = useCallback(
        (username: string, password: string) => handleAuthRequest('/api/login', { username, password }),
        [handleAuthRequest]
    );

    const signup = useCallback(
        (username: string, password: string) => handleAuthRequest('/api/signup', { username, password }),
        [handleAuthRequest]
    );

    const logout = useCallback(async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Failed to log out', error);
        } finally {
            setToken(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ token, isLoading, login, signup, logout, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
