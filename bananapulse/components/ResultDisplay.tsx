
import React, { useEffect, useState } from 'react';
import { FreshnessResult, BananaStatus } from '../types';

interface ResultDisplayProps {
  result: FreshnessResult;
  image: string;
  onReset: () => void;
}

const statusTheme = {
  unripe: { 
    color: 'green', 
    label: 'Not Ready', 
    icon: 'eco', 
    pos: '10%', 
    quip: "I'm still growing up! Give me a few days.",
    mascotColor: '#bef264', // Lime green
    accentColor: '#4d7c0f'
  },
  ripe: { 
    color: 'yellow', 
    label: 'Perfect!', 
    icon: 'star', 
    pos: '40%', 
    quip: "I'm at my peak! Eat me now for max energy.",
    mascotColor: '#facc15', // Bright yellow
    accentColor: '#a16207'
  },
  overripe: { 
    color: 'orange', 
    label: 'Getting Soft', 
    icon: 'timer', 
    pos: '70%', 
    quip: "It's getting hot in here! Banana bread time?",
    mascotColor: '#eab308', // Darker yellow/orange
    accentColor: '#713f12'
  },
  rotten: { 
    color: 'red', 
    label: 'Game Over', 
    icon: 'cancel', 
    pos: '95%', 
    quip: "Ugh... I don't feel so good. Better luck next time.",
    mascotColor: '#a16207', // Brownish
    accentColor: '#451a03'
  },
};

const BananaMascot: React.FC<{ status: BananaStatus }> = ({ status }) => {
  const theme = statusTheme[status];
  
  const renderFace = () => {
    switch(status) {
      case 'unripe':
        return (
          <g transform="translate(45, 45)">
            <circle cx="-12" cy="-5" r="3" fill="#1a2e05" />
            <circle cx="12" cy="-5" r="3" fill="#1a2e05" />
            <path d="M-8 8 Q0 12 8 8" stroke="#1a2e05" strokeWidth="2" fill="none" />
          </g>
        );
      case 'ripe':
        return (
          <g transform="translate(45, 45)">
            {/* Cool Sunglasses */}
            <rect x="-22" y="-12" width="44" height="14" rx="4" fill="#000" />
            <path d="M-10 12 Q0 25 10 12" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M-5 15 L5 15" stroke="#fff" strokeWidth="1" opacity="0.3" />
          </g>
        );
      case 'overripe':
        return (
          <g transform="translate(45, 45)">
            <path d="M-15 -10 Q-10 -15 -5 -10" stroke="#7c2d12" strokeWidth="2" fill="none" />
            <path d="M5 -10 Q10 -15 15 -10" stroke="#7c2d12" strokeWidth="2" fill="none" />
            <circle cx="-10" cy="0" r="2.5" fill="#7c2d12" />
            <circle cx="10" cy="0" r="2.5" fill="#7c2d12" />
            <path d="M-5 15 Q0 8 5 15" stroke="#7c2d12" strokeWidth="2" fill="none" />
            <circle cx="20" cy="-15" r="2.5" fill="#38bdf8" className="animate-sweat" />
          </g>
        );
      case 'rotten':
        return (
          <g transform="translate(45, 45)">
            <path d="M-12 -12 L-4 -4 M-4 -12 L-12 -4" stroke="#451a03" strokeWidth="2" />
            <path d="M4 -12 L12 -4 M12 -12 L4 -4" stroke="#451a03" strokeWidth="2" />
            <path d="M-10 15 Q0 5 10 15" stroke="#451a03" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        );
    }
  };

  const renderSpots = () => {
    if (status === 'overripe' || status === 'rotten') {
      return (
        <g fill={theme.accentColor} opacity="0.4">
          <circle cx="35" cy="30" r="3" />
          <circle cx="65" cy="55" r="4" />
          <circle cx="45" cy="75" r="2" />
          <circle cx="25" cy="50" r="2.5" />
          <circle cx="55" cy="20" r="3.5" />
        </g>
      );
    }
    return null;
  };

  return (
    <div className="relative w-40 h-40 animate-float">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        {/* Banana Silhouette - A more natural curved shape */}
        <path 
          d="M25,15 
             C15,35 15,65 35,85 
             C45,95 75,95 85,75 
             C95,55 85,25 65,15 
             C55,10 45,10 40,15 
             L25,15 Z" 
          fill={theme.mascotColor} 
          className="transition-colors duration-1000"
        />
        {/* Stem - Dark brown cap */}
        <path d="M22,12 L32,12 L28,4 Z" fill="#451a03" />
        {/* Bottom Tip - The small black part at the end */}
        <path d="M82,75 Q85,80 88,78" stroke="#451a03" strokeWidth="4" fill="none" strokeLinecap="round" />
        
        {/* Shading/Highlights for volume */}
        <path d="M35,25 Q25,50 35,75" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.2" strokeLinecap="round" />
        
        {renderSpots()}
        {renderFace()}
      </svg>
      {/* Speech Bubble */}
      <div className="absolute -right-20 top-0 w-36 p-3 bg-white rounded-2xl shadow-xl border border-gray-100 text-[11px] font-bold text-gray-800 leading-tight after:content-[''] after:absolute after:left-[-8px] after:top-1/3 after:border-[8px] after:border-transparent after:border-r-white after:-translate-y-1/2">
        {theme.quip}
      </div>
    </div>
  );
};

