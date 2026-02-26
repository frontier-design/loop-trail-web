/**
 * Grid configuration — single source of truth for layout.
 *
 * Desktop : 6 columns
 * Tablet  : 8 columns  (≤ BREAKPOINT_TABLET)
 * Mobile  : 4 columns  (≤ BREAKPOINT)
 *
 * All pixel values are unitless numbers; append "px" in consuming code.
 * String values (e.g. ROW_GAP) already include their CSS unit.
 */

const BREAKPOINT = "950px";
const BREAKPOINT_TABLET = "1024px";
const BREAKPOINT_LARGE = "2000px";

export const GRID = {
  // ── Desktop ────────────────────────────────────────────────
  /** Number of grid columns on desktop */
  COLUMNS: 6,
  /** Maximum content width (px) */
  MAX_WIDTH: 1700,
  /** Horizontal page padding (px) */
  PADDING: 50,
  /** Column gap / gutter (px) */
  GAP: 25,
  /** Row gap between grid children (CSS value) */
  ROW_GAP: "2rem",

  // ── Large desktop (≥ BREAKPOINT_LARGE) ─────────────────────
  /** Maximum content width on viewports ≥ 2000px (px) */
  MAX_WIDTH_LARGE: 1900,
  /** Horizontal page padding on large desktop (px) */
  PADDING_LARGE: 80,

  // ── Tablet (≤ BREAKPOINT_TABLET) ───────────────────────────
  /** Number of grid columns on tablet */
  COLUMNS_TABLET: 6,
  /** Horizontal page padding on tablet (px) */
  PADDING_TABLET: 35,
  /** Column gap on tablet (CSS value) */
  GAP_TABLET: "1rem",
  /** Row gap on tablet (CSS value) */
  ROW_GAP_TABLET: "1.5rem",

  // ── Mobile (≤ BREAKPOINT) ──────────────────────────────────
  /** Number of grid columns on mobile */
  COLUMNS_MOBILE: 4,
  /** Horizontal page padding on mobile (px) */
  PADDING_MOBILE: 20,
  /** Column gap on mobile (CSS value) */
  GAP_MOBILE: "1rem",
  /** Row gap on mobile (CSS value) */
  ROW_GAP_MOBILE: "1.5rem",

  // ── Breakpoints ────────────────────────────────────────────
  /** Mobile breakpoint — max-width media query threshold */
  BREAKPOINT,
  /** Tablet breakpoint — max-width media query threshold */
  BREAKPOINT_TABLET,
  /** Large desktop breakpoint — min-width for wider grid */
  BREAKPOINT_LARGE,

  // ── Pre-built media-query strings ──────────────────────────
  /** Use in styled-components: @media ${GRID.MEDIA_MOBILE} { … } */
  MEDIA_MOBILE: `(max-width: ${BREAKPOINT})`,
  /** Use in styled-components: @media ${GRID.MEDIA_TABLET} { … } */
  MEDIA_TABLET: `(max-width: ${BREAKPOINT_TABLET})`,
  /** Use in styled-components: @media ${GRID.MEDIA_LARGE} { … } — viewports ≥ 2000px */
  MEDIA_LARGE: `(min-width: ${BREAKPOINT_LARGE})`,
};

export default GRID;
