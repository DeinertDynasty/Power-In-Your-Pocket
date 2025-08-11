import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PowerStyle.css";
import AuthGate from "./AuthGate";
import Leaderboard from "./Leaderboard";

import flashcards from "./flashcards";
import { Buying_Questions, Procrastinations, Initial_Scripting, Objection } from "./script";

import Quiz from "./Quiz";
import { getScriptQuiz, urgencyQuiz } from "./quizzes";

import { getLeaderboard, submitScore, getOverall } from "./LeaderboardService";
import { getCurrentUser, logout as doLogout, readUserKey, writeUserKey } from "./Accounts";
import UrgencyTraining from "./UrgencyTraining";

/* =========================================================
   Teleprompter: Reader (context-aware pace + ADHD highlight + save time)
   ========================================================= */
function TeleprompterReader({
  text,
  defaultSpeed = 80,   // px/sec when scrolling
  defaultFont = 28,     // px
  defaultMirror = false,
  countIn = true,       // 3s count-in on first Play
  targetWPMDefault = 150,
  onSaveSession,        // callback(seconds)
}) {
  const viewportRef = useRef(null);
  const contentRef = useRef(null);
  const fsRef = useRef(null);
  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const tickTimerRef = useRef(null);
  const maxRef = useRef(1);
  const needsScrollRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed); // px/s when scrolling
  const [fontSize, setFontSize] = useState(defaultFont);
  const [mirror, setMirror] = useState(defaultMirror);
  const [offset, setOffset] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [elapsed, setElapsed] = useState(0); // time in Play
  const [needsScroll, setNeedsScroll] = useState(false);

  const [targetWPM, setTargetWPM] = useState(targetWPMDefault); // used when NOT scrolling
  const [metronome, setMetronome] = useState(false);

  const lines = useMemo(() => (text || "").split("\n").filter(Boolean), [text]);
  const totalWords = useMemo(
    () => lines.reduce((a, ln) => a + ln.trim().split(/\s+/).filter(Boolean).length, 0),
    [lines]
  );

  // --- main RAF loop (scroll if needed; otherwise time-based) ---
  useEffect(() => {
    let last = performance.now();
    const step = (ts) => {
      const dt = (ts - last) / 1000;
      last = ts;

      if (viewportRef.current && contentRef.current) {
        const vh = viewportRef.current.clientHeight;
        const ch = contentRef.current.scrollHeight;
        const max = Math.max(ch - vh, 0);
        maxRef.current = Math.max(1, max);
        const need = ch > vh + 2;
        needsScrollRef.current = need;
        if (need !== needsScroll) setNeedsScroll(need);
      }

      if (running) {
        if (needsScrollRef.current) {
          setOffset(prev => {
            const next = Math.min(prev + speed * dt, maxRef.current);
            if (next >= maxRef.current - 0.5) setRunning(false);
            return next;
          });
        }
        setElapsed(e => e + dt);
      }

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [running, speed, needsScroll]);

  // clamp on resize
  useEffect(() => {
    const onResize = () => {
      if (!viewportRef.current || !contentRef.current) return;
      const vh = viewportRef.current.clientHeight;
      const ch = contentRef.current.scrollHeight;
      const max = Math.max(ch - vh, 0);
      maxRef.current = Math.max(1, max);
      const need = ch > vh + 2;
      needsScrollRef.current = need;
      setNeedsScroll(need);
      setOffset(o => Math.min(o, maxRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const doPlay = () => {
    if (running) return;
    if (countIn && !started && offset === 0) {
      setCountdown(3);
      setStarted(true);
      const iv = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(iv);
            setRunning(true);
            startMetronome();
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } else {
      setRunning(true);
      setStarted(true);
      startMetronome();
    }
  };
  const doPause = () => { setRunning(false); stopMetronome(); };
  const doRestart = () => {
    setRunning(false);
    stopMetronome();
    setOffset(0);
    setElapsed(0);
    setStarted(false);
    setCountdown(0);
  };

  const toggleFullscreen = async () => {
    try {
      const el = fsRef.current;
      if (!el) return;
      if (!document.fullscreenElement) await el.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  // keyboard shortcuts (↑/↓ adjust px/s when scrolling OR WPM when not)
  useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;

      if (e.code === "Space") { e.preventDefault(); running ? doPause() : doPlay(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); needsScrollRef.current ? setSpeed(s => Math.min(s + 10, 250)) : setTargetWPM(w => Math.min(w + 5, 300)); }
      else if (e.key === "ArrowDown") { e.preventDefault(); needsScrollRef.current ? setSpeed(s => Math.max(s - 10, 20)) : setTargetWPM(w => Math.max(w - 5, 60)); }
      else if (e.key.toLowerCase() === "f") { e.preventDefault(); toggleFullscreen(); }
      else if (e.key.toLowerCase() === "m") { e.preventDefault(); setMirror(m => !m); }
      else if (e.key.toLowerCase() === "r") { e.preventDefault(); doRestart(); }
      else if (e.key.toLowerCase() === "s") { e.preventDefault(); onSaveSession?.(Math.round(elapsed)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, elapsed, onSaveSession]);

  // metronome
  const beep = (duration = 0.03, freq = 880) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = freq; g.gain.value = 0.02;
      o.connect(g); g.connect(ctx.destination); o.start();
      setTimeout(() => { o.stop(); }, duration * 1000);
    } catch {}
  };
  const startMetronome = () => {
    stopMetronome();
    if (!metronome) return;
    const intervalMs = Math.max(200, Math.round(60000 / Math.max(targetWPM, 1)));
    tickTimerRef.current = setInterval(() => { if (running) beep(); }, intervalMs);
  };
  const stopMetronome = () => {
    if (tickTimerRef.current) { clearInterval(tickTimerRef.current); tickTimerRef.current = null; }
  };
  useEffect(() => { if (running) startMetronome(); }, [targetWPM, metronome]); // eslint-disable-line

  // live WPM (rough)
  const minutes = Math.max(elapsed / 60, 0.01);
  const liveWPM = Math.round((text || "").trim().split(/\s+/).filter(Boolean).length / minutes);
  const withinRange = Math.abs(liveWPM - targetWPM) <= Math.max(10, Math.round(targetWPM * 0.1));

  // ===== Highlight progress =====
  let progress = 0;
  if (needsScrollRef.current) {
    const vh = viewportRef.current?.clientHeight || 800;
    const smoothMax = Math.max(maxRef.current, vh);
    progress = Math.max(0, Math.min(1, (offset >= maxRef.current - 0.5 ? 1 : offset / smoothMax)));
  } else {
    const wordsPerSec = targetWPM / 60;
    const currentWordByTime = Math.floor(elapsed * wordsPerSec);
    progress = totalWords > 1 ? Math.min(1, currentWordByTime / (totalWords - 1)) : 1;
  }

  const currentIdx = Math.floor(progress * Math.max(0, totalWords - 1));

  // render words with styles (past dim, current pink, future normal)
  let globalWord = 0;
  const renderParagraph = (ln, key) => {
    const words = ln.trim().split(/\s+/).filter(Boolean);
    return (
      <p key={key} style={{ margin: "0 0 18px" }}>
        {words.map((w, i) => {
          const idx = globalWord++;
          if (idx < currentIdx) {
            return <React.Fragment key={idx}><span style={{ color: "#64748b", opacity: 0.55 }}>{w}</span>{i < words.length - 1 ? " " : null}</React.Fragment>;
          }
          if (idx === currentIdx) {
            return <React.Fragment key={idx}><span style={{ color: "#db2777", fontWeight: 800 }}>{w}</span>{i < words.length - 1 ? " " : null}</React.Fragment>;
          }
          return <React.Fragment key={idx}><span style={{ color: "var(--text)" }}>{w}</span>{i < words.length - 1 ? " " : null}</React.Fragment>;
        })}
      </p>
    );
  };

  // unified "Pace" slider: px/s if scrolling, WPM if not
  const paceIsScroll = needsScroll;
  const paceValue = paceIsScroll ? speed : targetWPM;
  const paceMin = paceIsScroll ? 20 : 60;
  const paceMax = paceIsScroll ? 250 : 300;
  const paceLabel = paceIsScroll ? `${paceValue}px/s (↑/↓)` : `${paceValue} WPM (↑/↓)`;
  const onPaceChange = (v) => {
    const n = Number(v);
    if (paceIsScroll) setSpeed(n);
    else setTargetWPM(n);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${m}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div ref={fsRef}>
      <div className="tele-viewport" ref={viewportRef} style={{ height: "70vh" }}>
        <div style={{ position: "absolute", top: "20%", left: 0, right: 0, height: 2, background: "rgba(0,0,0,0.08)", zIndex: 2 }} />
        <div className="tele-fade-top" />
        <div className="tele-fade-btm" />

        <div
          ref={contentRef}
          className="tele-content"
          style={{
            paddingBottom: needsScroll ? "70vh" : "16px",
            transform: `translateY(-${offset}px) ${mirror ? " scaleX(-1)" : ""}`,
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
          }}
        >
          {lines.map((ln, i) => renderParagraph(ln, i))}
        </div>

        {countdown > 0 && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.6)", fontSize: 72, fontWeight: 800, zIndex: 3
          }}>
            {countdown}
          </div>
        )}
      </div>

      {/* controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        {!running ? <button className="button" onClick={doPlay}>{started ? "Resume" : "Play"}</button>
                  : <button className="button" onClick={doPause}>Pause</button>}
        <button className="button secondary" onClick={doRestart}>Restart</button>
        <button className="button" onClick={toggleFullscreen}>Fullscreen (F)</button>

        <label className="small" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} /> Mirror (M)
        </label>

        {/* Pace control — always enabled */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="small">Pace</span>
          <input type="range" min={paceMin} max={paceMax} value={paceValue} onChange={(e) => onPaceChange(e.target.value)} />
          <span className="small">{paceLabel}</span>
        </div>

        {/* Target WPM numeric (for short scripts) */}
        {!needsScroll && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="small">Target WPM</span>
            <input
              type="number"
              min="60"
              max="300"
              step="5"
              value={targetWPM}
              onChange={(e)=>setTargetWPM(Number(e.target.value)||targetWPM)}
              style={{ width: 80 }}
            />
          </div>
        )}

        {/* Session timer + Save */}
        <div className="small" style={{ fontWeight: 800 }}>
          Session: {fmt(elapsed)}
        </div>
        <button
          className="button"
          onClick={() => onSaveSession?.(Math.round(elapsed))}
          disabled={Math.round(elapsed) < 10}
          title="Saves your time (in seconds) to the Teleprompter leaderboard"
        >
          Save Session (Time)
        </button>

        <div className="small" style={{ marginLeft: "auto", fontWeight: 800, color: withinRange ? "#16a34a" : "#ef4444" }}>
          Live ~{isFinite(liveWPM) ? liveWPM : 0} WPM {withinRange ? "✓" : "•"}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Teleprompter Studio (script chooser + section/range picker)
   ========================================================= */
function TeleprompterStudio({ onSaveSession }) {
  const SCRIPT_SETS = useMemo(() => ([
    { key: "Initial_Scripting", label: "Initial_Scripting", lines: Initial_Scripting },
     { key: "Buying_Questions", label: "Buying_Questions", lines: Buying_Questions },
      { key: "Objection", label: "Objection", lines: Objection },
    { key: "Procrastinations",   label: "Procrastinations",   lines: Procrastinations   },
  ]), []);

  const [choice, setChoice] = useState(SCRIPT_SETS[0].key);
  const active = SCRIPT_SETS.find(s => s.key === choice) || SCRIPT_SETS[0];
  const totalLines = active.lines?.length || 0;

  const [startLine, setStartLine] = useState(1);
  const [endLine, setEndLine] = useState(Math.max(1, totalLines));

  useEffect(() => {
    setStartLine(1);
    setEndLine(Math.max(1, active.lines?.length || 1));
  }, [choice]);

  const clampedStart = Math.max(1, Math.min(startLine, endLine));
  const clampedEnd = Math.max(clampedStart, Math.min(endLine, totalLines));
  const sliced = useMemo(() => (active.lines || []).slice(clampedStart - 1, clampedEnd), [active, clampedStart, clampedEnd]);
  const teleText = useMemo(() => (sliced || []).join("\n\n"), [sliced]);

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 1100 }}>
      <div className="mode-tabbar">Teleprompter Studio</div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 10 }}>
        <div>
          <label className="category-label">Script</label>
          <select className="category-picker" value={choice} onChange={(e) => setChoice(e.target.value)}>
            {SCRIPT_SETS.map(s => (<option key={s.key} value={s.key}>{s.label}</option>))}
          </select>
        </div>
        <div>
          <label className="category-label">Start line</label>
          <input type="number" min={1} max={totalLines} value={clampedStart}
                 onChange={(e)=>setStartLine(Number(e.target.value)||1)} />
        </div>
        <div>
          <label className="category-label">End line</label>
          <input type="number" min={1} max={totalLines} value={clampedEnd}
                 onChange={(e)=>setEndLine(Number(e.target.value)||totalLines)} />
        </div>
      </div>

      <div className="small" style={{ color: "#666", marginBottom: 8 }}>
        Using lines {clampedStart}–{clampedEnd} of {totalLines} ({sliced.length} lines)
      </div>

      <TeleprompterReader text={teleText} onSaveSession={onSaveSession} />
    </div>
  );
}

