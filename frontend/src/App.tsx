import { useState } from 'react'
import Header from './components/Header.tsx'
import ArenaPanel from './components/ArenaPanel.tsx'
import SidePanel from './components/SidePanel.tsx'
import VictoryModal from './components/VictoryModal.tsx'
import type { VictoryData } from './types'

// TODO: Add registration modal gate, session reconciliation
export default function App() {
  // Completed Level-3 run data; non-null mounts the VictoryModal
  // (which owns the single victory confetti trigger — Issue #8).
  const [victory, setVictory] = useState<VictoryData | null>(null)

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <ArenaPanel />
        <SidePanel completed={victory !== null} onVictory={setVictory} />
      </main>
      {victory && <VictoryModal victory={victory} />}
    </div>
  )
}
