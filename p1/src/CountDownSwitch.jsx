import React, { useEffect, useRef, useState } from "react"
import './CountDownSwitch.css'

function CountDownSwitch() 
{
  // Total countdown duration in seconds
  const DURATION = 30

  // `seconds` tracks remaining seconds, `running` tracks whether timer is active
  const [seconds, setSeconds] = useState(DURATION)
  const [running, setRunning] = useState(false)

  // `isLight` controls the theme (light vs dark)
  const [isLight, setIsLight] = useState(false)

  // store interval id so we can clear it on unmount / reset
  const intervalRef = useRef(null)

  // Update the document body class when theme changes so CSS variables apply
  useEffect(() => {
    if (isLight) document.body.classList.add('light')
    else document.body.classList.remove('light')
  }, [isLight])

  // Clean up interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  // Start the timer: creates an interval that updates `seconds` every second
  function startTimer() {
    if (running) return
    setRunning(true)
    // Ensure any previous interval is cleared
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          // time's up: clear interval and toggle theme as required
          clearInterval(intervalRef.current)
          setRunning(false)
          setIsLight(v => !v) // automatically toggle theme when time reaches zero
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Reset timer to initial state
  function resetTimer() {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSeconds(DURATION)
  }

  // Toggle theme manually from the checkbox
  function handleThemeToggle() {
    setIsLight(v => !v)
  }

  // Compute progress percent for the progress bar
  const progressPercent = ((DURATION - seconds) / DURATION) * 100

    return ( <>
      <div className="countdown-root">
      {/* Header + Toggle */}
      <div className="container">
        <div className="header">
          <h1>Countdown & Light Switch</h1>
          <div className="toggle-container">
            <label className="toggle-switch">
              {/* bind checked to state so the slider reflects current theme */}
              <input
                type="checkbox"
                id="themeToggle"
                checked={isLight}
                onChange={handleThemeToggle}
              />
              <span className="slider"></span>
            </label>
            <span>Light Mode</span>
          </div>
        </div>

        {/* Timer section: progress bar, timer display, buttons, message */}
        <div className="timer-section">
          <div className="progress-bar">
            {/* inline style used to update width from React state */}
            <div
              className="progress"
              id="progress"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="timer" id="timerDisplay">
            {seconds}s
          </div>

          <div className="btn-group">
            <button id="startButton" onClick={startTimer} disabled={running}>
              Start Timer
            </button>
            {/* Show Reset only when timer has started or finished */}
            <button id="resetButton" onClick={resetTimer} style={{ display: running || seconds !== DURATION ? 'inline-block' : 'none' }}>
              Reset Timer
            </button>
          </div>

          <div className="message" id="messageArea">
            {/* When timer finishes show a message */}
            {seconds === 0 && <span>Time's Up!</span>}
          </div>
        </div>
      </div>
      </div>
    </> )
  
}

export default CountDownSwitch