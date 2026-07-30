export interface Project {
  id: string;
  title: string;
  category: 'Gaming' | 'Corporate/Brand' | 'Music/AMV' | 'Cinematic' | 'Fast Cuts';
  description: string;
  thumbnail: string;
  driveFileId: string; // Google Drive file ID (placeholder or active)
  duration: string;
  tags: string[];
  client?: string;
  featured?: boolean;
}

export const CATEGORIES = [
  'All',
  'Gaming',
  'Corporate/Brand',
  'Music/AMV',
  'Cinematic',
  'Fast Cuts'
] as const;

export type CategoryFilter = (typeof CATEGORIES)[number];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Apex Legends — High-Octane Frag Montage',
    category: 'Gaming',
    description: 'Rhythmic, beat-synced gaming montage showcasing seamless speed ramps, custom sound design, color grading, and precise audio hit markers.',
    thumbnail: '/images/thumb_gaming.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM', // Placeholder Drive ID pattern
    duration: '02:15',
    tags: ['Beat Sync', 'Sound Design', 'Speed Ramping', 'Gaming'],
    client: 'Esports Creator',
    featured: true
  },
  {
    id: '2',
    title: 'Apex Tech — Next Gen Product Launch',
    category: 'Corporate/Brand',
    description: 'Sleek, high-end commercial edit highlighting product craftsmanship, animated typography, sound landscape, and crisp dark-mode color balance.',
    thumbnail: '/images/thumb_brand.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM',
    duration: '01:45',
    tags: ['Brand Commercial', 'Motion Graphics', 'Typography', '4K Grade'],
    client: 'Apex Tech Labs',
    featured: true
  },
  {
    id: '3',
    title: 'Cyberpulse — Neon Cyberpunk AMV Edit',
    category: 'Music/AMV',
    description: 'Stylized anime music video with custom rotoscoping, glitch transitions, neon glow accents, and intense kinetic pacing.',
    thumbnail: '/images/thumb_amv.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM',
    duration: '03:10',
    tags: ['Rotoscoping', 'Glitch FX', 'Neon Aesthetic', 'AMV'],
    client: 'Independent Artist',
    featured: true
  },
  {
    id: '4',
    title: 'Echoes of Silence — Short Film Edit',
    category: 'Cinematic',
    description: 'Narrative-driven film edit focusing on atmospheric pacing, emotional audio mixing, dramatic color grading, and anamorphic composition.',
    thumbnail: '/images/hero_poster.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM',
    duration: '04:30',
    tags: ['Narrative Pacing', 'Color Grading', 'Dialogue Polish', 'Cinematic'],
    client: 'Independent Filmmaker',
    featured: false
  },
  {
    id: '5',
    title: 'HyperSpeed — 60s Social Media Fast Cuts',
    category: 'Fast Cuts',
    description: 'Rapid-fire visual edit crafted for Instagram Reels & TikTok, engineered to maximize hook retention, dynamic audio transitions, and frame precision.',
    thumbnail: '/images/thumb_fastcuts.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM',
    duration: '00:58',
    tags: ['Fast Cuts', 'Vertical Video', 'Hook Retention', 'Social Ads'],
    client: 'Digital Agency',
    featured: false
  },
  {
    id: '6',
    title: 'Valiant — Valorant Champions Recap',
    category: 'Gaming',
    description: 'Tournament highlight edit combining player live-reaction cams, energetic caster commentary, cinematic slow-mo replays, and SFX enhancement.',
    thumbnail: '/images/thumb_gaming.jpg',
    driveFileId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs6E2B79j2wIM',
    duration: '02:40',
    tags: ['Esports', 'Highlight Reel', 'SFX Enhancement', 'Slow-Mo'],
    client: 'Community Tournament',
    featured: false
  }
];

export const SKILLS_TAGS = [
  'Adobe Premiere Pro',
  'After Effects',
  'DaVinci Resolve',
  'Speed Ramping',
  'Sound Design & SFX',
  'Color Grading',
  'Motion Graphics',
  'Keyframing & FX',
  'Rotoscoping',
  'Thumbnails & Graphics'
];
