// src/Leaderboard.js
import React from "react";

function Leaderboard({ scores }) {
  // Sort scores from highest to lowest
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 10); // Top 10

  return (
    <div style={{
      position: "fixed",
      top: 40,
      right: 20,
      width: 240,
      background: "#f6f8fa",
      borderRadius: 16,
      boxShadow: "0 2px 12px #0001",
      padding: "16px 18px",
      zIndex: 100,
      fontFamily: "Arial, sans-serif"
    }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 18 }}>🏆 Leaderboard</h3>
      {sorted.length === 0 ? (
        <div style={{ color: "#aaa" }}>No high scores yet</div>
      ) : (
        <ol style={{ paddingLeft: 20, margin: 0 }}>
          {sorted.map((entry, idx) => (
            <li key={idx} style={{ margin: "8px 0" }}>
              <b>{entry.nickname}</b>
              <span style={{ float: "right", color: "#0a8" }}>{entry.score}</span>
            </li>
          ))}
        </ol>
      )}
      <div style={{ fontSize: 11, color: "#bbb", marginTop: 10 }}>
        (Your device only)
      </div>
    </div>
  );
}

export default Leaderboard;
