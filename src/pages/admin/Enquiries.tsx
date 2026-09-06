import { useState, useEffect, useMemo } from "react";
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ManagerPage } from "@/components/admin/shared/ManagerPage";
import { EditorDrawer } from "@/components/admin/shared/EditorDrawer";
import { DeleteDialog } from "@/components/admin/shared/DeleteDialog";
import { TextInput, SelectField, TextArea } from "@/components/assessment/fields";
import { logActivity } from "@/lib/activityLog";
import {
  MoreVertical,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  User,
  AlignLeft,
  CheckCircle2,
  Trash2,
  ArrowRight,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import type { EnquiryDoc } from "@/types/admin";
import { toMillis } from "@/lib/runtime";

const TOPICS = [
  "General enquiry",
  "Consultation booking",
  "Existing plan support",
  "Corporate wellness",
  "Press/Media",
  "Other",
];

export default function EnquiriesManager() {
  const [data, setData] = useState<EnquiryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All"); // All, New, Replied, Closed
  const [topicFilter, setTopicFilter] = useState<string>("All");

  const [editorOpen, setEditorOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<EnquiryDoc | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /*
   * Subscribe directly rather than through subscribeToCMS.
   *
   * That helper is for CMS content and applies orderBy("order", "asc").
   * Enquiries are written by the public contact form and have no `order`
   * field, and Firestore silently EXCLUDES documents missing the field being
   * ordered on -- so this list was always empty no matter how many enquiries
   * came in, while the sidebar badge (a different query) correctly showed a
   * count. The practice could never read a single enquiry.
   *
   * No orderBy here either: sorting happens below in JS, so a document with a
   * missing or still-pending createdAt can never be dropped from the list.
   */
  useEffect(() => {
    return onSnapshot(
      collection(db, "enquiries"),
      (snap) => {
        const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as EnquiryDoc);
        docs.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
        setData(docs);
        setLoading(false);
        setError(false);
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      },
    );
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((d) => {
      if (statusFilter !== "All" && d.status !== statusFilter.toLowerCase()) return false;
      if (topicFilter !== "All" && d.topic !== topicFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !d.name?.toLowerCase().includes(q) &&
          !d.phone?.toLowerCase().includes(q) &&
          !d.email?.toLowerCase().includes(q) &&
          !d.message?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data, search, statusFilter, topicFilter]);

  const unreadCount = data.filter((d) => !d.readAt).length;

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "enquiries", deleteId));
      setDeleteId(null);
      if (activeItem?.id === deleteId) {
        setEditorOpen(false);
      }
    } catch (err) {
      alert("Failed to delete enquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "enquiries", id), {
        status: newStatus,
        readAt: new Date().toISOString(),
      });
      if (activeItem && activeItem.id === id) {
        setActiveItem({ ...activeItem, status: newStatus });
      }
      if (newStatus === "replied") {
        logActivity(`Enquiry replied for ${activeItem?.name || "client"}`, "content", id);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const openDrawer = async (item: EnquiryDoc) => {
    setActiveItem(item);
    setAdminNotes(item.adminNotes || "");
    setEditorOpen(true);

    // Mark as read (set readAt) if it's missing, but don't change status to Replied automatically.
    if (!item.readAt) {
      try {
        await updateDoc(doc(db, "enquiries", item.id), {
          readAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Debounced auto-save for notes
  useEffect(() => {
    if (!activeItem) return;

    const handler = setTimeout(async () => {
      // Only save if changed
      if (adminNotes !== activeItem.adminNotes) {
        try {
          await updateDoc(doc(db, "enquiries", activeItem.id), { adminNotes });
          setActiveItem((prev) => (prev ? { ...prev, adminNotes } : prev));
        } catch (err) {
          console.error("Failed to save notes", err);
        }
      }
    }, 900);

    return () => clearTimeout(handler);
  }, [adminNotes, activeItem]);

  return (
    <>
      <ManagerPage
        title="Enquiries"
        // ManagerPage appends "· {count} total", so this must not repeat it.
        subtitle={`${unreadCount} unread`}
        count={filteredData.length}
        // No onAdd: enquiries come from the public contact form.
        emptyMessage="Messages from the contact form will appear here."
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={["All", "New", "Replied", "Closed"]}
        loading={loading}
        error={error}
        isEmpty={data.length === 0}
      >
        <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            style={{
              height: 44,
              padding: "0 16px",
              borderRadius: 999,
              border: "1.5px solid var(--border)",
              background: "transparent",
              fontSize: 13.5,
              fontWeight: 500,
              color: "var(--text)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="All">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Table (hidden on mobile, can use Tailwind classes) */}
        <div className="hidden lg:block bg-surface border border-border rounded-[20px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-alt/50">
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider w-[240px]">
                  Name
                </th>
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                  Contact
                </th>
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                  Topic
                </th>
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                  Received
                </th>
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-5 text-[12px] font-semibold text-text-muted uppercase tracking-wider w-[64px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-alt transition-colors cursor-pointer group"
                  onClick={() => openDrawer(item)}
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      {!item.readAt && (
                        <div className="w-[7px] h-[7px] rounded-full bg-accent shrink-0" />
                      )}
                      <span className="text-[14.5px] font-semibold text-text">{item.name}</span>
                    </div>
                    <div className="text-[12.5px] text-text-muted mt-0.5">{item.city || "—"}</div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 text-[13.5px] text-text">
                      <Phone size={13} className="text-text-muted" /> {item.phone}
                    </div>
                    <div className="text-[12.5px] text-text-muted mt-0.5 max-w-[200px] truncate">
                      {item.email}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="inline-block px-2.5 py-1 bg-primary-soft text-primary text-[12px] font-medium rounded-full whitespace-nowrap">
                      {item.topic}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="text-[13.5px] text-text">
                      {item.createdAt
                        ? formatDistanceToNow(toMillis(item.createdAt), { addSuffix: true })
                        : "—"}
                    </div>
                    <div className="text-[12px] text-text-muted mt-0.5">
                      {item.createdAt ? format(toMillis(item.createdAt), "MMM d, h:mm a") : "—"}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={item.status ?? "new"} />
                  </td>
                  <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionsDropdown
                      item={item}
                      onStatus={(s) => handleUpdateStatus(item.id, s)}
                      onDelete={() => setDeleteId(item.id)}
                      onView={() => openDrawer(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden flex flex-col gap-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => openDrawer(item)}
              className="bg-surface border border-border rounded-[20px] p-[20px] cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {!item.readAt && (
                    <div className="w-[7px] h-[7px] rounded-full bg-accent shrink-0" />
                  )}
                  <span className="text-[15.5px] font-semibold text-text">{item.name}</span>
                </div>
                <StatusBadge status={item.status ?? "new"} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 bg-primary-soft text-primary text-[12px] font-medium rounded-full uppercase tracking-wider">
                  {item.topic}
                </span>
                <span className="text-[12.5px] text-text-muted">{item.city}</span>
              </div>
              <p className="text-[13.5px] text-text-muted line-clamp-2 leading-[1.6] mb-4">
                {item.message}
              </p>
              <div className="flex justify-between items-center border-t border-border pt-4">
                <span className="text-[12.5px] text-text-muted">
                  {item.createdAt
                    ? formatDistanceToNow(toMillis(item.createdAt), { addSuffix: true })
                    : "—"}
                </span>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${item.phone}`}
                    className="w-[36px] h-[36px] rounded-full bg-surface-alt flex items-center justify-center text-text hover:bg-border transition-colors"
                  >
                    <Phone size={15} />
                  </a>
                  <a
                    href={`mailto:${item.email ?? ""}`}
                    className="w-[36px] h-[36px] rounded-full bg-surface-alt flex items-center justify-center text-text hover:bg-border transition-colors"
                  >
                    <Mail size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ManagerPage>

      {/* Message Drawer */}
      <EditorDrawer
        open={editorOpen}
        title={activeItem?.name || "Enquiry"}
        onClose={() => setEditorOpen(false)}
        onSave={() => setEditorOpen(false)}
        isSaving={false}
        hasUnsavedChanges={false}
        saveLabel="Close"
        hideSave // We use custom footer actions here, but EditorDrawer provides it. We can just use it for a unified shell or customize.
      >
        {activeItem && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-fraunces text-[1.25rem] font-medium text-text m-0">
                  {activeItem.name}
                </h3>
                <div className="text-[12.5px] text-text-muted mt-1">
                  Received{" "}
                  {activeItem.createdAt
                    ? format(toMillis(activeItem.createdAt), "EEEE, d MMM yyyy 'at' h:mm a")
                    : "—"}
                </div>
              </div>
              <select
                value={activeItem.status || "new"}
                onChange={(e) => handleUpdateStatus(activeItem.id, e.target.value)}
                className="h-[36px] px-[14px] rounded-[10px] border border-border bg-surface-alt text-[13px] font-semibold text-text outline-none cursor-pointer"
              >
                <option value="new">New</option>
                <option value="replied">Replied</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-6 p-5 bg-surface-alt rounded-[16px] border border-border">
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-1">
                  Phone
                </div>
                <a
                  href={`tel:${activeItem.phone}`}
                  className="text-[14px] font-medium text-text hover:text-primary transition-colors"
                >
                  {activeItem.phone}
                </a>
              </div>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-1">
                  Email
                </div>
                <a
                  href={`mailto:${activeItem.email}`}
                  className="text-[14px] font-medium text-text hover:text-primary transition-colors truncate block"
                >
                  {activeItem.email}
                </a>
              </div>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-1">
                  City
                </div>
                <div className="text-[14px] font-medium text-text">{activeItem.city || "—"}</div>
              </div>
              <div>
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-1">
                  Topic
                </div>
                <div className="text-[14px] font-medium text-text">{activeItem.topic}</div>
              </div>
              <div className="col-span-2 pt-2 border-t border-border">
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted mb-1.5">
                  Preferred Contact
                </div>
                <span className="inline-block px-2.5 py-1 bg-surface border border-border text-text-muted text-[12px] font-medium rounded-full">
                  {activeItem.preferredContact === "whatsapp"
                    ? "WhatsApp preferred"
                    : activeItem.preferredContact === "phone"
                      ? "Phone call preferred"
                      : "Email preferred"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[13px] font-semibold text-text mb-3 flex items-center gap-2">
                <AlignLeft size={16} className="text-text-muted" /> Message
              </h4>
              <div className="bg-surface-alt border border-border rounded-[14px] p-[20px] text-[15px] leading-[1.75] text-text whitespace-pre-wrap">
                {activeItem.message}
              </div>
            </div>

            <div>
              <TextArea
                label="Internal Notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this enquiry... (Auto-saves)"
                style={{ minHeight: 120 }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${(activeItem.phone ?? "").replace(/[^0-9]/g, "")}?text=Hi ${(activeItem.name ?? "there").split(" ")[0]}, this is GoRebalance replying to your enquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-[44px] px-6 rounded-full bg-primary-strong text-on-primary font-semibold text-[14.5px] flex items-center justify-center gap-2 hover:bg-[var(--primary-strong)] transition-colors"
              >
                Open WhatsApp
              </a>
              {activeItem.status !== "replied" && (
                <button
                  type="button"
                  onClick={() => {
                    handleUpdateStatus(activeItem.id, "replied");
                    setEditorOpen(false);
                  }}
                  className="h-[44px] px-6 rounded-full bg-transparent border-[1.5px] border-primary text-primary font-semibold text-[14.5px] flex items-center justify-center gap-2 hover:bg-primary-soft transition-colors"
                >
                  <CheckCircle2 size={16} /> Mark as replied
                </button>
              )}
            </div>
          </div>
        )}
      </EditorDrawer>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Enquiry"
        itemName={data.find((d) => d.id === deleteId)?.name || "this enquiry"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "new").toLowerCase();
  if (s === "new")
    return (
      <span className="inline-block px-2.5 py-1 bg-accent-strong text-on-accent text-[12px] font-bold uppercase tracking-wider rounded-full">
        New
      </span>
    );
  if (s === "replied")
    return (
      <span className="inline-block px-2.5 py-1 bg-primary-strong text-on-primary text-[12px] font-bold uppercase tracking-wider rounded-full">
        Replied
      </span>
    );
  return (
    <span className="inline-block px-2.5 py-1 bg-surface-alt text-text-muted text-[12px] font-bold uppercase tracking-wider rounded-full border border-border">
      Closed
    </span>
  );
}

function ActionsDropdown({
  item,
  onStatus,
  onDelete,
  onView,
}: {
  item: { id: string; status?: string; phone?: string; email?: string };
  onStatus: (status: string) => void;
  onDelete: () => void;
  onView: () => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="More actions"
          className="w-[32px] h-[32px] rounded-[8px] bg-transparent text-text-muted hover:bg-surface-alt hover:text-text flex items-center justify-center border-none cursor-pointer outline-none transition-colors"
        >
          <MoreVertical size={18} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="bg-surface border border-border rounded-[14px] shadow-[0_12px_40px_rgba(var(--shadow-rgb), 0.12)] p-1.5 w-[200px] z-[100] animate-in fade-in zoom-in-95 duration-200"
        >
          <DropdownMenu.Item
            onClick={onView}
            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors"
          >
            View message
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => onStatus("replied")}
            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors"
          >
            Mark replied
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => onStatus("closed")}
            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors"
          >
            Mark closed
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-border my-1.5 mx-1" />

          <DropdownMenu.Item
            onClick={() => navigator.clipboard.writeText(item.phone ?? "")}
            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors"
          >
            Copy phone
          </DropdownMenu.Item>
          <a
            href={`https://wa.me/${(item.phone ?? "").replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors">
              Open WhatsApp
            </DropdownMenu.Item>
          </a>
          <a href={`mailto:${item.email ?? ""}`} style={{ textDecoration: "none" }}>
            <DropdownMenu.Item className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-text hover:bg-surface-alt rounded-[8px] cursor-pointer outline-none transition-colors">
              Reply by email
            </DropdownMenu.Item>
          </a>

          <DropdownMenu.Separator className="h-px bg-border my-1.5 mx-1" />

          <DropdownMenu.Item
            onClick={onDelete}
            className="flex items-center gap-2.5 px-3 py-2 text-[13.5px] font-medium text-[var(--danger)] hover:bg-red-50 hover:text-[var(--danger)] rounded-[8px] cursor-pointer outline-none transition-colors"
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
