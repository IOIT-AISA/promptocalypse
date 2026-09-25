with open("frontend/src/api/client.ts", "r") as f:
    content = f.read()

import re

old_code = """export async function fetchLeaderboard() {
  // TODO: GET /api/leaderboard
  throw new Error('Not implemented');
}"""

new_code = """export async function fetchLeaderboard(): Promise<import('../types').LeaderboardEntry[]> {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) {
    const errorData = (await res.json().catch(() => ({}))) as {
      detail?: string
    }
    throw new Error(errorData.detail || 'Failed to fetch leaderboard');
  }
  return (await res.json()) as import('../types').LeaderboardEntry[];
}"""

content = content.replace(old_code, new_code)

with open("frontend/src/api/client.ts", "w") as f:
    f.write(content)
