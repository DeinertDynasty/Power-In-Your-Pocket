// Simple localStorage-backed leaderboards
// Scopes we track: flashcards, teleprompter, quiz-script, quiz-urgency
const KEY = (scope) => `piyp.lb.${scope}`;

function read(scope) {
  try { return JSON.parse(localStorage.getItem(KEY(scope)) || "[]"); }
  catch { return []; }
}
function write(scope, arr) {
  try { localStorage.setItem(KEY(scope), JSON.stringify(arr)); } catch {}
}

// Public: add a score (number). We'll keep the latest 200 and sort desc by score.
export function submitScore(scope, { nickname, score }) {
  if (!scope || typeof score !== "number" || !isFinite(score)) return;
  const cleanName = nickname || "Anon";
  const now = Date.now();
  const list = read(scope);
  list.push({ nickname: cleanName, score: Number(score), ts: now });
  // keep last 200 entries, then sort by score desc, then recent first
  const trimmed = list.slice(-200).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.ts - a.ts;
  });
  write(scope, trimmed);
  return trimmed;
}

// Public: top N for a scope (default 10)
export function getLeaderboard(scope, topN = 10) {
  const list = read(scope);
  return list
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.ts - a.ts;
    })
    .slice(0, topN);
}

// Public: build an Overall board by summing each user's BEST score per scope
export function getOverall(topN = 10) {
  const scopes = ["flashcards", "teleprompter", "quiz-script", "quiz-urgency"];
  const bestByUser = new Map(); // nickname -> { scopeScores: Map, total }

  for (const s of scopes) {
    const list = read(s);
    for (const row of list) {
      const name = row.nickname || "Anon";
      const score = Number(row.score) || 0;
      if (!bestByUser.has(name)) bestByUser.set(name, new Map());
      const perScope = bestByUser.get(name);
      perScope.set(s, Math.max(perScope.get(s) || 0, score));
    }
  }

  const merged = [];
  for (const [name, perScope] of bestByUser.entries()) {
    let total = 0;
    for (const v of perScope.values()) total += v;
    merged.push({ nickname: name, score: total });
  }

  return merged
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// Optional: clear everything (use from DevTools console if needed)
// window.__clearLeaderboards = () => ["flashcards","teleprompter","quiz-script","quiz-urgency"].forEach(s => localStorage.removeItem(KEY(s)));
