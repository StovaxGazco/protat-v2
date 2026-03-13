// ═══ COLLECTION NAVIGATION & FILTERING ═══
//
// Handles category filtering and side navigation for stacking cards
//
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initStackingCards } from './stacking.js';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initCollectionNav() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.stack-card');
    const nav = document.getElementById('collection-nav');
    const navList = document.getElementById('collection-nav-list');
    const section = document.querySelector('.stacking-section');
    
    if (!filterBtns.length || !cards.length || !nav || !navList || !section) return;

    let currentFilter = 'all';
    let visibleCards = Array.from(cards);
    let stackingTrigger = null;
    let scrollTrackingTrigger = null;

    // ── Build Side Navigation ──
    function buildNav() {
        navList.innerHTML = '';
        visibleCards.forEach((card, index) => {
            const productName = card.dataset.productName || `Produit ${index + 1}`;
            const li = document.createElement('li');
            li.className = 'collection-nav__item';
            li.textContent = productName;
            li.dataset.cardIndex = index;
            
            li.addEventListener('click', () => {
                jumpToCard(index);
            });
            
            navList.appendChild(li);
        });

        // Setup scroll tracking for active nav item
        setupScrollTracking();
    }

    // ── Setup Scroll Tracking ──
    function setupScrollTracking() {
        // Kill existing scroll tracking
        if (scrollTrackingTrigger) {
            scrollTrackingTrigger.kill();
            scrollTrackingTrigger = null;
        }

        const container = document.querySelector('.cards-container');
        if (!container || !visibleCards.length) return;

        // Calculate scroll distance (same as stacking.js)
        const scrollDistance = window.innerHeight * (visibleCards.length - 1) * 0.4;

        scrollTrackingTrigger = ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${scrollDistance}`,
            onUpdate: (self) => {
                const progress = self.progress;
                const cardIndex = Math.floor(progress * visibleCards.length);
                const clampedIndex = Math.min(cardIndex, visibleCards.length - 1);
                
                // Update active nav item
                const navItems = navList.querySelectorAll('.collection-nav__item');
                navItems.forEach((item, i) => {
                    if (i === clampedIndex) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }

    // ── Jump to Specific Card ──
    function jumpToCard(index) {
        if (!scrollTrackingTrigger) return;

        // Calculate target scroll position within the pinned section
        // The ScrollTrigger starts at 'top top' and has a calculated scroll distance
        const start = scrollTrackingTrigger.start;
        const end = scrollTrackingTrigger.end;
        const totalDistance = end - start;
        
        // Each card takes a fraction of the total scroll distance
        const cardProgress = index / (visibleCards.length - 1);
        const targetScroll = start + (totalDistance * cardProgress);
        
        gsap.to(window, {
            scrollTo: targetScroll,
            duration: 1,
            ease: 'power2.inOut'
        });
    }

    // ── Filter Cards by Category ──
    function filterCards(category) {
        currentFilter = category;

        // Hide all cards first
        cards.forEach(card => {
            card.style.display = 'none';
        });

        // Show filtered cards
        if (category === 'all') {
            visibleCards = Array.from(cards);
        } else {
            visibleCards = Array.from(cards).filter(card => 
                card.dataset.category === category
            );
        }

        // Show visible cards
        visibleCards.forEach(card => {
            card.style.display = '';
        });

        // Rebuild navigation
        buildNav();

        // Rebuild stacking animation with filtered cards
        stackingTrigger = initStackingCards('.stack-card');
    }

    // ── Category Filter Buttons ──
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            filterCards(filter);
        });
    });

    // ── Show/Hide Navigation based on scroll ──
    ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => nav.classList.add('visible'),
        onLeave: () => nav.classList.remove('visible'),
        onEnterBack: () => nav.classList.add('visible'),
        onLeaveBack: () => nav.classList.remove('visible'),
    });

    // Initial build
    buildNav();
}
