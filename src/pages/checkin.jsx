import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import WHO5Form from "../components/WHO5Form";

const Checkin = () => {
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
      <h1>Daily Check-In</h1>

      {user ? (
        <WHO5Form />
      ) : (
        <p>Please log in to complete your check-in.</p>
      )}
    </div>
  );
};

export default Checkin;