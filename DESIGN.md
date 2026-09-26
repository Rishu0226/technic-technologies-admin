# Technic Admin — Design

Light theme only, using the same Technic tokens as the public site. The admin is a productivity surface: white panels on `#F5FAFC`, cyan for interaction, orange only as a small accent. There is no dark mode.

## Tokens

Defined in `src/app/globals.css`. Use `technic-*` utilities and `.tn-input` / `.tn-label` instead of raw hex values in components.

| Role | Value |
| --- | --- |
| Page background | `#F5FAFC` |
| Sidebar, header, cards, tables, forms | `#FFFFFF` |
| Border | `#E5E7EB` |
| Primary text | `#1F2937` |
| Body | `#4B5563` |
| Muted | `#6B7280` |
| Active nav | `#E8F9FC` background, `#0797B2` text, `#10B8D4` left border |
| Primary action | `linear-gradient(135deg, #10B8D4, #FF8A00)` |
| Delete | `#DC2626` |

## Status

| State | Fill | Text |
| --- | --- | --- |
| Published, Hired, Responded | `#DCFCE7` | `#16A34A` |
| Draft, Read, Archived | `#F3F4F6` | `#6B7280` |
| New | `#E8F9FC` | `#0797B2` |
| Reviewing, Interview | `#FFF3E6` | `#E86F00` |
| Rejected, error | `#FEE2E2` | `#DC2626` |
| Shortlisted | `#E8F9FC` | `#0797B2` |
| Career `Closed`, and any other content status that is not `Published` | `#F3F4F6` | `#6B7280` |

The UI font is Geist (`--font-geist-sans`). Geist Mono is loaded and used on the blog content textarea. The logo is `/Assest/logo-brand.png`.

`ADMIN_IMPLEMENTATION_PLAN.md` still describes a dark glass layout. The built UI is this light system. Do not reintroduce glassmorphism.

## Layout

```text
Sidebar (fixed, 16rem, white)
Header (sticky, 4rem, white)
Main (page background, padding 1rem, 1.5rem from sm)
```

From `md` up the sidebar stays on screen and the column beside it uses `md:pl-64`. Below `md` the sidebar is off-canvas. The header menu opens it over a `technic-text/30` backdrop. Path changes close it.

There is no desktop collapsed rail.

Page titles are `text-3xl font-bold text-technic-text`. Editors are capped at `max-w-4xl` (application review `max-w-5xl`, media `max-w-6xl`).

## Header

Left: menu button below `md`, then a search field from `sm` up. The search field is not wired to data. Do not style it as a working filter until it is.

Right: a bell with an orange dot (no notification panel), then a cyan avatar and the static words “Admin” / “Superuser”, hidden below `md`.

## Sidebar

White surface, right border, logo height about 2.5rem. Group labels are `text-xs font-semibold uppercase tracking-widest text-technic-muted`.

Nav row: `rounded-xl`, `gap-3`, left border 2px. Active: `bg-technic-cyan-soft text-technic-cyan-deep border-technic-cyan`. Idle: muted text, transparent border, hover uses the same cyan soft fill.

Logout sits in the footer and turns error-colored on hover (`text-technic-error`, `bg-technic-error-soft`).

Every signed-in user sees every item. There is no permission-based nav.

## Surfaces

| Piece | Treatment |
| --- | --- |
| Card / form section | White, `border-technic-border`, `rounded-2xl`, `shadow-tn-md` or `shadow-tn-sm` |
| Table shell | Same card, `overflow-x-auto` |
| Table head | `bg-technic-header` (`#F8FAFC`), muted labels, bottom border |
| Row hover | `hover:bg-technic-bg` where the list implements it |
| Login card | `rounded-3xl`, `shadow-tn-lg`, blurred cyan and orange circles behind it |
| Dashboard stat | White card, cyan icon well, optional cyan or orange dot |

Shadows from `globals.css`: `shadow-tn-sm` `0 2px 8px`, `shadow-tn-md` `0 8px 24px`, `shadow-tn-lg` `0 15px 40px`, `shadow-tn-card` `0 8px 30px`, all on `rgba(31,41,55,…)`.

