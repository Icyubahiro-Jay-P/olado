# Olado - Rwandan E-Commerce Mobile App

A modern, polished, mobile-first React Native e-commerce app built as a recreation of the Rwandan marketplace **olado.rw**.

## Tech Stack

- **Framework:** React Native + Expo SDK 57
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (TailwindCSS for React Native)
- **Animations:** React Native Reanimated
- **Gestures:** React Native Gesture Handler
- **State:** Zustand (cart, wishlist, auth, search)
- **Data Fetching:** TanStack React Query (with mock API layer)
- **Images:** Expo Image (with blurhash placeholders)
- **Storage:** AsyncStorage (offline persistence)

## Setup

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on web
npx expo start --web
```

## Project Structure

```
OLADO/
├── app/                          # Expo Router pages (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, stack navigator)
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tab bar configuration
│   │   ├── index.tsx             # Home tab
│   │   ├── categories.tsx        # Categories browser
│   │   ├── cart.tsx              # Shopping cart
│   │   └── profile.tsx           # Account / profile
│   ├── product/
│   │   └── [id].tsx              # Product detail (deep link)
│   ├── products/
│   │   └── index.tsx             # Product listing (filtered)
│   ├── wishlist.tsx              # Saved items
│   ├── checkout.tsx              # Multi-step checkout
│   ├── search.tsx                # Full-text search
│   ├── seller.tsx                # Seller registration
│   └── auth/
│       ├── login.tsx             # Login screen
│       └── register.tsx          # Registration screen
│
├── src/
│   ├── types/index.ts            # TypeScript interfaces
│   ├── constants/
│   │   ├── theme.ts              # Colors, spacing, shadows
│   │   ├── config.ts             # App config (WhatsApp, API, shipping)
│   │   └── index.ts              # Re-exports
│   ├── utils/
│   │   ├── format.ts             # Price formatting, dates, utilities
│   │   └── storage.ts            # AsyncStorage helpers
│   ├── data/
│   │   ├── categories.ts         # 11 categories + 44 subcategories
│   │   ├── products.ts           # 32+ products with full details
│   │   ├── banners.ts            # 5 hero banners
│   │   └── index.ts              # Re-exports
│   ├── stores/
│   │   ├── cartStore.ts          # Cart with persistence
│   │   ├── wishlistStore.ts      # Wishlist with persistence
│   │   ├── authStore.ts          # Auth state
│   │   ├── searchStore.ts        # Search history
│   │   └── index.ts              # Re-exports
│   ├── api/
│   │   ├── client.ts             # Mock API (swap for real backend)
│   │   └── hooks.ts              # React Query hooks
│   └── components/
│       ├── index.ts              # Re-exports
│       ├── product/
│       │   ├── ProductCard.tsx    # Grid/list/horizontal product card
│       │   └── CategoryCard.tsx   # Category card variants
│       ├── layout/
│       │   ├── BannerCarousel.tsx # Auto-playing hero carousel
│       │   ├── Header.tsx         # App header
│       │   ├── TrustBadges.tsx    # Quality/Delivery/Return/Support
│       │   └── WhatsAppButton.tsx # Floating WhatsApp CTA
│       └── ui/
│           └── States.tsx        # Empty, Loading, Error states
│
├── assets/                       # App icons, splash
├── global.css                    # NativeWind base styles
├── tailwind.config.js            # Theme (Olado green, accent, etc.)
├── app.json                      # Expo config
├── babel.config.js               # Babel + NativeWind
├── metro.config.js               # Metro + NativeWind
└── tsconfig.json                 # TypeScript config
```

## Navigation Flow

```
Root Stack
├── (tabs) ─ Bottom Tab Navigator
│   ├── Home         → Banner carousel, categories, featured products
│   ├── Categories   → Hierarchical browser (left sidebar + right content)
│   ├── Cart         → Quantity controls, order summary, checkout link
│   └── Profile      → Auth, wishlist, orders, settings, sell on Olado
│
├── product/[id]     → Image carousel, specs, reviews, add-to-cart, buy-now
├── products         → Filterable grid (by category, search query, sort)
├── wishlist         → Saved products with remove
├── checkout         → 4-step: Address → Shipping → Payment → Review
├── search           → Full-text search with recent/popular suggestions
├── seller           → Seller registration form
└── auth/
    ├── login        → Email/password login
    └── register     → Full registration form
```

## Design System

| Token | Value |
|-------|-------|
| Primary Green | `#2E7D32` |
| Accent Orange | `#FF9800` |
| Background | `#F5F5F5` |
| Card | `#FFFFFF` |
| Text | `#212121` |
| Error | `#D32F2F` |
| Success | `#388E3C` |
| WhatsApp | `#25D366` |

## Features Implemented

- [x] Home with hero carousel, categories, featured products
- [x] Hierarchical category browser (11 main + 44 subcategories)
- [x] Product listing with infinite scroll & sort
- [x] Product detail with image carousel, specs, reviews
- [x] Cart with quantity controls & order summary
- [x] Wishlist with persistence
- [x] Multi-step checkout (address, shipping, payment, review)
- [x] Payment methods: MoMo, Cash on Delivery, Card (DPO)
- [x] TVA 18% calculation + free shipping threshold
- [x] Login / Register with form validation
- [x] Full-text search with recent searches
- [x] Seller registration
- [x] Floating WhatsApp button (always visible)
- [x] Trust badges (Quality, Fast Delivery, 3-Day Return, 24/7 Support)
- [x] Pull-to-refresh on product lists
- [x] Badge counts on cart/wishlist tabs
- [x] Deep linking (olado://product/[id])
- [x] Offline cart/wishlist persistence (AsyncStorage)
- [x] RWF currency formatting
- [x] Placeholder images (swap for real CDN)
- [x] NativeWind theming (Olado brand colors)

## Connecting a Real Backend

The mock API is in `src/api/client.ts`. To connect a real backend:

### 1. Create the API client

```typescript
// src/api/client.ts

const API_BASE = "https://api.olado.rw/v1";

export async function fetchProducts(page: number = 1, limit: number = 20) {
  const res = await fetch(`${API_BASE}/products?page=${page}&limit=${limit}`);
  return res.json();
}

export async function fetchProductById(id: string) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  return res.json();
}

// ... same pattern for all functions
```

### 2. Add authentication

```typescript
// Update src/stores/authStore.ts to use real JWT tokens
// Store token in AsyncStorage, send via Authorization header
```

### 3. Payment integration

```typescript
// For DPO (card payments):
// - Integrate DPO Pay API
// - For MoMo: Use MTN MoMo API or Flutterwave
// - For COD: Just mark order as "pending payment"
```

### 4. Image hosting

Replace placeholder URLs with your CDN:
```
https://placehold.co/600x600 → https://cdn.olado.rw/products/{id}/main.jpg
```

## Mock Data

- **32 products** across 11 categories with realistic Rwandan marketplace items
- Prices in RWF (12,000 - 650,000 range)
- Products include: sandals, water dispensers, baby sets, coat racks, organic berries, phones, laptops, furniture, cookware, Imigongo art, etc.
- 3 out-of-stock products for testing
- Sale prices on some products (compareAtPrice)

## WhatsApp Integration

All screens have access to the floating WhatsApp button:
- Link: `https://wa.me/250783229174`
- Pre-filled messages with product names on product detail page
- Contact support from profile.

## License

Private - Olado Rwanda
