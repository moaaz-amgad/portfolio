// ==========================================================================
// MOAAZ AMGAD — PORTFOLIO CORE SCRIPT
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initTechCanvas();
  initNavbar();
  initRoleTypist();
  initMobileMenu();
  initPortraitParallax();
  initSkillsFilter();
  initWelcomeIntro();
});

// 1. Navbar Scroll Effect & Active Link Highlight
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Scrolled state
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // ScrollSpy Active Section
    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    if (currentSection) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// 2. Animated Dynamic Role Typist Effect
function initRoleTypist() {
  const typistEl = document.getElementById('roleTypist');
  if (!typistEl) return;

  const roles = [
    'Building Scalable Backend Architectures',
    'Crafting High-Performance Full-Stack Apps',
    'Integrating AI into Web Applications',
    'Engineering Enterprise-Grade Systems',
    'Designing Responsive & Intuitive User Experiences',
    'Developing Production-Grade REST & GraphQL APIs'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typistEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typistEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// 3. Mobile Drawer Menu Toggle
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const links = drawer?.querySelectorAll('a');

  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const isHidden = drawer.classList.contains('hidden');
    if (isHidden) {
      drawer.classList.remove('hidden');
      btn.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
    } else {
      drawer.classList.add('hidden');
      btn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
    }
  });

  links?.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.add('hidden');
      btn.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
    });
  });
}

// 4. Custom Interactive Cursor (Smooth Lerp + Hover Expand)
function initCustomCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot = document.getElementById('cursor-dot');

  // Disable on touch devices
  if (!ring || !dot || !window.matchMedia('(pointer: fine)').matches) {
    if (ring) ring.style.display = 'none';
    if (dot) dot.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovering = false;
  let isClicking = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Snap dot directly to cursor coordinates (centered via CSS negative margins)
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ring.classList.remove('custom-cursor-hidden');
    dot.classList.remove('custom-cursor-hidden');
  });

  window.addEventListener('mousedown', () => {
    ring.classList.add('cursor-click');
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-click');
  });

  document.addEventListener('mouseleave', () => {
    ring.classList.add('custom-cursor-hidden');
    dot.classList.add('custom-cursor-hidden');
  });

  // Hover detection on interactive elements
  const interactiveSelectors = 'a, button, input, textarea, select, [role="button"], .project-card, .contact-channel-card, .skill-pill, .about-feature-card, .logo-box, .project-showcase-card, .project-modal-close';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
    }
  });

  // Silky 60fps Lerp animation loop for the outer follower ring
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }

  requestAnimationFrame(renderCursor);
}

// 5. Interactive Particle & Tech Mesh Canvas
function initTechCanvas() {
  const canvas = document.getElementById('techCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  let particles = [];
  const particleCount = Math.min(Math.floor(width / 22), 65);
  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// 6. Subtle 3D Parallax on Portrait
function initPortraitParallax() {
  const stage = document.querySelector('.hero-portrait-stage');
  const portrait = document.querySelector('.hero-portrait-seamless');

  if (!stage || !portrait) return;

  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / rect.height) * -6;
    const rotY = (x / rect.width) * 6;

    portrait.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });

  stage.addEventListener('mouseleave', () => {
    portrait.style.transform = '';
  });
}

// 7. Top Scroll Progress Indicator Bar
function initScrollProgress() {
  const bar = document.getElementById('scrollProgressBar');
  if (!bar) return;

  function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      bar.style.width = '0%';
      return;
    }
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}

// ==========================================================================
// 8. PROJECT DETAIL MODAL SYSTEM
// ==========================================================================

