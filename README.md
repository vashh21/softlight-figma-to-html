# Figma → HTML/CSS

Small tool that takes a Figma frame and exports it as static HTML + CSS.

I used it for the Softlight sign-in screen, but it works for any Figma file + frame that the token can access.

---

## What it does

- Calls the Figma REST API with:
  - a **file key** (from the URL)
  - a **frame node id** (e.g. `0:1`)
- Walks the Figma node tree (frames, groups, rects, text, etc.)
- Builds:
  - `index.html` with simple `div` + `p` tags
  - `styles.css` with absolute positioning and styles (backgrounds, borders, text, shadows, clipping)

Goal: look visually like the Figma mock (pixel-ish accurate), not responsive.

---

## Setup

Install dependencies:

```bash
npm install

---

## Known limitations

- Layout is fixed-size and uses absolute positioning (not responsive).
- Gradients use Figma’s gradient handles for the angle, but more complex gradient types / transforms are not fully handled yet.
- Complex vector shapes / boolean operations aren’t converted to full SVG paths – they’re treated as simple blocks.
- Only basic effects are handled (mainly drop shadows).
- Text nodes are rendered as `<p>` tags; I’m not trying to infer headings/semantic tags.



