// ═══ HERO VIDEO — Vimeo Cycling Background ═══
//
// Loads multiple Vimeo videos as full-screen background in the hero.
// When each video finishes, crossfades to the next and loops indefinitely.
//
import Player from '@vimeo/player';

const VIDEO_IDS = [1113914782, 1113924542, 1113881006,1101822604];
const FADE_DURATION = 0; // ms for the crossfade

export function initHeroVideo() {
    const heroBg = document.querySelector('.hero__bg');
    if (!heroBg) return;

    // ── Remove the static img placeholder ──
    const staticImg = heroBg.querySelector('.hero__img');
    if (staticImg) staticImg.remove();

    // Get the overlay element so we can insert videos before it
    const overlay = heroBg.querySelector('.hero__overlay');

    // ── Create iframe wrappers for all videos ──
    const wrappers = VIDEO_IDS.map((id, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'hero__video-wrap';
        wrap.style.cssText = `
      position: absolute;
      inset: 0;
      opacity: ${i === 0 ? 1 : 0};
      transition: opacity ${FADE_DURATION}ms ease;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    `;

        const iframe = document.createElement('iframe');
        // Only autoplay the first video (i === 0), others load on-demand
        // This saves bandwidth - videos only load when they're about to play
        iframe.src = `https://player.vimeo.com/video/${id}?background=1&autoplay=${i === 0 ? 1 : 0}&loop=0&byline=0&title=0&muted=1`;
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
        // Insert videos BEFORE the overlay so overlay stays on top
        if (overlay) {
            heroBg.insertBefore(wrap, overlay);
        } else {
            heroBg.appendChild(wrap);
        }
        return { wrap, iframe, id };
    });

    // ── Initialize Vimeo Player SDK on both iframes ──
    let currentIdx = 0;
    let isTransitioning = false;
    const players = [];

    wrappers.forEach(({ iframe }, i) => {
        const player = new Player(iframe);
        players.push(player);

        player.on('ended', () => {
            console.log(`Video ${i} ended, transitioning to next`);
            if (isTransitioning) {
                console.log('Already transitioning, skipping');
                return;
            }
            isTransitioning = true;

            const nextIdx = (i + 1) % VIDEO_IDS.length;
            const currentWrap = wrappers[i].wrap;
            const nextWrap = wrappers[nextIdx].wrap;

            console.log(`Playing video ${nextIdx} (current: ${i}, next: ${nextIdx})`);

            // Reset and play the next video
            players[nextIdx].setCurrentTime(0)
                .then(() => {
                    console.log(`Video ${nextIdx} reset to 0`);
                    return players[nextIdx].play();
                })
                .then(() => {
                    console.log(`Video ${nextIdx} playing successfully`);
                    // Crossfade after play starts
                    nextWrap.style.opacity = '1';
                    currentWrap.style.opacity = '0';
                })
                .catch((err) => {
                    console.error(`Error playing video ${nextIdx}:`, err);
                    // Try to play anyway
                    players[nextIdx].play().catch(e => console.error('Retry failed:', e));
                    // Still do the crossfade
                    nextWrap.style.opacity = '1';
                    currentWrap.style.opacity = '0';
                });

            setTimeout(() => {
                // Pause the outgoing video (saves bandwidth)
                players[i].pause().catch(() => {});
                currentIdx = nextIdx;
                isTransitioning = false;
                console.log(`Transition complete, current video is now ${nextIdx}`);
            }, FADE_DURATION + 100);
        });
    });

    // Preload all videos except the first one (which is already playing)
    for (let i = 1; i < players.length; i++) {
        players[i]
            .ready()
            .then(() => players[i].play())   // start buffering
            .then(() => players[i].pause())  // immediately pause
            .catch(() => { });                // silently ignore if blocked
    }

    // ── Mouse parallax on the wrappers ──
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { width, height } = hero.getBoundingClientRect();
            const xPct = (clientX / width - 0.5) * 2;
            const yPct = (clientY / height - 0.5) * 2;
            wrappers.forEach(({ wrap }) => {
                wrap.style.transform = `translate(${xPct * 8}px, ${yPct * 5}px)`;
            });
        });
    }
}
