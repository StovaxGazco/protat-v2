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

let stackingTrigger = null;

export function initStackingCards(selector = '.stack-card') {
    // Kill existing animation if rebuilding
    if (stackingTrigger) {
        stackingTrigger.kill();
        stackingTrigger = null;
    }

    const container = document.querySelector('.cards-container');
    const cards = gsap.utils.toArray(selector).filter(card => {
        // Only include visible cards (not display:none)
        return window.getComputedStyle(card).display !== 'none';
    });
    const numCards = cards.length;

    if (!container || !numCards) return;

    // ── Clear all GSAP properties from cards ──
    cards.forEach(card => {
        gsap.set(card, { clearProps: 'all' });
        const cardBody = card.querySelector('.stack-card__body');
        if (cardBody) {
            gsap.set(cardBody, { clearProps: 'all' });
        }
    });

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
            scale: 1,
            filter: 'blur(0px)',
            opacity: 1,
        });
        
        // Ensure card body is visible
        const cardBody = card.querySelector('.stack-card__body');
        if (cardBody) {
            gsap.set(cardBody, { opacity: 1, y: 0 });
        }
    });

    // ── Pin the container for (N-1) screens of scroll ──
    // Reduced to 0.4 viewport heights per card for faster scrolling
    const scrollDistance = window.innerHeight * (numCards - 1) * 0.4;

    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 0.6,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            onRefreshInit: self => {
                stackingTrigger = self;
            }
        },
    });

    // Store the trigger reference
    stackingTrigger = mainTl.scrollTrigger;

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
        const cardBody = nextCard.querySelector('.stack-card__body');
        if (cardBody) {
            mainTl.from(
                cardBody,
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

    return stackingTrigger;
}

export function destroyStackingCards() {
    if (stackingTrigger) {
        stackingTrigger.kill();
        stackingTrigger = null;
    }
}
