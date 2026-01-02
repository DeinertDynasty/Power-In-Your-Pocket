import React, { useEffect, useMemo, useRef, useState } from "react";
import "./PowerStyle.css";

import AuthGate from "./AuthGate";
import Leaderboard from "./Leaderboard";
import MultiQuizTabs from "./MultiQuizTabs";
import FlashcardsStudy from "./FlashcardsStudy";
import FlashCardDice from "./FlashCardDice";
import UrgencyTraining from "./UrgencyTraining";
import LeaderboardsPage from "./LeaderboardsPage";
import ErrorBoundary from "./ErrorBoundary";

import { recordScore, getBoard, getOverall, getAuraBoard } from "./LeaderboardService";
import { getCurrentUser, logout as doLogout, readUserKey, writeUserKey } from "./Accounts";

import flashcards from "./flashcards";
import { Buying_Questions, Procrastinations, Initial_Scripting, Objection } from "./script";

/* =========================================================
   Teleprompter Reader (scrolling + line highlight)
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
  const maxRef = useRef(1);
  const needsScrollRef = useRef(false);

  const lineRefs = useRef([]);
  const [activeLine, setActiveLine] = useState(0);

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed); // px/sec
  const [font, setFont] = useState(defaultFont);
  const [mirror, setMirror] = useState(defaultMirror);

  const lines = useMemo(() => {
    // Render line-by-line so we can highlight the active line.
    // Keep blanks so your "" pauses show as spacing.
    return String(text || "").split("\n");
  }, [text]);

  const stop = () => {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    lastTSRef.current = 0;
  };

  const updateActive = () => {
    const box = boxRef.current;
    if (!box) return;

    // Reading zone: upper-middle of the viewport feels most natural.
    const targetY = box.scrollTop + box.clientHeight * 0.33;

    let best = 0;
    for (let i = 0; i < lineRefs.current.length; i++) {
      const el = lineRefs.current[i];
      if (!el) continue;
      if (el.offsetTop <= targetY + 2) best = i;
      else break;
    }
    setActiveLine(best);
  };

  const step = (ts) => {
    if (!running) return;
    const box = boxRef.current;
    if (!box) return;

    if (!lastTSRef.current) lastTSRef.current = ts;
    const dt = ts - lastTSRef.current;
    lastTSRef.current = ts;

    const dy = (speed * dt) / 1000;
    box.scrollTop = box.scrollTop + dy;

    const atEnd = Math.ceil(box.scrollTop + box.clientHeight) >= maxRef.current - 2;
    updateActive();

    if (atEnd) {
      stop();
      return;
    }

    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const recompute = () => {
      maxRef.current = box.scrollHeight;
      needsScrollRef.current = box.scrollHeight > box.clientHeight + 2;
      updateActive();
    };

    recompute();
    const id = setTimeout(recompute, 50);
    window.addEventListener("resize", recompute);

    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", recompute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, font]);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const onScroll = () => updateActive();
    box.addEventListener("scroll", onScroll, { passive: true });

    return () => box.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (!running) return;
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed]);

  const toggle = () => {
    const box = boxRef.current;
    if (!box) return;
    if (!needsScrollRef.current) return;

    if (running) stop();
    else {
      lastTSRef.current = 0;
      setRunning(true);
      requestAnimationFrame(updateActive);
    }
  };

  const reset = () => {
    stop();
    if (boxRef.current) boxRef.current.scrollTop = 0;
    setActiveLine(0);
  };

  const save = () => {
    if (onSaveSession) onSaveSession({ text, speed, font, mirror });
  };

  return (
    <div className="card">
      <div className="mode-tabbar">Teleprompter</div>

      <div className="controls">
        <button className="button" onClick={toggle}>
          {running ? "Stop" : "Play"}
        </button>
        <button className="button secondary" onClick={reset}>
          Reset
        </button>
        <button className="button secondary" onClick={() => setMirror((m) => !m)}>
          Mirror: {mirror ? "On" : "Off"}
        </button>

        <div className="slider">
          <span className="label">Speed</span>
          <input
            type="range"
            min={10}
            max={200}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
          <span className="value">{speed}</span>
        </div>

        <div className="slider">
          <span className="label">Font</span>
          <input
            type="range"
            min={18}
            max={64}
            value={font}
            onChange={(e) => setFont(Number(e.target.value))}
          />
          <span className="value">{font}px</span>
        </div>

        <button className="button secondary" onClick={save}>
          Save Session
        </button>
      </div>

      <div
        ref={boxRef}
        className="teleBox"
        style={{
          fontSize: font,
          transform: mirror ? "scaleX(-1)" : "none"
        }}
      >
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="teleGap" />;
          }
          return (
            <div
              key={idx}
              ref={(el) => (lineRefs.current[idx] = el)}
              className={`teleLine ${idx === activeLine ? "active" : ""}`}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   Teleprompter Studio (multi script blocks)
   ========================================================= */
