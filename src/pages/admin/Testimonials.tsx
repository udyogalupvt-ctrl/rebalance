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
import { Pencil, Trash2, X, Plus, Star, Image as ImageIcon, Video } from "lucide-react";
import { StoryMediaFields } from "@/components/admin/shared/StoryMediaFields";
import { isYouTubeUrl } from "@/lib/youtube";

interface TestimonialDoc extends CMSDocument {
  name: string;
  initials: string;
  location: string;
  condition: string;
  category: string;
  duration: string;
  rating: number;
  quote: string;
  fullStory?: string;
  before?: string[];
  after?: string[];
  featured: boolean;
  consent?: boolean;
  /** A photograph of the client, uploaded by the practice. */
  photoUrl?: string;
  /** A YouTube link. Played inline on the site — see StoryMedia. */
  videoUrl?: string;
}

const CATEGORIES = [
  "Gut & Digestion",
  "Acid Reflux & GERD",
  "IBD Support",
  "PCOS & PCOD",
  "Pregnancy",
  "Diabetes & Metabolic",
  "Weight Loss",
];
const LOCATIONS = ["Kakinada, Andhra Pradesh", "Online consultation", "Other"];

const emptyTestimonial = (): Partial<TestimonialDoc> => ({
  name: "",
  initials: "",
  location: "Kakinada, Andhra Pradesh",
  condition: "",
  category: "Gut & Digestion",
  duration: "",
  rating: 5,
  quote: "",
  fullStory: "",
  before: [],
  after: [],
  featured: false,
  consent: false,
  photoUrl: "",
  videoUrl: "",
  published: true,
});

