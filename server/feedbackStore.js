/** In-memory feedback list (newest first). */
const feedbacks = [];

export function addFeedback(record) {
  feedbacks.unshift(record);
  return record;
}

export function listFeedbacks() {
  return [...feedbacks];
}
