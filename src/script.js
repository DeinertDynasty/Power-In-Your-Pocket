// src/script.js

// Initial Training Script (each entry is one teleprompter line/paragraph)
// src/script.js

export const Initial_Scripting = [
  // The Appointment Process — Initial Pitch
  "Hello, how are you today?",
  "Sorry to bother you.",
  "I’m ______ from Power Home Remodeling.",
  "We just finished a window installation in the neighborhood.",
  "I noticed you have similar aged windows to the ones we just replaced.",
  "While we’re in the neighborhood, we’re giving all of the neighbors a free estimate.",
  "Our experts will be in the neighborhood all day today.",
  "Does today work, or does tomorrow work better for you?",

  // The Assumptive Give Up
  "Ohhh okay.",
  "So the windows are just something you’re putting off for the future then.",

  // FOG
  "That’s actually perfect.",
  "The estimate is completely free.",
  "There’s no obligation.",
  "It’s guaranteed in writing for the future.",

  // Warm Up
  "My name is _____ what’s your name, by the way?",
  "Pleasure to meet you.",
  "How long have you owned the home?",
  "Where are you from originally?",
  "What was it about this neighborhood that made you want to move here?",

  // Transition to Info Close
  "I’ll just make a note that we spoke.",
  "And I’ll leave you with some information.",

  // The Estimate Process — Information Gathering
  "Most of your neighbors have been saying they have 15–20 windows.",
  "Does that sound about right for you?",
  "And they are all the original wood, right?",
  "And the zip code here is still [ZIP], right?",
  "And we are in [CITY], [STATE], right?",
  "And the address here is [ADDRESS], correct?",
  "And your cell phone— is that a [412] or a [724]?",
  "And your alternate number— is that also a [412] or a [724]?",
  "And [h/o], how do you spell your last name?",
  "And your email address— is that Yahoo or Gmail?",
  "Now [h/o], is it just you here or both you and a significant other?",
  "What is your [s/o]’s name?",
  "Or, does anyone else own the home with you?",
  "And your [s/o]’s cell phone— is that also a [412] or a [724]?",

  // Paint the Picture
  "Just to let you know, the estimate is really easy.",
  "All our expert will do is measure everything up.",
  "They’ll come inside to answer any questions you have.",
  "And they’ll leave you with the estimate.",
  "So when is usually the best time to catch both you and [s/o] home together?",
  "Would that be mornings or evenings?",

  // Scheduling the Grid — Evenings
  "If evenings, what time do you usually get home?",
  "What time does your [s/o] usually get home?",

  // Scheduling the Grid — Mornings
  "If mornings, what time do you normally leave for work?",
  "What time does your [s/o] usually leave for work?",

  // Jones Effect + Time Close — Evenings
  "We are seeing some of your neighbors later today.",
  "What I will do is have my expert come over today at [X].",
  "Or does [X] work better for you?",

  // Jones Effect + Time Close — Mornings
  "We are seeing some of your neighbors early tomorrow.",
  "What I will do is have my expert come over tomorrow at [X].",
  "Or does [X] work better for you?",

  // Confirming and Clearing Plans
  "Great— so [X] works for you?",
  "And does that work for your [s/o]?",
  "Do either of you have any plans we would be stepping on?",

  // Scheduling Transitions
  "Great— I’m going to call my Scheduling Department to make sure that day and time is available.",
  "Hey Caitlyn, it’s Phoenix— Nitro ID 179923— with the Pittsburgh Community.",
  "I’m speaking with [h/o], and we’re giving her and her [s/o] a free estimate on about 15 windows.",
  "[h/o] was saying [DAY] at [TIME] would be best.",
  "Okay [h/o], this is my Scheduling Agent, Caitlyn.",
  "She’ll need to speak with you.",
  "She’ll ask basic info like zip code and address.",
  "Then she’ll confirm a time with you.",
  "Go ahead and say hi!",

  // Scheduled Appointment to Button Up
  "Thank you so much for your time.",
  "Give me two seconds and I’ll get you right back to the rest of your day.",
  "Actually— go grab your cell phone for me.",
  "I’m going to leave you with our contact information.",

  // Button Up and Cool Down
  "We have you and your [s/o] all set for [DAY] at [TIME].",
  "Did Caitlyn mention we would be giving you a call?",
  "That will be coming from a 412 area code.",
  "Make sure you pick that up.",
  "It’ll be one of our dispatchers letting you know we are on our way.",
  "Now open your camera and scan this QR code.",
  "This will save our contact information to your phone.",
  "That way you know it’s us when we call.",

  // Cancellation Script
  "Most importantly— you don’t have to do this.",
  "If there is any reason at all that you would cancel this estimate, let me know now.",
  "Because it’s a poor reflection on me.",
  "Are you sure [DAY] at [TIME] works for both of you?",

  // FOG Reminder
  "I know your [s/o] wasn’t here for all of this.",
  "So I’ll need your help.",
  "Please let them know the estimate is completely free.",
  "There are no obligations.",
  "And it’s guaranteed in writing if you ever want to use it.",

  // Customer Bill of Rights
  "A little information about us— we are Power Home Remodeling.",
  "We’ve been a family-first business since 1992.",
  "As one of the largest home remodelers in the country, we put customers first.",
  "Here are some of our ratings and reviews and the products we offer.",
  "This is our Customer Bill of Rights.",
  "It’s our promise to our homeowners.",
  "This is how we believe all homeowners deserve to be treated— whether you choose us or not.",
  "When you have a moment, check out our website at PowerHRG.com.",
  "Our work shows.",

  // Cool Down
  "So what do you have planned for the rest of the day?"
];

