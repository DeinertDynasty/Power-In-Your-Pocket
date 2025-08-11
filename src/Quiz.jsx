import React, { useState } from "react";

/**
 * props:
 * - title: string
 * - items: [{ q, choices:[], answerIndex, explain }]
 * - scope: "quiz-script" | 
 * - onFinish({score,total,scope})
 */
export default function Quiz({ title, items, onFinish, scope }) {
  const questions = items || [];
  const total = questions.length;
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);

  const q = questions[i];

  const select = (idx) => {
    if (locked) return;
    setPicked(idx);
  };

  const submit = () => {
    if (picked == null) return;
    const isCorrect = picked === q.answerIndex;
    if (isCorrect) setScore((s) => s + 1);
    setLocked(true);
  };

  const next = () => {
    if (i === total - 1) {
      onFinish?.({ score, total, scope });
    } else {
      setI((x) => x + 1);
      setPicked(null);
      setLocked(false);
    }
  };

  if (!total) {
    return (
      <div className="card">
        <div className="mode-tabbar">{title}</div>
        <p>No questions yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">{title}</div>

      <div style={{ color: "#666", marginBottom: 8 }}>
        Question {i + 1} / {total}
      </div>

      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
        {q.q}
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        {q.choices.map((c, idx) => {
          const chosen = picked === idx;
          const correct = locked && idx === q.answerIndex;
          const wrong = locked && chosen && idx !== q.answerIndex;
          const bg = correct ? "#e7fff1" : wrong ? "#ffefef" : chosen ? "#eef7ff" : "#fff";
          const border = correct ? "1px solid #19a663" : wrong ? "1px solid #e33" : "1px solid #cdd";
          return (
            <button
              key={idx}
              className="button"
              onClick={() => select(idx)}
              style={{
                justifyContent: "flex-start",
                whiteSpace: "normal",
                textAlign: "left",
                background: bg,
                border,
                color: "#222",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="progress-outer" style={{ marginTop: 12 }}>
        <div className="progress-inner" style={{ width: `${((i + 1) / total) * 100}%` }} />
      </div>

      {!locked ? (
        <div style={{ marginTop: 10 }}>
          <button className="button" onClick={submit} disabled={picked == null}>
            Submit
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginTop: 10, fontWeight: 700, color: picked === q.answerIndex ? "#19a663" : "#e33" }}>
            {picked === q.answerIndex ? "Correct" : "Incorrect"}
          </div>
          {q.explain && (
            <div style={{ marginTop: 6, color: "#444" }}>
              {q.explain}
            </div>
          )}
          <div style={{ marginTop: 10 }}>
            <button className="button" onClick={next}>
              {i === total - 1 ? "Finish" : "Next"}
            </button>
          </div>
          <div style={{ marginTop: 10, color: "#0a8", fontWeight: 700 }}>
            Score: {score} / {total}
          </div>
        </>
      )}
    </div>
  );
}
