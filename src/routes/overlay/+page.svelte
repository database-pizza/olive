<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
  import Button from '$lib/components/primitives/Button.svelte';
  import Input from '$lib/components/primitives/Input.svelte';
  import Label from '$lib/components/primitives/Label.svelte';
  import { toast } from '$lib/utils/toast.svelte.js';

  import Dialog from '$lib/components/overlay/Dialog.svelte';
  import AlertDialog from '$lib/components/overlay/AlertDialog.svelte';
  import Alert from '$lib/components/overlay/Alert.svelte';
  import Tooltip from '$lib/components/overlay/Tooltip.svelte';
  import DropdownMenu from '$lib/components/overlay/DropdownMenu.svelte';
  import Progress from '$lib/components/overlay/Progress.svelte';
  import Skeleton from '$lib/components/overlay/Skeleton.svelte';
  import Sheet from '$lib/components/overlay/Sheet.svelte';
  import Popover from '$lib/components/overlay/Popover.svelte';

  let dialogOpen = $state(false);
  let alertDialogOpen = $state(false);
  let sheetOpen = $state(false);

  const dropdownItems = [
    { label: 'Edit',      onclick: () => toast.add('Edit') },
    { label: 'Duplicate', onclick: () => toast.add('Duplicate') },
    { separator: true, label: '' },
    { label: 'Delete', variant: 'destructive' as const, onclick: () => toast.add('Deleted') },
  ];
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Overlay & Feedback</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">Modals, sheets, popovers, toasts, and status indicators.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="Alert"
      description="Inline status message. Four semantic variants — all readable in light and dark mode."
      code={`<Alert variant="info" title="Scheduled maintenance">
  Next window is Apr 24, 2–4 AM UTC.
</Alert>
<Alert variant="success" title="Backup complete">
  Daily backup completed at 03:00 UTC.
</Alert>
<Alert variant="warning" title="High connection count">
  You are at 82% of your connection limit.
</Alert>
<Alert variant="error" title="Replication lag">
  Replica is 45 seconds behind primary.
</Alert>`}
      props={[
        { name: 'variant', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", description: 'Semantic color and icon' },
        { name: 'title', type: 'string', description: 'Bold heading line' },
        { name: 'children', type: 'Snippet', description: 'Body text' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-2.5 w-full max-w-md">
          <Alert variant="info" title="Scheduled maintenance">Next window is Apr 24, 2–4 AM UTC.</Alert>
          <Alert variant="success" title="Backup complete">Daily backup completed at 03:00 UTC.</Alert>
          <Alert variant="warning" title="High connection count">At 82% of connection limit.</Alert>
          <Alert variant="error" title="Replication lag">Replica is 45s behind primary.</Alert>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Progress"
      description="Determinate or indeterminate progress bar. Three color variants reflect severity."
      code={`<Progress value={68} />
<Progress value={82} variant="warning" />
<Progress value={97} variant="error" />
<Progress indeterminate />`}
      props={[
        { name: 'value', type: 'number', description: '0–100. Omit or use indeterminate for spinner mode.' },
        { name: 'variant', type: "'default' | 'warning' | 'error'", default: "'default'", description: 'Color preset' },
        { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Animated sweep when value is unknown' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-3 w-full max-w-sm">
          <Progress value={68} />
          <Progress value={82} variant="warning" />
          <Progress value={97} variant="error" />
          <Progress indeterminate />
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Skeleton"
      description="Loading placeholder that matches the geometry of incoming content."
      code={`<Skeleton width="100%" height="14px" />
<Skeleton width="60%" height="12px" />
<Skeleton rounded width="40px" height="40px" />`}
      props={[
        { name: 'width', type: 'string', description: 'CSS width, e.g. "100%" or "120px"' },
        { name: 'height', type: 'string', description: 'CSS height, e.g. "14px"' },
        { name: 'rounded', type: 'boolean', default: 'false', description: 'Fully rounds corners (for avatars)' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-2 w-48">
          <Skeleton width="100%" height="14px" />
          <Skeleton width="80%" height="12px" />
          <Skeleton width="60%" height="12px" />
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Tooltip"
      description="Hover label for iconographic elements. Appears after a short delay."
      code={`<Tooltip content="Delete this database">
  <Button variant="ghost" size="icon" aria-label="Delete">
    <TrashIcon />
  </Button>
</Tooltip>`}
      props={[
        { name: 'content', type: 'string', description: 'Tooltip text' },
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Preferred placement' },
        { name: 'children', type: 'Snippet', description: 'The element that triggers the tooltip' },
      ]}
    >
      {#snippet preview()}
        <div class="flex gap-4">
          <Tooltip content="Connect to database">
            <Button variant="outline" size="sm">Connect</Button>
          </Tooltip>
          <Tooltip content="Delete permanently" side="bottom">
            <Button variant="ghost" size="sm">Delete</Button>
          </Tooltip>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Toaster"
      description="Transient notification system. Mount once at root, trigger anywhere with the toast utility."
      code={`<!-- In your layout -->
<Toaster />

<!-- Anywhere in your app -->
<script>
  import { toast } from 'olive-ui';

  toast.add('Database saved');
  toast.success('Backup complete', { description: 'All replicas in sync.' });
  toast.warning('Connection limit at 82%');
  toast.error('Query timed out', { description: 'Exceeded 30s limit.' });
<\/script>`}
      props={[
        { name: 'position', type: "'bottom-right' | 'bottom-center' | 'top-right'", default: "'bottom-right'", description: 'Stack position on screen' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onclick={() => toast.add('Database saved')}>Default</Button>
          <Button variant="outline" size="sm" onclick={() => toast.success('Backup complete')}>Success</Button>
          <Button variant="outline" size="sm" onclick={() => toast.warning('Connection at 82%')}>Warning</Button>
          <Button variant="outline" size="sm" onclick={() => toast.error('Query timed out')}>Error</Button>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="DropdownMenu"
      description="Anchored action menu with support for separators and destructive items."
      code={`<DropdownMenu
  items={[
    { label: 'Edit',      onclick: () => {} },
    { label: 'Duplicate', onclick: () => {} },
    { separator: true, label: '' },
    { label: 'Delete', variant: 'destructive', onclick: () => {} },
  ]}
>
  {#snippet trigger()}
    <Button variant="outline" size="sm">
      Actions <ChevronIcon />
    </Button>
  {/snippet}
</DropdownMenu>`}
      props={[
        { name: 'items', type: 'MenuItem[]', description: '{ label, onclick, variant?, separator?, icon? }[]' },
        { name: 'align', type: "'start' | 'end'", default: "'end'", description: 'Horizontal alignment relative to trigger' },
        { name: 'trigger', type: 'Snippet', description: 'The button or element that opens the menu' },
      ]}
    >
      {#snippet preview()}
        <DropdownMenu items={dropdownItems} align="start">
          {#snippet trigger()}
            <Button variant="outline" size="sm">
              Actions
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </Button>
          {/snippet}
        </DropdownMenu>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Popover"
      description="Anchored floating container. Click outside to dismiss. Configurable side and alignment."
      code={`<Popover side="bottom" align="start">
  {#snippet trigger()}
    <Button variant="outline">Connection info</Button>
  {/snippet}
  {#snippet children()}
    <div class="flex flex-col gap-2 p-1">
      <p class="text-sm font-medium">db.example.com:5432</p>
      <Button size="sm" variant="outline">Copy</Button>
    </div>
  {/snippet}
</Popover>`}
      props={[
        { name: 'side', type: "'top' | 'bottom' | 'left' | 'right'", default: "'bottom'", description: 'Preferred position relative to trigger' },
        { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Alignment along the side axis' },
        { name: 'open', type: 'boolean', default: 'false', description: 'Bindable visibility state' },
        { name: 'trigger', type: 'Snippet', description: 'The element that opens the popover' },
        { name: 'children', type: 'Snippet', description: 'Popover panel content' },
      ]}
    >
      {#snippet preview()}
        <Popover side="bottom" align="start">
          {#snippet trigger()}
            <Button variant="outline">Connection info</Button>
          {/snippet}
          {#snippet children()}
            <div class="flex flex-col gap-2 p-1">
              <p class="text-sm font-medium text-[var(--foreground)]">Production</p>
              <p class="text-xs text-[var(--muted-foreground)] font-mono">db.example.com:5432</p>
              <Button size="sm" variant="outline" class="w-full">Copy string</Button>
            </div>
          {/snippet}
        </Popover>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Dialog"
      description="Modal overlay. Focus-trapped, scroll-locked, dismissible via Escape or backdrop click."
      code={`<script>
  let open = $state(false);
<\/script>

<Button onclick={() => open = true}>Open</Button>

<Dialog bind:open title="Create database" description="Configure your new database.">
  {#snippet children()}
    <Input placeholder="my-database" />
  {/snippet}
  {#snippet footer()}
    <Button variant="outline" onclick={() => open = false}>Cancel</Button>
    <Button onclick={() => open = false}>Create</Button>
  {/snippet}
</Dialog>`}
      props={[
        { name: 'open', type: 'boolean', description: 'Bindable visibility state' },
        { name: 'title', type: 'string', description: 'Dialog heading' },
        { name: 'description', type: 'string', description: 'Subheading below the title' },
        { name: 'children', type: 'Snippet', description: 'Dialog body content' },
        { name: 'footer', type: 'Snippet', description: 'Action buttons area' },
      ]}
    >
      {#snippet preview()}
        <Button variant="outline" onclick={() => dialogOpen = true}>Open dialog</Button>
        <Dialog bind:open={dialogOpen} title="Create database" description="Configure your new database.">
          {#snippet children()}
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5">
                <Label>Name</Label>
                <Input placeholder="my-database" />
              </div>
            </div>
          {/snippet}
          {#snippet footer()}
            <Button variant="outline" onclick={() => dialogOpen = false}>Cancel</Button>
            <Button onclick={() => { dialogOpen = false; toast.success('Database created'); }}>Create</Button>
          {/snippet}
        </Dialog>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="AlertDialog"
      description="Confirmation modal for destructive or irreversible actions. Requires explicit confirm."
      code={`<script>
  let open = $state(false);
<\/script>

<Button variant="destructive" onclick={() => open = true}>Delete</Button>

<AlertDialog
  bind:open
  title="Delete database?"
  description="This will permanently delete all data. Cannot be undone."
  confirmLabel="Delete database"
  cancelLabel="Cancel"
  destructive
  onconfirm={() => performDelete()}
/>`}
      props={[
        { name: 'open', type: 'boolean', description: 'Bindable visibility state' },
        { name: 'title', type: 'string', description: 'Dialog heading' },
        { name: 'description', type: 'string', description: 'Warning body text' },
        { name: 'confirmLabel', type: 'string', default: "'Confirm'", description: 'Text for the confirm button' },
        { name: 'cancelLabel', type: 'string', default: "'Cancel'", description: 'Text for the cancel button' },
        { name: 'destructive', type: 'boolean', default: 'false', description: 'Renders the confirm button in destructive variant' },
        { name: 'onconfirm', type: '() => void', description: 'Called when user confirms' },
      ]}
    >
      {#snippet preview()}
        <Button variant="destructive" onclick={() => alertDialogOpen = true}>Delete database</Button>
        <AlertDialog
          bind:open={alertDialogOpen}
          title="Delete database?"
          description="This will permanently delete 'production' and all its data."
          confirmLabel="Delete database"
          cancelLabel="Cancel"
          destructive
          onconfirm={() => toast.error('Database deleted')}
        />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Sheet"
      description="Slide-in panel from any edge. Use for detail views, settings, and multi-step flows."
      code={`<script>
  let open = $state(false);
<\/script>

<Button onclick={() => open = true}>Open settings</Button>

<Sheet bind:open side="right" title="Database settings">
  {#snippet children()}
    <Input placeholder="Display name" />
  {/snippet}
  {#snippet footer()}
    <Button variant="outline" onclick={() => open = false}>Cancel</Button>
    <Button onclick={() => open = false}>Save</Button>
  {/snippet}
</Sheet>`}
      props={[
        { name: 'open', type: 'boolean', description: 'Bindable visibility state' },
        { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Edge the panel slides from' },
        { name: 'title', type: 'string', description: 'Panel heading' },
        { name: 'description', type: 'string', description: 'Subheading' },
        { name: 'children', type: 'Snippet', description: 'Panel body' },
        { name: 'footer', type: 'Snippet', description: 'Action buttons' },
      ]}
    >
      {#snippet preview()}
        <Button variant="outline" onclick={() => sheetOpen = true}>Open sheet</Button>
        <Sheet bind:open={sheetOpen} title="Database settings" description="Adjust configuration for production.">
          {#snippet children()}
            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5">
                <Label>Display name</Label>
                <Input value="production" />
              </div>
            </div>
          {/snippet}
          {#snippet footer()}
            <Button variant="outline" onclick={() => sheetOpen = false}>Cancel</Button>
            <Button onclick={() => { sheetOpen = false; toast.success('Saved'); }}>Save changes</Button>
          {/snippet}
        </Sheet>
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
