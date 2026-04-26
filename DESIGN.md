---
name: Amen+
description: Faith-inspired Ghanaian lifestyle apparel brand — where the Gospel meets premium streetwear.
version: alpha
colors:
  primary: "#5C3A2D"
  primary-light: "#8B6B4D"
  primary-dark: "#3A2019"
  gold: "#D4AF37"
  gold-dark: "#C5A028"
  cream: "#FDF6F0"
  cream-light: "#FAF0E6"
  white: "#FFFFFF"
  text-dark: "#2C2C2C"
  text-soft: "#4A4A4A"
  text-light: "#F5F5F5"
  whatsapp: "#25D366"
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 4.2rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Playfair Display
    fontSize: 3.5rem
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Playfair Display
    fontSize: 2.8rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  h3:
    fontFamily: Playfair Display
    fontSize: 1.8rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: Inter
    fontSize: 1.1rem
    fontWeight: 400
    lineHeight: 1.8
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.7
  body-sm:
    fontFamily: Inter
    fontSize: 0.9rem
    fontWeight: 400
    lineHeight: 1.6
  label-caps:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 700
    letterSpacing: 0.15em
  price:
    fontFamily: Inter
    fontSize: 1.4rem
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: 8px
  md: 16px
  lg: 20px
  xl: 25px
  pill: 50px
  circle: 50%
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  xxl: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: 16px 40px
  button-primary-hover:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.primary}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: 16px 40px
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 12px 30px
  button-gold-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
  nav-link:
    textColor: "{colors.text-soft}"
    typography: body-md
  nav-link-active:
    textColor: "{colors.primary}"
  product-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.xl}"
  cart-sidebar:
    backgroundColor: "{colors.white}"
    width: 420px
  badge-preorder:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.gold}"
    rounded: "{rounded.pill}"
    typography: label-caps
---

## Overview

Amen+ occupies the intersection of **faith, Ghanaian culture, and streetwear premium-ness**. The design language is warm, elevated, and intentional — evoking a luxury boutique that also carries a message.

The feel is closer to a high-end editorial brand than a generic e-commerce store. Think deep mahogany wood, burnished gold accents, and crisp cream paper — the aesthetic of a beautifully bound Bible crossed with a premium fashion lookbook.

Every visual decision should reinforce two truths:
1. **This is premium.** Quality materials, quality design.
2. **This has meaning.** The brand exists to feed the homeless and spread the Gospel.

## Colors

The palette is deliberately warm and rich, avoiding the cold blues and greys of generic DTC brands.

- **Primary (`#5C3A2D`)** — Deep mahogany brown. The core brand color. Used for headlines, primary buttons, and major UI elements. Evokes warmth, groundedness, and heritage.
- **Primary Light (`#8B6B4D`)** — Coffee brown. Used for secondary text, hover backgrounds, and gradient partners. Softens the deep primary.
- **Primary Dark (`#3A2019`)** — Espresso. Used for gradient darks on hero sections and focus states.
- **Gold (`#D4AF37`)** — The faith accent. Represents divine light, excellence, and blessing. Appears on cross decorations, price text, active states, badges, and border highlights. Use intentionally — don't overwhelm the palette.
- **Gold Dark (`#C5A028`)** — Slightly deeper gold for pressed/active states on gold buttons.
- **Cream (`#FDF6F0`)** — Page background. Warm off-white, not harsh. Creates a natural, organic feel.
- **Cream Light (`#FAF0E6`)** — Slightly lighter warm white used for section alternation and card backgrounds.
- **Text Soft (`#4A4A4A`)** — Default body text. Dark enough to read easily against cream, light enough to feel approachable.

## Typography

Two typefaces in deliberate contrast:
- **Playfair Display** — All headings. Serif with editorial gravitas. Conveys heritage, authority, and faith. Pairs perfectly with the "luxury faith brand" concept.
- **Inter** — All body text, UI labels, prices, buttons. A modern, highly-readable geometric sans-serif. Grounded and clean.

The contrast between a classic serif headline and a modern sans body is the typographic equivalent of the brand's message: ancient faith, contemporary expression.

