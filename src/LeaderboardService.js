// Year-scoped localStorage leaderboards with automatic yearly reset.
// Simple API:
//   recordScore(scope, score, total)
//   getBoard(scope)
//   getOverall()

const YEAR = new Date().getFullYear();
const KEY = (scope) => `leaderboard:${YEAR}:${scope}`;
const OVERALL_KEY = `leaderboard:${YEAR}:overall`;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}

function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function recordScore(scope, score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const entry = {
    user: currentUserName(),
    score,
    total,
    pct,
    date: new Date().toISOString()
  };

  // Per-scope board: keep best pct by user per day
  const b = read(KEY(scope));
  const next = upsertTop(b, entry);
  write(KEY(scope), next);

  // Recompute overall (avg of best scope pcts per user)
  const overall = recomputeOverall();
  write(OVERALL_KEY, overall);
}

export function getBoard(scope) {
  return read(KEY(scope));
}

export function getOverall() {
  return read(OVERALL_KEY);
}

function currentUserName() {
  try {
    const raw = localStorage.getItem("currentUser");
    if (raw) {
      const u = JSON.parse(raw);
      return u.displayName || u.username || "Anon";
    }
  } catch {}
  return "Anon";
}

function upsertTop(list, entry) {
  // Keep best by pct per (user, day)
  const day = entry.date.slice(0,10);
  const key = (e) => `${e.user}:${day}`;
  const map = new Map(list.map(e => [key(e), e]));
  const k = key(entry);
  const prev = map.get(k);
  if (!prev || entry.pct > prev.pct) map.set(k, entry);
  const arr = Array.from(map.values());
  arr.sort((a,b) => b.pct - a.pct || a.user.localeCompare(b.user));
  return arr.slice(0, 100);
}

function recomputeOverall() {
  const keys = Object.keys(localStorage).filter(
    k => k.startsWith(`leaderboard:${YEAR}:`) && !k.endsWith(":overall")
  );
  const bestByUserScope = {};
  for (const k of keys) {
    const scope = k.split(":").pop();
    const board = read(k);
    for (const row of board) {
      const u = row.user;
      bestByUserScope[u] = bestByUserScope[u] || {};
      bestByUserScope[u][scope] = Math.max(bestByUserScope[u][scope] || 0, row.pct);
    }
  }
  const out = Object.entries(bestByUserScope).map(([user, scopes]) => {
    const pcts = Object.values(scopes);
    const avg = Math.round(pcts.reduce((a,b)=>a+b,0) / (pcts.length || 1));
    return { user, pct: avg, date: new Date().toISOString(), score: avg, total: 100 };
  });
  out.sort((a,b) => b.pct - a.pct || a.user.localeCompare(b.user));
  return out.slice(0, 100);
}
