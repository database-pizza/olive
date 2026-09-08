interface ModalOptions {
  onEscape: () => void;
  initialFocus?: string;
}

let bodyLockCount = 0;
let previousBodyOverflow = '';
const backgroundStates = new Map<HTMLElement, {
  count: number;
  inert: boolean;
  ariaHidden: string | null;
}>();

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(',');

function focusableElements(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    if (element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
}

function lockBodyScroll() {
  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount += 1;
}

function unlockBodyScroll() {
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) document.body.style.overflow = previousBodyOverflow;
}

function hideBackground(node: HTMLElement): HTMLElement[] {
  let modalRoot = node;
  while (modalRoot.parentElement && modalRoot.parentElement !== document.body) {
    modalRoot = modalRoot.parentElement;
  }

  return Array.from(document.body.children)
    .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== modalRoot)
    .map((element) => {
      const state = backgroundStates.get(element);
      if (state) {
        state.count += 1;
      } else {
        backgroundStates.set(element, {
          count: 1,
          inert: element.inert,
          ariaHidden: element.getAttribute('aria-hidden'),
        });
      }
      element.inert = true;
      element.setAttribute('aria-hidden', 'true');
      return element;
    });
}

function restoreBackground(elements: HTMLElement[]) {
  for (const element of elements) {
    const state = backgroundStates.get(element);
    if (!state) continue;
    state.count -= 1;
    if (state.count > 0) continue;

    element.inert = state.inert;
    if (state.ariaHidden === null) element.removeAttribute('aria-hidden');
    else element.setAttribute('aria-hidden', state.ariaHidden);
    backgroundStates.delete(element);
  }
}

export function modal(node: HTMLElement, options: ModalOptions) {
  let currentOptions = options;
  const previousFocus = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  function focusInitial() {
    const requested = currentOptions.initialFocus
      ? node.querySelector<HTMLElement>(currentOptions.initialFocus)
      : null;
    (requested ?? focusableElements(node)[0] ?? node).focus();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      currentOptions.onEscape();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = focusableElements(node);
    if (focusable.length === 0) {
      event.preventDefault();
      node.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !node.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !node.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  lockBodyScroll();
  const hiddenBackground = hideBackground(node);
  node.addEventListener('keydown', handleKeydown);
  queueMicrotask(focusInitial);

  return {
    update(nextOptions: ModalOptions) {
      currentOptions = nextOptions;
    },
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
      restoreBackground(hiddenBackground);
      unlockBodyScroll();
      queueMicrotask(() => previousFocus?.focus());
    },
  };
}