/* =========================================================
   Flashcards (for study mode; quiz uses Quiz)
   ========================================================= */
function Flashcards({ data, onFinish }) {
  const [filter, setFilter] = useState("All");
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const categories = ["All", ...Array.from(new Set(data.map((f) => f.category)))];
  const deck = filter === "All" ? data : data.filter((f) => f.category === filter);

  useEffect(() => { setIndex(0); setShowAnswer(false); setScore(0); }, [filter]);

  if (!deck.length) {
    return (
      <div className="card">
        <div className="mode-tabbar">Flashcards</div>
        <p>No flashcards in this category.</p>
      </div>
    );
  }

  const current = deck[index];

  const markCorrect = () => {
    const nextScore = score + 1;
    if (index === deck.length - 1) onFinish?.({ score: nextScore, total: deck.length });
    else { setScore(nextScore); setIndex((i) => i + 1); setShowAnswer(false); }
  };
  const markIncorrect = () => {
    if (index === deck.length - 1) onFinish?.({ score, total: deck.length });
    else { setIndex((i) => i + 1); setShowAnswer(false); }
  };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Flashcards</div>
      <label className="category-label">Category</label>
      <select className="category-picker" value={filter} onChange={(e) => setFilter(e.target.value)}>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <div style={{ marginTop: 10, color: "#666" }}>Card {index + 1} / {deck.length}</div>

      <div style={{ fontWeight: 700, fontSize: 18, marginTop: 8 }}>{current.question}</div>
      <div style={{ margin: "10px 0 14px", padding: 12, borderRadius: 10, background: showAnswer ? "#fff" : "#f5fbff", whiteSpace: "pre-wrap" }}>
        {showAnswer ? current.answer : "Tap Show Answer to reveal."}
      </div>

      <div className="progress-outer"><div className="progress-inner" style={{ width: `${((index + 1) / deck.length) * 100}%` }} /></div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="button" onClick={() => setShowAnswer(true)}>Show Answer</button>
        <button className="button" onClick={markCorrect}>Mark Correct</button>
        <button className="button" onClick={markIncorrect}>Mark Incorrect</button>
      </div>

      <div style={{ marginTop: 10, color: "#0a8", fontWeight: 700 }}>Score: {score} / {deck.length}</div>
    </div>
  );
}

