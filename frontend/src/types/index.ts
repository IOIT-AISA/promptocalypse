export interface User {
  user_id: string;
  username: string;
  current_level: number;
  start_time: string;
  total_prompts: number;
  failed_attempts: number;
  completed: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: number;
  isBlocked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  current_level: number;
  score: number;
  prompts: number;
  chars: number;
  completed: boolean;
}

export interface SessionState {
  user_id: string;
  username: string;
  current_level: number;
  active_cooldown_until?: number | null;
  local_chat_history?: Record<string, ChatMessage[]>;
  start_time?: string;
  total_prompts?: number;
  total_chars?: number;
  failed_attempts?: number;
  completed?: boolean;
  final_score?: number;
  cached_at?: number;
}

/** Result statuses returned by POST /api/submit-key (backend scoring engine). */
export type SubmitKeyStatus = 'incorrect' | 'correct' | 'completed';

/** Per-category penalty breakdown returned on arena completion. */
export interface ScoreStats {
  base_points: number;
  total_prompts: number;
  prompt_penalty: number;
  elapsed_minutes: number;
  time_penalty: number;
  failed_attempts: number;
  fail_penalty: number;
  final_score: number;
}

/** Mirrors backend SubmitKeyResponse (backend/app/models.py). */
export interface SubmitKeyResponse {
  status: SubmitKeyStatus;
  unlocked_level?: number | null;
  message: string;
  penalty_points?: number | null;
  final_score?: number | null;
  completion_time?: string | null;
  stats?: ScoreStats | null;
}

/** Final run data handed upward when Level 3 is completed. */
export interface VictoryData {
  final_score: number;
  completion_time: string;
  stats: ScoreStats;
}
