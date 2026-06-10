# 🫒 olive

A calm, precise component library built with Svelte 5 and Tailwind v4. Designed for data-dense interfaces that need to feel trustworthy.

## Development

```sh
npm install
npm run dev
```

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
    "./styles": "./dist/app.css"
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
- TypeScript types are generated automatically alongside each file
- `publint` validates the `package.json` exports field before you publish
