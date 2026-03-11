# Protat Éconergie v2

Modern website for Protat Éconergie, authorized Stovax & Gazco dealer in Beaujolais.

## Features

- 🎥 **Vimeo Video Backgrounds** - Cycling hero videos and lazy-loaded section backgrounds
- ⚡ **Performance Optimized** - Viewport-based video loading saves ~75% initial bandwidth
- 📱 **Fully Responsive** - Mobile-first design with smooth animations
- 🎨 **GSAP Animations** - Scroll reveals and stacking card interactions
- 🔥 **Stovax Collection** - Showcase of wood-burning stoves and inserts

## Tech Stack

- **Vite** - Fast build tool and dev server
- **GSAP** - Professional-grade animations
- **Vimeo Player SDK** - Advanced video control
- **Vanilla JavaScript** - No framework overhead

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This site is optimized for deployment on Vercel:

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically on every push to `main`

## Performance

- Lazy video loading with Intersection Observer
- Only visible videos play, paused when scrolled away
- Hero videos load on-demand (only first video autoplays)
- Optimized for Core Web Vitals

## License

© 2026 Protat Éconergie. All rights reserved.
