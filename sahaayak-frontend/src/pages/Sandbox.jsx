import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const Sandbox = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // 1. Fetch the specific AI details so we know who we are talking to
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/agents');
        if (res.ok) {
          const allAgents = await res.json();
          const foundAgent = allAgents.find(a => a.id === id);
          if (foundAgent) {
            setAgent(foundAgent);
            // Set the initial greeting from the AI
            setMessages([{ 
              role: 'assistant', 
              content: `Hello! I am the simulator for ${foundAgent.ai_name}. I am ready to test. How can I assist you today?` 
            }]);
          } else {
            navigate('/'); // Kick back to home if ID is invalid
          }
        }
      } catch (error) {
        console.error("Failed to load agent", error);
      }
    };
    fetchAgent();
  }, [id, navigate]);

  // 2. Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 3. Handle sending the message to your FastAPI backend
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/api/sandbox/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tool_id: id, 
          user_message: userText 
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Error: " + (data.detail || "Something went wrong.") }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Connection to the server failed. Is the backend running?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!agent) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-black text-2xl animate-pulse">Loading Simulator...</div>;
  }

  // Use Clearbit for logos, fallback to a letter avatar
  const domain = agent.link?.replace(/^https?:\/\//, '').split('/')[0] || "ai.com";

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop')" }}></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-5 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div className="flex items-center gap-3">
            <img src={`https://logo.clearbit.com/${domain}`} onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${agent.ai_name}&background=3b82f6&color=fff&bold=true`; }} alt="logo" className="w-10 h-10 rounded-xl bg-white p-1" />
            <div>
              <h1 className="text-xl font-black leading-tight">{agent.ai_name} <span className="text-[10px] text-cyan-400 uppercase tracking-widest ml-2 bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/30">Simulator</span></h1>
              <p className="text-xs text-slate-400 font-bold">{agent.company_name}</p>
            </div>
          </div>
        </div>
        <a href={agent.link} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-slate-300 hover:text-white border border-slate-600 px-4 py-2 rounded-full hover:bg-slate-800 transition-all">
          Visit Official Site
        </a>
      </nav>

      {/* Chat Window */}
      <main className="relative z-10 flex-grow max-w-4xl w-full mx-auto flex flex-col p-4 md:p-8 overflow-hidden">
        <div className="flex-grow bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden shadow-2xl">
          
          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 text-sm md:text-base ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white font-medium rounded-br-none shadow-lg' 
                    : 'bg-white/10 border border-white/10 text-slate-100 font-medium rounded-bl-none shadow-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-none px-6 py-4 shadow-md flex gap-2 items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="mt-6 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={`Message ${agent.ai_name}...`}
              className="w-full bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 rounded-full px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
            />
            <button 
              type="submit" 
              disabled={isTyping || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-cyan-500 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>

        </div>
      </main>

      {/* Add a tiny style block to make the scrollbar look good */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}} />
    </div>
  );
};

export default Sandbox;