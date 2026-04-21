<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';

  import Button   from '$lib/components/primitives/Button.svelte';
  import Input    from '$lib/components/primitives/Input.svelte';
  import Textarea from '$lib/components/primitives/Textarea.svelte';
  import Label    from '$lib/components/primitives/Label.svelte';
  import Checkbox from '$lib/components/primitives/Checkbox.svelte';
  import Switch   from '$lib/components/primitives/Switch.svelte';
  import Badge    from '$lib/components/primitives/Badge.svelte';
  import Avatar   from '$lib/components/primitives/Avatar.svelte';
  import Slider   from '$lib/components/primitives/Slider.svelte';
  import Select   from '$lib/components/primitives/Select.svelte';
  import RadioGroup from '$lib/components/primitives/RadioGroup.svelte';
  import RadioItem  from '$lib/components/primitives/RadioItem.svelte';

  let checked = $state(false);
  let switched = $state(false);
  let sliderVal = $state(40);
  let radioVal = $state('read');
  let selectVal = $state('');
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Primitives</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">Core interactive building blocks.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="Button"
      description="Primary action element. Variants cover every intent; sizes fit every context."
      code={`<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
<Button disabled>Disabled</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Add">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
</Button>`}
      props={[
        { name: 'variant', type: "'default' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'default'", description: 'Visual style of the button' },
        { name: 'size', type: "'sm' | 'md' | 'lg' | 'icon'", default: "'md'", description: 'Height and padding preset' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents interaction and reduces opacity' },
        { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'HTML button type' },
        { name: 'class', type: 'string', description: 'Extra classes merged via cn()' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Input"
      description="Single-line text field. Supports error state and all native input attributes."
      code={`<Input placeholder="Database name" />
<Input value="taken-name" error />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />`}
      props={[
        { name: 'value', type: 'string', description: 'Bindable value' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Renders destructive border color' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
        { name: 'type', type: 'string', default: "'text'", description: 'HTML input type' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-3 w-full max-w-xs">
          <Input placeholder="Database name" />
          <Input value="taken-name" error />
          <Input disabled placeholder="Disabled" />
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Textarea"
      description="Multi-line text input with consistent styling."
      code={`<Textarea placeholder="Add notes…" />
<Textarea rows={6} placeholder="Longer content" />`}
      props={[
        { name: 'value', type: 'string', description: 'Bindable value' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text' },
        { name: 'rows', type: 'number', default: '3', description: 'Visible row count' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the textarea' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Destructive border' },
      ]}
    >
      {#snippet preview()}
        <Textarea placeholder="Add notes about this configuration…" class="max-w-sm w-full" />
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Label"
      description="Form label linked to an input via htmlFor / id."
      code={`<Label for="name">Database name</Label>
<Input id="name" placeholder="my-database" />`}
      props={[
        { name: 'for', type: 'string', description: 'id of the associated input element' },
        { name: 'class', type: 'string', description: 'Extra classes' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-1.5">
          <Label for="demo-input">Database name</Label>
          <Input id="demo-input" placeholder="my-database" class="max-w-xs" />
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Checkbox"
      description="Boolean toggle. Wrap in a Label or use id/for to make the entire row clickable."
      code={`<script>
  let checked = $state(false);
<\/script>

<div class="flex items-center gap-2.5">
  <Checkbox id="backups" bind:checked />
  <Label for="backups">Enable backups</Label>
</div>`}
      props={[
        { name: 'checked', type: 'boolean', default: 'false', description: 'Bindable checked state' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
        { name: 'id', type: 'string', description: 'Links to a <Label for="…">' },
      ]}
    >
      {#snippet preview()}
        <div class="flex items-center gap-2.5">
          <Checkbox id="cb-preview" bind:checked />
          <Label for="cb-preview">Enable backups {checked ? '✓' : ''}</Label>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Switch"
      description="On/off toggle. Visually distinct from Checkbox — use for settings that take effect immediately."
      code={`<script>
  let enabled = $state(false);
<\/script>

<div class="flex items-center gap-2.5">
  <Switch id="autoscale" bind:checked={enabled} />
  <Label for="autoscale">Auto-scale {enabled ? 'on' : 'off'}</Label>
</div>`}
      props={[
        { name: 'checked', type: 'boolean', default: 'false', description: 'Bindable on/off state' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
        { name: 'id', type: 'string', description: 'Links to a <Label for="…">' },
      ]}
    >
      {#snippet preview()}
        <div class="flex items-center gap-2.5">
          <Switch id="sw-preview" bind:checked={switched} />
          <Label for="sw-preview">Auto-scale {switched ? 'on' : 'off'}</Label>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Slider"
      description="Range input with zero-latency thumb tracking and tactile drag feedback."
      code={`<script>
  let retention = $state(30);
<\/script>

<div class="flex flex-col gap-2 w-48">
  <Label>Retention: {retention} days</Label>
  <Slider bind:value={retention} min={1} max={90} />
</div>`}
      props={[
        { name: 'value', type: 'number', description: 'Bindable current value' },
        { name: 'min', type: 'number', default: '0', description: 'Minimum value' },
        { name: 'max', type: 'number', default: '100', description: 'Maximum value' },
        { name: 'step', type: 'number', default: '1', description: 'Step increment' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-col gap-2 w-48">
          <Label>Retention: {sliderVal} days</Label>
          <Slider bind:value={sliderVal} min={1} max={90} />
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Select"
      description="Native select element with olive styling. Use Combobox for searchable options."
      code={`<script>
  let region = $state('');
<\/script>

<Select bind:value={region}>
  <option value="">Select a region</option>
  <option value="us-east-1">US East (Virginia)</option>
  <option value="eu-west-1">EU West (Ireland)</option>
</Select>`}
      props={[
        { name: 'value', type: 'string', description: 'Bindable selected value' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Destructive border' },
      ]}
    >
      {#snippet preview()}
        <Select bind:value={selectVal} class="max-w-xs w-full">
          <option value="">Select a region</option>
          <option value="us-east-1">US East (Virginia)</option>
          <option value="us-west-2">US West (Oregon)</option>
          <option value="eu-west-1">EU West (Ireland)</option>
        </Select>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="RadioGroup / RadioItem"
      description="Mutually exclusive options. RadioGroup provides the binding; RadioItem renders each option."
      code={`<script>
  let access = $state('read');
<\/script>

<RadioGroup bind:value={access} name="access-level">
  <RadioItem value="read">Read only</RadioItem>
  <RadioItem value="write">Read / Write</RadioItem>
  <RadioItem value="admin">Admin</RadioItem>
</RadioGroup>`}
      props={[
        { name: 'value', type: 'string', description: 'Bindable selected value (on RadioGroup)' },
        { name: 'name', type: 'string', description: 'HTML name attribute for the group' },
        { name: 'value (item)', type: 'string', description: 'Value emitted when this item is selected' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables a specific item' },
      ]}
    >
      {#snippet preview()}
        <RadioGroup bind:value={radioVal} name="docs-access">
          <RadioItem value="read">Read only</RadioItem>
          <RadioItem value="write">Read / Write</RadioItem>
          <RadioItem value="admin">Admin</RadioItem>
        </RadioGroup>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Badge"
      description="Semantic status label. Uses crosshair cursor to signal non-interactivity."
      code={`<Badge>Default</Badge>
<Badge variant="active">Active</Badge>
<Badge variant="paused">Paused</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="write">Write</Badge>
<Badge variant="delete">Delete</Badge>`}
      props={[
        { name: 'variant', type: "'default' | 'outline' | 'active' | 'paused' | 'error' | 'warning' | 'info' | 'debug' | 'trace' | 'write' | 'delete'", default: "'default'", description: 'Color and meaning' },
        { name: 'class', type: 'string', description: 'Extra classes' },
      ]}
    >
      {#snippet preview()}
        <div class="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="active">Active</Badge>
          <Badge variant="paused">Paused</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="write">Write</Badge>
          <Badge variant="delete">Delete</Badge>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Avatar"
      description="User identity mark. Falls back to initials when image fails or is absent."
      code={`<Avatar initials="DF" />
<Avatar initials="AB" size="sm" />
<Avatar initials="XY" size="lg" />
<Avatar src="/avatar.jpg" alt="Dan" initials="DF" />`}
      props={[
        { name: 'initials', type: 'string', description: 'Fallback text (1–2 chars)' },
        { name: 'src', type: 'string', description: 'Image URL — falls back to initials on error' },
        { name: 'alt', type: 'string', description: 'Image alt text' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter preset' },
      ]}
    >
      {#snippet preview()}
        <div class="flex items-center gap-3">
          <Avatar initials="DF" size="sm" />
          <Avatar initials="AB" />
          <Avatar initials="XY" size="lg" />
        </div>
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
