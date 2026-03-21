import React from 'react';
import './plants.css';

const Plants = ({ growthStage }) => { 
  return (
    <div className="plants-container">
      {growthStage && (
        <img
          src={`/images/plant-stage-${growthStage}.png`}
          className="plant-image"
          alt="Your growing plant"
        />
      )}

      <div className="grass-floor"></div>
    </div>
  );
};

export default Plants;