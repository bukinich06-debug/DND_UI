# dnd-ui

React + Next.js + Tailwind CSS project for a Dungeons & Dragons adventure UI.

## Development Server

```bash
pnpm dev
```

Runs Next.js on port **3000** by default (`next dev`).

- Hot reload: Changes to source files are reflected immediately
- Production: `pnpm build` then `pnpm start`

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/app/layout.tsx` - Root layout; imports `src/app/globals.css` and sets metadata
- `src/app/page.tsx` - Home route; mounts the DnD UI
- `src/components/DndApp.tsx` - Primary client UI component and the usual starting point for UI work
- `src/app/globals.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `package.json` - Project dependencies and Next.js build, development, start, and formatting scripts
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS config with `@tailwindcss/postcss`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: Next.js 15, React 19, and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/postcss` plugin
- Build tooling: Next.js, TypeScript 5.7
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through `@tailwindcss/postcss` configured in `postcss.config.mjs`. `src/app/globals.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/app/globals.css`. This scaffold does not need a Tailwind config file.

`src/app/layout.tsx` imports `src/app/globals.css`, so global font wiring belongs there. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
- Mark interactive UI with `"use client"` at the top of the file when using hooks or browser APIs.
