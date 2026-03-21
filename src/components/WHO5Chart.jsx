import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function WHO5Chart() {
  const [user, setUser] = useState(undefined);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const scoresRef = collection(db, "users", currentUser.uid, "who5Scores");
          const q = query(scoresRef, orderBy("date", "asc"));
          const snapshot = await getDocs(q);

          const data = snapshot.docs.map((doc) => {
            const score = doc.data();
            return {
              date: score.date,
              percentScore: score.percentScore,
            };
          });

          setChartData(data);
        } catch (error) {
          console.error("Error loading WHO-5 chart data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return <p>Loading chart...</p>;
  }

  if (!user) {
    return <p>Please log in to view your chart.</p>;
  }

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "20px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2>WHO-5 Progress Chart</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="percentScore" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}