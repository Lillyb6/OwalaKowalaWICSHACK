import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const questions = [
  "I have felt cheerful and in good spirits",
  "I have felt calm and relaxed",
  "I have felt active and vigorous",
  "I woke up feeling fresh and rested",
  "My daily life has been filled with things that interest me",
];

const options = [
  { value: 5, label: "All of the time" },
  { value: 4, label: "Most of the time" },
  { value: 3, label: "More than half of the time" },
  { value: 2, label: "Less than half of the time" },
  { value: 1, label: "Some of the time" },
  { value: 0, label: "At no time" },
];

export default function WHO5Form() {
  const [user, setUser] = useState(undefined);
  const [answers, setAnswers] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showProgressButton, setShowProgressButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (questionIndex, value) => {
    const updated = [...answers];
    updated[questionIndex] = Number(value);
    setAnswers(updated);
  };

  const allAnswered = answers.every((answer) => answer !== null);

  const rawScore = allAnswered
    ? answers.reduce((sum, value) => sum + value, 0)
    : 0;

  const percentScore = rawScore * 4;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    if (!allAnswered) {
      setMessage("Please answer all 5 questions.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setShowProgressButton(false);

      const today = new Date().toISOString().slice(0, 10);

      await setDoc(doc(db, "users", user.uid, "who5Scores", today), {
        date: today,
        answers,
        rawScore,
        percentScore,
        createdAt: serverTimestamp(),
      });

      setMessage("WHO-5 score saved successfully.");
      setShowProgressButton(true);
    } catch (err) {
      console.error("Error saving WHO-5 score:", err);
      setMessage("Failed to save score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginTop: "20px",
      }}
    >
      <h2>WHO-5 Well-Being Check-In</h2>
      <p>Over the last 2 weeks, how often have you felt the following?</p>

      <form onSubmit={handleSubmit}>
        {questions.map((question, qIndex) => (
          <div
            key={qIndex}
            style={{
              marginBottom: "20px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          >
            <p style={{ fontWeight: "bold" }}>
              {qIndex + 1}. {question}
            </p>

            {options.map((option) => (
              <label
                key={option.value}
                style={{ display: "block", marginBottom: "8px" }}
              >
                <input
                  type="radio"
                  name={`question-${qIndex}`}
                  value={option.value}
                  checked={answers[qIndex] === option.value}
                  onChange={(e) => handleChange(qIndex, e.target.value)}
                  style={{ marginRight: "8px" }}
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Submit WHO-5"}
        </button>
      </form>

      {allAnswered && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Raw Score:</strong> {rawScore} / 25</p>
          <p><strong>Percent Score:</strong> {percentScore} / 100</p>
        </div>
      )}

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}

      {showProgressButton && (
        <button
          onClick={() => navigate("/progress")}
          style={{
            marginTop: "16px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          View Progress Chart
        </button>
      )}
    </div>
  );
}