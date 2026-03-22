import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import '../../index.css';

const Plants = () => {
  const [stage, setStage] = useState(1);
  const [flowerType, setFlowerType] = useState('rose');
  const [potColor, setPotColor] = useState('pink');

  const [fireflies] = useState(() =>
    [...Array(15)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60 + 10}%`,
      delay: `${Math.random() * 5}s`,
    }))
  );

  // Load saved state from Firestore on mount
  useEffect(() => {
    const loadPlant = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, 'plants', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setStage(data.stage || 1);
        setFlowerType(data.flowerType || 'rose');
        setPotColor(data.potColor || 'pink');
      }
    };
    loadPlant();
  }, []);

  const savePlant = async (newStage, newFlowerType, newPotColor) => {
    const user = auth.currentUser;
    if (!user) return;
    await setDoc(doc(db, 'plants', user.uid), {
      stage: newStage,
      flowerType: newFlowerType,
      potColor: newPotColor,
      updatedAt: new Date()
    });
  };

  const handleReset = async () => {
    setStage(1);
    await savePlant(1, flowerType, potColor);
  };

  const handleFlowerType = async (type) => {
    setFlowerType(type);
    await savePlant(stage, type, potColor);
  };

  const handlePotColor = async (color) => {
    setPotColor(color);
    await savePlant(stage, flowerType, color);
  };

  const getMarginLeft = () => {
    if (flowerType === 'sunflower') {
      if (stage === 1) return '260px';
      if (stage === 3) return '75px';
      return '30px';
    }
    return stage === 1 ? '260px' : '0px';
  };

  const potColors = [
    { name: 'pink', bg: 'bg-[#ffb7c5]' },
    { name: 'purple', bg: 'bg-[#cbc3e3]' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-t from-indigo-300 via-blue-400 to-blue-500 flex flex-col items-center justify-end select-none">

      {/* Fireflies */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {fireflies.map((f, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-yellow-100 rounded-full blur-[1px] animate-[glow_4s_ease-in-out_infinite]"
            style={{ left: f.left, top: f.top, animationDelay: f.delay }}
          />
        ))}
      </div>

      {/* Sky */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-12 right-[10%] w-48 h-48 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full bg-[repeating-conic-gradient(from_0deg,#fae9ae22_0deg_15deg,transparent_15deg_30deg)] blur-md animate-[spin_30s_linear_infinite]" />
          <div className="absolute w-20 h-20 bg-yellow-100 rounded-full shadow-[0_0_80px_30px_rgba(252,229,145,0.7)]" />
        </div>
        <Cloud className="top-16 [animation:drift_40s_linear_infinite]" delay="0s" />
        <Cloud className="top-40 [animation:drift_55s_linear_infinite] scale-75 opacity-70" delay="-10s" />
      </div>

      {/* Hill */}
      <div className="absolute bottom-0 w-full h-[220px] z-20 flex justify-center">
        <div className="relative w-[140%] h-[300px] rounded-t-[50%] bg-[#4c956c] overflow-hidden">
          <div className="absolute inset-0 bg-[#4c956c]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,0,0,0.25),transparent_60%)] opacity-50" />
        </div>
      </div>

      
      <div className="relative flex items-end justify-center w-[800px] h-[600px] mb-8 z-30">

        
        <img
          key={`${flowerType}-${stage}`}
          src={`/images/${flowerType}_${stage}.png`}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[900px] z-[34] origin-bottom animate-[grow_0.5s_ease-out_forwards,wind_10s_ease-in-out_infinite]"
          style={{ marginLeft: getMarginLeft() }}
          alt="plant"
        />

        
        <img
          src={`/images/${potColor}_pot.png`}
          className="relative w-[750px] z-[32] bottom-4 drop-shadow-[0_25px_25px_rgba(0,0,0,0.3)]"
          alt="pot"
        />

        
        <img
          src="/images/dirt_mound.png"
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[780px] z-[33]"
          alt="dirt"
        />
      </div>

      
      <div className="absolute bottom-0 w-[125%] left-1/2 -translate-x-1/2 h-[120px] pointer-events-none z-40">
        {[...Array(140)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-[3px] bg-gradient-to-t from-emerald-950 via-emerald-800 to-green-400 rounded-full origin-bottom animate-[sway_3s_ease-in-out_infinite]"
            style={{
              left: `${(i / 139) * 100}%`,
              height: `${45 + (Math.sin(i) * 18 + 25)}px`,
              animationDelay: `${(i * 0.05) % 2}s`,
            }}
          />
        ))}
      </div>

      
      <div className="fixed bottom-6 z-[100] flex items-center gap-4 px-8 py-3 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl border border-white">

        <button
          className="px-5 py-2 bg-slate-100 text-slate-500 font-bold rounded-full hover:bg-slate-200 transition-all"
          onClick={handleReset}
        >
          Reset
        </button>

        <div className="w-px h-8 bg-slate-200" />

        
        <div className="flex gap-1">
          {['rose', 'sunflower', 'lotus'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-full capitalize font-bold text-sm transition-all ${
                flowerType === type
                  ? 'bg-[#7584fa] text-white shadow-lg'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleFlowerType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="w-px h-8 bg-slate-200" />

        
        <div className="flex gap-2">
          {potColors.map((color) => (
            <button
              key={color.name}
              className={`w-7 h-7 rounded-full border-2 border-white shadow-sm transition-all hover:scale-125 ${color.bg} ${
                potColor === color.name ? 'ring-2 ring-slate-400 scale-125' : ''
              }`}
              onClick={() => handlePotColor(color.name)}
            />
          ))}
        </div>
      </div>

      
      <style>{`
        @keyframes drift { from { left: -300px; } to { left: 110vw; } }

        @keyframes sway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(2.5deg); }
        }

        @keyframes glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        @keyframes grow {
          0% { opacity: 0; transform: translateX(-50%) scale(0.85); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }

        @keyframes wind {
          0%   { transform: translateX(-50%) rotate(0deg); }
          30%  { transform: translateX(-50%) rotate(1deg); }
          60%  { transform: translateX(-50%) rotate(-1.2deg); }
          100% { transform: translateX(-50%) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

const Cloud = ({ className, delay }) => (
  <div
    className={`absolute left-[-300px] w-40 h-14 bg-white rounded-full blur-[1px] ${className}`}
    style={{ animationDelay: delay }}
  >
    <div className="absolute -top-10 left-5 w-20 h-20 bg-white rounded-full" />
    <div className="absolute -top-6 right-6 w-14 h-14 bg-white rounded-full" />
  </div>
);

export default Plants;
