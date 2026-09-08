interface PopupTriggerOptions {
  expanded: boolean;
  controls: string;
  haspopup: 'dialog' | 'listbox' | 'menu';
}

export function popupElement(node: HTMLElement | null): HTMLElement | null {
  return node?.firstElementChild instanceof HTMLElement ? node.firstElementChild : null;
}

export function popupTrigger(node: HTMLElement, options: PopupTriggerOptions) {
  let trigger: HTMLElement | null = null;
  let addedRole = false;
  let addedTabIndex = false;
  let previousHasPopup: string | null = null;
  let previousExpanded: string | null = null;
  let previousControls: string | null = null;

  function handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    node.click();
  }

  function connect() {
    trigger = popupElement(node);
    if (!trigger) return;

    previousHasPopup = trigger.getAttribute('aria-haspopup');
    previousExpanded = trigger.getAttribute('aria-expanded');
    previousControls = trigger.getAttribute('aria-controls');

    const nativeInteractive = trigger.matches('button, a[href], input, select, textarea');
    if (!nativeInteractive && !trigger.hasAttribute('role')) {
      trigger.setAttribute('role', 'button');
      addedRole = true;
    }
    if (!nativeInteractive && !trigger.hasAttribute('tabindex')) {
      trigger.tabIndex = 0;
      addedTabIndex = true;
    }
    if (!nativeInteractive) trigger.addEventListener('keydown', handleKeydown);
  }

  function sync(nextOptions: PopupTriggerOptions) {
    options = nextOptions;
    trigger?.setAttribute('aria-haspopup', options.haspopup);
    trigger?.setAttribute('aria-expanded', String(options.expanded));
    trigger?.setAttribute('aria-controls', options.controls);
  }

  connect();
  sync(options);

  return {
    update(nextOptions: PopupTriggerOptions) {
      sync(nextOptions);
    },
    destroy() {
      if (!trigger) return;
      trigger.removeEventListener('keydown', handleKeydown);
      if (previousHasPopup === null) trigger.removeAttribute('aria-haspopup');
      else trigger.setAttribute('aria-haspopup', previousHasPopup);
      if (previousExpanded === null) trigger.removeAttribute('aria-expanded');
      else trigger.setAttribute('aria-expanded', previousExpanded);
      if (previousControls === null) trigger.removeAttribute('aria-controls');
      else trigger.setAttribute('aria-controls', previousControls);
      if (addedRole) trigger.removeAttribute('role');
      if (addedTabIndex) trigger.removeAttribute('tabindex');
    },
  };
}
