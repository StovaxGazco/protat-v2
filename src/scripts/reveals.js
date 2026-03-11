// ═══ SCROLL REVEALS ═══
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initReveals() {
    // Generic reveal classes driven by IntersectionObserver for CSS transitions
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.15 }
    );

    document
        .querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
        .forEach((el) => observer.observe(el));

    // Nav scroll behaviour
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav?.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Hero scroll parallax
    const heroImg = document.querySelector('.hero__img');
    window.addEventListener('scroll', () => {
        if (heroImg) {
            gsap.to(heroImg, {
                y: window.scrollY * 0.3,
                duration: 0,
                ease: 'none',
                overwrite: 'auto',
            });
        }
    });

    // Why features cascade reveal with delay
    const whyFeatures = document.querySelectorAll('.why__feature');
    const featureObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
                    setTimeout(() => entry.target.classList.add('visible'), delay);
                }
            });
        },
        { threshold: 0.2 }
    );
    whyFeatures.forEach((f) => featureObserver.observe(f));
}
