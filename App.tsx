/**
 * Main Application Container
 *
 * This component acts as the backbone of the application, handling:
 * 1. Global State: Current view ('DISCOVER' | 'MUSEUM_DETAIL' | 'STUDIO'), selected data.
 * 2. Routing/Navigation: Manages conditional rendering of views.
 * 3. Accessibility Features: High Contrast Mode, Skip Links, ARIA landmarks.
 * 4. Search Filter: Filters the museum list.
 */

import React, { useState, useEffect } from 'react';
import { Compass, BookOpen, User, Github, Search, Eye } from 'lucide-react';
import { MUSEUMS } from './constants';
import { Museum, Theme } from './types';
import { MuseumCard } from './components/MuseumCard';
import { ThemeSelector } from './components/ThemeSelector';
import { Studio } from './components/Studio';

type View = 'DISCOVER' | 'MUSEUM_DETAIL' | 'STUDIO';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('DISCOVER');
  const [selectedMuseum, setSelectedMuseum] = useState<Museum | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highContrastMode, setHighContrastMode] = useState(false);

  // Toggle High Contrast Mode
  useEffect(() => {
    if (highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrastMode]);

  // Filter Museums
  const filteredMuseums = MUSEUMS.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.themes.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Navigation Handlers
  const handleMuseumSelect = (museum: Museum) => {
    setSelectedMuseum(museum);
    setCurrentView('MUSEUM_DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setCurrentView('STUDIO');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setCurrentView('DISCOVER');
    setSelectedMuseum(null);
    setSelectedTheme(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToMuseum = () => {
    setCurrentView('MUSEUM_DETAIL');
    setSelectedTheme(null);
  };

  return (
    <div className="min-h-screen bg-museum-900 text-gray-100 font-sans selection:bg-museum-accent selection:text-white flex flex-col">
      {/* Skip Link for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:font-bold focus:rounded focus:ring-4 focus:ring-museum-accent"
      >
        Skip to main content
      </a>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-museum-900/90 backdrop-blur-md border-b border-museum-800" role="navigation" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              className="flex items-center cursor-pointer group focus:ring-2 focus:ring-museum-gold focus:rounded focus:outline-none p-1" 
              onClick={goHome}
              aria-label="MuseAI Home"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-museum-gold to-yellow-600 rounded mr-3 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <span className="font-serif font-bold text-black text-xl">M</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">MuseAI</span>
            </button>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
              <button 
                onClick={goHome} 
                className={`hover:text-white transition-colors focus:ring-2 focus:ring-museum-gold rounded px-2 py-1 ${currentView === 'DISCOVER' ? 'text-white' : ''}`}
              >
                Discover
              </button>
              <button className="hover:text-white transition-colors cursor-not-allowed opacity-50 focus:ring-2 focus:ring-museum-gold rounded px-2 py-1" aria-disabled="true">Gallery (Soon)</button>
              <button className="hover:text-white transition-colors cursor-not-allowed opacity-50 focus:ring-2 focus:ring-museum-gold rounded px-2 py-1" aria-disabled="true">About</button>
            </div>
             <div className="flex items-center space-x-4">
                <button
                  onClick={() => setHighContrastMode(!highContrastMode)}
                  className={`p-2 rounded-full transition-colors focus:ring-2 focus:ring-museum-gold focus:outline-none ${highContrastMode ? 'bg-yellow-400 text-black' : 'text-gray-400 hover:text-white bg-museum-800'}`}
                  aria-label={highContrastMode ? "Disable High Contrast Mode" : "Enable High Contrast Mode"}
                  title="Toggle High Contrast"
                >
                  <Eye size={18} aria-hidden="true" />
                </button>
                {/* Placeholder for user profile or auth */}
                <div className="w-8 h-8 rounded-full bg-museum-800 border border-museum-700 flex items-center justify-center text-gray-500" aria-label="User Profile">
                    <User size={16} aria-hidden="true" />
                </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full outline-none" tabIndex={-1}>
        
        {/* VIEW: DISCOVER (HOME) */}
        {currentView === 'DISCOVER' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="text-center py-10 space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight">
                Where History Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-museum-gold to-yellow-200">Imagination</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                Explore the world's most iconic art museums and co-create AI masterpieces inspired by their legendary themes.
              </p>
              <p className="text-md text-museum-gold font-serif italic animate-fadeIn delay-100">
                - Balaji Duddukuri
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative mt-8">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-museum-700 rounded-full leading-5 bg-museum-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:bg-museum-900 focus:border-museum-gold focus:ring-2 focus:ring-museum-gold sm:text-sm transition-all"
                    placeholder="Search museums, themes, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search museums"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold flex items-center">
                  <Compass className="mr-2 text-museum-accent" aria-hidden="true" /> 
                  Featured Museums
                  <span className="sr-only">: List of available museums</span>
                </h2>
              </div>
              
              {filteredMuseums.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMuseums.map((museum) => (
                    <MuseumCard key={museum.id} museum={museum} onClick={handleMuseumSelect} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 bg-museum-800/30 rounded-lg">
                  <p className="text-lg">No museums found matching "{searchQuery}"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-museum-accent hover:underline focus:ring-2 focus:ring-museum-accent rounded px-2"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: MUSEUM DETAIL */}
        {currentView === 'MUSEUM_DETAIL' && selectedMuseum && (
          <div className="animate-fadeIn">
            <button 
              onClick={goHome}
              className="mb-6 text-gray-400 hover:text-white flex items-center text-sm transition-colors focus:ring-2 focus:ring-white rounded p-1"
              aria-label="Back to Museum List"
            >
              &larr; Back to Map
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="order-2 md:order-1 space-y-6">
                <div>
                   <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{selectedMuseum.name}</h1>
                   <p className="text-museum-gold uppercase tracking-widest text-sm font-bold flex items-center">
                     <MapPinIcon />
                     {selectedMuseum.location}
                   </p>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {selectedMuseum.fullDescription}
                </p>
                
                <div className="pt-4">
                  <h3 className="text-xl font-serif font-bold flex items-center mb-4 text-white">
                    <BookOpen className="mr-2 text-museum-accent" aria-hidden="true" /> Artistic Themes
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Select a theme to enter the Studio and create art inspired by this style.
                  </p>
                  <ThemeSelector themes={selectedMuseum.themes} onSelect={handleThemeSelect} />
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="sticky top-24 rounded-2xl overflow-hidden shadow-2xl border border-museum-700">
                  <img src={selectedMuseum.image} alt={`Exterior view of ${selectedMuseum.name}`} className="w-full h-auto object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-museum-900/80 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STUDIO */}
        {currentView === 'STUDIO' && selectedMuseum && selectedTheme && (
          <div className="animate-fadeIn h-full">
            <Studio 
              museum={selectedMuseum} 
              theme={selectedTheme} 
              onBack={goBackToMuseum} 
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-museum-800 bg-black/20 mt-12 py-8" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <span className="font-serif font-bold text-gray-400">MuseAI</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p>Powered by Google Gemini. Art is subjective.</p>
        </div>
      </footer>
    </div>
  );
}

// Simple MapPin Icon component for usage inside App.tsx
const MapPinIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="mr-1 inline-block"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);