import api from "../api/axios";

export async function loginService(email, password) {
    return api.post("/auth/login", { email, password });
}

export async function registerService(credentials) {
    return api.post("/auth/register", credentials);
}

export async function logoutService() {
    return api.post("/auth/logout");
}

export async function fetchCurrentUser() {
    return api.get("/user/me");
}

