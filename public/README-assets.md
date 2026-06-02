# Static SEO / branding assets

The HTML references a few static files that you should drop into this
`public/` directory before deploying. Vite copies everything in `public/`
to the build root verbatim.

| File | Purpose | How to generate |
|---|---|---|
| `og-cover.png` | Open Graph / Twitter card image, 1200×630, shows the app screenshot or branding. | Take a screenshot of the running app, or design one in Figma. |
| `apple-touch-icon.png` | 180×180 PNG used by iOS / browsers when pinned. | Export from your favicon SVG. |
| `favicon.ico` (optional) | Legacy icon for older browsers. | `npx png-to-ico apple-touch-icon.png > favicon.ico` |

If you change the deployment host, also update:

- `index.html` — every `https://viile.github.io/curl_display/...` URL
- `public/robots.txt` — Sitemap line
- `public/sitemap.xml` — `<loc>` and every hreflang URL
- `public/site.webmanifest` — `start_url`, `scope`, icon paths
- `src/config/seo.ts` — `SITE_URL`, `OG_IMAGE`, `REPO_URL`
- `src/config/links.ts` — `DESKTOP_DOWNLOAD_URL` if you re-publish releases elsewhere
