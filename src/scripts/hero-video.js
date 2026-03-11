// ═══ HERO VIDEO — Vimeo Looping Background ═══
//
// Loads a single Vimeo video as full-screen looping background in the hero.
//
import Player from '@vimeo/player';

const VIDEO_ID = 1172527618;

export function initHeroVideo() {
    const heroBg = document.querySelector('.hero__bg');
    if (!heroBg) return;

    // ── Remove the static img placeholder ──
    const staticImg = heroBg.querySelector('.hero__img');
    if (staticImg) staticImg.remove();

    // Get the overlay element so we can insert video before it
    const overlay = heroBg.querySelector('.hero__overlay');

    // ── Create iframe wrapper for video ──
    const wrap = document.createElement('div');
    wrap.className = 'hero__video-wrap';
    wrap.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: 1;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    `;

    const iframe = document.createElement('iframe');
    // Autoplay with loop enabled
    iframe.src = `https://player.vimeo.com/video/${VIDEO_ID}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`;
    iframe.setAttribute('allow', 'autoplay; fullscreen');
    iframe.setAttribute('frameborder', '0');
    iframe.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      /* 16:9 cover trick — fills the frame without letterboxing */
      width: 100vw;
      height: 56.25vw;
      min-height: 100%;
      min-width: 177.78vh;
      transform: translate(-50%, -50%);
      border: none;
      pointer-events: none;
    `;

    wrap.appendChild(iframe);
    // Insert video BEFORE the overlay so overlay stays on top
    if (overlay) {
        heroBg.insertBefore(wrap, overlay);
    } else {
        heroBg.appendChild(wrap);
    }

    // ── Initialize Vimeo Player SDK ──
    const player = new Player(iframe);
    
    // Optional: Log when video is ready
    player.on('loaded', () => {
        console.log('Hero video loaded and looping');
    });

    // ── Mouse parallax on the wrapper ──
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = hero.getBoundingClientRect();
            const xPct = (clientX / width - 0.5) * 2;
            const yPct = (clientY / height - 0.5) * 2;
            wrap.style.transform = `translate(${xPct * 8}px, ${yPct * 5}px)`;
        });
    }
}
