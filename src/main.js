// ═══ PROTAT — MAIN ENTRY ═══
import './styles/main.css';
import { initHero } from './scripts/hero.js';
import { initHeroVideo } from './scripts/hero-video.js';
import { initStackingCards } from './scripts/stacking.js';
import { initReveals } from './scripts/reveals.js';
import { initLazyVideos } from './scripts/lazy-videos.js';
// import { initProducts } from './scripts/products.js'; // Disabled - now using static installations
import { initCursor } from './scripts/cursor.js';

// ── Cursor ──
initCursor();

// ── Hero video background (Vimeo cycling, runs before entrance animation) ──
initHeroVideo();

// ── Hero GSAP entrance ──
initHero();

// ── Scroll reveals ──
initReveals();

// ── Stacking cards ──
initStackingCards();

// ── Lazy video loading (viewport-based playback) ──
const { players: lazyVideoPlayers } = initLazyVideos('.lazy-video', {
  rootMargin: '200px', // Start loading 200px before entering viewport
  threshold: 0.1, // Play when 10% visible
});

// ── Products (disabled - now showing installations) ──
// initProducts();

// ── Mobile nav toggle ──
const burger = document.getElementById('nav-burger');
const mobileMenu = document.getElementById('mobile-menu');
const burgerSpans = burger?.querySelectorAll('span');

burger?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const isOpen = mobileMenu?.classList.contains('open');
  if (burgerSpans) {
    if (isOpen) {
      burgerSpans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      burgerSpans[1].style.opacity = '0';
      burgerSpans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      burgerSpans[0].style.transform = '';
      burgerSpans[1].style.opacity = '1';
      burgerSpans[2].style.transform = '';
    }
  }
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    if (burgerSpans) {
      burgerSpans[0].style.transform = '';
      burgerSpans[1].style.opacity = '1';
      burgerSpans[2].style.transform = '';
    }
  });
});

// ── Smooth scroll for all anchor links ──
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = document.getElementById('nav')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Contact form ──
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');
const submitBtn = document.getElementById('form-submit');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  submitBtn.textContent = 'Envoi en cours…';
  submitBtn.disabled = true;
  await new Promise((r) => setTimeout(r, 1200));
  submitBtn.style.display = 'none';
  successMsg.style.display = 'block';
  form.reset();
});
// ── Ambient video mute toggle ──
const ambientVideoElement = document.querySelector('.video-ambient__video');
const muteBtn = document.getElementById('ambient-mute-btn');
const iconMuted = document.getElementById('icon-muted');
const iconSound = document.getElementById('icon-sound');

if (ambientVideoElement && muteBtn) {
  // Check if it's a Vimeo iframe
  if (ambientVideoElement.tagName === 'IFRAME') {
    import('@vimeo/player').then(({ default: Player }) => {
      // Wait for lazy video to initialize, then get the player
      setTimeout(() => {
        const player = lazyVideoPlayers.get(ambientVideoElement) || new Player(ambientVideoElement);
        let isMuted = true; // Starts muted due to background=1
        
        muteBtn.addEventListener('click', () => {
          isMuted = !isMuted;
          player.setMuted(isMuted);
          iconMuted.style.display = isMuted ? 'block' : 'none';
          iconSound.style.display = isMuted ? 'none' : 'block';
        });
      }, 500);
    });
  } else {
    // Native video element
    muteBtn.addEventListener('click', () => {
      ambientVideoElement.muted = !ambientVideoElement.muted;
      iconMuted.style.display = ambientVideoElement.muted ? 'block' : 'none';
      iconSound.style.display = ambientVideoElement.muted ? 'none' : 'block';
    });
  }
}

// ── Video reel — click to play ──
const reelPlayer = document.getElementById('reel-player');
const reelIframe = document.getElementById('reel-iframe');
const reelPlayBtn = document.getElementById('reel-play-btn');

reelPlayBtn?.addEventListener('click', () => {
  if (!reelIframe || !reelPlayer) return;
  // Lazy load the iframe src when user clicks
  reelIframe.src = reelIframe.getAttribute('data-src') || '';
  reelIframe.style.display = 'block';
  reelPlayer.classList.add('playing');
});
