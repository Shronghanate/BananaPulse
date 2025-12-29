
import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout.tsx';
import { FileUploader } from './components/FileUploader.tsx';
import { ResultDisplay } from './components/ResultDisplay.tsx';
import { FreshnessResult, HistoryItem } from './types.ts';
import { analyzeBananaFreshness } from './services/geminiService.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FreshnessResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('banana_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleImageSelect = useCallback(async (base64: string) => {
    setLoading(true);
    setError(null);
    setSelectedImage(base64);

    try {
      const data = await analyzeBananaFreshness(base64);
      setResult(data);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: base64,
        result: data,
      };
      
      const newHistory = [newItem, ...history].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem('banana_history', JSON.stringify(newHistory));
    } catch (err) {
      console.error(err);
      setError("AI couldn't analyze the image. Please use a clear, well-lit photo.");
      setSelectedImage(null);
    } finally {
      setLoading(false);
    }
  }, [history]);

  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      return (
        <div className="animate-slide-up py-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Past Insights</h2>
          {history.length === 0 ? (
            <div className="text-center py-20 bg-yellow-50/50 rounded-[3rem] border-2 border-dashed border-yellow-200">
              <span className="material-symbols-rounded text-6xl text-yellow-300 mb-4 block">receipt_long</span>
              <p className="text-yellow-800 font-bold">No previous scans found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => {
                    setSelectedImage(item.image);
                    setResult(item.result);
                    setActiveTab('scan');
                  }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm active:scale-95 transition-transform group"
                >
                  <div className="relative">
                    <img src={item.image} className="w-full aspect-square object-cover" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded-full text-[8px] font-black uppercase shadow-sm">
                      {item.result.status}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[9px] font-bold uppercase text-gray-400 tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</div>
                    <div className="text-sm font-black text-gray-900 leading-none mt-1">
                      {item.result.daysRemaining}d Remaining
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (loading && selectedImage) {
      return (
        <div className="flex flex-col gap-8 animate-slide-up py-4">
           <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
              <img src={selectedImage} className="w-full h-full object-cover grayscale-[0.5] contrast-125" />
              <div className="animate-scan" />
              <div className="absolute inset-0 bg-yellow-900/10 mix-blend-overlay" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white z-30">
                 <div className="w-20 h-20 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4 mx-auto" />
                 <p className="font-black text-lg tracking-widest uppercase drop-shadow-md">Analyzing Cells</p>
              </div>
           </div>
           <div className="text-center px-8">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Quantifying Ripeness</h2>
              <p className="text-gray-500 text-sm font-medium">Processing pixels via Gemini Vision Engine...</p>
           </div>
        </div>
      );
    }

    if (result && selectedImage) {
      return <ResultDisplay result={result} image={selectedImage} onReset={reset} />;
    }

    return (
      <div className="animate-slide-up py-4 flex flex-col gap-8">
        <div className="relative group overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-yellow-200/50">
          <div className="relative z-10">
            <h2 className="text-4xl font-black leading-tight mb-2">Banana Pulse.</h2>
            <p className="text-yellow-100 font-bold text-sm leading-relaxed max-w-[80%]">Visual intelligence for your fruit bowl. Scan to detect shelf-life instantly.</p>
          </div>
          <span className="material-symbols-rounded text-[12rem] absolute -bottom-12 -right-12 opacity-10 group-hover:scale-110 transition-transform">insights</span>
        </div>
        <FileUploader onImageSelect={handleImageSelect} isLoading={loading} />
      </div>
    );
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {error && (
        <div className="my-4 p-5 bg-red-50 text-red-900 rounded-[2rem] border-2 border-red-100 flex items-center gap-4 text-sm font-black animate-slide-up">
          <span className="material-symbols-rounded text-red-500">warning</span>
          {error}
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
