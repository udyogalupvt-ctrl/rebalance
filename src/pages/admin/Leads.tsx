import * as React from "react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { format, formatDistanceToNow } from "date-fns";
import {
  Clock,
  Mail,
  MessageCircle,
  NotebookPen,
  Phone,
  PhoneCall,
  Trash2,
  TriangleAlert,
  User,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { ManagerPage } from "@/components/admin/shared/ManagerPage";
import { EditorDrawer } from "@/components/admin/shared/EditorDrawer";
import { DeleteDialog } from "@/components/admin/shared/DeleteDialog";
import { WhatsAppComposer, ContactIconButton } from "@/components/admin/WhatsAppComposer";
import { telLink, whatsAppLink } from "@/lib/messageTemplates";
import { logActivity } from "@/lib/activityLog";
import { toMillis } from "@/lib/runtime";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  FOLLOW_UP_STATUSES,
  type ContactLogEntry,
  type FollowUpStatus,
  type LeadDoc,
  type LeadNote,
} from "@/lib/leads";

const TONE_STYLES: Record<string, string> = {
  neutral: "bg-surface-alt text-text-muted border-border",
  amber:
    "bg-[rgba(var(--accent-rgb),0.14)] text-[var(--accent-contrast)] border-[rgba(var(--accent-rgb),0.3)]",
  blue: "bg-[rgba(var(--primary-rgb),0.12)] text-[var(--primary-contrast)] border-[rgba(var(--primary-rgb),0.3)]",
  violet:
    "bg-[rgba(var(--primary-rgb),0.16)] text-[var(--primary-contrast)] border-[rgba(var(--primary-rgb),0.34)]",
  green:
    "bg-[rgba(var(--success-rgb),0.14)] text-[var(--success)] border-[rgba(var(--success-rgb),0.32)]",
  red: "bg-[rgba(var(--danger-rgb),0.12)] text-[var(--danger-contrast)] border-[rgba(var(--danger-rgb),0.3)]",
};

const FILTERS = ["All", "Didn't finish", "New", "In progress", "Converted", "Closed"] as const;

const statusMeta = (value: FollowUpStatus | undefined) =>
  FOLLOW_UP_STATUSES.find((s) => s.value === value) ?? FOLLOW_UP_STATUSES[0]!;

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;

/**
 * Consultation leads.
 *
 * This exists because of one specific loss: someone typed their name and
 * phone number into the booking form, then changed their mind and closed the
 * tab. Under a submit-only model that person never existed. They are now
 * saved the moment there is something to call back on (see src/lib/leads.ts),
 * and they arrive here flagged "Didn't finish" — which is the most valuable
 * row in the table, not the least.
 *
 * Everything else on this page is what the practice needs to actually work
 * the list: where each person is in the pipeline, notes that persist, and one
 * click to call or to send a WhatsApp message built from a template.
 */
