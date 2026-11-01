<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CodeBlock,
    CopyButton,
    Frame,
    FramePanel,
    MetricCard,
    SegmentedControl,
    Sparkline,
    StatusPill,
    Tabs,
  } from '$lib/index.js';

  const swatches = [
    { name: 'background', label: 'Canvas' },
    { name: 'card', label: 'Surface' },
    { name: 'muted', label: 'Muted' },
    { name: 'border', label: 'Hairline' },
    { name: 'foreground', label: 'Ink' },
    { name: 'brand', label: 'Olive' },
    { name: 'success', label: 'Success' },
    { name: 'warning', label: 'Warning' },
    { name: 'destructive', label: 'Danger' },
  ];

  const type = [
    { name: 'Display', class: 'text-[28px] font-semibold tracking-[-0.03em]', sample: 'Query, undo, repeat' },
    { name: 'Heading', class: 'text-[22px] font-semibold tracking-[-0.028em]', sample: 'Time travel' },
    { name: 'Title', class: 'text-[17px] font-semibold tracking-[-0.02em]', sample: 'Recent queries' },
    { name: 'Body', class: 'text-[13px]', sample: 'Every change can be understood and undone.' },
    { name: 'Caption', class: 'text-[11px] text-[var(--muted-foreground)]', sample: 'Updated 2 minutes ago' },
  ];

  let segment = $state('day');
  let tab = $state('overview');
</script>

