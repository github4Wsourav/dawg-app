// Diagnostic Questionnaire Data, Daily Challenges, and Community Content for DAWG

export const UPI_ID = '9149695684@slc';
export const DEFAULT_GIST_ID = 'f6c4a67653a9b10f92094deefa21e6e4';

export const ONBOARDING_QUESTIONS = [
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'Discipline protocols adapt to your biological prime and metabolic baseline.',
    options: [
      { label: 'Under 18', sub: 'The Early Awakening', value: 17 },
      { label: '18 — 22', sub: 'High Neuroplasticity Peak', value: 20 },
      { label: '23 — 29', sub: 'Prime Execution Window', value: 26, recommended: true },
      { label: '30 — 39', sub: 'Empire Building Phase', value: 34 },
      { label: '40+', sub: 'Mastery & Veteran Leadership', value: 45 }
    ]
  },
  {
    id: 'exercise',
    title: 'How often do you exercise?',
    subtitle: 'Physical capability dictates mental resilience and testosterone levels.',
    options: [
      { label: 'Rarely / Never', sub: 'Sedentary baseline (Needs urgent reboot)', value: 'never' },
      { label: '1 — 2 times / week', sub: 'Inconsistent momentum', value: 'light' },
      { label: '3 — 5 times / week', sub: 'Optimal growth zone', value: 'moderate', recommended: true },
      { label: 'Daily Beast Mode', sub: 'Unforgiving intensity', value: 'daily' }
    ]
  },
  {
    id: 'screen_time',
    title: 'What is your average daily screen time?',
    subtitle: 'Be brutally honest. The algorithm measures your dopamine vulnerability.',
    options: [
      { label: '1 — 2 hours / day', sub: 'Disciplined monk state', hours: 1.5 },
      { label: '3 — 4 hours / day', sub: 'Moderate casual consumption', hours: 3.5 },
      { label: '5 — 8 hours / day', sub: 'High risk: Heavy dopamine drain', hours: 6.5, recommended: true },
      { label: '8+ hours / day', sub: 'Critical hazard: Life slipping away', hours: 9.5 }
    ]
  },
  {
    id: 'loss_aversion',
    type: 'loss_aversion',
    title: 'Wasted Potential Metric',
    subtitle: 'Calculating the exact cost of inaction based on your screen time.'
  },
  {
    id: 'life_excitement',
    title: 'How excited are you about your daily life right now?',
    subtitle: 'Boredom and comfort are the silent killers of human potential.',
    options: [
      { label: 'Dull / Trapped in a Rut', sub: 'Going through the motions passively', value: 'low' },
      { label: 'Meh, Ordinary Routine', sub: 'Comfortable but unfulfilled', value: 'medium' },
      { label: 'Pretty Solid', sub: 'Hungry for the next level', value: 'good', recommended: true },
      { label: 'High Energy & Locked In', sub: 'Relentless drive to dominate', value: 'apex' }
    ]
  },
  {
    id: 'mental_friction',
    title: 'How often do you struggle with brain fog, laziness, or anxiety?',
    subtitle: 'Most modern anxiety is unspent physical and mental energy.',
    options: [
      { label: 'Almost Never', sub: 'Clear mind and high focus', value: 'rare' },
      { label: 'A Few Times a Month', sub: 'Occasional friction', value: 'sometimes' },
      { label: 'Multiple Times a Week', sub: 'Constant friction holding me back', value: 'often', recommended: true },
      { label: 'Every Single Day', sub: 'Paralyzed by hesitation', value: 'daily' }
    ]
  },
  {
    id: 'social_confidence',
    title: 'How do you carry yourself in social situations?',
    subtitle: 'Your internal discipline translates directly to external presence and respect.',
    options: [
      { label: 'Reserved / Overthinking', sub: 'Hard to speak up or lead', value: 'shy' },
      { label: 'Comfortable in Small Groups', sub: 'Neutral observer', value: 'neutral' },
      { label: 'Confident & Assertive', sub: 'Hold strong eye contact and posture', value: 'confident', recommended: true },
      { label: 'Magnetic Leader', sub: 'Commands the room naturally', value: 'leader' }
    ]
  },
  {
    id: 'learning',
    title: 'How often do you study or acquire high-income skills?',
    subtitle: 'If your knowledge isn\'t compounding, you are falling behind.',
    options: [
      { label: 'Rarely / Only When Forced', sub: 'Passive consumer mindset', value: 'rare' },
      { label: 'A Few Times a Month', sub: 'Casual interest', value: 'monthly' },
      { label: 'A Few Times a Week', sub: 'Active self-improvement', value: 'weekly', recommended: true },
      { label: 'Every Single Day', sub: 'Relentless acquisition machine', value: 'daily' }
    ]
  },
  {
    id: 'motivation',
    title: 'What is your primary fuel to level up?',
    subtitle: 'Choose the core anchor that will keep you from quitting on day 21.',
    options: [
      { label: 'Build Iron Physical Strength & Aesthetics', sub: 'Command physical respect and vitality', value: 'physical' },
      { label: 'Forge Unbreakable Mental Discipline', sub: 'Eliminate weakness, excuses, and procrastination', value: 'discipline', recommended: true },
      { label: 'Crush Financial Freedom & Deep Focus', sub: 'Escape the 9-5 rat race through relentless output', value: 'financial' },
      { label: 'Command Authority, Self-Esteem & Respect', sub: 'Become a man others look up to', value: 'respect' }
    ]
  },
  {
    id: 'transformation_proof',
    type: 'transformation_proof',
    title: 'The 60-Day Compounding Law',
    subtitle: 'Why 94% of members experience permanent behavioral transformation.'
  },
  {
    id: 'proud_milestone',
    title: 'When did you last feel deeply proud of yourself?',
    subtitle: 'Real pride cannot be faked—it comes only from self-overcoming.',
    options: [
      { label: 'This Past Week', sub: 'Riding high on recent wins', value: 'week' },
      { label: 'Last Month', sub: 'Momentum slowed down recently', value: 'month', recommended: true },
      { label: 'Over 6 Months Ago', sub: 'It has been far too long', value: 'half_year' },
      { label: 'Honestly, I Can\'t Remember', sub: 'Ready to change that starting right now', value: 'long_time' }
    ]
  },
  {
    id: 'long_term_vision',
    title: 'What is your vision for 5 years from today?',
    subtitle: 'We design your daily quest tree backwards from this destination.',
    options: [
      { label: 'Lead & Impact Thousands of Lives', sub: 'Inspire a movement of strength', value: 'impact' },
      { label: 'Build an Empire & Achieve Freedom', sub: 'Financial, physical, and location sovereignty', value: 'empire', recommended: true },
      { label: 'Reach Apex Physical Condition', sub: 'Single-digit body fat, unyielding endurance', value: 'physical' },
      { label: 'Master My Craft with Absolute Peace', sub: 'Unshakable stoic mastery', value: 'mastery' }
    ]
  },
  {
    id: 'trajectory_chart',
    type: 'trajectory_chart',
    title: 'Your Projected Trajectory',
    subtitle: 'Current Habit Drift vs. The DAWG Protocol'
  },
  {
    id: 'science_pillars',
    type: 'science_pillars',
    title: 'The Science Behind DAWG',
    subtitle: 'Built on behavioral neuroscience, dopamine fasting, and RPG psychological loops.'
  },
  {
    id: 'archetype_selection',
    type: 'archetype_selection',
    title: 'Choose Your Evolution Theme',
    subtitle: 'Your chosen archetype defines your avatar, quest progression, and warrior lore.'
  },
  {
    id: 'diagnostic_calculation',
    type: 'diagnostic_calculation',
    title: 'Calibrating Your Protocol...',
    subtitle: 'Synthesizing responses into RPG attributes and 66-day roadmap.'
  },
  {
    id: 'projection',
    type: 'projection',
    title: 'Future-Self Evolution Projection',
    subtitle: 'Watch your character evolve from baseline Stray to Level 100 Apex.'
  },
  {
    id: 'social_proof',
    type: 'social_proof',
    title: 'The Pack Community',
    subtitle: 'Join 142,850+ warriors who refused mediocrity.'
  },
  {
    id: 'covenant',
    type: 'covenant',
    title: 'The Zero-Cost Discipline Covenant',
    subtitle: '100% Free Forever While Consistent. Inaction Has A Real Penalty.'
  }
];

