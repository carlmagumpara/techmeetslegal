# TECHNOLOGY meets LEGAL — React + Vite

An interactive scrollytelling site for **ELSA (E-Law Solutions App)**, a web application
that helps lawyers and law offices manage their day-to-day activities. Visitors choose a
path — **New Lawyer** or **Practicing Lawyer** — and follow a scroll-driven story showing
how ELSA fits into their work, from client intake and office collaboration to court visits.
Each path ends with a 30-day free trial registration form, and the trial agreement, privacy
policy, terms of use and disclaimer live on a separate page.

The site is a React 19 + Vite single-page app styled with Tailwind CSS v4, using
[skrollr](https://github.com/Prinzhorn/skrollr) for the scroll animations. It replaces the
original static HTML/Bootstrap/jQuery site, whose sources are archived in `legacy/`.

---

## Project structure

```
src/
  main.jsx                  App entry point (BrowserRouter + StrictMode)
  App.jsx                   Route definitions and legacy URL redirects
  index.css                 Tailwind import, @theme tokens, @font-face, keyframes
  components/               Shared UI (Header, Loader, forms, modals, notices)
  hooks/
    useExperience.js        Initialises/destroys the skrollr instance
    useTrialFlow.js         Form state, submission and modal handling
  data/
    scenes.js               Scroll scene definitions
    terms.json              Terms and privacy content
  pages/
    Home.jsx                 Landing page
    NewLawyer.jsx           New-lawyer scrollytelling page
    PracticingLawyer.jsx    Practicing-lawyer scrollytelling page
    FormPage.jsx            Registration form page
    TermsPage.jsx           Terms and privacy page
    generated/              JSX converted from the legacy HTML
public/                     Images and self-hosted fonts, served at absolute /… paths
legacy/                     Original HTML/CSS/JS (archived, not served by Vite)
scripts/convert-pages.mjs   One-off HTML → JSX / CSS → Tailwind migration helper
```

---

## How it works

| Topic | Decision |
| --- | --- |
| Build tool | Vite with `@vitejs/plugin-react`; all pages are JSX (no TypeScript). |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite`. Layout, spacing, colours, typography, borders, shadows, transitions, hover/focus states and responsive variants are Tailwind utilities in JSX. |
| Tailwind entry point | `src/index.css` (`@import 'tailwindcss'`), imported once from `src/main.jsx`. Theme fonts/colours are declared with `@theme`. |
| Bootstrap / normalize / animate.css | Removed from the runtime. Bootstrap utility classes were translated to Tailwind; the five entrance animations live in `src/index.css` as keyframes. |
| Fonts | The three Oswald `.ttf` faces are self-hosted under `public/fonts/` and declared with `@font-face`. |
| Scroll animation | `skrollr` is kept as the frame engine. The `data-*` frames and skrollr instance are preserved; `src/hooks/useExperience.js` replaces `next-nl.js` / `next-pl.js` scene navigation. |
| Legacy markup | Original HTML/CSS/JS sources are archived in `legacy/` and are no longer served by Vite. |
| Forms | The old iframe + jQuery AJAX flow was replaced by controlled React components (`RegistrationForm`, `useTrialFlow`, `TrialModals`), posting to the same `trial_registrations` endpoint. |
| Assets | Images/fonts are in `public/` and referenced with absolute URLs such as `/assets/home/logo.png`. |

`src/index.css` contains only Tailwind's import and `@theme` tokens, three `@font-face`
declarations, a small `@layer base` reset (using `@apply`), the original `bounceIn`,
`bounceInUp`, `bounceInDown`, `flipInX` and `fadeIn` keyframes, and `::-webkit-scrollbar`
overrides for the terms/form panes. Everything else is Tailwind utilities in JSX under
`src/pages/generated/`.

The migration helper `scripts/convert-pages.mjs` is **not** required to build or run the app;
the generated files are checked in. It only needs `parse5` and `postcss` installed temporarily
(`npm i --no-save parse5 postcss`) if you want to re-run the conversion.
