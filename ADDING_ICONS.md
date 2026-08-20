# Adding New Icons to DevIcons

The DevIcons repository dynamically loads its UI based on centralized JSON manifests. Adding a new icon is a straightforward process across either **Cryptocurrency** or **Social & Brand** categories.

---

## 1. Adding a Cryptocurrency Icon

### Step 1: Add the SVG Files
Place the SVG files into the `cryptoicons/svg/` variant directories:
1. `cryptoicons/svg/color/{symbol}.svg` - Standard full-color vector
2. `cryptoicons/svg/black/{symbol}.svg` - Pure black vector `#000000`
3. `cryptoicons/svg/white/{symbol}.svg` - Pure white vector `#FFFFFF`
4. `cryptoicons/svg/icon/{symbol}.svg` - Simplified/minimal mark

**Requirements:**
- The filename MUST be the lowercase symbol (e.g. for `SOL`, the filename is `sol.svg`).

### Step 2: Update the Crypto Manifest
Open `cryptoicons/manifest.json` and add your coin entry:
```json
{
  "symbol": "SOL",
  "name": "Solana",
  "color": "#14f195"
}
```

---

## 2. Adding a Social / Tech Brand Icon

### Step 1: Add the SVG Files
Place the SVG files into the `socialicons/svg/` variant directories:
1. `socialicons/svg/Color/{BrandName}.svg` - Full-color vector (e.g. `Github.svg`)
2. `socialicons/svg/Black/{BrandName}_black.svg` - Monochrome black vector (e.g. `Github_black.svg`)
3. `socialicons/svg/White/{BrandName}_white.svg` - Monochrome white vector (e.g. `Github_white.svg`)

### Step 2: Update the Social Manifest
Open `socialicons/manifest.json` and add your brand entry:
```json
{
  "symbol": "Github",
  "name": "GitHub",
  "category": "social",
  "color": "#24292E",
  "files": {
    "color": "Github.svg",
    "black": "Github_black.svg",
    "white": "Github_white.svg"
  }
}
```

---

## 3. Verification

1. Run the local development server:
   ```bash
   bun run dev
   # or npm run dev
   ```
2. Search for the newly added icon in the search bar.
3. Switch between **Color**, **White**, **Black**, and **Icon** variants.
4. Click the icon to verify the popover details, brand color glow, and CDN/Raw links.
