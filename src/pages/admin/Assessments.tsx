import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { AssessmentDocument, AssessmentStatus } from "@/types/admin";
import { toCsv } from "@/lib/csv";
import { mirrorStatus, removeStatus } from "@/lib/trackingStatus";
import { formatDistanceToNow, format } from "date-fns";
import {
  Search,
  SearchX,
  Inbox,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Monitor,
  MapPin,
} from "lucide-react";
import { TextInput, SelectField } from "@/components/assessment/fields";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toDate, toMillis } from "@/lib/runtime";
import type { Details } from "@/schemas/assessment";

export default function AssessmentsList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data State
  const [data, setData] = useState<AssessmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "in_review" | "completed">(
    "all",
  );
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Sorting State
  const [sortField, setSortField] = useState<"submittedAt" | "name">("submittedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(25);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Firestore Listener
  useEffect(() => {
    const q = query(collection(db, "assessments"), orderBy("submittedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(
          (d) => ({ id: d.id, ...d.data() }) as unknown as AssessmentDocument,
        );

        // Check for new arrivals to show a subtle toast (basic implementation)
        if (!loading && docs.length > data.length) {
          const newDoc = docs[0];
          if (newDoc && newDoc.status === "new") {
            // Note: In a real app we'd use a toast library, for now we can just log or use a simple state
            console.log(`New assessment from ${newDoc.details?.fullName}`);
          }
        }

        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [loading, data.length]);

  // Derived filtered & sorted data
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        // Search
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase();
          const { fullName = "", phone = "", email = "" } = item.details || {};
          const ref = (item.submissionId || "").slice(0, 8).toLowerCase();
          if (
            !fullName.toLowerCase().includes(q) &&
            !phone.includes(q) &&
            !email.toLowerCase().includes(q) &&
            !ref.includes(q)
          ) {
            return false;
          }
        }

        // Status
        if (statusFilter !== "all" && item.status !== statusFilter) return false;

        // Payment
        if (
          paymentFilter !== "all" &&
          (item.verificationStatus || item.payment?.verificationStatus || "pending") !==
            paymentFilter
        )
          return false;

        // Date (naive implementation for filtering based on submittedAt)
        if (dateFilter !== "all") {
          const date = toDate(item.submittedAt);
          const now = new Date();
          const diffDays = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
          if (dateFilter === "today" && diffDays > 1) return false;
          if (dateFilter === "7days" && diffDays > 7) return false;
          if (dateFilter === "30days" && diffDays > 30) return false;
          if (
            dateFilter === "month" &&
            (date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear())
          )
            return false;
        }

        return true;
      })
      .sort((a, b) => {
        let aVal, bVal;
        if (sortField === "name") {
          aVal = (a.details?.fullName || "").toLowerCase();
          bVal = (b.details?.fullName || "").toLowerCase();
        } else {
          aVal = toMillis(a.submittedAt);
          bVal = toMillis(b.submittedAt);
        }

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, debouncedSearch, statusFilter, paymentFilter, dateFilter, sortField, sortDir]);

  const displayedData = filteredData.slice(0, visibleCount);

  // Counts
  const newCount = data.filter((d) => d.status === "new").length;
  const inReviewCount = data.filter((d) => d.status === "in_review").length;
  const completedCount = data.filter((d) => d.status === "completed").length;

  const hasActiveFilters =
    search !== "" || statusFilter !== "all" || paymentFilter !== "all" || dateFilter !== "all";

  // Bulk Actions
  const handleBulkStatus = async (newStatus: AssessmentStatus) => {
    if (selectedIds.size === 0) return;
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => {
        const docRef = doc(db, "assessments", id);
        batch.update(docRef, {
          status: newStatus,
          reviewedBy: user?.email || "admin",
          reviewedAt: serverTimestamp(),
        });
      });
      await batch.commit();
      // Keep the public tracking records in step with the bulk change.
      await Promise.all([...selectedIds].map((id) => mirrorStatus(id, { status: newStatus })));
      setSelectedIds(new Set());
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedIds.size} assessments? This cannot be undone.`,
      )
    ) {
      try {
        const batch = writeBatch(db);
        selectedIds.forEach((id) => {
          const docRef = doc(db, "assessments", id);
          batch.delete(docRef);
        });
        await batch.commit();
        // Remove the public tracking records alongside the assessments.
        await Promise.all([...selectedIds].map((id) => removeStatus(id)));
        setSelectedIds(new Set());
      } catch (err) {
        alert("Failed to delete.");
      }
    }
  };

  const exportCSV = () => {
    if (filteredData.length === 0) return;

    // Flatten data for CSV
    const headers = [
      "Reference",
      "Date",
      "Name",
      "Age",
      "Gender",
      "Phone",
      "Email",
      "City",
      "State",
      "Mode",
      "Status",
      "Payment",
    ];
    const rows = filteredData.map((item) => {
      const d: Partial<Details> = item.details ?? {};
      const date = item.submittedAt ? format(toDate(item.submittedAt), "yyyy-MM-dd HH:mm") : "";
      const ref = (item.submissionId || "").slice(0, 8).toUpperCase();
      const payStatus = item.verificationStatus || item.payment?.verificationStatus || "pending";

      // Every field below comes from the public assessment form. toCsv escapes
      // each cell and neutralises spreadsheet formula triggers.
      return [
        ref,
        date,
        d.fullName,
        d.age,
        d.gender,
        d.phone,
        d.email,
        d.city,
        d.state,
        d.preferredMode,
        item.status || "new",
        payStatus,
      ];
    });

    const csv = toCsv(headers, rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gorebalance-assessments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "name" ? "asc" : "desc");
    }
  };

  // Render Helpers
  const renderStatusChip = (status: AssessmentStatus) => {
    if (status === "new") return <span className="af-status-chip af-status-chip--new">New</span>;
    if (status === "in_review")
      return <span className="af-status-chip af-status-chip--review">In review</span>;
    return <span className="af-status-chip af-status-chip--completed">Completed</span>;
  };

  const renderPaymentChip = (status: string) => {
    if (status === "verified")
      return (
        <span className="af-pay-chip af-pay-chip--verified">
          <CheckCircle2 size={12} /> Verified
        </span>
      );
    if (status === "not_verified")
      return (
        <span className="af-pay-chip af-pay-chip--unverified">
          <XCircle size={12} /> Not verified
        </span>
      );
    return (
      <span className="af-pay-chip af-pay-chip--pending">
        <Clock size={12} /> Pending
      </span>
    );
  };

  const renderModeChip = (mode: string) => {
    const isOnline = mode === "online";
    return (
      <span
        className={`af-mode-chip ${isOnline ? "af-mode-chip--muted" : "af-mode-chip--primary"}`}
      >
        {isOnline ? <Monitor size={12} /> : <MapPin size={12} />}
        {mode === "in_clinic_kakinada" ? "Kakinada" : "Online"}
      </span>
    );
  };

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-fraunces)",
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 2.6vw, 1.875rem)",
              color: "var(--text)",
              margin: 0,
            }}
          >
            Assessments
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, margin: 0 }}>
            {data.length} total · {newCount} awaiting review
          </p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            height: 44,
            padding: "0 16px",
            borderRadius: 999,
            background: "transparent",
            border: "1.5px solid var(--border)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--text)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="af-admin-toolbar">
        <div className="af-admin-search-wrap">
          <Search size={17} className="af-admin-search-icon" />
          <input
            type="text"
            className="af-admin-search-input"
            placeholder="Search name, phone, email or reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="af-admin-segment-control">
          {(["all", "new", "in_review", "completed"] as const).map((s) => (
            <button
              key={s}
              className={`af-admin-segment-pill ${statusFilter === s ? "af-admin-segment-pill--active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" && "All"}
              {s === "new" && (
                <>
                  New {newCount > 0 && <span className="af-admin-segment-badge">{newCount}</span>}
                </>
              )}
              {s === "in_review" && "In review"}
              {s === "completed" && "Completed"}
            </button>
          ))}
        </div>

        <SelectField
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          options={[
            { value: "all", label: "All payments" },
            { value: "pending", label: "Pending verification" },
            { value: "verified", label: "Verified" },
            { value: "not_verified", label: "Not verified" },
          ]}
          // paddingBlock must be cleared wherever a fixed height is imposed:
          // .af-control ships 14px top and bottom, which with a 21px line box
          // needs 49px, so a 44px control clips its own descenders. It read as
          // "All payments" losing the tails of its p and y.
          style={{ height: 44, width: 190, borderRadius: 12, paddingBlock: 0 }}
        />

        <SelectField
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          options={[
            { value: "all", label: "All time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
            { value: "month", label: "This month" },
          ]}
          style={{ height: 44, width: 170, borderRadius: 12, paddingBlock: 0 }}
        />

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setPaymentFilter("all");
              setDateFilter("all");
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              fontSize: 13.5,
              cursor: "pointer",
              padding: "0 8px",
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* CONTENT */}
      {error ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <AlertTriangle size={32} style={{ color: "var(--accent)", margin: "0 auto 16px" }} />
          <h2
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              marginBottom: 8,
            }}
          >
            Couldn't load assessments
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
            Check your connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px",
              borderRadius: 999,
              border: "1.5px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="af-skeleton" style={{ height: 68 }} />
          ))}
        </div>
      ) : filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          {hasActiveFilters ? (
            <SearchX size={32} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
          ) : (
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "var(--surface-alt)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Inbox size={32} style={{ color: "var(--text-muted)" }} />
            </div>
          )}
          <h2
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              marginBottom: 8,
            }}
          >
            {hasActiveFilters ? "No matches" : "No assessments yet"}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              marginBottom: hasActiveFilters ? 24 : 0,
            }}
          >
            {hasActiveFilters
              ? "Try widening your filters."
              : "New submissions will appear here automatically."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setPaymentFilter("all");
                setDateFilter("all");
              }}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "1.5px solid var(--border)",
                background: "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="af-admin-table-container">
            <table className="af-admin-table">
              <thead>
                <tr>
                  <th style={{ width: 40, paddingRight: 0 }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === displayedData.length && displayedData.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(displayedData.map((d) => d.submissionId || d.id)));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        accentColor: "var(--primary)",
                      }}
                    />
                  </th>
                  <th className="sortable" onClick={() => toggleSort("name")}>
                    Name
                    <span
                      className={`sort-icon ${sortField === "name" ? "sort-icon--active" : ""}`}
                    >
                      {sortField === "name" && sortDir === "desc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </th>
                  <th>Contact</th>
                  <th className="sortable" onClick={() => toggleSort("submittedAt")}>
                    Submitted
                    <span
                      className={`sort-icon ${sortField === "submittedAt" ? "sort-icon--active" : ""}`}
                    >
                      {sortField === "submittedAt" && sortDir === "asc" ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </span>
                  </th>
                  <th>Consultation mode</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th style={{ width: 50 }}></th>
                </tr>
              </thead>
              <tbody>
                {displayedData.map((row) => {
                  const id = row.submissionId || row.id;
                  const d: Partial<Details> = row.details ?? {};
                  const isNew = row.status === "new";
                  const dateObj = toDate(row.submittedAt);
                  const payStatus =
                    row.verificationStatus || row.payment?.verificationStatus || "pending";
                  const isSelected = selectedIds.has(id);

                  return (
                    <tr
                      key={id}
                      onClick={() => navigate({ to: `/admin/assessments/${id}` })}
                      style={{ background: isSelected ? "var(--surface-alt)" : undefined }}
                    >
                      <td style={{ paddingRight: 0 }} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const next = new Set(selectedIds);
                            if (e.target.checked) next.add(id);
                            else next.delete(id);
                            setSelectedIds(next);
                          }}
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 5,
                            accentColor: "var(--primary)",
                          }}
                        />
                      </td>
                      <td>
                        <div
                          style={{
                            fontSize: 14.5,
                            fontWeight: isNew ? 700 : 600,
                            color: "var(--text)",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {isNew && <span className="af-unread-dot" />}
                          {d.fullName || "—"}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                          {[d.age ? `${d.age}y` : "", d.gender, d.city].filter(Boolean).join(" · ")}
                        </div>
                      </td>
                      <td>
                        <div
                          style={{
                            fontSize: 13.5,
                            color: "var(--text)",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Phone size={13} style={{ color: "var(--text-muted)" }} />
                          {d.phone || "—"}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            color: "var(--text-muted)",
                            marginTop: 2,
                            maxWidth: 160,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.email || "—"}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13.5, color: "var(--text)" }}>
                          {formatDistanceToNow(dateObj, { addSuffix: true })}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                          {format(dateObj, "d MMM, h:mm a")}
                        </div>
                      </td>
                      <td>{renderModeChip(d.preferredMode || "")}</td>
                      <td>{renderPaymentChip(payStatus)}</td>
                      <td>{renderStatusChip(row.status)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button
                              aria-label="More actions"
                              style={{
                                background: "transparent",
                                border: "none",
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                borderRadius: 8,
                              }}
                            >
                              <MoreVertical size={17} style={{ color: "var(--text-muted)" }} />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: 12,
                                padding: 6,
                                boxShadow: "0 10px 30px rgba(var(--shadow-rgb), 0.1)",
                                minWidth: 180,
                                zIndex: 50,
                              }}
                            >
                              <DropdownMenu.Item
                                onSelect={() => navigate({ to: `/admin/assessments/${id}` })}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                  outline: "none",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                View details
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => handleBulkStatus("in_review")}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                  outline: "none",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                Mark in review
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onSelect={() => handleBulkStatus("completed")}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                  outline: "none",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                Mark completed
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator
                                style={{ height: 1, background: "var(--border)", margin: "4px 0" }}
                              />
                              <DropdownMenu.Item
                                onSelect={() => navigator.clipboard.writeText(d.phone || "")}
                                style={{
                                  padding: "8px 12px",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                  outline: "none",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                Copy phone number
                              </DropdownMenu.Item>
                              <DropdownMenu.Item asChild>
                                <a
                                  href={`https://wa.me/${(d.phone || "").replace(/\D/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    padding: "8px 12px",
                                    fontSize: 13.5,
                                    cursor: "pointer",
                                    outline: "none",
                                    borderRadius: 6,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    color: "inherit",
                                    textDecoration: "none",
                                  }}
                                >
                                  Open WhatsApp
                                </a>
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator
                                style={{ height: 1, background: "var(--border)", margin: "4px 0" }}
                              />
                              <DropdownMenu.Item
                                onSelect={
                                  () =>
                                    setSelectedIds(
                                      new Set([id]),
                                    ) /* Trigger single delete somehow, simplified for now to rely on bulk bar */
                                }
                                style={{
                                  padding: "8px 12px",
                                  fontSize: 13.5,
                                  cursor: "pointer",
                                  outline: "none",
                                  borderRadius: 6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  color: "var(--accent-contrast)",
                                }}
                              >
                                Delete
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="af-admin-cards-container">
            {displayedData.map((row) => {
              const id = row.submissionId || row.id;
              const d: Partial<Details> = row.details ?? {};
              const isNew = row.status === "new";
              const dateObj = toDate(row.submittedAt);
              const payStatus =
                row.verificationStatus || row.payment?.verificationStatus || "pending";

              return (
                <div
                  key={id}
                  className="af-admin-card"
                  onClick={() => navigate({ to: `/admin/assessments/${id}` })}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                      {isNew && <span className="af-unread-dot" />}
                      {d.fullName || "—"}
                    </div>
                    {renderStatusChip(row.status)}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 6 }}>
                    {[d.age ? `${d.age}y` : "", d.gender, d.city].filter(Boolean).join(" · ")}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                    {renderModeChip(d.preferredMode || "")}
                    {renderPaymentChip(payStatus)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                      {formatDistanceToNow(dateObj, { addSuffix: true })}
                    </div>
                    <div style={{ display: "flex", gap: 8 }} onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${d.phone || ""}`}
                        style={{
                          width: 34,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          borderRadius: 8,
                          color: "var(--text-muted)",
                          textDecoration: "none",
                        }}
                      >
                        <Phone size={17} />
                      </a>
                      <a
                        href={`https://wa.me/${(d.phone || "").replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: 34,
                          height: 34,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "transparent",
                          borderRadius: 8,
                          color: "var(--text-muted)",
                          textDecoration: "none",
                        }}
                      >
                        <MessageCircle size={17} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {visibleCount < filteredData.length ? (
            <div
              style={{
                textAlign: "center",
                marginTop: 32,
                marginBottom: 32 + (selectedIds.size > 0 ? 80 : 0),
              }}
            >
              <button
                onClick={() => setVisibleCount((v) => v + 25)}
                style={{
                  height: 48,
                  padding: "0 24px",
                  borderRadius: 999,
                  background: "transparent",
                  border: "1.5px solid var(--border)",
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                Load more
              </button>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8 }}>
                Showing {visibleCount} of {filteredData.length}
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                marginTop: 32,
                marginBottom: 32 + (selectedIds.size > 0 ? 80 : 0),
                fontSize: 13,
                color: "var(--text-muted)",
              }}
            >
              That's all {filteredData.length} assessments.
            </div>
          )}
        </>
      )}

      {/* BULK ACTION BAR */}
      <div className={`af-bulk-bar ${selectedIds.size > 0 ? "af-bulk-bar--visible" : ""}`}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap" }}>
          {selectedIds.size} selected
        </div>
        <div style={{ width: 1, height: 24, background: "var(--border)" }} />
        <button
          onClick={() => handleBulkStatus("in_review")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--text)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Mark in review
        </button>
        <button
          onClick={() => handleBulkStatus("completed")}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--text)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Mark completed
        </button>
        {/* Export selected would filter to selectedIds and run exportCSV */}
        <button
          onClick={() => handleBulkDelete()}
          style={{
            background: "transparent",
            border: "none",
            fontSize: 13.5,
            fontWeight: 500,
            color: "var(--accent-contrast)",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Delete
        </button>
        <button
          onClick={() => setSelectedIds(new Set())}
          style={{
            background: "transparent",
            border: "none",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
            cursor: "pointer",
            marginLeft: "auto",
            borderRadius: "50%",
          }}
        >
          <XCircle size={18} />
        </button>
      </div>
    </div>
  );
}
