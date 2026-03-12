// ═══ STACKING CARDS — GSAP ScrollTrigger (Container Pin Pattern) ═══
//
// APPROACH: Pin the entire .cards-container for (N-1) viewport heights of scroll.
// All cards are position:absolute stacked inside it. Each new card slides up from
// below (yPercent: 100 → 0) while the previous card degrades (scale, blur, opacity).
// This is the reliable pattern — no pinSpacing issues, no card overlap.
//
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initStackingCards() {
    const container = document.querySelector('.cards-container');
    const cards = gsap.utils.toArray('.stack-card');
    const numCards = cards.length;

    if (!container || !numCards) return;

    // ── Initial setup ──
    // Cards sit absolutely inside the container, stacked.
    // Only the first card is visible; all others start below (yPercent 100 = off-screen down).
    cards.forEach((card, i) => {
        gsap.set(card, {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: i + 1, // later cards on top
            yPercent: i === 0 ? 0 : 100, // card 0 visible, rest start below
        });
    });

    // ── Pin the container for (N-1) screens of scroll ──
    // Reduced from 1.0 to 0.6 viewport heights per card for faster scrolling
    const scrollDistance = window.innerHeight * (numCards - 1) * 0.6;

    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
        },
    });

    // ── For each card transition ──
    // Divide the total timeline (0 → 1) into (N-1) equal segments.
    const segDuration = 1 / (numCards - 1);

    for (let i = 0; i < numCards - 1; i++) {
        const currentCard = cards[i];
        const nextCard = cards[i + 1];
        const segStart = i * segDuration;

        // Slide next card up from below
        mainTl.to(
            nextCard,
            {
                yPercent: 0,
                ease: 'power2.inOut',
                duration: segDuration,
            },
            segStart
        );

        // Simultaneously degrade the outgoing card
        mainTl.to(
            currentCard,
            {
                scale: 0.92,
                filter: 'blur(20px)',
                opacity: 0.45,
                ease: 'power2.inOut',
                duration: segDuration,
            },
            segStart
        );

        // Animate the next card's text content in with a slight offset
        mainTl.from(
            nextCard.querySelector('.stack-card__body'),
            {
                y: 40,
                opacity: 0,
                duration: segDuration * 0.6,
                ease: 'expo.out',
            },
            segStart + segDuration * 0.3
        );
    }
}