const PROJECT_DATA = {
  trovo: {
    image: './assets/trovo_concept.jpg',
    badge: '<i class="fa-solid fa-brain"></i> AI & Behavioral Platform',
    title: 'Trovo',
    subtitle: 'AI-powered digital wellness platform — detects dopamine addiction & cognitive fatigue through behavioral telemetry and gamified neuro-tests.',
    problem: 'Excessive short-form media consumption is causing measurable cognitive decline in young users. Existing tools rely on simple screen-time limits without addressing neurological root causes.',
    role: 'Sole Backend Engineer: designed the full server-side architecture, RESTful API, MySQL database schema, authentication, and a Central Admin Dashboard for platform monitoring.',
    showTeamBanner: true,
    teamDesc: 'Engineered alongside Mobile (Flutter), AI/ML (XGBoost + Deep Learning), and UI/UX (Figma) specialists. Solely architected the complete backend API suite, database infrastructure, and admin dashboard.',
    highlights: [
      'Designed normalized MySQL schema for user profiles, behavioral tracking, and intervention logs',
      'Built RESTful API endpoints with consistent JSON response contracts for the Flutter client',
      'Implemented token-based authentication and session management',
      'Developed Central Admin Dashboard for analytics, user moderation, and content governance',
      'Integrated intervention scheduling engine based on behavioral trigger thresholds',
      'Clean MVC architecture with service-layer abstraction'
    ],
    techStack: ['Laravel', 'MySQL', 'REST API', 'Eloquent ORM', 'Admin Dashboard', 'Token Auth', 'Flutter (Team)', 'XGBoost AI (Team)', 'Figma UI/UX (Team)'],
    metrics: [
      { value: 'Full', label: 'Backend Architecture' },
      { value: 'REST', label: 'API Design' },
      { value: 'Admin', label: 'Dashboard Built' },
      { value: 'Team', label: 'Cross-Functional' }
    ],
    github: 'https://github.com/moaaz-amgad/trovo'
  },

  hr: {
    image: './assets/hr_concept.jpg',
    badge: '<i class="fa-solid fa-building"></i> Enterprise System',
    title: 'HR & Payroll System',
    subtitle: 'Multi-branch enterprise workforce management with automated payroll, running balance ledger, and financial reporting.',
    problem: 'Manual payroll across multiple branches caused calculation errors, delayed salaries, and zero audit visibility. HR teams relied on spreadsheets with no centralized governance.',
    role: 'Lead Full-Stack Engineer: end-to-end system architecture, database design, Laravel API, React 18 SPA, ledger engine, RBAC, and automated payroll pipeline.',
    showTeamBanner: false,
    highlights: [
      'Multi-branch database schema with tenant-aware data isolation',
      'Running balance ledger engine with double-entry accounting precision',
      'Automated payroll pipeline with tax calculation and overtime rules',
      'Granular RBAC with branch-level permission scoping',
      'React 18 + TypeScript SPA with Ant Design RTL support',
      'Bilingual Arabic/English interface with full RTL layout'
    ],
    techStack: ['Laravel 12', 'React 18', 'TypeScript', 'Ant Design', 'TailwindCSS', 'MySQL', 'Vite', 'REST API', 'RBAC', 'RTL / Arabic'],
    metrics: [
      { value: 'Multi', label: 'Branch Support' },
      { value: 'Auto', label: 'Payroll Engine' },
      { value: 'RBAC', label: 'Access Control' },
      { value: 'RTL', label: 'Bilingual UI' }
    ],
    github: 'https://github.com/moaaz-amgad/hr-payroll-system'
  },

  clinic: {
    image: './assets/clinic_concept.jpg',
    badge: '<i class="fa-solid fa-stethoscope"></i> Healthcare EMR',
    title: 'Dermatology Clinic EMR',
    subtitle: 'Specialized EMR for dermatology clinics — skin typing, cosmetic session tracking, before/after galleries, and digital prescriptions.',
    problem: 'Dermatology clinics need domain-specific EMR with Fitzpatrick skin classification, cosmetic session counters, visual progression tracking, and specialized prescription templates.',
    role: 'Sole Full-Stack Developer: domain-specific database modeling, patient management, DomPDF prescription generation, and Bootstrap 5.3 RTL interface with Alpine.js.',
    showTeamBanner: false,
    highlights: [
      'Domain-specific schema for Fitzpatrick skin typing and treatment protocols',
      'Cosmetic session counter with automated package tracking',
      'Before/after image progression gallery with timestamped comparison',
      'Digital prescription system with DomPDF and clinic-branded templates',
      'Chart.js analytics for demographics, treatment trends, and revenue',
      'Fully responsive RTL interface with Bootstrap 5.3 and Alpine.js'
    ],
    techStack: ['Laravel 12', 'Bootstrap 5.3', 'Alpine.js', 'MySQL', 'DomPDF', 'Chart.js', 'Eloquent ORM', 'RTL / Arabic', 'Blade Components'],
    metrics: [
      { value: 'EMR', label: 'Medical Records' },
      { value: 'PDF', label: 'Rx Generation' },
      { value: 'Visual', label: 'Progression Gallery' },
      { value: 'Charts', label: 'Clinical Analytics' }
    ],
    github: 'https://github.com/moaaz-amgad/dermatology-clinic-emr'
  }
};

