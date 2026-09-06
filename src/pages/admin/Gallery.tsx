import { useState, useEffect, useMemo, useRef } from "react";
import { doc, setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { subscribeToCMS, CMSDocument } from "@/lib/cms";
import { ManagerPage } from "@/components/admin/shared/ManagerPage";
import { EditorDrawer } from "@/components/admin/shared/EditorDrawer";
import { PublishToggle } from "@/components/admin/shared/PublishToggle";
import { DeleteDialog } from "@/components/admin/shared/DeleteDialog";
import { ImageUploader } from "@/components/admin/shared/ImageUploader";
import { TextInput, SelectField } from "@/components/assessment/fields";
import { Pencil, Trash2, GripVertical, ImagePlus } from "lucide-react";
import { uploadToCloudinary, CloudinaryResult, UploadError } from "@/lib/cloudinary";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryDoc extends CMSDocument {
  src: string;
  alt: string;
  caption: string;
  category: string;
  orientation?: Orientation;
  cloudinaryId?: string; // To attempt deletion from Cloudinary later if possible
}

const CATEGORIES = ["Clinic", "Consultations", "Meal Plans", "Nutrition", "Community", "Events"];
/** The orientation values the gallery grid understands. */
type Orientation = "portrait" | "landscape" | "square" | "tall";
const ORIENTATIONS = ["Landscape", "Portrait", "Square", "Tall"] as const;

/** Narrows a select value to a known orientation. */
const asOrientation = (value: string): Orientation =>
  (["portrait", "landscape", "square", "tall"] as const).includes(value as Orientation)
    ? (value as Orientation)
    : "landscape";

const emptyGallery = (): Partial<GalleryDoc> => ({
  src: "",
  alt: "",
  caption: "",
  category: "Clinic",
  orientation: "landscape",
  published: true,
});

export default function GalleryManager() {
  const [data, setData] = useState<GalleryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<GalleryDoc> | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Bulk Upload State
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkItems, setBulkItems] = useState<Partial<GalleryDoc>[]>([]);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to data
  useEffect(() => {
    return subscribeToCMS(
      "galleryItems",
      (docs) => {
        setData(docs as GalleryDoc[]);
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
          !d.caption?.toLowerCase().includes(q) &&
          !d.alt?.toLowerCase().includes(q) &&
          !d.category?.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [data, search, statusFilter]);

  const handleReorder = async (newItems: GalleryDoc[]) => {
    if (search || statusFilter !== "all") return;
    try {
      const batch = writeBatch(db);
      newItems.forEach((item) => {
        batch.update(doc(db, "galleryItems", item.id), { order: item.order });
      });
      await batch.commit();
    } catch (err) {
      alert("Failed to save new order");
    }
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      await setDoc(doc(db, "galleryItems", id), { published: !current }, { merge: true });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "galleryItems", deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!editingItem || !editingItem.src || !editingItem.caption || !editingItem.alt) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    setIsSaving(true);
    try {
      const id = editingItem.id || `img_${Date.now()}`;
      const order = editingItem.id ? editingItem.order : data.length;

      const payload = {
        ...editingItem,
        id,
        order,
      };

      await setDoc(doc(db, "galleryItems", id), payload, { merge: true });

      setEditorOpen(false);
      setEditingItem(null);
      setHasUnsaved(false);
    } catch (err) {
      alert("Failed to save gallery item");
    } finally {
      setIsSaving(false);
    }
  };

  const openEditor = (item?: GalleryDoc) => {
    setEditingItem(item ? { ...item } : emptyGallery());
    setHasUnsaved(false);
    setEditorOpen(true);
  };

  const updateEditField = <K extends keyof GalleryDoc>(field: K, value: GalleryDoc[K]) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    setHasUnsaved(true);
  };

  // Bulk Upload Logic
  const handleBulkFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files).slice(0, 10); // max 10

    setBulkUploadOpen(true);
    setIsBulkUploading(true);
    setBulkProgress(0);

    const uploaded: Partial<GalleryDoc>[] = [];
    let completed = 0;

    for (const file of files) {
      try {
        const res = await uploadToCloudinary(file, { folder: "gorebalance/gallery" });
        uploaded.push({
          ...emptyGallery(),
          id: `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
          src: res.secure_url,
          cloudinaryId: res.public_id,
          caption: file.name.split(".")[0] ?? file.name,
        });
      } catch (err) {
        console.error("Failed to upload", file.name, err);
      }
      completed++;
      setBulkProgress(Math.round((completed / files.length) * 100));
    }

    setBulkItems(uploaded);
    setIsBulkUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveBulkItems = async () => {
    setIsSaving(true);
    try {
      const batch = writeBatch(db);
      const startingOrder = data.length;

      bulkItems.forEach((item, idx) => {
        if (!item.id || !item.src) return;
        const ref = doc(db, "galleryItems", item.id);
        batch.set(ref, {
          ...item,
          order: startingOrder + idx,
          alt: item.alt || item.caption || "Gallery image",
        });
      });

      await batch.commit();
      setBulkUploadOpen(false);
      setBulkItems([]);
    } catch (err) {
      alert("Failed to save batch");
    } finally {
      setIsSaving(false);
    }
  };

  // DND Kit setup for Grid
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = filteredData.findIndex((item) => item.id === active.id);
      const newIndex = filteredData.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(filteredData, oldIndex, newIndex);
      const updatedItems = newItems.map((item, index) => ({ ...item, order: index }));
      handleReorder(updatedItems);
    }
  };

  return (
    <>
      <ManagerPage
        title="Gallery"
        subtitle="Images shown on the Gallery page and the home page strip."
        count={data.length}
        onAdd={() => fileInputRef.current?.click()}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        loading={loading}
        error={error}
        isEmpty={data.length === 0}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png, image/webp"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleBulkFilesSelected}
        />

        <div style={{ marginBottom: 24, display: "flex", gap: 12 }}>
          <button
            onClick={() => openEditor()}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "transparent",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13.5,
            }}
          >
            Add single image
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "transparent",
              border: "1.5px solid var(--border)",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13.5,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ImagePlus size={16} /> Bulk upload (up to 10)
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredData.map((i) => i.id)} strategy={rectSortingStrategy}>
            <div
              className="af-gallery-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 20,
              }}
            >
              {filteredData.map((item) => (
                <GalleryTile
                  key={item.id}
                  item={item}
                  disabled={search !== "" || statusFilter !== "all"}
                  onEdit={() => openEditor(item)}
                  onDelete={() => setDeleteId(item.id)}
                  onPublishToggle={() => handleTogglePublish(item.id, !!item.published)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </ManagerPage>

      <EditorDrawer
        open={editorOpen}
        title={editingItem?.id ? "Edit image" : "Add image"}
        onClose={() => setEditorOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsaved}
        saveLabel={editingItem?.id ? "Save changes" : "Create"}
      >
        {editingItem && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <ImageUploader
              folder="gorebalance/gallery"
              value={
                editingItem.src
                  ? {
                      secure_url: editingItem.src,
                      public_id: editingItem.cloudinaryId || "",
                      bytes: 0,
                      format: "",
                      width: 0,
                      height: 0,
                    }
                  : null
              }
              onChange={(res) => {
                if (res) {
                  updateEditField("src", res.secure_url);
                  updateEditField("cloudinaryId", res.public_id);
                } else {
                  updateEditField("src", "");
                  updateEditField("cloudinaryId", "");
                }
              }}
            />

            <TextInput
              label="Caption"
              value={editingItem.caption || ""}
              onChange={(e) => updateEditField("caption", e.target.value)}
              maxLength={60}
              required
            />

            <TextInput
              label="Alt text"
              value={editingItem.alt || ""}
              onChange={(e) => updateEditField("alt", e.target.value)}
              maxLength={120}
              required
              helperText="Describe the image for screen readers and search engines."
            />

            <SelectField
              label="Category"
              value={editingItem.category || ""}
              onChange={(e) => updateEditField("category", e.target.value)}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              required
            />

            <SelectField
              label="Orientation"
              value={editingItem.orientation || "landscape"}
              onChange={(e) => updateEditField("orientation", asOrientation(e.target.value))}
              options={ORIENTATIONS.map((c) => ({ value: c.toLowerCase(), label: c }))}
              required
              helperText="Controls how the image sits in the masonry layout."
            />
          </div>
        )}
      </EditorDrawer>

      {/* Bulk Editor Drawer */}
      <EditorDrawer
        open={bulkUploadOpen}
        title="Bulk upload"
        onClose={() => setBulkUploadOpen(false)}
        onSave={saveBulkItems}
        isSaving={isSaving}
        hasUnsavedChanges={bulkItems.length > 0}
        saveLabel="Save all images"
      >
        {isBulkUploading ? (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.5rem", marginBottom: 16 }}
            >
              Uploading {bulkItems.length > 0 ? "..." : "files"}
            </h3>
            <div
              style={{
                width: "100%",
                maxWidth: 300,
                height: 8,
                background: "var(--surface-alt)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${bulkProgress}%`,
                  background: "var(--primary-strong)",
                  transition: "width 200ms ease",
                }}
              />
            </div>
            <p style={{ marginTop: 12, color: "var(--text-muted)", fontWeight: 600 }}>
              {bulkProgress}%
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {bulkItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 16,
                  paddingBottom: 32,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "var(--surface-alt)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.src}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  <TextInput
                    label="Caption"
                    value={item.caption || ""}
                    onChange={(e) => {
                      const newItems = [...bulkItems];
                      newItems[idx] = { ...item, caption: e.target.value };
                      setBulkItems(newItems);
                    }}
                  />
                  <SelectField
                    label="Category"
                    value={item.category || "Clinic"}
                    onChange={(e) => {
                      const newItems = [...bulkItems];
                      newItems[idx] = { ...item, category: e.target.value };
                      setBulkItems(newItems);
                    }}
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  />
                  <SelectField
                    label="Orientation"
                    value={item.orientation || "landscape"}
                    onChange={(e) => {
                      const newItems = [...bulkItems];
                      newItems[idx] = { ...item, orientation: asOrientation(e.target.value) };
                      setBulkItems(newItems);
                    }}
                    options={ORIENTATIONS.map((c) => ({ value: c.toLowerCase(), label: c }))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </EditorDrawer>

      <DeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Image"
        itemName={data.find((d) => d.id === deleteId)?.caption || "this image"}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

// Subcomponent for Sortable Grid Items
function GalleryTile({
  item,
  disabled,
  onEdit,
  onDelete,
  onPublishToggle,
}: {
  item: GalleryDoc;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onPublishToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1, // dnd-kit grid usually hides original to show overlay
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="af-gallery-tile">
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--surface-alt)",
          border: "1px solid var(--border)",
        }}
      >
        <img
          src={item.src}
          alt={item.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: item.published ? 1 : 0.45,
          }}
        />

        {/* Hover overlay UI built in CSS, but inline for logic here */}
        <div
          className="af-gallery-hover-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(var(--dark-surface-rgb), 0.78)",
            display: "flex",
            flexDirection: "column",
            padding: 12,
            opacity: 0,
            transition: "opacity 200ms ease",
            zIndex: 2,
          }}
        >
          {/* Top row */}
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <div
              {...(disabled ? {} : attributes)}
              {...(disabled ? {} : listeners)}
              style={{
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(var(--on-dark-rgb), 0.22)",
                borderRadius: "50%",
                color: "var(--on-dark)",
                cursor: disabled ? "not-allowed" : "grab",
              }}
            >
              <GripVertical size={20} />
            </div>

            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "4px 10px",
                borderRadius: 999,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <PublishToggle published={!!item.published} onChange={onPublishToggle} />
            </div>
          </div>

          {/* Center row */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              onClick={onEdit}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "white",
                color: "var(--text)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(var(--shadow-rgb), 0.2)",
              }}
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "white",
                color: "var(--danger)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(var(--shadow-rgb), 0.2)",
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Bottom row */}
          <div>
            <div style={{ color: "var(--on-dark)", fontSize: 14, fontWeight: 600 }}>
              {item.caption}
            </div>
            <div style={{ color: "var(--on-dark-muted)", fontSize: 12 }}>{item.category}</div>
          </div>
        </div>

        {!item.published && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: 6,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Draft
          </div>
        )}
      </div>

      <style>{`
        .af-gallery-tile:hover .af-gallery-hover-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