## Buttons and inputs

Primary: `bg-brand-gradient text-white`, `rounded-lg` or `rounded-xl`, hover `opacity-95`, disabled `opacity-50`.

Secondary: white, gray border, hover cyan border and deep cyan text. Used for resume and preview.

Danger: icon `text-technic-error`. The confirm button is solid `#DC2626` with white text.

Inputs use `.tn-input`: full width, white, 1px `#E5E7EB`, radius `0.5rem`, padding `0.5rem 1rem`, cyan border and a 4px cyan ring on focus. Labels use `.tn-label` (`text-sm font-medium text-technic-text`).

Focus on links and buttons is a 2px cyan outline with 2px offset.

## Tables

One table per list. Columns are left aligned. Minimum width is `720px` (`760px` on solutions) so the page scrolls sideways on a phone instead of stacking rows.

There is no search row, filter bar, sort header, pagination, or bulk checkbox. Do not add those visuals without the behavior.

Row actions are Lucide icons: pencil edit, trash delete, eye view. Each icon has screen-reader text.

## Forms

Editors stack white sections with `space-y-8`. Two-column grids start at `md`.

Repeaters (features, responsibilities, FAQs) are a row of `.tn-input` plus a trash button. An empty repeater uses a short italic muted sentence.

Career application fields that are hidden drop to `opacity-60` and `bg-technic-neutral-soft`. Shown fields use `bg-technic-bg`.

The AI block is a white card with a cyan sparkle well, a prompt input, and a gradient “Generate with AI” button. The replace confirmation is a small white toast card, not a full-screen modal.

## Dialogs and toasts

`ConfirmDialog` is the only modal. MUI paper is white, text `#1F2937`, border `#E5E7EB`, radius `16px`, shadow `0 15px 40px rgba(31,41,55,0.10)`. Cancel is gray. Confirm is red.

Toasts are top-right, white, border `#E5E7EB`, shadow `0 8px 24px rgba(31,41,55,0.08)`.

Inline errors: `bg-technic-error-soft` and `text-technic-error`. Inline success (settings only): `bg-technic-success-soft` and `text-technic-success`.

## Pages

| Screen | Layout |
| --- | --- |
| Login | Centered card, logo, two fields, full-width gradient button |
| Dashboard | Title, five stat cards (`sm:2`, `lg:3`, `xl:5`), then two panels: static system status and a 2-by-2 quick-action grid |
| Lists | Title row with one gradient “Add” button (contacts and applications have no add button), then the table |
| Editors | Back arrow, title, optional AI card, then form sections, gradient save at the end |
| Service / solution preview | Narrow column, “Draft preview” eyebrow, back-to-edit link |
| Application review | Main column plus a sticky review card (`top-24`) from `lg` |
| Media | Upload card, then a `grid-cols-2 md:3 lg:4` of image tiles |
| Settings | Three stacked cards (general, contact, social) and a right-aligned save |

## Loading, empty, error

| State | What to show |
| --- | --- |
| Dashboard loading | Five `h-32` white pulse cards |
| Table loading | Centered muted “Loading …” inside the card |
| Table empty | Centered muted sentence. A failed fetch currently uses this same look |
| Editor loading | “Loading...” |
| Preview loading | “Loading preview...” |
| Field error | Small `text-technic-error` under the control |
| Page error | Full-width soft red banner |

Unauthorized users never see this chrome. `src/proxy.ts` sends them to the login page.

## Responsive

Check 375, 768, and 1280.

- Phone: one column, hidden sidebar, table scroll, stacked form actions.
- Tablet (`md`): persistent sidebar, two-column forms, user name visible.
- Desktop (`lg` / `xl`): dashboard density and the application two-column review.

## Accessibility

Keep labels on inputs, `role="alert"` on the login error, and `sr-only` names on icon-only table buttons. Do not remove the menu button’s accessible name.

## Permission-based UI

None exists. Do not fade or hide actions for “Superuser” versus another role unless a real permission field is added to the product.
