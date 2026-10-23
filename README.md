# Fotomigo website

The Fotomigo website, served by GitHub Pages from the main branch root at https://fotomigo.com.au/.

Static files only: no build step. Keep `CNAME` and `.nojekyll` for the domain and hosting. Space Grotesk is distributed under the SIL Open Font License in `fonts/OFL.txt`. Fotomigo brand assets remain the property of their owner.

## Theme and education section

Both pages load `theme.js` before painting. The initial palette follows the device; each button press switches between light and dark and saves `fotomigo-theme` for the whole origin. Open tabs and history restoration use the same preference. If storage is unavailable, toggling still works for the current page.

The yellow education section follows “See how it works” and keeps dark text in both modes. Its call to action links to the existing contact form.
