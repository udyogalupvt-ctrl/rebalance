import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import type { AssessmentDocument } from "@/types/admin";
import { toCsv } from "@/lib/csv";
import { toDate, toMillis } from "@/lib/runtime";
import { logActivity } from "@/lib/activityLog";
import { mirrorStatus } from "@/lib/trackingStatus";
import { format, formatDistanceToNow } from "date-fns";
import {
  Search,
  SearchX,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  X,
  ExternalLink,
} from "lucide-react";
import { SelectField } from "@/components/assessment/fields";
import type { Details, Payment } from "@/schemas/assessment";

type PayFilter = "all" | "pending" | "verified" | "not_verified";

/**
 * Payments.
 *
 * There is no `payments` collection: a payment is the `payment` map inside an
 * assessment, so this is a payment-shaped view over the same documents. Rows
 * with no screenshot are excluded -- an assessment cannot reach submission
 * without one, but a partially-migrated or hand-edited record could.
 */
export default function PaymentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<AssessmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [payFilter, setPayFilter] = useState<PayFilter>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const q = query(collection(db, "assessments"), orderBy("submittedAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as unknown as AssessmentDocument));
        setLoading(false);
        setError(false);
      },
      () => {
        setError(true);
        setLoading(false);
      },
    );
  }, []);

  const statusOf = useCallback(
    (row: AssessmentDocument) =>
      (row.verificationStatus || row.payment?.verificationStatus || "pending") as PayFilter,
    [],
  );

  const withPayment = useMemo(
    () => data.filter((r) => Boolean((r.payment as Partial<Payment> | undefined)?.screenshotUrl)),
    [data],
  );

  const counts = useMemo(() => {
    const c = { all: withPayment.length, pending: 0, verified: 0, not_verified: 0 };
    withPayment.forEach((r) => {
      const s = statusOf(r);
      if (s === "pending" || s === "verified" || s === "not_verified") c[s] += 1;
    });
    return c;
  }, [withPayment, statusOf]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const term = debounced.trim().toLowerCase();

    return withPayment.filter((row) => {
      if (payFilter !== "all" && statusOf(row) !== payFilter) return false;

      if (dateFilter !== "all") {
        const ms = toMillis(row.submittedAt);
        if (!ms) return false;
        const age = now - ms;
        if (dateFilter === "today" && age > 864e5) return false;
        if (dateFilter === "7days" && age > 7 * 864e5) return false;
        if (dateFilter === "30days" && age > 30 * 864e5) return false;
      }

      if (term) {
        const d: Partial<Details> = row.details ?? {};
        const p: Partial<Payment> = row.payment ?? {};
        const hay = [d.fullName, d.phone, d.email, p.transactionRef, row.submissionId, row.id]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [withPayment, payFilter, dateFilter, debounced, statusOf]);

  const hasActiveFilters = payFilter !== "all" || dateFilter !== "all" || debounced.length > 0;

  const setVerification = async (
    row: AssessmentDocument,
    status: "verified" | "not_verified" | "pending",
  ) => {
    const id = row.submissionId || row.id;
    setBusyId(id);
    try {
      await updateDoc(doc(db, "assessments", id), {
        verificationStatus: status,
        verifiedBy: user?.email || "admin",
        verifiedAt: serverTimestamp(),
      });
      await mirrorStatus(id, { verificationStatus: status });
      logActivity(
        `Payment ${status === "verified" ? "verified" : status === "not_verified" ? "rejected" : "reset"} for ${row.details?.fullName || "client"}`,
        "payment",
        id,
      );
    } catch {
      alert("Couldn't update this payment. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    const headers = [
      "Reference",
      "Submitted",
      "Client",
      "Phone",
      "Email",
      "Transaction reference",
      "Verification",
      "Verified by",
      "Screenshot URL",
    ];
    const rows = filtered.map((row) => {
      const d: Partial<Details> = row.details ?? {};
      const p: Partial<Payment> = row.payment ?? {};
      const dt = toDate(row.submittedAt);
      return [
        (row.submissionId || row.id).slice(0, 8).toUpperCase(),
        dt ? format(dt, "yyyy-MM-dd HH:mm") : "",
        d.fullName ?? "",
        d.phone ?? "",
        d.email ?? "",
        p.transactionRef ?? "",
        statusOf(row),
        (row as { verifiedBy?: string }).verifiedBy ?? "",
        p.screenshotUrl ?? "",
      ];
    });
    const blob = new Blob([toCsv(headers, rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gorebalance-payments-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const chip = (s: PayFilter) => {
    if (s === "verified")
      return (
        <span className="af-pay-chip af-pay-chip--verified">
          <CheckCircle2 size={13} /> Verified
        </span>
      );
    if (s === "not_verified")
      return (
        <span className="af-pay-chip af-pay-chip--unverified">
          <XCircle size={13} /> Not verified
        </span>
      );
    return (
      <span className="af-pay-chip af-pay-chip--pending">
        <Clock size={13} /> Pending
      </span>
    );
  };

  const actions = (row: AssessmentDocument, s: PayFilter) => {
    const id = row.submissionId || row.id;
    const busy = busyId === id;
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {s !== "verified" && (
          <button
            className="af-pay-action af-pay-action--verify"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              void setVerification(row, "verified");
            }}
          >
            <CheckCircle2 size={14} /> Verify
          </button>
        )}
        {s !== "not_verified" && (
          <button
            className="af-pay-action af-pay-action--reject"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              void setVerification(row, "not_verified");
            }}
          >
            <XCircle size={14} /> Reject
          </button>
        )}
      </div>
    );
  };

  const thumb = (row: AssessmentDocument) => {
    const p: Partial<Payment> = row.payment ?? {};
    const name = row.details?.fullName || "Client";
    if (!p.screenshotUrl) return null;
    return (
      <button
        className="af-pay-thumb"
        onClick={(e) => {
          e.stopPropagation();
          setLightbox({ url: p.screenshotUrl as string, name });
        }}
        aria-label={`View payment screenshot for ${name}`}
      >
        <img src={p.screenshotUrl} alt="" loading="lazy" decoding="async" />
      </button>
    );
  };

  return (
    <div>
      <div className="af-admin-page-head">
        <div>
          <h1 className="af-admin-h1">Payments</h1>
          <p className="af-admin-sub">
            {counts.all} total · {counts.pending} awaiting verification
          </p>
        </div>
        <button className="af-admin-ghost-btn" onClick={exportCsv} disabled={filtered.length === 0}>
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="af-admin-toolbar">
        <div className="af-admin-search-wrap">
          <Search size={17} className="af-admin-search-icon" />
          <input
            type="text"
            className="af-admin-search-input"
            placeholder="Search name, phone, transaction or reference"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="af-admin-segment-control">
          {(["all", "pending", "verified", "not_verified"] as const).map((s) => (
            <button
              key={s}
              className={`af-admin-segment-pill ${payFilter === s ? "af-admin-segment-pill--active" : ""}`}
              onClick={() => setPayFilter(s)}
            >
              {s === "all" && "All"}
              {s === "pending" && (
                <>
                  Pending{" "}
                  {counts.pending > 0 && (
                    <span className="af-admin-segment-badge">{counts.pending}</span>
                  )}
                </>
              )}
              {s === "verified" && "Verified"}
              {s === "not_verified" && "Rejected"}
            </button>
          ))}
        </div>

        <SelectField
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          options={[
            { value: "all", label: "All time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ]}
          style={{ height: 44, width: 170, borderRadius: 12, paddingBlock: 0 }}
        />
      </div>

      {error ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <AlertTriangle size={32} style={{ color: "var(--danger)", margin: "0 auto 16px" }} />
          <p style={{ color: "var(--text-muted)" }}>Couldn't load payments.</p>
        </div>
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="af-skeleton" style={{ height: 76 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          {hasActiveFilters ? (
            <>
              <SearchX size={32} style={{ color: "var(--text-muted)", margin: "0 auto 16px" }} />
              <p style={{ color: "var(--text-muted)" }}>No payments match these filters.</p>
            </>
          ) : (
            <>
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
                <Wallet size={28} style={{ color: "var(--text-muted)" }} />
              </div>
              <h2 style={{ fontFamily: "var(--font-fraunces)", fontWeight: 500, marginBottom: 6 }}>
                No payments yet
              </h2>
              <p style={{ color: "var(--text-muted)" }}>
                Payment screenshots appear here as assessments are submitted.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="af-admin-table-container">
            <table className="af-admin-table">
              <thead>
                <tr>
                  <th style={{ width: 76 }}>Screenshot</th>
                  <th>Client</th>
                  <th>Reference</th>
                  <th>Transaction</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => {
                  const id = row.submissionId || row.id;
                  const d: Partial<Details> = row.details ?? {};
                  const p: Partial<Payment> = row.payment ?? {};
                  const s = statusOf(row);
                  const dt = toDate(row.submittedAt);
                  return (
                    <tr key={id} onClick={() => navigate({ to: `/admin/assessments/${id}` })}>
                      <td>{thumb(row)}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text)" }}>
                          {d.fullName || "—"}
                        </div>
                        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                          {d.phone || ""}
                        </div>
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12.5 }}>
                        {id.slice(0, 8).toUpperCase()}
                      </td>
                      <td style={{ fontSize: 13 }}>{p.transactionRef || "—"}</td>
                      <td style={{ fontSize: 13 }}>
                        {dt ? formatDistanceToNow(dt, { addSuffix: true }) : "—"}
                      </td>
                      <td>{chip(s)}</td>
                      <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                        {actions(row, s)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="af-admin-cards-container">
            {filtered.map((row) => {
              const id = row.submissionId || row.id;
              const d: Partial<Details> = row.details ?? {};
              const p: Partial<Payment> = row.payment ?? {};
              const s = statusOf(row);
              const dt = toDate(row.submittedAt);
              return (
                <div
                  key={id}
                  className="af-admin-card"
                  onClick={() => navigate({ to: `/admin/assessments/${id}` })}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {thumb(row)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
                        {d.fullName || "—"}
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                        {d.phone || ""}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-muted)",
                          marginTop: 4,
                          fontFamily: "monospace",
                        }}
                      >
                        {id.slice(0, 8).toUpperCase()}
                        {p.transactionRef ? ` · ${p.transactionRef}` : ""}
                      </div>
                    </div>
                    {chip(s)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 14,
                      paddingTop: 12,
                      borderTop: "1px solid var(--border)",
                      gap: 12,
                    }}
                  >
                    <span style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
                      {dt ? formatDistanceToNow(dt, { addSuffix: true }) : "—"}
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>{actions(row, s)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {lightbox && (
        <div
          className="af-pay-lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Payment screenshot for ${lightbox.name}`}
        >
          <img src={lightbox.url} alt={`Payment screenshot for ${lightbox.name}`} />
          <a
            className="af-pay-lightbox-open"
            href={lightbox.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={15} /> Open original
          </a>
          <button
            className="af-pay-lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