/* =========================================================
   Leaderboards page
   ========================================================= */
function LeaderboardsPage({ lbOverall, lbFlash, lbTele, lbQuizScript, lbQuizUrgency }) {
  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 1000 }}>
      <div className="mode-tabbar">Leaderboards</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Leaderboard title="Overall" scores={lbOverall} />
        <Leaderboard title="Flashcards" scores={lbFlash} />
        <Leaderboard title="Teleprompter (Time)" scores={lbTele} />
        <Leaderboard title="Quiz: Script" scores={lbQuizScript} />
        <Leaderboard title="Quiz: Urgency" scores={lbQuizUrgency} />
      </div>
    </div>
  );
}

/* =========================================================
   App
   ========================================================= */
export default function App() {
  const user = getCurrentUser();
  const username = user?.username || "anon";

  // theme & focus persisted per-user
  const [theme, setTheme] = useState(() => readUserKey(username, "pref:theme", ""));
  const [focus, setFocus] = useState(() => readUserKey(username, "pref:focus", false));
  const [mode, setMode] = useState("teleprompter-studio"); // default to Studio
  const [saveNotice, setSaveNotice] = useState("");

  // leaderboards
  const [lbFlash, setLbFlash] = useState([]);
  const [lbTele, setLbTele] = useState([]);
  const [lbQuizScript, setLbQuizScript] = useState([]);
  const [lbQuizUrgency, setLbQuizUrgency] = useState([]);
  const [lbOverall, setLbOverall] = useState([]);

  const refreshBoards = () => {
    setLbFlash(getLeaderboard("flashcards"));
    setLbTele(getLeaderboard("teleprompter")); // scored by session time
    setLbQuizScript(getLeaderboard("quiz-script"));
    setLbQuizUrgency(getLeaderboard("quiz-urgency"));
    setLbOverall(getOverall());
  };
  useEffect(() => { refreshBoards(); }, []);

  // dynamic Script Quiz (built from flashcards + scripts)
  const dynamicScriptQuiz = useMemo(
    () => getScriptQuiz(flashcards, Objection, Initial_Scripting, Procrastinations, Buying_Questions, 12),
    []
  );

  // Accent color per mode
  const accentKey = useMemo(() => {
    if (mode === "flashcards") return "flashcards";
    if (mode === "teleprompter-studio") return "teleprompter";
    if (mode === "quiz-script") return "quiz-script";
    if (mode === "quiz-urgency") return "quiz-urgency";
    if (mode === "urgency-training") return "urgency-training";
    if (mode === "leaderboards") return "flashcards";
    return "teleprompter";
  }, [mode]);

  // Apply theme/accent to body
  useEffect(() => { document.body.setAttribute("data-theme", theme || ""); }, [theme]);
  useEffect(() => { document.body.setAttribute("data-accent", accentKey); }, [accentKey]);

  // Persist prefs per-user
  useEffect(() => { writeUserKey(username, "pref:theme", theme); }, [theme, username]);
  useEffect(() => { writeUserKey(username, "pref:focus", !!focus); }, [focus, username]);

  const handleFinish = ({ scope, score }) => {
    const nickname = user?.displayName || user?.username || "Anon";
    submitScore(scope, { nickname, score });
    refreshBoards();
    setSaveNotice(`Saved ${score} for ${nickname} in ${scope}`);
    setTimeout(() => setSaveNotice(""), 2500);
  };

  // Save Teleprompter session time (in seconds) to the leaderboard
  const handleTeleSave = (seconds) => {
    const nickname = user?.displayName || user?.username || "Anon";
    submitScore("teleprompter", { nickname, score: Number(seconds) });
    refreshBoards();
    setSaveNotice(`Saved ${seconds}s Teleprompter for ${nickname}`);
    setTimeout(() => setSaveNotice(""), 2500);
  };

  const cycleTheme = () => setTheme(t => (t === "" ? "bold" : t === "bold" ? "dark" : ""));
  const toggleFocus = () => setFocus(f => !f);

  return (
    <AuthGate>
      <div className="content-wrap">
        {/* Top-right controls */}
        <div style={{ position: "fixed", top: 8, right: 8, display: "flex", gap: 8, zIndex: 999 }}>
          <button className="button" onClick={toggleFocus}>{focus ? "Exit Focus" : "Focus Mode"}</button>
          <button className="button" onClick={cycleTheme}>Theme</button>
          <button className="button" onClick={() => { doLogout(); window.location.reload(); }}>Logout</button>
        </div>

        {/* Save notice */}
        {saveNotice && (
          <div style={{
            position: "fixed", top: 8, left: 8, zIndex: 999, background: "#e8fff3",
            border: "1px solid #19a663", padding: "8px 12px", borderRadius: 8, fontSize: 14
          }}>
            {saveNotice}
          </div>
        )}

        {/* Sidebar leaderboards (hidden in Focus Mode) */}
        {!focus && (
          <div className="sidebar">
            <Leaderboard title="Overall" scores={lbOverall} />
            <Leaderboard title="Flashcards" scores={lbFlash} />
            <Leaderboard title="Teleprompter (Time)" scores={lbTele} />
            <Leaderboard title="Quiz: Script" scores={lbQuizScript} />
            <Leaderboard title="Quiz: Urgency" scores={lbQuizUrgency} />
          </div>
        )}

        {/* Mode switcher */}
        <div className="card" style={{ maxWidth: 1000 }}>
          <div className="mode-tabbar">Training Modes</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="button" onClick={() => setMode("teleprompter-studio")}>Teleprompter Studio</button>
            <button className="button" onClick={() => setMode("flashcards")}>Flashcards</button>
            <button className="button" onClick={() => setMode("quiz-script")}>Quiz: Script</button>
            <button className="button" onClick={() => setMode("quiz-urgency")}>Quiz: Urgency</button>
            <button className="button" onClick={() => setMode("urgency-training")}>Urgency Training</button>
            <button className="button" onClick={() => setMode("leaderboards")}>Leaderboards</button>
          </div>
        </div>

        {/* Content */}
        {mode === "teleprompter-studio" && <TeleprompterStudio onSaveSession={handleTeleSave} />}

        {mode === "flashcards" && (
          <Flashcards
            data={flashcards}
            onFinish={({ score }) => handleFinish({ scope: "flashcards", score })}
          />
        )}

        {mode === "quiz-script" && (
          <div className="card" style={{ textAlign: "left" }}>
            <div className="mode-tabbar">Quiz: Script (Auto-Generated)</div>
            <Quiz
              title=""
              items={dynamicScriptQuiz}
              scope="quiz-script"
              onFinish={({ score }) => handleFinish({ scope: "quiz-script", score })}
            />
          </div>
        )}

        {mode === "quiz-urgency" && (
          <div className="card" style={{ textAlign: "left" }}>
            <div className="mode-tabbar">Quiz: Urgency</div>
            <Quiz
              title=""
              items={urgencyQuiz}
              scope="quiz-urgency"
              onFinish={({ score }) => handleFinish({ scope: "quiz-urgency", score })}
            />
          </div>
        )}

        {mode === "urgency-training" && <UrgencyTraining />}

        {mode === "leaderboards" && (
          <LeaderboardsPage
            lbOverall={lbOverall}
            lbFlash={lbFlash}
            lbTele={lbTele}
            lbQuizScript={lbQuizScript}
            lbQuizUrgency={lbQuizUrgency}
          />
        )}
      </div>
    </AuthGate>
  );
}
