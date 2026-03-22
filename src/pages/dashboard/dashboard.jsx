import React, { useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import DailyQuoteCard from '../../components/DailyQuoteCard';
import ProgressBar from '../../components/progressbar';
import './dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(undefined);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setStreak(userDoc.data().streak || 0);

          const done = userDoc.data().completedHabits || 0;
          const goal = 5; 
          setProgress(Math.round((done / goal) * 100));
        }
      }
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
          <div className="left-container">
            <h2>Your Streak</h2>
            <div className="streak-display">
                <span className="streak-number">{streak}</span>
                <span className="streak-label"> days</span>
              </div>
            <button className="habits-btn">
              view your habits
            </button>
          </div>

          <div className="middle-container">
            <h2>Daily Growth</h2>
            <div className="progress-section">
              <ProgressBar 
                bgcolor="rgb(255, 226, 226)" 
                completed={progress} 
              />
              <p className="progress-percentage">{progress}%</p>
            </div>
          <p className="progress-hint">Keep going to grow your garden!</p>
          </div>

          <div className="right-container">
            <h2>Your Plants</h2>
            <button className="plants-btn">
              view your plants
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