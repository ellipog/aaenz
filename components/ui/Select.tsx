"use client";

import { useEffect, useId, useRef, useState } from "react";

type Option = {
  value: string;
  label: string;
};

type Props = {
  id?: string;
  name?: string;
  label: string;
  /** Visible label above the trigger (rendered by parent). */
  options: Option[];
  defaultValue?: string;
  required?: boolean;
  className?: string;
  /** Shared input class so the trigger matches sibling text inputs. */
  triggerClassName?: string;
};

/**
 * Fully custom dropdown — no native <select>.
 *
 * Brand-consistent: paper/ink/moss styling, animated chevron, keyboard nav
 * (ArrowUp/Down, Home/End, Enter, Escape), click-outside & Escape to close,
 * screen-reader friendly via aria-activedescendant + roled listbox.
 *
 * Stays forms-compatible: a hidden <input> carries the selected value so it
 * shows up in FormData like a native select would.
 */
export function Select({
  id,
  name,
  label,
  options,
  defaultValue,
  required,
  triggerClassName = "",
}: Props) {
  const resolvedId = id ?? useId();
  const labelId = `${resolvedId}-label`;
  const listboxId = `${resolvedId}-listbox`;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(
    defaultValue ?? options[0]?.value ?? "",
  );
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      0,
      options.findIndex((o) => o.value === (defaultValue ?? options[0]?.value)),
    ),
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);

  const selected = options.find((o) => o.value === value);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Scroll the active option into view when the list opens / moves.
  useEffect(() => {
    if (open) {
      optionsRef.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [open, activeIndex]);

  function openList() {
    setOpen(true);
    setActiveIndex(
      Math.max(0, options.findIndex((o) => o.value === value)),
    );
  }

  function onTriggerKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault();
        openList();
        break;
      case "ArrowUp":
        e.preventDefault();
        openList();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
    }
  }

  function onListKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  function choose(index: number) {
    const opt = options[index];
    if (!opt) return;
    setValue(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div ref={rootRef} className="relative">
      {/* Visually-hidden label for screen readers (the visible label is
          rendered by the parent form; this provides the accessible name). */}
      <span id={labelId} className="sr-only">
        {label}
      </span>

      {/* Hidden input keeps it forms-compatible (FormData picks this up). */}
      <input type="hidden" name={name} value={value} required={required} />

      {/* Trigger — looks like a text input, behaves like a select. */}
      <button
        ref={triggerRef}
        id={resolvedId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        aria-controls={listboxId}
        aria-activedescendant={
          open ? `${listboxId}-${activeIndex}` : undefined
        }
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        className={`flex w-full items-center justify-between gap-2 text-left ${triggerClassName}`}
      >
        <span className={selected ? "" : "text-stone"}>
          {selected?.label ?? "—"}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-stone transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Options panel — custom, brand-styled. */}
      {open && (
        <ul
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          onKeyDown={onListKeyDown}
          className="custom-scroll absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border border-stone-soft bg-paper p-1 shadow-lg"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={opt.value}
                id={`${listboxId}-${i}`}
                ref={(el) => {
                  optionsRef.current[i] = el;
                }}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  // Prevent the button from stealing focus / closing early.
                  e.preventDefault();
                  choose(i);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex cursor-pointer items-center gap-2 rounded-xs px-3 py-2 text-sm transition-colors ${
                  isActive ? "bg-moss/10 text-ink" : "text-ink-soft"
                } ${isSelected ? "font-medium text-moss" : ""}`}
              >
                {/* Selection mark — contour check. */}
                {isSelected ? (
                  <svg
                    className="h-4 w-4 shrink-0 text-moss"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 8.5l3 3 7-7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="h-4 w-4 shrink-0" aria-hidden />
                )}
                <span className="flex-1">{opt.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
