with open("frontend/src/components/SidePanel.tsx", "r") as f:
    content = f.read()

import re

new_imports = """import { useEffect, useState } from 'react'
import KeyVault from './KeyVault'
import type { SubmitKeyResponse, LeaderboardEntry } from '../types'
import { fetchLeaderboard } from '../api/client'"""

content = content.replace("import KeyVault from './KeyVault'\nimport type { SubmitKeyResponse } from '../types'", new_imports)

old_body = """export default function SidePanel({ onVictory }: SidePanelProps) {
  return ("""

new_body = """export default function SidePanel({ onVictory }: SidePanelProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard().then(setLeaderboard).catch(console.error);
    const interval = setInterval(() => {
      fetchLeaderboard().then(setLeaderboard).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return ("""

content = content.replace(old_body, new_body)

old_placeholder = """<div style={{ color: '#7983a3', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
          <p>No entries loaded.</p>
        </div>"""

new_placeholder = """<div style={{ color: '#7983a3', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
          {leaderboard.length === 0 ? (
            <p>No entries loaded.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {leaderboard.map(entry => (
                <li key={entry.username} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #262d43' }}>
                  <span>
                    <strong>{entry.rank}. {entry.username}</strong>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: entry.completed ? '#00ff9d' : '#ffb020', border: `1px solid ${entry.completed ? '#00ff9d' : '#ffb020'}`, padding: '2px 4px', borderRadius: '4px' }}>
                      {entry.status || (entry.completed ? 'Completed' : 'In Progress')}
                    </span>
                  </span>
                  <span>{entry.final_score ?? entry.score} pts</span>
                </li>
              ))}
            </ul>
          )}
        </div>"""

content = content.replace(old_placeholder, new_placeholder)

with open("frontend/src/components/SidePanel.tsx", "w") as f:
    f.write(content)
