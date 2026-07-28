"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wizard } from "./Wizard";

type Props = {
  open: boolean;
  onClose: () => void;
  initialTier?: string;
  initialService?: string;
  /** The element that opened the modal — focus returns here on close. */
  triggerRef?: React.RefObject<HTMLElement | null>;
};

/**
 * Mobile wizard — iOS-style bottom sheet.
 *
 * Slides up from the bottom, dims the background, locks body scroll, and
 * traps focus inside the sheet (Tab/Shift+Tab cycle within, Escape closes,
 * focus returns to the trigger on close).
 */
export function WizardModal({ open, onClose, initialTier, initialService, triggerRef }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock body scroll, trap focus, handle Escape, restore focus on close.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Remember what was focused before opening.
    previouslyFocused.current = document.activeElement as HTMLElement;

    // Move focus into the sheet.
    const sheet = sheetRef.current;
    if (sheet) {
      const focusable = sheet.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && sheetRef.current) {
        // Trap Tab within the sheet.
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKeyDown);
      // Return focus to the trigger (or whatever was focused before).
      const target = triggerRef?.current ?? previouslyFocused.current;
      target?.focus();
    };
  }, [open, onClose, triggerRef]);

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
            ref={sheetRef}
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
