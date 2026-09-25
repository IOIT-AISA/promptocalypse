with open("frontend/src/components/Header.tsx", "r") as f:
    content = f.read()

# Add remainingSeconds
old_timer_logic = """  // ── Stopwatch Timer counting elapsed time from start_time ──
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    if (!internalSession.start_time) return 0
    const startMs = new Date(internalSession.start_time).getTime()
    return Math.max(0, Math.floor((Date.now() - startMs) / 1000))
  })

  useEffect(() => {
    // If completed or start_time is missing, don't run the ticker
    if (completed || !internalSession.start_time) {
      return
    }

    const startMs = new Date(internalSession.start_time).getTime()
    // Recalculate immediately
    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)))

    const timer = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)))
    }, 1000)

    return () => clearInterval(timer)
  }, [internalSession.start_time, completed])"""

new_timer_logic = """  // ── Stopwatch Timer counting elapsed time from start_time ──
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    if (!internalSession.start_time) return 0
    const startMs = new Date(internalSession.start_time).getTime()
    return Math.max(0, Math.floor((Date.now() - startMs) / 1000))
  })

  const remainingSeconds = Math.max(0, 7200 - elapsedSeconds)

  useEffect(() => {
    if (remainingSeconds === 0 && !completed && internalSession.start_time) {
      const evt = new CustomEvent('ARENA_TIMEOUT');
      window.dispatchEvent(evt);
    }
  }, [remainingSeconds, completed, internalSession.start_time])

  useEffect(() => {
    // If completed or start_time is missing, don't run the ticker
    if (completed || !internalSession.start_time) {
      return
    }

    const startMs = new Date(internalSession.start_time).getTime()
    // Recalculate immediately
    setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)))

    const timer = setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)))
    }, 1000)

    return () => clearInterval(timer)
  }, [internalSession.start_time, completed])"""

content = content.replace(old_timer_logic, new_timer_logic)

# Replace formatElapsedTime(elapsedSeconds) with remainingSeconds and styling
old_time_metric = """        <div className="hud-metric">
          <span className="hud-metric__label">TIME:</span>
          <span className="hud-metric__value hud-metric__value--time">
            {formatElapsedTime(elapsedSeconds)}
          </span>
        </div>"""

new_time_metric = """        <div className="hud-metric">
          <span className="hud-metric__label">TIME:</span>
          <span className={`hud-metric__value hud-metric__value--time ${
            remainingSeconds <= 300 
              ? 'hud-metric__value--time-danger' 
              : remainingSeconds <= 900 
                ? 'hud-metric__value--time-warning' 
                : ''
          }`}>
            {formatElapsedTime(remainingSeconds)}
          </span>
        </div>"""

content = content.replace(old_time_metric, new_time_metric)

with open("frontend/src/components/Header.tsx", "w") as f:
    f.write(content)
