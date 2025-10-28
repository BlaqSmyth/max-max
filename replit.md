# Co-op Grocery Store E-commerce Platform

## Overview

This is a complete clone of the Co-op grocery store website (shop.coop.co.uk) featuring all the sophistication and features of the original site. The application provides a comprehensive online grocery shopping experience with home delivery, click & collect, membership benefits, time slot booking, advanced search with autocomplete, product filtering, and a complete checkout flow.

The platform is built as a monorepo with a React frontend and Express backend, using PostgreSQL for data persistence. The application features Co-op's signature blue (#0086CE) and white branding with a clean, modern design optimized for both desktop and mobile shopping experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: 
  - React Context API for cart management (`CartProvider`)
  - TanStack Query (React Query) for server state and data fetching
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library

**Design System:**
- Custom color theming with CSS variables supporting light/dark modes
- Typography based on Inter font family
- Responsive grid systems for product displays (2-5 columns based on viewport)
- Consistent spacing using Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Container max-width of 7xl for main content, 4xl for checkout flows

**Key Frontend Patterns:**
- Component-based architecture with reusable UI primitives
- Global cart state management via CartContext (React Context API)
- Mock data layer (`mockData.ts`) for development without backend
- Path aliases for clean imports (`@/`, `@shared/`, `@assets/`)
- Form validation using React Hook Form with Zod resolvers

**Cart State Management:**
- CartContext provides global cart state across all pages
- CartProvider wraps the entire application in App.tsx
- Cart operations: addToCart, updateQuantity, clearCart, getProductQuantity
- Cart state persists from HomePage to CheckoutPage via context
- Cart is cleared automatically after successful order placement

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **ORM**: Drizzle ORM with PostgreSQL driver
- **Database**: PostgreSQL (via @neondatabase/serverless)
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

**API Design:**
- RESTful API with `/api` prefix for all application routes
- Centralized route registration in `server/routes.ts`
- Request/response logging middleware for API endpoints
- JSON body parsing with raw body preservation for webhook support

**Storage Layer:**
- Abstract storage interface (`IStorage`) for CRUD operations
- In-memory implementation (`MemStorage`) for development
- Database-backed implementation ready via Drizzle ORM
- Storage abstraction allows easy swapping between implementations

### Data Architecture

**Database Schema** (defined in `shared/schema.ts`):

**Users Table:**
- `id`: UUID primary key (auto-generated)
- `username`: Unique text field
- `password`: Text field (should be hashed in production)

**Products Table:**
- `id`: Varchar primary key
- `name`: Product name
- `description`: Optional product description
- `category`: Product category (produce, meat, bakery, dairy, alcohol, ready-meals)
- `price`: Decimal price (10,2 precision)
- `memberPrice`: Optional member-exclusive price
- `image`: Image URL/path
- `inStock`: Integer flag (1 = in stock, 0 = out of stock)

**Additional Types:**
- `CartItem`: Client-side type combining Product with quantity
- Zod schemas for insert validation (`insertUserSchema`, `insertProductSchema`)

**Data Flow:**
- Shared schema between frontend and backend via `shared/` directory
- Type-safe data models using Drizzle ORM's type inference
- Validation at API boundaries using Zod schemas

### Build & Development System

**Development:**
- Vite development server with HMR
- Custom Vite middleware integration with Express
- TypeScript compilation without emit (type checking only)
- Replit-specific plugins for development tooling

**Production Build:**
- Frontend: Vite build to `dist/public`
- Backend: esbuild bundling server code to `dist`
- Database migrations via Drizzle Kit push command
- Single production process serving static files and API

**Environment:**
- `NODE_ENV` for environment detection
- `DATABASE_URL` for PostgreSQL connection (required)
- Development vs production conditional plugin loading

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (via Wouter)
- **Build Tools**: Vite, esbuild, TypeScript
- **Node.js Framework**: Express.js with middleware support

### UI Component Library
- **Radix UI**: Complete set of unstyled, accessible UI primitives
  - Accordion, Alert Dialog, Aspect Ratio, Avatar
  - Checkbox, Dialog, Dropdown Menu, Popover
  - Navigation Menu, Select, Slider, Tabs, Toast
  - And 15+ other accessible components
- **shadcn/ui**: Pre-styled component implementations using Radix UI
- **Styling**: Tailwind CSS with PostCSS, Autoprefixer
- **Utility Libraries**: clsx, class-variance-authority for conditional styling

### Data & State Management
- **TanStack Query v5**: Server state management and data fetching
- **React Hook Form**: Form state management with @hookform/resolvers
- **Zod**: Schema validation and type inference

### Database & ORM
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect
- **drizzle-zod**: Zod schema generation from Drizzle tables
- **@neondatabase/serverless**: PostgreSQL client for Neon database
- **connect-pg-simple**: PostgreSQL session store for Express

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **cmdk**: Command menu component
- **embla-carousel-react**: Carousel/slider functionality