export const Objection = [
  // Objection Process
  "No worries at all, [h/o].",
  "I understand that [OBJECTION].",
  "Times are tough for everyone.",
  "Schedules are crazy this time of year.",
  "But there will never be a day you wake up and high five yourself or your [s/o]…",
  "And say, ‘I would love to get a window estimate today.’",
  "That day will never come.",
  "Unfortunately, most people wait until water has infiltrated their windows.",
  "That’s why most of your neighbors are taking advantage of the estimate now.",
  "That way they can plan ahead.",
  "Instead of being on Mother Nature’s terms.",
  "Keep in mind— it’s just an estimate.",
  "Let’s go back to where we were scheduling.",
  "So does [X] work better, or [X]?"
];

export const Buying_Questions = [
  "Why does my [s/o] need to be involved?",
  "We prefer to speak with both of you because there are so many styles and options.",
  "Everyone always has questions.",
  "Those details affect the estimate.",
  "We just want to see you together one time so we can be accurate and put our best foot forward.",

  "How long does the estimate take?",
  "The estimate is really easy.",
  "They measure up the windows, answer your questions, and leave you with the estimate.",
  "It depends on how many questions you have.",

  "Do they need to come inside?",
  "They’ll measure outside first.",
  "Then go over styles and options from inside the home.",
  "Then leave you with the estimate.",
  "They won’t be there all night.",

  "How much does it cost?",
  "I don’t deal with pricing directly.",
  "We’re not the cheapest, and we’re not the most expensive.",
  "We pride ourselves on the best value in the industry.",
  "When my expert comes out, they can get as specific as you’d like with the numbers.",

  "I have a technical question.",
  "That’s a great question.",
  "When our expert comes out, they’ll be able to answer all of your questions."
];

export const Procrastinations = [
  "Could you leave it in the mailbox or leave me with a card?",
  "What our expert does is measure everything up, answer any questions you have, and leave you with the estimate.",
  "I’ll just make a note that we spoke and leave you with some information.",

  "I need to speak to my [s/o] first.",
  "No worries.",
  "I’ll just make a note that we spoke and leave you with some information to show them.",

  "We’re really busy.",
  "No worries.",
  "I’ll just make a note that we spoke and leave you with some information."
];
