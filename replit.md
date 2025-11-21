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