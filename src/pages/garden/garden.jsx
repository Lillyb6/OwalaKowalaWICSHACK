import React from 'react';
import './garden.css';

const Garden = () => {
  return (
  <div className="garden-container">
    <div className="cloud cloud-1" style={{animationDelay: '0s'}}></div>
    <div className="cloud cloud-2" style={{animationDelay: '10s'}}></div>
    <div className="cloud cloud-3" style={{animationDelay: '20s'}}></div>

   <div className="sun-container"> 
      <div className="sun-rays"></div>
      <div className="sun-core"></div>
    </div>
    
    <div className="plant-spot">
    </div>
    
    <div className="garden-sign">
      <div className="sign-board">Garden</div>
      <div className="sign-post"></div>
    </div>
  <div className="grass-floor"></div>
  </div>

  );
};

export default Garden;