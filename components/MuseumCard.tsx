import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Museum } from '../types';

interface MuseumCardProps {
  museum: Museum;
  onClick: (museum: Museum) => void;
}

export const MuseumCard: React.FC<MuseumCardProps> = ({ museum, onClick }) => {
  const handleClick = () => {
    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(10);
    onClick(museum);
  };

  return (
    <button 
      onClick={handleClick}
      className="group relative w-full text-left overflow-hidden rounded-xl bg-museum-800 border border-museum-700 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:border-museum-gold/50 focus:ring-4 focus:ring-museum-accent focus:outline-none"
      aria-label={`Explore ${museum.name} in ${museum.location}`}
    >
      <div className="h-48 overflow-hidden w-full">
        <img 
          src={museum.image} 
          alt={`${museum.name} building`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center text-xs text-museum-gold mb-2 uppercase tracking-widest font-bold">
          <MapPin size={12} className="mr-1" aria-hidden="true" />
          <span>{museum.location}</span>
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2">{museum.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {museum.shortDescription}
        </p>
        <div className="flex items-center text-museum-accent text-sm font-medium group-hover:text-rose-400 transition-colors">
          Explore Collection <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </div>
      </div>
    </button>
  );
};