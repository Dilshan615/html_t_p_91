// Main Application Logic & Advanced Interactions
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // 2. Custom Neon Glowing Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.transform = `translate(${outlineX - 19}px, ${outlineY - 19}px)`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .tilt-card, .tech-pill, .theme-btn');
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          cursorOutline.style.transform = `translate(${outlineX - 19}px, ${outlineY - 19}px) scale(1.6)`;
          cursorOutline.style.borderColor = 'rgba(168, 85, 247, 0.9)';
        });
        el.addEventListener('mouseleave', () => {
          cursorOutline.style.transform = `translate(${outlineX - 19}px, ${outlineY - 19}px) scale(1)`;
          cursorOutline.style.borderColor = 'rgba(0, 240, 255, 0.5)';
        });
      });
    };
    addHoverListeners();
  }

  // 3. Audio feedback system (Cyber synth click sound generator with Web Audio API)
  let soundEnabled = true;
  const audioToggleBtn = document.getElementById('sound-toggle');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function playCyberTone(freq = 600, type = 'sine', duration = 0.08) {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (err) {}
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        audioToggleBtn.classList.add('border-cyan-400/50', 'text-cyan-400');
        audioToggleBtn.classList.remove('text-slate-500');
        playCyberTone(880, 'triangle', 0.1);
        showToast("🔊 Cyber Sound FX Enabled");
      } else {
        audioToggleBtn.classList.remove('border-cyan-400/50', 'text-cyan-400');
        audioToggleBtn.classList.add('text-slate-500');
        showToast("🔇 Cyber Sound FX Muted");
      }
    });
  }

  document.querySelectorAll('button, a.btn-action').forEach((btn) => {
    btn.addEventListener('click', () => {
      playCyberTone(720, 'sine', 0.06);
    });
  });

  // 4. Mobile Navigation Menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 5. VanillaTilt for 3D Card Parallax
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 12,
      speed: 400,
      glare: true,
      'max-glare': 0.25,
      perspective: 1000,
      scale: 1.02,
    });
  }

  // 6. Project Filtering Logic
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
        b.classList.add('text-slate-400', 'border-white/10');
      });
      btn.classList.add('bg-cyan-500/20', 'text-cyan-400', 'border-cyan-500/50');
      btn.classList.remove('text-slate-400', 'border-white/10');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 7. Interactive Animated Stats Counter
  const statsElements = document.querySelectorAll('.counter-val');
  let statsCounted = false;

  const runCounter = () => {
    statsElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      let current = 0;
      const increment = Math.ceil(target / 45);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 30);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsCounted) {
        statsCounted = true;
        runCounter();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 8. Animated Skill Progress Bars on Scroll
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;

  const animateSkillBars = () => {
    document.querySelectorAll('.skill-bar-fill').forEach((bar) => {
      const percent = bar.getAttribute('data-percent');
      bar.style.width = percent;
    });
  };

  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          animateSkillBars();
        }
      });
    }, { threshold: 0.25 });
    skillObserver.observe(skillSection);
  }

  // 9. Active Nav Scrollspy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // 10. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'dilshan.dev.space@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        playCyberTone(880, 'sine', 0.1);
        showToast('📋 Email address copied to clipboard!');
      }).catch(() => {
        showToast('Direct email: ' + email);
      });
    });
  }

  // 11. 3D Palette Theme Switcher
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      themeButtons.forEach((b) => b.classList.remove('ring-2', 'ring-white'));
      btn.classList.add('ring-2', 'ring-white');

      if (window.set3DTheme) {
        window.set3DTheme(theme);
        playCyberTone(780, 'triangle', 0.12);
        showToast(`🎨 3D Hologram Spectrum switched to: ${theme.toUpperCase()}`);
      }
    });
  });

  // 12. Interactive Project Details Modal System
  const projectsData = {
    '1': {
      title: 'DataSphere 3D AI Platform',
      category: 'Enterprise SaaS & 3D Spatial Viz',
      image: 'assets/project1.jpg',
      description: 'An enterprise-grade AI analytics suite equipped with real-time reactive charting, automated predictive insight clusters, and a full WebGL 3D topological data galaxy. Designed to process over 2.4 million real-time event signals per second with sub-50ms render latency.',
      features: [
        'Real-time WebSocket streaming telemetry',
        'Custom WebGL shaders for high-density 3D data graphs',
        'Full dark mode glassmorphism UI with responsive design',
        'Multi-tenant cloud architecture deployed on AWS'
      ],
      tech: ['Next.js 14', 'Three.js / WebGL', 'Tailwind CSS', 'TypeScript', 'Docker', 'Redis'],
      metrics: { latency: '18ms', uptime: '99.99%', fps: '60 FPS' }
    },
    '2': {
      title: 'Aero-X 3D Cyber Commerce',
      category: 'Interactive 3D Metaverse Shopping',
      image: 'assets/project2.jpg',
      description: 'A cutting-edge 3D interactive e-commerce product configurator for next-generation footwear. Consumers can rotate, inspect, disassemble sole cushions, and dynamically change holographic illumination colorways in real time with physics-based lighting.',
      features: [
        '360-degree interactive camera gimbal controls',
        'PBR (Physically-Based Rendering) GLTF material switches',
        'Procedural audio response for touch and rotate gestures',
        'Seamless checkout flow with Stripe & Web3 wallet payment'
      ],
      tech: ['Three.js', 'GLTF Loader', 'GSAP', 'WebAudio API', 'Tailwind CSS', 'Vite'],
      metrics: { latency: '12ms', uptime: '100%', fps: '60 FPS' }
    },
    '3': {
      title: 'NeuraFlow Cognitive Graph',
      category: 'Biotech AI & Brain Synapse Mapping',
      image: 'assets/project3.jpg',
      description: 'A revolutionary neural network visualization platform that maps deep learning neuron activations and synaptic weights in 3D holographic coordinate space, giving researchers direct insight into AI decision confidence.',
      features: [
        'Dynamic 3D neuron synapse connection rendering',
        'Interactive epoch optimizer and loss tracking visualization',
        'GPU-accelerated cluster computations with WebGL 2',
        'Exportable high-resolution spatial datasets'
      ],
      tech: ['WebGL 2', 'Python / FastAPI', 'TypeScript', 'TensorFlow.js', 'Tailwind CSS'],
      metrics: { latency: '24ms', uptime: '99.95%', fps: '60 FPS' }
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  window.openProjectModal = function (projectId) {
    const data = projectsData[projectId];
    if (!data || !projectModal) return;

    document.getElementById('modal-img').src = data.image;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-category').textContent = data.category;
    document.getElementById('modal-desc').textContent = data.description;
    document.getElementById('modal-latency').textContent = data.metrics.latency;
    document.getElementById('modal-uptime').textContent = data.metrics.uptime;
    document.getElementById('modal-fps').textContent = data.metrics.fps;

    // Features list
    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = data.features.map(f => `
      <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
        <i data-lucide="check-circle" class="w-4 h-4 text-cyan-400 flex-shrink-0"></i>
        <span>${f}</span>
      </li>
    `).join('');

    // Tech badges
    const techBadges = document.getElementById('modal-tech');
    techBadges.innerHTML = data.tech.map(t => `
      <span class="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-cyan-300 border border-white/10">${t}</span>
    `).join('');

    if (window.lucide) lucide.createIcons();

    projectModal.classList.remove('hidden-modal');
    document.body.style.overflow = 'hidden';
    playCyberTone(650, 'triangle', 0.1);
  };

  window.closeProjectModal = function () {
    if (!projectModal) return;
    projectModal.classList.add('hidden-modal');
    document.body.style.overflow = 'auto';
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden-modal')) {
      closeProjectModal();
    }
  });

  // Attach modal openers to preview buttons
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  // 13. Toast Notification helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-msg');

  function showToast(message, isError = false) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');
    if (isError) {
      toast.classList.add('border-rose-500/50', 'bg-rose-950/80');
    } else {
      toast.classList.remove('border-rose-500/50', 'bg-rose-950/80');
    }

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 4000);
  }

  // 14. Contact Form Transmission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Transmitting Signal...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        playCyberTone(900, 'sine', 0.15);
        showToast("✨ Signal received! Thanks for reaching out. I'll get back to you within 24 hours.");
      }, 1400);
    });
  }

  // 15. Simulated Resume Download
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      playCyberTone(800, 'sine', 0.1);
      showToast("📄 Dilshan_CV_Spatial_Dev.pdf transmission started!");
    });
  }

  // 16. Footer Real-Time Telemetry Clock
  const footerClock = document.getElementById('footer-live-time');
  if (footerClock) {
    const updateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Colombo',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      footerClock.textContent = now.toLocaleTimeString('en-US', options) + ' • GMT+5:30';
    };
    updateTime();
    setInterval(updateTime, 1000);
  }
});
