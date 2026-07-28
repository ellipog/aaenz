"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wizard } from "./Wizard";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTier?: string;
  initialService?: string;
};

/**
 * Mobile wizard — iOS-style bottom sheet.
 *
 * Slides up from the bottom (y: 100% → 0), dims the background, locks body
 * scroll, closes on Escape or backdrop click. The sheet takes ~92vh with
 * internal scrolling. Drag handle (moss) at the top.
 */
export function WizardModal({ open, onClose, initialTier, initialService }: Props) {
  // Lock body scroll while open; restore on close.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />

          {/* Sheet */}
          <motion.div
            className="custom-scroll relative flex max-h-[92vh] w-full flex-col rounded-t-lg border-t border-stone-soft bg-paper px-5 pb-6 pt-3 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            role="dialog"
            aria-modal="true"
            aria-label="Start et prosjekt"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-stone-soft" aria-hidden />

            {/* Wizard content (scrollable) */}
            <div className="flex-1 overflow-y-auto pr-1">
              <Wizard
                initialTier={initialTier}
                initialService={initialService}
                onComplete={onClose}
                onCancel={onClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
