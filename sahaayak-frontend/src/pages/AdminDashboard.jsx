import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (localStorage.getItem('userRole') !== 'admin') navigate('/');
    else fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:5000/api/admin/pending', { cache: 'no-store' })
      .then(res => res.json()).then(setRequests);
  };

  const handleAction = (id, type, action) => {
    const endpoint = type === 'Pending Approval' ? 'handle_insertion' : 'handle_deletion';
    fetch(`http://localhost:5000/api/admin/${endpoint}/${id}/${action}`, { method: 'POST' })
      .then(() => fetchData());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 md:p-20 relative font-sans">
      <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80')] bg-cover opacity-20 pointer-events-none"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-5xl font-black">Admin <span className="text-yellow-400">Control Center</span></h1>
          <button onClick={() => navigate('/')} className="text-blue-400 font-bold hover:underline bg-white/10 px-6 py-2 rounded-full">← Back to Hub</button>
        </div>

        <div className="grid gap-6">
          {requests.map(a => (
            <div key={a.id} className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 flex flex-col md:flex-row justify-between items-center shadow-xl">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black text-white">{a.ai_name}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${a.status === 'Pending Approval' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                    {a.status === 'Pending Approval' ? 'New Submission' : 'Deletion Request'}
                  </span>
                </div>
                <p className="font-bold opacity-60">{a.company_name} | {a.category}</p>
              </div>
              
              <div className="flex gap-4">
                <button onClick={() => handleAction(a.id, a.status, 'approve')} className="bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-black transition-all active:scale-95 shadow-lg">
                  {a.status === 'Pending Approval' ? 'Approve Tool' : 'Approve Deletion'}
                </button>
                <button onClick={() => handleAction(a.id, a.status, 'reject')} className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl font-black transition-all active:scale-95 shadow-lg">
                  {a.status === 'Pending Approval' ? 'Reject & Delete' : 'Reject (Keep Alive)'}
                </button>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-2xl font-bold opacity-30 italic">No pending requests...</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;