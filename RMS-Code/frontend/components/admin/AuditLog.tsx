import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  Filter,
  Info,
  LayoutList,
  List,
  Lock,
  RefreshCw,
  Search,
  Server,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

// --- Types ---

type Severity = "info" | "success" | "warning" | "critical";
type Category = "user" | "resource" | "system" | "backup" | "security";

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: Category;
  severity: Severity;
  details: string;
  ipAddress: string;
  userAgent: string;
  traceId: string; // Added traceId for realism
}

// --- Mock Data Generator ---

const generateMockData = (): AuditEntry[] => [
  {
    id: "evt_1",
    timestamp: "2025-12-09 14:30:25",
    user: "admin@efficiencity.gr",
    action: "SQL Injection Detected",
    category: "security",
    severity: "critical",
    details: "WAF Blocked suspicious query pattern from external IP range.",
    ipAddress: "45.22.19.112",
    userAgent: "Unknown/Bot",
    traceId: "trace-8f92a",
  },
  {
    id: "evt_2",
    timestamp: "2025-12-09 14:15:00",
    user: "g.papadopoulos@athens.gr",
    action: "Asset Registration",
    category: "resource",
    severity: "success",
    details: "Registered new heavy machinery: CAT Excavator 320 GC",
    ipAddress: "192.168.1.105",
    userAgent: "Chrome 120.0.0",
    traceId: "trace-7b81c",
  },
  {
    id: "evt_3",
    timestamp: "2025-12-09 13:45:12",
    user: "SYSTEM_DAEMON",
    action: "Snapshot Created",
    category: "backup",
    severity: "info",
    details: "Automated hourly volume snapshot (Vol-291) completed.",
    ipAddress: "10.0.0.5",
    userAgent: "AWS Lambda",
    traceId: "trace-3c44d",
  },
  {
    id: "evt_4",
    timestamp: "2025-12-09 12:20:05",
    user: "m.konstantinou@piraeus.gr",
    action: "Authentication Failure",
    category: "user",
    severity: "warning",
    details: "3 consecutive failed login attempts detected.",
    ipAddress: "192.168.1.110",
    userAgent: "Safari 17.1",
    traceId: "trace-9a11f",
  },
  {
    id: "evt_5",
    timestamp: "2025-12-09 10:00:00",
    user: "admin@efficiencity.gr",
    action: "Policy Update",
    category: "system",
    severity: "warning",
    details: "Modified data retention policy from 60 to 90 days.",
    ipAddress: "192.168.1.100",
    userAgent: "Firefox 121.0",
    traceId: "trace-2d55e",
  },
];

// --- Helpers ---

const getSeverityConfig = (severity: Severity) => {
  switch (severity) {
    case "critical":
      return {
        icon: XCircle,
        color: "text-red-400",
        bg: "bg-red-500/10 border-red-500/20",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        color: "text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
      };
    case "success":
      return {
        icon: CheckCircle,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      };
    case "info":
      return {
        icon: Info,
        color: "text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
      };
  }
};

