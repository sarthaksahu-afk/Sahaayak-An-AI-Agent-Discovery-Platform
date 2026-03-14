import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userId', data.id);
        navigate('/');
      } else { alert(data.detail || "Error"); }
    } catch (err) { alert("Backend offline"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-30 z-0"></div>
      
      <div className="bg-white/60 backdrop-blur-3xl border border-white/80 p-12 rounded-[3rem] shadow-2xl w-full max-w-md relative z-10">
        <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">{isLogin ? "Welcome Back" : "Join Hub"}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && <input type="text" placeholder="Full Name" className="w-full bg-white/80 border border-white/80 p-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-blue-400/50 font-bold shadow-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} required />}
          <input type="email" placeholder="Email" className="w-full bg-white/80 border border-white/80 p-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-blue-400/50 font-bold shadow-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="w-full bg-white/80 border border-white/80 p-4 rounded-2xl text-gray-900 outline-none focus:ring-4 focus:ring-blue-400/50 font-bold shadow-sm" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
          
          {!isLogin && (
            <select 
              className="w-full bg-white/90 border border-white/80 p-4 rounded-2xl text-gray-900 font-bold outline-none shadow-sm" 
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">Individual User</option>
              <option value="company">AI Company</option>
              <option value="admin">Platform Admin</option>
            </select>
          )}
          
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-95">
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-6 text-gray-600 font-bold hover:text-blue-700 transition-colors">
          {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Login;