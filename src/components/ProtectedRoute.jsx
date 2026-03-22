import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const ProtectedRoute = () => {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
      if (!currentUser) navigate('/');
    });
    return () => unsubscribe();
  }, []);

  if (checking) return null;
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;