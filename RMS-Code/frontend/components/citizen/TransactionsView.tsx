import {
  Calendar,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// --- Configuration & Types ---

const ACTION_TYPES = [
  "Καταγραφή",
  "Προσφορά",
  "Αίτηση",
  "Τροποποίηση",
  "Διαγραφή",
];

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any; ring: string }
> = {
  completed: {
    label: "Ολοκληρώθηκε",
    color: "bg-emerald-500/20 text-emerald-300",
    ring: "ring-emerald-500/40",
    icon: CheckCircle,
  },
  pending: {
    label: "Εκκρεμεί",
    color: "bg-amber-500/20 text-amber-300",
    ring: "ring-amber-500/40",
    icon: Clock,
  },
  rejected: {
    label: "Απορρίφθηκε",
    color: "bg-rose-500/20 text-rose-300",
    ring: "ring-rose-500/40",
    icon: XCircle,
  },
};

const recentActions = [
  {
    id: "1",
    action: "Καταγραφή Εκσκαφέα",
    municipality: "Προς Δήμο Πειραιά",
    date: "2025-12-09",
    status: "completed",
    type: "Καταγραφή",
  },
  {
    id: "2",
    action: "Διαγραφή Αντλίας Νερού",
    municipality: "Από Δήμο Καλλιθέας",
    date: "2025-12-08",
    status: "rejected",
    type: "Διαγραφή",
  },
  {
    id: "3",
    action: "Καταγραφή Νέου Οχήματος",
    municipality: "Δήμος Αθηναίων",
    date: "2025-12-07",
    status: "pending",
    type: "Καταγραφή",
  },
  {
    id: "4",
    action: "Τροποποίηση Γερανού",
    municipality: "Προς Δήμο Χαλανδρίου",
    date: "2025-12-06",
    status: "completed",
    type: "Τροποποίηση",
  },
  {
    id: "5",
    action: "Προσφορά Ηλεκτρογεννήτριας",
    municipality: "Προς Δήμο Γλυφάδας",
    date: "2025-12-05",
    status: "pending",
    type: "Προσφορά",
  },
  {
    id: "6",
    action: "Αίτηση Φορτηγού",
    municipality: "Από Δήμο Αμαρουσίου",
    date: "2025-12-04",
    status: "completed",
    type: "Αίτηση",
  },
];

