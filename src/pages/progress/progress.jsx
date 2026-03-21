import React, { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import WHO5Form from '../../components/WHO5Form';
import WHO5Chart from '../../components/WHO5Chart';
const Progress = () => {
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
      <h1>Progress Page</h1>

      {user ? (
        <>
          <WHO5Form />
          <WHO5Chart />
        </>
      ) : (
        <p>Please log in to view your progress.</p>
      )}
    </div>
  );
};

export default Progress;