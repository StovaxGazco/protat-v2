// ═══ LAZY VIDEO LOADER — Viewport-based Playback ═══
//
// Uses Intersection Observer to play/pause videos only when visible.
// Optimizes performance by not loading videos until they enter viewport.
//
import Player from '@vimeo/player';

/**
 * Initialize lazy loading for Vimeo videos
 * Videos will only play when they enter the viewport and pause when they leave
 * 
 * @param {string} selector - CSS selector for video iframes to lazy-load
 * @param {Object} options - Configuration options
 * @param {number} options.rootMargin - Margin around viewport (e.g., '100px')
 * @param {number} options.threshold - Percentage of visibility to trigger (0-1)
 */
export function initLazyVideos(selector = '.lazy-video', options = {}) {
  const {
    rootMargin = '100px', // Start loading 100px before entering viewport
    threshold = 0.25, // Play when 25% visible
  } = options;

  const videoElements = document.querySelectorAll(selector);
  if (!videoElements.length) return;

  // Map to store Player instances
  const players = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const iframe = entry.target;
      
      if (entry.isIntersecting) {
        // Video entered viewport
        if (!players.has(iframe)) {
          // First time in viewport - initialize player
          const player = new Player(iframe);
          players.set(iframe, player);
          
          // Play the video
          player.play().catch((err) => {
            console.log('Video play prevented:', err);
          });
        } else {
          // Re-entering viewport - resume playback
          players.get(iframe).play().catch((err) => {
            console.log('Video play prevented:', err);
          });
        }
      } else {
        // Video left viewport - pause to save bandwidth
        if (players.has(iframe)) {
          players.get(iframe).pause().catch((err) => {
            console.log('Video pause prevented:', err);
          });
        }
      }
    });
  }, {
    rootMargin,
    threshold,
  });

  // Observe all video elements
  videoElements.forEach((video) => observer.observe(video));

  return { observer, players };
}

/**
 * Get player instance for a specific video element
 * Useful for controlling videos programmatically
 */
export function getVideoPlayer(iframe, playersMap) {
  return playersMap?.get(iframe) || new Player(iframe);
}
