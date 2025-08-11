// src/flashcards.js

const flashcards = [
  {
    category: "Appointment Process",
    question: "Step 1: Initial Pitch",
    answer: `Hello, how are you today?\nSorry to bother you.\n\nI am _____ from Power Home Remodeling.\n\nWe just finished a window installation in the neighborhood and I noticed you have similar aged windows to the ones we just replaced.\nAnd while we’re in the neighborhood we’re giving ALL of the neighbors a free estimate.\nOur experts will be in the neighborhood all day today, or does tomorrow work better for you?`
  },
  {
    category: "Appointment Process",
    question: "Step 2: The Assumptive Give Up",
    answer: "Ohhh Okay, the windows are just something you’re putting off for the future then."
  },
  {
    category: "Appointment Process",
    question: "Step 3: FOG",
    answer: "That’s actually perfect.\nThe estimate is completely free. There’s no obligation and it’s guaranteed in writing for the future."
  },
  {
    category: "Appointment Process",
    question: "Step 4: Warm Up",
    answer: `My name is Phoenix, what’s your name by the way? Pleasure to meet you.\nHow long have you owned the home?\nWhere are you from originally?\nWhat was it about this neighborhood that made you want to move here?`
  },
  {
    category: "Appointment Process",
    question: "Step 5: Transition to Info Close",
    answer: "I’ll just make a note that we spoke and leave you with some information."
  },

  {
    category: "Estimate Process",
    question: "Step 1: Information Gathering",
    answer: `Most of your neighbors have been saying they have 15-20 windows.\nDoes that sound about right for you?\nAnd they are all the original wood, right?\nZip Code/City/State\nAnd the zipcode here is still 12345, right?\nAnd we are in Pittsburgh, PA, right?\nStreet Address\nAnd the address here is 123 Easy street, correct?\nFOG if it was skipped due to procrastination or Buying Question\nCell Phone and Home\nAnd your cell phone, is that a 412 or a 724?\nAnd your alternate number, is that also a … ?\nLast Name\nAnd h/o, how do you spell your last name?\nEmail Address\nAnd your email address, is that a yahoo or a Gmail?\nSignificant Other/Co-Owner\nNow, h/o, is it just you here or both you and a significant other?\nAnd what is your s/o’s name? OR Okay Great, does anyone else own the home with you?\nAnd s/o’s cell phone, is that also a 412 or a 724?`
  },
  {
    category: "Estimate Process",
    question: "Step 2: Paint the Picture",
    answer: "Just to let you know the estimate is really easy.\n\nAll our expert will do is measure everything up, come inside to answer any questions you have, and leave you with the estimate.\n\nSo when is usually the best time to catch both you and s/o home together, would that be the mornings or the evenings?"
  },
  {
    category: "Estimate Process",
    question: "Step 3: Scheduling the Grid",
    answer: `Decision-Maker A and B time:\nIf evenings:\nWhat time do you usually get home?\nWhat time does your s/o usually get home?\n\nIf mornings:\nWhat time do you normally leave for work?\nWhat time does your s/o usually leave for work?\n\nJONES EFFECT and TIME CLOSE:\nIf Evenings:\nWe ARE seeing some of your neighbors later today.\nWhat I will do for you is have my expert come over today at X or does X time work better for you?\nIf Mornings:\nWe ARE seeing some of your neighbors early tomorrow.\nWhat I will do for you is have my expert come over tomorrow at X or does X time work better for you?\n\nConfirming and Clearing Plans:\nGreat. So X time works for you?\nAnd does that work for s/o?\nAnd do either of you have any plans we would be stepping on?`
  },
  {
    category: "Estimate Process",
    question: "Step 4: Scheduling Transitions",
    answer: `Grid to Scheduling Department:\nGreat, I’m going to give a call to my Scheduling Department to make sure that day and time is available.\n\nCDR to Scheduling Agent:\nHey Caitlyn, it’s Phoenix Nitro ID 179 923, with the Pittsburgh Community. I’m speaking with h/o and we’re giving her and her s/o a free estimate on 15 windows.\nH/o was saying X day and time would be best.\n\nPreparation for Home Owner to Scheduling Agent:\nOkay, h/o, this is my Scheduling Agent, Caitlyn.\nShe is going to need to speak WITH you. She will ask you some questions, like your zip code, address, and some of the basic information we just discussed. Then she will look at the schedule and get you that time …  say hi!\n\nScheduled Appointment to Button Up:\nThank you so much for your time.\n\nGive me two seconds and I’ll get you right back to the rest of your day.\n\nActually, go grab your cell phone for me, I’m going to leave you with our contact information.`
  },
  {
    category: "Estimate Process",
    question: "Step 5: Button Up and Cool Down",
    answer: `Appointment Reminder:\nWe have you and s/o all set for X day and time.\n\nDispatch Script:\nDid Caitlyn mention we would be giving you a call?\nOkay, that will be coming from a 412 area code. Just make sure you pick that up.\nIt will be one of our dispatchers letting you know we are on our way to your home.\n\nPower Contact Info:\nNow, in your cell phone go to your camera, scan this - . This is going to give you our contact information. That way you know it’s us when we give you a call.\n\nCancellation Script:\nMost importantly, you don’t have to do this.\nIf there is any reason at all that you would cancel this estimate, just let me know now, because it’s a poor reflection on me.\nAre you sure X day and time works for you both?\n\nFOG Reminder:\nNow, I know that s/o, wasn’t here for all of this, so I will need your help to let them know that the estimate is completely free, there are no obligations, and it will be guaranteed in writing if you ever want to put it to use.\n\nCustomer Bill of Rights:\nSo, a little information about us, we are Power Home Remodeling…\nWe’ve been a family-first business since 1992.\n\nAs one of the largest home remodelers in the country, we pride ourselves in putting the customers first.\nHere are some of our ratings and reviews as well as the products we offer…\n\nThis is our Customer Bill of Rights - which is our promise to our homeowners.\nThis is how we believe all homeowners deserve to be treated, whether you choose us or not.\n\nWhen you have a moment, take a look at our website at Powerhrg.com.\n\nOur Work Shows.\n\nCool Down:\nSo, what do you have planned for the rest of the day?`
  },

  {
    category: "Objection Process",
    question: "Step 1: Down to Earth",
    answer: `No worries at all h/o…\nI understand that (whatever objection reiterated w/ either\nTimes are tough for everyone\nSchedules are crazy this time of year\n\nBut there will never be a day that you wake and high five yourself or s/o, and say, I would love to get a window estimate.\nThat day will never come…`
  },
  {
    category: "Objection Process",
    question: "Step 2: Primary Rebuttal",
    answer: `Unfortunately, most people wait until water has infiltrated their windows.\nThat’s why most of your neighbors are taking advantage of the estimate now,\nThat way they can plan ahead, instead of being on Mother Nature’s terms.`
  },
  {
    category: "Objection Process",
    question: "Step 3: 2nd FOG",
    answer: "Keep in mind, it’s JUST an estimate."
  },
  {
    category: "Objection Process",
    question: "Step 4: Close",
    answer: `Revert to where you received the objection and immediately start closing.\nKeep going as if they never even objected\nDon’t pause\nHave blind confidence`
  },
  {
    category: "Objection Process",
    question: "Buying Questions",
    answer: `Why does my s/o need to be involved?\nWe actually prefer to speak with both of you. Just because there are so many different styles and options on everything and everyone always has questions. Each of those details affect the estimate.\nSo we would just love to come see you together, one time, so we can be accurate and put our best foot forward.\n\nHow long does the estimate take?\nWell, the estimate is really easy.\nThey just measure up the windows, answer any questions you have, and leave you with the estimate.\nIt just depends on how many questions you have.\n\nDo they need to come inside?\nThe estimate is really easy. All our expert will do is come out measure up with windows, go over your styles and options from inside the home and leave you with the estimate but, they won’t be there all night.\n\nHow much does an item cost?\nUnfortunately, I don’t really deal with the pricing. We’re not the cheapest, we’re not nearly the most expensive, but, we pride ourselves on having the best value in the industry.\nAnd when my expert comes out, they’ll get as specific as you’d like with the numbers.\n\nAny technical questions.\nThat’s a really great question and when our expert comes out, they will be able to answer all of your questions.`
  },

  {
    category: "Objection Process",
    question: "Procrastinations",
    answer: `Could you leave it in the mailbox or leave me with a card?\nWhat our expert will do when they come out is measure everything up, answer any questions you have and leave you with the estimate.\nI’ll just make a note that we spoke and leave you with some information.\n\nI need to speak to my s/o first.\nOk, no worries, I’ll just make a note that we spoke and leave you with some information to show them.\n\nWe’re really busy.\nOk, no worries, I’ll just make a note that we spoke and leave you with some information.`
  },

  // Add more flashcards as needed


  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 1",
    answer: "Initial Pitch - Who\nWhat\nWhy\nWhere"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 2",
    answer: "Assumptive Give Up - Proves future interest"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 3",
    answer: "FOG - Stacking perceived value"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 4",
    answer: "Warm Up - To build rapport"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 5",
    answer: "Information Gathering - Qualify Appointment\nStack yes’s // Yes Train"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 6",
    answer: "Paint the Picture - Set Proper Expectations"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 7",
    answer: "Scheduling Grid - Find out what times don’t work"
  },
  {
    category: "Recap Review of Processes",
    question: "Appointment/Estimate Process: Step 8",
    answer: "Scheduling Transitions - Prep h/o and Scheduler"
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 1",
    answer: "D/D/T reminder - To make sure h/o remembers their plans."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 2",
    answer: "Dispatch Script - To make sure h/o picks up the phone/call."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 3",
    answer: "QR Code - So the h/o knows it is Power when they get the scheduler's call."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 4",
    answer: "Cancellation Script - To avoid cancellation."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 5",
    answer: "FOG Reminder - To make h/o our advocate."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 6",
    answer: "Customer Bill of Rights - Meant to empower the h/o."
  },
  {
    category: "Recap Review of Processes",
    question: "Button Up // Cool Down: Step 7",
    answer: " The Cool Down - To avoid buyer's remorse.\nTo avoid making h/o feel used."
  },

  // Add more flashcards as needed
];

export default flashcards;
