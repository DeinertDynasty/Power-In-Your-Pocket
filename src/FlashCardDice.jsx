import React, { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "./Accounts";
import { addAuraPoints } from "./LeaderboardService";

// N‑sided dice study that pulls from the ENTIRE flashcard deck (all categories).

const AURA_KEY = (u) => `user:${u?.username || "anon"}:auraPoints`;
const MASTER_KEY = (u) => `user:${u?.username || "anon"}:flashMastered`;

function flattenCards(cards) {
  if (!Array.isArray(cards)) return [];
  const flat = [];
  const stack = [...cards];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) stack.push(...item);
    else flat.push(item);
  }
  return flat;
}

export default function FlashCardDice({ cards = [] }) {
  const user = getCurrentUser();

  // Use EVERY flashcard (all categories)
  const allCards = useMemo(() => {
    const flat = flattenCards(cards);
    return flat.map((c, idx) => ({
      id: idx,
      q: c.q || c.question || "",
      a: c.a || c.answer || "",
      category: c.category || "General",
    })).filter(c => c.q && c.a);
  }, [cards]);

  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState(1);          // shows 1..N
  const [pickedIdx, setPickedIdx] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);

  // Per-user Aura + mastered
  const [aura, setAura] = useState(() => Number(localStorage.getItem(AURA_KEY(user)) || 0));
  const [mastered, setMastered] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem(MASTER_KEY(user)) || "[]")); }
    catch { return new Set(); }
  });

  const activeCards = useMemo(() => allCards.filter(c => !mastered.has(c.id)), [allCards, mastered]);
  const N = activeCards.length;

  useEffect(() => { localStorage.setItem(AURA_KEY(user), String(aura)); }, [aura, user]);
  useEffect(() => { localStorage.setItem(MASTER_KEY(user), JSON.stringify([...mastered])); }, [mastered, user]);

  const roll = () => {
    if (!N) return;
    setRolling(true);
    setPickedIdx(null);

    const steps = 22 + Math.floor(Math.random() * 12); // ~1s
    let t = 0;
    const timer = setInterval(() => {
      const next = (t % N) + 1;   // cycle 1..N
      setFace(next);
      t += 1;
      if (t >= steps) {
        clearInterval(timer);
        const finalFace = Math.floor(Math.random() * N) + 1;
        setFace(finalFace);
        setPickedIdx(finalFace - 1);
        setRolling(false);
      }
    }, Math.max(28, 85 - Math.min(N, 40)));
  };

  const currentCard = (N && pickedIdx != null) ? activeCards[pickedIdx] : null;

  const markMastered = () => {
    if (!currentCard) return;
    const next = new Set(mastered); next.add(currentCard.id);
    setMastered(next);

    // Aura +5
    setAura(a => a + 5);
    addAuraPoints(5);

    setShowCongrats(true);
    setTimeout(() => setShowCongrats(false), 1200);
  };

  const resetAll = () => {
    setMastered(new Set());
    setAura(0);
    setPickedIdx(null);
    setFace(1);
  };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Flashcard Dice Study (All Cards)</div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <button className="button" onClick={roll} disabled={rolling || !N}>
          {rolling ? "Rolling…" : `Roll ${N || 0}-Sided Die`}
        </button>

        <div style={{
          minWidth: 74, height: 58, borderRadius: 12, display: "grid", placeItems: "center",
          fontSize: 24, fontWeight: 800, border: "1px solid #999", padding: "0 10px",
          background: `linear-gradient(135deg, rgba(${40+((face%10)*20)},${40+((face%7)*12)},${120+((face%13)*7)},0.18), rgba(230,210,60,0.14))`
        }}>
          {N ? `${face} / ${N}` : "—"}
        </div>

        <div style={{ color: "#666" }}>
          Aura Points: <b>{aura}</b>
        </div>

        <button className="button secondary" onClick={resetAll}>Reset Cards & Aura</button>
      </div>

      {!allCards.length && <div>No flashcards found.</div>}
      {!!allCards.length && !N && (
        <div>All {allCards.length} cards mastered 🎉 — hit “Reset Cards & Aura” to study again.</div>
      )}

      {currentCard && (
        <div style={{ marginTop: 10 }}>
          <div className="category-label">Question</div>
          <div style={{ background: "#fff", border: "1px solid #cdd", borderRadius: 10, padding: 12 }}>
            {currentCard.q}
          </div>

          <div className="small" style={{ marginTop: 6, color: "#666" }}>
            Category: <b>{currentCard.category}</b>
          </div>

          <details style={{ marginTop: 10 }}>
            <summary className="category-label">Show Answer</summary>
            <div style={{ background: "#fff", border: "1px solid #cdd", borderRadius: 10, padding: 12, marginTop: 6, whiteSpace: "pre-wrap" }}>
              {currentCard.a}
            </div>
          </details>

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="button" onClick={markMastered}>I’ve Memorized This</button>
            <button className="button secondary" onClick={roll}>Roll Again</button>
          </div>
        </div>
      )}

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
