# Olive Design System

Olive is a Svelte component library and design system. It provides the visual language, design tokens, and component primitives for building professional, human-scale software tools.

---

## The Character of Olive

Olive has a specific character — a way of feeling when you use it. It is not neutral. It is not generic. Every decision in this system is in service of that character.

**Calm precision.** The interface should feel like a well-organized workbench: everything in its place, nothing extraneous, the right tool within reach. There is no decoration for decoration's sake. Whitespace is not empty — it is the breathing room that lets content speak clearly. When the screen is calm, the user can focus on the work, not the interface.

**Warmth without whimsy.** Professional tools can have a soul. The color is a soft yellow-green — the color of a garden, of something grown. It does not scream. It does not demand attention. But it is unmistakably alive, and it makes the interface feel like something made by people who care. Empty states are friendly. Confirmations are human. Nothing is cold or corporate.

**Trust through honesty.** Olive is used to build tools that handle important things. The UI must communicate reliability. That means no layout shifts. No misleading affordances. No animation that obscures rather than clarifies. Numbers are formatted precisely. Errors say exactly what happened. Timestamps are readable. The system respects the user's intelligence and treats them as a professional.

**Invisible infrastructure.** The best UI moment is when the user stops thinking about the interface and thinks only about their work. Chrome — navbars, cards, borders, toolbars — is scaffolding. It should be there when needed and recede when not. Content is the primary element. Structure serves it.

---

## Motion

Motion in Olive is purposeful. Every transition answers the question: "what changed, and where did it go?"

Animations communicate state, not personality. They orient the user — a panel slides in from the side so you know where it came from. A dialog fades up from center so you know it's floating above the page. A row highlights for 150ms so you know it was just updated.

Motion is never decorative. Nothing spins for the sake of spinning. Nothing bounces. Nothing draws attention to itself.

### Timing

| Duration | Usage |
|---|---|
| `100ms` | Micro-feedback: button press, checkbox tick |
| `150ms` | Hover states, focus rings, badge color changes |
| `200ms` | Component appear/disappear (toast, tooltip, dropdown) |
| `250ms` | Panel slides, sheet entrances, modal fade-up |
| `350ms` | Page-level transitions, large layout changes |

Easing:
- Entering elements: `cubic-bezier(0.16, 1, 0.3, 1)` — fast start, smooth landing
- Exiting elements: `cubic-bezier(0.4, 0, 1, 1)` — quick, clean exit
- Position changes: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — natural arc

**Only ever animate `opacity` and `transform`.** Never animate `height`, `width`, `top`, `left`, or any property that triggers layout. Layout animation causes jank. `opacity` + `transform` are GPU-composited and always smooth.

Do not show a loading indicator for operations under 200ms. Add a deliberate short delay before revealing any loading state — a spinner that flashes for 80ms is worse than no spinner at all.

Respect `prefers-reduced-motion`. Wrap all non-essential transitions in a media query check and disable or reduce them.

---

## Typography

Text is the primary material of Olive interfaces. It should be legible at every size, on every screen, in both light and dark modes.

**Primary font**: Plus Jakarta Sans, weights 400/500/600/700. Its geometry is soft, slightly rounded — professional without being cold. It pairs naturally with the olive-green palette because both have warmth without loudness. Never substitute it. Never add additional font families.

**Monospace font**: `ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace`. Used for any content the user would copy-paste: identifiers, connection strings, keys, queries, payloads, schema names. If it came from a system or will go back into one, it is monospaced. This distinction is important — it immediately communicates "this is data" vs "this is UI".

Font smoothing is always on: `-webkit-font-smoothing: antialiased`. Sub-pixel rendering makes text look heavy on modern displays.

### Type Scale

| Step | Size | Weight | Usage |
|---|---|---|---|
| `display` | `2xl` (1.5rem) | `semibold` | Page titles. One per page. |
| `title` | `lg` (1.125rem) | `semibold` | Card titles, section headers |
| `label` | `sm` (0.875rem) | `medium` | Nav items, form labels, column headers |
| `body` | `sm` (0.875rem) | `normal` | All body text |
| `caption` | `xs` (0.75rem) | `normal` | Metadata, timestamps, secondary info |
| `micro` | `xs` (0.75rem) + uppercase + tracking-wide | `medium` | Section labels, tiny category tags |
| `code` | `sm` (0.875rem) | `normal` | Inline code, monospaced content |

