import {
  Building2,
  CheckCircle,
  FileText,
  LogOut,
  Menu,
  Package,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MyResources } from "./employee/MyResources";
import OtherMunicipalityResources from "./employee/OtherMunicipalityResources";
import PendingApprovals from "./employee/PendingApprovals";
import Reports from "./employee/Reports";
import { ResourceRegistration } from "./employee/ResourceRegistration";
import { getUiFromUrl, pushUi, replaceUi } from "../uiHistory";

interface EmployeeDashboardProps {
  onLogout: () => void;
  userName?: string;
  municipalityName?: string;
}

type View =
  | "register"
  | "my-resources"
  | "other-resources"
  | "approvals"
  | "reports";

// Z-index system
const Z_INDEX = {
  overlay: 30,
  sidebar: 40,
  header: 50,
} as const;

const DEFAULT_VIEW: View = "register";

function isValidView(v: string | undefined | null): v is View {
  return (
    v === "register" ||
    v === "my-resources" ||
    v === "other-resources" ||
    v === "approvals" ||
    v === "reports"
  );
}

export function EmployeeDashboard({
  onLogout,
  userName = "Υπάλληλος Δήμου",
  municipalityName = "Δήμος Αθηναίων",
}: EmployeeDashboardProps) {
  const [currentView, setCurrentView] = useState<View>(DEFAULT_VIEW);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "register" as const, icon: Upload, label: "Καταγραφή Πόρων" },
    { id: "my-resources" as const, icon: Package, label: "Οι Πόροι Μου" },
    {
      id: "other-resources" as const,
      icon: Building2,
      label: "Πόροι Άλλων Δήμων",
    },
    {
      id: "approvals" as const,
      icon: CheckCircle,
      label: "Εκκρεμείς Αιτήσεις",
    },
    { id: "reports" as const, icon: FileText, label: "Αναφορές" },
  ];

  // ✅ Init + Back/Forward sync για tabs (γενικά)
  useEffect(() => {
    const sync = () => {
      const ui = getUiFromUrl();
      const tab = ui.tab;

      if (isValidView(tab)) {
        setCurrentView(tab);
      } else {
        setCurrentView(DEFAULT_VIEW);
        replaceUi({ tab: DEFAULT_VIEW });
      }
    };

    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu on screen resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    closeMobileMenu();

    // ✅ γράφει history entry ώστε Back να πάει στο προηγούμενο “βήμα”
    pushUi({ tab: view });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header
        className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0"
        style={{ zIndex: Z_INDEX.header }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div>
                <h1 className="text-2xl font-bold text-white">{userName}</h1>
                <p className="text-blue-200">{municipalityName}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Αποσύνδεση</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 w-72
          bg-white/10 backdrop-blur-lg border-r border-white/20
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
          style={{ zIndex: Z_INDEX.sidebar }}
        >
          <div className="p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    currentView === item.id
                      ? "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 lg:hidden"
            style={{ zIndex: Z_INDEX.overlay }}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-full">
            {currentView === "register" && <ResourceRegistration />}
            {currentView === "my-resources" && <MyResources />}
            {currentView === "other-resources" && <OtherMunicipalityResources />}
            {currentView === "approvals" && <PendingApprovals />}
            {currentView === "reports" && <Reports />}
          </div>
        </main>
      </div>
    </div>
  );
}
