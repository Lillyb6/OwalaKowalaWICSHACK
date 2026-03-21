import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import DailyQuoteCard from '../../components/DailyQuoteCard';

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
      <p>Loading. . .</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>Dashboard Page</h1>
      {user ? <DailyQuoteCard uid={user.uid} /> :  <p>Please log in to view your daily quote.</p>}

    </div>
  );
};

export default Dashboard;