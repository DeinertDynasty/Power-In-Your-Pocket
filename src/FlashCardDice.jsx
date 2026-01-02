import React, { useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "./Accounts";
import { addAuraPoints } from "./LeaderboardService";
import flashcardsDefault from "./flashcards";

// N-sided dice study that pulls from the ENTIRE flashcard deck (all categories).

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
  return flat.reverse();
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * props:
 * - cards: array of flashcards (optional)
 */
export default function FlashCardDice({ cards }) {
  const user = getCurrentUser();

  // ✅ Use passed cards if provided, otherwise fall back to default import.
  const sourceCards = cards && Array.isArray(cards) ? cards : flashcardsDefault;

  const allCards = useMemo(() => {
    const flat = flattenCards(sourceCards);
    return flat
      .map((c, idx) => ({
        id: idx,
        q: c.q || c.question || "",
        a: c.a || c.answer || "",
        category: c.category || "General",
      }))
      .filter((c) => c.q && c.a);
  }, [sourceCards]);

  const [rolling, setRolling] = useState(false);
  const [face, setFace] = useState(1);
  const [pickedIdx, setPickedIdx] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const [aura, setAura] = useState(() => {
    try { return Number(localStorage.getItem(AURA_KEY(user)) || 0); }
    catch { return 0; }
  });

  const [mastered, setMastered] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MASTER_KEY(user)) || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(AURA_KEY(user), String(aura)); } catch {}
  }, [aura, user]);

  useEffect(() => {
    try { localStorage.setItem(MASTER_KEY(user), JSON.stringify(mastered)); } catch {}
  }, [mastered, user]);

  const total = allCards.length;

  const currentCard = useMemo(() => {
    if (!total || pickedIdx == null) return null;
    return allCards[pickedIdx] || null;
  }, [allCards, pickedIdx, total]);

  const roll = () => {
    if (!total) return;
    setRolling(true);
    setShowAnswer(false);

    // animate rolling briefly
    const start = Date.now();
    const interval = setInterval(() => {
      setFace(randInt(1, Math.min(20, total))); // face display only
    }, 70);

    setTimeout(() => {
      clearInterval(interval);

      // choose a random card index
      const idx = randInt(0, total - 1);
      setPickedIdx(idx);
      setFace((idx % Math.min(20, total)) + 1);
      setRolling(false);
    }, 650);
  };

  const markMastered = () => {
    if (!currentCard) return;
    if (!mastered.includes(currentCard.id)) {
      setMastered((m) => [...m, currentCard.id]);
      setAura((a) => a + 2);
      addAuraPoints(2);
    }
    roll();
  };

  if (!total) {
    return (
      <div className="card">
        <div className="mode-tabbar">Flashcard Dice</div>
        <p>No flashcards found for Dice.</p>
        <p style={{ opacity: 0.7 }}>
          Fix: make sure you’re passing <code>cards</code> or that <code>flashcards.js</code> exports a default deck.
        </p>
      </div>
    );
  }

  const masteredPct = Math.round((mastered.length / total) * 100);

  return (
    <div className="card" style={{ textAlign: "left", maxWidth: 900 }}>
      <div className="mode-tabbar">Flashcard Dice 🎲</div>

      <div style={{ display: "flex", justifyContent: "space-between", color: "#666", marginBottom: 10 }}>
        <div>
          Deck: <b>{total}</b> cards • Mastered: <b>{mastered.length}</b> ({masteredPct}%)
        </div>
        <div>
          Aura: <b>{aura}</b>
        </div>
      </div>

      <div className="progress-outer">
        <div className="progress-inner" style={{ width: `${masteredPct}%` }} />
      </div>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
        <div style={{
          width: 78, height: 78, borderRadius: 18,
          display: "grid", placeItems: "center",
          border: "1px solid rgba(0,0,0,0.15)",
          background: "rgba(255,255,255,0.9)",
          fontWeight: 900, fontSize: 28
        }}>
          {face}
        </div>

        <button className="button" onClick={roll} disabled={rolling}>
          {rolling ? "Rolling..." : "Roll"}
        </button>

        {currentCard && (
          <>
            <button className="button secondary" onClick={() => setShowAnswer((s) => !s)}>
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </button>

            <button className="button" onClick={markMastered} disabled={rolling}>
              Mastered (+2 Aura)
            </button>
          </>
        )}
      </div>

      {currentCard && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 18, whiteSpace: "pre-wrap" }}>
            {currentCard.q}
          </div>

          <div style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "#fff",
            whiteSpace: "pre-wrap",
            opacity: showAnswer ? 1 : 0.5
          }}>
            {showAnswer ? currentCard.a : "Answer hidden"}
          </div>

          <div style={{ marginTop: 10, color: "#666" }}>
            Category: <b>{currentCard.category}</b>
          </div>
        </div>
      )}
    </div>
  );
}