export const DEFAULT_QUESTS = [
  // Physical
  {
    id: 'q_pushups',
    category: 'physical',
    title: '50 Pushups / Heavy Gym Session',
    desc: 'Break through physical inertia. Build upper body power.',
    xp: 60,
    gems: 10,
    icon: '🏋️',
    stat: 'physical',
    completed: false
  },
  {
    id: 'q_water',
    category: 'physical',
    title: 'Hydrate 3 Liters of Water',
    desc: 'Zero dehydration headaches. Cellular energy optimization.',
    xp: 40,
    gems: 5,
    icon: '💧',
    stat: 'physical',
    completed: false
  },
  // Discipline
  {
    id: 'q_cold_shower',
    category: 'discipline',
    title: '2-Minute Freezing Cold Shower',
    desc: 'Dopamine baseline spike by 250%. Master voluntary discomfort.',
    xp: 80,
    gems: 15,
    icon: '❄️',
    stat: 'discipline',
    completed: false
  },
  {
    id: 'q_no_snooze',
    category: 'discipline',
    title: 'Zero Snooze Morning Wake-up',
    desc: 'Feet on floor immediately. Win the first battle of the day.',
    xp: 50,
    gems: 10,
    icon: '⏰',
    stat: 'discipline',
    completed: false
  },
  // Mental
  {
    id: 'q_deep_work',
    category: 'mental',
    title: '45-Min Distraction-Free Deep Work',
    desc: 'Phone in other room. Single-task relentless output.',
    xp: 90,
    gems: 20,
    icon: '🧠',
    stat: 'focus',
    completed: false
  },
  {
    id: 'q_reading',
    category: 'mental',
    title: '15 Minutes High-Value Reading',
    desc: 'Compounding knowledge. Philosophy, business, or mastery.',
    xp: 50,
    gems: 10,
    icon: '📖',
    stat: 'mental',
    completed: false
  },
  // Social & Ambition
  {
    id: 'q_stranger',
    category: 'social',
    title: 'Initiate 1 Confident Social Interaction',
    desc: 'Strong eye contact, genuine compliment, or handshake.',
    xp: 70,
    gems: 15,
    icon: '🐺',
    stat: 'social',
    completed: false
  },
  {
    id: 'q_plan',
    category: 'mental',
    title: 'Plan Tomorrow\'s 3 Must-Win Battles',
    desc: 'Never wake up wondering what to do. Clear tactical roadmap.',
    xp: 40,
    gems: 5,
    icon: '🎯',
    stat: 'ambition',
    completed: false
  }
];

