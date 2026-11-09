# DAWG — Gamified Discipline, Motivation & RPG Habit Transformation Web App

A high-impact web application inspired by the **DAWG** mobile app architecture documented on **ScreensDesign**. DAWG translates abstract self-improvement and habit tracking into an immersive RPG progression system backed by behavioral neuroscience and psychological retention hooks.

---

## ⚡ Core Features & Architectural Breakdown

### 1. Interactive Onboarding & Diagnostic Flow
* **Interactive Assessment (18 Stages)**: Replaces dry sign-up forms with personalized diagnostic questions covering biological age, exercise frequency, daily screen time, emotional friction, social assertiveness, and long-term dreams.
* **Loss Aversion Hook**: Calculates the exact lifetime hours the user is on track to waste staring at screens (`Hours/Day × 365 × Years Remaining`). Renders a stark emotional warning to generate urgency and break apathy.
* **Neuroscience & 60-Day Habit Shift**: Educates users on dopamine receptor resetting, micro-habit compounding, and identity-driven habit loops.
* **Evolution Theme / Archetype Selection**: Choose from 7 heroic personas:
  1. 🐺 **The Alpha Wolf (Classic DAWG)** — Primal instinct & pack leadership
  2. ⚔️ **The Samurai** — Code of Bushido & razor precision
  3. 🛡️ **The Fallen Knight** — Iron fortitude & crusader redemption
  4. ⚡ **The Anime Hero** — Shonen spirit & limit-breaking aura
  5. 🔮 **The Cyber Agent** — Cold logic & algorithmic efficiency
  6. 🔥 **The Gladiator** — Colosseum grit & raw physical power
  7. ✨ **The Valkyrie** — Divine resolve & celestial clarity
* **Diagnostic Calibration**: Dynamic circular and hexagonal radar animation synthesizing answers into baseline RPG attributes.
* **Future-Self Projection**: Visualizes character evolution from Level 1 (*Stray*) up to Level 100 (*Apex Beast / Divine Sovereign*).
* **Social Proof & Testimonials**: 4.8-star verified reviews and live community member counters.
* **High-Converting Paywall**: Annual ($39.99/yr, "Save 75%") vs. Monthly ($14.99/mo) plans with risk-free trial and dashboard preview.

---

### 2. The Core DAWG Dashboard
* **Dynamic RPG Header**:
  * Live user avatar with archetype ring
  * Level & Rank Title (e.g. `LVL 4 • ASCENDANT II`)
  * Interactive XP Bar (`720 / 1000 XP`) with animated level-up fanfare
  * Streak counter (`🔥 7 DAYS`) and Discipline Tokens (`💎 250`)
* **Weekly Consistency Strip**: Mon–Sun day tracker with visual completion dots.
* **Daily Handpicked Challenges & Quests**:
  * 🏋️ **Physical Strength**: 50 Pushups/Gym, 3L Hydration
  * ⚔️ **Discipline**: 2-Min Freezing Cold Shower, Zero Snooze Wake-Up
  * 🧠 **Mental Focus**: 45-Min Deep Work, 15-Min Reading, 3 Must-Win Battles
  * 🐺 **Social & Ambition**: High-status social interaction
  * **Custom Quest Builder**: Add personal daily challenges anytime
* **Hexagonal Radar Attribute Matrix**:
  * Canvas-rendered 6-axis chart: Physical, Mental, Discipline, Social, Ambition, Focus
  * Real-time stat boosts on quest completions
  * Hours Reclaimed metric
* **Character Evolution Tab**:
  * Full-screen archetype showcase
  * Tier Evolution Ladder (Novice → Scout → Hunter → Titan → Apex)
  * Instant archetype switcher
* **The Pack Clan Arena**:
  * Simulated real-time live activity feed from global members
  * Daily Warrior Manifesto quote generator
* **Deep Work Focus Timer**:
  * Built-in Pomodoro/Discipline timer (25m, 45m, 60m presets)
  * **Zero-dependency procedural soundscapes** generated in real-time via Web Audio API (Rainstorm, Cyber Synth Drone, Alpha Waves)
* **Responsive Dual View**:
  * Floating viewport toggle: switch between an **iPhone 16 Pro Mobile Simulator** and an **Expanded Desktop Dashboard**.

---

## 🚀 How to Run the App

The web app is already running locally in the background!

* **URL**: [http://localhost:3000](http://localhost:3000)
* **Start manually**:
  ```bash
  cd dawg-app
  node server.mjs
  ```
* Open `http://localhost:3000` in any web browser.
