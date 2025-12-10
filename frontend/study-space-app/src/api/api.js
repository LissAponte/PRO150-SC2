export const API_URL = "http://localhost:5000/api";

export function authHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
}
