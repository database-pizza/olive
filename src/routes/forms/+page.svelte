<script lang="ts">
  import DocBlock from '../DocBlock.svelte';
  import Separator from '$lib/components/primitives/Separator.svelte';
  import Label from '$lib/components/primitives/Label.svelte';
  import Input from '$lib/components/primitives/Input.svelte';
  import { toast } from '$lib/utils/toast.svelte.js';

  import FormField   from '$lib/components/forms/FormField.svelte';
  import SearchInput from '$lib/components/forms/SearchInput.svelte';
  import FileUpload  from '$lib/components/forms/FileUpload.svelte';
  import Combobox    from '$lib/components/forms/Combobox.svelte';
  import MultiSelect from '$lib/components/forms/MultiSelect.svelte';
  import DatePicker  from '$lib/components/forms/DatePicker.svelte';

  let searchVal = $state('');
  let comboVal = $state('');
  let multiVal = $state<string[]>([]);
  let dateVal = $state<Date | null>(null);

  const regions = [
    { value: 'us-east-1',     label: 'US East (Virginia)' },
    { value: 'us-west-2',     label: 'US West (Oregon)' },
    { value: 'eu-west-1',     label: 'EU West (Ireland)' },
    { value: 'ap-southeast-1',label: 'Asia Pacific (Singapore)' },
  ];

  const permissions = [
    { value: 'read',   label: 'Read' },
    { value: 'write',  label: 'Write' },
    { value: 'delete', label: 'Delete' },
    { value: 'admin',  label: 'Admin' },
  ];
</script>

