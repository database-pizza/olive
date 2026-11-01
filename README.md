# 🫒 olive

The design system and Svelte 5 component library behind database.pizza.

Warm neutrals, hairline structure, one olive accent, and motion that explains
itself. Built for data-dense products where trust is the feature. Mobile and
desktop are designed together.

- **Svelte 5** runes and snippets
- **Tailwind v4** with semantic CSS-variable tokens
- **Two themes** (light/dark) resolved before first paint
- **Accessible by default**: focus traps, keyboard menus, reduced motion,
  safe-area insets

## Development

```sh
npm install
npm run dev        # component gallery at localhost:5173
npm run check      # svelte-check
npm run package    # build dist/ and run publint
```

## Install

```sh
npm i @database.pizza/olive
```

Import the tokens and the framework-neutral theme layer after Tailwind:

```css
@import "tailwindcss";
@import "@database.pizza/olive/tokens";
@import "@database.pizza/olive/theme";
```

`@database.pizza/olive/styles` is available for apps that want Olive to import
Tailwind itself (the gallery does this).

Resolve the theme before first paint in `app.html`:

```html
<script>
  const stored = localStorage.getItem('olive-theme') ?? 'system';
  const dark = stored === 'dark' ||
    (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
</script>
```

## Use

```svelte
<script lang="ts">
  import {
    AppShell, Button, Card, MetricCard, Page, PageHeader, StatusPill,
  } from '@database.pizza/olive';
</script>

<AppShell>
  {#snippet header()}
    <TopBar />
  {/snippet}

  <Page>
    <PageHeader title="Databases" description="Everything in this workspace.">
      {#snippet actions()}
        <Button variant="brand">New database</Button>
      {/snippet}
    </PageHeader>
    <Card>
      <MetricCard label="Queries" value="1.28M" trend={{ value: 12 }} />
    </Card>
  </Page>
</AppShell>
```

## Layouts

- `AppShell` — sidebar + optional inset content panel + mobile bottom bar.
- `Sidebar` — collapsing rail from `lg`, focus-trapped drawer on phones.
- `Page` / `PageHeader` — width and rhythm for product pages.
- `Frame` / `FramePanel` — a quiet gutter for grouped panels.
- `SettingsList` / `SettingRow` — grouped settings rows.
- `Dialog` / `Sheet` — centred on desktop, bottom sheet with drag dismiss on
  phones.

## Tokens and theming

Override semantic tokens, not primitives:

```css
:root {
  --brand: oklch(0.62 0.152 118);
  --brand-soft: color-mix(in oklab, var(--brand) 13%, transparent);
  --ring: var(--brand);
}
```

See [`design.md`](./design.md) for the full system: color, type, motion,
responsive rules, accessibility requirements and the component inventory.

## Publishing

Use the repository's release process. At minimum:

```sh
npm run check
npm run package
npm publish
```

`svelte-package` compiles `src/lib/` into `dist/`; `index.ts` is the public API,
Svelte files ship as source for SSR and tree-shaking, and `publint` validates
the exports map. Do not publish without reviewing the version, `dist/`, and the
generated changelog.
