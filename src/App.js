import React, { useState, useRef, useEffect } from "react";
import './PowerStyle.css';
import Leaderboard from "./Leaderboard";
import flashcards from "./flashcards";
import { fundamentals, objections } from "./script";

function getLeaderboard() {
  return JSON.parse(localStorage.getItem("leaderboard") || "[]");
}
function saveLeaderboard(lb) {
  localStorage.setItem("leaderboard", JSON.stringify(lb));
}

function Teleprompter({ script }) {
  const [currentLine, setCurrentLine] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentLine((prev) => (prev < script.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(intervalRef.current);
  }, [script.length]);

  return (
    <div className="card">
      <h2 style={{ textAlign: "center" }}>Teleprompter Mode</h2>
      <div style={{ fontSize: 28, minHeight: 150, textAlign: "center", margin: "40px 0" }}>
        {script.map((line, idx) => (
          <div key={idx} style={{
            color: idx === currentLine ? "#111" : "#bbb",
            fontWeight: idx === currentLine ? "bold" : "normal",
            transition: "color 0.2s"
          }}>
            {line}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center" }}>
        <button className="button" onClick={() => setCurrentLine(currentLine > 0 ? currentLine - 1 : 0)}>Previous</button>
        <button className="button" style={{ marginLeft: 10 }} onClick={() => setCurrentLine(currentLine < script.length - 1 ? currentLine + 1 : currentLine)}>Next</button>
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <small>Lines auto-advance every 3 seconds. You can also go forward/back manually.</small>
      </div>
    </div>
  );
}

function FlashcardPractice({ flashcards }) {
  const categories = ["All", ...new Set(flashcards.map(card => card.category))];
  const [selectedCategories, setSelectedCategories] = useState([categories[0] || ""]);
  const filteredFlashcards =
    selectedCategories.includes("All")
      ? flashcards
      : flashcards.filter(card => selectedCategories.includes(card.category));
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setCurrent(0);
    setShowAnswer(false);
  }, [selectedCategories]);

  return (
    <div className="card">
      <h2>Flashcard Practice</h2>
      <div style={{ marginBottom: 20 }}>
        <label className="category-label">
          Category:
          <select
            multiple
            className="category-picker"
            value={selectedCategories}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCategories(selected.length ? selected : ["All"]);
            }}
            size={Math.min(6, categories.length)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <div style={{ fontSize: 12, color: "#888" }}>
          Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple categories
        </div>
      </div>
      <div>
        <div className="progress-outer">
          <div
            className="progress-inner"
            style={{
              width: `${filteredFlashcards.length ? ((current+1)/filteredFlashcards.length)*100 : 0}%`
            }}
          />
        </div>
        <h3>Flashcard {filteredFlashcards.length ? current + 1 : 0} of {filteredFlashcards.length}</h3>
        {filteredFlashcards.length ? (
          <>
            <p><b>Q:</b> {filteredFlashcards[current].question}</p>
            {showAnswer ? (
  <div>
    <p>
      <b>A:</b>{" "}
      {filteredFlashcards[current].answer.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </p>
    <button
      className="button"
      style={{ background: "#eee", color: "#234" }}
      onClick={() => setShowAnswer(false)}
    >
      Hide Answer
    </button>
  </div>
) : (
  <button className="button" onClick={() => setShowAnswer(true)}>Show Answer</button>
)}

            <div style={{ marginTop: 20 }}>
              <button
                className="button"
                onClick={() => {
                  setCurrent((prev) => (prev > 0 ? prev - 1 : 0));
                  setShowAnswer(false);
                }}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className="button"
                onClick={() => {
                  setCurrent((prev) => (prev < filteredFlashcards.length - 1 ? prev + 1 : prev));
                  setShowAnswer(false);
                }}
                disabled={current === filteredFlashcards.length - 1}
                style={{ marginLeft: 10 }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No flashcards in these categories.</p>
        )}
      </div>
    </div>
  );
}

function SpeechPractice({ flashcards, addScore, leaderboard }) {
  const categories = ["All", ...new Set(flashcards.map(card => card.category))];
  const [selectedCategories, setSelectedCategories] = useState([categories[0] || ""]);
  const filteredFlashcards =
    selectedCategories.includes("All")
      ? flashcards
      : flashcards.filter(card => selectedCategories.includes(card.category));
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Speech Recognition
  const [recognizing, setRecognizing] = useState(false);
  const [spoken, setSpoken] = useState("");
  const [feedback, setFeedback] = useState("");
  const recognitionRef = useRef(null);

  // Score/leaderboard
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [nicknamePrompt, setNicknamePrompt] = useState(false);
  const [pendingScore, setPendingScore] = useState(0);

  const bestScore = leaderboard.length > 0 ? leaderboard[0].score : 0;

  useEffect(() => {
    setCurrent(0);
    setShowAnswer(false);
    setSpoken("");
    setFeedback("");
    setCorrectCount(0);
    setIncorrectCount(0);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [selectedCategories]);

  const handleStartSpeech = () => {
    setSpoken("");
    setFeedback("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    setRecognizing(true);
    recognition.start();
    recognition.onresult = (event) => {
      setSpoken(event.results[0][0].transcript);
    };
    recognition.onerror = (event) => {
      setFeedback("❌ Error: " + event.error);
      setRecognizing(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setRecognizing(false);
      recognitionRef.current = null;
    };
  };

  const handleStopSpeech = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecognizing(false);
      setTimeout(() => {
        const clean = (str) =>
          str
            .replace(/[.,!?]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();
        const user = clean(spoken);
        const answer = clean(filteredFlashcards[current].answer);
        if (!user) {
          setFeedback("❌ No speech detected. Try again.");
        } else if (user === answer || answer.includes(user) || user.includes(answer)) {
          setFeedback("✅ Correct!");
          setCorrectCount((c) => {
            const newScore = c + 1;
            if (newScore > bestScore) {
              setPendingScore(newScore);
              setTimeout(() => setNicknamePrompt(true), 400);
            }
            return newScore;
          });
        } else {
          setFeedback("❌ Try again. (What you said is above)");
          setIncorrectCount((i) => i + 1);
        }
      }, 100);
    }
  };

  const handleResetStats = () => {
    setCorrectCount(0);
    setIncorrectCount(0);
  };

  return (
    <div className="card">
      <h2>Speech Practice</h2>
      <div style={{ marginBottom: 12, fontSize: 16 }}>
        <b>Session Progress:</b>
        <span style={{ color: "green", marginLeft: 8 }}>Correct: {correctCount}</span>
        <span style={{ color: "red", marginLeft: 18 }}>Incorrect: {incorrectCount}</span>
        <button
          className="button"
          onClick={handleResetStats}
          style={{ marginLeft: 18, padding: "2px 8px", fontSize: 12 }}
        >
          Reset Progress
        </button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label className="category-label">
          Category:
          <select
            multiple
            className="category-picker"
            value={selectedCategories}
            onChange={e => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCategories(selected.length ? selected : ["All"]);
            }}
            size={Math.min(6, categories.length)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <div style={{ fontSize: 12, color: "#888" }}>
          Hold <b>Ctrl</b> (Windows) or <b>Cmd</b> (Mac) to select multiple categories
        </div>
      </div>
      <div>
        <div className="progress-outer">
          <div
            className="progress-inner"
            style={{
              width: `${filteredFlashcards.length ? ((current+1)/filteredFlashcards.length)*100 : 0}%`
            }}
          />
        </div>
        <h3>Flashcard {filteredFlashcards.length ? current + 1 : 0} of {filteredFlashcards.length}</h3>
        {filteredFlashcards.length ? (
          <>
            <p><b>Q:</b> {filteredFlashcards[current].question}</p>
            {showAnswer ? (
  <div>
    <p>
      <b>A:</b>{" "}
      {filteredFlashcards[current].answer.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ))}
    </p>
    <button
      className="button"
      style={{ background: "#eee", color: "#234" }}
      onClick={() => setShowAnswer(false)}
    >
      Hide Answer
    </button>
  </div>
) : (
  <button className="button" onClick={() => setShowAnswer(true)}>Show Answer</button>
)}

            <div style={{ margin: "18px 0 8px 0" }}>
              {!recognizing ? (
                <button className="button" onClick={handleStartSpeech}>
                  Start Speaking
                </button>
              ) : (
                <button className="button" style={{ background: "#ffbbbb", color: "#700" }} onClick={handleStopSpeech}>
                  Stop Listening
                </button>
              )}
              {spoken && (
                <div style={{ marginTop: 8, fontSize: 14 }}>
                  <b>You said:</b> <span style={{ background: "#f2f2f2", borderRadius: 4, padding: "2px 6px" }}>{spoken}</span>
                </div>
              )}
              {feedback && (
                <div className={feedback.startsWith("✅") ? "feedback-correct" : "feedback-incorrect"}>
                  {feedback}
                </div>
              )}
            </div>
            <div style={{ marginTop: 20 }}>
              <button
                className="button"
                onClick={() => {
                  setCurrent((prev) => (prev > 0 ? prev - 1 : 0));
                  setShowAnswer(false);
                  setSpoken("");
                  setFeedback("");
                  if (recognitionRef.current) recognitionRef.current.stop();
                }}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className="button"
                onClick={() => {
                  setCurrent((prev) => (prev < filteredFlashcards.length - 1 ? prev + 1 : prev));
                  setShowAnswer(false);
                  setSpoken("");
                  setFeedback("");
                  if (recognitionRef.current) recognitionRef.current.stop();
                }}
                disabled={current === filteredFlashcards.length - 1}
                style={{ marginLeft: 10 }}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p>No flashcards in these categories.</p>
        )}
      </div>
      {nicknamePrompt && (
        <div style={{
          position: "fixed", top: 120, left: 0, right: 0, margin: "0 auto",
          maxWidth: 400, background: "#fff", border: "2px solid #0a8", borderRadius: 12,
          boxShadow: "0 2px 10px #0002", zIndex: 1001, padding: 24, textAlign: "center"
        }}>
          <h4>🎉 New High Score!</h4>
          <div style={{ marginBottom: 12 }}>Enter nickname/initials for the leaderboard:</div>
          <input
            style={{
              padding: 6, borderRadius: 6, border: "1px solid #aaa", marginBottom: 10, fontSize: 16
            }}
            maxLength={10}
            autoFocus
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (e.target.value.trim()) {
                  addScore(e.target.value.trim(), pendingScore);
                  setNicknamePrompt(false);
                  setPendingScore(0);
                }
              }
            }}
          />
          <button
            className="button"
            onClick={() => {
              const input = document.querySelector("input");
              if (input && input.value.trim()) {
                addScore(input.value.trim(), pendingScore);
                setNicknamePrompt(false);
                setPendingScore(0);
              }
            }}
            style={{ marginLeft: 8, padding: "4px 12px" }}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [mode, setMode] = useState("flashcardPractice");
  const [leaderboard, setLeaderboard] = useState(getLeaderboard());
  const [teleprompterSection, setTeleprompterSection] = useState("fundamentals");

  const addScore = (nickname, score) => {
    const newEntry = {
      nickname,
      score,
      date: new Date().toISOString()
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(updated);
    saveLeaderboard(updated);
  };

  return (
    <div>
      <Leaderboard scores={leaderboard} />
      <div className="mode-tabbar">
        {mode === "flashcardPractice" && "🧠 Power In Your Pocket"}
        {mode === "speechPractice" && "🎤 Power In Your Pocket"}
        {mode === "teleprompter" && "📽️ Power In Your Pocket"}
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <button className="button" onClick={() => setMode("flashcardPractice")}>Flashcards</button>
        <button className="button" style={{ marginLeft: 10 }} onClick={() => setMode("speechPractice")}>Speech Practice</button>
        <button className="button" style={{ marginLeft: 10 }} onClick={() => setMode("teleprompter")}>Teleprompter</button>
      </div>
      {mode === "flashcardPractice" && (
        <FlashcardPractice flashcards={flashcards} />
      )}
      {mode === "speechPractice" && (
        <SpeechPractice flashcards={flashcards} addScore={addScore} leaderboard={leaderboard} />
      )}
      {mode === "teleprompter" && (
        <div>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <label className="category-label">
              Script Section:
              <select
                className="category-picker"
                value={teleprompterSection}
                onChange={e => setTeleprompterSection(e.target.value)}
                style={{ marginLeft: 10, fontSize: 16, padding: "2px 8px" }}
              >
                <option value="fundamentals">Full Script Fundamentals</option>
                <option value="objections">Objections & Questions</option>
              </select>
            </label>
          </div>
          <Teleprompter
            script={
              teleprompterSection === "fundamentals"
                ? fundamentals
                : objections
            }
          />
        </div>
      )}
    </div>
  );
}

export default App;
