<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
  import Badge from '$lib/components/primitives/Badge.svelte';
  import Button from '$lib/components/primitives/Button.svelte';

  import Card from '$lib/components/layout/Card.svelte';
  import CardHeader from '$lib/components/layout/CardHeader.svelte';
  import CardTitle from '$lib/components/layout/CardTitle.svelte';
  import CardDescription from '$lib/components/layout/CardDescription.svelte';
  import CardContent from '$lib/components/layout/CardContent.svelte';
  import CardFooter from '$lib/components/layout/CardFooter.svelte';
  import Tabs from '$lib/components/layout/Tabs.svelte';
  import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
  import ScrollArea from '$lib/components/layout/ScrollArea.svelte';

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'logs', label: 'Logs' },
  ];
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Layout</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">Structural containers and navigation patterns.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="Card"
      description="Content container. Composed from Card, CardHeader, CardTitle, CardDescription, CardContent, and CardFooter."
      code={`<Card>
  <CardHeader>
    <CardTitle>Production</CardTitle>
    <CardDescription>PostgreSQL · us-east-1</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge variant="active">Active</Badge>
  </CardContent>
  <CardFooter class="gap-2">
    <Button size="sm" variant="outline">Connect</Button>
    <Button size="sm" variant="ghost">Settings</Button>
  </CardFooter>
</Card>`}
      props={[
        { name: 'class', type: 'string', description: 'Extra classes on the card wrapper' },
        { name: 'children', type: 'Snippet', description: 'Card content' },
      ]}
    >
      {#snippet preview()}
        <Card class="w-64">
          <CardHeader>
            <CardTitle>Production</CardTitle>
            <CardDescription>PostgreSQL · us-east-1</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="active">Active</Badge>
          </CardContent>
          <CardFooter class="gap-2">
            <Button size="sm" variant="outline">Connect</Button>
            <Button size="sm" variant="ghost">Settings</Button>
          </CardFooter>
        </Card>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Tabs"
      description="Section-level navigation within a page. Active tab is managed internally."
      code={`<script>
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'settings', label: 'Settings' },
    { id: 'logs',     label: 'Logs' },
  ];
<\/script>

<Tabs {tabs}>
  {#snippet children(active)}
    {#if active === 'overview'}
      <p>Overview content</p>
    {:else if active === 'settings'}
      <p>Settings content</p>
    {:else}
      <p>Logs content</p>
    {/if}
  {/snippet}
</Tabs>`}
      props={[
        { name: 'tabs', type: '{ id: string; label: string }[]', description: 'Tab definitions' },
        { name: 'default', type: 'string', description: 'Initially active tab id (defaults to first)' },
        { name: 'children', type: 'Snippet<[string]>', description: 'Receives the active tab id' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full">
          <Tabs {tabs}>
            {#snippet children(active)}
              {#if active === 'overview'}
                <p class="text-sm text-[var(--muted-foreground)]">Overview content — connection strings, quick stats.</p>
              {:else if active === 'settings'}
                <p class="text-sm text-[var(--muted-foreground)]">Settings — configuration, scaling, backups.</p>
              {:else}
                <p class="text-sm text-[var(--muted-foreground)]">Logs — recent events, error stream.</p>
              {/if}
            {/snippet}
          </Tabs>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Breadcrumbs"
      description="Hierarchical path indicator. Items with href are links; the last item is the current page."
      code={`<Breadcrumbs
  items={[
    { label: 'Home',      href: '/' },
    { label: 'Databases', href: '/databases' },
    { label: 'production' },
  ]}
/>`}
      props={[
        { name: 'items', type: '{ label: string; href?: string }[]', description: 'Path segments. Last item is current page.' },
        { name: 'class', type: 'string', description: 'Extra classes on the nav wrapper' },
      ]}
    >
      {#snippet preview()}
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Databases', href: '/' }, { label: 'production' }]} />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="ScrollArea"
      description="Overflow wrapper with optional max height. Thin custom scrollbar on supporting browsers."
      code={`<ScrollArea maxHeight="200px">
  <ul>
    {#each items as item}
      <li>{item}</li>
    {/each}
  </ul>
</ScrollArea>`}
      props={[
        { name: 'maxHeight', type: 'string', description: 'CSS max-height value, e.g. "300px"' },
        { name: 'class', type: 'string', description: 'Extra classes on the scroll container' },
        { name: 'children', type: 'Snippet', description: 'Scrollable content' },
      ]}
    >
      {#snippet preview()}
        <ScrollArea maxHeight="140px" class="w-full max-w-xs rounded-[var(--radius)] border border-[var(--border)]">
          {#each Array.from({ length: 10 }, (_, i) => `Row ${i + 1} — db-${String(i + 1).padStart(3,'0')}`) as row}
            <div class="px-3 py-2 text-sm text-[var(--foreground)] border-b border-[var(--border)] last:border-0">{row}</div>
          {/each}
        </ScrollArea>
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
