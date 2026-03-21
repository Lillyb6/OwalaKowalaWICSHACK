import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';

// Page Imports
import Landing from './pages/landing/landing';
import Login from './pages/login/login';
import Dashboard from './pages/dashboard/dashboard';
import Tasks from './pages/tasks/tasks';
import Plants from './pages/plants/plants';
import Garden from './pages/garden/garden';
import Progress from './pages/progress/progress';
import Profile from './pages/profile/profile';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/plant" element={<Plants />} />
        <Route path="/garden" element={<Garden />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;