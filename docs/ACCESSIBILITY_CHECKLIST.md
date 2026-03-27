# Accessibility checklist (plan)

Use this as a working checklist before releases or audits. Mark items when verified. Target: **WCAG 2.1** alignment where noted.

---

## How to use

- [ ] = not yet verified  
- [x] = verified / meets criterion  
- Add notes or ticket links in the **Notes** column as you go.

---

## Visual

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Contrast ratio (4.5:1)** | Check text against its background (normal text ≥ 4.5:1; large text ≥ 3:1 per WCAG). Include buttons, links, placeholders, and states (hover/focus/disabled). | [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) |
| [ ] | **Visible focus states** | Do not use `outline: none` / `outline: 0` without a visible replacement. Prefer `:focus-visible` so mouse users are not over-styled while keyboard users see a clear ring. | [WCAG 2.1 — Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html) |

---

## Content

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Descriptive alt text** | Every informative image has meaningful `alt`. Decorative images use `alt=""` (empty) or are hidden from assistive tech per your pattern. | [WAI — Images decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) |

---

## Structure

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Semantic HTML** | One `<main>`, landmarks for `<nav>` and `<footer>`, lists for lists, buttons for actions, links for navigation. | [MDN — HTML accessibility](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML) |
| [ ] | **Heading hierarchy** | Single logical `<h1>` per page (or view); `<h2>`–`<h3>` follow document order without skips used for styling only. | [Yale — Page structure](https://usability.yale.edu/digital-accessibility/accessibility-resources/accessibility-articles/page-structure) |

---

## Forms

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Input labels** | Every control has an associated `<label>` (visible or sr-only), or `aria-label` / `aria-labelledby` where a visible label pattern is not possible. | [WAI — Form labels](https://www.w3.org/WAI/tutorials/forms/labels/) |

---

## Navigation and keyboard

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Keyboard-only pass** | Tab through the full site: order is logical, focus never trapped, modals return focus, custom widgets are operable with keyboard. | [WebAIM — Keyboard](https://webaim.org/techniques/keyboard/) |
| [ ] | **Skip to main content** | First focusable control (or early in DOM) skips repeated chrome to `#main` (or equivalent); link is visible on focus. | [A11y Project — Skip navigation](https://www.a11yproject.com/posts/skip-nav-links/) |

---

## Mobile / touch

| Done | Criterion | What to do | Reference |
|------|-----------|------------|-----------|
| [ ] | **Target size (44×44 px minimum)** | Interactive targets meet at least **44×44 CSS px** (or have sufficient spacing). Aligns with project grid/touch guidance. | [WCAG 2.1 — Target size](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html) |

---

## Quick verification order (suggested)

1. Skip link + tab order (keyboard)  
2. Focus visibility on all interactive elements  
3. Headings and landmarks (semantic HTML)  
4. Forms and labels  
5. Images and alt text  
6. Contrast spot-check on key templates  
7. Touch targets on primary actions (mobile)

---

## Notes

| Area | Finding | Owner | Date |
|------|---------|-------|------|
| | | | |
