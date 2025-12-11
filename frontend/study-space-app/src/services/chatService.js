import api from "../api/axios";

export async function getChatHistory(spaceId) {
    return api.get(`/chats/${spaceId}`);
}