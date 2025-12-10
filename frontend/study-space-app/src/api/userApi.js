const API_URL = "http://localhost:5000/api/user";

export async function getUserDetails() {
    const res = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function updateUserDetails( userData) {
    const res = await fetch(`${API_URL}/me`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });
    return res.json();
}

export async function deleteUser() {
    const res = await fetch(`${API_URL}/me`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function changeUserPassword(passwordData) {
    const res = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
    });
    return res.json();
}


