import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import DailyQuoteCard from '../../components/DailyQuoteCard';
import './dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) {
    return (
      <div className="page-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      {user ? (
        <>
        <DailyQuoteCard uid={user.uid} />

        <div className="bottom-boxes">
          <div className="streak-container">
            <h2>Your Streaks</h2>
            <button className="habits-btn">
              view your habits
            </button>
          </div>

          <div className="plants-container">
            <h2>Your Plants</h2>
            <button className="plants-btn">
              view your plant
            </button>
          </div>
        </div>
        </>
      ) : (
        <p>Please log in to view your daily quote.</p>
      )}
    </div>
  );
};

export default Dashboard;