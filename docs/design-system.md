# Resume Design System

This resume uses a compact, Tufte-inspired visual system. The old prototype
reference files are intentionally not part of the app; the production source of
truth is now:

- `src/style/tokens.css` for color, type, spacing, and semantic defaults.
- `src/style/resume.css` for resume-specific layout, responsive behavior, and
  print rules.
- `src/assets/favicon.svg` for the current accent-square favicon.

## Principles

- Information density first. Every visible mark should help scanning or
  comprehension.
- Hairline rules over boxes. Use `--rule` and `--rule-strong` before adding
  filled containers.
- One accent. The red accent marks current or selected information; it should
  not become a broad background fill.
- Type carries hierarchy. Use size, weight, case, and mono labels before adding
  decorative layout.
- Mono for data. Dates, skills, labels, axis ticks, and compact controls use
  `var(--font-mono)`.
- No shadows, gradients, emoji, or decorative cards.
- Practical UI affordances are allowed when they make repeated use clearer:
  small buttons, focus rings, hover color, native disclosures.

## Type And Color

- Primary font: Geist.
- Mono font: Geist Mono.
- Dark default: warm near-black `--bg` with warm paper text `--fg`.
- Light mode: cream paper `--bg` with near-black `--fg`.
- Accent: restrained red, used sparingly.

## Resume-Specific Rules

- The web view may be fuller and more personal than the PDF.
- The PDF should stay linear, selectable, and easy for ATS parsers to read.
- `skippable` entries and `[skip]` bullets remain visible on the web but are
  omitted from print/PDF.
- The timeline is a navigation aid, not a second content surface. It stays
  compact, sticky in the wide sidebar, and inline after the profile on narrow
  screens.
