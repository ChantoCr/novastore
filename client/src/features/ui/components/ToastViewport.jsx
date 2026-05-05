import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeToast, selectToasts } from '../uiSlice.js';

const toastStylesByType = {
  success: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100',
  info: 'border-violet-400/30 bg-violet-500/15 text-violet-100',
  warning: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  error: 'border-rose-400/30 bg-rose-500/15 text-rose-100',
};

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => window.clearTimeout(timeoutId);
  }, [onDismiss, toast.duration, toast.id]);

  return (
    <article
      className={`pointer-events-auto w-full max-w-sm rounded-3xl border p-4 shadow-2xl shadow-slate-950/40 backdrop-blur ${
        toastStylesByType[toast.type] || toastStylesByType.info
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{toast.title}</h3>
          {toast.message ? <p className="mt-1 text-sm leading-6">{toast.message}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/80 transition hover:text-white"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </article>
  );
}

function ToastViewport() {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-[min(92vw,24rem)] flex-col gap-3 lg:right-6 lg:top-24">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={(id) => dispatch(removeToast(id))} />
      ))}
    </div>
  );
}

export default ToastViewport;