const downloadData = (data: AuditEntry[], format: "csv" | "json") => {
  let content = "";
  let type = "";
  const filename = `audit_log_export_${new Date().getTime()}.${format}`;

  if (format === "json") {
    content = JSON.stringify(data, null, 2);
    type = "application/json";
  } else {
    const headers = [
      "Timestamp",
      "Severity",
      "Category",
      "User",
      "Action",
      "Details",
      "IP",
      "TraceID",
    ];
    const rows = data.map((row) =>
      [
        row.timestamp,
        row.severity,
        row.category,
        row.user,
        row.action,
        `"${row.details}"`,
        row.ipAddress,
        row.traceId,
      ].join(",")
    );
    content = [headers.join(","), ...rows].join("\n");
    type = "text/csv";
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// --- Component ---

export function AuditLog() {
  const [entries] = useState<AuditEntry[]>(generateMockData());
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Filtering Logic ---
  const filteredData = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.ipAddress.includes(searchTerm);

      const matchesSeverity =
        severityFilter === "all" || entry.severity === severityFilter;
      const matchesCategory =
        categoryFilter === "all" || entry.category === categoryFilter;

      return matchesSearch && matchesSeverity && matchesCategory;
    });
  }, [entries, searchTerm, severityFilter, categoryFilter]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- Stats Calculation ---
  const stats = useMemo(
    () => ({
      total: entries.length,
      critical: entries.filter((e) => e.severity === "critical").length,
      today: entries.filter((e) => e.timestamp.startsWith("2025-12-09")).length,
    }),
    [entries]
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-500" />
              Audit Log
            </h2>
            <p className="text-gray-400 mt-1">
              Αρχείο καταγραφής ασφαλείας και ενεργειών συστήματος
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadData(filteredData, "csv")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-all border border-slate-700 font-mono text-sm"
            >
              <FileText className="w-4 h-4" /> CSV_EXPORT
            </button>
            <button
              onClick={() => downloadData(filteredData, "json")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-all border border-slate-700 font-mono text-sm"
            >
              <Database className="w-4 h-4" /> JSON_DUMP
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Total Events
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.total.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Critical Alerts
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.critical}
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 p-4 rounded-xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
                Last 24h
              </p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {stats.today}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-20 shadow-xl">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by TraceID, User, IP..."
            className="w-full bg-slate-950 border border-slate-800 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600 font-mono"
          />
        </div>

        {/* Filters & Toggles */}
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-2 bg-slate-950 rounded-lg border border-slate-800 p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-slate-800 text-orange-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "timeline"
                  ? "bg-slate-800 text-orange-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              title="Timeline View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="h-8 w-px bg-slate-800 mx-1 hidden md:block"></div>

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value as Severity | "all")
            }
            className="bg-slate-950 border border-slate-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Severity: All</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="success">Success</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value as Category | "all")
            }
            className="bg-slate-950 border border-slate-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Category: All</option>
            <option value="user">User</option>
            <option value="system">System</option>
            <option value="security">Security</option>
            <option value="resource">Resource</option>
            <option value="backup">Backup</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {currentData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <Filter className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-gray-400 font-medium">
              No logs found matching criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSeverityFilter("all");
                setCategoryFilter("all");
              }}
              className="mt-2 text-orange-400 text-sm hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === "table" ? (
          // --- Table View ---
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-gray-500 font-medium font-mono">
                    <th className="px-6 py-4">Severity</th>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Actor / Origin</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {currentData.map((entry) => {
                    const config = getSeverityConfig(entry.severity);
                    const Icon = config.icon;
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-800/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {entry.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap font-mono">
                          {entry.timestamp}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-200 font-medium">
                              {entry.user}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                              {entry.ipAddress}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300 font-medium block">
                            {entry.action}
                          </span>
                          <span className="text-xs text-gray-500 font-mono opacity-60">
                            Trace: {entry.traceId}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:break-words">
                          {entry.details}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // --- Timeline View ---
          <div className="space-y-4">
            {currentData.map((entry) => {
              const config = getSeverityConfig(entry.severity);
              const Icon = config.icon;
              return (
                <div key={entry.id} className="relative pl-6 sm:pl-0">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div
                        className={`p-2.5 rounded-lg flex-shrink-0 ${config.bg}`}
                      >
                        <Icon className={`w-5 h-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-medium">
                              {entry.action}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 mb-2">
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-gray-400 border border-slate-700 font-mono">
                                {entry.category.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
                                <User className="w-3 h-3" /> {entry.user}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 bg-slate-950/50 p-3 rounded border border-slate-800/50 font-mono">
                          {entry.details}
                        </p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> {entry.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" /> Trace:{" "}
                            {entry.traceId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center border-t border-slate-800 pt-4">
        <p className="text-sm text-gray-500">
          Viewing{" "}
          <span className="text-white font-medium">
            {(currentPage - 1) * itemsPerPage + 1}
          </span>{" "}
          -{" "}
          <span className="text-white font-medium">
            {Math.min(currentPage * itemsPerPage, filteredData.length)}
          </span>{" "}
          of{" "}
          <span className="text-white font-medium">{filteredData.length}</span>{" "}
          entries
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-400 px-2 font-mono">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE FOOTER */}
      <div className="mt-8 rounded-lg border border-slate-800 bg-slate-950/50 overflow-hidden">
        {/* Technical Header */}
        <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Server className="w-3 h-3" />
            <span>SYSTEM_DIAGNOSTICS_PANEL</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-500">
              LIVE_STREAM_ACTIVE
            </span>
          </div>
        </div>

        {/* Technical Content */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-500 font-mono">
          {/* Source */}
          <div className="space-y-2">
            <div className="text-gray-300 font-semibold mb-1 flex items-center gap-2">
              <Database className="w-3 h-3" /> Data Source
            </div>
            <div className="flex flex-col gap-1">
              <span>
                Provider: <span className="text-orange-400">Grafana Loki</span>{" "}
                (LogQL)
              </span>
              <span>
                Aggregator: <span className="text-blue-400">Promtail</span>
              </span>
              <span>Ingestion Rate: 450 events/sec</span>
            </div>
          </div>

          {/* Retention */}
          <div className="space-y-2">
            <div className="text-gray-300 font-semibold mb-1 flex items-center gap-2">
              <RefreshCw className="w-3 h-3" /> Retention Policy
            </div>
            <div className="flex flex-col gap-1">
              <span>Hot Storage (NVMe): 7 Days</span>
              <span>Cold Storage (S3 Glacier): 90 Days</span>
              <span>
                Compliance Mode:{" "}
                <span className="text-emerald-500">Enabled</span>
              </span>
            </div>
          </div>

          {/* Encryption */}
          <div className="space-y-2">
            <div className="text-gray-300 font-semibold mb-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> Security Layer
            </div>
            <div className="flex flex-col gap-1">
              <span>Encryption: AES-256 (At Rest)</span>
              <span>Transport: TLS 1.3 (In Transit)</span>
              <span>Integrity Check: SHA-512 Hash Chain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
