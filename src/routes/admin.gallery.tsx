import { createFileRoute } from "@tanstack/react-router";
import GalleryManager from "@/pages/admin/Gallery";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryManager,
});
