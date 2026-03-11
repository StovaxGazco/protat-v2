// ═══ PRODUCTS — WooCommerce-ready abstraction ═══
// To connect to the live WP API, set these env vars:
//   VITE_WP_API_URL   = https://your-site.com
//   VITE_WC_KEY       = ck_xxxxxxxx
//   VITE_WC_SECRET    = cs_xxxxxxxx

const PLACEHOLDER_PRODUCTS = [
    {
        id: 1,
        name: 'Stovax Woodbury 5 Wide',
        short_description: 'Poêle en fonte contemporain avec grande fenêtre de combustion. Rendement nominal 5kW, conforme Écodesign 2022.',
        categories: [{ name: 'Poêles à Bois' }],
        price: '1 849',
        badge: 'Bestseller',
        images: [{ src: 'https://images.unsplash.com/photo-1643645592870-2aa45fdcd6a4?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
    {
        id: 2,
        name: 'Stovax Riva2 66 Insert',
        short_description: 'Insert de cheminée haute performance avec brûleur Cleanburn. Transformez votre foyer ouvert en chauffage performant.',
        categories: [{ name: 'Inserts' }],
        price: '2 290',
        badge: 'Nouveau',
        images: [{ src: 'https://images.unsplash.com/photo-1574091399729-69a4d2e4baef?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
    {
        id: 3,
        name: 'Stovax Studio 1 Air',
        short_description: 'Vision panoramique à 180°. Ce poêle monobloc au design épuré s\'intègre dans tous les intérieurs contemporains.',
        categories: [{ name: 'Poêles Contemporains' }],
        price: '3 150',
        badge: 'Premium',
        images: [{ src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
    {
        id: 4,
        name: 'Stovax Sheraton 5 Midline',
        short_description: 'Design classique avec poignée en fonte traditionnelle. Rendement 80%+, combustion lente pour une chaleur douce et continue.',
        categories: [{ name: 'Poêles à Bois' }],
        price: '1 590',
        badge: null,
        images: [{ src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
    {
        id: 5,
        name: 'Stovax Vogue Medium T',
        short_description: 'Esthétique scandinave avec pattes en fonte. Cinq coloris disponibles. Idéal pour les espaces de 40 à 100 m².',
        categories: [{ name: 'Poêles Design' }],
        price: '2 050',
        badge: null,
        images: [{ src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
    {
        id: 6,
        name: 'Stovax Gazco Log Effect',
        short_description: 'Foyer au gaz à effet bûches hyperréaliste. Flamme permanente sans contrainte — idéal en appartement ou maison sans conduit.',
        categories: [{ name: 'Foyers au Gaz' }],
        price: '2 680',
        badge: 'Coup de Cœur',
        images: [{ src: 'https://images.unsplash.com/photo-1621460249485-4e4f92c9de5d?w=600&q=80&auto=format&fit=crop' }],
        permalink: '#products',
    },
];

const arrowSvg = `<svg class="product-card__cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 17l9.2-9.2M17 17V7H7"/></svg>`;

function buildCard(product) {
    const img = product.images?.[0]?.src || '';
    const category = product.categories?.[0]?.name || '';
    const badge = product.badge ? `<span class="product-card__badge">${product.badge}</span>` : '';

    return `
    <article class="product-card">
      <div class="product-card__image-wrap">
        <img src="${img}" alt="${product.name}" loading="lazy" />
        ${badge}
      </div>
      <div class="product-card__body">
        <span class="product-card__category">${category}</span>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.short_description}</p>
        <div class="product-card__footer">
          <span class="product-card__price">À partir de ${product.price} €</span>
          <a href="${product.permalink}" class="product-card__cta">
            En savoir plus ${arrowSvg}
          </a>
        </div>
      </div>
    </article>
  `;
}

export async function getProducts() {
    const apiUrl = import.meta.env?.VITE_WP_API_URL;
    const key = import.meta.env?.VITE_WC_KEY;
    const secret = import.meta.env?.VITE_WC_SECRET;

    if (apiUrl && key && secret) {
        try {
            const credentials = btoa(`${key}:${secret}`);
            const res = await fetch(`${apiUrl}/wp-json/wc/v3/products?per_page=6&status=publish`, {
                headers: { Authorization: `Basic ${credentials}` },
            });
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn('[Protat] WooCommerce API unavailable, using placeholder data.', err);
        }
    }

    return PLACEHOLDER_PRODUCTS;
}

export async function initProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const products = await getProducts();
    grid.innerHTML = products.map(buildCard).join('');

    // Staggered reveal on scroll
    const cards = grid.querySelectorAll('.product-card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, idx) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('visible'), idx * 80);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    cards.forEach((card) => observer.observe(card));
}
