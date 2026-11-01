# Olive design system

Olive is the interface layer for database.pizza: a Svelte 5 + Tailwind v4
component library for tools that hold important data. This document describes
the system as it is implemented, not an aspiration.

---

## Character

**Calm precision.** The interface should feel like a well-organized workbench.
Nothing decorates for its own sake. Whitespace is structural: it lets content
speak without a border around every thought.

**Warmth without whimsy.** Near-black ink, warm gray structure and one living
olive accent. The accent is used where it means something — selection, focus,
health — not as wallpaper.

**Trust through honesty.** No layout shift, no misleading affordances, no
animation that hides state. Numbers are tabular. Errors say what happened.
Timestamps are readable. Motion explains a change and then stops.

**Small screens are first-class.** Every component is designed at phone width
first: touch-sized controls, sheets instead of dialogs, a bottom bar instead of
a hover menu. Desktop is the larger canvas, not the other way around.

---

## Foundations

### Type

Inter (400/500/600/700), with optical tracking tightened at display sizes.
Inter keeps word spaces and punctuation legible at dense sizes; Plus Jakarta
Sans remains as a warm fallback. The mono face is `Geist Mono` when available,
then the platform stack.

| Token | Size | Use |
|---|---|---|
| `--olive-text-display` | 28px | Hero numbers, one per page |
| `--olive-text-heading` | 22px | Page titles |
| `--olive-text-title` | 17px | Card and section titles |
| `--olive-text-control` | 14px | Body, controls |
| `--olive-text-body` | 13px | Dense body copy |
| `--olive-text-caption` | 12px | Metadata, timestamps |
| `--olive-text-micro` | 11px | Uppercase labels, keycaps |

Rules:
- Two weights per region: 400/500 for body, 600 for titles. Avoid 700.
- Numeric values use `.olive-tnum` (`font-variant-numeric: tabular-nums`).
- System data (queries, keys, identifiers) uses `.olive-mono` or
  `font-mono`. If it can be copied into another system, it is monospaced.
- Uppercase is reserved for micro labels with `tracking-[0.08em]`.
- Prose is limited to `max-w-prose`; it never stretches with the viewport.

### Color

Semantic tokens only. Products override the semantic layer (see
`src/lib/tokens.css`), never the primitives.

| Token | Light | Role |
|---|---|---|
| `--background` | warm near-white | Canvas |
| `--card` | white | Raised surface |
| `--foreground` | warm near-black | Primary ink |
| `--muted` | ink at 4.5% | Quiet fills |
| `--muted-foreground` | warm gray | Secondary text |
| `--subtle-foreground` | lighter gray | Tertiary labels |
| `--border` | ink at 9% | Hairline structure |
| `--border-strong` | ink at 16% | Hover / selected edges |
| `--input` | ink at 13% | Control outlines |
| `--primary` | near-black | Primary action |
| `--brand` | olive | Selection, focus, health, accent |
| `--brand-soft` | olive 13% | Active nav, chips, highlights |
| `--success` / `--warning` / `--destructive` / `--info` | semantic | Status |
| `--ring` | olive | Focus ring |

Rules:
- One border weight. Structure comes from `--border`, not from stacked shadows.
- Semantic status colors ship with matching `*-soft` and `*-foreground-soft`
  tokens. Use them together; never compose raw Tailwind greens or reds.
- No pure black or white as a text/background pair. No cold gray families.
- Status is never carried by color alone; it also has a shape (dot, icon, label).
- Badges and alerts use the named classes in `theme.css`
  (`.badge-active`, `.alert-warning`, …) so Tailwind's scanner cannot drop them.

### Shape and depth

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 6px | Keycaps, tiny controls |
| `--radius-button` | 8px | Buttons, inputs, selects |
| `--radius-control` | 8px | Large form controls |
| `--radius-surface` (`--radius`) | 12px | Small panels |
| `--radius-xl` | 14px | Cards |
| `--radius-2xl` | 18px | Dialogs, inset app panel, frames |
| `--radius-full` | 9999px | Pills, avatars, dots |

Depth is a hairline plus a 1px inner highlight (`--olive-inset-highlight`) and a
very soft shadow (`--olive-shadow-xs`). Popovers get
`--olive-shadow-popover`; only dialogs and sheets use `--olive-shadow-lg`.
Never animate `box-shadow` on scroll surfaces.

### Space

4px base scale: `--olive-space-1` (4) through `--olive-space-8` (64). Page
padding is `px-4 py-5` on phones, `sm:px-6 sm:py-7`, `lg:px-8`. Content is
capped at `max-w-6xl` by `Page`; settings pages use a narrower column.

---

## Motion

Motion answers "what changed, and where did it go?" It is short, settles, and
never loops for attention.

| Token | Value | Use |
|---|---|---|
| `--olive-duration-micro` | 120ms | Hover, color, check draw |
| `--olive-duration-fast` | 170ms | Press, focus, small state |
| `--olive-duration-base` | 230ms | Menus, tabs, reveals |
| `--olive-duration-slow` | 320ms | Sheets, page-level choreography |
| `--olive-duration-page` | 420ms | Route transitions (used sparingly) |

Easing:
- `--olive-ease-spring` — `cubic-bezier(0.34, 1.42, 0.64, 1)` for press and
  sliding indicators. A small overshoot, never a bounce.
- `--olive-ease-enter` — `cubic-bezier(0.16, 1, 0.3, 1)` for entering surfaces.
- `--olive-ease-exit` — `cubic-bezier(0.4, 0, 1, 1)` for leaving.
- `--olive-ease-move` — `cubic-bezier(0.22, 0.61, 0.36, 1)` for color/position.

