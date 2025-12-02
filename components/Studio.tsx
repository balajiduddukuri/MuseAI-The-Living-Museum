import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, RefreshCw, Share2, Download, Wand2, ArrowLeft, Volume2, Copy, Hash } from 'lucide-react';
import { Museum, Theme } from '../types';
import { 
  generateRefinedPrompt, 
  generateThemeImage, 
  generateMuseumGuideDescription, 
  generateSpeech, 
  generateSocialHashtags,
  playAudio 
} from '../services/geminiService';

interface StudioProps {
  museum: Museum;
  theme: Theme;
  onBack: () => void;
}

export const Studio: React.FC<StudioProps> = ({ museum, theme, onBack }) => {
  const [userIdea, setUserIdea] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  
  // Audio states
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isSpeakingGuide, setIsSpeakingGuide] = useState(false);

  // Status message for screen readers
  const [statusMessage, setStatusMessage] = useState('');

  // Auto-fill a random example prompt on mount
  useEffect(() => {
    const randomExample = theme.examplePrompts[Math.floor(Math.random() * theme.examplePrompts.length)];
    setUserIdea(randomExample);
  }, [theme]);

  const triggerHaptic = () => {
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const handleRefine = async () => {
    if (!userIdea.trim()) return;
    triggerHaptic();
    setIsRefining(true);
    setError(null);
    setStatusMessage("Refining your prompt...");
    try {
      const refined = await generateRefinedPrompt(userIdea, theme, museum.name);
      setRefinedPrompt(refined);
      setStatusMessage("Prompt refined successfully.");
    } catch (e) {
      setError("Could not refine prompt. Try again.");
      setStatusMessage("Error refining prompt.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleGenerate = async () => {
    const promptToUse = refinedPrompt || userIdea;
    if (!promptToUse.trim()) return;
    
    triggerHaptic();
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setHashtags([]);
    setStatusMessage("Generating your artwork, please wait...");

    try {
      const imageBase64 = await generateThemeImage(promptToUse);
      if (imageBase64) {
        setGeneratedImage(imageBase64);
        setStatusMessage("Artwork generated successfully.");
        
        // Generate Hashtags in background
        generateSocialHashtags(imageBase64, museum.name, theme.name)
          .then(tags => setHashtags(tags))
          .catch(err => console.error("Tag generation failed", err));
          
      } else {
        setError("No image data returned.");
        setStatusMessage("Failed to generate image.");
      }
    } catch (e) {
      setError("Failed to generate image. The creative muse is resting (API Error).");
      setStatusMessage("Error generating image.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      triggerHaptic();
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `museai-${museum.id}-${theme.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage("Image downloaded.");
    }
  };

  const handleShare = () => {
    if (generatedImage) {
      triggerHaptic();
      const tagsString = hashtags.join(' ');
      const shareUrl = `https://example.com/share?imageUrl=${encodeURIComponent(generatedImage)}&museum=${encodeURIComponent(museum.name)}&theme=${encodeURIComponent(theme.name)}&tags=${encodeURIComponent(tagsString)}`;
      window.open(shareUrl, '_blank');
      setStatusMessage("Sharing interface opened.");
    }
  };

  const handleCopyTags = () => {
    if (hashtags.length > 0) {
      triggerHaptic();
      navigator.clipboard.writeText(hashtags.join(' '));
      setStatusMessage("Hashtags copied to clipboard.");
    }
  };

  const handleSpeakPrompt = async () => {
    const textToSpeak = refinedPrompt || userIdea;
    if (!textToSpeak || isSpeakingPrompt) return;

    triggerHaptic();
    setIsSpeakingPrompt(true);
    setStatusMessage("Reading prompt aloud.");
    try {
      const audioData = await generateSpeech(textToSpeak);
      if (audioData) {
        await playAudio(audioData);
      }
    } catch (e) {
      console.error("Failed to speak prompt", e);
    } finally {
      setIsSpeakingPrompt(false);
    }
  };

  const handleSpeakImage = async () => {
    if (!generatedImage || isSpeakingGuide) return;

    triggerHaptic();
    setIsSpeakingGuide(true);
    setStatusMessage("Generating audio guide description...");
    try {
      // 1. Generate Description
      const description = await generateMuseumGuideDescription(generatedImage, museum.name, theme.name);
      
      // 2. Generate Speech
      const audioData = await generateSpeech(description);
      
      // 3. Play
      if (audioData) {
        await playAudio(audioData);
        setStatusMessage("Playing audio guide.");
      }
    } catch (e) {
      console.error("Failed to speak image guide", e);
      setStatusMessage("Failed to play audio guide.");
    } finally {
      setIsSpeakingGuide(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only" role="status">
        {statusMessage}
      </div>

      {/* Left Panel: Controls */}
      <div className="lg:col-span-5 flex flex-col space-y-6">
        <div>
           <button 
            onClick={onBack}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors text-sm focus:ring-2 focus:ring-white rounded p-1"
            aria-label="Back to Museum Details"
          >
            <ArrowLeft size={16} className="mr-1" aria-hidden="true" /> Back to Museum
          </button>
          <h2 className="text-3xl font-serif text-white mb-2" id="studio-heading">The Studio</h2>
          <div className="flex items-center text-sm text-museum-gold mb-1">
            <span className="font-bold mr-2">{museum.name}</span>
            <span className="w-1 h-1 bg-gray-500 rounded-full mr-2" aria-hidden="true"></span>
            <span>{theme.name}</span>
          </div>
          <p className="text-gray-400 text-sm">{theme.description}</p>
        </div>

        <div className="space-y-4 bg-museum-800/50 p-6 rounded-xl border border-museum-700" role="form" aria-labelledby="studio-heading">
          <div className="relative">
            <label htmlFor="user-idea" className="block text-sm font-medium text-gray-300 mb-2">
              What do you want to create?
            </label>
            <textarea
              id="user-idea"
              className="w-full bg-black/40 border border-museum-700 rounded-lg p-3 text-white placeholder-gray-600 focus:outline-none focus:border-museum-gold focus:ring-2 focus:ring-museum-gold transition-all"
              rows={3}
              placeholder={`e.g., ${theme.examplePrompts[0]}`}
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRefine}
              disabled={isRefining || !userIdea}
              className="flex-1 bg-museum-700 hover:bg-museum-600 disabled:opacity-50 text-white py-2 px-4 rounded-lg flex items-center justify-center text-sm font-medium transition-colors focus:ring-2 focus:ring-museum-gold focus:outline-none"
              aria-label="Refine Prompt using AI"
            >
              {isRefining ? <RefreshCw className="animate-spin mr-2" size={16} aria-hidden="true" /> : <Wand2 className="mr-2" size={16} aria-hidden="true" />}
              Refine Prompt
            </button>
          </div>

          {refinedPrompt && (
            <div className="bg-black/20 p-3 rounded border border-museum-700/50 relative group">
              <div className="flex justify-between items-start mb-1">
                <div className="text-xs text-museum-gold font-bold uppercase tracking-wider">Muse Suggestion</div>
                <button 
                  onClick={handleSpeakPrompt}
                  disabled={isSpeakingPrompt}
                  className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors focus:ring-2 focus:ring-white rounded"
                  title="Read Prompt"
                  aria-label="Read prompt aloud"
                >
                  {isSpeakingPrompt ? <RefreshCw className="animate-spin" size={14} aria-hidden="true" /> : <Volume2 size={14} aria-hidden="true" />}
                </button>
              </div>
              <p className="text-sm text-gray-300 italic pr-6">"{refinedPrompt}"</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || (!userIdea && !refinedPrompt)}
            className="w-full bg-gradient-to-r from-museum-accent to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white py-3 px-6 rounded-lg font-bold shadow-lg shadow-rose-900/20 flex items-center justify-center transition-all transform active:scale-95 focus:ring-4 focus:ring-white focus:outline-none"
            aria-label="Generate Art based on prompt"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="animate-spin mr-2" aria-hidden="true" /> Creating Masterpiece...
              </>
            ) : (
              <>
                <Sparkles className="mr-2" aria-hidden="true" /> Generate Art
              </>
            )}
          </button>
           {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Canvas */}
      <div className="lg:col-span-7 space-y-4">
        <div 
          className="bg-black/50 rounded-2xl border border-museum-700 flex flex-col items-center justify-center p-8 relative overflow-hidden min-h-[400px]"
          role="region" 
          aria-label="Art Canvas"
        >
          
          {!generatedImage && !isGenerating && (
            <div className="text-center text-gray-500">
              <div className="w-20 h-20 bg-museum-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-museum-700">
                <Palette className="text-museum-700" size={32} aria-hidden="true" />
              </div>
              <p className="text-lg font-serif mb-2">Your Canvas is Empty</p>
              <p className="text-sm max-w-xs mx-auto">Use the studio controls to describe your vision and let the museum's spirit guide the AI.</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm" role="status">
               <div className="w-16 h-16 border-4 border-museum-gold border-t-transparent rounded-full animate-spin mb-4" aria-hidden="true"></div>
               <p className="text-museum-gold font-serif text-lg animate-pulse">Consulting the masters...</p>
            </div>
          )}

          {generatedImage && (
            <div className="relative group w-full max-w-lg">
              <div className="relative rounded-lg overflow-hidden shadow-2xl border-4 border-museum-800 bg-white">
                <img 
                  src={generatedImage} 
                  alt={`AI generated artwork in the style of ${theme.name}. Prompt: ${refinedPrompt || userIdea}`}
                  className="w-full h-auto object-contain"
                />
              </div>
              
              <div className="absolute -bottom-16 left-0 right-0 flex justify-center gap-4 opacity-0 group-hover:opacity-100 group-hover:bottom-4 transition-all duration-300 focus-within:opacity-100 focus-within:bottom-4">
                <button 
                  onClick={handleDownload}
                  className="bg-white text-black hover:bg-gray-200 p-3 rounded-full shadow-xl transition-transform hover:scale-110 focus:ring-4 focus:ring-museum-accent"
                  title="Download"
                  aria-label="Download generated artwork"
                >
                  <Download size={20} aria-hidden="true" />
                </button>
                <button 
                  onClick={handleSpeakImage}
                  disabled={isSpeakingGuide}
                  className="bg-white text-black hover:bg-gray-200 p-3 rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center focus:ring-4 focus:ring-museum-accent"
                  title="Audio Guide"
                  aria-label="Listen to audio guide description of this artwork"
                >
                   {isSpeakingGuide ? <RefreshCw className="animate-spin text-museum-accent" size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
                </button>
                <button 
                  onClick={handleShare}
                  className="bg-museum-accent text-white hover:bg-rose-600 p-3 rounded-full shadow-xl transition-transform hover:scale-110 focus:ring-4 focus:ring-white" 
                  title="Share"
                  aria-label="Share this artwork"
                >
                  <Share2 size={20} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Hashtags Section */}
        {generatedImage && hashtags.length > 0 && (
           <div className="bg-museum-800/30 rounded-xl p-4 border border-museum-700/50 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center">
                   <Hash size={12} className="mr-1" /> Social Tags
                 </h3>
                 <button 
                   onClick={handleCopyTags}
                   className="text-xs text-museum-gold hover:text-white flex items-center transition-colors focus:ring-1 focus:ring-white rounded px-1"
                 >
                   <Copy size={12} className="mr-1" /> Copy All
                 </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span key={i} className="bg-black/40 text-gray-300 hover:text-white hover:bg-museum-700 px-2 py-1 rounded text-xs transition-colors cursor-default select-all">
                    {tag}
                  </span>
                ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

// Generic Icon import for blank state
const Palette = ({ className, size, ...props }: { className?: string; size?: number; [key: string]: any }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="13.5" cy="6.5" r=".5"></circle>
      <circle cx="17.5" cy="10.5" r=".5"></circle>
      <circle cx="8.5" cy="7.5" r=".5"></circle>
      <circle cx="6.5" cy="12.5" r=".5"></circle>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
    </svg>
);