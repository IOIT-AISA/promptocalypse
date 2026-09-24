import type { SubmitKeyResponse } from '../types';

export const API_BASE = '/api';

export async function registerUser(username: string) {
  // TODO: POST /api/auth/register
  void username;
  throw new Error('Not implemented');
}

export async function sendPrompt(userId: string, prompt: string) {
  // TODO: POST /api/chat
  void userId;
  void prompt;
  throw new Error('Not implemented');
}

/**
 * Submit a flag key for verification against the active level's secret.
 *
 * POST /api/submit-key (TECH-SPEC.md §2.3).
 * Returns the typed response on HTTP 200; throws an Error carrying the
 * backend `detail` message for 4xx/5xx responses so the UI can surface
 * it without triggering the failure animation.
 */
export async function submitKey(
  userId: string,
  key: string,
): Promise<SubmitKeyResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/submit-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, key }),
    });
  } catch {
    throw new Error('Connection error — unable to reach arena backend.');
  }

  if (!response.ok) {
    let detail = `Request failed (HTTP ${response.status})`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body.detail === 'string') detail = body.detail;
    } catch {
      // Non-JSON error body — keep the default message
    }
    throw new Error(detail);
  }

  return (await response.json()) as SubmitKeyResponse;
}

export async function fetchLeaderboard() {
  // TODO: GET /api/leaderboard
  throw new Error('Not implemented');
}

export async function fetchUserState(userId: string) {
  // TODO: GET /api/user/state
  void userId;
  throw new Error('Not implemented');
}
