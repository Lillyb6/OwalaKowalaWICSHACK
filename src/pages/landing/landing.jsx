import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="page-container">
      <h1>Sprout</h1>
      <p>Your journey to wellness starts here.</p>
      <Link to="/login">
        <button className="btn-main">Start Your Garden</button>
      </Link>
    </div>
  );
};

export default Landing;