export default function TestimonialsManager() {
  const [data, setData] = useState<TestimonialDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<TestimonialDoc> | null>(null);
  const [otherLocation, setOtherLocation] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Subscribe to data
  useEffect(() => {
    return subscribeToCMS(
      "testimonials",
      (docs) => {
        setData(docs as TestimonialDoc[]);
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
        if (
          !d.name?.toLowerCase().includes(q) &&
          !d.condition?.toLowerCase().includes(q) &&
          !d.quote?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data, search, statusFilter]);

  const handleReorder = async (newItems: TestimonialDoc[]) => {
    if (search || statusFilter !== "all") return;
    try {
      const batch = writeBatch(db);
      newItems.forEach((item) => {
        batch.update(doc(db, "testimonials", item.id), { order: item.order });
      });
      await batch.commit();
    } catch (err) {
      alert("Failed to save new order");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await setDoc(doc(db, "testimonials", id), { published: !current }, { merge: true });
      if (!current) {
        logActivity(`Testimonial published`, "content", id);
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await setDoc(doc(db, "testimonials", id), { featured: !current }, { merge: true });
    } catch (err) {
      alert("Failed to update featured status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "testimonials", deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete testimonial");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (
      !editingItem ||
      !editingItem.name ||
      !editingItem.initials ||
      !editingItem.condition ||
      !editingItem.duration ||
      !editingItem.quote
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!editingItem.consent) {
      alert("You must confirm written consent before saving.");
      return;
    }

    // A link that does not embed would render as an empty rectangle on the
    // public page, and nobody would notice until a client complained.
    if (editingItem.videoUrl?.trim() && !isYouTubeUrl(editingItem.videoUrl)) {
      alert("The YouTube link isn't valid. Paste the address of the video itself, or clear it.");
      return;
    }

    setIsSaving(true);
    try {
      const id = editingItem.id || `test_${Date.now()}`;
      const order = editingItem.id ? editingItem.order : data.length;

      const finalLocation = editingItem.location === "Other" ? otherLocation : editingItem.location;

      const payload = {
        ...editingItem,
        id,
        order,
        location: finalLocation,
        before: editingItem.before?.filter((c) => c.trim() !== "") || [],
        after: editingItem.after?.filter((c) => c.trim() !== "") || [],
      };

      await setDoc(doc(db, "testimonials", id), payload, { merge: true });

      setEditorOpen(false);
      setEditingItem(null);
      setHasUnsaved(false);
    } catch (err) {
      alert("Failed to save testimonial");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditor = (item?: TestimonialDoc) => {
    if (item) {
      setEditingItem({ ...item });
      if (item.location && !LOCATIONS.includes(item.location)) {
        setEditingItem((prev) => ({ ...prev!, location: "Other" }));
        setOtherLocation(item.location);
      }
    } else {
      setEditingItem(emptyTestimonial());
      setOtherLocation("");
    }
    setHasUnsaved(false);
    setEditorOpen(true);
  };

  const updateEditField = <K extends keyof TestimonialDoc>(field: K, value: TestimonialDoc[K]) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };

      // Auto-generate initials
      if (field === "name") {
        const words = (value as string).trim().split(" ").filter(Boolean);
        let initials = "";
        if (words.length > 0) initials += words[0]?.[0] ?? "";
        if (words.length > 1) initials += words[words.length - 1]?.[0] ?? "";
        next.initials = initials.toUpperCase().substring(0, 3);
      }
      return next;
    });
    setHasUnsaved(true);
  };

  const updateListField = (field: "before" | "after", index: number, value: string) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
    setHasUnsaved(true);
  };

  const addListFieldItem = (field: "before" | "after") => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      if ((prev[field] || []).length >= 4) return prev; // max 4
      return { ...prev, [field]: [...(prev[field] || []), ""] };
    });
    setHasUnsaved(true);
  };

  const removeListFieldItem = (field: "before" | "after", index: number) => {
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
        title="Testimonials"
        subtitle="Client stories shown on the Testimonials page and in the home page carousel."
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
          renderItem={(item: TestimonialDoc, isDragging) => {
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  width: "100%",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14.5,
                        fontWeight: 600,
                        color: "var(--text)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minWidth: 0,
                      }}
                    >
                      {item.condition} · {item.duration}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      marginTop: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    "{item.quote}"
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleFeatured(item.id, !!item.featured)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      color: item.featured ? "var(--accent)" : "var(--border)",
                    }}
                    title={item.featured ? "Featured" : "Mark as featured"}
                  >
                    <Star size={18} fill={item.featured ? "var(--accent)" : "transparent"} />
                  </button>
                  <div style={{ width: 1, height: 24, background: "var(--border)" }} />
                  <PublishToggle
                    published={!!item.published}
                    onChange={() => handleTogglePublish(item.id, !!item.published)}
                  />
                  <div style={{ display: "flex", gap: 4 }}>
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
        title={editingItem?.id ? "Edit testimonial" : "Add testimonial"}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsaved}
        saveLabel={editingItem?.id ? "Save changes" : "Create"}
      >
        {editingItem && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Client name"
                  value={editingItem.name || ""}
                  onChange={(e) => updateEditField("name", e.target.value)}
                  maxLength={50}
                  required
                />
              </div>
              <div style={{ width: 100 }}>
                <TextInput
                  label="Initials"
                  value={editingItem.initials || ""}
                  onChange={(e) => updateEditField("initials", e.target.value.toUpperCase())}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <div>
              <SelectField
                label="Location"
                value={editingItem.location || ""}
                onChange={(e) => updateEditField("location", e.target.value)}
                options={LOCATIONS.map((c) => ({ value: c, label: c }))}
                required
              />
              {editingItem.location === "Other" && (
                <div style={{ marginTop: 12 }}>
                  <TextInput
                    value={otherLocation}
                    onChange={(e) => {
                      setOtherLocation(e.target.value);
                      setHasUnsaved(true);
                    }}
                    placeholder="E.g. Bangalore, Karnataka"
                  />
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Condition"
                  value={editingItem.condition || ""}
                  onChange={(e) => updateEditField("condition", e.target.value)}
                  maxLength={60}
                  placeholder="e.g. Acid Reflux"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <SelectField
                  label="Category"
                  value={editingItem.category || ""}
                  onChange={(e) => updateEditField("category", e.target.value)}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <TextInput
                  label="Duration"
                  value={editingItem.duration || ""}
                  onChange={(e) => updateEditField("duration", e.target.value)}
                  maxLength={30}
                  placeholder="4 months"
                  required
                />
              </div>
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
                  Rating
                </label>
                <div style={{ display: "flex", gap: 4, height: 48, alignItems: "center" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateEditField("rating", star)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 4,
                      }}
                    >
                      <Star
                        size={24}
                        fill={star <= (editingItem.rating || 5) ? "var(--accent)" : "transparent"}
                        color={
                          star <= (editingItem.rating || 5) ? "var(--accent)" : "var(--border)"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <TextArea
              label="Quote"
              value={editingItem.quote || ""}
              onChange={(e) => updateEditField("quote", e.target.value)}
              maxLength={400}
              required
              style={{ minHeight: 100 }}
            />

            <TextArea
              label="Full story (Optional)"
              value={editingItem.fullStory || ""}
              onChange={(e) => updateEditField("fullStory", e.target.value)}
              maxLength={2000}
              style={{ minHeight: 140 }}
              helperText="Shown when the client expands the card. Leave blank for a short testimonial."
            />

            {/* Media. A story can carry a photograph, a YouTube video, or a
                video with the practice's own photograph as its cover. */}
            <div
              style={{
                padding: 20,
                borderRadius: 16,
                border: "1px solid var(--border)",
                background: "var(--surface-alt)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                  color: "var(--text)",
                  fontSize: 14.5,
                  fontWeight: 600,
                }}
              >
                <ImageIcon size={16} />
                <span>Photo &amp; video</span>
                <Video size={16} style={{ color: "var(--text-muted)" }} />
              </div>
              <StoryMediaFields
                photoUrl={editingItem.photoUrl}
                videoUrl={editingItem.videoUrl}
                onPhotoChange={(url) => updateEditField("photoUrl", url ?? "")}
                onVideoChange={(url) => updateEditField("videoUrl", url ?? "")}
                alt={editingItem.name ? `${editingItem.name}'s story` : "Client story"}
              />
            </div>

            <div style={{ display: "flex", gap: 24 }}>
              {/* Before */}
              <div style={{ flex: 1 }}>
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
                  Before (Max 4)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(editingItem.before || []).map((val, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          value={val}
                          onChange={(e) => updateListField("before", i, e.target.value)}
                          placeholder="Short phrase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeListFieldItem("before", i)}
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
                  {(editingItem.before || []).length < 4 && (
                    <button
                      type="button"
                      onClick={() => addListFieldItem("before")}
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
                      <Plus size={16} /> Add
                    </button>
                  )}
                </div>
              </div>

              {/* After */}
              <div style={{ flex: 1 }}>
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
                  After (Max 4)
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(editingItem.after || []).map((val, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <TextInput
                          value={val}
                          onChange={(e) => updateListField("after", i, e.target.value)}
                          placeholder="Short phrase"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeListFieldItem("after", i)}
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
                  {(editingItem.after || []).length < 4 && (
                    <button
                      type="button"
                      onClick={() => addListFieldItem("after")}
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
                      <Plus size={16} /> Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                padding: 16,
                background: "var(--surface-alt)",
                borderRadius: 16,
                marginTop: 8,
              }}
            >
              <label
                style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={!!editingItem.featured}
                  onChange={(e) => updateEditField("featured", e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--accent)" }}
                />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                    Featured Story
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                    Featured stories appear in the in-depth spotlights section. Keep this to three.
                  </div>
                </div>
              </label>
            </div>

            <div
              style={{
                padding: 16,
                background: "rgba(var(--danger-rgb), 0.05)",
                border: "1px solid rgba(var(--danger-rgb), 0.15)",
                borderRadius: 16,
              }}
            >
              <label
                style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
              >
                <input
                  type="checkbox"
                  checked={!!editingItem.consent}
                  onChange={(e) => updateEditField("consent", e.target.checked)}
                  style={{ width: 18, height: 18, marginTop: 2, accentColor: "var(--primary)" }}
                />
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                    Consent Confirmed <span style={{ color: "var(--danger)" }}>*</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                    I confirm written consent has been obtained from this client to publish their
                    words. Required for health testimonials.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}
      </EditorDrawer>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Testimonial"
        itemName={data.find((d) => d.id === deleteId)?.name || "this testimonial"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
