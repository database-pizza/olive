<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
  import Card from '$lib/components/layout/Card.svelte';
  import CardContent from '$lib/components/layout/CardContent.svelte';
  import Badge from '$lib/components/primitives/Badge.svelte';
  import Button from '$lib/components/primitives/Button.svelte';
  import { toast } from '$lib/utils/toast.svelte.js';

  import Table      from '$lib/components/data/Table.svelte';
  import CodeBlock  from '$lib/components/data/CodeBlock.svelte';
  import MetricCard from '$lib/components/data/MetricCard.svelte';
  import EmptyState from '$lib/components/data/EmptyState.svelte';
  import KeyValue   from '$lib/components/data/KeyValue.svelte';
  import DataTable  from '$lib/components/data/DataTable.svelte';
  import JsonViewer from '$lib/components/data/JsonViewer.svelte';
  import KanbanBoard  from '$lib/components/data/KanbanBoard.svelte';
  import KanbanColumn from '$lib/components/data/KanbanColumn.svelte';
  import KanbanCard   from '$lib/components/data/KanbanCard.svelte';

  const tableColumns = [
    { key: 'name',   label: 'Name' },
    { key: 'type',   label: 'Type', mono: true },
    { key: 'status', label: 'Status' },
  ];

  const tableRows = [
    { name: 'production', type: 'postgresql', status: 'active' },
    { name: 'staging',    type: 'postgresql', status: 'paused' },
    { name: 'dev',        type: 'pizzasql',   status: 'error' },
  ];

  const dtColumns = [
    { key: 'name' as const,   header: 'Name',   sortable: true },
    { key: 'region' as const, header: 'Region', sortable: true },
    { key: 'size' as const,   header: 'Size',   sortable: true },
  ];

  const dtRows = [
    { name: 'production',  region: 'us-east-1',  size: '2.4 GB' },
    { name: 'staging',     region: 'us-west-2',  size: '340 MB' },
    { name: 'dev',         region: 'local',       size: '18 MB' },
    { name: 'analytics',   region: 'eu-west-1',  size: '6.7 GB' },
    { name: 'archive',     region: 'us-east-1',  size: '12.1 GB' },
    { name: 'replica-01',  region: 'us-west-2',  size: '2.4 GB' },
  ];

  const kvItems = [
    { key: 'Host',     value: 'db.example.com', mono: true, copyable: true },
    { key: 'Port',     value: '5432',            mono: true },
    { key: 'Database', value: 'production',      mono: true, copyable: true },
    { key: 'SSL',      value: 'required' },
  ];

  const sampleJson = {
    id: 'db_abc123',
    name: 'production',
    config: { region: 'us-east-1', ssl: true, pool: { min: 2, max: 20 } },
    tags: ['prod', 'critical'],
    notes: null,
  };

  type CardData = { id: string; title: string; description?: string; tags?: string[]; column: string };

  let kanbanCards = $state<CardData[]>([
    { id: 'c1', title: 'Set up replication',    tags: ['infra'], column: 'todo' },
    { id: 'c2', title: 'Optimize slow queries',  tags: ['perf'],  column: 'todo' },
    { id: 'c3', title: 'Write migration script', description: 'v14 → v15', tags: ['db'], column: 'in-progress' },
    { id: 'c4', title: 'SSL cert renewal',       tags: ['ops'],   column: 'done' },
  ]);

  const cols = [
    { id: 'todo', title: 'To do' },
    { id: 'in-progress', title: 'In progress' },
    { id: 'done', title: 'Done' },
  ];

  function moveCard(cardId: string, toCol: string) {
    kanbanCards = kanbanCards.map(c => c.id === cardId ? { ...c, column: toCol } : c);
  }
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Data Display</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">Tables, boards, viewers, and metadata components.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="Table"
      description="Simple static table. For sortable, searchable, paginated data use DataTable."
      code={`<Table
  columns={[
    { key: 'name',   label: 'Name' },
    { key: 'type',   label: 'Type', mono: true },
    { key: 'status', label: 'Status' },
    { key: 'size',   label: 'Size', align: 'right' },
  ]}
  rows={[
    { name: 'production', type: 'postgresql', status: 'active', size: '2.4 GB' },
  ]}
/>`}
      props={[
        { name: 'columns', type: '{ key: string; label: string; mono?: boolean; align?: "left" | "right" }[]', description: 'Column definitions' },
        { name: 'rows', type: 'Record<string, unknown>[]', description: 'Table data' },
      ]}
    >
      {#snippet preview()}
        <Table columns={tableColumns} rows={tableRows} class="w-full" />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="DataTable"
      description="Full-featured table with client-side sorting, search filtering, and pagination."
      code={`<DataTable
  data={rows}
  columns={[
    { key: 'name',   header: 'Name',   sortable: true },
    { key: 'region', header: 'Region', sortable: true },
    { key: 'size',   header: 'Size',   sortable: true },
  ]}
  searchable
  searchPlaceholder="Search databases…"
  pageSize={5}
/>`}
      props={[
        { name: 'data', type: 'T[]', description: 'Array of row objects' },
        { name: 'columns', type: '{ key: keyof T; header: string; sortable?: boolean; width?: string; render?: fn }[]', description: 'Column definitions' },
        { name: 'pageSize', type: 'number', default: '10', description: 'Rows per page' },
        { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a search input above the table' },
        { name: 'searchPlaceholder', type: 'string', default: "'Search…'", description: 'Search input placeholder' },
        { name: 'empty', type: 'string', default: "'No results'", description: 'Empty state message' },
      ]}
    >
      {#snippet preview()}
        <DataTable data={dtRows} columns={dtColumns} searchable pageSize={3} class="w-full" />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="MetricCard"
      description="Key figure with label, trend indicator, icon slot, and semantic color options."
      code={`<MetricCard
  label="Active queries"
  value="248"
  color="emerald"
  trend={{ value: 12, label: 'vs last hour' }}
>
  {#snippet icon()}
    <ActivityIcon />
  {/snippet}
</MetricCard>`}
      props={[
        { name: 'label', type: 'string', description: 'Metric name' },
        { name: 'value', type: 'string | number', description: 'Primary value to display' },
        { name: 'color', type: "'olive' | 'emerald' | 'sky' | 'amber' | 'red' | 'purple'", default: "'olive'", description: 'Accent color for the icon and trend' },
        { name: 'trend', type: '{ value: number; label: string }', description: 'Signed delta and description. Positive = green, negative = red.' },
        { name: 'icon', type: 'Snippet', description: 'SVG icon displayed in the colored badge' },
      ]}
    >
      {#snippet preview()}
        <div class="grid grid-cols-2 gap-3 w-full max-w-sm">
          <MetricCard label="Databases" value="12" color="olive">
            {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>{/snippet}
          </MetricCard>
          <MetricCard label="Error rate" value="0.04%" color="red" trend={{ value: -8, label: 'vs yesterday' }}>
            {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>{/snippet}
          </MetricCard>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="KeyValue"
      description="Metadata pair list. Supports monospace values and copyable items."
      code={`<KeyValue
  items={[
    { key: 'Host',     value: 'db.example.com', mono: true, copyable: true },
    { key: 'Port',     value: '5432',            mono: true },
    { key: 'Database', value: 'production',      mono: true, copyable: true },
    { key: 'SSL',      value: 'required' },
  ]}
/>`}
      props={[
        { name: 'items', type: '{ key: string; value: string; mono?: boolean; copyable?: boolean }[]', description: 'Pairs to display' },
      ]}
    >
      {#snippet preview()}
        <Card class="max-w-xs w-full">
          <CardContent>
            <KeyValue items={kvItems} />
          </CardContent>
        </Card>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="CodeBlock"
      description="Monospaced display with language label and one-click copy."
      code={`<CodeBlock
  language="sql"
  code={\`SELECT * FROM users
WHERE created_at > '2026-01-01'
ORDER BY name;\`}
/>`}
      props={[
        { name: 'code', type: 'string', description: 'The code string to display' },
        { name: 'language', type: 'string', description: 'Language label shown in the header' },
        { name: 'class', type: 'string', description: 'Extra classes' },
      ]}
    >
      {#snippet preview()}
        <CodeBlock language="sql" code={`SELECT name, count(*)
FROM databases
GROUP BY name
ORDER BY count DESC;`} class="w-full max-w-sm" />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="EmptyState"
      description="Zero-data view with icon, title, description, and action slot."
      code={`<EmptyState
  title="No databases yet"
  description="Create your first database to get started."
>
  {#snippet icon()}
    <DatabaseIcon />
  {/snippet}
  {#snippet actions()}
    <Button>Create database</Button>
  {/snippet}
</EmptyState>`}
      props={[
        { name: 'title', type: 'string', description: 'Primary heading' },
        { name: 'description', type: 'string', description: 'Supporting text' },
        { name: 'icon', type: 'Snippet', description: 'Icon displayed above the title' },
        { name: 'actions', type: 'Snippet', description: 'Call-to-action buttons' },
      ]}
    >
      {#snippet preview()}
        <Card class="w-full max-w-sm">
          <EmptyState title="No databases yet" description="Create your first to get started.">
            {#snippet icon()}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>{/snippet}
            {#snippet actions()}<Button size="sm">Create database</Button>{/snippet}
          </EmptyState>
        </Card>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="JsonViewer"
      description="Collapsible JSON tree with syntax-highlighted strings, numbers, booleans, and nulls."
      code={`<JsonViewer
  data={{ id: 'db_abc123', config: { ssl: true, pool: { max: 20 } } }}
  expandDepth={2}
/>`}
      props={[
        { name: 'data', type: 'unknown', description: 'Any JSON-serializable value' },
        { name: 'expandDepth', type: 'number', default: '2', description: 'How many levels are expanded by default' },
        { name: 'class', type: 'string', description: 'Extra classes on the root element' },
      ]}
    >
      {#snippet preview()}
        <Card class="w-full max-w-sm">
          <CardContent>
            <JsonViewer data={sampleJson} expandDepth={2} />
          </CardContent>
        </Card>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="KanbanBoard / KanbanColumn / KanbanCard"
      description="Drag-and-drop task board. KanbanBoard is the scroll container. KanbanColumn accepts drops and fires ondrop. KanbanCard is draggable."
      code={`<script>
  let cards = $state([
    { id: 'c1', title: 'Set up replication', tags: ['infra'], column: 'todo' },
    { id: 'c2', title: 'Write migration',    tags: ['db'],    column: 'in-progress' },
  ]);

  function moveCard(cardId, toColumn) {
    cards = cards.map(c => c.id === cardId ? { ...c, column: toColumn } : c);
  }
<\/script>

<KanbanBoard>
  {#each columns as col}
    {@const colCards = cards.filter(c => c.column === col.id)}
    <KanbanColumn id={col.id} title={col.title} count={colCards.length} ondrop={moveCard}>
      {#each colCards as card (card.id)}
        <KanbanCard id={card.id} title={card.title} tags={card.tags} />
      {/each}
    </KanbanColumn>
  {/each}
</KanbanBoard>`}
      props={[
        { name: 'KanbanBoard.class', type: 'string', description: 'Extra classes on the scroll container' },
        { name: 'KanbanColumn.id', type: 'string', description: 'Column identifier passed to ondrop' },
        { name: 'KanbanColumn.title', type: 'string', description: 'Column header text' },
        { name: 'KanbanColumn.count', type: 'number', description: 'Badge count in header' },
        { name: 'KanbanColumn.ondrop', type: '(cardId, columnId) => void', description: 'Called when a card is dropped on this column' },
        { name: 'KanbanCard.id', type: 'string', description: 'Unique card id (used as drag data)' },
        { name: 'KanbanCard.title', type: 'string', description: 'Card heading' },
        { name: 'KanbanCard.description', type: 'string', description: 'Optional body text (2-line clamp)' },
        { name: 'KanbanCard.tags', type: 'string[]', description: 'Tag chips shown at card bottom' },
        { name: 'KanbanCard.assignee', type: 'string', description: 'Shows an avatar initials badge' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full overflow-x-auto">
          <KanbanBoard>
            {#each cols as col}
              {@const cards = kanbanCards.filter(c => c.column === col.id)}
              <KanbanColumn id={col.id} title={col.title} count={cards.length} ondrop={moveCard}>
                {#each cards as card (card.id)}
                  <KanbanCard id={card.id} title={card.title} description={card.description} tags={card.tags} />
                {/each}
              </KanbanColumn>
            {/each}
          </KanbanBoard>
        </div>
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
