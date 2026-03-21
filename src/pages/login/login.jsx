import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logoIcon from '../../assets/sprout-icon.png';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); 
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          Login to <span className="sprout-name">Sprout</span>
          <img src={logoIcon} alt=" " className="sprout-logo"/>
          </h2>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="18px"/>
          Continue with Google
        </button>

        <div className="login-divider">OR</div>

        <form onSubmit={handleEmailLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            className="login-username"
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="login-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-main">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;