import React from "react";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

/** Items must carry a stable string id for dnd-kit to track them. */
interface SortableListProps<T extends { id: string }> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  disabled?: boolean;
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
}

export function SortableList<T extends { id: string }>({
  items,
  onReorder,
  disabled,
  renderItem,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

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
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      // Update order field
      const updatedItems = newItems.map((item, index) => ({ ...item, order: index }));
      onReorder(updatedItems);
    }
  };

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} disabled={disabled ?? false}>
              {renderItem(item, false)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div
            style={{
              transform: "rotate(2deg)",
              boxShadow: "0 20px 40px rgba(var(--shadow-rgb), 0.15)",
              borderRadius: 18,
            }}
          >
            {renderItem(activeItem, true)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

interface SortableItemProps {
  id: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function SortableItem({ id, disabled, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled: disabled ?? false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drop line indicator if needed, but dnd-kit closestCenter handles visual sorting nicely */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 12,
          // Without these a long value inside the row establishes a min-content
          // width and the whole list scrolls the page sideways.
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                {...(disabled ? {} : attributes)}
                {...(disabled ? {} : listeners)}
                style={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  cursor: disabled ? "not-allowed" : isDragging ? "grabbing" : "grab",
                  color: "var(--text-muted)",
                  background: "transparent",
                  borderRadius: 6,
                  opacity: disabled ? 0.3 : 1,
                }}
              >
                <GripVertical size={18} />
              </div>
            </Tooltip.Trigger>
            {disabled && (
              <Tooltip.Portal>
                <Tooltip.Content
                  style={{
                    background: "var(--text)",
                    color: "var(--surface)",
                    fontSize: 12,
                    padding: "6px 12px",
                    borderRadius: 6,
                    zIndex: 100,
                  }}
                  sideOffset={5}
                >
                  Clear filters to reorder
                  <Tooltip.Arrow style={{ fill: "var(--text)" }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>

        <div style={{ flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
