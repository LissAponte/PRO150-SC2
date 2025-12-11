import api from "../api/axios";

export async function updateProfile(payload) {
    return api.put("/users/me", payload);
}

export async function changePassword(payload) {
    return api.put("/users/change-password", payload);
}

export async function deleteAccount() {
    return api.delete("/users/me");
}

