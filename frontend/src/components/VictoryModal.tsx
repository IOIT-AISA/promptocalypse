import { useEffect, useRef } from 'react'
import { fireVictoryConfetti } from '../utils/confetti'
import type { VictoryData } from '../types'

interface VictoryModalProps {
  /** Final run data from a completed POST /api/submit-key submission. */
  victory: VictoryData
}

/**
 * Final Arena Completion modal — Issue #8.
 *
 * Owns the victory confetti trigger (fired exactly once on mount) and
 * renders the real score breakdown returned by the scoring engine.
 * References: docs/FEATURES.md §3.4, docs/UI-UX.md §3.5
 */
export default function VictoryModal({ victory }: VictoryModalProps) {
  const confettiFiredRef = useRef(false)

  // Fire confetti exactly once when the modal mounts (guard covers
  // React StrictMode's double effect invocation in development).
  useEffect(() => {
    if (confettiFiredRef.current) return
    confettiFiredRef.current = true
    fireVictoryConfetti()
  }, [])

  const { stats, final_score } = victory

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 11, 16, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: '#12151f',
          border: '1px solid #00ff9d',
          borderRadius: '6px',
          padding: '2rem',
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <h2 style={{ color: '#00ff9d', margin: 0, textAlign: 'center' }}>
          SYSTEM COMPROMISED
        </h2>
        <p style={{ color: '#7983a3', textAlign: 'center', fontSize: '0.9rem' }}>
          Victory! All defense layers breached.
        </p>
        <div
          style={{
            backgroundColor: '#1c2132',
            padding: '1rem',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#7983a3' }}>Base Score:</span>
            <span>{stats.base_points.toLocaleString()} pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#7983a3' }}>
              Time Penalty ({stats.elapsed_minutes} min):
            </span>
            <span style={{ color: '#ff3b5c' }}>-{stats.time_penalty} pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#7983a3' }}>
              Prompt Penalties ({stats.total_prompts} prompts):
            </span>
            <span style={{ color: '#ff3b5c' }}>-{stats.prompt_penalty} pts</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#7983a3' }}>
              Failed Attempts ({stats.failed_attempts}):
            </span>
            <span style={{ color: '#ff3b5c' }}>-{stats.fail_penalty} pts</span>
          </div>
          <hr style={{ borderColor: '#262d43', margin: '0.25rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span style={{ color: '#f0f4fc' }}>Final Score:</span>
            <span style={{ color: '#00ff9d' }}>{final_score.toLocaleString()} pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}
