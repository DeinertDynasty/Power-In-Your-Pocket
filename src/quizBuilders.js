// Utilities to convert your existing content into quiz items

// Flashcards -> MCQ
export function buildFlashcardMCQ(cards = []) {
  // expects { q, a } or { question, answer }
  const base = cards.map(c => ({
    q: c.q || c.question || "",
    a: c.a || c.answer || ""
  })).filter(c => c.q && c.a);

  // Build simple 4-choice MCQs
  const items = base.map((entry, idx) => {
    const wrongs = shuffle(base.filter((_, i) => i !== idx).map(x => x.a)).slice(0, 3);
    const choices = shuffle([entry.a, ...wrongs]);
    const answerIndex = choices.findIndex(x => x === entry.a);
    return {
      q: entry.q,
      choices,
      answerIndex,
      explain: entry.a
    };
  });
  return items;
}

// Urgency slides -> MCQ on titles
export function buildUrgencyMCQ(slides = []) {
  // slides like { title, body }
  const base = slides.filter(s => s?.title && s?.body);
  return base.map((s, idx) => {
    const correct = s.title;
    const wrongs = shuffle(base.filter((_, i) => i !== idx).map(x => x.title)).slice(0, 3);
    const choices = shuffle([correct, ...wrongs]);
    return {
      q: "Which slide title matches this summary?\n\n" + clip(s.body, 180),
      choices,
      answerIndex: choices.findIndex(x => x === correct),
      explain: `Correct: ${correct}`
    };
  });
}

// Script graph -> [{ prompt, expected }]
export function buildScriptTypingSet(graph = {}) {
  const nodes = Object.values(graph || {});
  const pairs = [];
  for (const n of nodes) {
    if (!n) continue;
    // if node has agent text and one best choice that supplies next agent or label
    // We'll pair 'agent' -> next node's 'agent' or first choice label
    const prompt = n.agent || n.prompt || "";
    const nextId = n.choices?.[0]?.next;
    const nextNode = nextId ? graph[nextId] : null;
    const expected = nextNode?.agent || nextNode?.prompt || (n.choices?.[0]?.label || "");
    if (prompt && expected) pairs.push({ prompt, expected });
  }
  // fall back: if nothing found, return empty set
  return pairs.slice(0, 40);
}

// helpers
function clip(s, n) {
  s = String(s || "");
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
