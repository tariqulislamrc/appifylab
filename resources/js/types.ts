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

export interface Post {
    id: number;
    body: string | null;
    is_private: boolean;
    created_at: string;
    is_liked_by_me: boolean;
    likes_count: number;
    comments_count: number;
    user?: User;
    images?: PostImage[];
    likers_preview?: User[];
}

export interface PostImage {
    id: number;
    url: string;
}

export interface Like {
    id: number;
    user?: User;
}

export interface Comment {
    id: number;
    body: string;
    created_at: string;
    is_liked_by_me: boolean;
    likes_count: number;
    user?: User;
    replies?: Comment[];
}

