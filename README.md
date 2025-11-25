# Figma → HTML/CSS

Small CLI that takes a Figma frame and exports static HTML + CSS.

I used it for the Softlight sign-in screen, but it works for any Figma file + frame you point it at.

---

## What it does

- Calls the Figma REST API with:
  - a file key (from the Figma URL)
  - a frame node id (e.g. `0:1`)
- Walks the Figma node tree (frames, groups, rects, text, etc.)
- Generates:
  - `index.html` – simple `div` / `p` structure
  - `styles.css` – absolute positioning + fills, borders, text, shadows, clipping

Goal: get as close as possible to the Figma mock visually. This is intentionally not responsive.

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

* `FILE_KEY` = the part after `/design/` and before the next `/`
* `node-id=0-1` → becomes `0:1` for the CLI

To use a different frame:

1. Duplicate the file into your own workspace if needed.
2. Select the frame in Figma.
3. Grab `node-id=...` from the URL.
4. Replace `-` with `:` and pass that as `--node-id`.

---

## Run (generic)

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

---

## Example (my Softlight copy)

My duplicated file URL looks like:

```text
https://www.figma.com/design/ELnV78L8DjKEaujZpvtLwO/... ?node-id=0-1&...
```

So I run:

**Windows PowerShell**

```powershell
npx ts-node src/cli/index.ts --file-key ELnV78L8DjKEaujZpvtLwO --node-id 0:1 --out dist/softlight
```

---

## Softlight output

For this assignment, the generated files for the Softlight mock are checked in at:

* `dist/softlight/index.html`
* `dist/softlight/styles.css`

You can open `index.html` directly in a browser.

---

## Known limitations

* Fixed-size layout with absolute positioning (not responsive).
* Currently only handles solid fills and **linear** gradients. Gradient angle comes from Figma’s gradient handles; other gradient types are not supported yet.
* Complex vector shapes / boolean ops are treated as simple positioned blocks, not full SVG paths.
* Only basic effects are supported (mainly drop shadows).
* Text nodes are rendered as `<p>`; I’m not inferring headings or other semantic tags.

---

## Possible next steps

Things I’d add next:

* Export vectors as real SVG paths instead of plain blocks.
* Map more Figma effects (blur, inner shadow, multiple shadows).
* Support more gradient types (radial, angular, etc.).
* Smarter HTML: infer headings / landmarks, not just `p` + `div`.
* Optional layout modes (flexbox/grid) for generated code instead of pure absolute positioning.
