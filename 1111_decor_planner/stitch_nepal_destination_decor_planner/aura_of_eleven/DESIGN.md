---
name: Aura of Eleven
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#d1cec9'
  on-tertiary: '#31312d'
  tertiary-container: '#b5b3ae'
  on-tertiary-container: '#464541'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e5e2dc'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c18'
  on-tertiary-fixed-variant: '#474743'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  champagne-gold: '#E6BE8A'
  charcoal-surface: '#242424'
  cream-contrast: '#FFFDF5'
  muted-gold: '#A68931'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  stack-lg: 64px
  stack-md: 32px
  stack-sm: 16px
---

## Brand & Style

This design system embodies the peak of celebratory luxury. It is crafted to evoke feelings of exclusivity, meticulous attention to detail, and professional reliability. The target audience includes high-net-worth individuals and corporate entities looking for turnkey event masterpieces in Nepal.

The visual style is **Minimalist with Tactile accents**. It leverages expansive whitespace (or "dark space" in dark mode) to allow high-resolution event photography to shine. The design narrative uses "Gold" as a symbol of excellence and "Charcoal" as a symbol of grounding and authority. Subtle glassmorphism and thin, elegant strokes provide a modern architectural feel to the interface.

## Colors

The palette is anchored by **Elegant Gold**, used strategically for interactive elements and brand accents. The default mode is **Dark**, which provides a cinematic backdrop that makes gold elements and photography pop.

- **Primary (Gold):** Used for primary CTAs, active states, and decorative flourishes.
- **Secondary (Charcoal):** Used for surface layering and container backgrounds.
- **Tertiary (Cream):** Reserved for high-contrast text and delicate separators.
- **Neutral (Black):** The core background color to ensure a high-end, immersive experience.

## Typography

The typography system pairs the literary elegance of **Playfair Display** with the technical precision of **Hanken Grotesk**. 

- **Headlines:** Always serif. Use for emotional hooks, section titles, and event names. Use ample line height to maintain a breezy, luxury feel.
- **Body & Interface:** Always sans-serif. Used for pricing, descriptions, and navigation. 
- **Labels:** Small caps with increased letter spacing (tracking) should be used for metadata like "LOCATION" or "PRICE" to mimic high-end fashion editorial styling.

## Layout & Spacing

The design system utilizes a **12-column fixed grid** for desktop, transitioning to a fluid single-column layout for mobile. 

- **Generous Breathing Room:** Sections should be separated by a minimum of 120px on desktop to ensure the content doesn't feel cluttered.
- **The "Editorial" Offset:** Large images may occasionally break the grid or overlap slightly with text blocks to create a more dynamic, "magazine-style" flow.
- **Alignment:** Core content is centered, but decorative gold lines may extend to the edge of the viewport to create a sense of infinite scale.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** rather than heavy shadows. 

- **Surface Levels:** The base background is `#0F0F0F`. Cards and secondary containers use `#1A1A1A`. Hover states slightly lighten the surface to `#242424`.
- **Glassmorphism:** Navigation bars and floating booking prompts use a `Backdrop Blur (20px)` with a `10% white tint` to maintain context of the underlying imagery.
- **Outlines:** Instead of shadows, use `0.5px` gold or charcoal borders for cards to give them a "jewelry-box" precision.

## Shapes

The shape language is **Soft and Architectural**. 

- **Cards & Inputs:** Use a subtle `0.25rem` (4px) radius. This provides a professional edge that is softer than a hard corner but more serious than a "bubbly" rounded design.
- **Buttons:** Primary CTAs should be sharp-cornered or very minimally rounded to maintain a sense of formal elegance.
- **Badges:** Destination and status badges use the same subtle rounding to remain consistent with card containers.

## Components

- **Event Cards:** Image-heavy with a charcoal overlay. Titles appear in Playfair Display. Pricing and "Book Now" prompts are hidden until hover, creating a clean gallery look.
- **Destination Badges:** Small, gold-bordered labels with uppercase sans-serif text (e.g., "KATHMANDU") placed in the top-right corner of destination images.
- **Booking Forms:** High-contrast inputs with charcoal backgrounds and bottom-only gold borders. When focused, the border glows subtly.
- **Buttons:**
    - *Primary:* Solid Gold background with Black text. 
    - *Secondary:* Transparent with a thin Gold border and Gold text (Ghost style).
- **Testimonials:** Large-scale serif quotes in Cream text, centered, with a small gold divider below to separate the quote from the author’s name.
- **Location Badges:** Circular or pill-shaped with a gold outline, used specifically on destination-specific cards.