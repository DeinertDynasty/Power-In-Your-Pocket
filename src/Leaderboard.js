import React from "react";

export default function Leaderboard({ title, scores = [] }) {
  return (
    <div className="leaderboard">
      <h3>{title}</h3>
      {(!scores || scores.length === 0) ? (
        <div className="small" style={{ color: "#94a3b8" }}>No scores yet.</div>
      ) : (
        <ol>
          {scores.slice(0, 10).map((row, i) => (
            <li key={i}>
              <strong>{row.nickname || "Anon"}</strong> — {row.score}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
