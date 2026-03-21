import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <div style={{ padding: '40px', border: '1px solid #ddd', borderRadius: '15px', width: '350px', textAlign: 'center', background: 'white' }}>
        <h2 style={{ color: '#2d5a27' }}>Sprout Login</h2>
        
        <button 
          onClick={handleGoogleLogin}
          style={{ 
            width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '8px', 
            border: '1px solid #ddd', background: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="18px"/>
          Continue with Google
        </button>

        <div style={{ margin: '15px 0', color: '#888', fontSize: '0.8rem' }}>OR</div>

        <form onSubmit={handleEmailLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '10px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ width: '100%', padding: '12px', marginBottom: '20px', boxSizing: 'border-box', borderRadius: '8px', border: '1px solid #ccc' }} 
            required
          />
          <button type="submit" className="btn-main" style={{ width: '100%', padding: '12px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;