import React, { useEffect, useMemo, useState } from "react";
import slides from "./urgencySlides";
import { getCurrentUser } from "./Accounts";

/**
 * Walkthrough slides with per-user completion tracking.
 * - Shows a progress bar
 * - "Mark Complete" logs completion for that slide
 * - "Continue Studying" lets you review slides without changing completion
 */
export default function UrgencyTraining() {
  const user = getCurrentUser();
  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(() => {
    const key = `user:${user?.username}:urgencyProgress`;
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  });

  const total = slides.length;
  const key = `user:${user?.username}:urgencyProgress`;

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(completed));
  }, [completed, key]);

  const pct = Math.round(((completed.length) / total) * 100);

  const markComplete = () => {
    if (!completed.includes(index)) {
      setCompleted(prev => [...prev, index]);
    }
    if (index < total - 1) setIndex(i => i + 1);
  };

  const resetProgress = () => setCompleted([]);

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 820 }}>
      <div className="mode-tabbar">Urgency Training</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
        <div>Slide {index + 1} / {total}</div>
        <div>Completed: {completed.length}/{total} ({pct}%)</div>
      </div>

      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <h3 style={{ marginTop: 14 }}>{slides[index].title}</h3>
      <div style={{
        margin: "8px 0 14px", padding: 12, borderRadius: 10, background: "#fff",
        boxShadow: "0 1px 4px #0001", whiteSpace: "pre-wrap", lineHeight: 1.5
      }}>
        {slides[index].body}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="button" onClick={() => index > 0 && setIndex(i => i - 1)} disabled={index === 0}>
          Previous
        </button>
        <button className="button" onClick={() => index < total - 1 && setIndex(i => i + 1)} disabled={index === total - 1}>
          Next
        </button>
        <button className="button" onClick={markComplete}>
          Mark Complete
        </button>
        <button className="button" onClick={() => { /* Continue studying: just show next without recording */ setIndex(i => Math.min(i + 1, total - 1)); }}>
          Continue Studying
        </button>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="button" onClick={() => setIndex(0)}>Restart Slides</button>
        <button className="button" onClick={resetProgress}>Reset Progress</button>
      </div>

      {user && (
        <div style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          Progress saved for <b>{user.displayName || user.username}</b>
        </div>
      )}
    </div>
  );
}
