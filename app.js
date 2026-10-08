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
