// Year-scoped localStorage leaderboards with automatic yearly reset.
// Adds: Aura points tracking + Aura Top 10.
// API:
//   recordScore(scope, score, total)
//   getBoard(scope)
//   getOverall()
//   addAuraPoints(amount)   <-- NEW
//   getAuraBoard()          <-- NEW

const YEAR = new Date().getFullYear();
const SCOPE_KEY = (scope) => `leaderboard:${YEAR}:${scope}`;
const OVERALL_KEY = `leaderboard:${YEAR}:overall`;
const AURA_USER_KEY = (user) => `aura:${YEAR}:${user}`;     // per-user total
const AURA_INDEX = `aura:${YEAR}:__index__`;                // list of users seen

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
}
function writeJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

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

/* ------------ Quiz/Activity leaderboards (percent based) ------------ */
export function recordScore(scope, score, total) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const entry = { user: currentUserName(), score, total, pct, date: new Date().toISOString() };

  const list = readJSON(SCOPE_KEY(scope), []);
  const day = entry.date.slice(0,10);
  const keyOf = (e) => `${e.user}:${day}`;
  const map = new Map(list.map(e => [keyOf(e), e]));
  const k = keyOf(entry);
  const prev = map.get(k);
  if (!prev || entry.pct > prev.pct) map.set(k, entry);
  const arr = Array.from(map.values());
  arr.sort((a,b) => b.pct - a.pct || a.user.localeCompare(b.user));
  writeJSON(SCOPE_KEY(scope), arr.slice(0, 100));

  // recompute overall
  writeJSON(OVERALL_KEY, recomputeOverall());
}

export function getBoard(scope) {
  return readJSON(SCOPE_KEY(scope), []);
}
export function getOverall() {
  return readJSON(OVERALL_KEY, []);
}

function recomputeOverall() {
  const keys = Object.keys(localStorage).filter(
    k => k.startsWith(`leaderboard:${YEAR}:`) && !k.endsWith(":overall")
  );
  const bestByUserScope = {};
  for (const k of keys) {
    const scope = k.split(":").pop();
    const board = readJSON(k, []);
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

/* --------------------------- Aura points ---------------------------- */
export function addAuraPoints(amount) {
  const user = currentUserName();
  const key = AURA_USER_KEY(user);
  const idxKey = AURA_INDEX;

  const cur = Number(readJSON(key, 0));
  const next = Math.max(0, cur + Number(amount || 0));
  writeJSON(key, next);

  // keep an index of users for the board
  const idx = new Set(readJSON(idxKey, []));
  idx.add(user);
  writeJSON(idxKey, Array.from(idx));
}

export function getAuraBoard() {
  const idx = readJSON(AURA_INDEX, []);
  const rows = idx.map(user => {
    const total = Number(readJSON(AURA_USER_KEY(user), 0));
    return { user, score: total, total: 0, pct: null, date: new Date().toISOString() };
  });
  rows.sort((a,b) => b.score - a.score || a.user.localeCompare(b.user));
  return rows.slice(0, 10);
}
