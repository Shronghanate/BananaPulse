
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'scan' | 'history';
  onTabChange: (tab: 'scan' | 'history') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-full flex flex-col max-w-md mx-auto bg-white shadow-2xl relative">
      <header className="safe-top pt-8 pb-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex justify-between items-center border-b border-yellow-50">
        <div>
          <h1 className="text-2xl font-extrabold text-yellow-900 tracking-tight flex items-center gap-2">
            <span className="text-3xl">🍌</span> BananaPulse
          </h1>
        </div>
        <button className="p-2 rounded-full hover:bg-yellow-50 text-yellow-800">
          <span className="material-symbols-rounded">settings</span>
        </button>
      </header>

      <main className="flex-1 px-6 pb-32 pt-4">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-xl border-t border-yellow-100 flex justify-around items-center py-4 safe-bottom z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onTabChange('scan')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'scan' ? 'text-yellow-600 scale-110' : 'text-gray-400'}`}
        >
          <span className={`material-symbols-rounded text-2xl ${activeTab === 'scan' ? 'FILL-1' : ''}`} style={{ fontVariationSettings: activeTab === 'scan' ? "'FILL' 1" : "" }}>
            center_focus_weak
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest">Analyze</span>
        </button>
        
        <button 
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'history' ? 'text-yellow-600 scale-110' : 'text-gray-400'}`}
        >
          <span className={`material-symbols-rounded text-2xl ${activeTab === 'history' ? 'FILL-1' : ''}`} style={{ fontVariationSettings: activeTab === 'history' ? "'FILL' 1" : "" }}>
            history
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest">History</span>
        </button>
      </nav>
    </div>
  );
};