### Typography Rules

- Use 2–3 weights per page maximum (400, 500, 600). More than three weights creates visual noise.
- Secondary information lives at `muted-foreground`. It should be clearly subordinate, readable, but not competing.
- Never use colored text for emphasis in body copy. Use weight (`font-medium`, `font-semibold`) instead. Reserve colored text for interactive elements and status indicators.
- ALL CAPS only for micro labels. Never for headings or action labels.
- Keep descriptions under 15 words.
- Line length: `max-w-prose` (65ch) for reading text. Never let a line of prose stretch edge-to-edge.

---

## Color

The palette is built around a yellow-green primary at hue ~75 — the color of fresh basil, of olives on the branch. It is warm, slightly muted, alive. Every neutral in the system carries a faint echo of this hue (hue 60–70) so the palette feels cohesive and nothing reads as cold or disconnected.

Backgrounds are never pure white or pure black. In light mode the background is a warm off-white. In dark mode it is a deep charcoal with a hint of green. This softness is deliberate — it reduces eye fatigue over long sessions and keeps the primary color from feeling harsh against it.

### Semantic Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `hsl(60 8% 95%)` | `hsl(70 4% 9%)` | Page background |
| `--foreground` | `hsl(70 8% 15%)` | `hsl(60 8% 85%)` | Primary text |
| `--card` | `hsl(60 6% 97%)` | `hsl(70 4% 11%)` | Card and panel surfaces |
| `--card-foreground` | `hsl(70 8% 15%)` | `hsl(60 8% 85%)` | Text on card surfaces |
| `--muted` | `hsl(65 8% 91%)` | `hsl(70 4% 15%)` | Subtle fills, toggles, pill containers |
| `--muted-foreground` | `hsl(70 4% 45%)` | `hsl(65 4% 50%)` | Secondary text, metadata, placeholders |
| `--border` | `hsl(65 6% 86%)` | `hsl(70 4% 18%)` | Borders, dividers |
| `--primary` | `hsl(75 60% 44%)` | `hsl(75 55% 52%)` | Brand accent — buttons, focus rings, active states |
| `--primary-foreground` | `hsl(70 8% 15%)` | `hsl(70 4% 9%)` | Text on primary-colored surfaces |
| `--destructive` | `hsl(0 55% 52%)` | `hsl(0 45% 42%)` | Error, delete actions |
| `--destructive-foreground` | `hsl(0 0% 98%)` | `hsl(0 0% 98%)` | Text on destructive surfaces |
| `--ring` | `hsl(75 60% 44%)` | `hsl(75 55% 52%)` | Focus rings (equals `--primary`) |
| `--radius` | `0.75rem` | — | Global border radius (12px) — cards, panels, inputs |
| `--radius-button` | `0.4375rem` | — | Button border radius (7px) — tighter than cards for a more grounded feel |

### Primitive Palette

Not used directly in components. These inform the semantic tokens.

```
olive-50   hsl(75 60% 96%)
olive-100  hsl(75 60% 90%)
olive-200  hsl(75 58% 78%)
olive-300  hsl(75 56% 66%)
olive-400  hsl(75 58% 54%)
olive-500  hsl(75 60% 44%)   ← primary (light mode)
olive-600  hsl(75 55% 38%)
olive-700  hsl(75 50% 32%)
olive-800  hsl(75 45% 24%)
olive-900  hsl(75 40% 16%)
```

### Semantic Status Colors

Status colors communicate state meaning. They are always used in icon backgrounds and small tints — never as large solid fills, which read as heavy.

| Status | Background | Text | Dark text | Usage |
|---|---|---|---|---|
| Success / Active | `emerald-500/10` | `emerald-600` | `emerald-400` | Active, running, OK |
| Warning / Paused | `amber-500/10` | `amber-600` | `amber-400` | Paused, pending, attention |
| Error | `red-500/10` | `red-600` | `red-400` | Errors, failures, deletes |
| Info | `sky-500/10` | `sky-600` | `sky-400` | Informational |
| Debug | `purple-500/10` | `purple-600` | `purple-400` | Debug, verbose |
| Trace | `muted/50` | `muted-foreground` | `muted-foreground` | Trace, lowest priority |

