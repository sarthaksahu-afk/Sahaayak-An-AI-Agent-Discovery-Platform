import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const AgentCard = ({ agent }) => {
  const { t } = useLanguage();

  const name = agent[t.dbKeys.name] || agent.ai_name || agent.name;
  const description = agent[t.dbKeys.desc] || agent.description;
  const category = agent[t.dbKeys.cat] || agent.category;

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-8 shadow-2xl flex flex-col h-full hover:scale-[1.02] transition-all">
      <div className="flex justify-between items-start mb-6">
        <span className="bg-blue-600/20 text-blue-700 font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-600/30">
          {category}
        </span>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
           <img src={`https://logo.clearbit.com/${agent.link?.replace(/^https?:\/\//, '').split('/')[0]}`} onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=AI"; }} className="w-full object-contain" />
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{name}</h3>
      </div>
      <p className="text-gray-800 font-medium mb-10 line-clamp-3 leading-relaxed">{description}</p>
      <Link to={`/sandbox/${agent.id}`} className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-center shadow-lg hover:bg-blue-600 transition-all">
        {t.viewTest}
      </Link>
    </div>
  );
};

export default AgentCard;