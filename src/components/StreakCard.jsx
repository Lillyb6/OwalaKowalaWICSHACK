import React, { useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

export default function StreakCard() {
  const [user, setUser] = useState(undefined);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);

  useEffect(() => {
    let unsubscribeStats = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeStats) {
        unsubscribeStats();
        unsubscribeStats = null;
      }

      if (currentUser) {
        const statsRef = doc(db, "users", currentUser.uid, "stats", "main");

        unsubscribeStats = onSnapshot(
          statsRef,
          (snap) => {
            if (snap.exists()) {
              const data = snap.data();
              setStreak(data.streakCount || 0);
              setLongest(data.longestStreak || 0);
            } else {
              setStreak(0);
              setLongest(0);
            }
          },
          (error) => {
            console.error("StreakCard Firestore error:", error);
            setStreak(0);
            setLongest(0);
          }
        );
      } else {
        setStreak(0);
        setLongest(0);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeStats) unsubscribeStats();
    };
  }, []);

  if (user === undefined) return <p>Loading streak...</p>;
  if (!user) return null;

  return (
    <div>
      <h2>Your Streaks</h2>
      <p style={{ fontSize: "28px", margin: "10px 0" }}>
        {streak} day{streak === 1 ? "" : "s"}
      </p>
      <p>Longest streak: {longest}</p>
    </div>
  );
}