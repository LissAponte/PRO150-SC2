const API_URL = "http://localhost:5000/api/spaces";

export async function getAllSpaces() {
    const res = await fetch(`${API_URL}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function getMySpaces() {
    const res = await fetch(`${API_URL}/mine`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function createSpace(spaceData) {
    const res = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spaceData),
    });
    return res.json();
}

export async function joinSpace(spaceId) {
    const res = await fetch(`${API_URL}/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ spaceId }),
    });
    return res.json();
}

export async function getSpaceDetails(spaceId) {
    const res = await fetch(`${API_URL}/${spaceId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}

export async function updateSpace(spaceId, spaceData) {
    const res = await fetch(`${API_URL}/${spaceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(spaceData),
    });
    return res.json();
}

export async function deleteSpace(spaceId) {
    const res = await fetch(`${API_URL}/${spaceId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.json();
}