Rules:
- Press: `scale(0.972)` (`.olive-press` or the Button's built-in state).
- Animate `transform`, `opacity`, `color`, `background-color`, `border-color`.
  Avoid animating layout. `width`/`height` only when a component is explicitly
  measured (tabs indicator) and never on scroll.
- Respect `prefers-reduced-motion`; the theme collapses every duration.
- Loading states appear after a short delay and never flash for <200ms.

Transition helpers live in `src/lib/utils/transitions.ts`
(`popIn/popOut`, `surfaceIn/surfaceOut`, `sheetIn/sheetOut`). Use them instead
of ad-hoc keyframes so reduced motion and viewport behavior stay consistent.

---

## Responsive behavior

Breakpoints: base (phone), `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536.

- Controls are 36px tall on phones and 32px from `sm` up (`.h-9 sm:h-8`).
- Inputs use 16px text on phones so iOS does not zoom.
- Page actions stack full-width under the header on phones.
- Data tables scroll horizontally; settings rows stack label and action.
- `Dialog` becomes a bottom sheet on phones (drag handle, safe-area padding).
- `Sheet side="bottom"` supports drag-to-dismiss on touch.
- `CommandPalette` fills the viewport width on phones and centres at `sm`.
- `Sidebar` is a drawer on phones and a collapsing rail from `lg`.
- Bottom navigation respects `env(safe-area-inset-bottom)`.
- Never rely on hover for essential actions. Provide a visible control.

---

## Accessibility

- Focus: 2px olive ring with a 2px offset on every interactive element
  (`.olive-focus` / component-level `focus-visible` classes).
- Touch targets: 44×44 minimum on coarse pointers; compact controls may be
  visually smaller but must be wrapped or padded.
- Dialogs and sheets use `modal()`: focus trap, Escape, background `inert`,
  scroll lock and focus restoration.
- Menus support Arrow keys, Home/End, Enter and Escape and return focus.
- Tabs support Arrow keys and expose `role="tablist"`/`tabpanel`.
- Toasts use `aria-live="polite"`; alerts use `role="alert"`.
- Icons that carry meaning have `aria-label`; decorative SVGs use
  `aria-hidden="true"`.
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1 in both themes.

---

## Component inventory

### Primitives
`Button` (default, brand, secondary, outline, ghost, destructive,
destructive-outline, link; xs–lg, icon sizes, loading) · `Input` · `Textarea` ·
`Select` · `Label` · `FormField` · `Checkbox` · `Switch` · `RadioGroup` +
`RadioItem` · `Slider` · `SegmentedControl` · `Badge` · `Avatar` · `Separator` ·
`Kbd` · `Spinner`.

### Layout
`Page` · `PageHeader` · `SectionHeader` · `Card` + header/title/description/
content/footer/action · `Frame` + `FramePanel`/header/title/description/footer ·
`SettingsList` + `SettingRow` · `AppShell` · `Tabs` · `Breadcrumbs` ·
`PageToolbar` · `ScrollArea`.

### Navigation
`Sidebar` (rail + mobile drawer) · `SidebarSection` · `SidebarItem` · `Navbar` ·
`NavItem` · `ThemeToggle` · `CommandPalette`.

### Overlay and feedback
`Dialog` (phone bottom sheet) · `Sheet` · `AlertDialog` · `DropdownMenu` ·
`Popover` · `Tooltip` · `Toaster` / `toast` · `Alert` · `Progress` · `Skeleton` ·
`ShortcutSheet`.

### Data
`Table` · `DataTable` · `MetricCard` · `StatusPill` · `Sparkline` · `QuotaRing` ·
`EmptyState` · `CodeBlock` · `CopyButton` · `KeyValue` · `TimeAgo` ·
`ConnectionCard` · `LogStream` · `DiffViewer` · `JsonViewer` · `Kanban*`.

### Forms
`Combobox` · `MultiSelect` · `DatePicker` · `FileUpload` · `SearchInput` ·
`FilterChips` · `PasswordStrength`.

---

## Usage

```css
/* app.css */
@import "tailwindcss";
@import "@database.pizza/olive/tokens";
@import "@database.pizza/olive/theme";
```

```svelte
<script lang="ts">
  import { Button, Card, Page, PageHeader } from '@database.pizza/olive';
</script>

<Page>
  <PageHeader title="Databases" description="Everything in this workspace.">
    {#snippet actions()}
      <Button variant="brand">New database</Button>
    {/snippet}
  </PageHeader>
  <Card>…</Card>
</Page>
```

Theme resolution happens before first paint in `app.html`:

```html
<script>
  const stored = localStorage.getItem('olive-theme') ?? 'system';
  const dark = stored === 'dark' ||
    (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
</script>
```

### Overriding a brand

Override semantic tokens, not primitives:

```css
:root {
  --brand: oklch(0.62 0.152 118);
  --brand-soft: color-mix(in oklab, var(--brand) 13%, transparent);
  --ring: var(--brand);
}
```

---

## Do / Don't

**Do**
- Use semantic tokens and the named status classes.
- Keep one primary action per region and make it `variant="brand"` when it is a
  creation/commit action in a product surface.
- Use `Frame` to group related panels; reserve `Card` for one distinct object.
- Write empty states with a concrete next action.
- Use tabular numbers for metrics and right-align them.
- Test every screen at 390px wide before calling it done.
- Verify both themes and reduced motion.

**Don't**
- Nest cards inside cards. Use a frame or a divider.
- Use olive for large fills; it is an accent.
- Use pure black/white, cold grays, or arbitrary hex values in components.
- Animate width, height, or top/left on scroll surfaces.
- Add a spinner for operations under ~200ms.
- Hide an action behind hover only.
- Ship a dialog without focus trapping and Escape handling.
