import React from 'react';
import { Palette, Info } from 'lucide-react';
import { Theme } from '../types';

interface ThemeSelectorProps {
  themes: Theme[];
  onSelect: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ themes, onSelect }) => {
  const handleSelect = (theme: Theme) => {
    if (navigator.vibrate) navigator.vibrate(10);
    onSelect(theme);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6" role="list">
      {themes.map((theme) => (
        <button 
          key={theme.id}
          onClick={() => handleSelect(theme)}
          className="relative w-full text-left p-6 rounded-lg border border-museum-700 bg-museum-800/50 hover:bg-museum-800 hover:border-museum-gold transition-all cursor-pointer group focus:ring-2 focus:ring-museum-gold focus:outline-none"
          role="listitem"
          aria-label={`Select theme: ${theme.name}. Description: ${theme.description}`}
        >
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-lg font-serif font-semibold text-white group-hover:text-museum-gold transition-colors">
              {theme.name}
            </h4>
            <Palette size={18} className="text-gray-500 group-hover:text-museum-gold" aria-hidden="true" />
          </div>
          <p className="text-sm text-gray-300 mb-4">{theme.description}</p>
          
          <div className="bg-black/20 p-3 rounded text-xs text-gray-400 italic">
            <span className="font-bold text-gray-500 not-italic block mb-1 uppercase tracking-wider text-[10px]">Vibe</span>
            "{theme.vibe}"
          </div>
          
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-museum-gold text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Create Art
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};