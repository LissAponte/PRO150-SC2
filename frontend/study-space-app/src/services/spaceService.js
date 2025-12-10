import { API_URL, authHeader } from "../api/api";

export async function getMySpaces() {
    const res = await fetch(`${API_URL}/spaces/mine`, {
        method: "GET",
        headers: authHeader()
    });
    
    return res.json();
}

export async function createSpace(spaceData) {
    const res = await fetch(`${API_URL}/spaces/create`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(spaceData)
    });
    
    return res.json();
}