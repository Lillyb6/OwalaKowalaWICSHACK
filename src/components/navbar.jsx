import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const navStyle = {
    display: 'flex', 
    justifyContent: 'center', 
    gap: '15px', 
    padding: '15px', 
    background: '#2d5a27'
  };

  const getLinkStyle = ({ isActive }) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    background: isActive ? '#1b3a1a' : 'transparent',
    transition: '0.3s'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav style={navStyle}> 
      <NavLink style={getLinkStyle} to="/" end>Home</NavLink>
      
      {!user ? (
        <NavLink style={getLinkStyle} to="/login">Login</NavLink>
      ) : (
        <>
          <NavLink style={getLinkStyle} to="/dashboard">Dashboard</NavLink>
          <NavLink style={getLinkStyle} to="/tasks">Tasks</NavLink>
          <NavLink style={getLinkStyle} to="/plant">Plant</NavLink>
          <NavLink style={getLinkStyle} to="/garden">Garden</NavLink>
          <button 
            onClick={handleLogout} 
            style={{ background: 'none', border: '1px solid white', color: 'white', cursor: 'pointer', borderRadius: '20px', marginLeft: '10px', padding: '5px 15px' }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
};

export default Navbar;