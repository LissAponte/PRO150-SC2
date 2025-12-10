import { API_URL, authHeader } from "../api/api";

export async function getChatMessages(spaceId) {
    const res = await fetch(`${API_URL}/chats/${spaceId}`, {
        method: "GET",
        headers: authHeader()
    });
    
    return res.json();
}