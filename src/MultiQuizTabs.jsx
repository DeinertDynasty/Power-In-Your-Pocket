import React, { useMemo, useState } from "react";
import Quiz from "./Quiz";
import TypingQuiz from "./TypingQuiz";

// helpers
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
const clip = (s,n)=> (s||"").length>n ? (s||"").slice(0,n-1)+"…" : (s||"");

function buildFlashcardMCQ(cards = []) {
  const base = (cards||[]).map(c=>({q:c.q||c.question||"",a:c.a||c.answer||""})).filter(c=>c.q&&c.a);
  return base.map((entry, idx) => {
    const wrongs = shuffle(base.filter((_,i)=>i!==idx).map(x=>x.a)).slice(0,3);
    const choices = shuffle([entry.a, ...wrongs]);
    return { q: entry.q, choices, answerIndex: choices.findIndex(x=>x===entry.a), explain: entry.a };
  });
}
function buildUrgencyMCQ(slides = []) {
  const base = (slides||[]).filter(s=>s?.title&&s?.body);
  return base.map((s, idx) => {
    const correct = s.title;
    const wrongs = shuffle(base.filter((_,i)=>i!==idx).map(x=>x.title)).slice(0,3);
    const choices = shuffle([correct, ...wrongs]);
    return { q: "Which slide title matches this summary?\n\n" + clip(s.body, 180),
             choices, answerIndex: choices.findIndex(x=>x===correct), explain: `Correct: ${correct}` };
  });
}
function buildTypingFromArrays(...arrays) {
  const pairs = [];
  for (const arr of arrays) {
    const lines = (arr||[]).map(s=>String(s||"").trim()).filter(Boolean);
    for (let i=0;i<lines.length-1;i++){
      const prompt = lines[i], expected = lines[i+1];
      if (prompt && expected) pairs.push({ prompt, expected });
    }
  }
  return shuffle(pairs).slice(0,40);
}

export default function MultiQuizTabs() {
  // only: flash | urg | type
  const [view, setView] = useState("menu");

  const flashcards = useMemo(() => {
    try { const m = require("./flashcards"); return m.default || m.cards || m.flashcards || []; }
    catch { return []; }
  }, []);

  const slides = useMemo(() => {
    try { const m = require("./urgencySlides"); return m.default || m.slides || []; }
    catch { return []; }
  }, []);

  const scriptSets = useMemo(() => {
    try {
      const mod = require("./script");
      const { Buying_Questions=[], Procrastinations=[], Initial_Scripting=[], Objection=[] } = mod || {};
      return [Initial_Scripting, Buying_Questions, Procrastinations, Objection];
    } catch { return []; }
  }, []);

  const flashItems = useMemo(() => buildFlashcardMCQ(flashcards), [flashcards]);
  const urgItems   = useMemo(() => buildUrgencyMCQ(slides), [slides]);
  const typingSet  = useMemo(() => buildTypingFromArrays(...scriptSets), [scriptSets]);

  const goBack = () => setView("menu");

  if (view !== "menu") {
    return (
      <div className="card" style={{ textAlign: "left" }}>
        <div className="mode-tabbar" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="button secondary" onClick={goBack}>← Back to Quizzes</button>
          <div style={{ fontWeight: 900 }}>
            {view === "flash" ? "Quiz: Flashcards"
            : view === "urg"   ? "Quiz: Urgency"
            : "Quiz: Script — Type Next Line"}
          </div>
        </div>

        {view === "flash" && <Quiz title="" items={flashItems} scope="quiz-flash" />}
        {view === "urg"   && <Quiz title="" items={urgItems} scope="quiz-urgency" />}
        {view === "type"  && <TypingQuiz title="" items={typingSet} scope="quiz-script-typing" />}
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Quizzes</div>

      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <QuizButton label="Flashcards (MCQ)" onClick={() => setView("flash")}
          bg="linear-gradient(135deg,#fffbe6,#fdf9ff)" border="1px solid rgba(255,215,0,.6)" />
        <QuizButton label="Urgency Slides (MCQ)" onClick={() => setView("urg")}
          bg="linear-gradient(135deg,#eef7ff,#ffffff)" border="1px solid #bcd7ff" />
        <QuizButton label="Script — Type Next Line" onClick={() => setView("type")}
          bg="linear-gradient(135deg,#f7e8ff,#ffffff)" border="1px solid rgba(106,13,173,.35)" />
      </div>
    </div>
  );
}

function QuizButton({ label, onClick, bg, border }) {
  return (
    <button
      className="button"
      onClick={onClick}
      style={{
        minHeight: 86,
        justifyContent: "flex-start",
        textAlign: "left",
        padding: "12px 14px",
        borderRadius: 14,
        background: bg,
        border,
        boxShadow: "0 2px 8px rgba(0,0,0,.06)",
        fontWeight: 800,
        fontSize: 16,
        color: "#2b1f3a"
      }}
    >
      {label}
    </button>
  );
}
