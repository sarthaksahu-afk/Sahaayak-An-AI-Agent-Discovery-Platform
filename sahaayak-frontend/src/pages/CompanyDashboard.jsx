import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({ ai_name: '', category: 'Productivity', description: '', link: '', simulator_prompt: '' });

  const rawId = localStorage.getItem('userId');
  const ownerId = parseInt(rawId) || 1; 

  const fetchData = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/company/agents/${ownerId}`, { cache: 'no-store' });
      if (res.ok) setAgents(await res.json());
    } catch (err) { console.log("Failed to fetch tools", err); }
  };

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'company') navigate('/');
    else fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/tools/submit', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, company_name: "My Company", owner_id: ownerId })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        alert(`Backend Error: ${JSON.stringify(errorData.detail)}`);
        return;
      }
      setFormData({ ai_name: '', category: 'Productivity', description: '', link: '', simulator_prompt: '' });
      fetchData(); 
    } catch (err) { alert(`Network Error: ${err.message}`); }
  };

  const handleAction = async (id, endpoint) => {
    try {
      await fetch(`http://localhost:5000/api/company/${endpoint}/${id}`, { method: 'POST' });
      fetchData();
    } catch (err) { alert("Action failed."); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-10 relative font-sans">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-30 pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-6xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black text-gray-900">Company <span className="text-blue-600">Dashboard</span></h1>
          <button onClick={() => navigate('/')} className="text-blue-700 font-bold hover:underline bg-white/60 px-6 py-2 rounded-full shadow-sm">← Back to Hub</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/80 shadow-2xl">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Submit New AI Tool</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="AI Name" required value={formData.ai_name} onChange={e => setFormData({...formData, ai_name: e.target.value})} className="w-full p-4 rounded-2xl bg-white/80 border border-white/80 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm" />
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 rounded-2xl bg-white/80 border border-white/80 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm">
                <option value="Productivity">Productivity</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Research">Research</option>
                <option value="Coding">Coding</option>
              </select>
              <textarea placeholder="Description (Auto-translated to 5 languages!)" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 rounded-2xl bg-white/80 border border-white/80 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm h-32"></textarea>
              <input type="url" placeholder="Website Link" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full p-4 rounded-2xl bg-white/80 border border-white/80 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-blue-400/50 shadow-sm" />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black transition-all shadow-xl active:scale-95">Submit for Approval</button>
            </form>
          </div>

          <div className="bg-white/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/80 shadow-2xl overflow-y-auto max-h-[600px]">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Manage Your Tools</h2>
            <div className="space-y-4">
              {agents.map(a => (
                <div key={a.id} className="bg-white/80 border border-white/80 p-6 rounded-2xl flex justify-between items-center shadow-sm">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{a.ai_name}</h3>
                    <span className={`text-xs font-black uppercase tracking-widest ${a.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{a.status}</span>
                  </div>
                  {a.status === 'Pending Approval' && <button onClick={() => handleAction(a.id, 'recall')} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-black text-sm shadow-md transition-all active:scale-95">Recall Request</button>}
                  {a.status === 'Active' && <button onClick={() => handleAction(a.id, 'request_delete')} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-sm shadow-md transition-all active:scale-95">Request Deletion</button>}
                  {a.status === 'Pending Deletion' && <span className="text-red-500 font-bold text-sm">Deletion in review...</span>}
                </div>
              ))}
              {agents.length === 0 && <p className="text-gray-600 font-bold italic">You haven't submitted any tools yet.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;