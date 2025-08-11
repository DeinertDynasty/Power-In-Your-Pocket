// src/quizzes.js

// Utility: shuffle array copy
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build multiple-choice items from flashcards
function buildFromFlashcards(flashcards, count = 8) {
  const items = [];
  const pool = [...flashcards];
  const others = flashcards.map(f => f.answer);

  for (const fc of shuffle(pool)) {
    const distractors = shuffle(others.filter(a => a !== fc.answer)).slice(0, 3);
    const choices = shuffle([fc.answer, ...distractors]);
    items.push({
      q: fc.question,
      choices,
      answerIndex: choices.findIndex(c => c === fc.answer),
      explain: fc.category ? `Category: ${fc.category}` : ""
    });
    if (items.length >= count) break;
  }
  return items;
}

// Build items from script lines: ask the NEXT line
function buildFromScriptLines(lines, count = 4) {
  const items = [];
  if (!Array.isArray(lines) || lines.length < 2) return items;

  const all = [...lines];
  for (let i = 0; i < all.length - 1; i++) {
    const prompt = all[i];
    const correct = all[i + 1];
    // distractors: pick from anywhere except the correct
    const distractors = shuffle(all.filter(x => x !== correct)).slice(0, 3);
    const choices = shuffle([correct, ...distractors]);
    items.push({
      q: `What comes next after: "${prompt}"`,
      choices,
      answerIndex: choices.findIndex(c => c === correct),
      explain: "Memorize sequence, not just lines."
    });
  }
  return shuffle(items).slice(0, count);
}

/**
 * Public builder that combines flashcards + both teleprompter scripts
 * so the quiz always reflects your source data.
 */
export function getScriptQuiz(flashcards, fundamentals, objections, total = 12) {
  const fromCards = buildFromFlashcards(flashcards, Math.min(8, total));
  const need = Math.max(total - fromCards.length, 0);
  const half = Math.ceil(need / 2);
  const fromFund = buildFromScriptLines(fundamentals, half);
  const fromObj = buildFromScriptLines(objections, need - fromFund.length);
  return shuffle([...fromCards, ...fromFund, ...fromObj]).slice(0, total);
}

// Urgency quiz can stay static or be built from urgencySlides later if you want
export const urgencyQuiz = [
  {
    q: "What creates urgency ethically at the door?",
    choices: [
      "Saying prices will skyrocket tomorrow",
      "Leveraging schedule scarcity and crew routing",
      "Warning of immediate structural failure",
      "Offering cash discounts you can’t authorize"
    ],
    answerIndex: 1,
    explain: "Tie urgency to real scheduling/route constraints."
  },
  {
    q: "The best time to anchor urgency is:",
    choices: [
      "After the appointment is scheduled",
      "Only if they mention competitors",
      "Upfront in your framing and again at scheduling",
      "Never—urgency feels pushy"
    ],
    answerIndex: 2,
    explain: "Set it early, reinforce at scheduling—without being manipulative."
  },
  {
    q: "A clean urgency line would be:",
    choices: [
      "You’ll regret waiting and pay double.",
      "If we’re back in your area next month you might miss the current route—today locks you in.",
      "Prices expire in one hour.",
      "My manager will be mad if I don’t book this."
    ],
    answerIndex: 1,
    explain: "Logistics-based urgency, not threats."
  },
];
