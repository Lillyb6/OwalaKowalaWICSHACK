import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './plants.css';

const Plants = () => {
  const [stage, setStage] = useState(1);
  const [flowerType, setFlowerType] = useState('rose');
  const [potColor, setPotColor] = useState('pink');

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
      if (stage === 1) {
        return '260px';
      } else if (stage === 3) {
        return '75px';
      } else {
        return '30px';
      }
    } else {
      return stage === 1 ? '260px' : '0px';
    }
  };

  return (
    <div className="plants-container">
      
      <div style={{ 
        position: 'relative', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-end', 
        width: '800px',  
        height: '850px', 
        zIndex: 10, 
        marginBottom: '80px' 
      }}>

        <img 
          src="/images/dirt_mound.png" 
          style={{ 
            position: 'absolute', 
            bottom: '0px', 
            left: '50%',
            transform: 'translateX(-50%)',
            width: '850px', 
            zIndex: 1 
          }} 
          alt="dirt"
        />

        <img 
          src={`/images/${flowerType}_${stage}.png`} 
          style={{ 
            position: 'absolute', 
            bottom: '-38px', 
            width: '1000px',  
            zIndex: 4,      
            left: '50%', 
            transform: 'translateX(-50%)',
            marginLeft: getMarginLeft(),
            transformOrigin: 'bottom',
            transition: 'bottom 0.5s ease-in-out' 
          }}
          alt="growing plant"
        />

        <img 
          src={`/images/${potColor}_pot.png`} 
          style={{ 
            width: '850px', 
            zIndex: 3,      
            position: 'relative' 
          }} 
          alt="pot"
        />
      </div>

      <div className="grass-floor"></div>

      <div style={{ 
        position: 'absolute', 
        bottom: '40px', 
        zIndex: 100, 
        display: 'flex', 
        gap: '12px',
        padding: '15px 25px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <button className="btn" onClick={handleReset}>Reset</button>
        <div style={{ width: '2px', background: '#ddd', margin: '0 10px' }} />
        <button className="btn" onClick={() => handleFlowerType('rose')}>Rose</button>
        <button className="btn" onClick={() => handleFlowerType('sunflower')}>Sunflower</button>
        <button className="btn" onClick={() => handleFlowerType('lotus')}>Lotus</button>
        <div style={{ width: '2px', background: '#ddd', margin: '0 10px' }} />
        <button className="btn" style={{color: 'hotpink'}} onClick={() => handlePotColor('pink')}>Pink Pot</button>
        <button className="btn" style={{color: 'purple'}} onClick={() => handlePotColor('purple')}>Purple Pot</button>
      </div>
    </div>
  );
};

export default Plants;
