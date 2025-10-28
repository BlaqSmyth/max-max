# Design Guidelines for Co-op Grocery Store Clone

## Design Approach

**Selected Approach:** Reference-Based (E-commerce Category)

Drawing inspiration from modern grocery e-commerce leaders (Instacart, Ocado, Tesco) combined with mainstream e-commerce patterns (Amazon, Shopify), with emphasis on clean, accessible grocery shopping experiences. The design prioritizes product discovery, efficient cart management, and trust-building through clear information hierarchy.

**Core Principles:**
- Product-first visual hierarchy with prominent imagery
- Clean, spacious layouts that reduce cognitive load during shopping
- Trust indicators and membership value prominently displayed
- Efficient navigation between categories and quick-add functionality
- Mobile-optimized for on-the-go grocery shopping

## Typography

**Font Selection:** 
- Primary: Inter or Source Sans Pro (modern, highly readable sans-serif)
- Headings: Medium to Bold weights (500-700)
- Body: Regular weight (400)
- UI Elements: Medium weight (500)

**Type Scale:**
- Hero Headlines: text-5xl to text-6xl (bold)
- Section Headers: text-3xl to text-4xl (semibold)
- Product Names: text-lg to text-xl (medium)
- Category Labels: text-sm uppercase tracking-wide (semibold)
- Body Text: text-base (regular)
- Prices: text-lg to text-2xl (bold for main price, regular for crossed-out original)
- Small Print/Labels: text-xs to text-sm (regular)

## Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, and 24 for consistent rhythm.
- Component internal padding: p-4 to p-6
- Section spacing: py-12 to py-20
- Grid gaps: gap-4 to gap-8
- Card padding: p-4 to p-6

**Container Strategy:**
- Max width: max-w-7xl for main content
- Full-width headers/footers with inner max-w-7xl containers
- Product grids: max-w-7xl with responsive columns
- Checkout flow: max-w-4xl for focused experience

**Grid Systems:**
- Product Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Category Grid: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Featured Products: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Checkout Steps: Single column on mobile, 2-column (cart + summary) on desktop

## Component Library

### Navigation
**Main Header:**
- Sticky top navigation with logo left, search bar center, cart/account icons right
- Secondary navigation below with category mega-menu
- Delivery address selector prominently displayed
- Cart icon with item count badge
- Height: h-16 for main bar, h-12 for category bar

**Category Navigation:**
- Horizontal scrollable category pills on mobile
- Mega-menu dropdown on desktop revealing subcategories in multi-column grid
- Category icons paired with labels

### Product Cards
**Standard Product Card:**
- Aspect ratio 3:4 product image
- "Add to basket" button overlay on image hover (desktop) or always visible (mobile)
- Product name (2 lines max, truncate)
- Price display with member price highlighted
- Quantity selector appears after first add
- Optional promotional badge (top-left corner)
- Border and subtle shadow on hover
- Padding: p-4

**Featured Product Card:**
- Larger image (16:9 or 1:1 aspect)
- More descriptive text (3-4 lines)
- Prominent CTA button below
- Used for hero promotions and deals sections

### Shopping Cart
**Mini Cart (Dropdown):**
- Right-aligned dropdown from cart icon
- Product thumbnails with name, quantity, price
- Scrollable list (max-h-96)
- Running subtotal at bottom
- "View basket" and "Checkout" CTAs

**Full Cart Page:**
- 2-column layout (desktop): Product list left (67%), Order summary right (33%)
- Product rows with thumbnail, name, quantity selector, price, remove button
- "Continue shopping" and "Proceed to checkout" buttons
- Delivery threshold indicator ("Add £X more for free delivery")

### Membership Components
**Member Pricing Badge:**
- Small pill-shaped badge on product cards
- Shows member price vs. regular price
- Consistent placement (bottom of card or near price)

**Membership Benefits Bar:**
- Horizontal banner below main navigation or above footer
- Icons + brief benefit descriptions
- "Join for £1" CTA button

### Delivery & Collection Selector
**Time Slot Picker:**
- Calendar view for date selection
- Grid of available time slots (2-hour windows)
- Visual indicators: available, popular, unavailable
- Selected slot highlighted
- Price differences shown per slot

### Checkout Flow
**Multi-Step Checkout:**
- Progress indicator at top (Delivery → Payment → Review)
- Single column on mobile, 2-column on desktop
- Sticky order summary sidebar (desktop)
- Clear "Edit" links to return to previous steps
- Large, prominent "Place Order" button

### Search
**Search Bar:**
- Prominent placement in header
- Auto-suggest dropdown with product images
- Category filtering within search
- Recent searches displayed when empty

### Product Detail Page
**Layout:**
- 2-column: Image gallery left (50-60%), Product info right (40-50%)
- Image gallery with thumbnails and zoom capability
- Product name, price, member price, ratings
- "Add to basket" sticky on mobile scroll
- Tabs for: Description, Nutritional Info, Allergens, Reviews
- "You might also like" carousel below

### Store Locator
**Layout:**
- 2-column: Map left (60%), Store list right (40%)
- Search by postcode input prominently placed
- Filter options: Delivery, Click & collect, Services available
- Store cards showing: Name, distance, opening hours, available services
- "Set as my store" action

## Images

### Hero Section
**Main Hero:**
- Full-width hero image showcasing fresh produce or seasonal offerings
- Aspect ratio: 21:9 on desktop, 16:9 on tablet, 4:3 on mobile
- Text overlay with headline + CTA on translucent overlay or blurred background
- Minimum height: h-96 on desktop

### Product Images
**Quality Requirements:**
- Clean, white background product photography
- Consistent lighting and styling
- Multiple angles available in product detail view
- Fallback placeholder for missing images

### Category Banners
- Horizontal banners for category landing pages
- 16:9 or 21:9 aspect ratio
- Category name overlay with subtle gradient
- Height: h-48 to h-64

### Promotional Sections
- Featured deals sections with 2-3 column image cards
- Lifestyle imagery showing products in use
- Seasonal campaign imagery in hero rotator

## Key Page Structures

### Homepage
1. Hero banner with seasonal promotion (h-96, full-width)
2. Quick category navigation grid (6-8 categories, icons + labels)
3. Member benefits banner
4. Featured products carousel ("Weekly offers")
5. Shop by category grid (3 columns desktop)
6. Delivery options overview cards (3 columns)
7. Co-op values/community section
8. Newsletter signup + Footer

### Category Page
1. Category banner with breadcrumbs
2. Filters sidebar (left, collapsible on mobile)
3. Product grid (4-5 columns desktop, 2 mobile)
4. Sorting dropdown (top-right)
5. Pagination or infinite scroll

### Product Detail Page
1. Breadcrumbs
2. 2-column layout (image gallery + product info)
3. Related products carousel
4. Reviews section
5. Recently viewed products

### Checkout Pages
1. Cart page (2-column: items + summary)
2. Delivery/Collection selection (time slot picker)
3. Payment details (single column, max-w-2xl)
4. Order confirmation (centered, max-w-3xl)

## Accessibility & Performance
- Minimum touch target size: 44x44px for all interactive elements
- Form inputs with clear labels and error states
- Skip navigation links
- Loading states for async operations (skeleton screens for product grids)
- Optimized images with lazy loading
- Clear focus indicators for keyboard navigation