const AnimatedNumber: React.FC<{ value: number, duration?: number }> = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(progress * value));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{displayValue}</>;
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image, onReset }) => {
  const theme = statusTheme[result.status];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Mascot & Comparison Section */}
      <div className="flex flex-col items-center gap-6 py-4 stagger-1">
        <BananaMascot status={result.status} />
        
        <div className="relative w-full max-w-[240px] mt-4">
          <img 
            src={image} 
            alt="Banana" 
            className="w-full aspect-square object-cover rounded-[3rem] shadow-2xl border-4 border-white"
          />
          <div className="absolute -bottom-4 right-0 px-4 py-2 bg-white rounded-2xl shadow-lg border border-gray-100 font-black text-[10px] text-gray-900 uppercase tracking-widest">
            Scan Input
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-yellow-50 stagger-2">
        <div className="flex justify-between items-center mb-8">
          <div>
             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-${theme.color}-100 text-${theme.color}-900 border border-${theme.color}-200`}>
               {theme.label}
             </span>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-gray-900 leading-none">
               <AnimatedNumber value={Math.round(result.confidence * 100)} />%
             </div>
             <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">AI Confidence</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-6">
           <h3 className="text-5xl font-black text-gray-900 leading-none">
             <AnimatedNumber value={result.daysRemaining} />
           </h3>
           <span className="text-xl font-bold text-gray-400 uppercase tracking-widest">Days Left</span>
        </div>

        {/* Timeline Journey */}
        <div className="relative h-14 flex items-center mb-6 px-2">
          <div className="absolute inset-x-0 h-4 timeline-gradient rounded-full opacity-20" />
          <div className="absolute inset-x-0 h-2 timeline-gradient rounded-full" />
          
          <div 
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-10"
            style={{ left: theme.pos }}
          >
             <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full bg-white border-[6px] border-${theme.color}-500 shadow-xl`} />
             </div>
          </div>

          <div className="absolute left-0 -top-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Fresh</div>
          <div className="absolute right-0 -top-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Rotten</div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed font-medium italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
          "{result.description}"
        </p>
      </div>

      {/* Tips & Nutrition Grid */}
      <div className="grid grid-cols-1 gap-4 stagger-3">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 p-6 rounded-[2.5rem] border border-yellow-100 flex items-start gap-4">
           <div className="w-12 h-12 rounded-2xl bg-yellow-400/20 flex items-center justify-center shrink-0">
             <span className="material-symbols-rounded text-yellow-600">nutrition</span>
           </div>
           <div>
             <h4 className="font-black text-yellow-900 text-xs uppercase tracking-widest mb-1">Nutritional Analysis</h4>
             <p className="text-xs text-yellow-800 leading-relaxed font-medium">{result.nutritionalValue}</p>
           </div>
        </div>

        <div className="space-y-3">
          <h4 className="px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Freshness Playbook</h4>
          {result.storageTips.map((tip, i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm text-xs font-bold text-gray-800">
               <span className="material-symbols-rounded text-yellow-500">lightbulb</span>
               {tip}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="stagger-4 w-full py-6 bg-black text-white rounded-[2.5rem] font-black text-xl hover:scale-[0.98] active:scale-95 transition-all shadow-2xl mt-4 mb-10"
      >
        Check Another
      </button>
    </div>
  );
};
