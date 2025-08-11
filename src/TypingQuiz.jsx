import React, { useMemo, useState } from "react";
import { recordScore } from "./LeaderboardService";

function norm(s) {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .trim();
}

// Simple similarity (Dice coefficient). Accept ≥0.85 as correct-ish.
function similarity(a, b) {
  a = norm(a); b = norm(b);
  if (!a.length && !b.length) return 1;
  if (a === b) return 1;
  const bg = str => {
    const out = [];
    for (let i = 0; i < str.length - 1; i++) out.push(str.slice(i, i + 2));
    return out;
  };
  const A = bg(a), B = bg(b);
  const set = new Map();
  for (const x of A) set.set(x, (set.get(x) || 0) + 1);
  let inter = 0;
  for (const x of B) {
    const n = set.get(x) || 0;
    if (n) { inter++; set.set(x, n - 1); }
  }
  return (2 * inter) / (A.length + B.length || 1);
}

/**
 * items: [{ prompt, expected }]
 * scope: "quiz-script-typing"
 */
export default function TypingQuiz({ title, items = [], scope }) {
  const total = items.length;
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [locked, setLocked] = useState(false);
  const [ok, setOk] = useState(null);

  const q = items[i];

  const check = () => {
    const sim = similarity(text, q.expected);
    const correct = sim >= 0.85;
    setOk({ correct, sim: Number(sim.toFixed(2)) });
    if (correct) setScore(s => s + 1);
    setLocked(true);
  };

  const next = () => {
    if (i === total - 1) {
      recordScore(scope || "quiz-script-typing", score, total);
    } else {
      setI(x => x + 1);
      setText("");
      setLocked(false);
      setOk(null);
    }
  };

  if (!total) {
    return (
      <div className="card">
        <div className="mode-tabbar">{title}</div>
        <p>No typing items found.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">{title}</div>

      <div style={{ color: "#666", marginBottom: 8 }}>
        Item {i + 1} / {total}
      </div>

      <div style={{ fontSize: 18, marginBottom: 8 }}>
        <b>Previous line:</b> {q.prompt}
      </div>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type the next exact sentence…"
        rows={4}
        style={{ width: "100%", padding: 10, borderRadius: 10, border: "1px solid #bbb" }}
        disabled={locked}
      />

      {!locked ? (
        <div style={{ marginTop: 10 }}>
          <button className="button" onClick={check} disabled={!text.trim()}>Submit</button>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 10, fontWeight: 700, color: ok?.correct ? "#19a663" : "#e33" }}>
            {ok?.correct ? "Correct" : "Close / Incorrect"} {ok && <span style={{ color: "#666" }}>(sim {ok.sim})</span>}
          </div>
          {!ok?.correct && (
            <div style={{ marginTop: 6 }}>
              <div><b>Expected:</b> {q.expected}</div>
              <div><b>Your answer:</b> {text}</div>
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button className="button" onClick={next}>
              {i === total - 1 ? "Finish" : "Next"}
            </button>
          </div>
          <div style={{ marginTop: 10, color: "#0a8", fontWeight: 700 }}>
            Score: {score} / {total}
          </div>
        </>
      )}
    </div>
  );
}
