import React, { createContext, useState, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. CREATE GLOBAL CONTEXT HERE TO AVOID IMPORT ERRORS
const LanguageContext = createContext();

export const translations = {
  "English": {
    navIn: "Sign In", navOut: "Sign Out", view: "View & Test",
    h1: "Find the Right AI for", h2: "Real Impact",
    sub: "Discover and test trusted AI tools tailored for regional growth.",
    search: "Search tools or tap mic...",
    dbKeys: { name: "ai_name", desc: "description" }
  },
  "Hindi": {
    navIn: "साइन इन", navOut: "साइन आउट", view: "देखें और परीक्षण करें",
    h1: "सही एआई (AI) खोजें", h2: "असली प्रभाव",
    sub: "क्षेत्रीय विकास के लिए तैयार किए गए विश्वसनीय एआई टूल खोजें।",
    search: "खोजें या माइक टैप करें...",
    dbKeys: { name: "ai_name_hi", desc: "description_hi" }
  },
  "Tamil": {
    navIn: "உள்நுழைக", navOut: "வெளியேறு", view: "காண்க மற்றும் சோதிக்கவும்",
    h1: "சரியான AI-ஐ தேடுங்கள்", h2: "உண்மையான தாக்கம்",
    sub: "பிராந்திய வளர்ச்சிக்கான நம்பகமான AI கருவிகளைக் கண்டறியவும்.",
    search: "தேடுங்கள் அல்லது பேசவும்...",
    dbKeys: { name: "ai_name_ta", desc: "description_ta" }
  },
  "Telugu": {
    navIn: "సైన్ ఇన్", navOut: "సైన్ అవుట్", view: "చూడండి & పరీక్షించండి",
    h1: "సరైన AIని కనుగొనండి", h2: "నిజమైన ప్రభావం",
    sub: "ప్రాంతీయ అభివృద్ధి కోసం రూపొందించిన AI సాధనాలను అన్వేషించండి.",
    search: "వెతకండి లేదా మాట్లాడండి...",
    dbKeys: { name: "ai_name_te", desc: "description_te" }
  },
  "Malayalam": {
    navIn: "സൈൻ ഇൻ", navOut: "സൈൻ ഔട്ട്", view: "കാണുക & പരീക്ഷിക്കുക",
    h1: "ശരിയായ AI കണ്ടെത്തുക", h2: "യഥാർത്ഥ മാറ്റത്തിനായി",
    sub: "പ്രാദേശിക വളർച്ചയ്ക്കായി രൂപകൽപ്പന ചെയ്ത AI ടൂളുകൾ കണ്ടെത്തുക.",
    search: "തിരയുകയോ സംസാരിക്കുകയോ...",
    dbKeys: { name: "ai_name_ml", desc: "description_ml" }
  },
  "Kannada": {
    navIn: "ಸೈನ್ ಇನ್", navOut: "ಸೈನ್ ಔಟ್", view: "ನೋಡಿ ಮತ್ತು ಪರೀಕ್ಷಿಸಿ",
    h1: "ಸರಿಯಾದ AI ಹುಡುಕಿ", h2: "ನಿಜವಾದ ಪ್ರಭಾವ",
    sub: "ಪ್ರಾದೇಶಿಕ ಅಭಿವೃದ್ಧಿಗಾಗಿ ವಿಶ್ವಾಸಾರ್ಹ AI ಪರಿಕರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
    search: "ಹುಡುಕಿ ಅಥವಾ ಮಾತನಾಡಿ...",
    dbKeys: { name: "ai_name_kn", desc: "description_kn" }
  }
};

export const useLanguage = () => useContext(LanguageContext);

const Root = () => {
  const [selectedLang, setSelectedLang] = useState("English");
  const t = translations[selectedLang] || translations["English"];

  return (
    <LanguageContext.Provider value={{ selectedLang, setSelectedLang, t }}>
      <App />
    </LanguageContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);