export type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onclick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
  action?: ToastAction;
}

function createToastStore() {
  let toasts = $state<Toast[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function schedule(id: string, duration: number) {
    const existing = timers.get(id);
    if (existing) clearTimeout(existing);
    if (duration > 0) {
      timers.set(
        id,
        setTimeout(() => remove(id), duration),
      );
    }
  }

  function add(message: string, opts: Partial<Omit<Toast, 'id' | 'message'>> = {}) {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      message,
      variant: opts.variant ?? 'default',
      duration: opts.duration ?? 5000,
      description: opts.description,
      action: opts.action,
    };
    toasts = [...toasts.slice(-3), toast];
    schedule(id, toast.duration);
    return id;
  }

  function remove(id: string) {
    const timer = timers.get(id);
    if (timer) clearTimeout(timer);
    timers.delete(id);
    toasts = toasts.filter((t) => t.id !== id);
  }

  function clear() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    toasts = [];
  }

  return {
    get toasts() {
      return toasts;
    },
    add,
    remove,
    clear,
    success: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) =>
      add(msg, { ...opts, variant: 'success' }),
    error: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) =>
      add(msg, { ...opts, variant: 'error' }),
    warning: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) =>
      add(msg, { ...opts, variant: 'warning' }),
    info: (msg: string, opts?: Partial<Omit<Toast, 'id' | 'message'>>) =>
      add(msg, { ...opts, variant: 'info' }),
  };
}

export const toast = createToastStore();
