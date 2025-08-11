import React from "react";
import Leaderboard from "./Leaderboard";

/**
 * Props:
 *  - boards: { overall, flash, teleBasic, teleAdv, quizScript, quizUrgency }
 *  - onRefresh: () => void
 */
export default function LeaderboardsPage({ boards, onRefresh }) {
  return (
    <div className="card" style={{ maxWidth: 1100 }}>
      {/* Royal gold/purple tab bar */}
      <div
        className="mode-tabbar"
        style={{
          background: "linear-gradient(135deg, #FFD700 0%, #E6C200 30%, #6A0DAD 100%)",
          color: "#1e1140",
          fontWeight: 900,
          letterSpacing: 0.3,
          textShadow: "0 1px 0 rgba(255,255,255,0.4)"
        }}
      >
        Leaderboards 👑
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        <Leaderboard title="Overall" scores={boards.overall} />
        <Leaderboard title="Flashcards" scores={boards.flash} />
        <Leaderboard title="Teleprompter (Basic)" scores={boards.teleBasic} />
        <Leaderboard title="Teleprompter (Advanced)" scores={boards.teleAdv} />
        <Leaderboard title="Quiz: Script" scores={boards.quizScript} />
        <Leaderboard title="Quiz: Urgency" scores={boards.quizUrgency} />
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="button secondary" onClick={onRefresh}>Refresh</button>
      </div>

      <div className="small" style={{ marginTop: 8 }}>
        (Scores save in this browser and auto‑reset each January 1.)
      </div>
    </div>
  );
}