In dark mode: increase alpha to `/15`, shift text to the `*-400` step.

### Badge Classes

For standalone status pills and type labels, use named CSS classes rather than composed Tailwind utilities. This is required for Tailwind v4 compatibility — composed utilities may not be generated if they don't appear in source.

| Class | Meaning |
|---|---|
| `.badge-active` | Active / running |
| `.badge-paused` | Paused / pending |
| `.badge-error` | Error / failed |
| `.badge-warning` | Warning / degraded |
| `.badge-info` | Informational |
| `.badge-debug` | Debug level |
| `.badge-trace` | Trace level |
| `.badge-write` | Write operation |
| `.badge-delete` | Delete operation |

### Color Rules

- Use CSS variable classes (`text-primary`, `bg-muted`, `bg-primary/10`) over hardcoded Tailwind colors for all brand and neutral elements.
- The only hardcoded Tailwind color classes acceptable are the semantic status colors above (emerald, amber, red, sky, purple), and only because they are explicitly listed in source.
- No gradients. Flat, solid colors only. The primary color is strong enough without them.
- No pure black (`#000`) or pure white (`#fff`). No cold gray Tailwind classes (`gray-*`, `slate-*`, `zinc-*`). Use the token system.
- Icon container backgrounds use a `/10` tint. Never a solid fill.

---

## Responsive Design

Olive interfaces must work on any screen — a phone held in one hand, a tablet at a café, a large monitor at a desk, and a display on a wall. This is not an afterthought. The layout system must flow gracefully across all of these.

### Breakpoints

| Name | Min-width | Typical device |
|---|---|---|
| (base) | 0px | Small phones |
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Wide monitors, TVs |

### Layout Strategy

