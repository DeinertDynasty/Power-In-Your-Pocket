import React from "react";
import Leaderboard from "./Leaderboard";

/**
 * A single page showing all leaderboards together.
 * Props:
 *  - boards: { overall, flash, teleBasic, teleAdv, quizScript, quizUrgency }
 *  - onRefresh: () => void
 */
export default function LeaderboardsPage({ boards, onRefresh }) {
  return (
    <div className="card" style={{ maxWidth: 1100 }}>
      <div className="mode-tabbar">Leaderboards</div>

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
        (Scores are stored locally in this browser.)
      </div>
    </div>
  );
}