function TeleprompterStudio({ onSaveSession }) {
  const sections = useMemo(
    () => [
      { title: "Initial Scripting", arr: Initial_Scripting },
      { title: "Buying Questions", arr: Buying_Questions },
      { title: "Procrastinations", arr: Procrastinations },
      { title: "Objections", arr: Objection }
    ],
    []
  );

  const [active, setActive] = useState(0);
  const activeText = (sections[active]?.arr || []).join("\n\n");

  return (
    <div>
      <div className="tabs" style={{ marginBottom: 12 }}>
        {sections.map((s, i) => (
          <button
            key={s.title}
            className={`tab ${i === active ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <TeleprompterReader text={activeText} onSaveSession={onSaveSession} />
    </div>
  );
}

/* =========================================================
   App
   ========================================================= */
export default function App() {
  const user = getCurrentUser();

  const [mode, setMode] = useState("teleprompter");
  const [saveNotice, setSaveNotice] = useState("");

  useEffect(() => {
    const map = {
      teleprompter: "teleprompter",
      teleStudio: "teleprompter",
      flashcards: "flashcards",
      dice: "flashcards",
      quizzes: "quiz-script",
      urgency: "quiz-urgency",
      leaderboards: "teleprompter"
    };
    document.body.dataset.accent = map[mode] || "teleprompter";
  }, [mode]);

  const [boards, setBoards] = useState({
    overall: [],
    teleBasic: [],
    quizScript: [],
    quizUrgency: [],
    aura: []
  });

  const refreshBoards = () => {
    setBoards({
      overall: getOverall(),
      teleBasic: getBoard("teleprompter-time"),
      quizScript: getBoard("quiz-script"),
      quizUrgency: getBoard("quiz-urgency"),
      aura: getAuraBoard()
    });
  };

  useEffect(() => {
    refreshBoards();
  }, []);

  const nickname = user?.displayName || user?.username || "Anon";

  const handleTeleSave = ({ speed }) => {
    const capped = Math.max(0, Math.min(200, Number(speed || 0)));
    recordScore("teleprompter-time", capped, 200);
    refreshBoards();
    setSaveNotice(`Saved speed ${Math.round(capped)} for ${nickname}`);
    setTimeout(() => setSaveNotice(""), 2200);
  };

  const logout = () => {
    doLogout();
    window.location.reload();
  };

  const username = user?.username || "anon";
  const [key, setKey] = useState(() => readUserKey(username, "userKey", ""));

  const saveKey = () => {
    writeUserKey(username, "userKey", key);
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
            <div className="userpill">
              <span className="dot" />
              <span className="name">{nickname}</span>
            </div>

            <button className="button secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="tabs">
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

          <button className={`tab ${mode === "leaderboards" ? "active" : ""}`} onClick={() => setMode("leaderboards")}>
            🏆 Leaderboards
          </button>
        </div>

        {saveNotice ? <div className="notice">{saveNotice}</div> : null}

        <div className="content">
          <ErrorBoundary>
            {mode === "teleprompter" && (
              <TeleprompterReader
                text={(Initial_Scripting || []).join("\n\n")}
                onSaveSession={handleTeleSave}
              />
            )}

            {mode === "teleStudio" && <TeleprompterStudio onSaveSession={handleTeleSave} />}

            {mode === "flashcards" && <FlashcardsStudy />}

            {mode === "dice" && <FlashCardDice cards={flashcards} />}

            {mode === "quizzes" && <MultiQuizTabs />}

            {mode === "urgency" && <UrgencyTraining />}

            {mode === "leaderboards" && <LeaderboardsPage boards={boards} onRefresh={refreshBoards} />}
          </ErrorBoundary>

          <div className="card" style={{ maxWidth: 1100, margin: "0 auto 18px" }}>
            <div className="mode-tabbar">Settings</div>

            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ opacity: 0.9 }}>User Key</span>
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
              <Leaderboard title="Overall" scores={boards.overall} />
              <Leaderboard title="Teleprompter (Speed Saved)" scores={boards.teleBasic} />
              <Leaderboard title="Quiz: Script" scores={boards.quizScript} />
              <Leaderboard title="Quiz: Urgency" scores={boards.quizUrgency} />
              <Leaderboard title="Aura (Top 10)" scores={boards.aura} />
            </div>

            <div style={{ marginTop: 24, fontSize: 12, color: "#555" }}>
              © {new Date().getFullYear()} Phoenix — Training tools for performance
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}
