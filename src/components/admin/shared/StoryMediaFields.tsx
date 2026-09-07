import * as React from "react";
import { AlertCircle, CheckCircle2, Video } from "lucide-react";
import { ImageUploader } from "@/components/admin/shared/ImageUploader";
import { TextInput } from "@/components/assessment/fields";
import { StoryMedia } from "@/components/shared/StoryMedia";
import { isYouTubeUrl, youTubeId } from "@/lib/youtube";
import type { CloudinaryResult } from "@/lib/cloudinary";

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11.5,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "var(--text-muted)",
  marginBottom: 8,
};

/**
 * Photo and video for a client story.
 *
 * Two independent slots, because they are not alternatives: a story can have
 * a photograph, a video, or a video with the practice's own frame used as its
 * poster. What the visitor sees is decided by <StoryMedia>, and the preview
 * here is that same component, so the editor cannot disagree with the site.
 *
 * The YouTube field validates as you type. The failure it exists to prevent
 * is pasting a channel URL, a search result, or a "share" link that has been
 * shortened by something other than YouTube — all of which look like a
 * YouTube link and none of which will embed.
 */
export function StoryMediaFields({
  photoUrl,
  videoUrl,
  onPhotoChange,
  onVideoChange,
  folder = "gorebalance/testimonials",
  alt,
}: {
  photoUrl: string | undefined;
  videoUrl: string | undefined;
  onPhotoChange: (url: string | undefined) => void;
  onVideoChange: (url: string | undefined) => void;
  folder?: string;
  alt: string;
}) {
  const trimmedVideo = (videoUrl ?? "").trim();
  const videoValid = trimmedVideo === "" || isYouTubeUrl(trimmedVideo);
  const videoId = youTubeId(trimmedVideo);

  // ImageUploader speaks in Cloudinary results; the document stores a URL.
  const uploaderValue: CloudinaryResult | null = photoUrl
    ? ({
        secure_url: photoUrl,
        public_id: "",
        bytes: 0,
        format: "",
        width: 0,
        height: 0,
      } as CloudinaryResult)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <label style={labelStyle}>Photo (optional)</label>
        <ImageUploader
          value={uploaderValue}
          onChange={(result) => onPhotoChange(result?.secure_url ?? undefined)}
          folder={folder}
        />
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 8 }}>
          JPG, PNG or WEBP, up to 5 MB. Used as the story's picture, and as the cover frame if a
          video is added below.
        </p>
      </div>

      <div>
        <label style={labelStyle}>YouTube video (optional)</label>
        <TextInput
          value={videoUrl ?? ""}
          onChange={(e) => onVideoChange(e.target.value || undefined)}
          placeholder="https://www.youtube.com/watch?v=..."
          hasError={!videoValid}
          aria-invalid={!videoValid}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 8,
            fontSize: 12.5,
            color: videoValid
              ? videoId
                ? "var(--success)"
                : "var(--text-muted)"
              : "var(--danger-contrast)",
          }}
        >
          {!videoValid ? (
            <>
              <AlertCircle size={14} />
              <span>
                That isn't a YouTube video link. Paste the address of the video itself — watch,
                youtu.be, Shorts and embed links all work.
              </span>
            </>
          ) : videoId ? (
            <>
              <CheckCircle2 size={14} />
              <span>Video {videoId} recognised. It will play inline on the site.</span>
            </>
          ) : (
            <>
              <Video size={14} />
              <span>Leave blank for a written or photo-only story.</span>
            </>
          )}
        </div>
      </div>

      {(photoUrl || videoId) && (
        <div>
          <label style={labelStyle}>How it will look</label>
          <div style={{ maxWidth: 340 }}>
            <StoryMedia
              photoUrl={photoUrl}
              videoUrl={videoId ? trimmedVideo : undefined}
              alt={alt || "Client story"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
