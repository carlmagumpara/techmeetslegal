# TECHNOLOGY meets LEGAL — React + Vite migration

The original site was a static HTML/Bootstrap/jQuery scrollytelling experience driven by
[skrollr](https://github.com/Prinzhorn/skrollr). It is now a React 19 + Vite 8 single-page
application styled primarily with **Tailwind CSS v4**.

## Commands

```bash
npm install
npm run dev      # development server (http://localhost:5173)
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
```

## Configuration decisions

| Topic | Decision |
| --- | --- |
| Build tool | Vite with `@vitejs/plugin-react`; all pages are JSX (no TypeScript). |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. Layout, spacing, colours, typography, borders, shadows, transitions, hover/focus states and responsive variants are Tailwind utilities in JSX. |
| Tailwind entry point | `src/index.css` (`@import 'tailwindcss'`), imported once from `src/main.jsx`. Theme fonts/colours are declared with `@theme`. |
| Bootstrap / normalize / animate.css | Removed from the runtime. Bootstrap utility classes were translated to Tailwind; the five entrance animations live in `src/index.css` as keyframes because Tailwind does not ship them. |
| Fonts | The three Oswald `.ttf` faces are self-hosted under `public/fonts/` and declared with `@font-face`. This is unavoidable custom CSS. |
| Scroll animation | `skrollr` is kept as the frame engine. Tailwind cannot interpolate hundreds of scroll keyframes, so the `data-*` frames and the skrollr instance are preserved. `src/hooks/useExperience.js` initialises/destroys it and replaces `next-nl.js` / `next-pl.js` scene navigation. |
| Legacy markup | The original HTML/CSS/JS sources are archived in `legacy/` for reference and are no longer served by Vite (leaving them in the root made Vite serve them instead of the SPA shell). |
| Forms | The old iframe + jQuery AJAX flow was replaced by controlled React components (`RegistrationForm`, `useTrialFlow`, `TrialModals`). The same `trial_registrations` endpoint is used; override it with `VITE_TRIAL_REGISTRATIONS_URL`. |
| Routing | `react-router-dom` with clean paths. Redirects are provided for the original `.html` URLs. The host must rewrite unknown paths to `index.html` for SPA fallback. |
| Assets | All original images/fonts are in `public/` and referenced with absolute URLs such as `/assets/home/logo.png`, which work in both dev and production builds. |

## Remaining custom CSS

`src/index.css` contains only:

1. Tailwind's import and `@theme` tokens.
2. Three `@font-face` declarations.
3. A small `@layer base` block (using `@apply`) for document-wide resets.
4. The original `bounceIn`, `bounceInUp`, `bounceInDown`, `flipInX` and `fadeIn` keyframes.
5. `::-webkit-scrollbar` overrides for the terms/form panes.

Everything else — including the hundreds of absolutely positioned slide elements — is
expressed with Tailwind utility classes in the generated JSX under `src/pages/generated/`.

## Migration helper

`scripts/convert-pages.mjs` performed the one-off HTML → JSX and CSS → Tailwind conversion.
It needs `parse5` and `postcss` installed temporarily (`npm i --no-save parse5 postcss`) and
is **not** required to build or run the app. The generated files are checked in.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_TRIAL_REGISTRATIONS_URL` | Trial registration POST endpoint | `https://e-lawsolutions.com/trial_registrations` |
