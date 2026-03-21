import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export default function DailyQuoteCard({ uid }) {
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDailyQuote() {
      try {
        setLoading(true);
        setError("");

        const today = new Date().toISOString().slice(0, 10);
        const quoteRef = doc(db, "users", uid, "dailyQuotes", today);

        const quoteSnap = await getDoc(quoteRef);

        if (quoteSnap.exists()) {
          setQuote(quoteSnap.data().advice);
          return;
        }

        const response = await fetch("https://api.adviceslip.com/advice", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch advice");
        }

        const data = await response.json();
        const advice = data.slip.advice;

        await setDoc(quoteRef, {
          date: today,
          advice,
          createdAt: serverTimestamp(),
        });

        setQuote(advice);
      } catch (err) {
        console.error("DailyQuoteCard error:", err);
        setError("Could not load today’s quote.");
      } finally {
        setLoading(false);
      }
    }

    if (uid) {
      loadDailyQuote();
    }
  }, [uid]);

  if (loading) return <div>Loading daily motivation...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "16px",
        background: "#f4fff4",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        marginTop: "20px",
      }}
    >
      <h2 style={{ marginBottom: "10px", color: "#2d5a27" }}>
        Daily Motivation
      </h2>
      <p style={{ fontSize: "18px", lineHeight: "1.5" }}>"{quote}"</p>
    </div>
  );
}