let savedScrollPosition = 0;

function openProjectModal(projectKey) {
  const data = PROJECT_DATA[projectKey];
  if (!data) return;

  // Save current scroll position before opening modal
  savedScrollPosition = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0;

  const modal = document.getElementById('projectModal');

  // Populate modal content
  document.getElementById('modalHeroImg').src = data.image;
  document.getElementById('modalHeroImg').alt = data.title;
  document.getElementById('modalBadge').innerHTML = data.badge;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalSubtitle').textContent = data.subtitle;
  document.getElementById('modalProblem').textContent = data.problem;
  document.getElementById('modalRole').textContent = data.role;

  // GitHub links (Header bar below image + Bottom footer bar)
  const githubBtn = document.getElementById('modalGithubBtn');
  if (githubBtn && data.github) {
    githubBtn.href = data.github;
  }
  const githubBtnBottom = document.getElementById('modalGithubBtnBottom');
  if (githubBtnBottom && data.github) {
    githubBtnBottom.href = data.github;
  }

  // Team banner visibility
  const teamBanner = document.getElementById('modalTeamBanner');
  if (teamBanner) {
    if (data.showTeamBanner) {
      teamBanner.removeAttribute('hidden');
      teamBanner.style.display = '';
      const teamDesc = document.getElementById('modalTeamDesc');
      if (teamDesc && data.teamDesc) {
        teamDesc.textContent = data.teamDesc;
      }
    } else {
      teamBanner.setAttribute('hidden', '');
      teamBanner.style.display = 'none';
    }
  }

  // Architecture highlights
  const highlightsList = document.getElementById('modalHighlights');
  highlightsList.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

  // Tech stack
  const techGrid = document.getElementById('modalTechStack');
  techGrid.innerHTML = data.techStack.map(t => `<span>${t}</span>`).join('');

  // Metrics
  const metricsRow = document.getElementById('modalMetrics');
  metricsRow.innerHTML = data.metrics.map(m =>
    `<div class="project-modal-metric-card">
      <span class="metric-value">${m.value}</span>
      <span class="metric-label">${m.label}</span>
    </div>`
  ).join('');

  // Show modal
  modal.classList.add('active');
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');

  // Reset scroll on the overlay container to top
  modal.scrollTop = 0;
}

function closeProjectModal(event) {
  // If called from overlay click, only close if the click target is the overlay itself
  if (event && event.target !== event.currentTarget) return;
  if (event) {
    event.preventDefault();
  }

  const modal = document.getElementById('projectModal');
  modal.classList.remove('active');
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');

  // Restore previous scroll position immediately
  window.scrollTo({
    top: savedScrollPosition,
    left: 0,
    behavior: 'instant'
  });
}

// Keyboard support: Escape key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('projectModal');
    if (modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  }
});

// ==========================================================================
// 9. INTERACTIVE SKILLS FILTERING SYSTEM
// ==========================================================================
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-tab-btn');
  const domainCards = document.querySelectorAll('.skill-domain-card');
  if (!filterBtns.length || !domainCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active tab button style
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const skillsGrid = document.getElementById('skillsGrid');
      if (skillsGrid) {
        if (filter === 'all') {
          skillsGrid.classList.remove('filtered-single');
        } else {
          skillsGrid.classList.add('filtered-single');
        }
      }

      // Filter domain cards
      domainCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('dimmed');
          card.classList.add('highlighted');
          card.style.display = 'flex';
          setTimeout(() => card.classList.remove('highlighted'), 700);
        } else {
          card.classList.add('dimmed');
          card.classList.remove('highlighted');
          card.style.display = 'none';
        }
      });
    });
  });
}

