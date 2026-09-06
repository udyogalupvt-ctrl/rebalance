import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Play, X } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { videoHighlights, type VideoHighlight } from "@/data/content";

/** Chip ground that stays legible over any photograph. */
const CHIP_BG = "bg-dark-surface/85 backdrop-blur-md border border-on-dark-border";

// PLACEHOLDER VIDEOS — replace poster images and videoUrl values with the client's real footage.
// If no video is available at launch, leave the `videoHighlights` array empty and the section will not render.
// When real footage lands, captions/subtitles must be supplied (WebVTT <track kind="captions"> or platform captions).

const isEmbed = (url: string) => /youtube\.com|youtu\.be|vimeo\.com|player\./i.test(url);

const withAutoplay = (url: string, autoplay: boolean) =>
  `${url}${url.includes("?") ? "&" : "?"}${autoplay ? "autoplay=1&" : ""}rel=0&modestbranding=1`;

export function VideoHighlights() {
  const items = videoHighlights ?? [];
  const [active, setActive] = React.useState<VideoHighlight | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();

  if (items.length === 0) return null;

  const handleOpen = (item: VideoHighlight, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setActive(item);
  };

  const handleClose = () => {
    setActive(null);
    // return focus to originating card
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  return (
    <SectionWrapper id="video-highlights" bg="alt" labelledBy="video-heading">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 w-[540px] h-[540px] rounded-full bg-primary opacity-[0.04] blur-[150px]"
      />

      <div className="mb-[44px] md:mb-[56px]">
        <SectionHeading
          align="center"
          eyebrow="WATCH"
          title="A few minutes with the *practice*."
          subtitle="Short clips on how consultations run, what plans look like, and the everyday nutrition questions clients ask most."
          className="!mb-0"
        />
      </div>

      <Reveal stagger={0.08}>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px] sm:gap-5 lg:gap-6 items-stretch max-w-[520px] sm:max-w-none mx-auto list-none p-0">
          {items.map((item) => (
            <li key={item.id} className="h-full">
              <VideoCard item={item} onOpen={handleOpen} reduce={!!reduce} />
            </li>
          ))}
        </ul>
      </Reveal>

      <VideoModal item={active} onClose={handleClose} reduce={!!reduce} />
    </SectionWrapper>
  );
}

