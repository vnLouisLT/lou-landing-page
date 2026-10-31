"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const TOAST_MS = 3000;

type ToastFn = (message: string) => void;

const ToastContext = createContext<ToastFn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toast = useCallback<ToastFn>((next) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(next);
    timer.current = setTimeout(() => setMessage(null), TOAST_MS);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {message !== null && (
        <div
          role="status"
          aria-live="polite"
          data-testid="toast"
          className="fixed bottom-6 left-1/2 z-[10000] max-w-[90vw] -translate-x-1/2 border-2 border-border bg-muted px-4 py-2 text-lg text-muted-foreground shadow-[0_0_12px_var(--border)] [animation:toast-in_0.2s_ease-out]"
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return toast;
}
