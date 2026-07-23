# Adding New Icons to DevIcons

The DevIcons repository dynamically loads its UI based on a centralized JSON manifest. Adding a new icon is a straightforward, two-step process. We actively intend to expand this registry and welcome additions across all categories—including cryptocurrencies, tech assets, and fiat currencies (like `USD`, `GBP`, `EUR`, `JPY`, `CNY`, `RUB`).

## Step 1: Add the SVG Files

The project expects 4 variants for every icon, organized into specific subdirectories within `public/cryptocurrency/svg/`:

1. `/black/` - Pure black vector `#000000`
2. `/white/` - Pure white vector `#FFFFFF`
3. `/color/` - Standard full-color vector
4. `/icon/` - A simplified, minimal version of the logo

**Requirements:**
- Ensure the file is an `.svg`.
- The filename MUST be the exact **lowercase symbol** of the asset (e.g., if the symbol is `XYZ`, the file must be `xyz.svg`).
- Place the correctly named SVG file into all 4 variant directories.

## Step 2: Update the Manifest

The gallery pulls metadata directly from the registry manifest. 
Open `public/cryptocurrency/manifest.json` and append a new object to the array:

```json
{
  "symbol": "XYZ",
  "name": "XYZ Network",
  "color": "#ff00aa"
}
```

**Fields:**
- `symbol`: The unique ticker or shortcode (MUST match the SVG filename when lowercased).
- `name`: The full display name of the asset.
- `color`: The primary brand hex color. This is critical as it dynamically generates the Neo-Glass hover glow and UI accents in the gallery.

## Final Review

Once the SVGs are placed and the manifest is updated:
1. Start the development server (`npm run dev`).
2. Type the new symbol in the search bar.
3. Hover over the icon to verify the brand `color` glow appears correctly.
4. Click the icon to open the native HTML Popover to verify all metadata populates properly.
5. Cycle through the Variant tabs to ensure all 4 SVG files resolve properly.