function VideoCard({
  item,
  onOpen,
  reduce,
}: {
  item: VideoHighlight;
  onOpen: (item: VideoHighlight, el: HTMLButtonElement) => void;
  reduce: boolean;
}) {
  const playable = Boolean(item.videoUrl);

  const shell = (
    <>
      <div className="relative aspect-video overflow-hidden bg-surface-alt">
        <img
          src={item.poster}
          alt=""
          width={1200}
          height={675}
          loading="lazy"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            playable && !reduce && "group-hover:scale-[1.06]",
          )}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70 transition-opacity duration-[350ms] group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(to top, rgba(var(--dark-surface-rgb), 0.55) 0%, rgba(var(--dark-surface-rgb), 0.10) 50%, transparent 100%)",
          }}
        />

        {/* Not glass-on-dark. That token is rgba(244,248,245,0.12) -- a
            translucent WHITE -- and this chip sits at top-3, where the gradient
            below is still fully transparent. Over a pale photo the chip went
            lighter rather than darker and the white label measured 1.99:1.
            A dark ground at 85% is 10:1 even over pure white. */}
        <span
          aria-hidden="true"
          className={
            "absolute top-3 left-3 px-[10px] py-[4px] rounded-pill fs-eyebrow text-on-dark " +
            CHIP_BG
          }
        >
          {item.category}
        </span>

        {playable && (
          <>
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center"
            >
              {!reduce && (
                <span className="absolute w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] rounded-full border-2 border-[var(--on-dark-faint)] animate-video-ping" />
              )}
              <span
                className="relative w-[54px] h-[54px] sm:w-[62px] sm:h-[62px] rounded-full grid place-items-center bg-[rgba(var(--on-dark-rgb), 0.92)] backdrop-blur-[10px] transition-all duration-[350ms] group-hover:scale-[1.08] group-hover:bg-[var(--on-dark)]"
                style={{ boxShadow: "0 8px 28px rgba(var(--dark-surface-rgb), 0.28)" }}
              >
                <Play className="w-6 h-6 text-primary translate-x-[2px]" fill="currentColor" />
              </span>
            </span>
            <span
              aria-hidden="true"
              className="absolute bottom-3 right-3 px-[9px] py-[4px] rounded-[8px] text-[12px] font-semibold text-[var(--on-dark)] bg-[rgba(var(--dark-surface-rgb), 0.72)] backdrop-blur-[6px]"
            >
              {item.duration}
            </span>
          </>
        )}
      </div>

      <div className="flex flex-col flex-grow p-[20px_18px_22px] sm:p-[22px_22px_24px] text-left">
        <h3
          className={cn(
            "font-display font-medium text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.35] mb-[9px] text-text transition-colors duration-[350ms]",
            playable && "group-hover:text-primary",
          )}
        >
          {item.title}
        </h3>
        <p className="text-[14px] leading-[1.6] text-text-muted flex-grow">{item.description}</p>
      </div>
    </>
  );

  const base =
    "group relative flex flex-col h-full w-full overflow-hidden rounded-[22px] bg-surface border border-border";

  if (!playable) {
    return <div className={base}>{shell}</div>;
  }

  return (
    <button
      type="button"
      onClick={(e) => onOpen(item, e.currentTarget)}
      aria-label={`Play video: ${item.title} — ${item.duration}`}
      className={cn(
        base,
        "text-left transition-all duration-[350ms] outline-none",
        "hover:[@media(hover:hover)]:-translate-y-[5px] hover:[@media(hover:hover)]:border-primary/30 hover:[@media(hover:hover)]:shadow-[0_16px_40px_rgba(var(--primary-rgb), 0.10)]",
        "motion-reduce:hover:translate-y-0",
        "focus-visible:-translate-y-[5px] focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px] focus-visible:ring-offset-surface-alt",
      )}
    >
      {shell}
    </button>
  );
}

function VideoModal({
  item,
  onClose,
  reduce,
}: {
  item: VideoHighlight | null;
  onClose: () => void;
  reduce: boolean;
}) {
  const open = Boolean(item);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-[rgba(var(--dark-surface-rgb), 0.90)] backdrop-blur-[12px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out duration-300" />
        <DialogPrimitive.Content
          aria-label="Video player"
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2 w-[min(1080px,92vw)] outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out",
            !reduce && "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "duration-300",
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {item ? `Video player: ${item.title}` : "Video player"}
          </DialogPrimitive.Title>

          <div
            className="relative w-full aspect-video rounded-[18px] overflow-hidden bg-black"
            style={{ boxShadow: "0 30px 80px rgba(var(--shadow-rgb), 0.5)" }}
          >
            {/* Player is mounted only while the modal is open, so playback fully stops on close. */}
            {item && item.videoUrl ? (
              isEmbed(item.videoUrl) ? (
                <iframe
                  src={withAutoplay(item.videoUrl, !reduce)}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              ) : (
                // Add <track kind="captions" src="..." /> once caption files exist.
                <video
                  src={item.videoUrl}
                  poster={item.poster}
                  controls
                  autoPlay={!reduce}
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain bg-black"
                />
              )
            ) : null}
          </div>

          {item && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <span className="text-[15px] font-semibold text-[var(--on-dark)]">{item.title}</span>
              <span className="text-[13px] text-[var(--on-dark)] opacity-70">
                {item.category} · {item.duration}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="fixed right-5 w-11 h-11 rounded-full grid place-items-center bg-[rgba(var(--on-dark-rgb), 0.14)] border border-[rgba(var(--on-dark-rgb), 0.22)] backdrop-blur-[10px] text-on-dark hover:bg-[rgba(var(--on-dark-rgb), 0.24)] transition-colors"
            style={{ top: "calc(env(safe-area-inset-top, 0px) + 20px)" }}
          >
            <X size={20} />
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
