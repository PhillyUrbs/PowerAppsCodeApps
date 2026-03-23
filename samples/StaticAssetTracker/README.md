# StaticAssetTracker

A Power Apps code app sample for tracking organizational assets (laptops, monitors, etc.).

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **UI Library**: Radix UI + shadcn/ui components + Tailwind CSS
- **Build**: Vite with relative path base configuration (`base: "./"`)

## Architecture

### Image/Asset Handling

This project uses **external URLs only** for all images — no local static assets, no `src/assets` directory. All images come from Unsplash and are stored as URL strings in TypeScript data files.

Components receive image URLs as props and render them via shadcn/ui's `Avatar` component, which handles loading, errors, and fallback initials.

### Data Structure

- **Assets** ([src/data/assets.ts](src/data/assets.ts)): Array of asset objects with properties including `id`, `name`, `type`, `status`, `purchaseDate`, `value`, `description`, `deviceId`, `image` (Unsplash URL), `brand`, `model`, `serialNumber`, and optional `owner`.
- **Owners** ([src/data/owners.ts](src/data/owners.ts)): Array of owner objects with `id`, `name`, `image` (Unsplash URL), `title`, `email`, `phone`.

### Key Components

| Component | Image Usage |
| --------- | ----------- |
| `AssetCard` | Avatar with `asset.image` URL |
| `AssetDetail` | Large asset avatar (32×32px) + owner avatar (16×16px) |
| `Index` (main page) | Admin profile image as direct URL |

### Implementation Pattern

1. Define image URLs in data files (not components)
2. Pass URLs as props to components
3. Use `Avatar` component from shadcn/ui (wraps `<img>`)
4. Avatar handles loading states, errors, and fallback initials
5. No `import` statements for images — plain string URLs

## Build & Deploy

```bash
npm install
npm run dev       # local dev server on port 3000
npm run build     # production build to ./dist
```

Deploy to Power Apps via `pac code push`. See [../../.github/DEPLOYMENT.md](../../.github/DEPLOYMENT.md) for CI/CD setup.

## Notes

- No asset pipeline or image optimization needed — all images are external
- Relative path base (`base: "./"`) enables deployment to subdirectories
- No offline image capability (images loaded from internet)
