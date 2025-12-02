/**
 * Gemini AI Service Layer
 *
 * This module handles all interactions with the Google Gemini API.
 * It provides an abstraction layer for:
 * 1. Text-to-Image Prompt Refinement (Gemini 2.5 Flash)
 * 2. Image Generation (Gemini 2.5 Flash Image / Nano Banana)
 * 3. Image Analysis & Description (Vision capabilities)
 * 4. Text-to-Speech Generation (Gemini 2.5 Flash TTS)
 */

import { GoogleGenAI } from "@google/genai";
import { Theme } from "../types";

// Helper to safely get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.warn("API_KEY is missing from environment variables.");
    return "";
  }
  return key;
};

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Generates a creative prompt based on user input and a museum theme.
 *
 * @param userInput - The raw idea from the user (e.g., "a cat").
 * @param theme - The selected museum theme object.
 * @param museumName - The name of the museum context.
 * @returns A polished, descriptive paragraph suitable for image generation.
 */
export const generateRefinedPrompt = async (
  userInput: string,
  theme: Theme,
  museumName: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const sysInstruction = `You are an expert art curator and creative muse. 
    Your goal is to help a user create a text-to-image prompt based on the art style of "${theme.name}" from the ${museumName}.
    The theme's vibe is described as: "${theme.vibe}".
    
    Take the user's raw idea (which might be simple or abstract) and transform it into a rich, descriptive prompt suitable for an AI image generator.
    Focus on visual details, lighting, texture, and artistic technique relevant to the theme.
    Keep the output to a single paragraph. Do not add conversational filler. Just the prompt.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: `User idea: "${userInput}"`,
      config: {
        systemInstruction: sysInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "An artistic interpretation of the theme.";
  } catch (error) {
    console.error("Error generating refined prompt:", error);
    return `An artistic rendition of ${userInput} in the style of ${theme.name}.`;
  }
};

/**
 * Generates an image based on a prompt.
 * Uses the 'gemini-2.5-flash-image' model.
 *
 * @param prompt - The detailed image generation prompt.
 * @returns A base64 encoded string of the image data, or null if failed.
 */
export const generateThemeImage = async (prompt: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image (Nano Banana) for general image generation
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
        // No responseMimeType for this model
      }
    });

    // Parse response for image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

/**
 * Generates a short museum guide description for an image.
 * Uses Vision capabilities to analyze the provided image.
 *
 * @param imageBase64DataUrl - The image data URL.
 * @param museumName - Context for the persona.
 * @param themeName - Context for the analysis.
 * @returns A text description spoken by the "guide".
 */
export const generateMuseumGuideDescription = async (
  imageBase64DataUrl: string, 
  museumName: string, 
  themeName: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const base64Data = imageBase64DataUrl.split(',')[1]; // Strip data url prefix

    const prompt = `You are a charismatic museum guide at ${museumName}. 
    Briefly describe this artwork (which explores the theme "${themeName}") to a visitor. 
    Focus on the mood, the technique, and the feelings it evokes. 
    Keep it under 50 words. Speak naturally and engagingly.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt }
        ]
      }
    });

    return response.text || "A fascinating piece of art.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "I am unable to analyze this piece at the moment.";
  }
};

/**
 * Generates social media hashtags for an image using Vision analysis.
 *
 * @param imageBase64DataUrl - The generated artwork.
 * @param museumName - Context for tags.
 * @param themeName - Context for tags.
 * @returns An array of string hashtags.
 */
export const generateSocialHashtags = async (
  imageBase64DataUrl: string,
  museumName: string,
  themeName: string
): Promise<string[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const base64Data = imageBase64DataUrl.split(',')[1];

    const prompt = `Analyze this AI-generated artwork styled after "${themeName}" at ${museumName}.
    Generate 8-10 relevant, trending social media hashtags. 
    Include the museum name, art style, specific visual elements in the image, and 'MuseAI'.
    Return ONLY the hashtags separated by spaces. Do not add introductory text.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt }
        ]
      }
    });

    const text = response.text || "";
    // Extract hashtags safely
    const tags = text.match(/#[a-zA-Z0-9_]+/g) || [`#${museumName.replace(/\s+/g, '')}`, `#${themeName.replace(/\s+/g, '')}`, "#MuseAI"];
    return tags.slice(0, 12); // Limit to reasonable number
  } catch (error) {
    console.error("Error generating hashtags:", error);
    return [`#${museumName.replace(/\s+/g, '')}`, "#MuseAI"];
  }
};

/**
 * Generates speech from text using Gemini TTS.
 *
 * @param text - The text content to speak.
 * @returns Base64 encoded audio data.
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-preview-tts';
    
    // We need to use the Modality enum or string 'AUDIO'. 
    // Since we are using the SDK, we pass the config as required.
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: text }]
      },
      config: {
        responseModalities: ['AUDIO'], 
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};

/**
 * Plays base64 encoded audio in the browser.
 * Handles AudioContext creation and decoding.
 *
 * @param base64Audio - The raw base64 audio string (PCM/WAV data).
 */
let audioContext: AudioContext | null = null;

export const playAudio = async (base64Audio: string): Promise<void> => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    // Decode base64 to binary
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Decode audio data
    // We need to copy the buffer because decodeAudioData detaches it
    const audioBuffer = await audioContext.decodeAudioData(bytes.buffer.slice(0));

    // Play
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise((resolve) => {
      source.onended = () => resolve();
    });

  } catch (error) {
    console.error("Error playing audio:", error);
  }
};