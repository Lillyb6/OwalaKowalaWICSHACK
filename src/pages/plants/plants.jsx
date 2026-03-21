import React from 'react';
import './plants.css';

const PlantGrowth = ({ growthStage })
return (
  <div className="plants-container">
    <img
      src={`/images/plant-stage-${growthStage}.png`}
      className="plant-image"
      alt="Your growing plant"
    />

    <img
      src="/images/dirt-mound.png"
      className="dirt-mound"
      alt="Soil for planting"
      />

    <div className="grass-floor"></div>
  </div>
  );

export default Plants;