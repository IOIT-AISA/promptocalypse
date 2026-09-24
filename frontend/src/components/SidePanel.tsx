import { useEffect, useRef, useState } from 'react'
import { submitKey } from '../api/client'
import type { SessionState, SubmitKeyResponse, VictoryData } from '../types'
import './SidePanel.css'

const SESSION_STORAGE_KEY = 'th_session_v1'
const ERROR_BORDER_MS = 2000
const NO_SESSION_MESSAGE = 'No active session — session restoration pending'

interface SidePanelProps {
  /** True once Level 3 is complete — permanently disables the vault. */
  completed: boolean
  /** Reports completed Level-3 victory data upward (confetti/modal owned by App). */
  onVictory: (victory: VictoryData) => void
}

type StatusKind = 'error' | 'success' | 'warning'
interface VaultStatus {
  kind: StatusKind
  text: string
}

/**
 * Read the arena session user_id from localStorage per TECH-SPEC.md §7.1
 * (`th_session_v1` → { user_id, username, current_level, ... }).
 * Returns null when absent or malformed — registration/session restoration
 * is a separate issue and no user id is ever invented here.
 */
function readSessionUserId(): string | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SessionState>
    if (typeof parsed.user_id === 'string' && parsed.user_id.length > 0) {
      return parsed.user_id
    }
    return null
  } catch {
    // Corrupt payload — treat as missing session
    return null
  }
}

/**
 * Vault Key Submission card — Issue #8.
 *
 * Monospace FLAG{...} input wired to POST /api/submit-key. Incorrect
 * submissions trigger the 8-frame horizontal shake + red border; Level 3
 * completion hands victory data up to App (which owns the VictoryModal
 * and its confetti trigger).
 */
export default function SidePanel({ completed, onVictory }: SidePanelProps) {
  const [userId, setUserId] = useState<string | null>(null)
  const [keyInput, setKeyInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<VaultStatus | null>(null)
  const [isError, setIsError] = useState(false)
  const [shakeNonce, setShakeNonce] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const errorTimerRef = useRef<number | null>(null)

  // Resolve session once on mount
  useEffect(() => {
    const id = readSessionUserId()
    setUserId(id)
    if (!id) {
      setStatus({ kind: 'warning', text: NO_SESSION_MESSAGE })
    }
  }, [])

  // 8-frame shake: restart the CSS animation on every incorrect submission.
  // Runs after commit so the error border class is already applied.
  useEffect(() => {
    if (shakeNonce === 0) return
    const el = inputRef.current
    if (!el) return
    el.classList.remove('vault-key-input--shake')
    void el.offsetWidth // force reflow so the animation can re-trigger
    el.classList.add('vault-key-input--shake')
  }, [shakeNonce])

  // Clear the red error border after 2 seconds (FEATURES.md §3.2)
  useEffect(() => {
    if (!isError) return
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current)
    }
    errorTimerRef.current = window.setTimeout(() => setIsError(false), ERROR_BORDER_MS)
    return () => {
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current)
        errorTimerRef.current = null
      }
    }
  }, [isError])

  const handleResult = (result: SubmitKeyResponse) => {
    if (result.status === 'incorrect') {
      // Failure animation: 8-frame shake + red border + penalty label
      setIsError(true)
      setShakeNonce((n) => n + 1)
      setStatus({
        kind: 'error',
        text: `Invalid Key. Penalty: -${result.penalty_points ?? 25} Pts`,
      })
      return
    }

    if (result.status === 'completed') {
      setStatus({ kind: 'success', text: result.message })
      setKeyInput('')
      if (
        typeof result.final_score === 'number' &&
        typeof result.completion_time === 'string' &&
        result.stats
      ) {
        onVictory({
          final_score: result.final_score,
          completion_time: result.completion_time,
          stats: result.stats,
        })
      }
      return
    }

    // status === 'correct' (Level 1/2 cleared) — status label only per scope
    setStatus({ kind: 'success', text: result.message })
    setKeyInput('')
    setIsError(false)
  }

  const handleSubmit = async () => {
    const trimmed = keyInput.trim()
    if (!trimmed || isSubmitting || completed) return

    if (!userId) {
      setStatus({ kind: 'warning', text: NO_SESSION_MESSAGE })
      return
    }

    setIsSubmitting(true)
    setStatus(null)
    try {
      const result = await submitKey(userId, trimmed)
      handleResult(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed.'
      setStatus({ kind: 'error', text: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  const isDisabled = completed || isSubmitting || !userId || keyInput.trim() === ''

  return (
    <aside
      style={{
        flex: '0 0 40%',
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
        backgroundColor: '#12151f',
        overflowY: 'auto',
      }}
    >
      {/* Mission objective card */}
      <div
        style={{
          backgroundColor: '#1c2132',
          border: '1px solid #262d43',
          borderRadius: '4px',
          padding: '1rem',
        }}
      >
        <h3
          style={{
            color: '#00ff9d',
            fontSize: '0.95rem',
            marginBottom: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
          }}
        >
          Mission Objective
        </h3>
        <p style={{ color: '#f0f4fc', fontSize: '0.85rem', lineHeight: '1.4' }}>
          Extract the secret key from the defense system without triggering security tripwires.
        </p>
      </div>

      {/* Key submission card */}
      <div
        style={{
          backgroundColor: '#1c2132',
          border: '1px solid #262d43',
          borderRadius: '4px',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <h3
          style={{
            color: '#00ff9d',
            fontSize: '0.95rem',
            marginBottom: '0.25rem',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
          }}
        >
          Vault Key Submission
        </h3>
        <input
          ref={inputRef}
          type="text"
          className={`vault-key-input${isError ? ' vault-key-input--error' : ''}`}
          placeholder="FLAG{...}"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={completed || isSubmitting}
          aria-label="Flag key"
        />
        <button
          type="button"
          style={{
            backgroundColor: isDisabled ? '#262d43' : '#00ff9d',
            color: isDisabled ? '#7983a3' : '#0a0b10',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 'bold',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          {isSubmitting ? 'VERIFYING...' : 'Verify Key'}
        </button>
        {status && (
          <p className={`vault-status vault-status--${status.kind}`}>{status.text}</p>
        )}
      </div>

      {/* Mini leaderboard placeholder */}
      <div
        style={{
          backgroundColor: '#1c2132',
          border: '1px solid #262d43',
          borderRadius: '4px',
          padding: '1rem',
          flex: 1,
        }}
      >
        <h3
          style={{
            color: '#00ff9d',
            fontSize: '0.95rem',
            marginBottom: '0.5rem',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
          }}
        >
          Mini Leaderboard
        </h3>
        <div style={{ color: '#7983a3', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
          <p>No entries loaded.</p>
        </div>
      </div>
    </aside>
  )
}