// 10. Interactive Terminal Boot Intro
function initWelcomeIntro() {
  const overlay = document.getElementById('welcomeOverlay');
  const terminalLines = document.getElementById('terminalLines');
  const terminalBody = document.getElementById('terminalBody');
  const inputLine = document.getElementById('terminalInputLine');
  const cursor = document.getElementById('terminalCursor');
  const skipBtn = document.getElementById('welcomeSkipBtn');

  if (!overlay || !terminalLines) return;

  let isDismissed = false;

  // --- Authentic Keyboard Audio Engine (Web Audio API Synthesized Mechanical Keypress) ---
  let audioCtx = null;
  let normalKeyBuffers = [];
  let spaceKeyBuffer = null;

  function initAudioEngine() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (!audioCtx) return null;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      // Pre-synthesize authentic physical keyboard keystrokes
      if (normalKeyBuffers.length === 0) {
        const sr = audioCtx.sampleRate || 44100;

        // Generate physical keystroke audio buffer
        function createKeyBuffer(pitchVar, isSpace = false) {
          const dur = isSpace ? 0.055 : 0.040; // 40ms normal key, 55ms spacebar
          const numSamples = Math.floor(sr * dur);
          const buffer = audioCtx.createBuffer(1, numSamples, sr);
          const data = buffer.getChannelData(0);
          let lastNoise = 0;

          for (let i = 0; i < numSamples; i++) {
            const t = i / sr;

            // 1. High transient contact tick (crisp plastic impact)
            const tickDecay = isSpace ? 0.0035 : 0.0025;
            const tick = (Math.random() * 2 - 1) * Math.exp(-t / tickDecay) * (isSpace ? 0.28 : 0.40);

            // 2. Switch resonant snap (tactile switch clack)
            const clickFreq = (isSpace ? 1400 : 2100) * pitchVar;
            const clickEnv = Math.exp(-t / 0.006) * (1 - Math.exp(-t / 0.0008));
            const click = Math.sin(2 * Math.PI * clickFreq * t) * clickEnv * (isSpace ? 0.25 : 0.34);

            // 3. Bottom-out mechanical thock (resonant keyboard casing / keycap impact)
            const startThock = (isSpace ? 180 : 270) * pitchVar;
            const endThock = (isSpace ? 65 : 90) * pitchVar;
            const thockDecay = isSpace ? 0.022 : 0.015;
            const thockFreq = (startThock - endThock) * Math.exp(-t / 0.014) + endThock;
            const thockEnv = Math.exp(-t / thockDecay);
            const thock = Math.sin(2 * Math.PI * thockFreq * t) * thockEnv * (isSpace ? 0.55 : 0.44);

            // 4. Mechanical friction texture (filtered tactile noise)
            const rawNoise = (Math.random() * 2 - 1);
            lastNoise = lastNoise + 0.32 * (rawNoise - lastNoise);
            const clack = lastNoise * Math.exp(-t / (isSpace ? 0.012 : 0.009)) * 0.28;

            let val = tick + click + thock + clack;
            if (val > 1) val = 1;
            if (val < -1) val = -1;
            data[i] = val;
          }
          return buffer;
        }

        // Generate 5 distinct pitch/resonance variations for natural typing
        const pitches = [0.93, 0.97, 1.0, 1.04, 1.08];
        normalKeyBuffers = pitches.map(p => createKeyBuffer(p, false));
        // Spacebar buffer (deeper, fuller hollow thock)
        spaceKeyBuffer = createKeyBuffer(0.92, true);
      }
    } catch (e) {
      // Audio engine init error, silently ignore
    }
    return audioCtx;
  }

  function unlockAudioEngine() {
    const ctx = initAudioEngine();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    try {
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  // Listen to user interactions to unlock immediately on the slightest movement
  const unlockEvents = [
    'pointerdown', 'mousedown', 'keydown', 'touchstart', 'touchend',
    'mousemove', 'pointermove', 'wheel', 'scroll', 'click', 'focus'
  ];
  unlockEvents.forEach(evt => {
    window.addEventListener(evt, unlockAudioEngine, { once: true, passive: true });
    document.addEventListener(evt, unlockAudioEngine, { once: true, passive: true });
  });

  // Play realistic keyboard keypress (letters vs spacebar)
  function playKeyClick(isSpace = false) {
    try {
      const ctx = initAudioEngine();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const buffer = isSpace
        ? spaceKeyBuffer
        : normalKeyBuffers[Math.floor(Math.random() * normalKeyBuffers.length)];

      if (!buffer) return;

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      // Master gain node for clear, clean, audible volume
      const gain = ctx.createGain();
      const baseGain = isSpace ? 0.52 : 0.46;
      // Slight natural volume micro-variation
      const randomGain = baseGain + (Math.random() * 0.08 - 0.04);
      gain.gain.setValueAtTime(randomGain, ctx.currentTime);

      src.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    } catch (e) {
      // Audio not supported, silently ignore
    }
  }

  function dismissIntro() {
    if (isDismissed) return;
    isDismissed = true;
    overlay.classList.add('dismissed');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 850);
  }

  skipBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissIntro();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dismissIntro();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.welcome-bg-glow') || e.target.closest('.terminal-scanline')) {
      dismissIntro();
    }
  });

  // Utility: create a prompt HTML string
  function promptHTML() {
    return `<span class="term-prompt"><span class="prompt-user">moaaz</span><span class="prompt-at">@</span><span class="prompt-host">portfolio</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span></span>`;
  }

  // Add a completed line to terminal
  function addLine(html, className = '') {
    if (isDismissed) return;
    const div = document.createElement('div');
    div.className = `term-line ${className}`;
    div.innerHTML = html;
    terminalLines.appendChild(div);
    scrollToBottom();
  }

  // Add blank line
  function addBlank() {
    addLine('&nbsp;');
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Type a command character by character (SLOWER + KEY SOUND)
  function typeCommand(cmdHTML, plainText) {
    return new Promise((resolve) => {
      if (isDismissed) { resolve(); return; }

      inputLine.style.display = 'none';

      const typingDiv = document.createElement('div');
      typingDiv.className = 'term-line';
      typingDiv.style.opacity = '1';
      typingDiv.innerHTML = promptHTML();

      const textSpan = document.createElement('span');
      textSpan.className = 'terminal-typed-text';
      typingDiv.appendChild(textSpan);

      const cursorSpan = document.createElement('span');
      cursorSpan.className = 'terminal-cursor';
      cursorSpan.textContent = '█';
      typingDiv.appendChild(cursorSpan);

      terminalLines.appendChild(typingDiv);
      scrollToBottom();

      let i = 0;
      const chars = plainText;

      function typeNext() {
        if (isDismissed) { resolve(); return; }
        if (i < chars.length) {
          textSpan.textContent += chars[i];
          playKeyClick(chars[i] === ' ');
          i++;
          scrollToBottom();
          // Slightly slower typing: 90–130ms per character
          const nextDelay = 90 + (Math.random() * 40);
          setTimeout(typeNext, nextDelay);
        } else {
          cursorSpan.remove();
          textSpan.innerHTML = cmdHTML;
          setTimeout(resolve, 100);
        }
      }
      typeNext();
    });
  }

  // Simulate a delay
  function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  // ASCII Art Banner
  const asciiArt = [
    '  __  __                         ',
    ' |  \\/  | ___   __ _  __ _ ____  ',
    ' | |\\/| |/ _ \\ / _` |/ _` |_  / ',
    ' | |  | | (_) | (_| | (_| |/ /  ',
    ' |_|  |_|\\___/ \\__,_|\\__,_/___| ',
  ];

  // Boot Sequence — SIMPLIFIED & SHORTER
  async function runBootSequence() {
    initAudioEngine();
    unlockAudioEngine();
    // Step 1: whoami
    await typeCommand(
      `<span class="term-cmd">whoami</span>`,
      'whoami'
    );
    await wait(250);
    addLine(`<span class="term-highlight">moaaz-amgad</span> <span class="term-comment">// Full-Stack Software Engineer</span>`);
    await wait(450);
    if (isDismissed) return;

    // Step 2: deploy
    await typeCommand(
      `<span class="term-cmd">npm</span> <span class="term-cmd">run</span> <span class="term-string">deploy</span> <span class="term-flag">--prod</span>`,
      'npm run deploy --prod'
    );
    await wait(350);
    addLine(`<span class="term-dim">[</span><span class="term-warn">BUILD</span><span class="term-dim">]</span> Compiling... <span class="term-success">✓</span>`);
    await wait(300);
    addLine(`<span class="term-dim">[</span><span class="term-success">DONE</span><span class="term-dim">]</span> <span class="term-success">Portfolio live!</span> 🚀`);
    await wait(500);
    if (isDismissed) return;

    // Step 3: ASCII Art reveal
    addBlank();
    for (const line of asciiArt) {
      addLine(`<span class="term-ascii">${line}</span>`, 'ascii-reveal');
      await wait(80);
      if (isDismissed) return;
    }
    await wait(350);
    if (isDismissed) return;

    // Step 4: Welcome
    addBlank();
    addLine(`<span class="term-success">▸</span> <span class="term-bold">Welcome.</span> <span class="term-comment">// Let's build something great.</span>`);

    inputLine.style.display = 'flex';
    scrollToBottom();

    // Wait ~2 seconds after everything finishes before opening portfolio
    await wait(2000);
    dismissIntro();
  }

  // Start the boot sequence
  setTimeout(() => {
    runBootSequence();
  }, 400);
}