export default function TransactionsView() {
  // --- State ---
  const [filterType, setFilterType] = useState("");
  const [filterMunicipality, setFilterMunicipality] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [searchResults, setSearchResults] = useState<typeof recentActions>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- Logic ---

  const performFiltering = () => {
    return recentActions.filter((r) => {
      const matchType = filterType ? r.type === filterType : true;
      const matchStatus = filterStatus ? r.status === filterStatus : true;
      const matchMuni = filterMunicipality
        ? r.municipality
            .toLowerCase()
            .includes(filterMunicipality.toLowerCase())
        : true;
      return matchType && matchStatus && matchMuni;
    });
  };

  const handleSearch = () => {
    const results = performFiltering();
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleClearFilters = () => {
    setFilterType("");
    setFilterMunicipality("");
    setFilterStatus("");
    setHasSearched(false);
    setSearchResults([]);
  };

  const handleExport = async (format: "pdf" | "excel") => {
    const dataToExport = hasSearched ? searchResults : recentActions;

    if (format === "pdf") {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF();

      pdf.setFontSize(18);
      pdf.text("Ιστορικό Συναλλαγών", 14, 20);
      pdf.setFontSize(10);
      pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString("el-GR")}`, 14, 30);

      if (hasSearched) {
        pdf.text(
          `Φίλτρα: ${filterType || "Όλα"}, ${
            filterStatus
              ? STATUS_CONFIG[filterStatus].label
              : "Όλες καταστάσεις"
          }`,
          14,
          40
        );
      }

      let yPos = 55;
      dataToExport.forEach((action, index) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }

        const statusLabel =
          STATUS_CONFIG[action.status]?.label || action.status;

        pdf.text(`${index + 1}. ${action.action} [${action.type}]`, 14, yPos);
        pdf.text(`   Δήμος: ${action.municipality}`, 14, yPos + 6);
        pdf.text(`   Κατάσταση: ${statusLabel}`, 14, yPos + 12);
        pdf.text(
          `   Ημερομηνία: ${new Date(action.date).toLocaleDateString("el-GR")}`,
          14,
          yPos + 18
        );

        yPos += 28;
      });

      pdf.save("transactions-report.pdf");
    } else {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(
        dataToExport.map((action) => ({
          Ενέργεια: action.action,
          Τύπος: action.type,
          Δήμος: action.municipality,
          Ημερομηνία: new Date(action.date).toLocaleDateString("el-GR"),
          Κατάσταση: STATUS_CONFIG[action.status]?.label || action.status,
        }))
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Συναλλαγές");
      XLSX.writeFile(wb, "transactions-report.xlsx");
    }
  };

  // --- Render Helpers ---

  const renderStatusBadge = (statusKey: string) => {
    const config = STATUS_CONFIG[statusKey] || STATUS_CONFIG.completed;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ring-1 font-medium ${config.color} ${config.ring}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  const displayData = hasSearched ? searchResults : recentActions;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl text-white font-light tracking-wide">
          Πρόσφατες Συναλλαγές
        </h2>
      </div>

      {/* --- Filter Section --- */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8 shadow-xl">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Filter className="w-5 h-5 text-purple-400" />
          <h3 className="text-xl font-medium">Φίλτρα Αναζήτησης</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-2">
              Τύπος
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
            >
              <option value="" className="bg-slate-800">
                Όλοι οι τύποι
              </option>
              {ACTION_TYPES.map((type) => (
                <option key={type} value={type} className="bg-slate-800">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-2">
              Κατάσταση
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
            >
              <option value="" className="bg-slate-800">
                Όλες οι καταστάσεις
              </option>
              {Object.keys(STATUS_CONFIG).map((key) => (
                <option key={key} value={key} className="bg-slate-800">
                  {STATUS_CONFIG[key].label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 text-xs uppercase font-bold tracking-wider mb-2">
              Αναζήτηση Δήμου
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filterMunicipality}
                onChange={(e) => setFilterMunicipality(e.target.value)}
                placeholder="π.χ. Πειραιά..."
                className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95 text-sm font-semibold"
            >
              Αναζήτηση
            </button>
            {(filterType ||
              filterMunicipality ||
              filterStatus ||
              hasSearched) && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white rounded-lg transition-all border border-white/20"
                title="Καθαρισμός Φίλτρων"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- Main List View with Export Buttons Header --- */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h3 className="text-xl text-white">
            {hasSearched ? "Αποτελέσματα" : "Όλες οι Ενέργειες"}
            <span className="ml-2 text-gray-300 text-base">
              ({displayData.length})
            </span>
          </h3>

          {/* Direct Export Buttons - No Preview */}
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => handleExport("pdf")}
              disabled={displayData.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport("excel")}
              disabled={displayData.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {displayData.length > 0 ? (
          <div className="space-y-3">
            {displayData.map((action) => (
              <div
                key={action.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1 group-hover:text-purple-300 transition-colors">
                      {action.action}
                    </p>
                    <p className="text-sm text-gray-300">
                      {action.municipality}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 justify-between md:justify-end">
                    <span className="text-sm text-gray-400 font-mono flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 opacity-60" />
                      {new Date(action.date).toLocaleDateString("el-GR")}
                    </span>
                    {renderStatusBadge(action.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-20" />
            <p>Δεν βρέθηκαν συναλλαγές με τα επιλεγμένα κριτήρια.</p>
            {hasSearched && (
              <button
                onClick={handleClearFilters}
                className="mt-4 text-purple-400 hover:underline"
              >
                Εκκαθάριση φίλτρων
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
