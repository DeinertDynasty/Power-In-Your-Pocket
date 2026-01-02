import React, { useEffect, useMemo, useState } from "react";
import flashcards from "./flashcards";
import { addAuraPoints } from "./LeaderboardService";

export default function FlashcardsStudy() {
  const deck = useMemo(() => {
    return (flashcards || [])
      .map(c => ({
        q: c.question || "",
        a: c.answer || "",
        category: c.category || "General"
      }))
      .filter(c => c.q && c.a);
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(deck.map(d => d.category)))],
    [deck]
  );

  const [filter, setFilter] = useState("All");
  const filtered = useMemo(
    () => (filter === "All" ? deck : deck.filter(d => d.category === filter)),
    [deck, filter]
  );

  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setI(0);
    setShow(false);
    setScore(0);
  }, [filter]);

  if (!filtered.length) {
    return (
      <div className="card">
        <div className="mode-tabbar">Flashcards</div>
        <p>No flashcards found.</p>
      </div>
    );
  }

  const current = filtered[i];

  const next = () => {
    if (i < filtered.length - 1) {
      setI(i + 1);
      setShow(false);
    }
  };

  const correct = () => {
    setScore(s => s + 1);
    addAuraPoints(3);
    next();
  };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Flashcards Study</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <label>Category</label>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          {categories.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
          {i + 1}/{filtered.length} • Score {score}
        </div>
      </div>

      <div style={{ fontWeight: 700, fontSize: 18, whiteSpace: "pre-wrap" }}>
        {current.q}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 12,
          borderRadius: 10,
          background: show ? "#fff" : "#f5fbff",
          border: "1px solid #dde6f5",
          whiteSpace: "pre-wrap"
        }}
      >
        {show ? current.a : "Tap to reveal answer"}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {!show && (
          <button className="button" onClick={() => setShow(true)}>
            Show Answer
          </button>
        )}
        {show && (
          <>
            <button className="button" onClick={correct}>
              Got it (+3 Aura)
            </button>
            <button className="button secondary" onClick={next}>
              Need Practice
            </button>
          </>
        )}
      </div>
    </div>
  );
}

