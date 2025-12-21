import React, { useEffect, useMemo, useState } from "react";
import { addAuraPoints } from "./LeaderboardService";

export default function FlashcardsStudy({ cards = [], onBack }) {
  // normalize deck
  const deck = useMemo(() => {
    return (cards || [])
      .map(c => ({
        q: c.q || c.question || "",
        a: c.a || c.answer || "",
        category: c.category || "General"
      }))
      .filter(c => c.q && c.a);
  }, [cards]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(deck.map(d => d.category)))], [deck]);
  const [filter, setFilter] = useState("All");
  const filtered = useMemo(() => (filter === "All" ? deck : deck.filter(d => d.category === filter)), [deck, filter]);

  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [flashCongrats, setFlashCongrats] = useState(false);

  useEffect(() => { setI(0); setShow(false); setScore(0); }, [filter]);

  const has = filtered.length > 0;
  const current = has ? filtered[i] : null;

  const next = () => {
    if (i < filtered.length - 1) { setI(i + 1); setShow(false); }
  };

  const markCorrect = () => {
    setScore(s => s + 1);
    // +3 Aura on correct
    addAuraPoints(3);
    setFlashCongrats(true);
    setTimeout(() => setFlashCongrats(false), 900);
    next();
  };

  const markIncorrect = () => { next(); };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button className="button secondary" onClick={onBack}>← Back</button>
        <div style={{ fontWeight: 900 }}>Flashcards Study</div>
      </div>

      {!has && <div>No flashcards found.</div>}

      {has && (
        <>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 8 }}>
            <label className="category-label" style={{ marginBottom: 0 }}>Category</label>
            <select className="category-picker" value={filter} onChange={e => setFilter(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="small" style={{ marginLeft: "auto", color: "#666" }}>
              Card {i + 1} / {filtered.length} • Score {score}
            </div>
          </div>

          <div className="progress-outer">
            <div className="progress-inner" style={{ width: `${((i + 1) / filtered.length) * 100}%` }} />
          </div>

          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 10, whiteSpace: "pre-wrap" }}>
            {current.q}
          </div>

          <div style={{
            margin: "10px 0 14px",
            padding: 12, borderRadius: 10,
            background: show ? "#fff" : "#f5fbff",
            border: "1px solid #ecf2fb",
            whiteSpace: "pre-wrap"
          }}>
            {show ? current.a : "Tap Show Answer to reveal."}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {!show && <button className="button" onClick={() => setShow(true)}>Show Answer</button>}
            {show && (
              <>
                <button className="button" onClick={markCorrect}>I got it right (+3 Aura)</button>
                <button className="button secondary" onClick={markIncorrect}>I need practice</button>
              </>
            )}
            <button className="button secondary" onClick={next} disabled={i >= filtered.length - 1}>Skip</button>
          </div>
        </>
      )}

      {/* quick "+3 Aura" flash */}
      {flashCongrats && (
        <div style={{
          position: "fixed", inset: 0, display: "grid", placeItems: "center",
          pointerEvents: "none", zIndex: 9999
        }}>
          <div style={{
            padding: "14px 18px",
            borderRadius: 14,
            boxShadow: "0 8px 40px rgba(75,0,130,0.35)",
            background: "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(128,0,128,0.92))",
            color: "#1a1033",
            fontWeight: 900,
            animation: "popPulseSmall 700ms ease-out"
          }}>
            +3 Aura
          </div>
          <style>{`
            @keyframes popPulseSmall {
              0% { transform: scale(0.85); opacity: 0; }
              35% { transform: scale(1.08); opacity: 1; }
              100% { transform: scale(0.98); opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
