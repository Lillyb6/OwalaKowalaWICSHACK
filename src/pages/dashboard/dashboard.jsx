import React, { useEffect, useState } from 'react';
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import DailyQuoteCard from '../../components/DailyQuoteCard';
import StreakCard from '../../components/StreakCard';
import './dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(undefined);
  
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch streak from Firestore (assuming a 'users' collection)
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setStreak(userDoc.data().streak || 0);
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
              <StreakCard />
              
              <button 
                className="habits-btn"
                onClick={() => navigate('/tasks')}
              >
                view your tasks
              </button>
            </div>

          <div className="right-container">
            <h2>Your Plants</h2>
            <button 
              className="plants-btn"
              onClick={() => navigate('/plant')}
            >
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