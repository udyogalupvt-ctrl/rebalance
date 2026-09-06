import React from "react";
import { Plus, Search, AlertTriangle, Inbox } from "lucide-react";

interface ManagerPageProps {
  title: string;
  subtitle: string;
  count: number;
  /**
   * Omit for collections the admin never creates by hand. Enquiries arrive
   * from the public contact form, so offering "Add new" / "Add first item"
   * there invited the practice to fabricate a message from a patient.
   */
  onAdd?: (() => void) | undefined;
  /** Shown in the empty state when there is nothing to add. */
  emptyMessage?: string | undefined;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  /** Segment labels. Defaults to the publish/draft triple. */
  statusOptions?: string[];
  loading: boolean;
  error: boolean;
  isEmpty: boolean;
  children: React.ReactNode;
}

export function ManagerPage({
  title,
  subtitle,
  count,
  onAdd,
  emptyMessage,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions = ["all", "published", "draft"],
  loading,
  error,
  isEmpty,
  children,
}: ManagerPageProps) {
  const hasActiveFilters = search !== "" || statusFilter.toLowerCase() !== "all";

  return (
    <div style={{ paddingBottom: 64 }}>
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
            {title}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, margin: 0 }}>
            {subtitle} · {count} total
          </p>
        </div>
        {onAdd && (
          <button
            onClick={onAdd}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 999,
              background: "var(--primary-strong)",
              border: "none",
              fontSize: 14.5,
              fontWeight: 600,
              color: "var(--on-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={17} />
            Add new
          </button>
        )}
      </div>

      {/* TOOLBAR */}
      <div className="af-admin-toolbar" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="af-admin-search-wrap">
          <Search size={17} className="af-admin-search-icon" />
          <input
            type="text"
            className="af-admin-search-input"
            placeholder="Search items..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="af-admin-segment-control">
          {statusOptions.map((s) => (
            <button
              key={s}
              className={`af-admin-segment-pill ${statusFilter === s ? "af-admin-segment-pill--active" : ""}`}
              onClick={() => onStatusFilterChange(s)}
              style={{ textTransform: "capitalize" }}
            >
              {s}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
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
            Couldn't load items
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="af-skeleton" style={{ height: 68 }} />
          ))}
        </div>
      ) : isEmpty && !hasActiveFilters ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
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
          <h2
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              marginBottom: 8,
            }}
          >
            No items yet
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
            {emptyMessage ?? "Get started by adding a new item."}
          </p>
          {onAdd && (
            <button
              onClick={onAdd}
              style={{
                padding: "10px 24px",
                borderRadius: 999,
                border: "none",
                background: "var(--primary-strong)",
                color: "var(--on-primary)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Add first item
            </button>
          )}
        </div>
      ) : isEmpty && hasActiveFilters ? (
        <div style={{ textAlign: "center", padding: "64px 20px" }}>
          <h2
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.125rem, 1.8vw, 1.375rem)",
              marginBottom: 8,
            }}
          >
            No matches found
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
            Try widening your filters.
          </p>
          <button
            onClick={() => {
              onSearchChange("");
              onStatusFilterChange("all");
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
        </div>
      ) : (
        <div style={{ position: "relative" }}>{children}</div>
      )}
    </div>
  );
}
