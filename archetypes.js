// Character Evolution Archetypes & Visual Assets for DAWG
// High-impact SVG illustrations, progression tiers, and lore

export const ARCHETYPES = {
  wolf: {
    id: 'wolf',
    name: 'The Alpha Wolf',
    subtitle: 'Classic DAWG • Primal Instinct',
    themeColor: '#F59E0B', // Amber Gold
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badge: '🐺 ALPHA',
    quote: '"The lone wolf hungers, but the alpha leads the hunt."',
    description: 'Relentless predatory focus. Built for hunters who conquer through sheer stamina, discipline, and uncompromising pack leadership.',
    tiers: [
      { level: 1, title: 'Stray Pup', desc: 'Roaming the shadows, seeking direction.' },
      { level: 15, title: 'Lone Hunter', desc: 'First blood drawn. Daily routines locked in.' },
      { level: 40, title: 'Pack Enforcer', desc: 'Physique hardened, instincts razor-sharp.' },
      { level: 75, title: 'Dire Beast', desc: 'Dominates the environment through sheer presence.' },
      { level: 100, title: 'Apex Alpha', desc: 'Unshakable legend. Sovereign master of discipline.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#12131A" stroke="#F59E0B" stroke-width="2.5"/>
        <path d="M60 20 L76 42 L88 30 L85 58 L96 74 L78 88 L60 102 L42 88 L24 74 L35 58 L32 30 L44 42 Z" fill="#1C1E2B" stroke="#F59E0B" stroke-width="2"/>
        <path d="M60 28 L70 46 L76 65 L60 92 L44 65 L50 46 Z" fill="#252A3D"/>
        <!-- Amber Glowing Eyes -->
        <polygon points="46,56 55,60 48,63" fill="#F59E0B" filter="drop-shadow(0 0 6px #F59E0B)"/>
        <polygon points="74,56 65,60 72,63" fill="#F59E0B" filter="drop-shadow(0 0 6px #F59E0B)"/>
        <!-- Snout and Fangs -->
        <polygon points="60,68 54,78 66,78" fill="#F59E0B"/>
        <path d="M53 79 L55 86 L57 80 M63 80 L65 86 L67 79" stroke="#FFF" stroke-width="1.5" fill="#FFF"/>
        <!-- Forehead War Paint -->
        <path d="M60 36 L60 52 M54 42 L66 42" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `
  },
  samurai: {
    id: 'samurai',
    name: 'The Samurai',
    subtitle: 'Code of Bushido • Razor Precision',
    themeColor: '#EF4444', // Crimson
    glowColor: 'rgba(239, 68, 68, 0.4)',
    badge: '⚔️ RONIN',
    quote: '"The sharpest blade is forged in the coldest waters."',
    description: 'Absolute mindfulness and deadly consistency. Every breath, cut, and habit is executed with surgical intent.',
    tiers: [
      { level: 1, title: 'Wandering Ronin', desc: 'Disillusioned wanderer with an unpolished blade.' },
      { level: 15, title: 'Ashigaru Scout', desc: 'Mastering the fundamental kata of daily tasks.' },
      { level: 40, title: 'Shadow Blade', desc: 'Unflinching composure under intense pressure.' },
      { level: 75, title: 'Daimyo Champion', desc: 'Commands internal calm amidst absolute chaos.' },
      { level: 100, title: 'Immortal Shogun', desc: 'Transcendental focus. Action and thought as one.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#161214" stroke="#EF4444" stroke-width="2.5"/>
        <!-- Kabuto Helmet Crest -->
        <path d="M60 16 L68 28 L60 35 L52 28 Z" fill="#F59E0B" filter="drop-shadow(0 0 5px #F59E0B)"/>
        <!-- Helmet Bowl -->
        <path d="M30 45 C30 30, 90 30, 90 45 L94 65 C85 68, 35 68, 26 65 Z" fill="#201C24" stroke="#EF4444" stroke-width="2"/>
        <!-- Menpo Mask -->
        <path d="M36 64 L42 90 L60 98 L78 90 L84 64 Z" fill="#2C2329" stroke="#EF4444" stroke-width="2"/>
        <!-- Visor slit / crimson eyes -->
        <rect x="42" y="55" width="14" height="4" rx="2" fill="#EF4444" filter="drop-shadow(0 0 5px #EF4444)"/>
        <rect x="64" y="55" width="14" height="4" rx="2" fill="#EF4444" filter="drop-shadow(0 0 5px #EF4444)"/>
        <!-- Mouth Grill -->
        <line x1="50" y1="80" x2="70" y2="80" stroke="#EF4444" stroke-width="2"/>
        <line x1="52" y1="86" x2="68" y2="86" stroke="#EF4444" stroke-width="2"/>
      </svg>
    `
  },
  knight: {
    id: 'knight',
    name: 'The Fallen Knight',
    subtitle: 'Crusader of Fortitude • Iron Will',
    themeColor: '#3B82F6', // Cobalt Blue
    glowColor: 'rgba(59, 130, 246, 0.4)',
    badge: '🛡️ CRUSADER',
    quote: '"From the ashes of defeat, an unbreakable titan rises."',
    description: 'Forged in heavy iron plate. Endures extreme suffering and transforms pain into unstoppable forward momentum.',
    tiers: [
      { level: 1, title: 'Banished Squire', desc: 'Bearing broken armor and wounded pride.' },
      { level: 15, title: 'Iron Vanguard', desc: 'Refusing to yield to comfort and lethargy.' },
      { level: 40, title: 'Steel Paladin', desc: 'Shielding the mind against toxic distractions.' },
      { level: 75, title: 'High Templar', desc: 'An armored juggernaut of pure discipline.' },
      { level: 100, title: 'Divine Sovereign', desc: 'Indomitable bastion. Untouchable resolve.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#0F1523" stroke="#3B82F6" stroke-width="2.5"/>
        <!-- Great Helm Shape -->
        <path d="M38 35 C42 22, 78 22, 82 35 L86 78 C86 92, 34 92, 34 78 Z" fill="#1C2436" stroke="#3B82F6" stroke-width="2"/>
        <!-- Golden Cross Plating -->
        <path d="M58 26 L62 26 L62 90 L58 90 Z" fill="#F59E0B"/>
        <path d="M40 54 L80 54 L80 60 L40 60 Z" fill="#F59E0B"/>
        <!-- Eye Slits glowing blue -->
        <rect x="42" y="55" width="15" height="4" fill="#60A5FA" filter="drop-shadow(0 0 5px #3B82F6)"/>
        <rect x="63" y="55" width="15" height="4" fill="#60A5FA" filter="drop-shadow(0 0 5px #3B82F6)"/>
        <!-- Breathing Vents -->
        <circle cx="48" cy="72" r="1.5" fill="#3B82F6"/>
        <circle cx="53" cy="72" r="1.5" fill="#3B82F6"/>
        <circle cx="67" cy="72" r="1.5" fill="#3B82F6"/>
        <circle cx="72" cy="72" r="1.5" fill="#3B82F6"/>
      </svg>
    `
  },
  anime: {
    id: 'anime',
    name: 'The Anime Hero',
    subtitle: 'Limitless Awakening • Shonen Fire',
    themeColor: '#EAB308', // Super Saiyan Yellow
    glowColor: 'rgba(234, 179, 8, 0.45)',
    badge: '⚡ ASCENDED',
    quote: '"My limits only exist until I smash through them."',
    description: 'Boundless ambition and unyielding optimism. Fueled by intense workouts, deep focus, and an obsession with leveling up.',
    tiers: [
      { level: 1, title: 'Underdog', desc: 'No special talent. Only stubborn refusal to quit.' },
      { level: 15, title: 'Awakened Fighter', desc: 'First aura ignited. Daily compounding begins.' },
      { level: 40, title: 'Kai Master', desc: 'Crushing past plateaus that stop ordinary men.' },
      { level: 75, title: 'Super Limit-Breaker', desc: 'Electric energy radiating through every habit.' },
      { level: 100, title: 'Ultra Transcendent', desc: 'Godly momentum. Reality bends to your will.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#18150D" stroke="#EAB308" stroke-width="2.5"/>
        <!-- Spiky Golden Aura Hair -->
        <path d="M60 14 L68 32 L82 18 L80 40 L98 34 L88 56 L102 62 L85 75 L75 92 L60 85 L45 92 L35 75 L18 62 L32 56 L22 34 L40 40 L38 18 L52 32 Z" fill="#2A2312" stroke="#EAB308" stroke-width="2"/>
        <!-- Face Silhouette -->
        <polygon points="45,52 60,82 75,52" fill="#FFE0B2"/>
        <!-- Glowing Fierce Eyes -->
        <polygon points="46,56 56,60 50,64" fill="#06B6D4" filter="drop-shadow(0 0 6px #06B6D4)"/>
        <polygon points="74,56 64,60 70,64" fill="#06B6D4" filter="drop-shadow(0 0 6px #06B6D4)"/>
        <!-- Lightning Sparks -->
        <path d="M28 28 L35 38 L30 42 L40 50" stroke="#06B6D4" stroke-width="2" stroke-linecap="round"/>
        <path d="M92 28 L85 38 L90 42 L80 50" stroke="#06B6D4" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  cyber: {
    id: 'cyber',
    name: 'The Cyber Agent',
    subtitle: 'Zero Latency • Cold Logic',
    themeColor: '#A855F7', // Cyber Purple
    glowColor: 'rgba(168, 85, 247, 0.4)',
    badge: '🔮 OPERATIVE',
    quote: '"Emotions are variables. Discipline is an infallible algorithm."',
    description: 'Algorithmic efficiency and stealth mastery. Deconstructs goals into binary milestones with zero cognitive friction.',
    tiers: [
      { level: 1, title: 'Script Initiate', desc: 'Debugging bad habits and clearing malware routines.' },
      { level: 15, title: 'Grid Specialist', desc: 'Optimized morning protocols and data tracking.' },
      { level: 40, title: 'Cyber Infiltrator', desc: 'Deep work master. Zero social distraction.' },
      { level: 75, title: 'Quantum Phantom', desc: 'Moves through high-stakes challenges silently.' },
      { level: 100, title: 'Root Administrator', desc: 'Total control over internal state and reality.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#130D1E" stroke="#A855F7" stroke-width="2.5"/>
        <!-- Sleek Cybernetic Helmet -->
        <path d="M35 45 C35 25, 85 25, 85 45 L90 75 L60 98 L30 75 Z" fill="#1F1530" stroke="#A855F7" stroke-width="2"/>
        <!-- Neon Hex Visor -->
        <polygon points="36,54 84,54 80,68 40,68" fill="#A855F7" filter="drop-shadow(0 0 8px #A855F7)"/>
        <line x1="42" y1="61" x2="78" y2="61" stroke="#06B6D4" stroke-width="1.5"/>
        <!-- Circuit traces -->
        <path d="M48 76 L48 85 L60 92 L72 85 L72 76" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="2 3"/>
      </svg>
    `
  },
  gladiator: {
    id: 'gladiator',
    name: 'The Gladiator',
    subtitle: 'Colosseum Grit • Raw Power',
    themeColor: '#F97316', // Flame Orange
    glowColor: 'rgba(249, 115, 22, 0.4)',
    badge: '🔥 JUGGERNAUT',
    quote: '"He who fears no death fears no challenge."',
    description: 'Brutal physical strength and sheer tenacity. Demolishes heavy gym sessions and rises stronger from every failure.',
    tiers: [
      { level: 1, title: 'Slave of Routine', desc: 'Chained to comfortable, mediocre habits.' },
      { level: 15, title: 'Pit Fighter', desc: 'Brawling through soreness and mental fatigue.' },
      { level: 40, title: 'Arena Favorite', desc: 'Crowd roars as personal records shatter.' },
      { level: 75, title: 'Colosseum Titan', desc: 'A boulder of muscle and indomitable courage.' },
      { level: 100, title: 'Maximus Victor', desc: 'Eternal champion. Feared and revered by all.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#1A110D" stroke="#F97316" stroke-width="2.5"/>
        <!-- Bronze Crest -->
        <path d="M56 12 C56 8, 64 8, 64 12 L64 35 L56 35 Z" fill="#EF4444"/>
        <path d="M45 20 C50 15, 70 15, 75 20 L72 32 L48 32 Z" fill="#F97316"/>
        <!-- Helm -->
        <path d="M34 40 C34 28, 86 28, 86 40 L90 70 L60 98 L30 70 Z" fill="#2B1A12" stroke="#F97316" stroke-width="2"/>
        <!-- Face Grill / Iron Bars -->
        <rect x="42" y="52" width="36" height="6" fill="#120A05" stroke="#F97316"/>
        <line x1="48" y1="52" x2="48" y2="58" stroke="#F97316" stroke-width="2"/>
        <line x1="56" y1="52" x2="56" y2="58" stroke="#F97316" stroke-width="2"/>
        <line x1="64" y1="52" x2="64" y2="58" stroke="#F97316" stroke-width="2"/>
        <line x1="72" y1="52" x2="72" y2="58" stroke="#F97316" stroke-width="2"/>
        <circle cx="50" cy="46" r="3" fill="#F97316" filter="drop-shadow(0 0 4px #F97316)"/>
        <circle cx="70" cy="46" r="3" fill="#F97316" filter="drop-shadow(0 0 4px #F97316)"/>
      </svg>
    `
  },
  valkyrie: {
    id: 'valkyrie',
    name: 'The Valkyrie',
    subtitle: 'Divine Resolve • Soaring Might',
    themeColor: '#10B981', // Emerald Mint
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badge: '✨ DIVINE',
    quote: '"Only those with pure purpose shall ascend."',
    description: 'Grace, speed, and luminous clarity. Eliminates chaos through noble virtues, clean nutrition, and unyielding composure.',
    tiers: [
      { level: 1, title: 'Fledgling Seeker', desc: 'Learning to spread wings in a chaotic world.' },
      { level: 15, title: 'Silver Wing', desc: 'Elevating standards above cheap distractions.' },
      { level: 40, title: 'Sky Guardian', desc: 'Radiates calm authority and infectious discipline.' },
      { level: 75, title: 'Storm Sovereign', desc: 'Commands personal destiny from celestial heights.' },
      { level: 100, title: 'Divine Paragon', desc: 'Transcendent poise. Unshakeable mental clarity.' }
    ],
    svg: (size = 120) => `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="56" fill="#0C1915" stroke="#10B981" stroke-width="2.5"/>
        <!-- Winged Crown -->
        <path d="M26 30 L45 42 L38 52 Z" fill="#10B981"/>
        <path d="M94 30 L75 42 L82 52 Z" fill="#10B981"/>
        <!-- Tiara / Faceplate -->
        <path d="M40 38 L60 26 L80 38 L76 74 L60 92 L44 74 Z" fill="#162E25" stroke="#10B981" stroke-width="2"/>
        <!-- Emerald Gem Center -->
        <polygon points="60,34 65,42 60,50 55,42" fill="#34D399" filter="drop-shadow(0 0 6px #10B981)"/>
        <!-- Radiant Eyes -->
        <ellipse cx="50" cy="56" rx="4" ry="2" fill="#6EE7B7" filter="drop-shadow(0 0 4px #34D399)"/>
        <ellipse cx="70" cy="56" rx="4" ry="2" fill="#6EE7B7" filter="drop-shadow(0 0 4px #34D399)"/>
      </svg>
    `
  }
};
