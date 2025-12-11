// src/services/spaceService.js
import api from "../api/axios";

export async function createSpaceService(payload) {
  return api.post("/spaces/create", payload);
}

export async function getMySpacesService() {
  return api.get("/spaces/mine");
}

export async function getAllSpacesService() {
  return api.get("/spaces"); 
}

export async function joinSpaceService(code) {
  return api.post("/spaces/join", { code });
}

export async function updateSpaceService(spaceId, payload) {
  return api.put(`/spaces/${spaceId}`, payload);
}

export async function deleteSpaceService(spaceId) {
  return api.delete(`/spaces/${spaceId}`);
}