export const COMMUNITY_TICKER_ITEMS = [
  { user: 'Marcus K.', action: 'completed 100 Pushups', time: '12s ago', xp: '+60 XP', avatar: '🐺' },
  { user: 'Kenji S.', action: 'unlocked Samurai Tier III', time: '34s ago', xp: 'LEVEL UP!', avatar: '⚔️' },
  { user: 'David R.', action: 'reached 21-Day Streak 🔥', time: '1m ago', xp: '+250 XP', avatar: '🛡️' },
  { user: 'Alexander V.', action: 'finished 60m Deep Work', time: '2m ago', xp: '+90 XP', avatar: '🔮' },
  { user: 'Liam C.', action: 'conquered Ice Shower', time: '3m ago', xp: '+80 XP', avatar: '❄️' },
  { user: 'Tyler M.', action: 'ascended to Apex Beast', time: '5m ago', xp: 'RANK UP!', avatar: '🔥' }
];

export const TESTIMONIALS = [
  {
    name: 'Marcus Sterling',
    role: 'Software Founder • 34 Day Streak',
    rating: 5,
    text: 'I used to waste 6+ hours daily doomscrolling and procrastinating. DAWG treated my discipline like an RPG skill tree. The visual accountability made it impossible to fail.'
  },
  {
    name: 'Julian Vance',
    role: 'College Athlete • Level 42',
    rating: 5,
    text: 'The loss aversion calculation on onboarding hit me like a truck. 140,000 hours wasted? Never again. 30 days in, my bench is up 25 lbs and my grades are all As.'
  },
  {
    name: 'David Zhao',
    role: 'Creative Director • Samurai Archetype',
    rating: 5,
    text: 'This isn\'t another boring to-do app. The dark aesthetic, heroic archetype, and dopamine reset loops make building habits feel like playing Elden Ring in real life.'
  }
];

