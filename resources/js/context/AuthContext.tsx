import {createContext, ReactNode, useContext, useState} from 'react';

import type {User, AuthResult, LoginPayload, RegisterPayload} from '../types';
import {AxiosError} from "axios";
import api from "../services/api";
interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: LoginPayload) => Promise<AuthResult>;
    register: (payload: RegisterPayload) => Promise<AuthResult>;
    logout: () => Promise<void>;
}

interface AuthApiResponse {
    data: {
        user: User;
        token: string;
    };
}


const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('auth_user');
        return stored ? (JSON.parse(stored) as User) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(false);

    const isAuthenticated = Boolean(token && user);

    function persistSession(userData: User, jwt: string): void {
        localStorage.setItem('auth_token', jwt);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        setToken(jwt);
        setUser(userData);
    }

    function clearSession(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
    }

    async function login(credentials: LoginPayload): Promise<AuthResult> {
        setLoading(true);
        try {
            const { data } = await api.post<AuthApiResponse>('/auth/login', credentials);
            persistSession(data.data.user, data.data.token);
            return { success: true };
        } catch (error) {
            const axiosError = error as AxiosError<{ errors: Record<string, string | string[]> }>;
            return { success: false, errors: axiosError.response?.data?.errors ?? {} };
        } finally {
            setLoading(false);
        }
    }

    async function register(payload: RegisterPayload): Promise<AuthResult> {
        setLoading(true);
        try {
            const { data } = await api.post<AuthApiResponse>('/auth/register', payload);
            persistSession(data.data.user, data.data.token);
            return { success: true };
        } catch (error) {
            const axiosError = error as AxiosError<{ errors: Record<string, string | string[]> }>;
            return { success: false, errors: axiosError.response?.data?.errors ?? {} };
        } finally {
            setLoading(false);
        }
    }

    async function logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } finally {
            clearSession();
        }
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
