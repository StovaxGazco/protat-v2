// ═══ HERO ENTRANCE ═══
import { gsap } from 'gsap';

export function initHero() {
  const tl = gsap.timeline({ delay: 0.5 }); // slight extra delay for Vimeo to init

  // Character-by-character title reveal
  tl.to('.hero__title-word', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.07,
    ease: 'expo.out',
  })
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5')
    .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5')
    .to('#hero-cta', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.4')
    .to('.hero__scroll', { opacity: 1, duration: 0.8, ease: 'expo.out' }, '-=0.3');
  // Note: mouse parallax is now handled by hero-video.js on the Vimeo iframe wrappers
}
