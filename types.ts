export interface Theme {
  id: string;
  name: string;
  description: string;
  vibe: string;
  examplePrompts: string[];
}

export interface Museum {
  id: string;
  name: string;
  location: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  themes: Theme[];
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface GeneratedArt {
  id: string;
  imageUrl: string;
  prompt: string;
  museumName: string;
  themeName: string;
  createdAt: number;
}
