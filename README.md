# 🫒 olive

A calm, precise component library built with Svelte 5 and Tailwind v4. Designed for data-dense interfaces that need to feel trustworthy.

## Development

```sh
npm install
npm run dev
```

## Styles

Use the full Tailwind-powered component stylesheet in Svelte applications:

```css
@import "@database.pizza/olive/styles";
```

For other frameworks, import only the shared color, type, spacing, radius,
shadow, and motion custom properties:

```css
@import "@database.pizza/olive/tokens";
```

The olive accent is the signature brand color; the mono stack provides the
supporting technical voice for data, code, and identifiers.

## Publishing to npm

Olive uses [`@sveltejs/package`](https://kit.svelte.dev/docs/packaging) to build the library.

### 1. Install packaging tools

```sh
npm install -D @sveltejs/package publint
```

### 2. Configure `package.json`

```json
{
  "name": "@database.pizza/olive",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "package": "svelte-kit sync && svelte-package && publint",
    "prepublishOnly": "npm run package"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "svelte": "./dist/index.js"
    },
    "./styles": "./dist/styles.css",
    "./tokens": "./dist/tokens.css"
  },
  "svelte": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"]
}
```

### 3. Build and publish

```sh
# Build into dist/
npm run package

# Verify the package exports are correct
npx publint

# Publish
npm publish
```

### How it works

- `svelte-package` reads `src/lib/` and compiles everything into `dist/`
- `src/lib/index.ts` is the public API — only what's exported there is available to consumers
- Svelte files ship as source so consuming apps can tree-shake and SSR natively
- `@database.pizza/olive/tokens` exposes framework-neutral CSS custom properties without Tailwind
- TypeScript types are generated automatically alongside each file
- `publint` validates the `package.json` exports field before you publish
