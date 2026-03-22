import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import logoIcon from '../assets/sprout-icon.png';
import ProgressBar from './progressbar';

const PLANTS_PER_LEVEL = 5;

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [plantsInLevel, setPlantsInLevel] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let gardenUnsub = null;

    const authUnsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Listen to garden collection in real time so level updates instantly
        gardenUnsub = onSnapshot(doc(db, 'garden', currentUser.uid), (snap) => {
          const plants = snap.exists() ? snap.data().plants || [] : [];
          const totalPlants = plants.length;

          const level = Math.floor(totalPlants / PLANTS_PER_LEVEL) + 1;
          const plantsThisLevel = totalPlants % PLANTS_PER_LEVEL;
          const progress = Math.round((plantsThisLevel / PLANTS_PER_LEVEL) * 100);

          setCurrentLevel(level);
          setPlantsInLevel(plantsThisLevel);
          setCurrentProgress(progress);
        });
      } else {
        setIsSidebarOpen(false);
        setCurrentProgress(0);
        setCurrentLevel(1);
        setPlantsInLevel(0);
        if (gardenUnsub) gardenUnsub();
      }
    });

    return () => {
      authUnsub();
      if (gardenUnsub) gardenUnsub();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSidebarOpen(false);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSidebar = () => {
    if (user) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const navStyle = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 30px', background: '#2d5a27', color: 'white', height: '70px',
    position: 'sticky', top: 0, zIndex: 1000
  };

  const sidebarStyle = {
    position: 'fixed', top: 0, left: isSidebarOpen && user ? '0' : '-320px', 
    width: '280px', height: '100vh', background: 'white',
    boxShadow: '4px 0 15px rgba(0,0,0,0.3)', transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
    zIndex: 2000, padding: '80px 20px 20px 20px', display: 'flex', 
    flexDirection: 'column', justifyContent: 'space-between'
  };

  const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    background: 'rgba(0,0,0,0.5)', opacity: isSidebarOpen && user ? 1 : 0,
    visibility: isSidebarOpen && user ? 'visible' : 'hidden', transition: 'opacity 0.4s ease', zIndex: 1500
  };

  const getLinkStyle = ({ isActive }) => ({
    color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '20px',
    background: isActive ? '#1b3a1a' : 'transparent', transition: '0.3s'
  });

  const sideLinkStyle = {
    color: '#2d5a27', textDecoration: 'none', fontSize: '1.1rem', padding: '10px', borderRadius: '8px'
  };

  return (
    <>
      <nav style={navStyle}> 
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: user ? 'pointer' : 'default' }} 
          onClick={toggleSidebar}
        >
          <img src={logoIcon} alt="Sprouts Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <span style={{ fontFamily: '"DynaPuff", system-ui', fontSize: '1.6rem', color: 'white', marginLeft: '8px', fontWeight: 600 }}>
            sprout.com
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <NavLink style={getLinkStyle} to="/" end>Home</NavLink>
          {!user ? (
            <NavLink style={getLinkStyle} to="/login">Login</NavLink>
          ) : (
            <>
              <NavLink style={getLinkStyle} to="/dashboard">Dashboard</NavLink>
              <NavLink style={getLinkStyle} to="/tasks">Tasks</NavLink>
            </>
          )}
        </div>
      </nav>

      <div style={overlayStyle} onClick={toggleSidebar} />

      <div style={sidebarStyle}>
        <button 
          onClick={toggleSidebar} 
          style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="px-2 mb-6">
            <div className="flex justify-between items-end">
              <span className="text-[#2d5a27] font-bold text-lg">Level {currentLevel}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                {plantsInLevel} / {PLANTS_PER_LEVEL} plants
              </span>
            </div>
            <ProgressBar bgcolor="#4ade80" completed={currentProgress} />
          </div>

          <h3 style={{ color: '#2d5a27', marginBottom: '10px' }}>Account Menu</h3>
          <NavLink to="/dashboard" style={sideLinkStyle} onClick={toggleSidebar}>Dashboard</NavLink>
          <NavLink to="/tasks" style={sideLinkStyle} onClick={toggleSidebar}>Tasks</NavLink>
          <NavLink to="/plant" style={sideLinkStyle} onClick={toggleSidebar}>Plant Health</NavLink>
          <NavLink to="/garden" style={sideLinkStyle} onClick={toggleSidebar}>Garden Map</NavLink>
          <NavLink to="/checkin" style={sideLinkStyle} onClick={toggleSidebar}>Check-In</NavLink>
          <NavLink to="/progress" style={sideLinkStyle} onClick={toggleSidebar}>Progress</NavLink>
        </div>

        <div>
          <hr style={{ border: '0.5px solid #eee', marginBottom: '16px' }} />
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', background: '#ff4d4d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
