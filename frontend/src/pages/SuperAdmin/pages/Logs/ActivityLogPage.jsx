import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import {
  Search,
  Download,
  History,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../../../api/axios";

const ACTION_STYLES = {
  create: { cls: "bg-emerald-100 text-emerald-700", label: "CREATE" },
  update: { cls: "bg-blue-100 text-blue-700", label: "UPDATE" },
  delete: { cls: "bg-red-100 text-red-600", label: "DELETE" },
  login: { cls: "bg-amber-100 text-amber-700", label: "LOGIN" },
  logout: { cls: "bg-violet-100 text-violet-700", label: "LOGOUT" },
};

const getActionStyle = (action) =>
  ACTION_STYLES[action?.toLowerCase()] || {
    cls: "bg-slate-100 text-slate-600",
    label: action?.toUpperCase() || "—",
  };

const PAGE_SIZE_OPTIONS = [10, 20, 50];

const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchLogs();
  }, []);
  useEffect(() => {
    setPage(1);
  }, [search, dateFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const now = new Date(),
      logDate = new Date(log.timestamp);
    if (dateFilter === "today" && logDate.toDateString() !== now.toDateString())
      return false;
    if (dateFilter === "7days" && (now - logDate) / 86400000 > 7) return false;
    const q = search.toLowerCase();
    const user = (log.username || log.User?.username || "").toLowerCase();
    return (
      user.includes(q) ||
      (log.action || "").toLowerCase().includes(q) ||
      (log.entity || "").toLowerCase().includes(q) ||
      (log.description || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const paginated = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

  const exportCSV = () => {
    const headers = [
      "#",
      "Username",
      "Action",
      "Entity",
      "Description",
      "Time",
    ];
    const rows = filteredLogs.map((l, i) => {
      const user = l.username || l.User?.username || `ID: ${l.userId}`;
      return [
        i + 1,
        user,
        l.action,
        l.entity,
        (l.description || "").replace(/,/g, " "),
        new Date(l.timestamp).toLocaleString(),
      ].join(",");
    });
    const blob = new Blob([[headers, ...rows].join("\n")], {
      type: "text/csv",
    });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `audit_logs_${new Date().toISOString().slice(0, 10)}.csv`,
    }).click();
  };

  const inputBase =
    "px-3 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition text-[#02135e] placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Audit Logları
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Sistema paydalanıwshıları háreketi tariyxı
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          <IoExitOutline className="text-lg" />
          <span className="hidden sm:inline">Shıǵıw</span>
        </Link>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {Object.entries(ACTION_STYLES).map(([key, val]) => {
          const count = logs.filter(
            (l) => l.action?.toLowerCase() === key
          ).length;
          return (
            <div
              key={key}
              className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center justify-between"
            >
              <span className="text-xs font-semibold text-slate-500">
                {val.label}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-lg ${val.cls}`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm px-4 sm:px-5 py-4 mb-4 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-3 flex-1">
          <div className="relative w-full sm:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Paydalanıwshı, háreket..."
              className={`${inputBase} w-full pl-8`}
            />
          </div>
          <div className="relative">
            <History
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`${inputBase} pl-8 cursor-pointer`}
            >
              <option value="all">Barlıq waqıt</option>
              <option value="today">Búgin</option>
              <option value="7days">Aqırǵı 7 kún</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">
            <span className="text-[#02135e] font-bold">
              {filteredLogs.length}
            </span>{" "}
            dana log
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#02135e] hover:bg-[#03197a] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">CSV júklep alıw</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 px-5 py-4 border-b border-slate-50 animate-pulse"
              >
                <div className="h-3 w-6 bg-slate-200 rounded" />
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-3 w-48 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <>
            {/* ── DESKTOP TABLE ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-100">
                    {[
                      "#",
                      "Foydalanuvchi",
                      "Harakat",
                      "Bo'lim",
                      "Tavsif",
                      "Vaqt",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-xs font-bold text-[#02135e] uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((log, i) => {
                    const user =
                      log.username || log.User?.username || `ID: ${log.userId}`;
                    const actionSt = getActionStyle(log.action);
                    const rowNum = (page - 1) * pageSize + i + 1;
                    return (
                      <tr
                        key={log.id}
                        className="border-b border-slate-50 hover:bg-[#f0f4ff]/60 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                          {rowNum}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <div className="w-7 h-7 rounded-lg bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-xs shrink-0">
                              {user.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold text-[#02135e]">
                              {user}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-lg ${actionSt.cls}`}
                          >
                            {actionSt.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">
                            {log.entity || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 max-w-[300px]">
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {log.description || "—"}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString("uz-UZ")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── MOBILE CARDS ── */}
            <div className="flex md:hidden flex-col divide-y divide-slate-50">
              {paginated.map((log, i) => {
                const user =
                  log.username || log.User?.username || `ID: ${log.userId}`;
                const actionSt = getActionStyle(log.action);
                const rowNum = (page - 1) * pageSize + i + 1;
                return (
                  <div
                    key={log.id}
                    className="p-4 flex items-start gap-3 hover:bg-[#f0f4ff]/40 transition-colors"
                  >
                    <span className="text-xs text-slate-400 font-medium w-5 shrink-0 pt-1">
                      {rowNum}
                    </span>

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                      {/* Top row: user + action + entity */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-md bg-[#02135e]/10 flex items-center justify-center text-[#02135e] font-bold text-[10px] shrink-0">
                            {user.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-bold text-[#02135e]">
                            {user}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${actionSt.cls}`}
                        >
                          {actionSt.label}
                        </span>
                        {log.entity && (
                          <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                            {log.entity}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {log.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {log.description}
                        </p>
                      )}

                      {/* Time */}
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString("uz-UZ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <span className="text-4xl mb-3">📋</span>
            <p className="text-sm font-medium">Loglar tabılmadı</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredLogs.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Bette:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none text-slate-600 focus:border-[#02135e]/40 transition cursor-pointer"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:border-[#02135e] hover:text-[#02135e] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`d-${idx}`}
                      className="px-1.5 text-slate-300 text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold transition-colors ${
                        page === p
                          ? "bg-[#02135e] text-white"
                          : "text-slate-500 hover:bg-[#f0f4ff] hover:text-[#02135e]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:border-[#02135e] hover:text-[#02135e] disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>

            <span className="text-xs text-slate-400 hidden sm:block">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filteredLogs.length)} /{" "}
              {filteredLogs.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;
