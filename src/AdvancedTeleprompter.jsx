import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Advanced Teleprompter with branching, timers, and rubric-based scoring.
 * Props:
 * - graph
 * - startId
 * - scope
 * - onFinish({ score, total, scope, raw, max, breakdown })
 */
export default function AdvancedTeleprompter({ graph, startId, scope, onFinish }) {
  const [nodeId, setNodeId] = useState(startId);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [smooth, setSmooth] = useState(false);

  const [rawScore, setRawScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [history, setHistory] = useState([]);
  const t0Ref = useRef(null);

  const node = graph[nodeId];

  const totalCheckpoints = useMemo(
    () => (Object.values(graph).filter(n => n.checkpoint).length || 1),
    [graph]
  );

  useEffect(() => {
    t0Ref.current = Date.now();
    setSelected(null);
    setLocked(false);
    setSmooth(false);
  }, [nodeId]);

  if (!node) {
    return (
      <div className="card">
        <div className="mode-tabbar">Teleprompter: Advanced</div>
        <p>Invalid script node. Check your advancedScript.js.</p>
      </div>
    );
  }

  const hasChoices = Array.isArray(node.choices) && node.choices.length > 0;
  const elapsedSec = () => (Date.now() - (t0Ref.current || Date.now())) / 1000;

  const assessTimingBonus = (sec) => (sec <= 8 ? 2 : sec <= 15 ? 1 : 0);

  const maxChoiceWeight = hasChoices ? Math.max(...node.choices.map(c => c.weight || 0)) : 0;
  const nodeMax = node.checkpoint ? maxChoiceWeight + 2 + 1 : 0; // choice + timing + smooth

  const submitChoice = () => {
    if (!hasChoices || selected == null) return;
    const sec = elapsedSec();
    const choice = node.choices[selected];
    const timingBonus = assessTimingBonus(sec);
    const smoothBonus = smooth ? 1 : 0;
    const choiceWeight = choice.weight || 0;

    if (node.checkpoint) {
      setRawScore(p => p + choiceWeight + timingBonus + smoothBonus);
      setMaxScore(p => p + nodeMax);
    }

    setHistory(p => [
      ...p,
      {
        id: node.id,
        choiceIdx: selected,
        weight: choiceWeight,
        timeSec: Number(sec.toFixed(1)),
        bonusTime: timingBonus,
        bonusSmooth: smoothBonus,
        explain: choice.explain || ""
      }
    ]);
    setLocked(true);
  };

  const goNext = () => {
    if (!hasChoices || selected == null) return finish();
    const nextId = node.choices[selected]?.next;
    if (!nextId || !graph[nextId]) return finish();
    setNodeId(nextId);
  };

  const finish = () => {
    const max = Math.max(maxScore, 1);
    const pct = Math.round((rawScore / max) * 100);
    onFinish?.({
      scope,
      score: pct,
      total: totalCheckpoints,
      raw: rawScore,
      max: maxScore,
      breakdown: history
    });
  };

  return (
    <div className="card" style={{ textAlign: "left" }}>
      <div className="mode-tabbar">Teleprompter: Advanced</div>

      <div style={{ color: "#666", marginBottom: 6 }}>
        Node: <b>{node.id}</b> {node.checkpoint ? "(scored)" : "(unscored)"}
      </div>

      <div style={{ fontSize: 18, color: "#555", marginBottom: 8 }}>
        <i>Homeowner:</i> {node.prompt}
      </div>

      {node.agent && (
        <div style={{
          fontSize: 20, lineHeight: 1.45, fontWeight: 700,
          background: "#fff", borderRadius: 10, padding: 12, boxShadow: "0 1px 4px #0001", marginBottom: 8
        }}>
          {node.agent}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center", margin: "8px 0 12px" }}>
        <div className="progress-outer" style={{ flex: 1 }}>
          <div className="progress-inner" style={{ width: "100%" }} />
        </div>
        <div style={{ fontSize: 14, color: "#333", minWidth: 110 }}>
          Time: {elapsedSec().toFixed(1)}s
        </div>
      </div>

      {hasChoices ? (
        <div style={{ display: "grid", gap: 8 }}>
          {node.choices.map((c, idx) => {
            const chosen = selected === idx;
            const isBest = c.weight >= maxChoiceWeight && maxChoiceWeight > 0;
            return (
              <button
                key={idx}
                className="button"
                onClick={() => setSelected(idx)}
                style={{
                  justifyContent: "flex-start",
                  whiteSpace: "normal",
                  textAlign: "left",
                  background: chosen ? "#eef7ff" : "#fff",
                  border: chosen ? "1px solid #79b" : "1px solid #cdd",
                  color: "#222"
                }}
              >
                {c.label}
                {isBest && <span style={{ marginLeft: 8, fontSize: 12, color: "#19a663" }}>(best)</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{ margin: "8px 0 12px", color: "#666" }}>(No choices at this node. Continue to finish.)</div>
      )}

      {node.checkpoint && (
        <label style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10 }}>
          <input type="checkbox" checked={smooth} onChange={(e) => setSmooth(e.target.checked)} />
          <span>✅ Smooth delivery (adds +1)</span>
        </label>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {!locked ? (
          <button className="button" onClick={submitChoice} disabled={hasChoices && selected == null}>
            Submit Choice
          </button>
        ) : (
          <button className="button" onClick={goNext}>Next</button>
        )}
        <button
          className="button"
          onClick={() => {
            setNodeId(startId);
            setSelected(null);
            setLocked(false);
            setSmooth(false);
            setRawScore(0);
            setMaxScore(0);
            setHistory([]);
          }}
        >
          Restart
        </button>
      </div>

      {locked && hasChoices && selected != null && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, color: (node.choices[selected].weight || 0) >= maxChoiceWeight ? "#19a663" : "#e33" }}>
            {(node.choices[selected].weight || 0) >= maxChoiceWeight ? "Great route." : "There’s a tighter route."}
          </div>
          {node.choices[selected].explain && (
            <div style={{ marginTop: 6, color: "#444" }}>{node.choices[selected].explain}</div>
          )}
        </div>
      )}

      <div style={{ marginTop: 14, color: "#0a8", fontWeight: 700 }}>
        Running score: {rawScore} / {maxScore || nodeMax || 1}
      </div>
    </div>
  );
}
