'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import api from '@/lib/axios'
import { useUsername } from './UsernameContext';
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
    const { username, setUsername } = useUsername()
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
                if(url==='/user/'){
                    const res = await api.post(url, { username:payload.username, password:payload.password});
                    const data: { success?: boolean; error?: string } = res.data || {};
                    if (res.status >=400) {
                        return {
                            success: false,
                            error: data.error ?? 'Something went wrong. Please try again.',
                        };
                    }
                    return { success: true };
                }


                const params = new URLSearchParams();
                params.append("username", payload.username);
                params.append("password", payload.password);

                const res = await api.post("/user/login", params, {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });
                const data: { access_token?: string; error?: string } = res.data || {};
                if(res.status >= 400){
                    return {
                        success: false,
                        error: data.error ?? 'Something went wrong. Please try again.',
                    };
                }
                console.log(data.access_token)
                if (typeof data.access_token === 'string') {
                    setToken(data.access_token);
                    await fetch('/api/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: data.access_token }),
                    });
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
        (username: string, password: string) => handleAuthRequest('/user/login', { username, password }),
        [handleAuthRequest]
    );

    const signup = useCallback(
        (username: string, password: string) => handleAuthRequest('/user/', { username, password }),
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
