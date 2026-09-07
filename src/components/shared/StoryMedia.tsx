import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youTubeEmbedUrl, youTubeThumbnail } from "@/lib/youtube";

export type StoryMediaSource = {
  /** A photograph uploaded by the practice. */
  photoUrl?: string | undefined;
  /** A YouTube link in any of its shapes. */
  videoUrl?: string | undefined;
};

/**
 * The photo or video attached to a client story.
 *
 * A video is NOT embedded on load. Ten stories on the testimonials page would
 * mean ten YouTube iframes, each pulling roughly a megabyte of player before
 * anybody has pressed anything — which is both slow and a tracking problem on
 * a health site. Instead the poster frame is shown with a play control, and
 * the iframe is created only when the visitor asks for it. That is also why
 * the embed points at youtube-nocookie.com.
 *
 * The poster prefers the practice's own photograph over YouTube's generated
 * thumbnail, because their photograph is usually the better frame.
 */
export function StoryMedia({
  photoUrl,
  videoUrl,
  alt,
  className,
  /** Aspect ratio of the frame. Stories are usually landscape. */
  ratio = "16/9",
  rounded = "rounded-[18px]",
}: StoryMediaSource & {
  alt: string;
  className?: string;
  ratio?: string;
  rounded?: string;
}) {
  const [playing, setPlaying] = React.useState(false);

  const embed = videoUrl ? youTubeEmbedUrl(videoUrl) : null;
  const poster = photoUrl || (videoUrl ? youTubeThumbnail(videoUrl) : null);

  if (!poster && !embed) return null;

  const frame = cn("relative w-full overflow-hidden bg-surface-alt", rounded, className);

  if (embed && playing) {
    return (
      <div className={frame} style={{ aspectRatio: ratio }}>
        <iframe
          src={embed}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const content = (
    <>
      {poster && (
        <img
          src={poster}
          alt={embed ? "" : alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,0.84,0.24,1)] group-hover:scale-[1.04]"
        />
      )}
      {embed && (
        <>
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(var(--dark-surface-rgb),0.55),rgba(var(--dark-surface-rgb),0.05))] transition-opacity duration-300 group-hover:opacity-80"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 grid h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[rgba(var(--on-dark-rgb),0.92)] shadow-[0_10px_30px_rgba(var(--shadow-rgb),0.3)] transition-transform duration-300 group-hover:scale-110"
          >
            <Play
              className="ml-[3px] h-[22px] w-[22px] text-[var(--dark-surface)]"
              fill="currentColor"
            />
          </span>
        </>
      )}
    </>
  );

  if (!embed) {
    return (
      <div className={cn(frame, "group")} style={{ aspectRatio: ratio }}>
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${alt}`}
      className={cn(
        frame,
        "group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
      )}
      style={{ aspectRatio: ratio }}
    >
      {content}
    </button>
  );
}

/** Whether a story has anything to show at all. */
export function hasStoryMedia(source: StoryMediaSource): boolean {
  return Boolean(source.photoUrl || source.videoUrl);
}