**H1 rendering note:** On dark/hero backgrounds, `h1` should render as solid white (`#FFFFFF`) with a subtle text shadow — never as a gradient clip. The gradient clip style applies only to body-on-cream contexts. This distinction must be applied per-context, not globally.

## Layout

- **Max content width:** 1300px, centered with `margin: 0 auto`.
- **Section padding:** 5rem vertical (`{spacing.xxl}` = 80px) on desktop, 3rem on mobile.
- **Grid:** CSS Grid with `repeat(auto-fill, minmax(280px, 1fr))` for product grids — fully responsive without fixed breakpoint juggling.
- **Navbar height:** ~70–80px. Logo image max-height `60px` on desktop, `45px` on mobile.
- **Sticky nav:** `position: sticky; top: 0` with a frosted glass effect: `backdrop-filter: blur(12px)`, `background: rgba(255,255,255,0.95)`.

## Elevation & Depth

Three shadow tiers:
- **Resting card:** `0 10px 30px rgba(92, 58, 45, 0.12)` — Warm brown shadow, subtle depth.
- **Hover card:** `0 20px 50px rgba(92, 58, 45, 0.22)` — Pronounced lift on hover.
- **Gold glow:** `0 0 25px rgba(212, 175, 55, 0.35)` — Used sparingly on focused/active gold elements.

Always use warm (brown-toned) shadows — never pure black or grey shadows. The warmth is part of the brand.

## Shapes

- **Cards:** `{rounded.xl}` (25px) — Generously rounded, premium feel.
- **Buttons:** `{rounded.pill}` (50px) — Fully pill-shaped; friendly and confident.
- **Badges / Tags:** `{rounded.pill}` — Consistent with button language.
- **Avatars:** `{rounded.circle}` (50%).
- **Modal / Drawer:** `{rounded.lg}` (20px) on the visible edge only.

## Components

### Navigation
The sticky frosted-glass navbar uses the logo on the left (image + brand name), nav links centered (desktop), and cart icon + hamburger on the right. The current page link gets an underline accent via `::after` pseudo-element in `{colors.gold}`.

On mobile (< 768px), nav links are hidden and replaced by a slide-in drawer from the right with links, social icons, and a WhatsApp contact button.

### Product Card
White card, `{rounded.xl}`, warm brown box-shadow. On hover, card lifts `translateY(-12px)` and shadow deepens. Product image scales to `1.06` on hover via `overflow: hidden` container. Price displayed in `{colors.gold}` in `{typography.price}`. A subtle gold cross decoration (`✝`) floats in the top-right at 15% opacity.

### Cart Sidebar
Slides in from the right (420px wide). Frosted glass header. Items stagger-animate on entry. Delivery zone selector uses pill-shaped toggle buttons. Gold checkout CTA button at the bottom. The "Jesus is the +" tagline appears inline in the cart header.

### Hero Section
Full-viewport section with a dark overlay on a lifestyle image. Background attachment should be `scroll` (not `fixed`) for mobile performance. Two CTA buttons side-by-side: primary (Shop Collection) and secondary (Our Story). Floating gold cross animations (`::before` / `::after`) are purely decorative — must have `pointer-events: none` applied directly, not globally to all `::before/::after`.

### Checkout Modal
A centered overlay modal with the Amen+ logo at top, fields for Name, Phone, and Email, and a "Proceed to Payment" CTA. Replaces the browser `prompt()` dialogs entirely. Validates email with `@` check and phone with numeric check before calling Paystack.

## Do's and Don'ts

**Do:**
- Use `{colors.gold}` for prices, active states, borders on focused cards, and decorative accents.
- Use warm brown shadows — always `rgba(92, 58, 45, …)` not `rgba(0,0,0,…)`.
- Italicize brand taglines and scripture quotes.
- Apply `pointer-events: none` directly to specific decorative pseudo-elements.
- Use `background-attachment: scroll` on hero sections (not `fixed`).

**Don't:**
- Use generic gray or blue colors anywhere in the UI.
- Apply `!important` overrides as a substitute for correct cascade order.
- Use `prompt()`, `alert()`, or `confirm()` in user-facing flows.
- Apply broad `animation` rules globally to `section` or `*` selectors.
- Use `pointer-events: none !important` on all `::before` / `::after` globally.
- Make the navbar logo image taller than 60px on desktop.
