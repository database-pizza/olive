export type ToastVariant = 'default' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

function createToastStore() {
  let toasts = $state<Toast[]>([]);

  function add(message: string, opts: Partial<Omit<Toast, 'id' | 'message'>> = {}) {
    const id = Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      message,
      variant: opts.variant ?? 'default',
      duration: opts.duration ?? 4000,
      description: opts.description,
    };
    toasts = [...toasts, toast];

    setTimeout(() => remove(id), toast.duration);
    return id;
  }

  function remove(id: string) {
    toasts = toasts.filter(t => t.id !== id);
  }

  return {
    get toasts() { return toasts; },
    add,
    remove,
    success: (msg: string, opts?: Partial<Toast>) => add(msg, { ...opts, variant: 'success' }),
    error:   (msg: string, opts?: Partial<Toast>) => add(msg, { ...opts, variant: 'error' }),
    warning: (msg: string, opts?: Partial<Toast>) => add(msg, { ...opts, variant: 'warning' }),
  };
}

export const toast = createToastStore();
