import axios, { AxiosHeaders } from "axios";

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

if (!API_URL) {
    // Soft warning in dev; avoids crashing build
    console.warn("VITE_API_URL is not set. Set it in .env.local, e.g., VITE_API_URL=http://localhost:5140/api");
}

export const TOKEN_STORAGE_KEY = "auth_token";

export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
        return null;
    }
}

export function setToken(token: string | null) {
    try {
        if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
        else localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
        // ignore
    }
}

export const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        if (!config.headers) config.headers = new AxiosHeaders();
        (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error?.response?.status === 401) {
            // Token expirado ou inválido; limpe e deixe fluxo de login cuidar
            setToken(null);
        }
        return Promise.reject(error);
    }
);

export type ApiResponse<T> = {
    message?: string;
    data: T;
};