<div class="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
  <!-- Hero -->
  <section class="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--olive-shadow-xs),var(--olive-inset-highlight)] sm:p-10">
    <div
      class="pointer-events-none absolute -right-24 -top-32 size-80 opacity-80"
      style="background:radial-gradient(circle at center, color-mix(in oklab, var(--brand) 22%, transparent), transparent 65%);"
      aria-hidden="true"
    ></div>
    <div class="relative max-w-2xl">
      <div class="mb-4 flex items-center gap-2">
        <span class="flex size-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-lg" aria-hidden="true">🫒</span>
        <span class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Olive design system</span>
      </div>
      <h1 class="max-w-xl text-[30px] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)] sm:text-[42px]">
        A quiet interface for serious tools.
      </h1>
      <p class="mt-3 max-w-lg text-[14px] leading-relaxed text-[var(--muted-foreground)] sm:text-[15px]">
        Warm neutrals, hairline structure and motion that explains itself. Built for
        data-dense products where trust is the feature.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-2">
        <Button href="/primitives" variant="brand">
          Explore components
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Button>
        <div class="flex h-8 items-center gap-2 rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--background)] pl-2.5 pr-1 font-mono text-[11px] text-[var(--muted-foreground)]">
          npm i @database.pizza/olive
          <CopyButton value="npm i @database.pizza/olive" label="Copy install command" />
        </div>
      </div>
    </div>
  </section>

  <!-- Principles -->
  <section class="mt-10">
    <div class="mb-4 flex items-end justify-between gap-3">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Principles</p>
        <h2 class="mt-1 text-[18px] font-semibold tracking-[-0.02em]">Calm, but not flat.</h2>
      </div>
    </div>
    <div class="grid gap-3 sm:grid-cols-3">
      {#each [
        { title: 'Structure in hairlines', body: 'One border weight, alpha-derived. Surfaces sit on a warm canvas instead of stacking shadows.' },
        { title: 'Motion with intent', body: 'Short springs on press, a sliding pill for selection. Everything settles; nothing loops for attention.' },
        { title: 'Small screens first', body: 'Controls grow to touch size, sheets become drawers, tables become cards.' },
      ] as principle}
        <Card class="p-4">
          <h3 class="text-[13px] font-semibold">{principle.title}</h3>
          <p class="mt-1.5 text-[12px] leading-relaxed text-[var(--muted-foreground)]">{principle.body}</p>
        </Card>
      {/each}
    </div>
  </section>

  <!-- Foundations -->
  <section class="mt-12 grid gap-4 lg:grid-cols-2">
    <Frame>
      <FramePanel>
        <div class="p-4 sm:p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Color</p>
          <h2 class="mt-1 text-[15px] font-semibold">Semantic, not decorative.</h2>
          <p class="mt-1 text-[12px] leading-relaxed text-[var(--muted-foreground)]">
            A near-black ink, warm gray structure and one living olive accent.
          </p>
          <div class="mt-4 grid grid-cols-3 gap-2">
            {#each swatches as swatch}
              <div class="min-w-0">
                <div
                  class="h-10 rounded-[var(--radius-sm)] border border-[var(--border)]"
                  style:background={`var(--${swatch.name})`}
                ></div>
                <p class="mt-1 truncate font-mono text-[10px] text-[var(--muted-foreground)]">--{swatch.name}</p>
              </div>
            {/each}
          </div>
        </div>
      </FramePanel>
      <FramePanel>
        <div class="p-4 sm:p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Type</p>
          <h2 class="mt-1 text-[15px] font-semibold">Plus Jakarta Sans, tuned tight.</h2>
          <div class="mt-3 flex flex-col divide-y divide-[var(--border)]">
            {#each type as row}
              <div class="flex items-baseline justify-between gap-4 py-2">
                <span class={row.class}>{row.sample}</span>
                <span class="shrink-0 font-mono text-[10px] text-[var(--subtle-foreground)]">{row.name}</span>
              </div>
            {/each}
          </div>
        </div>
      </FramePanel>
    </Frame>

    <Frame>
      <FramePanel>
        <div class="p-4 sm:p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Selection</p>
          <h2 class="mt-1 text-[15px] font-semibold">Sliding, not switching.</h2>
          <p class="mt-1 text-[12px] text-[var(--muted-foreground)]">A single soft indicator carries the change.</p>
          <div class="mt-4 flex flex-col gap-3">
            <SegmentedControl
              bind:value={segment}
              fullWidth
              size="sm"
              options={[
                { value: 'day', label: 'Day' },
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
              ]}
            />
            <Tabs
              bind:active={tab}
              tabs={[
                { id: 'overview', label: 'Overview' },
                { id: 'schema', label: 'Schema' },
                { id: 'data', label: 'Data', count: 12 },
              ]}
            >
              {#snippet children()}
                <p class="text-[12px] text-[var(--muted-foreground)]">
                  {tab === 'overview' ? 'A summary of the selected database.' : tab === 'schema' ? 'Tables, columns and indexes.' : 'Rows, filtered and paginated.'}
                </p>
              {/snippet}
            </Tabs>
          </div>
        </div>
      </FramePanel>
      <FramePanel>
        <div class="p-4 sm:p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Status</p>
          <h2 class="mt-1 text-[15px] font-semibold">A dot that earns its color.</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <StatusPill tone="success" label="Active" pulse />
            <StatusPill tone="warning" label="Paused" />
            <StatusPill tone="danger" label="Error" />
            <StatusPill tone="info" label="Provisioning" />
            <StatusPill tone="brand" label="Primary" />
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>
      </FramePanel>
    </Frame>
  </section>

  <!-- Numbers + empty -->
  <section class="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
    <Card class="p-4 sm:p-5">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Data</p>
          <h2 class="mt-1 text-[15px] font-semibold">Numbers people can scan.</h2>
        </div>
        <Badge variant="brand" dot>Live</Badge>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2.5">
        <MetricCard label="Queries" value="1.28M" trend={{ value: 12 }} hint="vs. last week" />
        <MetricCard label="P95 latency" value="4.2ms" trend={{ value: -8 }} hint="vs. last week" />
      </div>
      <div class="mt-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--background)] p-3">
        <div class="flex items-center justify-between text-[11px]">
          <span class="text-[var(--muted-foreground)]">Throughput</span>
          <span class="olive-tnum font-medium">42.8k / h</span>
        </div>
        <Sparkline
          values={[8, 11, 9, 14, 13, 18, 16, 21, 19, 24, 22, 28]}
          width={420}
          height={44}
          class="mt-2 w-full"
          label="Throughput, last 12 hours"
        />
      </div>
    </Card>

    <Card class="p-4 sm:p-5">
      <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Empty</p>
      <h2 class="mt-1 text-[15px] font-semibold">Friendly, never cute.</h2>
      <div class="mt-4 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-5 text-center">
        <div class="mx-auto flex size-9 items-center justify-center rounded-[var(--radius-button)] border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <ellipse cx="12" cy="5.5" rx="8" ry="2.8" />
            <path d="M4 5.5v13c0 1.55 3.58 2.8 8 2.8s8-1.25 8-2.8v-13" />
          </svg>
        </div>
        <p class="mt-3 text-[13px] font-semibold">No databases yet</p>
        <p class="mx-auto mt-1 max-w-[16rem] text-[12px] leading-relaxed text-[var(--muted-foreground)]">
          Create one and you will have a PostgreSQL-compatible endpoint in under a minute.
        </p>
        <Button variant="brand" size="sm" class="mt-3">Create database</Button>
      </div>
    </Card>
  </section>

  <!-- Install -->
  <section class="mt-12">
    <div class="mb-3">
      <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--subtle-foreground)]">Install</p>
      <h2 class="mt-1 text-[18px] font-semibold tracking-[-0.02em]">Two imports and a theme script.</h2>
    </div>
    <div class="grid gap-3 lg:grid-cols-2">
      <CodeBlock
        filename="app.css"
        language="css"
        code={`@import "tailwindcss";
@import "@database.pizza/olive/tokens";
@import "@database.pizza/olive/theme";`}
      />
      <CodeBlock
        filename="app.html"
        language="html"
        code={`<script>
  const stored = localStorage.getItem("olive-theme") ?? "system";
  const dark = stored === "dark" ||
    (stored === "system" &&
      matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
<\/script>`}
      />
    </div>
  </section>

  <footer class="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-5 text-[11px] text-[var(--subtle-foreground)]">
    <span>Olive · Svelte 5 · Tailwind v4</span>
    <span class="flex items-center gap-2">
      <span class="size-1.5 rounded-full bg-[var(--brand)]"></span>
      Built for database.pizza
    </span>
  </footer>
</div>
