import re

with open("frontend/src/App.tsx", "r") as f:
    content = f.read()

import_statement = "import { loadSession, hasValidSession, SESSION_UPDATE_EVENT, saveSession, calculateDynamicScore } from './utils/session'"
content = content.replace("import { loadSession, hasValidSession, SESSION_UPDATE_EVENT } from './utils/session'", import_statement)

timeout_handler = """  useEffect(() => {
    const handleUpdate = (e: Event) => {"""

new_timeout_handler = """  useEffect(() => {
    const handleTimeout = () => {
      const current = loadSession()
      if (current && !current.completed) {
        const finalScore = calculateDynamicScore({
          prompts: current.total_prompts || 0,
          elapsedSeconds: 7200,
          failedAttempts: current.failed_attempts || 0,
        })
        const updated = { ...current, completed: true, final_score: finalScore }
        saveSession(updated)
        setSession(updated)
        setShowVictory(true)
        setFinalScore(finalScore)
        setVictoryStats({
          base_points: 1000,
          total_prompts: current.total_prompts || 0,
          prompt_penalty: 0,
          elapsed_minutes: 120,
          time_penalty: 120 * 2,
          failed_attempts: current.failed_attempts || 0,
          fail_penalty: (current.failed_attempts || 0) * 25,
          final_score: finalScore
        })
      }
    }
    window.addEventListener('ARENA_TIMEOUT', handleTimeout)
    return () => window.removeEventListener('ARENA_TIMEOUT', handleTimeout)
  }, [])

  useEffect(() => {
    const handleUpdate = (e: Event) => {"""

content = content.replace(timeout_handler, new_timeout_handler)

with open("frontend/src/App.tsx", "w") as f:
    f.write(content)
