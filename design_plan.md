# Repository Consolidation & Architecture Plan

## 1. Objective
Merge the `icons` Next.js application repository into the `igmrrf.github.io` repository such that:
1. All assets (crypto icons, social/brand icons, banking data, smart contract ABI) remain directly accessible via GitHub raw file access and jsDelivr CDN at their canonical paths.
2. The Next.js web application renders both Cryptocurrency icons and Social/Brand icons in a unified Neo-Glass Retro-Futuristic interface.
3. The legacy `icons` repository can be safely deprecated and deleted with zero broken URLs.

## 2. Directory Structure & GitHub Raw Access Paths

The root of `igmrrf.github.io` contains the physical source assets to ensure GitHub raw file requests (`https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/...`) and jsDelivr CDN requests (`https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/...`) resolve directly:

```text
igmrrf.github.io/
├── cryptoicons/               # Cryptocurrency icons (487 coins)
│   ├── manifest.json          # Coin registry (symbol, name, hex color)
│   ├── svg/                   # SVG files: color/, black/, white/, icon/
│   ├── 128/                   # 128px raster PNGs
│   ├── 32/                    # 32px raster PNGs
│   ├── 32@2x/                 # 64px raster PNGs
│   └── originals/             # Raw source SVGs
├── socialicons/               # Social & Brand icons (135 brands)
│   ├── manifest.json          # Brand registry (symbol, name, hex color, variants)
│   ├── svg/                   # SVG files: Color/, Black/, White/
│   ├── png/                   # PNG files: color/, black/, white/
│   ├── Black.png, Color.png, White.png
│   └── README.md
├── banks/                     # Financial institution data
│   └── nigeria.json
├── contract.json              # Smart contract ABI & deployment registry
├── app/                       # Next.js 16 App Router UI & routes
├── components/                # React 19 UI components (IconGallery, etc.)
├── lib/                       # Web Worker & Comlink utilities
├── public/                    # Next.js static asset symlinks
│   ├── cryptoicons -> ../cryptoicons
│   ├── cryptocurrency -> ../cryptoicons  (legacy alias)
│   ├── socialicons -> ../socialicons
│   ├── banks -> ../banks
│   ├── contract.json -> ../contract.json
│   └── workers/
└── package.json, next.config.mjs, tailwind.config.ts, tsconfig.json
```

## 3. GitHub Raw & CDN Endpoint Matrix

| Asset Category | GitHub Raw URL | jsDelivr CDN URL | Local Next.js Path |
|---|---|---|---|
| **Crypto Icon (Color)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/color/{sym}.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/color/{sym}.svg` | `/cryptoicons/svg/color/{sym}.svg` |
| **Crypto Icon (Black)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/black/{sym}.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/black/{sym}.svg` | `/cryptoicons/svg/black/{sym}.svg` |
| **Crypto Icon (White)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/white/{sym}.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/white/{sym}.svg` | `/cryptoicons/svg/white/{sym}.svg` |
| **Crypto Icon (Icon)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/cryptoicons/svg/icon/{sym}.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/cryptoicons/svg/icon/{sym}.svg` | `/cryptoicons/svg/icon/{sym}.svg` |
| **Social Icon (Color)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/Color/{Name}.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/Color/{Name}.svg` | `/socialicons/svg/Color/{Name}.svg` |
| **Social Icon (Black)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/Black/{Name}_black.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/Black/{Name}_black.svg` | `/socialicons/svg/Black/{Name}_black.svg` |
| **Social Icon (White)** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/socialicons/svg/White/{Name}_white.svg` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/socialicons/svg/White/{Name}_white.svg` | `/socialicons/svg/White/{Name}_white.svg` |
| **Bank Registry** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/banks/nigeria.json` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/banks/nigeria.json` | `/banks/nigeria.json` |
| **Smart Contract** | `https://raw.githubusercontent.com/igmrrf/igmrrf.github.io/main/contract.json` | `https://cdn.jsdelivr.net/gh/igmrrf/igmrrf.github.io@main/contract.json` | `/contract.json` |

## 4. UI/UX Enhancements in `IconGallery`
- **Multi-Category Tabs**: Seamlessly switch between `All (622)` | `Cryptocurrency (487)` | `Social & Tech Brands (135)`.
- **Intelligent Variant Selection**: Support for `Color`, `White`, `Black`, and `Icon` with automatic fallback.
- **Brand Color Palette Filtering**: Fast filtering by color spectrum (Red, Orange, Yellow, Green, Blue, Purple, Mono).
- **Fast Non-Blocking Search**: React 19 `useTransition` powered search matching symbols, titles, and categories.
- **Copy Actions**: One-click copying for jsDelivr CDN URLs and GitHub Raw File URLs with visual feedback.
- **Drag & Drop OS Saving**: Native `DownloadURL` payloads for drag-to-desktop SVG extraction.
- **High-Speed ZIP Worker**: Multi-threaded Comlink Web Worker for batch downloads.
