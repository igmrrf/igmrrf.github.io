# DevIcons

**DevIcons** is a high-craft, centralized repository of popular icons (cryptocurrencies, technologies, companies) rendered in a distinctive **Neo-Glass Retro-Futurism** aesthetic.

This project merges extensive native web capabilities with cutting-edge structural UI design. It's built as a fully functional Next.js 15+ application showcasing native optimizations.

## Features

- **Extensive Collection**: Over 400+ icons covering cryptocurrencies, tech assets, and fiat currencies (`USD`, `GBP`, `EUR`, `JPY`, `CNY`, `RUB`) with black, white, color, and standard variants. *Note: We actively intend to keep expanding this collection across all categories.*
- **Native Web Optimizations**: 
  - Real-time searching powered by React 19's `useTransition` for non-blocking UI.
  - Native HTML `popover` API for modal detail views (zero z-index hacks, zero JS-heavy modal libraries).
  - Native `View Transitions API` for seamless DOM morphing when switching icon variants.
- **Experimental Modules**: Features off-main-thread (OMT) worker examples, Optimistic UI demonstrations, and FLIP animations.
- **Neo-Glass Design**: A highly intentional, premium interface blending brutalist structural layouts with deep dark gradients, glassmorphism, and neon-cyan accents.

## Architecture

- **Framework**: Next.js (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 (CSS variable architecture)
- **Typographics**: `Outfit` (display) and `Space Mono` (data/buttons) via `next/font`
- **Data**: Static `manifest.json` asset registry

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the registry at `http://localhost:3000`

## Documentation

- Need to add new icons to the repository? See [ADDING_ICONS.md](./ADDING_ICONS.md) for the concise flow.

---
*An open-source project designed for developers and tech enthusiasts.*