- **Mobile first.** Write base styles for the smallest screen, then add overrides at larger breakpoints. Never start from desktop and work down.
- **Fluid containers.** Page content uses `px-4 sm:px-6 lg:px-8` with `max-w-7xl`. Content breathes at every width.
- **Responsive grids.** Cards and metrics use grids that reflow: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`. Never hardcode column counts for all screens.
- **Touch targets.** Interactive elements must be at minimum `44×44px` on touch screens. Use `size="lg"` for primary page-level CTAs on mobile. Never rely on hover for important affordances — touch devices have no hover state.
- **Scrollable on small screens.** Horizontal-scrolling containers (`overflow-x-auto`) for tables and data views. Never clip or crop content — always provide a scroll path.
- **Large screens.** At `2xl`, content should not stretch uncomfortably wide. The `max-w-7xl` constraint applies everywhere. Very wide displays see more breathing room around the content, not wider content.

### Component-Level Responsiveness

- Navigation collapses to a hamburger/sheet at `sm` and below.
- Dialogs are `max-w-[calc(100vw-2rem)]` on mobile — always inset from the screen edge.
- Sidebars and panels collapse to overlays on small screens.
- Stat grids drop to 2 columns on mobile, 4 on desktop.
- Tables get horizontal scroll containers on mobile rather than reflowing into cards (data tables need their columns).

---

## Spacing

All spacing comes from the 4px/8px base scale. No arbitrary pixel values.

| Step | px | rem | Common use |
|---|---|---|---|
| 1 | 4px | 0.25rem | Tight internal gaps, icon margins |
| 2 | 8px | 0.5rem | Icon-to-label gaps, input padding |
| 3 | 12px | 0.75rem | Component internal padding |
| 4 | 16px | 1rem | Standard gap, card padding |
| 6 | 24px | 1.5rem | Section gaps, between form fields |
| 8 | 32px | 2rem | Between distinct content groups |
| 12 | 48px | 3rem | Between page sections |
| 16 | 64px | 4rem | Empty state padding, hero spacing |

Generous whitespace is not wasteful. It is what lets the eye move without effort. When in doubt, add more space, not less.

---

## Shadows

Shadows follow the foreground color at low opacity so they respect both light and dark themes.

```css
--shadow-sm:  0 1px 2px hsl(var(--foreground) / 0.06);
--shadow-md:  0 4px 12px hsl(var(--foreground) / 0.08);
--shadow-lg:  0 8px 24px hsl(var(--foreground) / 0.10);
```

In dark mode: reduce alpha by ~30%. Never use `box-shadow` with hardcoded colors.

---

## Border Radius

Two radius tokens. Use the right one for the right surface — they serve different visual roles.

| Token | Value | Use |
|---|---|---|
| `--radius` | `0.75rem` (12px) | Cards, panels, inputs, dropdowns, dialogs — surfaces that contain content |
| `--radius-button` | `0.4375rem` (7px) | Buttons only — tighter rounding grounds them visually and distinguishes them from containers |

Buttons use a smaller radius deliberately. Pill-shaped buttons (high radius) feel consumer and casual. A 7px radius reads as intentional and precise without feeling sharp.

Never use `rounded-full` on buttons. Avatars and purely decorative circular elements are the only exception.

---

## Light and Dark Mode

Both modes are first-class. Every component must work in light mode, dark mode, and with system preference. This is not optional. Test both before considering a component done.

The CSS custom property system handles the majority of theming automatically. The soft, warm-tinted backgrounds mean dark mode looks like a candlelit room, not a cave. It is easy on the eyes for long sessions.

Implementation:
- `.dark` class on the root element (`<html>` or `<body>`)
- Store explicit preference in `localStorage` as `"light"`, `"dark"`, or `"system"`
- Default to `"system"` — respect `prefers-color-scheme` unless overridden
- The ThemeToggle component cycles through all three states

Watch for these dark mode edge cases:
- Semi-transparent backgrounds: `bg-card/80` — test that the blurred content behind reads well in both modes
- Semantic color tints: bump alpha from `/10` to `/15` in dark mode (`dark:bg-emerald-500/15`)
- Hardcoded semantic text classes: add `dark:` variants (`text-emerald-600 dark:text-emerald-400`)
- Glass morphism (`backdrop-blur`): test that the overlay is legible over both light and dark content behind it

---

## Accessibility

Accessibility is not an enhancement — it is a baseline requirement.

- **Focus rings**: All interactive elements show a visible focus ring using `--ring`. Never suppress `:focus-visible`. Keyboard users navigate these interfaces too.
- **Touch targets**: Minimum `44×44px` for all interactive elements on touch screens.
- **Color contrast**: All text must meet WCAG AA (4.5:1 for body text, 3:1 for large text). The token system is calibrated to meet this in both modes.
- **Labels**: All form inputs have associated labels. Icon-only buttons always have a `aria-label` and a visible `Tooltip`.
- **Keyboard navigation**: Dropdowns, dialogs, and menus are keyboard navigable (arrow keys, Escape, Enter/Space). Never build custom interactive elements without keyboard handling.
- **Announcements**: Toasts and dynamic status changes use `aria-live` regions so screen readers catch them.
- **Motion**: Respect `prefers-reduced-motion`. Wrap all transitions in the appropriate media query.

---

## Components

The full Olive component inventory. All components are Svelte primitives exported from the library.

---

### Primitives

The atoms. Everything else composes from these.

| Component | Description |
|---|---|
| `Button` | Primary action surface. Variants: `default`, `outline`, `ghost`, `destructive`, `link`. Sizes: `sm` (28px), `md` (32px), `lg` (40px), `icon` (32px square). Uses `--radius-button` (7px). Default and destructive variants carry a subtle box-shadow for depth — inner top highlight and outer bottom shadow. Active state collapses the shadow inward. |
| `Input` | Text input. Focus ring, placeholder, disabled, error state. |
| `Textarea` | Multiline input. Vertical resize. |
| `Label` | Form field label, associated via `for`. |
| `Checkbox` | Binary toggle. Supports indeterminate state. |
| `RadioGroup` + `RadioItem` | Mutually exclusive option group. |
| `Select` + `SelectItem` | Dropdown selector. Keyboard navigable. |
| `Switch` | Toggle for boolean settings. |
| `Slider` | Range input. Single value and range variants. |
| `Badge` | Status and label pill. Variants map to semantic status colors. |
| `Avatar` | Image or initials identifier circle. |
| `Separator` | Horizontal or vertical divider. |

---

### Layout

Structure and containment.

| Component | Description |
|---|---|
| `Card` + `CardHeader` + `CardTitle` + `CardDescription` + `CardContent` + `CardFooter` | Standard content container for any distinct entity. Do not nest cards unless there is a clear parent–child relationship. |
| `Page` | Outermost page wrapper. Applies background, max-width, standard padding. |
| `PageHeader` | Page title, description, and primary action slot. |
| `Breadcrumbs` | Hierarchical path navigation. |
| `Panel` | Fixed or floating side panel. Collapsible. |
| `Sidebar` | Persistent lateral navigation for section-level structure. |
| `Resizable` | Draggable split pane, horizontal or vertical. |
| `ScrollArea` | Custom scrollbar container. Cross-platform consistent. |
| `Tabs` + `TabList` + `Tab` + `TabPanel` | Section-level tab navigation. State-driven. |

---

### Navigation

| Component | Description |
|---|---|
| `Navbar` | Sticky top bar with backdrop blur. Logo, nav links, and actions slots. `h-14` height. |
| `NavItem` | Single nav link. Icon + label or label only. Active state. |
| `MobileMenu` | Collapsible navigation panel for small screens. Opens from Navbar. |
| `ThemeToggle` | Light / dark / system mode toggle. Icon button with smooth icon transition. |
| `CommandPalette` | Keyboard-driven search and navigation overlay (⌘K). Debounced search, arrow-key navigation, shortcut hints. |

---

### Overlay & Feedback

| Component | Description |
|---|---|
| `Dialog` + `DialogHeader` + `DialogContent` + `DialogFooter` | Modal for creation forms and destructive confirmations. Always requires explicit dismiss. |
| `Sheet` | Sliding panel from screen edge. For detail views and settings drawers. |
| `Tooltip` | Hover-activated label. Required on all icon-only buttons. |
| `Popover` | Anchored floating container for inline content. |
| `DropdownMenu` + `DropdownItem` + `DropdownSeparator` | Contextual action menu. Keyboard navigable. |
| `ContextMenu` | Right-click menu. Same structure as DropdownMenu. |
| `Toast` | Transient notification. Fixed bottom center. Auto-dismiss. Variants: default, success, warning, error. |
| `Alert` | Inline status message. Not dismissible. Variants: info, success, warning, error. |
| `AlertDialog` | Blocking confirmation for destructive actions. Explicit confirm + cancel required. |
| `Progress` | Linear progress bar. Determinate and indeterminate. Color maps to semantic status. |
| `Skeleton` | Loading placeholder. Matches the geometry of the content it replaces. |

---

### Data Display

| Component | Description |
|---|---|
| `Table` + `TableHeader` + `TableRow` + `TableCell` + `TableBody` | Tabular data. Sticky headers. Monospace cells for data values. Hover row. Truncation with tooltip. |
| `DataTable` | Table with sorting, filtering, and pagination built in. |
| `CodeBlock` | Syntax-highlighted code display. Monospace. Copy-to-clipboard. Language label. |
| `CodeEditor` | Monaco-based code editor. Dark/light theme sync. |
| `JsonViewer` | Collapsible JSON tree. Syntax highlighted. Copy individual values. |
| `KeyValue` | Compact key–value pair display. Monospace values. Copy action. |
| `MetricCard` | Single metric: icon with tinted background, label, value. |
| `StatGrid` | Responsive grid of MetricCards. |
| `EmptyState` | Centered message and CTA for zero-data views. Always includes a primary action. |
| `Timeline` | Interactive time-range control with play/pause/step playback. |
| `RelationsGraph` | SVG entity relationship diagram. Node cards, Bezier curve edges, hover labels. |
| `KanbanBoard` + `KanbanColumn` + `KanbanCard` | Drag-and-drop board. Columns with drop targets. Cards with hover-reveal actions. |

---

### Forms

| Component | Description |
|---|---|
| `Form` + `FormField` + `FormLabel` + `FormControl` + `FormMessage` | Form structure with validation state, error messages, and accessible labeling. |
| `Combobox` | Searchable select with type-ahead. Keyboard navigable. |
| `MultiSelect` | Tag-style multi-value select. |
| `DatePicker` | Calendar popover for date selection. |
| `DateRangePicker` | Calendar popover for start and end date selection. |
| `FileUpload` | Drop zone and click-to-browse. Drag-over state. File type and size validation. |
| `SearchInput` | Input with search icon, clear button, and debounce. |

---

### Specialized

Purpose-built for technical and infrastructure contexts.

| Component | Description |
|---|---|
| `LogStream` | High-performance virtualized log viewer. Level badges, timestamp formatting, jump-to-bottom, pause-on-scroll. |
| `SqlEditor` | Monaco editor configured for SQL. Schema-aware autocomplete, execution state. |
| `SchemaView` | Table schema display: columns, types, constraints, indexes, foreign keys. |
| `ConnectionString` | Formatted connection string with copy action and optional value masking. |
| `ApiKeyCard` | Key display with masked value, type badge, copy button, created date, revoke action. |
| `OperationBadge` | Badge for data operation types (Write, Delete, Update) with semantic color. |
| `DrawCanvas` | Full-screen canvas. Tool states, pan, zoom, pointer event handling. |
| `Toolbar` | Fixed vertical or horizontal toolbar. Tool sections with icon buttons and collapse. |
| `PropertyPanel` | Collapsible properties sidebar. Sections, field rows with labels and controls. |

---

## Do's

**Layout & Spacing**
- Generous whitespace. More padding, not less. Space is structure.
- `max-w-7xl` on all page content. Never edge-to-edge on wide screens.
- 4px/8px spacing scale only. No arbitrary pixel values.
- Left-align labels and headings. Right-align numeric data and actions.
- Navbar at `h-14`. Present but not dominant.

**Typography**
- Plus Jakarta Sans everywhere. Do not add fonts.
- Monospace for any content that belongs to a system.
- `font-semibold` for titles, `font-medium` for labels, `font-normal` for body.
- `muted-foreground` for secondary information.

**Color**
- CSS variable classes for all brand and neutral colors.
- Semantic colors only: emerald, amber, red, sky, purple — and only for their defined meanings.
- Background tints at `/10`–`/15` alpha. No solid colored areas.

**Interactions**
- Focus rings on every interactive element. Never suppress them.
- Glass morphism (`bg-card/80 backdrop-blur-xl`) only for navbars and overlays.
- Confirm destructive actions in an AlertDialog. Never on a single click.

**Data**
- Format numbers: `1.2K`, not `1200`.
- Format timestamps: `Mar 11, 2026` or `2 hours ago`. Never raw ISO strings.
- Skeleton states for loading. Empty states with a message and primary CTA.

---

## Don'ts

- No gradients on UI elements. Flat, solid colors.
- No new brand colors. `--primary` is the only accent.
- No pure black, pure white, or cold grays. Always use the token system.
- No arbitrary spacing or radius values.
- No `!important`.
- No nested cards without a clear parent–child relationship.
- No center-aligned body text. Center only for auth headings and empty states.
- No ALL CAPS except micro-labels.
- No browser `alert()` or `confirm()`.
- No hover-only affordances for critical actions.
- No auto-close on dialog success. Show the result; let the user dismiss.
- No loading spinners for operations under 200ms.
- No raw system error strings. Translate them for humans.
- No CSS animations on layout-triggering properties.

---

## Tone & Copy

- Direct. "Create key" not "Get started by generating your first API key".
- Sentence case. "API keys" not "API Keys" (exceptions: proper nouns, acronyms like SQL, JSON, UUID).
- Precise vocabulary. "Query", "schema", "index" — not watered-down alternatives.
- Error messages state what happened and what to do: "Name already taken. Choose a different one."
- Confirmation messages are specific: "'production' deleted" not "Item removed successfully."
- Under 15 words for any description.

---

## File Structure

```
olive/
  src/
    lib/
      components/
        primitives/     # Button, Input, Badge, Label, Checkbox, etc.
        layout/         # Card, Page, Panel, Sidebar, Tabs, etc.
        navigation/     # Navbar, NavItem, ThemeToggle, CommandPalette, etc.
        overlay/        # Dialog, Toast, Tooltip, Popover, Sheet, etc.
        data/           # Table, DataTable, CodeBlock, MetricCard, etc.
        forms/          # Form, Combobox, DatePicker, FileUpload, etc.
        specialized/    # LogStream, SqlEditor, DrawCanvas, Toolbar, etc.
      tokens/           # index.css — all CSS custom properties
      utils/            # cn(), formatNumber(), formatDate(), formatBytes()
    routes/
      +page.svelte      # Component showcase
```
