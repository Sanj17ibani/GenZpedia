export interface Slang {
  _id: string;
  word: string;
  meaning: string;
  example: string[];
  tone?: string;
  emotionalContext?: string;
}

export const MOCK_SLANGS: Slang[] = [
  {
    _id: "1",
    word: "Rizz",
    meaning: "Short for 'charisma'. It refers to someone's ability to attract or flirt with a potential partner.",
    example: ["He's got so much rizz, he could talk to anyone.", "Bro, your rizz is actually insane today."],
    tone: "Positive / Hype",
    emotionalContext: "Confidence"
  },
  {
    _id: "2",
    word: "No Cap",
    meaning: "To say you are not lying. 'Cap' means a lie, so 'No Cap' means 'I'm being completely honest'.",
    example: ["That burger was the best in the city, no cap.", "I'm actually going to study tonight, no cap."],
    tone: "Serious / Honest",
    emotionalContext: "Truthfulness"
  },
  {
    _id: "3",
    word: "Bet",
    meaning: "An expression of agreement or confirmation. Similar to 'okay' or 'challenge accepted'.",
    example: ["A: Want to go to the mall? B: Bet.", "I bet you can't finish that in one go."],
    tone: "Casual / Agreement",
    emotionalContext: "Confirmation"
  },
  {
    _id: "4",
    word: "Delulu",
    meaning: "Short for 'delusional'. Often used in a lighthearted way to describe someone with unrealistic expectations, especially in romance.",
    example: ["Being delulu is the only way I survive these situations.", "She's totally delulu if she thinks he's coming back."],
    tone: "Funny / Self-deprecating",
    emotionalContext: "Humor"
  },
  {
    _id: "5",
    word: "Slay",
    meaning: "To do something exceptionally well or to look great.",
    example: ["You absolutely slayed that presentation!", "That outfit? Slay."],
    tone: "Positive / Empowering",
    emotionalContext: "Excellence"
  },
  {
    _id: "6",
    word: "Ghosted",
    meaning: "When someone suddenly stops all communication with another person without any explanation.",
    example: ["I was talking to him for weeks and then he just ghosted me.", "Getting ghosted is the worst feeling ever."],
    tone: "Negative / Sad",
    emotionalContext: "Rejection"
  },
  {
    _id: "7",
    word: "Bussin'",
    meaning: "A term used to describe food that is extremely delicious.",
    example: ["This pizza is straight bussin'.", "I need that recipe, it's actually bussin'."],
    tone: "Excited",
    emotionalContext: "Satisfaction"
  },
  {
    _id: "8",
    word: "Situationship",
    meaning: "A romantic or sexual relationship that is not yet considered formal or established.",
    example: ["We're in a bit of a situationship right now, it's complicated.", "I'm tired of situationships, I want something real."],
    tone: "Neutral / Complicated",
    emotionalContext: "Ambiguity"
  }
];
