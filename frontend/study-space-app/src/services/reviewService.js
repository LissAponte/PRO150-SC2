// src/services/reviewService.js
import api from "../api/axios";

export async function postReview(payload) {
  return api.post("/reviews", payload);
}

export async function getReviews(studySpaceId) {
  return api.get(`/reviews/${studySpaceId}`);
}

export async function deleteReview(reviewId) {
  return api.delete(`/reviews/${reviewId}`);
}
