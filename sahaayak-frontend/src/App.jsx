import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import Sandbox from './pages/Sandbox';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<CompanyDashboard />} />
        <Route path="/sandbox/:id" element={<Sandbox />} />
        {/* Fallback route to prevent white screens on bad URLs */}
        <Route path="*" element={<div className="p-20 text-center text-2xl font-black">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;