<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
  import Button from '$lib/components/primitives/Button.svelte';
  import { toast } from '$lib/utils/toast.svelte.js';

  import Navbar from '$lib/components/navigation/Navbar.svelte';
  import ThemeToggle from '$lib/components/navigation/ThemeToggle.svelte';
  import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
  import CommandPalette from '$lib/components/navigation/CommandPalette.svelte';
  import SidebarItem from '$lib/components/navigation/SidebarItem.svelte';
  import SidebarSection from '$lib/components/navigation/SidebarSection.svelte';

  let cmdOpen = $state(false);
  let sidebarActive = $state('dashboard');

  const cmdItems = [
    { id: 'new',    label: 'New database',  group: 'Actions', icon: '🗄️', onselect: () => toast.add('New database') },
    { id: 'query',  label: 'Open query editor', group: 'Actions', icon: '⚡', onselect: () => toast.add('Query editor') },
    { id: 'docs',   label: 'Documentation', group: 'Navigate', icon: '📖', onselect: () => toast.add('Docs') },
    { id: 'theme',  label: 'Toggle theme',  group: 'Misc',    icon: '🌙', onselect: () => toast.add('Theme') },
  ];
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Navigation</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">App-level navigation and command patterns.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="ThemeToggle"
      description="Light/dark mode switcher. Persists to localStorage and respects prefers-color-scheme."
      code={`<ThemeToggle />`}
      props={[
        { name: 'class', type: 'string', description: 'Extra classes' },
      ]}
    >
      {#snippet preview()}
        <ThemeToggle />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Navbar"
      description="Sticky top bar with logo, desktop nav, actions, and a built-in mobile hamburger dropdown."
      code={`<Navbar>
  {#snippet logo()}
    <span class="font-semibold text-sm">🫒 olive</span>
  {/snippet}
  {#snippet nav()}
    <NavItem href="/dashboard">Dashboard</NavItem>
    <NavItem href="/databases">Databases</NavItem>
  {/snippet}
  {#snippet actions()}
    <Button size="sm">New database</Button>
  {/snippet}
</Navbar>`}
      props={[
        { name: 'logo', type: 'Snippet', description: 'Left-side brand content' },
        { name: 'nav', type: 'Snippet', description: 'Desktop nav items (hidden on mobile, shown in hamburger dropdown)' },
        { name: 'actions', type: 'Snippet', description: 'Right-side action content' },
        { name: 'hideThemeToggle', type: 'boolean', default: 'false', description: 'Hides the built-in theme toggle' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
          <div class="flex h-14 items-center gap-4 border-b border-[var(--border)] bg-[var(--card)]/80 px-4">
            <span class="font-semibold text-sm text-[var(--foreground)]">🫒 olive</span>
            <div class="flex flex-1 gap-1">
              <span class="rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium text-[var(--primary)] bg-[var(--primary)]/10">Dashboard</span>
              <span class="rounded-[var(--radius)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)]">Databases</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Sidebar + SidebarItem + SidebarSection"
      description="Collapsible side navigation. Fixed app sidebar (default) or inline layout mode. Desktop collapse button and mobile drawer built in."
      code={`<script>
  let collapsed = $state(false);
  let mobileOpen = $state(false);
<\/script>

<!-- Hamburger button (mobile) -->
<button onclick={() => mobileOpen = !mobileOpen}>
  <MenuIcon />
</button>

<Sidebar bind:collapsed bind:mobileOpen>
  {#snippet children({ collapsed })}
    <SidebarSection>
      <SidebarItem label="Dashboard" active href="/dashboard" {collapsed}>
        {#snippet icon()}<DashboardIcon />{/snippet}
      </SidebarItem>
      <SidebarItem label="Databases" href="/databases" {collapsed} badge={4}>
        {#snippet icon()}<DbIcon />{/snippet}
      </SidebarItem>
    </SidebarSection>
    <SidebarSection label="Settings" {collapsed}>
      <SidebarItem label="Team" href="/team" {collapsed}>
        {#snippet icon()}<TeamIcon />{/snippet}
      </SidebarItem>
    </SidebarSection>
  {/snippet}
  {#snippet footer({ collapsed })}
    <SidebarItem label="Settings" href="/settings" {collapsed}>
      {#snippet icon()}<SettingsIcon />{/snippet}
    </SidebarItem>
  {/snippet}
</Sidebar>

<!-- Offset main content on desktop -->
<main class="lg:pl-[220px]">...</main>`}
      props={[
        { name: 'collapsed', type: 'boolean', default: 'false', description: 'Bindable. Collapses to icon-only (56px) on desktop' },
        { name: 'mobileOpen', type: 'boolean', default: 'false', description: 'Bindable. Shows/hides the drawer on mobile' },
        { name: 'inline', type: 'boolean', default: 'false', description: 'Use sticky positioning instead of fixed — for layout composition' },
        { name: 'header', type: 'Snippet<[{collapsed}]>', description: 'Top section (logo area)' },
        { name: 'footer', type: 'Snippet<[{collapsed}]>', description: 'Bottom section (user, settings)' },
        { name: 'children', type: 'Snippet<[{collapsed}]>', description: 'Main nav items. Receives collapsed state.' },
      ]}
    >
      {#snippet preview()}
        <div class="flex h-[280px] w-full overflow-hidden rounded-[var(--radius)] border border-[var(--border)]">
          <!-- Mini sidebar -->
          <div class="flex w-[180px] shrink-0 flex-col border-r border-[var(--border)] bg-[var(--card)]">
            <div class="flex h-12 items-center border-b border-[var(--border)] px-3">
              <span class="text-sm font-semibold text-[var(--foreground)]">🫒 olive</span>
            </div>
            <div class="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
              <SidebarSection>
                <SidebarItem label="Dashboard" active={sidebarActive === 'dashboard'} onclick={() => sidebarActive = 'dashboard'}>
                  {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>{/snippet}
                </SidebarItem>
                <SidebarItem label="Databases" badge={4} active={sidebarActive === 'databases'} onclick={() => sidebarActive = 'databases'}>
                  {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>{/snippet}
                </SidebarItem>
                <SidebarItem label="Logs" active={sidebarActive === 'logs'} onclick={() => sidebarActive = 'logs'}>
                  {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>{/snippet}
                </SidebarItem>
              </SidebarSection>
              <SidebarSection label="Settings">
                <SidebarItem label="Team" active={sidebarActive === 'team'} onclick={() => sidebarActive = 'team'}>
                  {#snippet icon()}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>{/snippet}
                </SidebarItem>
              </SidebarSection>
            </div>
          </div>
          <!-- Content area -->
          <div class="flex flex-1 items-center justify-center text-sm text-[var(--muted-foreground)]">
            {sidebarActive}
          </div>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="CommandPalette"
      description="Global search and action launcher. Opens on ⌘K / Ctrl+K. Supports grouped results, icons, and keyboard shortcuts."
      code={`<script>
  let open = $state(false);

  const items = [
    {
      id: 'new-db',
      label: 'Create database',
      description: 'Spin up a new instance',
      group: 'Actions',
      icon: '🗄️',
      onselect: () => router.goto('/new'),
    },
    {
      id: 'settings',
      label: 'Settings',
      group: 'Navigate',
      shortcut: '⌘,',
      onselect: () => router.goto('/settings'),
    },
  ];
<\/script>

<CommandPalette bind:open {items} placeholder="Search…" />`}
      props={[
        { name: 'open', type: 'boolean', default: 'false', description: 'Bindable. Controls visibility.' },
        { name: 'items', type: 'CommandItem[]', description: 'Array of { id, label, description?, icon?, group?, shortcut?, onselect }' },
        { name: 'placeholder', type: 'string', default: "'Search…'", description: 'Input placeholder text' },
        { name: 'onclose', type: '() => void', description: 'Called when the palette closes' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col items-center gap-3">
          <Button variant="outline" onclick={() => cmdOpen = true}>
            Open command palette
            <kbd class="ml-2 rounded border border-[var(--border)] bg-[var(--muted)] px-1.5 py-0.5 text-xs text-[var(--muted-foreground)]">⌘K</kbd>
          </Button>
          <p class="text-xs text-[var(--muted-foreground)]">Also works globally with ⌘K / Ctrl+K</p>
        </div>
        <CommandPalette bind:open={cmdOpen} items={cmdItems} />
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