export default function LeadsManager() {
  const { user } = useAuth();
  const actor = user?.email || user?.displayName || "Admin";

  const [data, setData] = React.useState<LeadDoc[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<string>("All");

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [noteDraft, setNoteDraft] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  /*
   * No orderBy in the query.
   *
   * A partial lead is written with serverTimestamp(), and until the server
   * acknowledges it the local snapshot carries a null createdAt. Firestore
   * EXCLUDES documents missing the field being ordered on, so ordering here
   * would hide exactly the abandoned leads this page exists to surface, for
   * the first second or two of their life. Sorting happens below in JS.
   */
  React.useEffect(() => {
    return onSnapshot(
      collection(db, "leads"),
      (snap) => {
        const rows = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as LeadDoc);
        rows.sort(
          (a, b) => toMillis(b.updatedAt ?? b.createdAt) - toMillis(a.updatedAt ?? a.createdAt),
        );
        setData(rows);
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

  const active = React.useMemo(() => data.find((d) => d.id === activeId) ?? null, [data, activeId]);

  const filtered = React.useMemo(() => {
    return data.filter((d) => {
      const follow = d.followUpStatus ?? "new";
      if (filter === "Didn't finish" && d.status !== "partial") return false;
      if (filter === "New" && follow !== "new") return false;
      if (filter === "In progress" && !["attempted", "contacted"].includes(follow)) return false;
      if (filter === "Converted" && !["consultation_booked", "converted"].includes(follow))
        return false;
      if (filter === "Closed" && !["not_interested", "no_response"].includes(follow)) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = [d.name, d.phone, d.email, d.concern]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [data, search, filter]);

  const abandonedCount = data.filter((d) => d.status === "partial").length;

  const patch = async (id: string, changes: Partial<LeadDoc>) => {
    try {
      await updateDoc(doc(db, "leads", id), { ...changes, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      alert("Couldn't save that change. Check your connection and try again.");
    }
  };

  const setFollowUp = (lead: LeadDoc, next: FollowUpStatus) => {
    void patch(lead.id, { followUpStatus: next });
    if (next === "converted") {
      logActivity(`Lead converted: ${lead.name || "unnamed"}`, "content", lead.id);
    }
  };

  const addNote = async (lead: LeadDoc) => {
    const text = noteDraft.trim();
    if (!text) return;
    const note: LeadNote = { id: uid(), text, at: new Date().toISOString(), by: actor };
    setNoteDraft("");
    await patch(lead.id, { notes: [...(lead.notes ?? []), note] });
  };

  const removeNote = (lead: LeadDoc, noteId: string) =>
    patch(lead.id, { notes: (lead.notes ?? []).filter((n) => n.id !== noteId) });

  const logContact = (lead: LeadDoc, channel: ContactLogEntry["channel"], detail?: string) => {
    const entry: ContactLogEntry = {
      id: uid(),
      channel,
      at: new Date().toISOString(),
      by: actor,
      ...(detail ? { detail } : {}),
    };
    const nextStatus: FollowUpStatus =
      (lead.followUpStatus ?? "new") === "new" ? "attempted" : (lead.followUpStatus ?? "attempted");
    void patch(lead.id, {
      contactLog: [...(lead.contactLog ?? []), entry],
      lastContactAt: entry.at,
      followUpStatus: nextStatus,
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "leads", deleteId));
      if (activeId === deleteId) setDrawerOpen(false);
      setDeleteId(null);
    } catch {
      alert("Couldn't delete that lead.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ManagerPage
        title="Leads"
        subtitle={
          abandonedCount > 0
            ? `Consultation requests · ${abandonedCount} started but not finished`
            : "Consultation requests from the booking form"
        }
        count={data.length}
        emptyMessage="No consultation requests yet. They appear here as soon as someone starts the booking form."
        search={search}
        onSearchChange={setSearch}
        statusFilter={filter}
        onStatusFilterChange={setFilter}
        statusOptions={[...FILTERS]}
        loading={loading}
        error={error}
        isEmpty={data.length === 0}
      >
        <div className="flex flex-col gap-2.5">
          {filtered.map((lead) => {
            const meta = statusMeta(lead.followUpStatus);
            const partial = lead.status === "partial";
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => {
                  setActiveId(lead.id);
                  setNoteDraft("");
                  setDrawerOpen(true);
                }}
                className="flex w-full items-center gap-4 rounded-[16px] border border-border bg-surface p-4 text-left transition-colors hover:border-[rgba(var(--primary-rgb),0.35)]"
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                    partial
                      ? "bg-[rgba(var(--accent-rgb),0.16)] text-[var(--accent-contrast)]"
                      : "bg-primary-soft text-[var(--primary-contrast)]",
                  )}
                >
                  {(lead.name ?? "?").trim().charAt(0).toUpperCase() || "?"}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-[14.5px] font-semibold text-text">
                      {lead.name?.trim() || "Unnamed"}
                    </span>
                    {partial && (
                      <span className="inline-flex items-center gap-1 rounded-pill border border-[rgba(var(--accent-rgb),0.34)] bg-[rgba(var(--accent-rgb),0.12)] px-2 py-[3px] text-[11px] font-semibold text-[var(--accent-contrast)]">
                        <TriangleAlert size={11} />
                        Didn't finish
                      </span>
                    )}
                    <span
                      className={cn(
                        "rounded-pill border px-2 py-[3px] text-[11px] font-semibold",
                        TONE_STYLES[meta.tone],
                      )}
                    >
                      {meta.label}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[12.5px] text-text-muted">
                    {lead.phone || "no number"}
                    {lead.concern ? ` · ${lead.concern}` : ""}
                    {" · "}
                    {lead.createdAt
                      ? `${formatDistanceToNow(toMillis(lead.createdAt))} ago`
                      : "just now"}
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                  {lead.phone && (
                    <>
                      <ContactIconButton
                        href={telLink(lead.phone)}
                        label={`Call ${lead.name ?? "lead"}`}
                        onClick={() => logContact(lead, "call")}
                      >
                        <Phone size={15} />
                      </ContactIconButton>
                      <ContactIconButton
                        href={whatsAppLink(
                          lead.phone,
                          `Hi ${(lead.name ?? "").trim().split(/\s+/)[0] || "there"}, this is GoRebalance.`,
                        )}
                        label={`WhatsApp ${lead.name ?? "lead"}`}
                        tone="whatsapp"
                        onClick={() => logContact(lead, "whatsapp", "Quick message from the list")}
                      >
                        <MessageCircle size={15} />
                      </ContactIconButton>
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </ManagerPage>

      <EditorDrawer
        open={drawerOpen}
        title={active?.name?.trim() || "Lead"}
        onClose={() => setDrawerOpen(false)}
        onSave={() => setDrawerOpen(false)}
        hideSave
      >
        {active && (
          <div className="flex flex-col gap-7">
            {/* ---- who ---- */}
            <section>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="m-0 font-fraunces text-[1.3rem] font-medium text-text">
                    {active.name?.trim() || "Unnamed"}
                  </h3>
                  <p className="mt-1 text-[12.5px] text-text-muted">
                    {active.status === "partial"
                      ? "Started the booking form but never submitted it"
                      : "Submitted the booking form"}
                    {active.createdAt
                      ? ` · ${format(toMillis(active.createdAt), "d MMM yyyy 'at' h:mm a")}`
                      : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteId(active.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-pill border border-border px-3 text-[12.5px] font-medium text-text-muted transition-colors hover:border-[var(--danger)] hover:text-[var(--danger-contrast)]"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 rounded-[16px] border border-border bg-surface-alt p-5">
                <Detail icon={Phone} label="Phone">
                  {active.phone ? (
                    <a href={telLink(active.phone)} className="hover:text-primary">
                      +91 {active.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </Detail>
                <Detail icon={Mail} label="Email">
                  {active.email ? (
                    <a href={`mailto:${active.email}`} className="truncate hover:text-primary">
                      {active.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </Detail>
                <Detail icon={User} label="Gender">
                  {active.gender || "—"}
                </Detail>
                <Detail icon={NotebookPen} label="Main concern">
                  {active.concern || "—"}
                </Detail>
                <div className="col-span-2 border-t border-border pt-3">
                  <Detail icon={Clock} label="Where they stopped">
                    {active.status === "partial"
                      ? `Last field filled: ${active.furthestField || "unknown"}`
                      : "Completed the form"}
                    {active.source ? ` · from ${active.source}` : ""}
                  </Detail>
                </div>
              </dl>
            </section>

            {/* ---- pipeline ---- */}
            <section>
              <h4 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Follow-up status
              </h4>
              <div className="flex flex-wrap gap-2">
                {FOLLOW_UP_STATUSES.map((s) => {
                  const selected = (active.followUpStatus ?? "new") === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFollowUp(active, s.value)}
                      aria-pressed={selected}
                      className={cn(
                        "rounded-pill border px-3.5 py-2 text-[12.5px] font-semibold transition-all",
                        selected
                          ? TONE_STYLES[s.tone]
                          : "border-border bg-surface text-text-muted hover:text-text",
                      )}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              {active.lastContactAt && (
                <p className="mt-2.5 text-[12.5px] text-text-muted">
                  Last contacted {formatDistanceToNow(toMillis(active.lastContactAt))} ago
                </p>
              )}
            </section>

            {/* ---- call ---- */}
            {active.phone && (
              <section>
                <h4 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Call
                </h4>
                <a
                  href={telLink(active.phone)}
                  onClick={() => logContact(active, "call")}
                  className="inline-flex h-[46px] items-center gap-2 rounded-pill bg-[var(--primary-strong)] px-6 text-[14.5px] font-semibold text-[var(--on-primary)]"
                >
                  <PhoneCall size={17} />
                  Call +91 {active.phone}
                </a>
                <p className="mt-2 text-[12px] text-text-muted">
                  Logged automatically, and the status moves to “Tried to reach”.
                </p>
              </section>
            )}

            {/* ---- whatsapp ---- */}
            {active.phone && (
              <section>
                <h4 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  WhatsApp
                </h4>
                <WhatsAppComposer
                  key={active.id}
                  phone={active.phone}
                  name={active.name ?? ""}
                  concern={active.concern ?? ""}
                  onSent={(message) => logContact(active, "whatsapp", message.slice(0, 280))}
                />
              </section>
            )}

            {/* ---- notes ---- */}
            <section>
              <h4 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                Notes
              </h4>
              <div className="flex gap-2">
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  rows={2}
                  placeholder="What happened on the call? Anything to remember next time?"
                  className="w-full resize-y rounded-[13px] border border-border-input bg-surface p-3 text-[14px] text-text outline-none focus:border-[var(--accent-strong)]"
                />
                <button
                  type="button"
                  onClick={() => void addNote(active)}
                  disabled={!noteDraft.trim()}
                  className="h-[46px] shrink-0 self-end rounded-pill bg-[var(--primary-strong)] px-5 text-[14px] font-semibold text-[var(--on-primary)] disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              <ul className="mt-4 flex list-none flex-col gap-2.5 p-0">
                {(active.notes ?? [])
                  .slice()
                  .reverse()
                  .map((note) => (
                    <li
                      key={note.id}
                      className="group rounded-[13px] border border-border bg-surface-alt p-3.5"
                    >
                      <p className="m-0 whitespace-pre-wrap text-[14px] leading-relaxed text-text">
                        {note.text}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[11.5px] text-text-muted">
                          {note.by} · {format(new Date(note.at), "d MMM, h:mm a")}
                        </span>
                        <button
                          type="button"
                          onClick={() => void removeNote(active, note.id)}
                          className="text-[11.5px] text-text-muted opacity-0 transition-opacity hover:text-[var(--danger-contrast)] group-hover:opacity-100 focus:opacity-100"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                {(active.notes ?? []).length === 0 && (
                  <li className="text-[13px] text-text-muted">No notes yet.</li>
                )}
              </ul>
            </section>

            {/* ---- history ---- */}
            {(active.contactLog ?? []).length > 0 && (
              <section>
                <h4 className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
                  Contact history
                </h4>
                <ul className="flex list-none flex-col gap-2 p-0">
                  {(active.contactLog ?? [])
                    .slice()
                    .reverse()
                    .map((entry) => (
                      <li key={entry.id} className="flex items-start gap-2.5 text-[13px]">
                        <span
                          className={cn(
                            "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                            entry.channel === "whatsapp"
                              ? "bg-[rgba(var(--whatsapp-rgb),0.16)] text-[var(--whatsapp)]"
                              : "bg-primary-soft text-[var(--primary-contrast)]",
                          )}
                        >
                          {entry.channel === "whatsapp" ? (
                            <MessageCircle size={12} />
                          ) : (
                            <Phone size={12} />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-text">
                            {entry.channel === "whatsapp" ? "WhatsApp opened" : "Called"} by{" "}
                            {entry.by}
                          </span>
                          <span className="block text-[11.5px] text-text-muted">
                            {format(new Date(entry.at), "d MMM yyyy, h:mm a")}
                          </span>
                          {entry.detail && (
                            <span className="mt-1 block rounded-[9px] bg-surface-alt p-2 text-[12px] italic text-text-muted">
                              “{entry.detail}”
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </EditorDrawer>

      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(next) => !next && setDeleteId(null)}
        title="Delete this lead?"
        itemName={data.find((d) => d.id === deleteId)?.name?.trim() || "this lead"}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt className="mb-1 flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        <Icon size={12} />
        {label}
      </dt>
      <dd className="m-0 truncate text-[14px] font-medium text-text">{children}</dd>
    </div>
  );
}
