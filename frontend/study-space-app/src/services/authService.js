import { API_URL } from "../api/api";

export async function registerUser(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    return res.json();
}

export async function loginUser(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    const body = await res.json();
    if (body.token) {
        localStorage.setItem("token", body.token);
        localStorage.setItem("user", JSON.stringify(body.user));
    }
    return body;
}

export function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
