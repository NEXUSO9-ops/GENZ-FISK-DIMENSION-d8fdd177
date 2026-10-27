"use client"

import { useEffect, useRef, useState } from "react"

const SOURCE_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_1595-jeDiRUmjkH4zoFGafvMaI4y7DwTocQ.png"

type VoiceState = "idle" | "listening" | "thinking" | "speaking"
type SpeechRecognitionEventLike = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

export default function Home() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [transcript, setTranscript] = useState("")
  const [muted, setMuted] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const startListening = () => {
    if (voiceState !== "idle") {
      recognitionRef.current?.stop()
      setVoiceState("idle")
      return
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Recognition) {
      setTranscript("Voice input is not supported in this browser.")
      return
    }
    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onresult = (event) => {
      const text = Array.from(event.results).map((result) => result[0].transcript).join("")
      setTranscript(text)
    }
    recognition.onend = () => setVoiceState("thinking")
    recognition.onerror = () => setVoiceState("idle")
    recognitionRef.current = recognition
    setTranscript("")
    setVoiceState("listening")
    recognition.start()
  }

  const statusCopy = {
    idle: "Ready when you are",
    listening: "Listening for your signal",
    thinking: "Processing your request",
    speaking: "Core response incoming",
  }[voiceState]

  return (
    <main className="shell">
      <div className="aurora" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark"><span /></span>
          <div><strong>OMEGA-9</strong><small>VOICE CORE</small></div>
        </div>
        <div className="system-meta"><span className="live-dot" /> SYSTEM ONLINE <span className="meta-divider" /> V.03.01</div>
        <button className="header-button" type="button" onClick={() => setMuted(!muted)} aria-label={muted ? "Unmute interface" : "Mute interface"}>
          {muted ? "MUTED" : "AUDIO ON"}<span className="toggle-dot" data-muted={muted} />
        </button>
      </header>

      <section className="workspace">
        <aside className="side-rail" aria-label="Session information">
          <span className="rail-label">CHANNEL</span>
          <div className="rail-value">WEB / 001</div>
          <div className="rail-line" />
          <span className="rail-label">ENCRYPTION</span>
          <div className="rail-value">AES-256 <span className="verified">VERIFIED</span></div>
          <div className="rail-line" />
          <span className="rail-label">LATENCY</span>
          <div className="rail-value">42 MS</div>
          <div className="rail-image" style={{ backgroundImage: `url(${SOURCE_IMAGE})` }} aria-hidden="true" />
        </aside>

        <div className="core-column">
          <div className="eyebrow"><span /> PRIVATE VOICE INTERFACE</div>
          <h1>Speak to the<br /><em>core.</em></h1>
          <p className="intro">A focused voice channel for ideas, questions, and clear thinking.</p>

          <div className={`orbital-core state-${voiceState}`}>
            <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
            <div className="core-glow" />
            <div className="core-center"><span className="mic-glyph">⌁</span><span className="core-code">O9</span></div>
          </div>

          <div className="voice-status"><span className="status-pip" /> {statusCopy}</div>
          {transcript && <div className="transcript">“{transcript}”</div>}
          <button className="speak-button" type="button" onClick={startListening} data-active={voiceState !== "idle"}>
            <span className="button-icon">{voiceState === "idle" ? "◉" : "■"}</span>
            {voiceState === "idle" ? "BEGIN SESSION" : "END SESSION"}
            <span className="button-arrow">↗</span>
          </button>
          <div className="hint"><kbd>SPACE</kbd> to toggle voice channel</div>
        </div>

        <aside className="session-panel" aria-label="Current session">
          <div className="panel-heading"><span>SESSION</span><span className="panel-index">01 / 04</span></div>
          <div className="panel-rule" />
          <div className="session-orb"><div className="mini-wave"><i /><i /><i /><i /><i /><i /><i /></div></div>
          <span className="rail-label">CURRENT MODE</span>
          <div className="mode-name">CONVERSATIONAL</div>
          <p className="panel-copy">Natural turn-taking<br />with adaptive pauses.</p>
          <button className="text-action" type="button" onClick={() => setTranscript("Session settings are ready to configure.")}>CONFIGURE <span>→</span></button>
          <div className="panel-footer"><span>PRIVACY FIRST</span><span>⌁</span></div>
        </aside>
      </section>
      <footer className="footer"><span>OMEGA-9 / SOVEREIGN CORE</span><span>VOICE IS THE SHORTEST PATH TO CLARITY</span><span>© 2026</span></footer>
    </main>
  )
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}