<div class="mx-auto max-w-3xl px-6 py-12 lg:px-10">
  <div class="mb-10">
    <h1 class="text-2xl font-semibold text-[var(--foreground)]">Forms</h1>
    <p class="mt-1 text-sm text-[var(--muted-foreground)]">Composite form controls beyond native HTML inputs.</p>
  </div>

  <div class="flex flex-col gap-10">

    <DocBlock
      name="FormField"
      description="Wrapper that adds an error or hint message below any input. Use in place of ad-hoc error paragraphs."
      code={`<FormField hint="Must be unique within your project.">
  <Label>Name</Label>
  <Input placeholder="my-database" />
</FormField>

<FormField error="That name is already taken.">
  <Label>Name</Label>
  <Input value="taken-name" error />
</FormField>`}
      props={[
        { name: 'error', type: 'string', description: 'Error message shown in destructive color. Takes priority over hint.' },
        { name: 'hint', type: 'string', description: 'Help text shown in muted color' },
        { name: 'children', type: 'Snippet', description: 'Label + input content' },
      ]}
    >
      {#snippet preview()}
        <div class="grid gap-4 sm:grid-cols-2 w-full max-w-lg">
          <FormField hint="Must be unique within your project.">
            <Label>Database name</Label>
            <Input placeholder="my-database" />
          </FormField>
          <FormField error="That name is already taken.">
            <Label>Database name</Label>
            <Input value="taken-name" error />
          </FormField>
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="SearchInput"
      description="Search field with icon, debounced oninput callback, and a clear button."
      code={`<script>
  let query = $state('');
<\/script>

<SearchInput
  bind:value={query}
  placeholder="Search databases…"
  debounce={300}
  oninput={(v) => fetchResults(v)}
/>`}
      props={[
        { name: 'value', type: 'string', description: 'Bindable search string' },
        { name: 'placeholder', type: 'string', default: "'Search…'", description: 'Placeholder text' },
        { name: 'debounce', type: 'number', default: '200', description: 'Debounce delay in ms before oninput fires' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
        { name: 'oninput', type: '(value: string) => void', description: 'Debounced callback' },
      ]}
    >
      {#snippet preview()}
        <SearchInput bind:value={searchVal} placeholder="Search databases…" class="max-w-xs w-full" />
        {#if searchVal}<p class="text-xs text-[var(--muted-foreground)]">Query: {searchVal}</p>{/if}
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="Combobox"
      description="Searchable single-value select with type-ahead filtering and keyboard navigation."
      code={`<script>
  let region = $state('');

  const options = [
    { value: 'us-east-1', label: 'US East (Virginia)' },
    { value: 'eu-west-1', label: 'EU West (Ireland)' },
  ];
<\/script>

<Combobox
  options={options}
  bind:value={region}
  placeholder="Select a region…"
  onchange={(v) => console.log(v)}
/>`}
      props={[
        { name: 'options', type: '{ value: string; label: string; description?: string }[]', description: 'Available options' },
        { name: 'value', type: 'string', description: 'Bindable selected value' },
        { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Placeholder when nothing is selected' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the combobox' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Destructive border state' },
        { name: 'onchange', type: '(value: string) => void', description: 'Called when selection changes' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full max-w-xs">
          <Combobox options={regions} bind:value={comboVal} placeholder="Select a region…" />
          {#if comboVal}<p class="mt-1.5 text-xs text-[var(--muted-foreground)]">{comboVal}</p>{/if}
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="MultiSelect"
      description="Tag-style multi-value select. Selected items render as removable chips. Supports a max limit."
      code={`<script>
  let selected = $state([]);

  const options = [
    { value: 'read',   label: 'Read' },
    { value: 'write',  label: 'Write' },
    { value: 'delete', label: 'Delete' },
    { value: 'admin',  label: 'Admin' },
  ];
<\/script>

<MultiSelect
  options={options}
  bind:value={selected}
  placeholder="Select permissions…"
  max={3}
/>`}
      props={[
        { name: 'options', type: '{ value: string; label: string }[]', description: 'Available options' },
        { name: 'value', type: 'string[]', description: 'Bindable array of selected values' },
        { name: 'placeholder', type: 'string', default: "'Select…'", description: 'Shown when nothing is selected' },
        { name: 'max', type: 'number', description: 'Maximum number of selections' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the component' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Destructive border state' },
        { name: 'onchange', type: '(values: string[]) => void', description: 'Called when selection changes' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full max-w-xs">
          <MultiSelect options={permissions} bind:value={multiVal} placeholder="Select permissions…" max={3} />
          {#if multiVal.length > 0}<p class="mt-1.5 text-xs text-[var(--muted-foreground)]">{multiVal.join(', ')}</p>{/if}
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="DatePicker"
      description="Calendar popover for selecting a single date. Supports min/max constraints and a clear button."
      code={`<script>
  let date = $state(null);
<\/script>

<DatePicker
  bind:value={date}
  placeholder="Pick a date…"
  min={new Date()}
  onchange={(d) => console.log(d?.toISOString())}
/>`}
      props={[
        { name: 'value', type: 'Date | null', description: 'Bindable selected date' },
        { name: 'placeholder', type: 'string', default: "'Pick a date…'", description: 'Shown when no date is selected' },
        { name: 'min', type: 'Date', description: 'Earliest selectable date' },
        { name: 'max', type: 'Date', description: 'Latest selectable date' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the picker' },
        { name: 'error', type: 'boolean', default: 'false', description: 'Destructive border state' },
        { name: 'onchange', type: '(date: Date | null) => void', description: 'Called when date changes' },
      ]}
    >
      {#snippet preview()}
        <div class="w-full max-w-xs">
          <DatePicker bind:value={dateVal} />
          {#if dateVal}<p class="mt-1.5 text-xs text-[var(--muted-foreground)]">{dateVal.toISOString().split('T')[0]}</p>{/if}
        </div>
      {/snippet}
    </DocBlock>

    <Separator />

    <DocBlock
      name="FileUpload"
      description="Drag-and-drop zone with click-to-browse fallback, file type hints, and size validation."
      code={`<FileUpload
  accept=".sql,.csv,.json"
  multiple
  maxSize={10 * 1024 * 1024}
  onfiles={(files) => upload(files)}
/>`}
      props={[
        { name: 'accept', type: 'string', description: 'Comma-separated MIME types or extensions, e.g. ".sql,.csv"' },
        { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple file selection' },
        { name: 'maxSize', type: 'number', description: 'Maximum file size in bytes' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the drop zone' },
        { name: 'onfiles', type: '(files: File[]) => void', description: 'Called with the accepted file list' },
      ]}
    >
      {#snippet preview()}
        <FileUpload
          accept=".sql,.csv,.json"
          maxSize={10 * 1024 * 1024}
          class="max-w-sm w-full"
          onfiles={(files) => toast.add(`${files.length} file(s) selected`)}
        />
      {/snippet}
    </DocBlock>

  </div>
  <div class="h-16"></div>
</div>
