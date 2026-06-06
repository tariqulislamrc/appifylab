export interface LoginPayload {
    email: string;
    password: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    avatar_url?: string;
}

export type AuthResult =
    | { success: true }
    | { success: false; errors: Record<string, string | string[]> };

export interface RegisterPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
}
