# Max & Max Grocery Store E-commerce Platform

## Overview
This project is an e-commerce platform for Max & Max Grocery Store, offering a comprehensive online shopping experience. Key features include home delivery, click & collect, membership benefits, time slot booking, advanced search with autocomplete, product filtering, and a complete checkout flow. The platform utilizes Max & Max's signature green branding, providing a clean, modern, and responsive design for both desktop and mobile users. The business vision is to provide a sophisticated and user-friendly online grocery solution with significant market potential for enhancing customer convenience and expanding reach.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Technology Stack**: React 18 (TypeScript), Wouter for routing, React Context API for cart, TanStack Query for server state, Tailwind CSS with a custom design system, Radix UI and shadcn/ui for components.
- **Design System**: Custom color theming (Max & Max green: #228B5C) with light/dark modes, Inter font, responsive grid layouts, consistent spacing, and defined container max-widths.
- **Key Patterns**: Component-based architecture, global cart state via CartContext, mock data layer for development, path aliases, and form validation with React Hook Form/Zod.
- **Cart Management**: Global state managed by `CartContext` for operations like adding, updating, clearing items, and persistence through checkout.

### Backend
- **Technology Stack**: Node.js with Express.js (TypeScript), Drizzle ORM with PostgreSQL (via @neondatabase/serverless), and connect-pg-simple for session management.
- **API Design**: RESTful API (`/api` prefix), centralized route registration, request/response logging, and JSON body parsing.
- **Storage Layer**: Abstracted `IStorage` interface with an in-memory development implementation and a Drizzle ORM-backed database implementation.

### Data Architecture
- **Database Schema**: Defined in `shared/schema.ts`, includes `Users` (id, username, password) and `Products` (id, name, description, category, price, memberPrice, image, inStock).
- **Type Safety**: Shared schema between frontend and backend, type-safe models using Drizzle ORM, and Zod for API boundary validation.

### Build & Development
- **Development**: Vite development server with HMR, integrated with Express, TypeScript for type checking.
- **Production**: Vite builds frontend to `dist/public`, esbuild bundles backend, Drizzle Kit for migrations.
- **Environment**: Configured with `NODE_ENV` and `DATABASE_URL`.

### Core Features
- **Product Browsing**: Responsive grid layout, product cards with details, product detail modals, category navigation, search with autocomplete, and filters (dietary, sort options).
- **Shopping Cart & Checkout**: Global cart state, cart sheet, persistent cart to checkout, complete checkout flow (address, time slot, payment, order summary), and order confirmation.
- **Delivery & Collection**: Options for home delivery or click & collect, time slot picker, and store locator.
- **Membership**: Digital membership card, member-exclusive pricing, and offers carousel.
- **Mobile Responsiveness**: Optimized for various screen sizes with a mobile menu and touch interactions.
- **UI Components**: Header with search and cart, hero section, category navigation, product filters, offers carousel, and footer.

## External Dependencies

### Core Technologies
- **Frontend**: React 18, React DOM, Wouter, Vite, TypeScript.
- **Backend**: Node.js, Express.js, TypeScript, esbuild.

### UI/Styling
- **Components**: Radix UI (unstyled primitives), shadcn/ui (styled components).
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer.
- **Utilities**: clsx, class-variance-authority.

### Data & State Management
- **Server State**: TanStack Query v5.
- **Form Management**: React Hook Form, @hookform/resolvers.
- **Validation**: Zod, drizzle-zod.

### Database
- **ORM**: Drizzle ORM.
- **PostgreSQL**: @neondatabase/serverless.
- **Session Store**: connect-pg-simple.

### Utility Libraries
- date-fns, nanoid, cmdk, embla-carousel-react.

### Development Tools
- Replit Plugins (Cartographer, dev banner, runtime error modal), Drizzle Kit, tsx.

## Recent Changes (November 21, 2025)

### Frontend Now Uses Live API Data (Evening Update)

**Critical Fix: Products from Admin CMS Now Appear on Site**
- Refactored HomePage to fetch products from `/api/products` endpoint using TanStack Query
- Removed dependency on mock data - all products now come from the backend database
- Products added via Admin CMS now immediately appear on the public-facing site
- Implemented proper loading and error states for data fetching

**Technical Implementation:**
- Added `useQuery<Product[]>` hook with queryKey `["/api/products"]`
- Implemented `useMemo` for filtered and sorted products to optimize performance
- Type conversions: Decimal strings from database converted to numbers for display (`Number(product.price)`)
- Updated ProductCard with defensive type handling to prevent runtime errors
- All components (Header search, ProductDetailModal, CartSheet) now use fetched data

**Data Flow:**
1. Backend returns products with decimal string prices (e.g., "2.29")
2. HomePage converts to numbers when passing to display components
3. Cart operations use converted number prices
4. Products filter and sort correctly with numeric conversions

**Testing:**
- E2E test confirmed: Products load from API, filtering works, cart operations functional
- Verified: Pepsi product added via CMS appears correctly in beverages category
- Prices display accurately: £2.29 regular, £1.99 member price

**Future Improvements (from Architect):**
- Consider query invalidation after admin mutations for automatic refresh
- Monitor API fetch failures in production
- Incorporate dietary filters when implemented

### Admin CMS Decimal Validation & Image Upload Fixes

**Object Storage Configuration:**
- Configured object storage for product image uploads
- Environment variables set: `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`, `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- Added static file serving for `/attached_assets/` directory to serve seeded product images
- Images upload to `/public-objects/products/` for newly created products

**Decimal Precision Fixes:**
- Fixed critical decimal precision loss issue in ProductDialog.tsx
- Changed price and memberPrice inputs from `type="number"` to `type="text"` with pattern validation
- Pattern: `^\d+(\.\d{1,2})?$` ensures proper decimal format with up to 2 decimal places
- Added `inputMode="decimal"` for optimal mobile keyboard experience
- Decimal values now preserve trailing zeros (e.g., "5.10" stays "5.10" not "5.1")

**Comprehensive Form Validation:**
- Implemented `validateFormData()` function with runtime validation before submission
- Price validation: Must match regex `/^\d+(\.\d{1,2})?$/` with clear error messages
- Member price validation: Same format validation when provided (optional field)
- Stock validation: `parseInt(value, 10)` with NaN check, must be positive integer
- Empty memberPrice properly omitted from payload instead of sending empty string
- All text fields trimmed before submission to prevent whitespace issues

**Data Integrity:**
- Fixed schema mismatch: Backend decimal type expects strings, not numbers
- Proper handling of optional memberPrice field (omitted when empty)
- parseInt now uses explicit radix (10) to prevent unexpected parsing behavior
- Validation errors display user-friendly toast messages

**Image Upload UX Improvement:**
- Simplified workflow: Images auto-upload when clicking "Save Product"
- Removed confusing separate "Upload" button
- Clear upload progress indicators ("Uploading image..." state)

**Testing:**
- Comprehensive E2E test validates decimal precision preservation
- Verified invalid input rejection (non-decimal, invalid stock)
- Confirmed data persists correctly across edits
- All validation working as expected

### Technical Details

**Product Schema (shared/schema.ts):**
- `price`: decimal type (string format, e.g., "5.10")
- `memberPrice`: optional decimal type (string format)
- `inStock`: integer type (0 or 1)

**Validation Flow:**
1. User enters data in form (type="text" inputs with HTML5 pattern hints)
2. On submit, `validateFormData()` runs runtime validation
3. Invalid data blocked with toast error message
4. Valid data trimmed and formatted into payload
5. Optional fields omitted if empty
6. Mutation sends validated data to backend

**Key Files Modified:**
- `client/src/components/ProductDialog.tsx`: Validation and input type fixes
- `server/routes.ts`: Static file serving for attached_assets
- Product data preserved with exact decimal precision as required for retail pricing