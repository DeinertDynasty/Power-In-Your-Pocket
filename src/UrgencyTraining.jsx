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
  const username = user?.username || "anon";

  const key = useMemo(() => `user:${username}:urgencyProgress`, [username]);

  const total = slides?.length || 0;

  const [index, setIndex] = useState(0);
  const [completed, setCompleted] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Keep completed saved
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(completed));
    } catch {
      // ignore storage failures
    }
  }, [completed, key]);

  // Clamp index if slide count changes
  useEffect(() => {
    setIndex((i) => {
      if (total <= 0) return 0;
      return Math.min(Math.max(i, 0), total - 1);
    });

    // If the deck shrank, drop completion indexes that no longer exist
    setCompleted((prev) => prev.filter((n) => Number.isInteger(n) && n >= 0 && n < total));
  }, [total]);

  const pct = total ? Math.round(((index + 1) / total) * 100) : 0;
  const completedPct = total ? Math.round((completed.length / total) * 100) : 0;

  const active = slides?.[index] || { title: "No slides", body: "" };

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));

  const markComplete = () => {
    setCompleted((prevList) => (prevList.includes(index) ? prevList : [...prevList, index]));
    next();
  };

  const resetProgress = () => setCompleted([]);

  const continueStudying = () => next();

  if (!total) {
    return (
      <div className="card" style={{ maxWidth: 820 }}>
        <div className="mode-tabbar">Urgency Training</div>
        <div>No slides loaded.</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 820 }}>
      <div className="mode-tabbar">Urgency Training</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
        <div>Slide {index + 1} / {total}</div>
        <div>Completed: {completed.length}/{total} ({completedPct}%)</div>
      </div>

      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${pct}%` }} />
      </div>

      <h3 style={{ marginTop: 14 }}>{active.title}</h3>

      <div
        style={{
          margin: "8px 0 14px",
          padding: 12,
          borderRadius: 10,
          background: "#fff",
          boxShadow: "0 1px 4px #0001",
          whiteSpace: "pre-wrap",
          lineHeight: 1.5
        }}
      >
        {active.body}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className="button" onClick={prev} disabled={index === 0}>Previous</button>
        <button className="button" onClick={next} disabled={index === total - 1}>Next</button>
        <button className="button" onClick={markComplete}>Mark Complete</button>
        <button className="button secondary" onClick={continueStudying}>Continue Studying</button>
        <button className="button secondary" onClick={resetProgress}>Reset Progress</button>
      </div>
    </div>
  );
}
