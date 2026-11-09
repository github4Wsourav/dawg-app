// DAWG Core Application Logic & State Engine
import { audio } from './audio.js';
import { ARCHETYPES } from './archetypes.js';
import { HexRadarChart } from './radar.js';
import { 
  UPI_ID,
  DEFAULT_GIST_ID,
  ONBOARDING_QUESTIONS, 
  DEFAULT_QUESTS, 
  COMMUNITY_TICKER_ITEMS, 
  TESTIMONIALS, 
  MOTIVATION_QUOTES, 
  calculateInconsistencyPenalty,
  loadAppState, 
  saveAppState,
  syncToGitHubGist,
  fetchFromGitHubGist
} from './data.js';

class DawgApp {
  constructor() {
    this.state = loadAppState();
    this.currentTab = 'quests';
    this.onboardingStep = 0;
    this.radarChart = null;
    this.timerInterval = null;
    this.timerSeconds = 25 * 60;
    this.timerTotalSeconds = 25 * 60;
    this.timerRunning = false;

    this.init();
  }

  init() {
    this.applyThemeColors();
    this.setupViewportToggle();

    // Check Inactivity Penalty Rule
    const check = calculateInconsistencyPenalty(this.state.lastActiveDate);
    if (check.isLocked) {
      this.state.isLocked = true;
      this.state.penaltyDue = check.penalty;
      this.state.missedDays = check.daysMissed;
    } else {
      this.state.isLocked = false;
      this.state.penaltyDue = 0;
    }

    // Route view
    if (this.state.isLocked && this.state.onboardingCompleted) {
      this.renderLockdownScreen();
    } else if (!this.state.onboardingCompleted) {
      this.renderOnboarding();
    } else {
      this.renderDashboard();
    }

    this.startCommunityTicker();
  }

  applyThemeColors() {
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;
    document.documentElement.style.setProperty('--current-theme', arch.themeColor);
    document.documentElement.style.setProperty('--current-glow', arch.glowColor);
  }

  setupViewportToggle() {
    const mobileBtn = document.getElementById('btnMobileView');
    const desktopBtn = document.getElementById('btnDesktopView');
    const container = document.getElementById('deviceContainer');

    if (mobileBtn && desktopBtn && container) {
      mobileBtn.addEventListener('click', () => {
        container.classList.remove('desktop-mode');
        container.classList.add('mobile-mode');
        mobileBtn.classList.add('active');
        desktopBtn.classList.remove('active');
        audio.playClick();
        if (this.radarChart) setTimeout(() => this.radarChart.setupResolution(), 300);
      });

      desktopBtn.addEventListener('click', () => {
        container.classList.remove('mobile-mode');
        container.classList.add('desktop-mode');
        desktopBtn.classList.add('active');
        mobileBtn.classList.remove('active');
        audio.playClick();
        if (this.radarChart) setTimeout(() => this.radarChart.setupResolution(), 300);
      });
    }
  }

  /* ==========================================================================
     ONBOARDING FLOW
     ========================================================================== */

  renderOnboarding() {
    const appHeader = document.getElementById('appHeader');
    const headerXp = document.getElementById('headerXp');
    const bottomNav = document.getElementById('bottomNav');
    const mainContent = document.getElementById('mainContent');

    if (appHeader) appHeader.style.display = 'none';
    if (headerXp) headerXp.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';

    const question = ONBOARDING_QUESTIONS[this.onboardingStep];
    const totalSteps = ONBOARDING_QUESTIONS.length;
    const progressPct = ((this.onboardingStep + 1) / totalSteps) * 100;

    let html = `
      <div class="onboarding-progress-bar">
        <div class="onboarding-progress-fill" style="width: ${progressPct}%"></div>
      </div>
      <div class="onboarding-screen">
    `;

    if (this.onboardingStep === 0) {
      html += this.renderSplashScreen();
    } else if (question.type === 'loss_aversion') {
      html += this.renderLossAversionScreen();
    } else if (question.type === 'transformation_proof') {
      html += this.renderTransformationProofScreen();
    } else if (question.type === 'trajectory_chart') {
      html += this.renderTrajectoryScreen();
    } else if (question.type === 'science_pillars') {
      html += this.renderScienceScreen();
    } else if (question.type === 'archetype_selection') {
      html += this.renderArchetypeSelectionScreen();
    } else if (question.type === 'diagnostic_calculation') {
      html += this.renderDiagnosticCalculationScreen();
    } else if (question.type === 'projection') {
      html += this.renderProjectionScreen();
    } else if (question.type === 'social_proof') {
      html += this.renderSocialProofScreen();
    } else if (question.type === 'covenant') {
      html += this.renderCovenantScreen();
    } else {
      html += this.renderStandardQuestionScreen(question);
    }

    html += `</div>`;
    mainContent.innerHTML = html;

    this.bindOnboardingEvents(question);
  }

  renderSplashScreen() {
    const wolfSvg = ARCHETYPES.wolf.svg(130);
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 10px; min-height: 80vh;">
        <div style="margin-bottom: 24px; filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.45)); animation: pulse 2.5s infinite;">
          ${wolfSvg}
        </div>
        <span class="onboarding-badge">RPG DISCIPLINE PROTOCOL</span>
        <h1 style="font-family: var(--font-display); font-size: 42px; font-weight: 900; letter-spacing: 2px; color: #FFF; margin: 8px 0; text-transform: uppercase;">
          DAWG
        </h1>
        <p style="font-size: 15px; color: var(--text-muted); max-width: 320px; line-height: 1.5; margin-bottom: 24px;">
          Discipline & Motivation gamified. Level up your physical, mental, and social attributes in real life.
        </p>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.3); padding: 8px 16px; border-radius: 20px; font-size: 12px; color: var(--accent-emerald); display: flex; align-items: center; gap: 8px; margin-bottom: 30px;">
          <span>✓</span> 100% Free Forever As Long As You Stay Consistent
        </div>

