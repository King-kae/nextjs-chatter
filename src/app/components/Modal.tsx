// Modal.tsx
import React, { useCallback, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body: string | React.JSX.Element;
  footer?: string | React.JSX.Element;
  actionLabel?: string;
  deactionLabel?: string;
  disabled: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  deactionLabel,
  disabled,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (disabled) return;
    onClose();
  }, [disabled, onClose]);

  const handleSend = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-ink-950/50 backdrop-blur-sm
        ${isOpen ? 'transition-opacity duration-300 opacity-100' : 'transition-opacity duration-300 opacity-0 pointer-events-none'}`}
    >
      <div className={`relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto
        ${isOpen ? 'transition-transform duration-300 translate-y-0' : 'transition-transform duration-300 -translate-y-full'}`}
        ref={modalRef}
      >
        <div className="border-0 rounded-2xl shadow-soft relative flex flex-col bg-white outline-none focus:outline-none">
          <div className="flex items-center justify-between px-8 pt-8 rounded-t">
            <h3 className="font-display text-2xl font-bold text-ink-950">{title}</h3>
            <button
              className="p-1.5 ml-auto border-0 text-ink-500 hover:text-ink-800 hover:bg-ink-100 rounded-full transition"
              onClick={handleClose}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative px-8 pt-6 flex-auto">{body}</div>
          <div className="flex justify-between space-x-3 w-full gap-2 px-8 pt-6 pb-8">
            <button
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 p-2.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSend}
              disabled={disabled}
            >
              {actionLabel}
            </button>
            <button
             onClick={handleClose}
             className="w-full rounded-xl border border-ink-200 p-2.5 text-sm font-semibold text-ink-700 transition hover:bg-ink-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deactionLabel}
            </button>
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
