import { useState, useEffect, useMemo } from "react";
import { doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subscribeToCMS, CMSDocument } from "@/lib/cms";
import { ManagerPage } from "@/components/admin/shared/ManagerPage";
import { SortableList } from "@/components/admin/shared/SortableList";
import { EditorDrawer } from "@/components/admin/shared/EditorDrawer";
import { PublishToggle } from "@/components/admin/shared/PublishToggle";
import { DeleteDialog } from "@/components/admin/shared/DeleteDialog";
import { TextInput, SelectField, TextArea } from "@/components/assessment/fields";
import { logActivity } from "@/lib/activityLog";
import { Pencil, Trash2, X, Plus } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { resolveIcon } from "@/lib/icons";

// Fields from requirements
interface TreatmentDoc extends CMSDocument {
  title: string;
  slug: string;
  category: string;
  icon: string;
  summary: string;
  conditions: string[];
  involves: string[];
  timeline: string;
  tags: string[];
}

const CATEGORIES = ["Gut & Digestion", "Hormonal", "Metabolic", "Skin & Immunity", "Preventive"];
const ICONS = [
  "Activity",
  "CalendarHeart",
  "Scale",
  "Gauge",
  "Sparkles",
  "ShieldCheck",
  "HeartPulse",
  "Microscope",
  "Salad",
  "Stethoscope",
];

const emptyTreatment = (): Partial<TreatmentDoc> => ({
  title: "",
  slug: "",
  category: "Gut & Digestion",
  icon: "Activity",
  summary: "",
  conditions: [""],
  involves: [""],
  timeline: "",
  tags: [],
  published: true,
});

