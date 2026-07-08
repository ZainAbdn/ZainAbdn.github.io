# ZainAbdn.github.io

Professional portfolio website for Zain Abedeen, hosted via GitHub Pages.

## Adding work samples

Case studies on the site are defined in `portfolio.js`. To attach a work sample
(dashboard screenshot, report page, notebook export):

1. Drop the image (PNG/JPG/WebP) into `assets/work/`
2. In `portfolio.js`, set on the matching case study:
   - `image: "assets/work/your-file.png"`
   - `imageAlt: "short description for screen readers"`
   - `caption: "one-line caption shown under the image"` (optional)

Items with `image: null` show a styled "coming soon" placeholder. To add a whole
new case study, copy an existing object in the `CASE_STUDIES` array and edit it.

## Local preview

Open the homepage directly in your browser:

- `/home/runner/work/ZainAbdn.github.io/ZainAbdn.github.io/ZainAbdn/ZainAbdn.github.io/index.html`

Or serve the repository root with any static file server.
