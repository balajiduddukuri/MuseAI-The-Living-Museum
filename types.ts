/**
 * Global Type Definitions
 *
 * This file contains TypeScript interfaces used throughout the application
 * to ensure type safety for data entities like Museums, Themes, and Artwork.
 */

/**
 * Represents a specific artistic style or collection theme within a museum.
 * Used to guide the style of AI-generated art.
 */
export interface Theme {
  /** Unique identifier for the theme (kebab-case recommended) */
  id: string;
  /** Display name of the theme (e.g., "Impressionism") */
  name: string;
  /** Educational description of the theme */
  description: string;
  /** Short keyword string describing the mood/style for the prompt engineer */
  vibe: string;
  /** List of starter prompts to help users get started */
  examplePrompts: string[];
}

/**
 * Represents a museum entity.
 * Contains metadata and a collection of associated themes.
 */
export interface Museum {
  /** Unique identifier for the museum */
  id: string;
  /** Display name of the museum */
  name: string;
  /** Geographic location (City, Country) */
  location: string;
  /** Brief summary for card views */
  shortDescription: string;
  /** Detailed description for the detail view */
  fullDescription: string;
  /** URL to the museum's cover image */
  image: string;
  /** List of themes available at this museum */
  themes: Theme[];
}

/**
 * Represents a message in a chat interface (reserved for future conversational features).
 */
export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

/**
 * Represents a saved piece of generated artwork.
 */
export interface GeneratedArt {
  id: string;
  imageUrl: string;
  prompt: string;
  museumName: string;
  themeName: string;
  createdAt: number;
}