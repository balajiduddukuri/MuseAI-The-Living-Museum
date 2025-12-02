/**
 * Static Data Configuration
 *
 * This file acts as the "database" for the frontend-only MVP.
 * It stores the list of supported museums, their metadata, and the
 * curated themes associated with each one.
 *
 * In a full-stack implementation, this data would likely be fetched from a backend API.
 */

import { Museum } from './types';

export const MUSEUMS: Museum[] = [
  {
    id: 'louvre',
    name: 'The Louvre',
    location: 'Paris, France',
    shortDescription: 'Home to the Mona Lisa and vast classical antiquities.',
    fullDescription: 'The world\'s most visited museum, housing Western art from the Middle Ages to 1848, as well as ancient civilizations. A palace of art where history meets grandeur.',
    image: 'https://picsum.photos/id/1040/800/600',
    themes: [
      {
        id: 'renaissance-classicism',
        name: 'Renaissance Classicism',
        description: 'Balanced compositions, realistic anatomy, and idealized beauty inspired by antiquity.',
        vibe: 'Harmonious, grand, polished, golden light',
        examplePrompts: [
          'A majestic banquet hall with soft, golden candlelight and symmetrical arches.',
          'Portrait of a noble figure with mysterious smile, sfumato technique, misty landscape background.'
        ]
      },
      {
        id: 'romanticism',
        name: 'French Romanticism',
        description: 'Emphasis on emotion, individualism, and the glorification of the past and nature.',
        vibe: 'Dramatic, emotional, turbulent, rich colors',
        examplePrompts: [
          'A dramatic storm at sea with a raft fighting the waves, high contrast lighting.',
          'Liberty leading the people, dynamic brushstrokes, smoke and revolution.'
        ]
      }
    ]
  },
  {
    id: 'moma',
    name: 'MoMA',
    location: 'New York, USA',
    shortDescription: 'The definitive collection of modern and contemporary art.',
    fullDescription: 'The Museum of Modern Art creates a bridge between the past and present, celebrating the creative movements that defined the 20th and 21st centuries.',
    image: 'https://picsum.photos/id/1035/800/600',
    themes: [
      {
        id: 'abstract-expressionism',
        name: 'Abstract Expressionism',
        description: 'Spontaneous, automatic, or subconscious creation. Art purely about form and color.',
        vibe: 'Chaotic, bold, energetic, texture-heavy',
        examplePrompts: [
          'Large canvas filled with chaotic drips and splashes of vibrant paint.',
          'Color field painting with massive blocks of deep red and black, evoking silence.'
        ]
      },
      {
        id: 'pop-art',
        name: 'Pop Art',
        description: 'Art based on modern popular culture and the mass media, often ironic.',
        vibe: 'Neon, repetitive, commercial, flat colors',
        examplePrompts: [
          'A grid of colorful soup cans in a silkscreen style.',
          'Comic book style portrait with halftone dots and a speech bubble.'
        ]
      }
    ]
  },
  {
    id: 'uffizi',
    name: 'Uffizi Gallery',
    location: 'Florence, Italy',
    shortDescription: 'The heart of the Italian Renaissance.',
    fullDescription: 'Located in the historic center of Florence, the Uffizi houses an incomparable collection of Italian Renaissance art, including works by Botticelli and da Vinci.',
    image: 'https://picsum.photos/id/1015/800/600',
    themes: [
      {
        id: 'florentine-renaissance',
        name: 'Birth of Venus',
        description: 'Mythological subjects treated with grace, elegance, and soft, ethereal lines.',
        vibe: 'Ethereal, floral, pastel, floating',
        examplePrompts: [
          'A goddess emerging from sea foam on a giant shell, flowers blowing in the wind.',
          'Springtime garden with dancing figures in flowing translucent robes.'
        ]
      }
    ]
  },
  {
    id: 'tate-modern',
    name: 'Tate Modern',
    location: 'London, UK',
    shortDescription: 'International modern and contemporary art in a former power station.',
    fullDescription: 'A stark, industrial cathedral of art housing cutting-edge installations and surrealist masterpieces.',
    image: 'https://picsum.photos/id/1039/800/600',
    themes: [
      {
        id: 'surrealism',
        name: 'Surrealism',
        description: 'Unlocking the unconscious mind with dream-like, illogical scenes.',
        vibe: 'Dreamlike, melting, bizarre, impossible physics',
        examplePrompts: [
          'A landscape where clocks are melting over tree branches.',
          'A giant apple floating in front of a man in a bowler hat.'
        ]
      },
      {
        id: 'conceptual-installation',
        name: 'Industrial Installation',
        description: 'Art that uses the raw space and materials of the industrial world.',
        vibe: 'Cold, metallic, vast, echoey',
        examplePrompts: [
          'A massive turbine hall filled with an artificial sun and mist.',
          'Geometric concrete structures arranged in a spiral on a warehouse floor.'
        ]
      }
    ]
  },
  {
    id: 'vangogh',
    name: 'Van Gogh Museum',
    location: 'Amsterdam, Netherlands',
    shortDescription: 'Dedicated to the works of Vincent van Gogh.',
    fullDescription: 'Explore the life and work of the artist who communicated his deep emotions through vibrant colors and swirling brushstrokes.',
    image: 'https://picsum.photos/id/1043/800/600',
    themes: [
      {
        id: 'post-impressionism',
        name: 'Swirling Emotions',
        description: 'Vivid colors, thick application of paint, and real-life subject matter, but distorted for emotional effect.',
        vibe: 'Swirling, thick impasto, vibrant yellow and blue',
        examplePrompts: [
          'A starry night sky with swirling clouds and a glowing crescent moon over a sleepy village.',
          'Sunflowers in a vase, painted with thick, textured yellow brushstrokes.'
        ]
      }
    ]
  }
];