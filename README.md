# DevIcons (igmrrf.github.io)

**DevIcons** is a high-craft, centralized developer icon repository and web showcase merging extensive native web capabilities with a **Neo-Glass Retro-Futuristic** aesthetic.

This repository serves as both the GitHub Pages web application for interactive browsing and direct CDN/Raw file hosting for over **620+ icons** across **Cryptocurrency** assets, **Social & Tech Brand** marks, and financial data registries.

---

## 🚀 GitHub Raw File & jsDelivr CDN Access

All assets are maintained in the root directory structure and remain 100% accessible for direct raw file access and CDN distribution without rate limits.

### 1. Cryptocurrency Icons (487 Coins)
- **Manifest**: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/manifest.json`
- **SVG Formats**:
  - Color: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/color/{symbol}.svg`
  - Black: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/black/{symbol}.svg`
  - White: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/white/{symbol}.svg`
  - Icon: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/icon/{symbol}.svg`
- **jsDelivr CDN**:
  ```text
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/color/btc.svg
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/color/eth.svg
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/color/sol.svg
  ```

### 2. Social & Tech Brand Icons (135 Brands)
- **Manifest**: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/manifest.json`
- **SVG Formats**:
  - Color: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/Color/{BrandName}.svg`
  - Black: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/Black/{BrandName}_black.svg`
  - White: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/White/{BrandName}_white.svg`
- **jsDelivr CDN**:
  ```text
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/Color/Github.svg
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/Color/Discord.svg
  https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/Color/Twitter.svg
  ```

### 3. Financial & Smart Contract Data
- **Nigeria Banks Registry**: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/banks/nigeria.json`
- **Smart Contract ABI**: `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/contract.json`

---

## 🎨 Interactive Web Application Features

- **Unified Multi-Category Gallery**: Seamlessly browse and filter **Cryptocurrency** and **Social/Brand** icons with real-time counters.
- **Native Web Optimizations**:
  - **React 19 `useTransition`**: Instant, non-blocking search queries.
  - **Native HTML `popover` API**: Top-layer modal inspect dialogs with zero z-index conflicts or heavy modal dependencies.
  - **Native `View Transitions API`**: Fluid layout morphing when sorting, filtering, or shuffling icons.
  - **Off-Main-Thread Web Workers (`Comlink` + `JSZip`)**: Background multithreaded ZIP archive generation for filtered icon downloads.
  - **HTML5 Drag & Drop**: Native drag-to-desktop SVG saving with `DownloadURL` payloads and physical grid reordering.
  - **Intersection Observer**: Smooth, memory-efficient infinite scroll pagination.
- **Neo-Glass Design**: Deep retro-futuristic dark mode aesthetic with backdrop blurs, glow accents, and responsive `@container` queries.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16+ (App Router, Turbopack, Static Export)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Typographics**: `Outfit` (display) & `Space Mono` (data) via `next/font`
- **Worker Concurrency**: Comlink Web Workers

---

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/igmrrf/igmrrf.github.io.git
   cd igmrrf.github.io
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or npm install
   ```

3. **Run local development server**:
   ```bash
   bun run dev
   # or npm run dev
   ```

4. **Build static export**:
   ```bash
   bun run build
   # or npm run build
   ```

---

## 📖 Adding New Icons

To contribute or add new icons, refer to [ADDING_ICONS.md](./ADDING_ICONS.md).

---

## 📜 Sources & Attributions

- [Cryptocurrency Icons](https://github.com/spothq/cryptocurrency-icons)
- [Social Media Icons](https://github.com/gauravghongde/social-icons)
