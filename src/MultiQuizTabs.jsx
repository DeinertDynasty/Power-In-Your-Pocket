import React, { useMemo, useState } from "react";
import Quiz from "./Quiz";
import flashcards from "./flashcards";
import { Buying_Questions, Procrastinations, Initial_Scripting, Objection } from "./script";

// helpers
function shuffle(a) {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function buildFlashcardMCQ(cards) {
  const base = cards.map(c => ({
    q: c.question,
    a: c.answer
  }));

  return base.map((entry, idx) => {
    const wrongs = shuffle(
      base.filter((_, i) => i !== idx).map(x => x.a)
    ).slice(0, 3);

    const choices = shuffle([entry.a, ...wrongs]);

    return {
      q: entry.q,
      choices,
      answerIndex: choices.indexOf(entry.a),
      explain: entry.a
    };
  });
}

function buildTypingPairs(...arrays) {
  const lines = arrays.flat().filter(Boolean);
  const pairs = [];

  for (let i = 0; i < lines.length - 1; i++) {
    pairs.push({
      q: `Type the next line after:\n\n"${lines[i]}"`,
      choices: [lines[i + 1]],
      answerIndex: 0,
      explain: lines[i + 1]
    });
  }

  return shuffle(pairs).slice(0, 20);
}

export default function MultiQuizTabs() {
  const [view, setView] = useState("menu");

  const flashItems = useMemo(
    () => buildFlashcardMCQ(flashcards),
    []
  );

  const scriptItems = useMemo(
    () =>
      buildTypingPairs(
        Initial_Scripting,
        Buying_Questions,
        Procrastinations,
        Objection
      ),
    []
  );

  if (view === "flash") {
    return <Quiz title="Flashcards Quiz" items={flashItems} scope="quiz-flash" />;
  }

  if (view === "script") {
    return <Quiz title="Script Memory Quiz" items={scriptItems} scope="quiz-script" />;
  }

  return (
    <div className="card">
      <div className="mode-tabbar">Quizzes</div>

      <div style={{ display: "grid", gap: 12 }}>
        <button className="button" onClick={() => setView("flash")}>
          Flashcards (MCQ)
        </button>
        <button className="button" onClick={() => setView("script")}>
          Script Memory
        </button>
      </div>
    </div>
  );
}
