# ZainAbdn.github.io

Forward Deployed Engineer portfolio (security, data and automation) for Zain Abedeen, hosted via GitHub Pages.

## Portfolio samples

The homepage sample cards are defined in `portfolio.js`. Each card links to a generic fictional standalone HTML report, dashboard, or review pack in `samples/`.

Current samples:

- `samples/compliance-evidence-pack.html`
- `samples/cloud-security-review.html`
- `samples/security-metrics-dashboard.html`

These samples are intentionally marked as generic sample projects and do not contain real company or client data.

## Updating samples

To add a new sample:

1. Create a new HTML page in `samples/`.
2. Add a matching object to the `CASE_STUDIES` array in `portfolio.js`.
3. Set `sampleUrl` to the new sample page path.
4. Keep the language clear that the work is fictional sample material unless it is approved real portfolio work.

## Local preview

Open `index.html` directly in a browser, or serve the repository root with any static file server.

## Homepage design

The homepage uses `site.css` and `main.js` (the `samples/` pages still use `styles.css`). The look is restrained and corporate: navy and ivory, Newsreader headlines, Inter body text. Three subtle WebGL shaders add slow movement: a navy "silk" field behind the hero and contact sections, and a gentle drift with a soft tonal grade on the portrait. Without WebGL the page falls back to static gradients, and with `prefers-reduced-motion` it shows still frames.

**Portrait:** save a photo as `assets/zain.jpg` (portrait orientation, about 900×1125). Until that file exists, the frame shows a "ZA" monogram.
