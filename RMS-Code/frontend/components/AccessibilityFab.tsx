import { useEffect, useMemo, useRef, useState } from "react";
import { PersonStanding } from "lucide-react";

type TextSize = "default" | "large" | "xl";

type A11yPrefs = {
  highContrast: boolean;
  reducedMotion: boolean;
  largeTargets: boolean;
  underlineLinks: boolean;
  textSize: TextSize;
};

const DEFAULT_PREFS: A11yPrefs = {
  highContrast: false,
  reducedMotion: false,
  largeTargets: false,
  underlineLinks: false,
  textSize: "default",
};

function applyPrefsToDom(p: A11yPrefs) {
  const root = document.documentElement;

  root.classList.toggle("a11y-contrast", p.highContrast);
  root.classList.toggle("a11y-reduce-motion", p.reducedMotion);
  root.classList.toggle("a11y-large-targets", p.largeTargets);
  root.classList.toggle("a11y-underline-links", p.underlineLinks);

  root.dataset.textSize = p.textSize;
}

function loadPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem("a11yPrefs");
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

const TOP_Z = 2147483647;

export function AccessibilityFab() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<A11yPrefs>(() => loadPrefs());

  const panelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const summary = useMemo(() => {
    const on = [
      prefs.highContrast && "Υψηλή αντίθεση",
      prefs.reducedMotion && "Μείωση κινήσεων",
      prefs.largeTargets && "Μεγ. στόχοι",
      prefs.underlineLinks && "Υπογρ. links",
      prefs.textSize !== "default" && `Κείμενο: ${prefs.textSize}`,
    ].filter(Boolean);
    return on.length ? on.join(" • ") : "Default";
  }, [prefs]);

  // persist + apply
  useEffect(() => {
    localStorage.setItem("a11yPrefs", JSON.stringify(prefs));
    applyPrefsToDom(prefs);
  }, [prefs]);

  // apply once
  useEffect(() => {
    applyPrefsToDom(prefs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // click outside close (pointerdown, capture)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!open) return;
      const t = e.target as Node;

      // αν πατήσεις μέσα στο widget, μην κλείσει
      if (rootRef.current && rootRef.current.contains(t)) return;

      setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown, true);
    return () => window.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5"
      style={{
        zIndex: TOP_Z,
        pointerEvents: "auto",
      }}
    >
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Ρυθμίσεις προσβασιμότητας"
          className="mb-3 w-[320px] rounded-2xl border border-white/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-4 text-white"
          style={{ zIndex: TOP_Z }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold">Προσβασιμότητα</h3>
              <p className="text-xs text-white/70">{summary}</p>
            </div>

            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="px-2 py-1 rounded-lg hover:bg-white/10"
              aria-label="Κλείσιμο"
            >
              ✕
            </button>
          </div>

          <Toggle
            label="Υψηλή αντίθεση"
            checked={prefs.highContrast}
            onChange={(v) => setPrefs((p) => ({ ...p, highContrast: v }))}
          />
          <Toggle
            label="Μείωση κινήσεων"
            checked={prefs.reducedMotion}
            onChange={(v) => setPrefs((p) => ({ ...p, reducedMotion: v }))}
          />
          <Toggle
            label="Μεγαλύτερα κουμπιά"
            checked={prefs.largeTargets}
            onChange={(v) => setPrefs((p) => ({ ...p, largeTargets: v }))}
          />
          <Toggle
            label="Υπογράμμιση links"
            checked={prefs.underlineLinks}
            onChange={(v) => setPrefs((p) => ({ ...p, underlineLinks: v }))}
          />

          <div className="flex justify-between items-center mt-3">
            <span className="text-sm">Μέγεθος κειμένου</span>
            <select
              className="bg-black/30 border border-white/20 rounded px-2 py-1"
              value={prefs.textSize}
              onChange={(e) =>
                setPrefs((p) => ({ ...p, textSize: e.target.value as TextSize }))
              }
              aria-label="Μέγεθος κειμένου"
            >
              <option value="default">Default</option>
              <option value="large">Large</option>
              <option value="xl">XL</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-3 w-full rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 py-2 text-sm"
            onPointerDown={(e) => {
              e.stopPropagation();
              setPrefs(DEFAULT_PREFS);
            }}
          >
            Επαναφορά
          </button>
        </div>
      )}

      {/* 🔵 ΜΠΛΕ ΣΦΑΙΡΑ */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="
          h-14 w-14 rounded-full
          bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-500
          shadow-xl
          hover:from-blue-600 hover:via-sky-600 hover:to-cyan-600
          flex items-center justify-center
          transition
        "
        aria-label="Ρυθμίσεις προσβασιμότητας"
        aria-expanded={open}
      >
        <PersonStanding className="w-7 h-7 text-white" />
      </button>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex justify-between items-center text-sm mb-2">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