        <button id="btnStartDiagnostic" class="btn-primary">
          <span>FORGE YOUR DISCIPLINE</span>
          <span>→</span>
        </button>
      </div>
    `;
  }

  renderStandardQuestionScreen(q) {
    const selectedVal = this.state.answers[q.id];
    let optionsHtml = '';

    q.options.forEach((opt) => {
      const isSelected = selectedVal === opt.value || selectedVal === opt.hours;
      optionsHtml += `
        <div class="option-card ${isSelected ? 'selected' : ''}" data-value="${opt.value !== undefined ? opt.value : opt.hours}" data-hours="${opt.hours || ''}">
          <div class="option-card-content">
            <div class="option-card-title">${opt.label}</div>
            <div class="option-card-sub">${opt.sub}</div>
          </div>
          <div class="option-indicator"></div>
        </div>
      `;
    });

    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">STEP ${this.onboardingStep + 1} OF ${ONBOARDING_QUESTIONS.length}</span>
        <h2 class="onboarding-title">${q.title}</h2>
        <p class="onboarding-subtitle">${q.subtitle}</p>
      </div>
      <div class="option-list">
        ${optionsHtml}
      </div>
      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>CONTINUE</span>
        <span>→</span>
      </button>
    `;
  }

  renderLossAversionScreen() {
    const hoursPerDay = this.state.answers.screen_time_hours || 6.5;
    const age = this.state.answers.age || 26;
    const yearsRemaining = Math.max(10, 78 - age);
    const wastedLifetimeHours = Math.round(hoursPerDay * 365 * yearsRemaining);
    const wastedYears = (wastedLifetimeHours / 8760).toFixed(1);

    audio.playWarningDrone();

    return `
      <div class="onboarding-header">
        <span class="onboarding-badge" style="color: var(--accent-crimson); border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.1);">
          ⚠️ REALITY CHECK
        </span>
        <h2 class="onboarding-title">Your Projected Waste</h2>
        <p class="onboarding-subtitle">Based on your daily average of ${hoursPerDay} hours on screens.</p>
      </div>

      <div class="loss-aversion-box">
        <div class="urgency-badge">CRITICAL LEAK DETECTED</div>
        <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">
          LIFETIME HOURS CONSUMED BY SCREENS
        </div>
        <div class="wasted-hours-number">
          ${wastedLifetimeHours.toLocaleString()}
        </div>
        <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-top: 4px;">
          Equivalent to <span style="color: var(--accent-crimson); font-size: 16px;">${wastedYears} full years</span> of non-stop scrolling.
        </div>
      </div>

      <div class="card" style="margin-bottom: 24px; border-color: rgba(245, 158, 11, 0.3);">
        <div style="font-size: 13px; font-weight: 800; color: var(--accent-gold); margin-bottom: 6px;">
          ⚔️ THE CONSISTENCY RULE
        </div>
        <div style="font-size: 13px; color: var(--text-muted); line-height: 1.5;">
          The DAWG protocol is <strong>completely free</strong> as long as you execute daily. Slacking off for 2 consecutive days triggers an accountability stake.
        </div>
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>I REFUSE TO WASTE MY LIFE</span>
        <span>→</span>
      </button>
    `;
  }

  renderTransformationProofScreen() {
    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">NEUROSCIENCE DATA</span>
        <h2 class="onboarding-title">The 60-Day Habit Shift</h2>
        <p class="onboarding-subtitle">Automaticity occurs at day 66 through daily execution.</p>
      </div>

      <div class="card" style="padding: 20px; text-align: center; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-around; margin-bottom: 16px;">
          <div>
            <div style="font-size: 32px; font-weight: 900; color: var(--accent-gold); font-family: var(--font-display);">94%</div>
            <div style="font-size: 11px; color: var(--text-dim); font-weight: 700;">PERMANENT ROUTINES</div>
          </div>
          <div style="width: 1px; background: var(--border-subtle);"></div>
          <div>
            <div style="font-size: 32px; font-weight: 900; color: var(--accent-emerald); font-family: var(--font-display);">3.4x</div>
            <div style="font-size: 11px; color: var(--text-dim); font-weight: 700;">FOCUS OUTPUT</div>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 12px; font-size: 12px; color: var(--text-muted); text-align: left; line-height: 1.4;">
          "The gamified streak system triggers dopamine release for self-restraint and hard workouts, reversing the modern brain's addiction to passive screen dopamine."
        </div>
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>LOCK IN THE PROTOCOL</span>
        <span>→</span>
      </button>
    `;
  }

  renderTrajectoryScreen() {
    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">TRAJECTORY FORECAST</span>
        <h2 class="onboarding-title">Where Will You Be in 1 Year?</h2>
        <p class="onboarding-subtitle">Two completely different men diverge from this exact moment.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 24px;">
        <div style="background: rgba(239, 68, 68, 0.08); border: 1.5px solid rgba(239, 68, 68, 0.3); border-radius: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 14px; font-weight: 900; color: var(--accent-crimson);">PATH 1: DRIFT & PROCRASTINATION</div>
            <span style="font-size: 11px; color: var(--accent-crimson); font-weight: 800;">-1,200 HRS</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            Same low energy, higher screen addiction, regret, unfulfilled goals, stagnant career.
          </div>
        </div>

        <div style="background: rgba(245, 158, 11, 0.08); border: 1.5px solid var(--accent-gold); border-radius: 16px; padding: 16px; box-shadow: 0 0 20px -5px var(--current-glow);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 14px; font-weight: 900; color: var(--accent-gold);">PATH 2: THE DAWG PROTOCOL</div>
            <span style="font-size: 11px; color: var(--accent-gold); font-weight: 800;">APEX TIER</span>
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            Ripped physique, razor-sharp focus, daily dopamine reset, Level 100 character status, genuine pride.
          </div>
        </div>
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>I CHOOSE PATH 2</span>
        <span>→</span>
      </button>
    `;
  }

  renderScienceScreen() {
    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">NEURAL ARCHITECTURE</span>
        <h2 class="onboarding-title">Built on 3 Scientific Pillars</h2>
        <p class="onboarding-subtitle">Engineered specifically for men who need tangible progression.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: var(--accent-gold); margin-bottom: 4px;">
            1. Dopamine Receptor Fasting
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            Cutting off hyper-stimulating algorithms resets sensitivity so high-value tasks become rewarding again.
          </div>
        </div>

        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: var(--accent-cyan); margin-bottom: 4px;">
            2. RPG Identity Shifting
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            You don't just "do habits"—you embody a legendary warrior archetype. Behavior follows identity.
          </div>
        </div>

        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 14px; font-weight: 800; color: var(--accent-emerald); margin-bottom: 4px;">
            3. Micro-Habit Compounding
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            Actionable daily challenges calibrated to keep you in flow state without burning out.
          </div>
        </div>
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>CHOOSE YOUR WARRIOR</span>
        <span>→</span>
      </button>
    `;
  }

  renderArchetypeSelectionScreen() {
    let slidesHtml = '';
    const selected = this.state.selectedArchetype || 'wolf';

    Object.values(ARCHETYPES).forEach((arch) => {
      const isSel = selected === arch.id;
      slidesHtml += `
        <div class="archetype-slide ${isSel ? 'selected' : ''}" data-id="${arch.id}" style="--current-theme: ${arch.themeColor}; --current-glow: ${arch.glowColor};">
          <div class="archetype-slide-avatar">
            ${arch.svg(110)}
          </div>
          <div class="archetype-slide-title">${arch.name}</div>
          <div class="archetype-slide-badge">${arch.badge} • ${arch.subtitle}</div>
          <div class="archetype-slide-desc">${arch.description}</div>
          <div style="margin-top: 14px; font-style: italic; font-size: 11px; color: var(--text-dim);">
            ${arch.quote}
          </div>
        </div>
      `;
    });

    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">AVATAR SELECTION</span>
        <h2 class="onboarding-title">Choose Your Evolution Theme</h2>
        <p class="onboarding-subtitle">Select the heroic persona that will anchor your personal transformation.</p>
      </div>

      <div class="archetype-carousel" id="archetypeCarousel">
        ${slidesHtml}
      </div>

      <div style="text-align: center; font-size: 11px; color: var(--text-dim); margin-bottom: 16px;">
        ← Swipe horizontally to explore archetypes →
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>CONFIRM ARCHETYPE</span>
        <span>→</span>
      </button>
    `;
  }

  renderDiagnosticCalculationScreen() {
    audio.playReward();

    setTimeout(() => {
      this.onboardingStep++;
      this.renderOnboarding();
    }, 2800);

    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 10px; min-height: 75vh;">
        <div style="position: relative; width: 140px; height: 140px; margin-bottom: 30px;">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="6"/>
            <circle id="calcCircle" cx="70" cy="70" r="60" fill="none" stroke="var(--current-theme)" stroke-width="6" 
                    stroke-dasharray="377" stroke-dashoffset="100" stroke-linecap="round"
                    style="transition: stroke-dashoffset 2.5s ease-out;"/>
          </svg>
          <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div id="calcPct" style="font-family: var(--font-display); font-size: 38px; font-weight: 900; color: #FFF;">94%</div>
            <div style="font-size: 10px; font-weight: 800; color: var(--current-theme); letter-spacing: 0.5px;">POTENTIAL</div>
          </div>
        </div>

        <span class="onboarding-badge">AI PROTOCOL CALIBRATION</span>
        <h3 id="calcMessage" style="font-size: 18px; font-weight: 800; color: #FFF; margin: 8px 0;">
          Synthesizing Diagnostic Data...
        </h3>
        <p style="font-size: 13px; color: var(--text-muted); max-width: 280px; line-height: 1.4;">
          Mapping physical, mental, and social attributes into your custom 66-day skill tree.
        </p>
      </div>
    `;
  }

  renderProjectionScreen() {
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;

    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">FUTURE-SELF PROJECTION</span>
        <h2 class="onboarding-title">Your 90-Day Evolution</h2>
        <p class="onboarding-subtitle">As you complete daily quests, your character visibly transforms.</p>
      </div>

      <div class="card highlight" style="text-align: center; padding: 24px 16px; margin-bottom: 20px;">
        <div style="margin-bottom: 12px; filter: drop-shadow(0 0 16px var(--current-glow));">
          ${arch.svg(110)}
        </div>
        <div style="font-family: var(--font-display); font-size: 24px; font-weight: 900; color: var(--current-theme);">
          LEVEL 100 • APEX BEAST
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #FFF; margin-bottom: 16px;">
          Max Potential Realized
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: left;">
          <div style="background: rgba(255, 255, 255, 0.04); padding: 8px 10px; border-radius: 10px;">
            <div style="font-size: 10px; color: var(--text-dim); font-weight: 700;">PHYSICAL</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--accent-gold);">96 / 100</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.04); padding: 8px 10px; border-radius: 10px;">
            <div style="font-size: 10px; color: var(--text-dim); font-weight: 700;">DISCIPLINE</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--accent-emerald);">98 / 100</div>
          </div>
          <div style="background: rgba(255, 255, 255, 0.04); padding: 8px 10px; border-radius: 10px;">
            <div style="font-size: 10px; color: var(--text-dim); font-weight: 700;">FOCUS</div>
            <div style="font-size: 14px; font-weight: 800; color: var(--accent-cyan);">95 / 100</div>
          </div>
        </div>
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>SEE COMMUNITY REVIEWS</span>
        <span>→</span>
      </button>
    `;
  }

  renderSocialProofScreen() {
    let tHtml = '';
    TESTIMONIALS.forEach((t) => {
      tHtml += `
        <div class="card" style="margin-bottom: 12px; padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 13px; font-weight: 800; color: #FFF;">${t.name}</div>
            <div style="color: var(--accent-gold); font-size: 12px;">★★★★★</div>
          </div>
          <div style="font-size: 10px; font-weight: 700; color: var(--current-theme); margin-bottom: 6px;">
            ${t.role}
          </div>
          <div style="font-size: 12px; color: var(--text-muted); line-height: 1.4;">
            "${t.text}"
          </div>
        </div>
      `;
    });

    return `
      <div class="onboarding-header">
        <span class="onboarding-badge">VERIFIED SOCIAL PROOF</span>
        <h2 class="onboarding-title">4.8 Stars Across 7,000+ Men</h2>
        <p class="onboarding-subtitle">Real warriors who took the oath and transformed their lives.</p>
      </div>

      <div style="margin-bottom: 20px;">
        ${tHtml}
      </div>

      <button id="btnNextStep" class="btn-primary" style="margin-top: auto;">
        <span>REVIEW DISCIPLINE COVENANT</span>
        <span>→</span>
      </button>
    `;
  }

  // The Zero-Cost Discipline Covenant (Replaces the subscription paywall)
  renderCovenantScreen() {
    return `
      <div class="onboarding-header" style="text-align: center; margin-top: 10px;">
        <span class="onboarding-badge" style="background: rgba(16, 185, 129, 0.15); border-color: rgba(16, 185, 129, 0.4); color: var(--accent-emerald);">
          ✓ 100% FREE WHILE CONSISTENT
        </span>
        <h2 class="onboarding-title" style="font-size: 26px;">The Warrior Covenant</h2>
        <p class="onboarding-subtitle">No subscriptions. No paywalls. Only real skin in the game.</p>
      </div>

      <div class="card highlight" style="padding: 18px; margin-bottom: 18px; text-align: left;">
        <div style="font-size: 13px; font-weight: 800; color: var(--accent-gold); margin-bottom: 10px;">
          ⚖️ THE COMMITMENT RULE
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 13px; color: var(--text-muted); line-height: 1.45;">
          <div style="display: flex; gap: 8px;">
            <span style="color: var(--accent-emerald); font-weight: 900;">✓</span>
            <div><strong>Access is 100% Free</strong> as long as you log in and execute your daily quests.</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="color: var(--accent-crimson); font-weight: 900;">⚠️</span>
            <div><strong>2-Day Inactivity Lock</strong>: If you vanish for 2 consecutive days, your protocol gets locked.</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="color: var(--accent-gold); font-weight: 900;">⚡</span>
            <div><strong>The Stake</strong>: You must pay a penalty of <strong>₹10</strong> to UPI ID <code style="color: var(--accent-gold);">${UPI_ID}</code> to unlock and resume your streak.</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <span style="color: var(--accent-orange); font-weight: 900;">📈</span>
            <div><strong>The Multiplier</strong>: The penalty <strong>doubles every 2 additional days missed</strong> (₹10 → ₹20 → ₹40 → ₹80).</div>
          </div>
        </div>
      </div>

      <div style="background: rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 12px; font-size: 11px; color: var(--text-dim); text-align: center; margin-bottom: 20px;">
        All progress is automatically backed up and synced to your GitHub account.
      </div>

      <button id="btnAcceptCovenant" class="btn-primary">
        <span>I TAKE THE OATH — ENTER FREE</span>
        <span>⚔️</span>
      </button>
    `;
  }

  bindOnboardingEvents(q) {
    const startBtn = document.getElementById('btnStartDiagnostic');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        audio.playClick();
        this.onboardingStep++;
        this.renderOnboarding();
      });
    }

    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach((card) => {
      card.addEventListener('click', () => {
        audio.playClick();
        optionCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const val = card.getAttribute('data-value');
        const hrs = card.getAttribute('data-hours');
        if (q && q.id) {
          this.state.answers[q.id] = val;
          if (hrs) this.state.answers.screen_time_hours = parseFloat(hrs);
        }
      });
    });

    const slides = document.querySelectorAll('.archetype-slide');
    slides.forEach((slide) => {
      slide.addEventListener('click', () => {
        audio.playClick();
        slides.forEach(s => s.classList.remove('selected'));
        slide.classList.add('selected');
        const archId = slide.getAttribute('data-id');
        this.state.selectedArchetype = archId;
        this.applyThemeColors();
      });
    });

    const nextBtn = document.getElementById('btnNextStep');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        audio.playClick();
        if (this.onboardingStep < ONBOARDING_QUESTIONS.length - 1) {
          this.onboardingStep++;
          this.renderOnboarding();
        }
      });
    }

    const acceptBtn = document.getElementById('btnAcceptCovenant');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        audio.playLevelUp();
        this.state.onboardingCompleted = true;
        this.state.lastActiveDate = new Date().toISOString();
        this.state.isLocked = false;
        saveAppState(this.state);
        this.syncStateToGitHub();
        this.renderDashboard();
      });
    }
  }

  /* ==========================================================================
     DISCIPLINE BREACH LOCKDOWN SCREEN (UPI PENALTY ENGINE)
     ========================================================================== */

  renderLockdownScreen() {
    const appHeader = document.getElementById('appHeader');
    const headerXp = document.getElementById('headerXp');
    const bottomNav = document.getElementById('bottomNav');
    const mainContent = document.getElementById('mainContent');

    if (appHeader) appHeader.style.display = 'none';
    if (headerXp) headerXp.style.display = 'none';
    if (bottomNav) bottomNav.style.display = 'none';

    audio.playWarningDrone();

    const penalty = this.state.penaltyDue || 10;
    const daysMissed = this.state.missedDays || 2;
    const upiUri = `upi://pay?pa=${UPI_ID}&pn=DAWG%20Discipline&am=${penalty}&cu=INR&tn=DAWG%20Inconsistency%20Penalty%20${daysMissed}%20Days`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUri)}`;

    mainContent.innerHTML = `
      <div class="lockdown-container">
        <div class="lockdown-alert-badge">
          <span>⚠️</span> PROTOCOL FROZEN • DISCIPLINE BREACH
        </div>

        <h2 style="font-family: var(--font-display); font-size: 34px; font-weight: 900; color: #FFF; margin-bottom: 6px;">
          YOU BROKE CONSISTENCY
        </h2>
        <p style="font-size: 13px; color: var(--text-muted); max-width: 320px; line-height: 1.45;">
          You were inactive for <strong>${daysMissed} consecutive days</strong>. Your progress and warrior stats are frozen until the accountability penalty is settled.
        </p>

        <div class="lockdown-penalty-card">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-crimson); text-transform: uppercase; letter-spacing: 1px;">
            ACCOUNTABILITY STAKE REQUIRED
          </div>
          <div class="lockdown-amount-big">
            ₹${penalty}
          </div>
          <div style="font-size: 11px; color: var(--text-dim);">
            (Penalty starts at ₹10 for 2 days, doubling every 2 additional days)
          </div>

          <!-- UPI ID Copy Box -->
          <div class="upi-id-pill" id="btnCopyUpiId">
            <span class="upi-id-text">${UPI_ID}</span>
            <span class="btn-copy-upi" id="copyUpiText">COPY UPI</span>
          </div>

          <!-- 1-Tap Mobile UPI Intent Button -->
          <a href="${upiUri}" class="btn-upi-intent">
            <span>⚡ PAY VIA ANY UPI APP (GPAY / PHONEPE / PAYTM)</span>
          </a>

          <!-- QR Code for Desktop / Scanner -->
          <div class="qr-code-box">
            <img src="${qrCodeUrl}" alt="Scan UPI QR Code to Pay ₹${penalty}">
          </div>
          <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">
            Scan QR code or click above to pay with your banking app
          </div>
        </div>

        <!-- Verification Form -->
        <div style="width: 100%; max-width: 360px;">
          <input type="text" id="inputUtrNumber" class="utr-input-field" placeholder="Enter 12-Digit UPI Ref / UTR / Txn ID">
          <button id="btnVerifyPenalty" class="btn-primary" style="background: linear-gradient(135deg, #10B981, #059669);">
            <span>CONFIRM PAYMENT & RESUME PROTOCOL</span>
            <span>🔓</span>
          </button>
        </div>
      </div>
    `;

    // Bind Lockdown Events
    const copyBtn = document.getElementById('btnCopyUpiId');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(UPI_ID);
        audio.playReward();
        const text = document.getElementById('copyUpiText');
        if (text) {
          text.innerText = 'COPIED!';
          setTimeout(() => { text.innerText = 'COPY UPI'; }, 2000);
        }
      });
    }

    const verifyBtn = document.getElementById('btnVerifyPenalty');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        const utr = document.getElementById('inputUtrNumber').value.trim();
        audio.playSuccess();
        audio.playLevelUp();

        // Unlock protocol
        this.state.isLocked = false;
        this.state.penaltyDue = 0;
        this.state.missedDays = 0;
        this.state.lastActiveDate = new Date().toISOString();
        saveAppState(this.state);
        this.syncStateToGitHub();

        alert(`Payment of ₹${penalty} verified! Protocol unlocked. Welcome back to the hunt, warrior.`);
        this.renderDashboard();
      });
    }
  }

  /* ==========================================================================
     CORE DASHBOARD
     ========================================================================== */

  renderDashboard() {
    const appHeader = document.getElementById('appHeader');
    const headerXp = document.getElementById('headerXp');
    const bottomNav = document.getElementById('bottomNav');
    const mainContent = document.getElementById('mainContent');

    if (appHeader) appHeader.style.display = 'flex';
    if (headerXp) headerXp.style.display = 'block';
    if (bottomNav) bottomNav.style.display = 'flex';

    this.updateHeaderUI();
    this.updateNavUI();

    let html = '';
    if (this.currentTab === 'quests') {
      html = this.renderQuestsTab();
    } else if (this.currentTab === 'radar') {
      html = this.renderRadarTab();
    } else if (this.currentTab === 'evolution') {
      html = this.renderEvolutionTab();
    } else if (this.currentTab === 'arena') {
      html = this.renderArenaTab();
    } else if (this.currentTab === 'timer') {
      html = this.renderTimerTab();
    } else if (this.currentTab === 'settings') {
      html = this.renderSettingsTab();
    }

    mainContent.innerHTML = html;
    this.bindDashboardEvents();

    if (this.currentTab === 'radar') {
      setTimeout(() => this.initRadarChart(), 50);
    }
  }

  updateHeaderUI() {
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;
    const avatarContainer = document.getElementById('headerAvatar');
    const levelBadge = document.getElementById('headerLevelBadge');
    const streakPill = document.getElementById('headerStreak');
    const gemsPill = document.getElementById('headerGems');
    const xpText = document.getElementById('headerXpText');
    const xpFill = document.getElementById('headerXpFill');

    if (avatarContainer) avatarContainer.innerHTML = arch.svg(36);
    if (levelBadge) {
      levelBadge.innerHTML = `<span>LVL ${this.state.user.level}</span> • <span>${this.state.user.rankTitle}</span>`;
    }
    if (streakPill) {
      streakPill.innerHTML = `🔥 ${this.state.user.streak} DAYS`;
    }
    if (gemsPill) {
      gemsPill.innerHTML = `💎 ${this.state.user.gems}`;
    }
    if (xpText) {
      xpText.innerText = `${this.state.user.xp} / ${this.state.user.xpToNextLevel} XP`;
    }
    if (xpFill) {
      const pct = Math.min(100, (this.state.user.xp / this.state.user.xpToNextLevel) * 100);
      xpFill.style.width = `${pct}%`;
    }
  }

  updateNavUI() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((btn) => {
      const tab = btn.getAttribute('data-tab');
      if (tab === this.currentTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  /* --- Tab 1: Daily Quests --- */
  renderQuestsTab() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const currentDayIdx = (new Date().getDay() + 6) % 7;

    let weekHtml = '';
    days.forEach((day, idx) => {
      const isToday = idx === currentDayIdx;
      const count = this.state.history[idx] || 0;
      const isCompleted = count >= 4;

      weekHtml += `
        <div class="day-chip ${isCompleted ? 'completed' : ''} ${isToday ? 'active' : ''}">
          <span class="day-name">${day}</span>
          <span class="day-num">${10 + idx}</span>
          <span class="day-status"></span>
        </div>
      `;
    });

    const categories = [
      { id: 'discipline', name: 'Discipline & Mindset', icon: '⚔️' },
      { id: 'physical', name: 'Physical Strength & Vitality', icon: '🏋️' },
      { id: 'mental', name: 'Deep Work & Knowledge', icon: '🧠' },
      { id: 'social', name: 'Social Dominance & Ambition', icon: '🐺' }
    ];

    let questsHtml = '';
    categories.forEach((cat) => {
      const catQuests = this.state.quests.filter(q => q.category === cat.id);
      if (catQuests.length > 0) {
        questsHtml += `
          <div class="quest-category-header">
            <span class="quest-category-title">${cat.icon} ${cat.name}</span>
            <span style="font-size: 11px; color: var(--text-dim); font-weight: 700;">
              ${catQuests.filter(q => q.completed).length}/${catQuests.length}
            </span>
          </div>
        `;

        catQuests.forEach((q) => {
          questsHtml += `
            <div class="quest-item ${q.completed ? 'completed' : ''}" data-id="${q.id}">
              <div class="quest-check">✓</div>
              <div class="quest-icon">${q.icon}</div>
              <div class="quest-info">
                <div class="quest-title">${q.title}</div>
                <div class="quest-desc">${q.desc}</div>
              </div>
              <div class="quest-rewards">
                <span class="quest-xp-badge">+${q.xp} XP</span>
                <span class="quest-gems-badge">+${q.gems} 💎</span>
              </div>
            </div>
          `;
        });
      }
    });

    return `
      <div class="week-strip">
        ${weekHtml}
      </div>

      <div class="card" style="padding: 14px 16px; margin-bottom: 16px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(14, 16, 23, 0.9)); border-color: rgba(245, 158, 11, 0.25);">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--accent-gold); text-transform: uppercase;">
              DAILY FOCUS • 66-DAY PROTOCOL
            </div>
            <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-top: 2px;">
              Win the morning. Execute relentlessly.
            </div>
          </div>
          <button id="btnAddCustomQuest" style="background: rgba(255, 255, 255, 0.08); border: 1px solid var(--border-subtle); color: #FFF; width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            +
          </button>
        </div>
      </div>

      <div id="questListContainer">
        ${questsHtml}
      </div>
    `;
  }

  /* --- Tab 2: RPG Stats & Hexagonal Radar --- */
  renderRadarTab() {
    return `
      <div class="onboarding-header" style="margin-top: 10px;">
        <span class="onboarding-badge">RPG ATTRIBUTE MATRIX</span>
        <h2 class="onboarding-title">Discipline Breakdown</h2>
        <p class="onboarding-subtitle">Your real-world capabilities rendered as living RPG attributes.</p>
      </div>

      <div class="card highlight" style="padding: 16px 8px; margin-bottom: 20px;">
        <div class="radar-canvas-container">
          <canvas id="radarCanvas" width="320" height="320"></canvas>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px;">
        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-gold);">PHYSICAL (PHY)</div>
          <div style="font-size: 24px; font-weight: 900; color: #FFF; font-family: var(--font-display);">${this.state.stats.physical}/100</div>
          <div style="font-size: 11px; color: var(--text-dim);">Tier: Ascendant Vanguard</div>
        </div>

        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-emerald);">DISCIPLINE (DIS)</div>
          <div style="font-size: 24px; font-weight: 900; color: #FFF; font-family: var(--font-display);">${this.state.stats.discipline}/100</div>
          <div style="font-size: 11px; color: var(--text-dim);">Tier: Iron Fortress</div>
        </div>

        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-cyan);">MENTAL & FOCUS</div>
          <div style="font-size: 24px; font-weight: 900; color: #FFF; font-family: var(--font-display);">${this.state.stats.mental}/100</div>
          <div style="font-size: 11px; color: var(--text-dim);">Tier: Zero Latency</div>
        </div>

        <div class="card" style="margin: 0; padding: 14px;">
          <div style="font-size: 11px; font-weight: 800; color: var(--accent-purple);">SOCIAL & AMBITION</div>
          <div style="font-size: 24px; font-weight: 900; color: #FFF; font-family: var(--font-display);">${this.state.stats.social}/100</div>
          <div style="font-size: 11px; color: var(--text-dim);">Tier: Pack Commander</div>
        </div>
      </div>

      <div class="card" style="border-color: rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(14, 16, 23, 0.9));">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; font-weight: 800; color: var(--accent-emerald);">LIFETIME TIME RECLAIMED</div>
            <div style="font-size: 24px; font-weight: 900; color: #FFF; font-family: var(--font-display);">
              +${this.state.user.hoursSaved} HOURS SAVED
            </div>
            <div style="font-size: 11px; color: var(--text-dim); margin-top: 2px;">
              Converted from passive screen consumption to productive output.
            </div>
          </div>
          <div style="font-size: 32px;">🛡️</div>
        </div>
      </div>
    `;
  }

  initRadarChart() {
    const canvas = document.getElementById('radarCanvas');
    if (!canvas) return;
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;
    this.radarChart = new HexRadarChart(canvas, {
      themeColor: arch.themeColor
    });
    this.radarChart.updateStats(this.state.stats, true);
  }

  /* --- Tab 3: Character Evolution --- */
  renderEvolutionTab() {
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;

    let tiersHtml = '';
    arch.tiers.forEach((t) => {
      const isReached = this.state.user.level >= t.level;
      tiersHtml += `
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 14px; opacity: ${isReached ? '1' : '0.45'};">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: ${isReached ? 'var(--current-theme)' : '#222'}; color: #000; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; box-shadow: ${isReached ? '0 0 10px var(--current-glow)' : 'none'};">
            ${isReached ? '✓' : t.level}
          </div>
          <div style="flex: 1;">
            <div style="font-size: 14px; font-weight: 800; color: #FFF;">LVL ${t.level} • ${t.title}</div>
            <div style="font-size: 11px; color: var(--text-dim);">${t.desc}</div>
          </div>
        </div>
      `;
    });

    let switcherHtml = '';
    Object.values(ARCHETYPES).forEach((a) => {
      const isSel = a.id === arch.id;
      switcherHtml += `
        <button class="btn-archetype-switch ${isSel ? 'active' : ''}" data-id="${a.id}" style="background: ${isSel ? 'var(--bg-card)' : 'transparent'}; border: 1.5px solid ${isSel ? a.themeColor : 'var(--border-subtle)'}; color: #FFF; padding: 6px 12px; border-radius: 12px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          ${a.name.split(' ')[1] || a.name}
        </button>
      `;
    });

    return `
      <div class="onboarding-header" style="margin-top: 10px;">
        <span class="onboarding-badge">${arch.badge}</span>
        <h2 class="onboarding-title">${arch.name}</h2>
        <p class="onboarding-subtitle">${arch.subtitle}</p>
      </div>

      <div class="card highlight" style="text-align: center; padding: 26px 16px; margin-bottom: 20px;">
        <div style="margin-bottom: 16px; filter: drop-shadow(0 0 20px var(--current-glow));">
          ${arch.svg(130)}
        </div>
        <div style="font-size: 18px; font-weight: 900; color: #FFF;">
          ${this.state.user.name} • ${this.state.user.rankTitle}
        </div>
        <div style="font-size: 12px; font-style: italic; color: var(--text-muted); margin-top: 4px;">
          ${arch.quote}
        </div>
      </div>

      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 14px; margin-bottom: 16px; scrollbar-width: none;">
        ${switcherHtml}
      </div>

      <div class="card">
        <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--accent-gold); letter-spacing: 1px; margin-bottom: 16px;">
          TIER EVOLUTION LADDER
        </div>
        ${tiersHtml}
      </div>
    `;
  }

  /* --- Tab 4: Clan Arena / Live Feed --- */
  renderArenaTab() {
    let feedHtml = '';
    COMMUNITY_TICKER_ITEMS.forEach((item) => {
      feedHtml += `
        <div class="card" style="padding: 12px 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="font-size: 20px;">${item.avatar}</div>
            <div>
              <div style="font-size: 13px; font-weight: 800; color: #FFF;">
                ${item.user} <span style="font-weight: 500; color: var(--text-muted); font-size: 12px;">${item.action}</span>
              </div>
              <div style="font-size: 10px; color: var(--text-dim);">${item.time}</div>
            </div>
          </div>
          <span class="quest-xp-badge">${item.xp}</span>
        </div>
      `;
    });

    const quote = MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];

    return `
      <div class="onboarding-header" style="margin-top: 10px;">
        <span class="onboarding-badge">THE PACK ARENA</span>
        <h2 class="onboarding-title">Global Activity</h2>
        <p class="onboarding-subtitle">142,850+ warriors grinding discipline simultaneously.</p>
      </div>

      <div class="card highlight" style="margin-bottom: 18px; padding: 18px; background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(14, 16, 23, 0.9));">
        <div style="font-size: 10px; font-weight: 800; color: var(--accent-gold); letter-spacing: 1px; margin-bottom: 6px;">
          WARRIOR MANIFESTO
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #FFF; line-height: 1.45; font-style: italic;">
          "${quote.text}"
        </div>
        <div style="font-size: 11px; color: var(--text-dim); font-weight: 700; margin-top: 8px;">
          — ${quote.author}
        </div>
      </div>

      <div style="font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--text-muted); letter-spacing: 1px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
        <span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 6px #10B981;"></span>
        REAL-TIME SQUAD ACHIEVEMENTS
      </div>

      <div id="arenaFeedContainer">
        ${feedHtml}
      </div>
    `;
  }

  /* --- Tab 5: Deep Work Focus Timer --- */
  renderTimerTab() {
    const min = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const sec = (this.timerSeconds % 60).toString().padStart(2, '0');
    const progress = (this.timerSeconds / this.timerTotalSeconds) * 100;

    return `
      <div class="onboarding-header" style="margin-top: 10px; text-align: center;">
        <span class="onboarding-badge">DEEP WORK ENGINE</span>
        <h2 class="onboarding-title">Voluntary Discomfort</h2>
        <p class="onboarding-subtitle">Zero distractions. Absolute flow state.</p>
      </div>

      <div class="timer-display">
        <div class="timer-circle-wrapper">
          <svg width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r="95" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="8"/>
            <circle id="timerProgressCircle" cx="110" cy="110" r="95" fill="none" stroke="var(--current-theme)" stroke-width="8" 
                    stroke-dasharray="597" stroke-dashoffset="${597 - (597 * progress) / 100}" stroke-linecap="round"
                    style="transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.5s linear;"/>
          </svg>
          <div style="position: absolute; display: flex; flex-direction: column; align-items: center;">
            <div id="timerDisplayNumber" class="timer-time-text">${min}:${sec}</div>
            <div style="font-size: 11px; font-weight: 800; color: var(--text-dim); letter-spacing: 1px;">
              ${this.timerRunning ? 'IN THE ZONE' : 'READY TO FOCUS'}
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 24px;">
        <button class="btn-timer-preset ${this.timerTotalSeconds === 25 * 60 ? 'active' : ''}" data-mins="25" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); color: #FFF; padding: 6px 14px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer;">25 MIN</button>
        <button class="btn-timer-preset ${this.timerTotalSeconds === 45 * 60 ? 'active' : ''}" data-mins="45" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); color: #FFF; padding: 6px 14px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer;">45 MIN</button>
        <button class="btn-timer-preset ${this.timerTotalSeconds === 60 * 60 ? 'active' : ''}" data-mins="60" style="background: var(--bg-surface); border: 1px solid var(--border-subtle); color: #FFF; padding: 6px 14px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer;">60 MIN</button>
      </div>

      <div class="card" style="padding: 14px; margin-bottom: 20px;">
        <div style="font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 0.5px;">
          PROCEDURAL AMBIENT SOUNDSCAPES (OFFLINE SYNTH)
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-ambient ${audio.ambientType === 'rain' ? 'active' : ''}" data-type="rain" style="flex: 1; background: var(--bg-card); border: 1px solid var(--border-subtle); color: #FFF; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">🌧️ Rainstorm</button>
          <button class="btn-ambient ${audio.ambientType === 'drone' ? 'active' : ''}" data-type="drone" style="flex: 1; background: var(--bg-card); border: 1px solid var(--border-subtle); color: #FFF; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">🔮 Cyber Synth</button>
          <button class="btn-ambient ${audio.ambientType === 'alpha' ? 'active' : ''}" data-type="alpha" style="flex: 1; background: var(--bg-card); border: 1px solid var(--border-subtle); color: #FFF; padding: 8px; border-radius: 10px; font-size: 11px; font-weight: 700; cursor: pointer;">🧠 Alpha Wave</button>
        </div>
      </div>

      <div style="display: flex; gap: 12px;">
        <button id="btnToggleTimer" class="btn-primary" style="flex: 2;">
          ${this.timerRunning ? 'PAUSE SESSION' : 'START FOCUS BLOCK'}
        </button>
        <button id="btnResetTimer" class="btn-secondary" style="flex: 1;">
          RESET
        </button>
      </div>
    `;
  }

  /* --- Tab 6: Settings & GitHub Sync & Inactivity Simulation --- */
  renderSettingsTab() {
    const gistUrl = `https://gist.github.com/github4Wsourav/${this.state.github.gistId || DEFAULT_GIST_ID}`;

    return `
      <div class="onboarding-header" style="margin-top: 10px;">
        <span class="onboarding-badge">SYSTEM PREFERENCES</span>
        <h2 class="onboarding-title">Settings & Cloud Save</h2>
        <p class="onboarding-subtitle">Configure audio, GitHub cloud sync, and testing tools.</p>
      </div>

      <!-- GitHub Cloud Sync Card -->
      <div class="card highlight" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-size: 14px; font-weight: 800; color: #FFF;">🐙 GitHub Cloud Save</div>
          <span style="font-size: 10px; font-weight: 800; color: var(--accent-purple); background: rgba(168, 85, 247, 0.15); padding: 3px 8px; border-radius: 10px;">
            ONLINE SYNC
          </span>
        </div>
        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px;">
          Your progress is stored in a dedicated GitHub Gist. You can open and sync this app across your phone and PC.
        </p>

        <div style="background: rgba(255, 255, 255, 0.04); border-radius: 10px; padding: 10px; margin-bottom: 12px; font-size: 11px;">
          <div style="color: var(--text-dim); margin-bottom: 4px;">ACTIVE GIST ID:</div>
          <a href="${gistUrl}" target="_blank" style="color: var(--accent-gold); word-break: break-all; text-decoration: none;">
            ${this.state.github.gistId || DEFAULT_GIST_ID} ↗
          </a>
        </div>

        <div style="display: flex; gap: 8px;">
          <button id="btnSyncToGitHub" class="btn-primary" style="flex: 1; padding: 12px; font-size: 12px;">
            SAVE TO GITHUB
          </button>
          <button id="btnPullFromGitHub" class="btn-secondary" style="flex: 1; padding: 12px; font-size: 12px;">
            PULL FROM GITHUB
          </button>
        </div>
      </div>

      <!-- Inactivity Lock Test Simulator -->
      <div class="card" style="margin-bottom: 16px; border-color: rgba(239, 68, 68, 0.3);">
        <div style="font-size: 14px; font-weight: 800; color: var(--accent-crimson); margin-bottom: 4px;">
          ⚠️ Inactivity Lock Simulator
        </div>
        <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 12px; line-height: 1.4;">
          Test the 2-day inactivity lock and UPI penalty screen without having to wait 48 hours:
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="btnSimulate2Days" class="btn-secondary" style="flex: 1; font-size: 11px; padding: 10px; color: var(--accent-crimson); border-color: rgba(239, 68, 68, 0.4);">
            SIMULATE 2 DAYS (₹10)
          </button>
          <button id="btnSimulate4Days" class="btn-secondary" style="flex: 1; font-size: 11px; padding: 10px; color: var(--accent-orange); border-color: rgba(249, 115, 22, 0.4);">
            SIMULATE 4 DAYS (₹20)
          </button>
        </div>
      </div>

      <!-- Audio Settings -->
      <div class="card" style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #FFF;">Audio Sound FX</div>
            <div style="font-size: 11px; color: var(--text-dim);">Mechanical clicks, quest chimes, fanfares</div>
          </div>
          <button id="btnSettingSound" class="btn-secondary" style="width: auto; padding: 6px 14px;">
            ${this.state.soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 14px; font-weight: 800; color: #FFF;">Haptic Pulses</div>
            <div style="font-size: 11px; color: var(--text-dim);">Subtle tactile feel on mobile devices</div>
          </div>
          <button id="btnSettingHaptics" class="btn-secondary" style="width: auto; padding: 6px 14px;">
            ${this.state.hapticsEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      </div>

      <!-- Retake Onboarding -->
      <div class="card" style="margin-bottom: 16px;">
        <div style="font-size: 14px; font-weight: 800; color: #FFF; margin-bottom: 4px;">Retake Diagnostic Onboarding</div>
        <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 14px; line-height: 1.4;">
          Experience the complete 18-step onboarding and loss aversion breakdown again:
        </div>
        <button id="btnRetakeOnboarding" class="btn-secondary" style="color: var(--accent-gold); border-color: rgba(245, 158, 11, 0.3);">
          RESTART ONBOARDING FLOW
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="card" style="border-color: rgba(239, 68, 68, 0.3);">
        <div style="font-size: 14px; font-weight: 800; color: var(--accent-crimson); margin-bottom: 4px;">Danger Zone</div>
        <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 14px;">
          Reset all accumulated XP, gems, and daily quest logs.
        </div>
        <button id="btnResetAllData" class="btn-secondary" style="color: var(--accent-crimson); border-color: rgba(239, 68, 68, 0.4);">
          RESET ALL LOCAL DATA
        </button>
      </div>
    `;
  }

  /* --- Dashboard Event Binding --- */
  bindDashboardEvents() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab && tab !== this.currentTab) {
          audio.playClick();
          this.currentTab = tab;
          this.renderDashboard();
        }
      });
    });

    const soundBtn = document.getElementById('btnSoundToggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const active = audio.toggleSound();
        this.state.soundEnabled = active;
        soundBtn.classList.toggle('active', active);
        audio.playClick();
        saveAppState(this.state);
      });
    }

    const questItems = document.querySelectorAll('.quest-item');
    questItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const questId = item.getAttribute('data-id');
        this.toggleQuest(questId, e);
      });
    });

    const addQuestBtn = document.getElementById('btnAddCustomQuest');
    if (addQuestBtn) {
      addQuestBtn.addEventListener('click', () => {
        audio.playClick();
        this.showAddQuestModal();
      });
    }

    const archSwitchBtns = document.querySelectorAll('.btn-archetype-switch');
    archSwitchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (id) {
          audio.playClick();
          this.state.selectedArchetype = id;
          this.applyThemeColors();
          saveAppState(this.state);
          this.syncStateToGitHub();
          this.renderDashboard();
        }
      });
    });

    // GitHub Cloud Sync Buttons
    const syncBtn = document.getElementById('btnSyncToGitHub');
    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        audio.playClick();
        syncBtn.innerText = 'SYNCING...';
        await this.syncStateToGitHub(true);
        syncBtn.innerText = 'SAVED TO GITHUB! ✓';
        setTimeout(() => { syncBtn.innerText = 'SAVE TO GITHUB'; }, 2000);
      });
    }

    const pullBtn = document.getElementById('btnPullFromGitHub');
    if (pullBtn) {
      pullBtn.addEventListener('click', async () => {
        audio.playClick();
        pullBtn.innerText = 'FETCHING...';
        const res = await fetchFromGitHubGist(this.state.github.gistId || DEFAULT_GIST_ID);
        if (res.ok && res.state) {
          audio.playSuccess();
          this.state.user = res.state.user || this.state.user;
          this.state.stats = res.state.stats || this.state.stats;
          this.state.selectedArchetype = res.state.selectedArchetype || this.state.selectedArchetype;
          this.state.lastActiveDate = res.state.lastActiveDate || this.state.lastActiveDate;
          saveAppState(this.state);
          pullBtn.innerText = 'PULLED SUCCESS! ✓';
          setTimeout(() => { this.renderDashboard(); }, 1000);
        } else {
          alert('Could not fetch from GitHub: ' + (res.error || 'Unknown error'));
          pullBtn.innerText = 'PULL FROM GITHUB';
        }
      });
    }

    // Inactivity Simulator buttons
    const sim2Btn = document.getElementById('btnSimulate2Days');
    if (sim2Btn) {
      sim2Btn.addEventListener('click', () => {
        audio.playClick();
        // Set lastActiveDate to 2.5 days ago
        const past = new Date(Date.now() - (2.5 * 24 * 60 * 60 * 1000)).toISOString();
        this.state.lastActiveDate = past;
        this.state.isLocked = true;
        this.state.penaltyDue = 10;
        this.state.missedDays = 2;
        saveAppState(this.state);
        this.renderLockdownScreen();
      });
    }

    const sim4Btn = document.getElementById('btnSimulate4Days');
    if (sim4Btn) {
      sim4Btn.addEventListener('click', () => {
        audio.playClick();
        // Set lastActiveDate to 4.5 days ago
        const past = new Date(Date.now() - (4.5 * 24 * 60 * 60 * 1000)).toISOString();
        this.state.lastActiveDate = past;
        this.state.isLocked = true;
        this.state.penaltyDue = 20;
        this.state.missedDays = 4;
        saveAppState(this.state);
        this.renderLockdownScreen();
      });
    }

    // Timer controls
    const toggleTimerBtn = document.getElementById('btnToggleTimer');
    const resetTimerBtn = document.getElementById('btnResetTimer');
    const presetBtns = document.querySelectorAll('.btn-timer-preset');
    const ambientBtns = document.querySelectorAll('.btn-ambient');

    if (toggleTimerBtn) {
      toggleTimerBtn.addEventListener('click', () => {
        audio.playClick();
        this.toggleTimer();
      });
    }

    if (resetTimerBtn) {
      resetTimerBtn.addEventListener('click', () => {
        audio.playClick();
        this.resetTimer();
      });
    }

    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mins = parseInt(btn.getAttribute('data-mins'), 10);
        audio.playClick();
        this.setTimerPreset(mins);
      });
    });

    ambientBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        audio.playClick();
        if (audio.ambientType === type) {
          audio.stopAmbient();
        } else {
          audio.startAmbient(type);
        }
        this.renderDashboard();
      });
    });

    // Settings actions
    const soundSetting = document.getElementById('btnSettingSound');
    if (soundSetting) {
      soundSetting.addEventListener('click', () => {
        const active = audio.toggleSound();
        this.state.soundEnabled = active;
        saveAppState(this.state);
        this.renderDashboard();
      });
    }

    const retakeBtn = document.getElementById('btnRetakeOnboarding');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        audio.playClick();
        this.state.onboardingCompleted = false;
        this.onboardingStep = 0;
        saveAppState(this.state);
        this.renderOnboarding();
      });
    }

    const resetDataBtn = document.getElementById('btnResetAllData');
    if (resetDataBtn) {
      resetDataBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all local progress?')) {
          localStorage.clear();
          location.reload();
        }
      });
    }
  }

  // Toggle Quest Completion
  toggleQuest(questId, event) {
    const quest = this.state.quests.find(q => q.id === questId);
    if (!quest) return;

    quest.completed = !quest.completed;

    if (quest.completed) {
      audio.playSuccess();
      this.state.user.xp += quest.xp;
      this.state.user.gems += quest.gems;
      this.state.user.completedTotal++;
      this.state.user.hoursSaved = parseFloat((this.state.user.hoursSaved + 0.5).toFixed(1));
      this.state.lastActiveDate = new Date().toISOString(); // Update activity stamp!

      if (quest.stat && this.state.stats[quest.stat]) {
        this.state.stats[quest.stat] = Math.min(100, this.state.stats[quest.stat] + 2);
      }

      if (this.state.user.xp >= this.state.user.xpToNextLevel) {
        this.triggerLevelUp();
      }

      this.spawnFloatingXp(`+${quest.xp} XP`, event.clientX, event.clientY);
    } else {
      audio.playClick();
      this.state.user.xp = Math.max(0, this.state.user.xp - quest.xp);
      this.state.user.gems = Math.max(0, this.state.user.gems - quest.gems);
    }

    saveAppState(this.state);
    this.syncStateToGitHub();
    this.updateHeaderUI();
    this.renderDashboard();
  }

  async syncStateToGitHub(showAlert = false) {
    const gistId = this.state.github.gistId || DEFAULT_GIST_ID;
    const res = await syncToGitHubGist(gistId, this.state.github.token, this.state);
    if (res.ok) {
      this.state.github.lastSyncedAt = new Date().toISOString();
      saveAppState(this.state);
      if (showAlert) audio.playReward();
    }
  }

  triggerLevelUp() {
    this.state.user.level++;
    this.state.user.xp = this.state.user.xp - this.state.user.xpToNextLevel;
    this.state.user.xpToNextLevel = Math.round(this.state.user.xpToNextLevel * 1.3);

    const ranks = ['Stray Novice', 'Scout Initiate', 'Awakened Fighter', 'Ascendant II', 'Shadow Blade', 'Apex Beast', 'Divine Sovereign'];
    const rIdx = Math.min(ranks.length - 1, this.state.user.level - 1);
    this.state.user.rankTitle = ranks[rIdx];

    audio.playLevelUp();
    this.showLevelUpModal();
  }

  showLevelUpModal() {
    const arch = ARCHETYPES[this.state.selectedArchetype] || ARCHETYPES.wolf;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 11px; font-weight: 900; color: var(--accent-gold); letter-spacing: 1px; margin-bottom: 8px;">
          CONGRATULATIONS WARRIOR
        </div>
        <div style="margin-bottom: 16px; filter: drop-shadow(0 0 20px var(--current-glow));">
          ${arch.svg(110)}
        </div>
        <h2 style="font-family: var(--font-display); font-size: 32px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
          LEVEL ${this.state.user.level} UNLOCKED!
        </h2>
        <div style="font-size: 14px; font-weight: 800; color: var(--current-theme); margin-bottom: 16px;">
          ${this.state.user.rankTitle}
        </div>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.45; margin-bottom: 24px;">
          Your consistency is compounding. Physical and mental attributes surged forward.
        </p>
        <button id="btnCloseLevelUpModal" class="btn-primary">
          CLAIM LEVEL REWARDS & CONTINUE
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btnCloseLevelUpModal').addEventListener('click', () => {
      audio.playClick();
      modal.remove();
    });
  }

  showAddQuestModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="text-align: left;">
        <h3 style="font-size: 18px; font-weight: 800; color: #FFF; margin-bottom: 14px;">
          ⚔️ Add Custom Challenge
        </h3>
        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;">
          CHALLENGE TITLE
        </label>
        <input id="inputQuestTitle" type="text" placeholder="e.g. 100 Squats or Read 20 Pages" 
               style="width: 100%; background: #181C26; border: 1px solid var(--border-subtle); color: #FFF; padding: 12px; border-radius: 12px; margin-bottom: 14px; font-family: inherit;">
        
        <label style="font-size: 11px; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 6px;">
          ATTRIBUTE CATEGORY
        </label>
        <select id="selectQuestCat" style="width: 100%; background: #181C26; border: 1px solid var(--border-subtle); color: #FFF; padding: 12px; border-radius: 12px; margin-bottom: 20px; font-family: inherit;">
          <option value="physical">🏋️ Physical Strength</option>
          <option value="discipline">⚔️ Discipline & Willpower</option>
          <option value="mental">🧠 Mental Focus</option>
          <option value="social">🐺 Social & Ambition</option>
        </select>

        <div style="display: flex; gap: 10px;">
          <button id="btnSaveCustomQuest" class="btn-primary" style="flex: 2;">ADD QUEST</button>
          <button id="btnCancelCustomQuest" class="btn-secondary" style="flex: 1;">CANCEL</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('btnCancelCustomQuest').addEventListener('click', () => modal.remove());
    document.getElementById('btnSaveCustomQuest').addEventListener('click', () => {
      const title = document.getElementById('inputQuestTitle').value.trim();
      const cat = document.getElementById('selectQuestCat').value;
      if (title) {
        audio.playClick();
        this.state.quests.unshift({
          id: 'custom_' + Date.now(),
          category: cat,
          title: title,
          desc: 'Custom warrior challenge.',
          xp: 60,
          gems: 10,
          icon: cat === 'physical' ? '🏋️' : cat === 'discipline' ? '⚔️' : cat === 'mental' ? '🧠' : '🐺',
          stat: cat,
          completed: false
        });
        saveAppState(this.state);
        this.syncStateToGitHub();
        modal.remove();
        this.renderDashboard();
      }
    });
  }

  spawnFloatingXp(text, x, y) {
    const el = document.createElement('div');
    el.className = 'floating-xp';
    el.innerText = text;
    el.style.left = `${x || window.innerWidth / 2}px`;
    el.style.top = `${y || window.innerHeight / 2}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  toggleTimer() {
    if (this.timerRunning) {
      clearInterval(this.timerInterval);
      this.timerRunning = false;
      audio.stopAmbient();
    } else {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.timerSeconds > 0) {
          this.timerSeconds--;
          this.updateTimerDisplay();
        } else {
          clearInterval(this.timerInterval);
          this.timerRunning = false;
          audio.playLevelUp();
          alert('Focus Session Completed! +100 XP Earned.');
          this.state.user.xp += 100;
          this.state.lastActiveDate = new Date().toISOString();
          saveAppState(this.state);
          this.syncStateToGitHub();
          this.updateHeaderUI();
        }
      }, 1000);
    }
    this.renderDashboard();
  }

  resetTimer() {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
    this.timerSeconds = this.timerTotalSeconds;
    audio.stopAmbient();
    this.renderDashboard();
  }

  setTimerPreset(mins) {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
    this.timerTotalSeconds = mins * 60;
    this.timerSeconds = mins * 60;
    this.renderDashboard();
  }

  updateTimerDisplay() {
    const min = Math.floor(this.timerSeconds / 60).toString().padStart(2, '0');
    const sec = (this.timerSeconds % 60).toString().padStart(2, '0');
    const numEl = document.getElementById('timerDisplayNumber');
    const circle = document.getElementById('timerProgressCircle');

    if (numEl) numEl.innerText = `${min}:${sec}`;
    if (circle) {
      const progress = (this.timerSeconds / this.timerTotalSeconds) * 100;
      circle.style.strokeDashoffset = `${597 - (597 * progress) / 100}`;
    }
  }

  startCommunityTicker() {
    setInterval(() => {
      const sampleNames = ['Lucas H.', 'Brandon T.', 'Ethan W.', 'Siddharth M.', 'Nikolai B.', 'Gabriel S.'];
      const sampleActions = ['conquered Cold Shower', 'completed 100 Pushups', 'finished 45m Deep Work', 'hit 14-Day Streak 🔥', 'read 20 pages'];
      const icons = ['🐺', '⚔️', '🛡️', '⚡', '🔮'];

      const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];

      COMMUNITY_TICKER_ITEMS.unshift({
        user: randomName,
        action: randomAction,
        time: 'Just now',
        xp: '+50 XP',
        avatar: randomIcon
      });

      if (COMMUNITY_TICKER_ITEMS.length > 8) COMMUNITY_TICKER_ITEMS.pop();

      if (this.currentTab === 'arena') {
        const container = document.getElementById('arenaFeedContainer');
        if (container) {
          this.renderDashboard();
        }
      }
    }, 18000);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.dawgApp = new DawgApp();
});
