import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PowerStyle.css";

import AuthGate from "./AuthGate";
import Leaderboard from "./Leaderboard";
import MultiQuizTabs from "./MultiQuizTabs";
import FlashcardsStudy from "./FlashcardsStudy";
import FlashCardDice from "./FlashCardDice";
import UrgencyTraining from "./UrgencyTraining";
import LeaderboardsPage from "./LeaderboardsPage";

import { recordScore, getBoard, getOverall, getAuraBoard } from "./LeaderboardService";
import { getCurrentUser, logout as doLogout, readUserKey, writeUserKey } from "./Accounts";

// Script arrays used by Teleprompter Studio
import { Buying_Questions, Procrastinations, Initial_Scripting, Objection } from "./script";

/* =========================================================
   Teleprompter Reader (scrolling)
   ========================================================= */

function TeleprompterReader({
  text,
  defaultSpeed = 40,
  defaultFont = 34,
  defaultMirror = false,
  onSaveSession
}) {
  const boxRef = useRef(null);
  const rafRef = useRef(null);
  const lastTSRef = useRef(0);
  const tickTimerRef = useRef(null);
  const maxRef = useRef(1);
  const needsScrollRef = useRef(false);

  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const [fontSize, setFontSize] = useState(defaultFont);
  const [mirror, setMirror] = useState(defaultMirror);
  const [offset, setOffset] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [needsScroll, setNeedsScroll] = useState(false);

  const [targetWPM, setTargetWPM] = useState(140);

  const wordCount = useMemo(() => {
    const w = (text || "")
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .filter(Boolean);
    return w.length;
  }, [text]);

  const estSeconds = useMemo(() => {
    const wpm = Math.max(60, Number(targetWPM) || 140);
    return Math.round((wordCount / wpm) * 60);
  }, [wordCount, targetWPM]);

  const computeMax = () => {
    const el = boxRef.current;
    if (!el) return 1;
    const max = Math.max(1, el.scrollHeight - el.clientHeight);
    maxRef.current = max;

    const shouldScroll = max > 5;
    needsScrollRef.current = shouldScroll;
    setNeedsScroll(shouldScroll);

    return max;
  };

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTop = 0;
    setOffset(0);
    setRunning(false);
    setStarted(false);
    setCountdown(0);
    setElapsed(0);
    setTimeout(computeMax, 50);
  }, [text]);

  useEffect(() => {
    const onResize = () => computeMax();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const step = (ts) => {
    if (!running) return;
    const el = boxRef.current;
    if (!el) return;

    if (!lastTSRef.current) lastTSRef.current = ts;
    const dt = (ts - lastTSRef.current) / 1000;
    lastTSRef.current = ts;

    setElapsed((prev) => prev + dt);

    if (needsScrollRef.current) {
      const max = maxRef.current || computeMax();
      const next = Math.min(max, el.scrollTop + speed * dt);
      el.scrollTop = next;
      setOffset(next);

      if (next >= max - 1) {
        setRunning(false);
      }
    }

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (running) {
      lastTSRef.current = 0;
      rafRef.current = requestAnimationFrame(step);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line
  }, [running, speed]);

  const handlePlay = () => {
    computeMax();
    setStarted(true);

    const shouldScroll = needsScrollRef.current;

    setCountdown(3);
    if (tickTimerRef.current) clearInterval(tickTimerRef.current);

    tickTimerRef.current = setInterval(() => {
      setCountdown((c) => {
        const next = c - 1;
        if (next <= 0) {
          clearInterval(tickTimerRef.current);
          tickTimerRef.current = null;
          setRunning(true);

          if (!shouldScroll) {
            // static mode – still counts time
          }
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const handlePause = () => {
    setRunning(false);
    if (tickTimerRef.current) {
      clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
    setCountdown(0);
  };

  const handleReset = () => {
    handlePause();
    const el = boxRef.current;
    if (el) el.scrollTop = 0;
    setOffset(0);
    setStarted(false);
    setElapsed(0);
    setTimeout(computeMax, 50);
  };

  const saveSessionTime = () => {
    if (onSaveSession) onSaveSession(elapsed);
  };

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 1100 }}>
      <div className="mode-tabbar">Teleprompter</div>

      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        <button className="button" onClick={handlePlay} disabled={running || countdown > 0}>
          Play
        </button>
        <button className="button" onClick={handlePause} disabled={!running && countdown <= 0}>
          Pause
        </button>
        <button className="button" onClick={handleReset}>
          Reset
        </button>

        <button className="button" onClick={saveSessionTime} disabled={!started}>
          Save Time
        </button>

        <div className="pill">
          {countdown > 0 ? `Starting in ${countdown}…` : running ? "Playing" : started ? "Paused" : "Ready"}
        </div>

        <div className="pill">
          Time: {Math.floor(elapsed)}s / Est: {estSeconds}s ({wordCount} words)
        </div>
      </div>

      <div className="row" style={{ gap: 16, flexWrap: "wrap", marginTop: 10 }}>
        <label className="pill">
          Speed
          <input
            type="range"
            min={10}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: 10 }}
          />
          <span style={{ marginLeft: 8 }}>{speed}</span>
        </label>

        <label className="pill">
          Font
          <input
            type="range"
            min={18}
            max={64}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            style={{ marginLeft: 10 }}
          />
          <span style={{ marginLeft: 8 }}>{fontSize}px</span>
        </label>

        <label className="pill">
          WPM
          <input
            type="number"
            min={60}
            max={260}
            value={targetWPM}
            onChange={(e) => setTargetWPM(Number(e.target.value))}
            style={{ marginLeft: 10, width: 80 }}
          />
        </label>

        <label className="pill">
          Mirror
          <input
            type="checkbox"
            checked={mirror}
            onChange={(e) => setMirror(e.target.checked)}
            style={{ marginLeft: 10 }}
          />
        </label>

        <div className="pill">{needsScroll ? "Scrolling mode" : "Static mode (fits on screen)"}</div>
      </div>

      <div
        ref={boxRef}
        className="tele-box"
        style={{
          marginTop: 14,
          height: 360,
          overflowY: "auto",
          borderRadius: 12,
          padding: 18,
          background: "#0f1116",
          color: "#eaeef7",
          transform: mirror ? "scaleX(-1)" : "none"
        }}
      >
        <div style={{ transform: mirror ? "scaleX(-1)" : "none" }}>
          <pre style={{ margin: 0, fontSize, whiteSpace: "pre-wrap", lineHeight: 1.35 }}>{text}</pre>
        </div>
      </div>

      <div className="small" style={{ marginTop: 10, opacity: 0.8 }}>
        Scroll offset: {Math.round(offset)}px
      </div>
    </div>
  );
}

/* =========================================================
   Teleprompter Studio (script picker + line slicing)
   ========================================================= */

function TeleprompterStudio({ onSaveSession }) {
  const SCRIPT_SETS = useMemo(
    () => [
      { key: "Initial_Scripting", label: "Initial_Scripting", lines: Initial_Scripting },
      { key: "Buying_Questions", label: "Buying_Questions", lines: Buying_Questions },
      { key: "Objection", label: "Objection", lines: Objection },
      { key: "Procrastinations", label: "Procrastinations", lines: Procrastinations }
    ],
    []
  );

  const [choice, setChoice] = useState(SCRIPT_SETS[0].key);
  const active = SCRIPT_SETS.find((s) => s.key === choice) || SCRIPT_SETS[0];
  const totalLines = active.lines?.length || 0;

  const [startLine, setStartLine] = useState(1);
  const [endLine, setEndLine] = useState(Math.max(1, totalLines));

  // Reset range on script change so short sets don't look blank
  useEffect(() => {
    setStartLine(1);
    setEndLine(Math.max(1, active.lines?.length || 1));
  }, [choice]); // eslint-disable-line

  const clampedStart = Math.max(1, Math.min(startLine, endLine));
  const clampedEnd = Math.max(clampedStart, Math.min(endLine, totalLines));

  const sliced = useMemo(
    () => (active.lines || []).slice(clampedStart - 1, clampedEnd),
    [active, clampedStart, clampedEnd]
  );

  const teleText = useMemo(() => (sliced || []).join("\n\n"), [sliced]);

  const resetRange = () => {
    setStartLine(1);
    setEndLine(Math.max(1, totalLines));
  };

  const applyFullScriptPreset = () => {
    setStartLine(1);
    setEndLine(Math.max(1, totalLines));
  };

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 1100 }}>
      <div className="mode-tabbar">Teleprompter Studio</div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr 1fr", marginBottom: 10 }}>
        <div>
          <label className="category-label">Script</label>
          <select className="category-picker" value={choice} onChange={(e) => setChoice(e.target.value)}>
            {SCRIPT_SETS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="category-label">Start line</label>
          <input
            type="number"
            min={1}
            max={Math.max(1, totalLines)}
            value={clampedStart}
            onChange={(e) => setStartLine(Number(e.target.value) || 1)}
          />
        </div>
        <div>
          <label className="category-label">End line</label>
          <input
            type="number"
            min={1}
            max={Math.max(1, totalLines)}
            value={clampedEnd}
            onChange={(e) => setEndLine(Number(e.target.value) || totalLines)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
        <button className="button" type="button" onClick={resetRange}>
          Reset Range
        </button>
        <button className="button" type="button" onClick={applyFullScriptPreset}>
          Full Script
        </button>
      </div>

      <div className="small" style={{ color: "#666", marginBottom: 8 }}>
        Using lines {clampedStart}–{clampedEnd} of {totalLines} ({sliced.length} lines)
      </div>

      <TeleprompterReader text={teleText} onSaveSession={onSaveSession} />
    </div>
  );
}

/* =========================================================
   App
   ========================================================= */

function App() {
  const user = getCurrentUser();

  const [mode, setMode] = useState("teleprompter");
  const [saveNotice, setSaveNotice] = useState("");

  const [boards, setBoards] = useState({
    overall: [],
    teleBasic: [],
    teleAdv: [],
    quizScript: [],
    quizUrgency: [],
    aura: []
  });

  const refreshBoards = async () => {
    setBoards({
      overall: getOverall(),
      teleBasic: getBoard("teleprompter-time"),
      teleAdv: getBoard("teleprompter-advanced"),
      quizScript: getBoard("quiz-script"),
      quizUrgency: getBoard("quiz-urgency"),
      aura: getAuraBoard()
    });
  };

  useEffect(() => {
    refreshBoards();
    // eslint-disable-next-line
  }, []);

  const handleTeleSave = (seconds) => {
    const nickname = user?.displayName || user?.username || "Anon";
    const capped = Math.max(0, Math.min(3600, Number(seconds) || 0));
    recordScore("teleprompter-time", capped, 3600);
    refreshBoards();
    setSaveNotice(`Saved ${Math.round(capped)}s for ${nickname}`);
    setTimeout(() => setSaveNotice(""), 2500);
  };

  const logout = () => {
    doLogout();
    window.location.reload();
  };

  const storedKey = readUserKey();
  const [key, setKey] = useState(storedKey || "");

  const saveKey = () => {
    writeUserKey(key);
    setSaveNotice("Saved key");
    setTimeout(() => setSaveNotice(""), 2000);
  };

  return (
    <AuthGate>
      <div className="app">
        <div className="topbar">
          <div className="brand">
            <div className="title">POWER IN YOUR POCKET</div>
            <div className="subtitle">Training Tools</div>
          </div>

          <div className="top-actions">
            <div className="pill">
              Logged in: <strong>{user?.displayName || user?.username || "User"}</strong>
            </div>

            <button className="button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        {/* ✅ Blue tab bar background (inline so it won’t depend on CSS and won’t error) */}
        <div
          className="tabs"
          style={{
            background:
              "linear-gradient(180deg, rgba(30, 94, 255, 0.30), rgba(0, 170, 255, 0.14))",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 12,
            maxWidth: 1100,
            margin: "12px auto 18px",
            boxShadow: "0 16px 36px rgba(0,0,0,0.25)"
          }}
        >
          <button className={`tab ${mode === "teleprompter" ? "active" : ""}`} onClick={() => setMode("teleprompter")}>
            📜 Teleprompter
          </button>

          <button className={`tab ${mode === "teleStudio" ? "active" : ""}`} onClick={() => setMode("teleStudio")}>
            🎛️ Studio
          </button>

          <button className={`tab ${mode === "flashcards" ? "active" : ""}`} onClick={() => setMode("flashcards")}>
            🧠 Flashcards
          </button>

          <button className={`tab ${mode === "dice" ? "active" : ""}`} onClick={() => setMode("dice")}>
            🎲 Dice
          </button>

          <button className={`tab ${mode === "quizzes" ? "active" : ""}`} onClick={() => setMode("quizzes")}>
            ✅ Quizzes
          </button>

          <button className={`tab ${mode === "urgency" ? "active" : ""}`} onClick={() => setMode("urgency")}>
            ⚡ Urgency
          </button>

          <button
            className={`tab ${mode === "leaderboards" ? "active" : ""}`}
            onClick={() => setMode("leaderboards")}
          >
            🏆 Leaderboards
          </button>
        </div>

        {saveNotice ? <div className="notice">{saveNotice}</div> : null}

        <div className="content">
          {mode === "teleprompter" && (
            <TeleprompterReader text={(Initial_Scripting || []).join("\n\n")} onSaveSession={handleTeleSave} />
          )}

          {mode === "teleStudio" && <TeleprompterStudio onSaveSession={handleTeleSave} />}

          {mode === "flashcards" && <FlashcardsStudy />}

          {mode === "dice" && <FlashCardDice />}

          {mode === "quizzes" && <MultiQuizTabs />}

          {mode === "urgency" && <UrgencyTraining />}

          {mode === "leaderboards" && <LeaderboardsPage boards={boards} />}
        </div>

        <div className="card" style={{ maxWidth: 1100, textAlign: "left" }}>
          <div className="mode-tabbar">Settings</div>
          <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
            <label className="pill">
              User Key:
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Optional key"
                style={{ marginLeft: 10, width: 280 }}
              />
            </label>
            <button className="button" onClick={saveKey}>
              Save Key
            </button>
          </div>

          <div style={{ marginTop: 14 }}>
            <Leaderboard title="Overall" rows={boards.overall} />
            <Leaderboard title="Teleprompter Time" rows={boards.teleBasic} />
            <Leaderboard title="Quiz Script" rows={boards.quizScript} />
            <Leaderboard title="Quiz Urgency" rows={boards.quizUrgency} />
            <Leaderboard title="Aura" rows={boards.aura} />
          </div>

          <div style={{ marginTop: 24, fontSize: 12, color: "#777" }}>
            © {new Date().getFullYear()} Phoenix — Training tools for performance
          </div>
        </div>
      </div>
    </AuthGate>
  );
}

export default App;
