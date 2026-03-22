import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import '../../index.css';

const Garden = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const loadGarden = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, 'garden', user.uid));
      if (snap.exists()) {
        setPlants(snap.data().plants || []);
      }
    };
    loadGarden();
  }, []);

  return (
    <div className="relative w-screen min-h-screen overflow-hidden bg-gradient-to-t from-indigo-300 via-blue-400 to-blue-500 flex flex-col items-center select-none">
      
      {/* Clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <Cloud className="top-16 [animation:drift_40s_linear_infinite] scale-100 opacity-90" delay="0s" />
        <Cloud className="top-40 [animation:drift_55s_linear_infinite] scale-75 opacity-70" delay="-10s" />
        <Cloud className="top-28 [animation:drift_30s_linear_infinite] scale-110 opacity-80" delay="-20s" />
        <Cloud className="top-60 [animation:drift_50s_linear_infinite] scale-50 opacity-40" delay="-5s" />
      </div>

      {/* Sun */}
      <div className="absolute top-12 right-[10%] w-48 h-48 flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full bg-[repeating-conic-gradient(from_0deg,#fae9ae22_0deg_15deg,transparent_15deg_30deg)] blur-md animate-[spin_30s_linear_infinite]"></div>
        <div className="absolute w-20 h-20 bg-yellow-100 rounded-full shadow-[0_0_80px_30px_rgba(252,229,145,0.7)] z-10"></div>
      </div>

      {/* Garden Sign */}
      <div className="absolute bottom-32 left-[15%] flex flex-col items-center z-20 transition-transform hover:scale-110 duration-500">
        <div className="bg-[#a67c52] text-[#fdf5e6] px-6 py-2 font-mono font-bold text-xl border-4 border-[#7a5a3a] rounded-sm shadow-2xl -rotate-3">
          Garden
        </div>
        <div className="w-3 h-24 bg-[#7a5a3a] -mt-1 shadow-xl"></div>
      </div>

      {/* Grown plants from garden collection */}
      {plants.map((plant, i) => (
        <div
          key={i}
          className="absolute z-20"
          style={{
            bottom: '160px',
            left: `${20 + (i * 18)}%`,
            transform: 'translateY(50%)',
          }}
        >
          <img
            src={`/images/${plant.flowerType}_6.png`}
            style={{ width: '200px' }}
            alt={`planted ${plant.flowerType}`}
          />
        </div>
      ))}

      {/* Empty state */}
      {plants.length === 0 && (
        <div className="absolute bottom-52 left-1/2 -translate-x-1/2 z-20 text-white text-center opacity-70">
          <p className="text-lg font-semibold">No plants yet!</p>
          <p className="text-sm">Complete tasks to grow your first plant 🌱</p>
        </div>
      )}

      {/* Garden bed / grass */}
      <div className="absolute bottom-0 w-full h-44 bg-gradient-to-b from-emerald-600 via-emerald-700 to-green-900 rounded-[50%_50%_0_0_/_15%_15%_0_0] shadow-[inset_0_20px_40px_rgba(0,0,0,0.3)] z-10">
        <span className="absolute top-4 left-1/3 text-2xl animate-bounce opacity-60">🌼</span>
        <span className="absolute top-8 right-1/4 text-xl animate-bounce [animation-delay:1s] opacity-60">🌸</span>
      </div>

      <style>{`
        @keyframes drift {
          from { left: -300px; }
          to { left: 100vw; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

const Cloud = ({ className, delay }) => (
  <div 
    className={`absolute w-40 h-14 bg-white rounded-full blur-[1px] ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="absolute -top-10 left-5 w-20 h-20 bg-white rounded-full"></div>
    <div className="absolute -top-6 right-6 w-14 h-14 bg-white rounded-full"></div>
  </div>
);

const Blade = ({ left, delay, height }) => (
  <div 
    className="absolute bottom-0 w-1 bg-gradient-to-t from-emerald-800 to-green-400 rounded-full origin-bottom animate-[sway_3s_ease-in-out_infinite]"
    style={{ 
      left: `${left}%`, 
      height: `${height}px`, 
      animationDelay: delay,
      transform: `rotate(${Math.random() * 10 - 5}deg)` 
    }}
  />
);

export default Garden;