### Development Tools
- **Replit Plugins**: Cartographer, dev banner, runtime error modal
- **Drizzle Kit**: Database migration management
- **tsx**: TypeScript execution for development server

### Asset Management
- Static assets stored in `attached_assets/generated_images/`
- Vite alias `@assets` for convenient image imports
- Product images use PNG format with descriptive generated filenames

## Implemented Features

### Core Shopping Experience
- **Product Browsing**: Grid layout with 2-5 columns responsive to viewport size
- **Product Cards**: Display product image, name, price, member price, and quantity selector
- **Product Detail Modal**: Full product information including nutritional details, ingredients, allergens, and image gallery
- **Category Navigation**: Browse products by category (Produce, Meat, Bakery, Dairy, Alcohol, Ready Meals)
- **Search with Autocomplete**: Real-time search with dropdown showing product suggestions, images, and prices
- **Product Filters**: Filter by dietary preferences (Vegan, Gluten-Free, Organic) and sort by price, name, or featured
- **Member Pricing**: Toggle to show/hide Co-op member exclusive prices

### Shopping Cart & Checkout
- **Cart Context**: Global cart state management using React Context API
- **Cart Sheet**: Slide-out panel showing cart items, quantities, and totals
- **Persistent Cart**: Cart items persist from HomePage to CheckoutPage via shared context
- **Complete Checkout Flow**:
  - Delivery address form with validation
  - Time slot selection for delivery or collection
  - Payment details form
  - Order summary with itemized costs
  - Order confirmation and cart clearing

### Delivery & Collection
- **Delivery Options**: Choose between home delivery or click & collect
- **Time Slot Picker**: Calendar-based interface to select delivery/collection date and available time slots
- **Store Locator**: Search for nearby Co-op stores with distance information and opening hours

### Membership Features
- **Digital Membership Card**: Display Co-op membership card with barcode and member number
- **Member Benefits**: Show member-exclusive pricing and savings
- **Offers Carousel**: Weekly deals and promotional offers with discount badges

### Mobile Responsiveness
- **Mobile Menu**: Hamburger menu with navigation links and account options
- **Touch Interactions**: Optimized touch targets for mobile shopping
- **Responsive Layout**: Adapts seamlessly from mobile (320px) to desktop (1920px+)

### UI Components
- **Header**: Logo, search with autocomplete, account menu, cart with item count
- **Hero Section**: Featured promotional banner with call-to-action
- **Category Navigation**: Horizontal scrollable category selector
- **Product Filters**: Sidebar filters with dietary preferences and sorting options
- **Offers Carousel**: Auto-scrolling promotional offers with manual navigation
- **Footer**: Links to help, company info, and social media

## Recent Changes (October 28, 2025)

**Cart Context Implementation:**
- Created CartContext to share cart state across all pages
- Wrapped entire app with CartProvider in App.tsx
- Both HomePage and CheckoutPage now use useCart() hook to access shared cart state
- Fixed critical issue where checkout wasn't receiving actual cart items

**Search Integration:**
- Integrated SearchAutocomplete component directly in Header
- Search now works globally across all pages
- Autocomplete dropdown shows product images, names, and prices
- Clicking a search result opens the product detail modal

**Checkout Flow Completion:**
- Checkout page now displays actual cart items from CartContext
- Order summary shows live totals matching cart contents
- Cart is cleared after successful order placement
- User is redirected back to homepage with empty cart

**End-to-End Testing:**
- Verified complete checkout flow with Playwright tests
- Cart operations work correctly: add, update, checkout, clear
- All user interactions tested: product selection, cart management, order placement

### Notable Architectural Decisions

**Monorepo Structure:**
- Chosen to share TypeScript types between frontend and backend
- `shared/` directory contains database schema and common types
- Enables type-safe API development without duplication

**React Context for Cart State:**
- CartContext provides global cart state instead of prop drilling
- Single source of truth for cart items across all pages
- Enables consistent cart operations throughout the application
- Supports future cart persistence between sessions

**In-Memory Storage Fallback:**
- Provides development experience without database setup
- Easy migration path to database-backed storage
- Interface-based design allows dependency injection

**Mock Data Layer:**
- Comprehensive mock products and offers for frontend development
- Marked with `todo: remove mock functionality` comments
- Enables rapid UI iteration without backend implementation
- Ready to be replaced with real API calls

**Middleware-Mode Vite:**
- Integrates Vite dev server with Express in development
- Single port for both frontend and backend during development
- Simplifies CORS and authentication workflows

## Next Steps (Optional Improvements)

1. **Cart Persistence**: Consider persisting cart state to localStorage for session recovery
2. **Automated Testing**: Add more automated tests covering cart context interactions
3. **Performance Monitoring**: Monitor SearchAutocomplete performance with real data
4. **Interactive Map**: Add interactive map to store locator page
5. **Backend Integration**: Replace mock data with real API endpoints
6. **User Authentication**: Implement full user authentication and account management
7. **Payment Integration**: Add real payment processing (Stripe/PayPal)
8. **Order Tracking**: Implement order history and tracking features