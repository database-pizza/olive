<script lang="ts">
  import CodeBlock from '$lib/components/data/CodeBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">

  <!-- Hero -->
  <div class="mb-10">
    <div class="mb-3 flex items-center gap-2">
      <span class="text-2xl">🫒</span>
      <h1 class="text-2xl font-semibold text-[var(--foreground)]">olive</h1>
    </div>
    <p class="text-base text-[var(--muted-foreground)] max-w-xl leading-relaxed">
      A calm, precise component library built with Svelte 5 and Tailwind v4.
      Designed for data-dense interfaces that need to feel trustworthy.
    </p>
  </div>

  <Separator />

  <!-- Installation -->
  <section class="mt-10 flex flex-col gap-6">
    <div>
      <h2 class="text-lg font-semibold text-[var(--foreground)]">Installation</h2>
      <p class="mt-1 text-sm text-[var(--muted-foreground)]">Add olive to any SvelteKit project.</p>
    </div>

    <div class="flex flex-col gap-4">
      <div>
        <p class="mb-2 text-sm font-medium text-[var(--foreground)]">1. Install the package</p>
        <CodeBlock code={`npm install olive-ui`} language="sh" />
      </div>

      <div>
        <p class="mb-2 text-sm font-medium text-[var(--foreground)]">2. Import the styles in your <code class="rounded bg-[var(--muted)] px-1 py-0.5 text-xs font-mono">app.css</code></p>
        <CodeBlock language="css" code={`@import 'tailwindcss';
@import 'olive-ui/styles';`} />
      </div>

      <div>
        <p class="mb-2 text-sm font-medium text-[var(--foreground)]">3. Add the theme init script to <code class="rounded bg-[var(--muted)] px-1 py-0.5 text-xs font-mono">app.html</code> to prevent flash-of-wrong-theme</p>
        <CodeBlock language="html" code={`<head>
  <!-- prevent FOUC -->
  <script>
    (function(){
      var s = localStorage.getItem('olive-theme');
      var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (s === 'dark' || (s !== 'light' && d))
        document.documentElement.classList.add('dark');
    })();
  <\/script>
</head>`} />
      </div>

      <div>
        <p class="mb-2 text-sm font-medium text-[var(--foreground)]">4. Use components</p>
        <CodeBlock language="svelte" code={`<script>
  import { Button, Input, Card } from 'olive-ui';
<\/script>

<Card>
  <Input placeholder="Database name" />
  <Button>Create</Button>
</Card>`} />
      </div>
    </div>
  </section>

  <Separator class="mt-10" />

  <!-- Theming -->
  <section class="mt-10 flex flex-col gap-6">
    <div>
      <h2 class="text-lg font-semibold text-[var(--foreground)]">Theming</h2>
      <p class="mt-1 text-sm text-[var(--muted-foreground)]">
        All tokens are CSS custom properties. Override any of them to match your brand.
      </p>
    </div>

    <CodeBlock language="css" code={`/* In your app.css, after @import 'olive-ui/styles' */
:root {
  --primary: hsl(160 84% 39%);   /* your brand green */
  --radius: 10px;                 /* border radius for cards */
  --radius-button: 6px;           /* border radius for buttons */
}

.dark {
  --primary: hsl(160 70% 50%);
}`} />

    <div class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--muted)]/30 p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)] mb-3">Token reference</p>
      <div class="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs font-mono">
        {#each [
          ['--background', 'Page background'],
          ['--foreground', 'Default text'],
          ['--card', 'Card / panel background'],
          ['--border', 'Borders and dividers'],
          ['--muted', 'Subtle backgrounds'],
          ['--muted-foreground', 'Secondary text'],
          ['--primary', 'Brand / accent color'],
          ['--primary-foreground', 'Text on primary bg'],
          ['--destructive', 'Error / delete actions'],
          ['--ring', 'Focus ring color'],
          ['--radius', 'Card border radius'],
          ['--radius-button', 'Button border radius'],
        ] as [token, desc]}
          <span class="text-[var(--primary)]/80">{token}</span>
          <span class="text-[var(--muted-foreground)]">{desc}</span>
        {/each}
      </div>
    </div>
  </section>

  <Separator class="mt-10" />

  <!-- AI Guidelines -->
  <section class="mt-10 flex flex-col gap-4">
    <div>
      <h2 class="text-lg font-semibold text-[var(--foreground)]">AI guidelines</h2>
      <p class="mt-1 text-sm text-[var(--muted-foreground)]">Paste this into your AI assistant (Cursor, Claude, Copilot, etc.) so it understands how to work with olive.</p>
    </div>
    <CodeBlock code={`You are working with olive, a Svelte 5 component library built with Tailwind v4.

Import components from 'olive-ui':
  import { Button, Input, Card } from 'olive-ui';

Available components:
  Primitives:  Button, Input, Textarea, Label, Checkbox, Switch, Badge,
               Separator, Avatar, Slider, Select, RadioGroup, RadioItem
  Layout:      Card, CardHeader, CardTitle, CardDescription, CardContent,
               CardFooter, Tabs, Breadcrumbs, ScrollArea
  Navigation:  Navbar, NavItem, ThemeToggle, CommandPalette,
               Sidebar, SidebarItem, SidebarSection
  Overlay:     Dialog, AlertDialog, Alert, Toaster, Tooltip,
               DropdownMenu, Progress, Skeleton, Sheet, Popover
  Forms:       FormField, SearchInput, FileUpload, Combobox, MultiSelect, DatePicker
  Data:        Table, DataTable, CodeBlock, MetricCard, EmptyState,
               KeyValue, JsonViewer, KanbanBoard, KanbanColumn, KanbanCard

Design principles:
  - Calm precision: every element earns its place, no decorative noise
  - Warmth without whimsy: approachable but never playful
  - Trust through honesty: states always visible, errors always clear

Conventions:
  - Svelte 5 runes: $state, $derived, $props, $bindable, snippets
  - Design tokens are CSS custom properties: --primary, --foreground,
    --border, --muted, --card, --radius, --radius-button, etc.
  - Use cn() from 'olive-ui' to merge conditional classes
  - Wrap inputs in FormField for consistent error/hint display
  - Mount <Toaster /> once in the root layout; call toast.add(),
    toast.success(), toast.warning(), toast.error() anywhere
  - Dark mode is controlled by the .dark class on <html>,
    toggled by ThemeToggle which persists to localStorage
  - Prefer component props and composition over custom CSS`} />
  </section>

  <Separator class="mt-10" />

  <!-- Design principles -->
  <section class="mt-10 flex flex-col gap-4">
    <h2 class="text-lg font-semibold text-[var(--foreground)]">Design principles</h2>
    <div class="grid gap-3 sm:grid-cols-3">
      {#each [
        { title: 'Calm precision', body: 'Every element earns its place. No decorative noise — white space is load-bearing.' },
        { title: 'Warmth without whimsy', body: 'Approachable but never playful. Tools that feel like they were made by experts, for experts.' },
        { title: 'Trust through honesty', body: 'States are always visible. Errors are clear. Nothing hides behind ambiguity.' },
      ] as p}
        <div class="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-4">
          <p class="text-sm font-semibold text-[var(--foreground)] mb-1">{p.title}</p>
          <p class="text-xs text-[var(--muted-foreground)] leading-relaxed">{p.body}</p>
        </div>
      {/each}
    </div>
  </section>

  <div class="h-16"></div>
</div>
