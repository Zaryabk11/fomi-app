import { getHistory } from "@/lib/history";

export async function GET() {
  return Response.json({ generations: getHistory() });
}
