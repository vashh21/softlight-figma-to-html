# Figma → HTML/CSS

Tiny tool that takes a Figma frame and spits out static HTML + CSS.

I used it for the Softlight sign-in screen, but it works for any Figma file + frame you point it at.

---

## What it does

- Calls the Figma REST API with:
  - a **file key** (from the Figma URL)
  - a **frame node id** (e.g. `0:1`)
- Walks the Figma node tree (frames, groups, rectangles, text, etc.)
- Generates:
  - `index.html` with simple `div` / `p` tags
  - `styles.css` with absolute positioning + basic styles (backgrounds, borders, text, shadows, clipping)

Goal: make the HTML/CSS look like the Figma mock. Not trying to be responsive here.

---

## Setup

Install deps:

```bash
npm install
````

Create a Figma personal access token with:

* `file_content:read`
* `file_metadata:read`

Set it as `FIGMA_TOKEN`:

**macOS / Linux**

```bash
export FIGMA_TOKEN="your-figma-token"
```

**Windows PowerShell**

```powershell
$env:FIGMA_TOKEN="your-figma-token"
```

---

## File key & node id

From a Figma URL like:

```text
https://www.figma.com/design/FILE_KEY/Some-Name?node-id=0-1&...
```

* `FILE_KEY` = part after `/design/` and before the next `/`
* `node-id=0-1` → use `0:1` for the CLI

To use a different frame, select it in Figma, grab its `node-id`, swap `-` to `:`, done.

---

## Run

Example:

```bash
npx ts-node src/cli/index.ts \
  --file-key YOUR_FILE_KEY \
  --node-id YOUR_FRAME_NODE_ID \
  --out dist/softlight
```

This writes:

* `dist/softlight/index.html`
* `dist/softlight/styles.css`

Open `index.html` in a browser.

Change `--file-key`, `--node-id`, and `--out` to run it on other mocks.

---

## Softlight output

For this assignment, the generated files for the provided Figma file are:

* `dist/softlight/index.html`
* `dist/softlight/styles.css`

---

## Known limitations

* Fixed-size layout with absolute positioning (not responsive).
* Gradients use Figma’s gradient handles for the angle; weird/complex gradient setups aren’t fully handled.
* Complex vector shapes / boolean ops are treated as simple blocks, not full SVG paths.
* Only basic effects are supported (mainly drop shadows).
* Text nodes are rendered as `<p>`; I’m not guessing headings or other semantic tags.

```
::contentReference[oaicite:0]{index=0}
```
