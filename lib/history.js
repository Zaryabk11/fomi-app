import generations from "@/data/mockGenerations.json";

// Shared by GET /api/history and the server-rendered page, so both read the same source.
export function getHistory() {
  return generations;
}
