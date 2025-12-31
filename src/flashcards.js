// src/flashcards.js

const flashcards = [
  // =========================
  // APPOINTMENT PROCESS (Teleprompter Steps)
  // =========================
  {
    category: "Appointment Process",
    question: "Step 1: Initial Pitch",
    answer:
      "Hello, how are you today?\n" +
      "Sorry to bother you.\n\n" +
      "I am _____ from Power Home Remodeling.\n\n" +
      "We just finished a window installation in the neighborhood and I noticed you have similar aged windows to the ones we just replaced.\n" +
      "And while we’re in the neighborhood we’re giving ALL of the neighbors a free estimate.\n" +
      "Our experts will be in the neighborhood all day today, or does tomorrow work better for you?"
  },
  {
    category: "Appointment Process",
    question: "Step 2: The Assumptive Give Up",
    answer: "Ohhh Okay, the windows are just something you’re putting off for the future then."
  },
  {
    category: "Appointment Process",
    question: "Step 3: FOG",
    answer:
      "That’s actually perfect.\n" +
      "The estimate is completely free.\n" +
      "There’s no obligation.\n" +
      "And it’s guaranteed in writing for the future."
  },
  {
    category: "Appointment Process",
    question: "Step 4: Warm Up",
    answer:
      "My name is Phoenix, what’s your name by the way?\n" +
      "Pleasure to meet you.\n" +
      "How long have you owned the home?\n" +
      "Where are you from originally?\n" +
      "What was it about this neighborhood that made you want to move here?"
  },
  {
    category: "Appointment Process",
    question: "Step 5: Transition to Info Close",
    answer: "I’ll just make a note that we spoke and leave you with some information."
  },

  // =========================
  // ESTIMATE PROCESS (Teleprompter Steps)
  // =========================
  {
    category: "Estimate Process",
    question: "Step 1: Information Gathering",
    answer:
      "Most of your neighbors have been saying they have 15-20 windows.\n" +
      "Does that sound about right for you?\n" +
      "And they are all the original wood, right?\n\n" +
      "Zip Code / City / State\n" +
      "And the zipcode here is still 12345, right?\n" +
      "And we are in Pittsburgh, PA, right?\n\n" +
      "Street Address\n" +
      "And the address here is 123 Easy street, correct?\n\n" +
      "FOG if it was skipped due to procrastination or Buying Question\n\n" +
      "Cell Phone and Home\n" +
      "And your cell phone, is that a 412 or a 724?\n" +
      "And your alternate number, is that also a … ?\n\n" +
      "Last Name\n" +
      "And h/o, how do you spell your last name?\n\n" +
      "Email Address\n" +
      "And your email address, is that a yahoo or a Gmail?\n\n" +
      "Significant Other / Co-Owner\n" +
      "Now, h/o, is it just you here or both you and a significant other?\n" +
      "And what is your s/o’s name?\n" +
      "OR\n" +
      "Okay great— does anyone else own the home with you?\n" +
      "And s/o’s cell phone, is that also a 412 or a 724?"
  },
  {
    category: "Estimate Process",
    question: "Step 2: Paint the Picture",
    answer:
      "Just to let you know the estimate is really easy.\n\n" +
      "All our expert will do is measure everything up, come inside to answer any questions you have, and leave you with the estimate.\n\n" +
      "So when is usually the best time to catch both you and s/o home together— would that be the mornings or the evenings?"
  },
  {
    category: "Estimate Process",
    question: "Step 3: Scheduling the Grid",
    answer:
      "Decision-Maker A and B time:\n\n" +
      "If evenings:\n" +
      "What time do you usually get home?\n" +
      "What time does your s/o usually get home?\n\n" +
      "If mornings:\n" +
      "What time do you normally leave for work?\n" +
      "What time does your s/o usually leave for work?\n\n" +
      "JONES EFFECT and TIME CLOSE:\n\n" +
      "If evenings:\n" +
      "We ARE seeing some of your neighbors later today.\n" +
      "What I will do for you is have my expert come over today at X, or does X time work better for you?\n\n" +
      "If mornings:\n" +
      "We ARE seeing some of your neighbors early tomorrow.\n" +
      "What I will do for you is have my expert come over tomorrow at X, or does X time work better for you?\n\n" +
      "Confirming and Clearing Plans:\n" +
      "Great— so X time works for you?\n" +
      "And does that work for s/o?\n" +
      "And do either of you have any plans we would be stepping on?"
  },
  {
    category: "Estimate Process",
    question: "Step 4: Scheduling Transitions",
    answer:
      "Grid to Scheduling Department:\n" +
      "Great, I’m going to give a call to my Scheduling Department to make sure that day and time is available.\n\n" +
      "CDR to Scheduling Agent:\n" +
      "Hey Caitlyn, it’s Phoenix Nitro ID 179 923, with the Pittsburgh Community.\n" +
      "I’m speaking with h/o and we’re giving her and her s/o a free estimate on 15 windows.\n" +
      "H/o was saying X day and time would be best.\n\n" +
      "Preparation for Home Owner to Scheduling Agent:\n" +
      "Okay, h/o, this is my Scheduling Agent, Caitlyn.\n" +
      "She is going to need to speak WITH you.\n" +
      "She will ask you some questions like your zip code, address, and some of the basic information we just discussed.\n" +
      "Then she will look at the schedule and get you that time… say hi!\n\n" +
      "Scheduled Appointment to Button Up:\n" +
      "Thank you so much for your time.\n\n" +
      "Give me two seconds and I’ll get you right back to the rest of your day.\n\n" +
      "Actually, go grab your cell phone for me— I’m going to leave you with our contact information."
  },
  {
    category: "Estimate Process",
    question: "Step 5: Button Up and Cool Down",
    answer:
      "Appointment Reminder:\n" +
      "We have you and s/o all set for X day and time.\n\n" +
      "Dispatch Script:\n" +
      "Did Caitlyn mention we would be giving you a call?\n" +
      "Okay— that will be coming from a 412 area code.\n" +
      "Just make sure you pick that up.\n" +
      "It will be one of our dispatchers letting you know we are on our way to your home.\n\n" +
      "Power Contact Info:\n" +
      "Now, in your cell phone go to your camera, scan this.\n" +
      "This is going to give you our contact information.\n" +
      "That way you know it’s us when we give you a call.\n\n" +
      "Cancellation Script:\n" +
      "Most importantly, you don’t have to do this.\n" +
      "If there is any reason at all that you would cancel this estimate, just let me know now— because it’s a poor reflection on me.\n" +
      "Are you sure X day and time works for you both?\n\n" +
      "FOG Reminder:\n" +
      "Now, I know that s/o wasn’t here for all of this.\n" +
      "So I will need your help to let them know the estimate is completely free.\n" +
      "There are no obligations.\n" +
      "And it will be guaranteed in writing if you ever want to put it to use.\n\n" +
      "Customer Bill of Rights:\n" +
      "So, a little information about us— we are Power Home Remodeling.\n" +
      "We’ve been a family-first business since 1992.\n\n" +
      "As one of the largest home remodelers in the country, we pride ourselves in putting the customers first.\n" +
      "Here are some of our ratings and reviews as well as the products we offer.\n\n" +
      "This is our Customer Bill of Rights— which is our promise to our homeowners.\n" +
      "This is how we believe all homeowners deserve to be treated, whether you choose us or not.\n\n" +
      "When you have a moment, take a look at our website at Powerhrg.com.\n\n" +
      "Our Work Shows.\n\n" +
      "Cool Down:\n" +
      "So, what do you have planned for the rest of the day?"
  },

  // =========================
  // OBJECTION PROCESS (Teleprompter Steps)
  // =========================
  {
    category: "Objection Process",
    question: "Step 1: Down to Earth",
    answer:
      "No worries at all h/o…\n" +
      "I understand that (whatever objection reiterated)…\n\n" +
      "Times are tough for everyone.\n" +
      "Schedules are crazy this time of year.\n\n" +
      "But there will never be a day that you wake and high five yourself or s/o, and say:\n" +
      "“I would love to get a window estimate today.”\n" +
      "That day will never come…"
  },
  {
    category: "Objection Process",
    question: "Step 2: Primary Rebuttal",
    answer:
      "Unfortunately, most people wait until water has infiltrated their windows.\n" +
      "That’s why most of your neighbors are taking advantage of the estimate now.\n" +
      "That way they can plan ahead, instead of being on Mother Nature’s terms."
  },
  {
    category: "Objection Process",
    question: "Step 3: 2nd FOG",
    answer: "Keep in mind, it’s JUST an estimate."
  },
  {
    category: "Objection Process",
    question: "Step 4: Close",
    answer:
      "Revert to where you received the objection and immediately start closing.\n" +
      "Keep going as if they never even objected.\n" +
      "Don’t pause.\n" +
      "Have blind confidence."
  },

  // =========================
  // BUYING QUESTIONS (Drillable flashcards)
  // =========================
  {
    category: "Buying Questions",
    question: "Why does my s/o need to be involved?",
    answer:
      "We actually prefer to speak with both of you.\n" +
      "There are so many different styles and options, and everyone always has questions.\n" +
      "Each of those details affects the estimate.\n\n" +
      "So we would love to come see you together one time so we can be accurate and put our best foot forward."
  },
  {
    category: "Buying Questions",
    question: "How long does the estimate take?",
    answer:
      "The estimate is really easy.\n" +
      "They measure up the windows, answer any questions you have, and leave you with the estimate.\n" +
      "It just depends on how many questions you have."
  },
  {
    category: "Buying Questions",
    question: "Do they need to come inside?",
    answer:
      "The estimate is really easy.\n" +
      "Our expert will measure up the windows.\n" +
      "Then go over your styles and options from inside the home and leave you with the estimate.\n" +
      "They won’t be there all night."
  },
  {
    category: "Buying Questions",
    question: "How much does an item cost?",
    answer:
      "Unfortunately, I don’t really deal with the pricing.\n" +
      "We’re not the cheapest, and we’re not nearly the most expensive.\n" +
      "We pride ourselves on having the best value in the industry.\n\n" +
      "When my expert comes out, they’ll get as specific as you’d like with the numbers."
  },
  {
    category: "Buying Questions",
    question: "Any technical questions?",
    answer:
      "That’s a really great question.\n" +
      "When our expert comes out, they will be able to answer all of your questions."
  },

  // =========================
  // PROCRASTINATIONS (Drillable flashcards)
  // =========================
  {
    category: "Procrastinations",
    question: "Could you leave it in the mailbox or leave me with a card?",
    answer:
      "What our expert will do when they come out is measure everything up, answer any questions you have, and leave you with the estimate.\n" +
      "I’ll just make a note that we spoke and leave you with some information."
  },
  {
    category: "Procrastinations",
    question: "I need to speak to my s/o first.",
    answer:
      "Okay, no worries.\n" +
      "I’ll just make a note that we spoke and leave you with some information to show them."
  },
  {
    category: "Procrastinations",
    question: "We’re really busy.",
    answer:
      "Okay, no worries.\n" +
      "I’ll just make a note that we spoke and leave you with some information."
  },

  // =========================
  // RECAP REVIEW OF PROCESSES
  // =========================
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 1",
    answer: "Initial Pitch — Who / What / Why / Where"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 2",
    answer: "Assumptive Give Up — Proves future interest"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 3",
    answer: "FOG — Stacking perceived value"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 4",
    answer: "Warm Up — To build rapport"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 5",
    answer: "Information Gathering — Qualify appointment; stack yes’s (yes train)"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 6",
    answer: "Paint the Picture — Set proper expectations"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 7",
    answer: "Scheduling Grid — Find out what times don’t work"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 8",
    answer: "Scheduling Transitions — Prep homeowner and scheduler"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 1",
    answer: "D/D/T reminder — Make sure homeowner remembers their plans"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 2",
    answer: "Dispatch Script — Make sure homeowner picks up the call"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 3",
    answer: "QR Code — Homeowner knows it’s Power when they get the call"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 4",
    answer: "Cancellation Script — Avoid cancellation"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 5",
    answer: "FOG Reminder — Make homeowner our advocate"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 6",
    answer: "Customer Bill of Rights — Meant to empower the homeowner"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 7",
    answer: "Cool Down — Avoid buyer’s remorse; avoid making homeowner feel used"
  },

  // =========================
  // SCHEDULING TRANSITIONS — EXACT SCRIPT (MICRO)
  // =========================
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact line: Transition to Scheduling Department",
    answer: "Great, I’m going to give a call to my Scheduling Department to make sure that day and time is available."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact opener to scheduler",
    answer: "Hey Caitlyn, it’s Phoenix."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact identifier line to scheduler",
    answer: "Nitro ID 179 923, with the Pittsburgh Community."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact purpose line to scheduler",
    answer: "I’m speaking with h/o and we’re giving her and her s/o a free estimate on 15 windows."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact time confirmation line to scheduler",
    answer: "H/o was saying X day and time would be best."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact homeowner introduction to scheduler",
    answer: "Okay h/o, this is my Scheduling Agent, Caitlyn."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact instruction line before handoff",
    answer: "She is going to need to speak WITH you."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact expectation-setting line",
    answer: "She will ask you some questions, like your zip code, address, and some of the basic information we just discussed."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact reassurance line before handoff",
    answer: "Then she will look at the schedule and get you that time."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact handoff trigger",
    answer: "Say hi!"
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact post-scheduling gratitude line",
    answer: "Thank you so much for your time."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact momentum-preserving line",
    answer: "Give me two seconds and I’ll get you right back to the rest of your day."
  },
  {
    category: "Scheduling Transitions — Exact",
    question: "Exact transition to saving contact info",
    answer: "Actually, go grab your cell phone for me—I’m going to leave you with our contact information."
  },

  // =========================
  // SCHEDULING TRANSITIONS — TEMPLATE (MICRO)
  // =========================
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Transition to Scheduling",
    answer: "Great, I’m going to give a call to my Scheduling Department to make sure ___ is available."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Scheduler opener",
    answer: "Hey ___, it’s ___."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Identifier line",
    answer: "Nitro ID ___, with the ___ Community."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Homeowner statement",
    answer: "I’m speaking with ___ and we’re giving ___ a free estimate on ___ windows."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Time request line",
    answer: "They were saying ___ at ___ would be best."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Introduce scheduler to homeowner",
    answer: "Okay ___, this is my Scheduling Agent, ___."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Control line before handoff",
    answer: "She is going to need to speak WITH you."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Expectation setting",
    answer: "She’ll ask basic info like ___ and ___."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Reassurance line",
    answer: "Then she’ll check the schedule and lock in your time."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Handoff trigger",
    answer: "Go ahead and say hi."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Momentum close",
    answer: "Give me one second and I’ll get you right back to your day."
  },
  {
    category: "Scheduling Transitions — Template",
    question: "Template: Anchor commitment with phone",
    answer: "Grab your cell phone for me—I’m going to leave you with our contact information."
  }
];

export default flashcards;