export const MOTIVATION_QUOTES = [
  { text: 'We must all suffer one of two things: the pain of discipline or the pain of regret.', author: 'Jim Rohn' },
  { text: 'You do not rise to the level of your goals. You fall to the level of your systems.', author: 'James Clear' },
  { text: 'A man who conquers himself is greater than one who conquers a thousand men in battle.', author: 'Buddha' },
  { text: 'Don\'t count the days, make the days count.', author: 'Muhammad Ali' },
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: 'The lion does not turn around when a small dog barks.', author: 'African Proverb' }
];

// Helper: Calculate Inactivity & Doubling Penalty Rule
export function calculateInconsistencyPenalty(lastActiveDate) {
  const now = Date.now();
  const last = lastActiveDate ? new Date(lastActiveDate).getTime() : now;
  const diffMs = Math.max(0, now - last);
  const daysMissed = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (daysMissed < 2) {
    return {
      isLocked: false,
      daysMissed,
      penalty: 0
    };
  }

  // Penalty starts at ₹10 at 2 days missed, doubling every 2 additional days
  // 2-3 days = ₹10
  // 4-5 days = ₹20
  // 6-7 days = ₹40
  // 8-9 days = ₹80
  const intervals = Math.floor((daysMissed - 2) / 2);
  const penalty = Math.min(10240, 10 * Math.pow(2, intervals));

  return {
    isLocked: true,
    daysMissed,
    penalty
  };
}

// Local Storage Helper
const STORAGE_KEY = 'DAWG_APP_STATE_V2';

export function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure lastActiveDate exists
      if (!parsed.lastActiveDate) {
        parsed.lastActiveDate = new Date().toISOString();
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
  }

  // Default state
  return {
    onboardingCompleted: false,
    selectedArchetype: 'wolf',
    lastActiveDate: new Date().toISOString(),
    isLocked: false,
    penaltyDue: 0,
    github: {
      gistId: DEFAULT_GIST_ID,
      token: '',
      lastSyncedAt: null,
      autoSync: true
    },
    answers: {
      age: 26,
      exercise: 'moderate',
      screen_time_hours: 6.5,
      life_excitement: 'good',
      mental_friction: 'often',
      social_confidence: 'confident',
      learning: 'weekly',
      motivation: 'discipline',
      proud_milestone: 'month',
      long_term_vision: 'empire'
    },
    user: {
      name: 'Hunter',
      level: 4,
      xp: 720,
      xpToNextLevel: 1000,
      streak: 7,
      gems: 250,
      hoursSaved: 42.5,
      completedTotal: 28,
      rankTitle: 'Ascendant II'
    },
    stats: {
      physical: 78,
      mental: 82,
      discipline: 88,
      social: 65,
      ambition: 92,
      focus: 80
    },
    quests: [...DEFAULT_QUESTS],
    soundEnabled: true,
    hapticsEnabled: true,
    history: {
      0: 6, 1: 8, 2: 7, 3: 5, 4: 8, 5: 7, 6: 4
    }
  };
}

export function saveAppState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state to localStorage:', e);
  }
}

// GitHub Gist Cloud Sync Engine
export async function syncToGitHubGist(gistId, token, state) {
  if (!gistId) return { ok: false, error: 'No Gist ID provided' };

  const payload = {
    description: 'DAWG App Cloud Save & Progress Sync',
    files: {
      'dawg_progress.json': {
        content: JSON.stringify({
          updatedAt: new Date().toISOString(),
          user: state.user,
          stats: state.stats,
          selectedArchetype: state.selectedArchetype,
          lastActiveDate: state.lastActiveDate,
          isLocked: state.isLocked,
          penaltyDue: state.penaltyDue,
          history: state.history,
          questsSummary: state.quests.map(q => ({ id: q.id, completed: q.completed }))
        }, null, 2)
      }
    }
  };

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, data };
    } else {
      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.message || `HTTP ${res.status}` };
    }
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function fetchFromGitHubGist(gistId) {
  if (!gistId) return { ok: false, error: 'No Gist ID' };
  try {
    const res = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const gist = await res.json();
    const file = gist.files && gist.files['dawg_progress.json'];
    if (file && file.content) {
      const parsed = JSON.parse(file.content);
      return { ok: true, state: parsed };
    }
    return { ok: false, error: 'File dawg_progress.json not found in Gist' };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
