// frontend/src/uiHistory.tsx
// (Μπορεί να είναι και .ts — δεν χρησιμοποιεί JSX, αλλά δουλεύει μια χαρά ως .tsx)

export type UiState = {
  // Γενικά UI “βήματα” που θες να μπαίνουν στο history
  tab?: string;

  // Modal (popup) state
  modal?: string | null;
  modalId?: string | null;

  // Drawer / side panel state
  drawer?: string | null;

  // Wizard / multi-step flow
  step?: number | null;
};

/**
 * Διαβάζει το UI state από το URL (query params).
 * Π.χ. /employee?tab=myResources&modal=resource&id=123&step=2
 */
export function getUiFromUrl(): UiState {
  const p = new URLSearchParams(window.location.search);

  const stepRaw = p.get("step");
  const step = stepRaw != null && stepRaw !== "" ? Number(stepRaw) : null;

  return {
    tab: p.get("tab") ?? undefined,
    modal: p.get("modal"),
    modalId: p.get("id"),
    drawer: p.get("drawer"),
    step: Number.isFinite(step) ? step : null,
  };
}

/**
 * Επιστρέφει URL string (pathname + query) αφού “γράψει” τα fields του UiState στο query.
 * Δεν αλλάζει το pathname (μένει π.χ. /employee, /admin, κλπ).
 */
export function buildUrlWithUi(ui: UiState): string {
  const p = new URLSearchParams(window.location.search);

  // tab
  if (ui.tab !== undefined) {
    if (ui.tab) p.set("tab", ui.tab);
    else p.delete("tab");
  }

  // modal
  if (ui.modal !== undefined) {
    if (ui.modal) p.set("modal", ui.modal);
    else p.delete("modal");
  }

  // modalId (id)
  if (ui.modalId !== undefined) {
    if (ui.modalId) p.set("id", ui.modalId);
    else p.delete("id");
  }

  // drawer
  if (ui.drawer !== undefined) {
    if (ui.drawer) p.set("drawer", ui.drawer);
    else p.delete("drawer");
  }

  // step
  if (ui.step !== undefined) {
    if (ui.step !== null) p.set("step", String(ui.step));
    else p.delete("step");
  }

  const qs = p.toString();
  return window.location.pathname + (qs ? `?${qs}` : "");
}

/**
 * Push νέο history entry με UI state (ώστε Back να γυρίζει στο προηγούμενο UI βήμα).
 * extraState: ό,τι άλλο θες να κουβαλάς στο history.state (π.χ. isLoggedIn, userType).
 */
export function pushUi(ui: UiState, extraState: Record<string, unknown> = {}) {
  const url = buildUrlWithUi(ui);

  const prev = (window.history.state ?? {}) as Record<string, unknown>;
  window.history.pushState({ ...prev, ui, ...extraState }, "", url);
}

/**
 * Replace το τρέχον history entry (δεν δημιουργεί νέο βήμα).
 * Χρήσιμο π.χ. στο “just logged in” για να μην υπάρχει το login στο history.
 */
export function replaceUi(ui: UiState, extraState: Record<string, unknown> = {}) {
  const url = buildUrlWithUi(ui);

  const prev = (window.history.state ?? {}) as Record<string, unknown>;
  window.history.replaceState({ ...prev, ui, ...extraState }, "", url);
}

/**
 * Πάρε UiState από history.state (αν υπάρχει), αλλιώς από URL.
 */
export function getUiState(): UiState {
  const st = window.history.state as { ui?: UiState } | null;
  return st?.ui ?? getUiFromUrl();
}

/**
 * Utility: “καθάρισε” modal από URL με replace (χωρίς νέο history entry).
 * Χρήσιμο όταν θες να σιγουρευτείς ότι δεν μένει modal στο url μετά από init.
 */
export function clearModalWithReplace(extraState: Record<string, unknown> = {}) {
  replaceUi({ modal: null, modalId: null }, extraState);
}
    