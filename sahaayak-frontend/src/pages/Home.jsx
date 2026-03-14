import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const translations = {
  "English": { title1: "Find the Right AI for", title2: "Real Impact", sub: "Discover and test trusted AI tools tailored for regional growth.", search: "Search tools or tap mic...", suffix: "" },
  "Hindi": { title1: "सही एआई (AI) खोजें", title2: "असली प्रभाव", sub: "क्षेत्रीय विकास के लिए तैयार किए गए विश्वसनीय एआई टूल खोजें।", search: "खोजें या माइक टैप करें...", suffix: "_hi" },
  "Tamil": { title1: "சரியான AI-ஐ தேடுங்கள்", title2: "உண்மையான தாக்கம்", sub: "பிராந்திய வளர்ச்சிக்கான நம்பகமான AI கருவிகளைக் கண்டறியவும்.", search: "தேடுங்கள் அல்லது பேசவும்...", suffix: "_ta" },
  "Telugu": { title1: "సరైన AIని కనుగొనండి", title2: "నిజమైన ప్రభావం", sub: "ప్రాంతీయ అభివృద్ధి కోసం రూపొందించిన AI సాధనాలను అన్వేషించండి.", search: "వెతకండి లేదా మాట్లాడండి...", suffix: "_te" },
  "Kannada": { title1: "ಸರಿಯಾದ AI ಹುಡುಕಿ", title2: "ನಿಜವಾದ ಪ್ರಭಾವ", sub: "ಪ್ರಾದೇಶಿಕ ಅಭಿವೃದ್ಧಿಗಾಗಿ ವಿಶ್ವಾಸಾರ್ಹ AI ಪರಿಕರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.", search: "ಹುಡುಕಿ ಅಥವಾ ಮಾತನಾಡಿ...", suffix: "_kn" },
  "Malayalam": { title1: "ശരിയായ AI കണ്ടെത്തുക", title2: "യഥാർത്ഥ മാറ്റത്തിനായി", sub: "പ്രാദേശിക വളർച്ചയ്ക്കായി രൂപകൽപ്പന ചെയ്ത AI ടൂളുകൾ കണ്ടെത്തുക.", search: "തിരയുകയോ സംസാരിക്കുകയോ...", suffix: "_ml" }
};

const heroImages = {
  "All": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
  "Agriculture": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
  "Healthcare": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
  "Civic Tech": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
  "Translation": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000",
  "Accessibility": "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=2000",
  "Education": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2000",
  "Research": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=2000",  
  "Coding": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000",
  "Productivity": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2000",
  "Creative": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000",
  "default": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000"
};

const categories = Object.keys(heroImages).filter(k => k !== 'default');

