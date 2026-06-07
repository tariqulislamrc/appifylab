import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User, AuthResult, LoginPayload, RegisterPayload } from '../types';

interface ErrorResponse {
    errors?: Record<string, string | string[]>;
    message?: string;
}

function parseAuthError(error: unknown): Record<string, string | string[]> {
    const axiosError = error as AxiosError<ErrorResponse>;
    const status = axiosError.response?.status;
    const body = axiosError.response?.data;

    if (status === 429) {
        return { general: 'Too many attempts. Please wait a moment before trying again.' };
    }

    if (body?.errors && Object.keys(body.errors).length > 0) {
        return body.errors;
    }

    if (body?.message) {
        return { general: body.message };
    }

    return { general: 'Something went wrong. Please try again.' };
}

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
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('auth_user');
        return stored ? (JSON.parse(stored) as User) : null;
    });
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        function handleExpired() {
            setToken(null);
            setUser(null);
            navigate('/login', { replace: true });
        }
        window.addEventListener('auth:expired', handleExpired);
        return () => window.removeEventListener('auth:expired', handleExpired);
    }, [navigate]);

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
            return { success: false, errors: parseAuthError(error) };
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
            return { success: false, errors: parseAuthError(error) };
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
