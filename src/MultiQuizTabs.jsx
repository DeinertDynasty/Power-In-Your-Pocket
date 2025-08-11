import React, { useMemo, useState } from "react";
import Quiz from "./Quiz";
import TypingQuiz from "./TypingQuiz";
import FlashcardDice from "./FlashcardDice";
import { buildFlashcardMCQ, buildUrgencyMCQ, buildScriptTypingSet } from "./quizBuilders";

export default function MultiQuizTabs() {
  const [tab, setTab] = useState("flash");

  // Lazy-load sources; tolerate missing modules with fallbacks
  const flashcards = useMemo(() => {
    try {
      // Try common names you’ve used before
      const mod = require("./flashcards") || require("./FlashcardsData") || {};
      return mod.default || mod.cards || mod.flashcards || [];
    } catch { return []; }
  }, []);

  const slides = useMemo(() => {
    try {
      const mod = require("./urgencySlides") || {};
      return mod.default || mod.slides || [];
    } catch { return []; }
  }, []);

  const scriptGraph = useMemo(() => {
    try {
      const mod = require("./advancedScript") || {};
      return mod.default || mod.graph || {};
    } catch { return {}; }
  }, []);

  const flashItems = useMemo(() => buildFlashcardMCQ(flashcards), [flashcards]);
  const urgItems   = useMemo(() => buildUrgencyMCQ(slides), [slides]);
  const typingSet  = useMemo(() => buildScriptTypingSet(scriptGraph), [scriptGraph]);

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Quizzes</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <TabButton id="flash"  tab={tab} setTab={setTab} label="Flashcards (MCQ)" />
        <TabButton id="urg"    tab={tab} setTab={setTab} label="Urgency Slides (MCQ)" />
        <TabButton id="type"   tab={tab} setTab={setTab} label="Script — Type Next Line" />
        <TabButton id="dice"   tab={tab} setTab={setTab} label="Flashcard Dice Study" />
      </div>

      {tab === "flash" && (
        <Quiz title="Quiz: Flashcards" items={flashItems} scope="quiz-flash" />
      )}
      {tab === "urg" && (
        <Quiz title="Quiz: Urgency" items={urgItems} scope="quiz-urgency" />
      )}
      {tab === "type" && (
        <TypingQuiz title="Quiz: Script — Type Next Line" items={typingSet} scope="quiz-script-typing" />
      )}
      {tab === "dice" && (
        <FlashcardDice cards={flashcards} />
      )}
    </div>
  );
}

function TabButton({ id, tab, setTab, label }) {
  const active = tab === id;
  return (
    <button
      className="button"
      onClick={() => setTab(id)}
      style={{
        background: active ? "#f0f5ff" : "#fff",
        border: active ? "1px solid #89a" : "1px solid #cdd",
        color: "#222"
      }}
    >
      {label}
    </button>
  );
}
