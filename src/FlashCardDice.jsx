import React, { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "./Accounts";

const AURA_KEY = (u) => `user:${u?.username || "anon"}:auraPoints`;
const MASTER_KEY = (u) => `user:${u?.username || "anon"}:flashMastered`;

export default function FlashcardDice({ cards = [] }) {
  const user = getCurrentUser();
  const [rolling, setRolling] = useState(false);
  const [die, setDie] = useState(1);
  const [showCongrats, setShowCongrats] = useState(false);
  const [aura, setAura] = useState(() => Number(localStorage.getItem(AURA_KEY(user)) || 0));
  const [mastered, setMastered] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(MASTER_KEY(user)) || "[]")); }
    catch { return new Set(); }
  });

  const activeCards = useMemo(() => cards
    .map((c, idx) => ({ ...c, id: idx }))
    .filter(c => !mastered.has(c.id)), [cards, mastered]);

  useEffect(() => {
    localStorage.setItem(AURA_KEY(user), String(aura));
  }, [aura, user]);

  useEffect(() => {
    localStorage.setItem(MASTER_KEY(user), JSON.stringify(Array.from(mastered)));
  }, [mastered, user]);

  const roll = () => {
    if (!activeCards.length) return;
    setRolling(true);
    let t = 0, n = 0;
    const timer = setInterval(() => {
      n = (Math.floor(Math.random() * 6) + 1);
      setDie(n);
      t += 1;
      // subtle color change is via CSS gradient below (based on die)
      if (t > 18) { // ~1s
        clearInterval(timer);
        setRolling(false);
      }
    }, 55);
  };

  // Pick card by modular index
  const currentCard = activeCards.length ? activeCards[(die - 1) % activeCards.length] : null;

  const markMastered = () => {
    if (!currentCard) return;
    const next = new Set(mastered);
    next.add(currentCard.id);
    setMastered(next);
    setAura(a => a + 5);
    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 1200);
  };

  const resetAll = () => {
    setMastered(new Set());
    setAura(0);
  };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Flashcard Dice Study</div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
        <button className="button" onClick={roll} disabled={rolling || !activeCards.length}>
          {rolling ? "Rolling…" : "Roll Dice"}
        </button>
        <div style={{
          width: 58, height: 58, borderRadius: 12, display: "grid", placeItems: "center",
          fontSize: 24, fontWeight: 800, border: "1px solid #999",
          // subtle color shifts while changing faces
          background: `linear-gradient(135deg, rgba(${40+die*20},${40+die*10},${120+die*15},0.18), rgba(230,210,60,0.14))`
        }}>
          {die}
        </div>
        <div style={{ color: "#666" }}>
          Aura Points: <b>{aura}</b>
        </div>
        <button className="button secondary" onClick={resetAll}>Reset Cards & Aura</button>
      </div>

      {!cards.length && <div>No flashcards found.</div>}
      {cards.length > 0 && !activeCards.length && (
        <div>All cards mastered 🎉 — hit “Reset Cards & Aura” to study again.</div>
      )}

      {currentCard && (
        <div style={{ marginTop: 10 }}>
          <div className="category-label">Question</div>
          <div style={{ background: "#fff", border: "1px solid #cdd", borderRadius: 10, padding: 12 }}>
            {currentCard.q || currentCard.question || "(missing q)"}
          </div>
          <details style={{ marginTop: 10 }}>
            <summary className="category-label">Show Answer</summary>
            <div style={{ background: "#fff", border: "1px solid #cdd", borderRadius: 10, padding: 12, marginTop: 6 }}>
              {currentCard.a || currentCard.answer || "(missing a)"}
            </div>
          </details>

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="button" onClick={markMastered}>I’ve Memorized This</button>
            <button className="button secondary" onClick={roll}>Roll Again</button>
          </div>
        </div>
      )}

      {/* ADHD-pleasing, short “Congrats + +5 Aura Points” flash */}
      {showCongrats && (
        <div style={{
          position: "fixed", inset: 0, display: "grid", placeItems: "center",
          pointerEvents: "none", zIndex: 9999
        }}>
          <div style={{
            padding: "22px 28px",
            borderRadius: 16,
            boxShadow: "0 8px 40px rgba(75,0,130,0.45)",
            background: "linear-gradient(135deg, rgba(255,215,0,0.95), rgba(128,0,128,0.92))",
            color: "#1a1033",
            textAlign: "center",
            transform: "scale(1)",
            animation: "popPulse 900ms ease-out"
          }}>
            <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: 1 }}>Congrats!</div>
            <div style={{ marginTop: 6, fontSize: 18, fontWeight: 800 }}>+5 Aura Points</div>
          </div>
          <style>{`
            @keyframes popPulse {
              0% { transform: scale(0.8); opacity: 0; }
              30% { transform: scale(1.08); opacity: 1; }
              60% { transform: scale(1.0); }
              100% { opacity: 0; transform: scale(0.98); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
