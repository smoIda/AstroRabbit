import { API_URL } from "@/hooks/config";

export async function getStar(): Promise<number> {
  const res = await fetch(`${API_URL}/github`);

  if (!res.ok) throw new Error("Failed to fetch stars from Github");

  return res.json();
}