export default function TreatmentsManager() {
  const [data, setData] = useState<TreatmentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TreatmentDoc> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subscribe to data
  useEffect(() => {
    return subscribeToCMS(
      "treatments",
      (docs) => {
        setData(docs as TreatmentDoc[]);
        setLoading(false);
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
      if (statusFilter === "published" && !d.published) return false;
      if (statusFilter === "draft" && d.published) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!d.title?.toLowerCase().includes(q) && !d.category?.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [data, search, statusFilter]);

  const handleReorder = async (newItems: TreatmentDoc[]) => {
    // Only allow reorder if not filtered
    if (search || statusFilter !== "all") return;
    try {
      const batch = writeBatch(db);
      newItems.forEach((item) => {
        batch.update(doc(db, "treatments", item.id), { order: item.order });
      });
      await batch.commit();
    } catch (err) {
      alert("Failed to save new order");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await setDoc(doc(db, "treatments", id), { published: !current }, { merge: true });
      if (!current) {
        logActivity(`Treatment published`, "content", id);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "treatments", deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete treatment");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (
      !editingItem ||
      !editingItem.title ||
      !editingItem.slug ||
      !editingItem.summary ||
      !editingItem.timeline
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Validate slug uniqueness if new or changed
    const existing = data.find((d) => d.slug === editingItem.slug && d.id !== editingItem.id);
    if (existing) {
      alert("Slug must be unique.");
      return;
    }

    setIsSaving(true);
    try {
      const id = editingItem.id || `treatment_${Date.now()}`;
      const order = editingItem.id ? editingItem.order : data.length;

      const payload = {
        ...editingItem,
        id,
        order,
        conditions: editingItem.conditions?.filter((c) => c.trim() !== "") || [],
        involves: editingItem.involves?.filter((c) => c.trim() !== "") || [],
        tags: editingItem.tags?.filter((c) => c.trim() !== "") || [],
      };

      await setDoc(doc(db, "treatments", id), payload, { merge: true });

      setEditorOpen(false);
      setEditingItem(null);
      setHasUnsaved(false);
    } catch (err) {
      alert("Failed to save treatment");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditor = (item?: TreatmentDoc) => {
    setEditingItem(item ? { ...item } : emptyTreatment());
    setHasUnsaved(false);
    setEditorOpen(true);
  };

  const updateEditField = <K extends keyof TreatmentDoc>(field: K, value: TreatmentDoc[K]) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      // Auto-generate slug from title if it's a new item and user is typing title
      if (field === "title" && !prev.id) {
        next.slug = (value as string)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return next;
    });
    setHasUnsaved(true);
  };

  const updateListField = (
    field: "conditions" | "involves" | "tags",
    index: number,
    value: string,
  ) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
    setHasUnsaved(true);
  };

  const addListFieldItem = (field: "conditions" | "involves" | "tags") => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: [...(prev[field] || []), ""] };
    });
    setHasUnsaved(true);
  };

  const removeListFieldItem = (field: "conditions" | "involves" | "tags", index: number) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const arr = [...(prev[field] || [])];
      arr.splice(index, 1);
      return { ...prev, [field]: arr };
    });
    setHasUnsaved(true);
  };

  return (
    <>
      <ManagerPage
        title="Treatments"
        subtitle="Programs shown on the Treatments page and in the home page preview."
        count={data.length}
        onAdd={() => openEditor()}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        error={error}
        isEmpty={data.length === 0}
      >
        <SortableList
          items={filteredData}
          disabled={search !== "" || statusFilter !== "all"}
          onReorder={handleReorder}
          renderItem={(item: TreatmentDoc, isDragging) => {
            const Icon = resolveIcon(item.icon, LucideIcons.Activity);
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                    {item.category} · {(item.tags || []).length} tags
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <PublishToggle
                    published={!!item.published}
                    onChange={() => handleTogglePublish(item.id, !!item.published)}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => openEditor(item)}
                      aria-label="Edit"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      aria-label="Delete"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "transparent",
                        border: "none",
                        color: "var(--danger)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      </ManagerPage>

      <EditorDrawer
        open={editorOpen}
        title={editingItem?.id ? "Edit treatment" : "Add treatment"}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsaved}
        saveLabel={editingItem?.id ? "Save changes" : "Create"}
      >
        {editingItem && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <TextInput
              label="Title"
              value={editingItem.title || ""}
              onChange={(e) => updateEditField("title", e.target.value)}
              maxLength={60}
              required
            />

            <TextInput
              label="Slug"
              value={editingItem.slug || ""}
              onChange={(e) => updateEditField("slug", e.target.value)}
              required
              helperText="Auto-generated, used in URLs. Must be unique."
            />

            <SelectField
              label="Category"
              value={editingItem.category || ""}
              onChange={(e) => updateEditField("category", e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              required
            />

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Icon
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {ICONS.map((iconName) => {
                  const Icon = resolveIcon(iconName, LucideIcons.Activity);
                  const isSelected = editingItem.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => updateEditField("icon", iconName)}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: isSelected ? "var(--primary)" : "var(--surface-alt)",
                        color: isSelected ? "white" : "var(--text)",
                        border: isSelected ? "none" : "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 150ms ease",
                      }}
                    >
                      <Icon size={20} />
                    </button>
                  );
                })}
              </div>
            </div>

            <TextArea
              label="Summary"
              value={editingItem.summary || ""}
              onChange={(e) => updateEditField("summary", e.target.value)}
              maxLength={200}
              required
              style={{ minHeight: 80 }}
            />

            {/* Repeatable: Conditions */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Conditions covered
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(editingItem.conditions || [""]).map((val, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={val}
                        onChange={(e) => updateListField("conditions", i, e.target.value)}
                      />
                    </div>
                    {(editingItem.conditions || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListFieldItem("conditions", i)}
                        style={{
                          width: 44,
                          height: 44,
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListFieldItem("conditions")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--primary)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    marginTop: 4,
                    padding: "4px 8px",
                  }}
                >
                  <Plus size={16} /> Add condition
                </button>
              </div>
            </div>

            {/* Repeatable: Involves */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                What the plan involves
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(editingItem.involves || [""]).map((val, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={val}
                        onChange={(e) => updateListField("involves", i, e.target.value)}
                      />
                    </div>
                    {(editingItem.involves || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListFieldItem("involves", i)}
                        style={{
                          width: 44,
                          height: 44,
                          background: "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addListFieldItem("involves")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--primary)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                    marginTop: 4,
                    padding: "4px 8px",
                  }}
                >
                  <Plus size={16} /> Add item
                </button>
              </div>
            </div>

            <TextArea
              label="Timeline"
              value={editingItem.timeline || ""}
              onChange={(e) => updateEditField("timeline", e.target.value)}
              maxLength={300}
              required
              style={{ minHeight: 80 }}
            />

            {/* Repeatable: Tags (max 5) */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--text-muted)",
                  marginBottom: 8,
                }}
              >
                Tags (Max 5)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(editingItem.tags || []).map((val, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <TextInput
                        value={val}
                        onChange={(e) => updateListField("tags", i, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeListFieldItem("tags", i)}
                      style={{
                        width: 44,
                        height: 44,
                        background: "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                {(editingItem.tags || []).length < 5 && (
                  <button
                    type="button"
                    onClick={() => addListFieldItem("tags")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "var(--primary)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      alignSelf: "flex-start",
                      marginTop: 4,
                      padding: "4px 8px",
                    }}
                  >
                    <Plus size={16} /> Add tag
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </EditorDrawer>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Treatment"
        itemName={data.find((d) => d.id === deleteId)?.title || "this treatment"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
