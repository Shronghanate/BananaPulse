
import React, { useRef } from 'react';

interface FileUploaderProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div 
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className="group relative h-80 bg-white border-2 border-dashed border-yellow-200 rounded-[3rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-yellow-400 hover:bg-yellow-50/30 transition-all active:scale-[0.98]"
      >
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-rounded text-4xl text-yellow-600">add_a_photo</span>
        </div>
        <div className="text-center px-8">
          <p className="text-lg font-black text-yellow-900">Upload or Snap</p>
          <p className="text-xs text-yellow-600 font-medium">Capture a clear top-down view of the banana skin</p>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-4 bg-white rounded-3xl border border-gray-100 text-center">
          <span className="text-2xl block mb-1">💡</span>
          <span className="text-[10px] font-black uppercase text-gray-400">Avoid Flash</span>
        </div>
        <div className="p-4 bg-white rounded-3xl border border-gray-100 text-center">
          <span className="text-2xl block mb-1">☀️</span>
          <span className="text-[10px] font-black uppercase text-gray-400">Good Light</span>
        </div>
        <div className="p-4 bg-white rounded-3xl border border-gray-100 text-center">
          <span className="text-2xl block mb-1">🎯</span>
          <span className="text-[10px] font-black uppercase text-gray-400">Stay Focus</span>
        </div>
      </div>
    </div>
  );
};