const Home = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('appLang') || "English");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [dbAgents, setDbAgents] = useState([]); 
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  
  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const t = translations[selectedLang] || translations["English"];
  const activeImage = heroImages[activeCategory] || heroImages["default"];
  
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/agents', { cache: 'no-store' }); 
        if (response.ok) setDbAgents(await response.json());
      } catch (error) { console.log("Backend offline."); }
    }; 
    fetchAgents();
  }, []);

  // Reset to page 1 whenever search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const changeLanguage = (l) => {
    setSelectedLang(l);
    localStorage.setItem('appLang', l);
    setIsLangOpen(false);
  };

  const handleVoiceSearch = async () => {
    if (isRecording) { mediaRecorderRef.current?.stop(); setIsRecording(false); } 
    else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        setIsRecording(true);
        setTimeout(() => {
          if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop(); setIsRecording(false);
            setSearchQuery("agriculture"); 
          }
        }, 3000);
        mediaRecorderRef.current.start();
      } catch (err) { alert("Mic denied."); }
    }
  };

  // FILTER LOGIC
  const filteredAgents = dbAgents.filter(agent => {
    const matchCat = activeCategory === "All" || agent.category === activeCategory;
    const translatedName = agent[`ai_name${t.suffix}`] || agent.ai_name || "";
    const translatedDesc = agent[`description${t.suffix}`] || agent.description || "";
    
    const matchSearch = translatedName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        translatedDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen text-gray-950 font-sans pb-32 relative z-0">
      <div className="fixed inset-0 z-[-3] bg-cover bg-center transition-all duration-1000 scale-105" style={{ backgroundImage: `url(${activeImage})` }}></div>
      <div className="fixed inset-0 z-[-2] bg-white/20 backdrop-blur-[2px] pointer-events-none"></div>

      <nav className="flex justify-between items-center px-10 py-5 bg-white/70 backdrop-blur-xl border-b border-white/50 sticky top-0 z-[100]">
        <h1 className="text-3xl font-black text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-blue-700">Sahaayak</span> Hub
        </h1>
        
        <div className="flex items-center gap-4">
          {isLoggedIn && userRole === 'admin' && (
            <Link to="/admin" className="text-blue-700 font-black hover:underline mr-2">Admin Panel</Link>
          )}
          {isLoggedIn && userRole === 'company' && (
            <Link to="/dashboard" className="text-blue-700 font-black hover:underline mr-2">Dashboard</Link>
          )}

          <div className="relative">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="bg-white/80 px-5 py-2.5 rounded-full font-bold shadow-md hover:scale-110 transition-transform">🌐 {selectedLang}</button>
            {isLangOpen && (
              <div className="absolute right-0 top-12 bg-white/95 rounded-2xl shadow-2xl py-2 w-40 z-[110] font-bold">
                {Object.keys(translations).map(l => (
                  <button key={l} onClick={() => changeLanguage(l)} className="w-full text-left px-5 py-3 hover:bg-blue-600 hover:text-white transition-colors">{l}</button>
                ))}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <button onClick={() => {localStorage.clear(); navigate(0);}} className="bg-red-500 text-white px-6 py-2.5 rounded-full font-black shadow-md">Sign Out</button>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-black shadow-lg hover:scale-105 transition-transform">Sign In</Link>
          )}
        </div>
      </nav>

      <header className="pt-24 pb-16 px-4 flex justify-center">
        <div className="bg-white/40 backdrop-blur-3xl p-14 rounded-[4rem] shadow-2xl border border-white/60 max-w-4xl w-full text-center transition-transform hover:scale-[1.02] duration-500">
          <h2 className="text-7xl font-black text-gray-900 mb-2 leading-tight">
            {t.title1} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-500">{t.title2}</span>
          </h2>
          <p className="text-xl text-gray-800 font-bold mb-10">{t.sub}</p>
          
          <div className="relative max-w-2xl mx-auto flex items-center group">
            <input 
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search} 
              className="w-full pl-8 pr-16 py-5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-lg font-bold text-xl outline-none transition-all group-hover:scale-105 group-hover:shadow-2xl"
            />
            <button onClick={handleVoiceSearch} className={`absolute right-3 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:scale-110'}`}>
              {isRecording ? <div className="w-4 h-4 bg-white rounded-sm"></div> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10">
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map(cat => (
            <button 
              key={cat} onClick={() => setActiveCategory(cat)} 
              className={`px-8 py-3 rounded-full font-black text-sm transition-all duration-300 ${activeCategory === cat ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'bg-white/60 text-gray-900 hover:scale-125 hover:bg-white shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {/* RENDER CURRENT PAGE AGENTS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {currentAgents.map(agent => (
            <div key={agent.id} className="transition-transform duration-300 hover:scale-[1.05] hover:z-10 h-full">
              <div className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[3rem] p-8 shadow-xl flex flex-col h-full">
                <span className="bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full w-fit mb-6">
                  {agent.category}
                </span>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm border border-slate-100">
                    <img src={`https://logo.clearbit.com/${(agent.link || "").replace(/^https?:\/\//, '').split('/')[0]}`} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=AI"; }} className="w-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800">{agent[`ai_name${t.suffix}`] || agent.ai_name}</h3>
                </div>
                <p className="text-slate-600 font-medium mb-10 line-clamp-3 leading-relaxed">{agent[`description${t.suffix}`] || agent.description}</p>
                
                <div className="mt-auto flex gap-2">
                  <a href={agent.link} target="_blank" rel="noreferrer" className="w-1/2 bg-white/60 text-gray-900 py-3 rounded-xl font-black text-center shadow-md hover:bg-white transition-all text-sm">
                    Visit Site
                  </a>
                  <Link to={`/sandbox/${agent.id}`} className="w-1/2 bg-slate-900 text-white py-3 rounded-xl font-black text-center shadow-md hover:bg-blue-600 transition-all text-sm flex items-center justify-center">
                    Test in Sandbox
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-full font-black transition-all ${currentPage === 1 ? 'bg-white/30 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'}`}
            >
              Previous
            </button>
            
            <div className="flex gap-2 bg-white/40 backdrop-blur-xl p-2 rounded-full shadow-inner border border-white/50">
              {Array.from({ length: totalPages }, (_, i) => (
                <button 
                  key={i + 1} 
                  onClick={() => paginate(i + 1)}
                  className={`w-10 h-10 rounded-full font-black flex items-center justify-center transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-white/80'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-full font-black transition-all ${currentPage === totalPages ? 'bg-white/30 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg'}`}
            >
              Next
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default Home;