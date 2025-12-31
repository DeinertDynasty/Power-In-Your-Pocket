// Small branching scenario for door-to-door scheduling.
export const advGraph = {
  open: {
    id: "open",
    checkpoint: true,
    prompt: "I'm in the middle of something.",
    agent: "Totally fair—I'm quick. We are doing free exterior checks while routed here so you know what's urgent vs. later.",
    choices: [
      {
        label: "Acknowledge & pivot: 'Are you typically around later today or is tomorrow better?'",
        next: "grid",
        weight: 10,
        explain: "Respect time, assume value, and move to the calendar—keeps momentum."
      },
      {
        label: "Explain all services right now.",
        next: "ramble",
        weight: 0,
        explain: "Feature dumping loses the window. Keep it tight."
      },
      {
        label: "Apologize and hand a card.",
        next: "wrap",
        weight: 2,
        explain: "Polite but gives away control."
      }
    ]
  },

  ramble: {
    id: "ramble",
    checkpoint: true,
    prompt: "That sounds like a lot—I really dont have time.",
    agent: "Totally. The check is fast, and we line it up when crews are already close—saves both of us time.",
    choices: [
      {
        label: "Recover: 'Evenings or weekends usually best for you?'",
        next: "grid",
        weight: 5,
        explain: "You recovered to scheduling, but tighter framing earlier would help."
      },
      {
        label: "Ask them to call the office later.",
        next: "wrap",
        weight: 0,
        explain: "Defers and kills urgency."
      }
    ]
  },

  grid: {
    id: "grid",
    checkpoint: true,
    prompt: "If its quick, maybe. What do you have?",
    agent: "Weve got a couple windows while were routed here. Do your evenings or late afternoons work better?",
    choices: [
      {
        label: "Offer two slots (e.g., 'Today 6:10 or tomorrow 5:40').",
        next: "confirm",
        weight: 10,
        explain: "Specific beats vague. Two-option close drives a decision."
      },
      {
        label: "Offer 'sometime next week'.",
        next: "wrap",
        weight: 0,
        explain: "Vague shows low priority."
      }
    ]
  },

  confirm: {
    id: "confirm",
    checkpoint: true,
    prompt: "Tomorrow 5:40 could work.",
    agent: "Perfect. Well do a full exterior look, photos, and youll have a same-day game plan.",
    choices: [
      {
        label: "Finalize: 'That locks you into the current route—best contact name & number?'",
        next: "wrap",
        weight: 10,
        explain: "Closes decisively and sets expectation/benefit."
      },
      {
        label: "Ask if theyre sure.",
        next: "wrap",
        weight: 2,
        explain: "Raises doubt at the goal line."
      }
    ]
  },

  wrap: {
    id: "wrap",
    checkpoint: false,
    prompt: "Sounds good.",
    agent: "You’re set. If anything changes, we’ll text ahead—otherwise see you then.",
    choices: []
  }
};

export const advStartId = "open";
