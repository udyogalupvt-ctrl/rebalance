/**
 * YouTube link handling for client stories.
 *
 * The practice pastes whatever URL the YouTube app or browser gave them, so
 * every shape has to be accepted: watch links, share links, Shorts, embeds,
 * and links carrying a playlist or a timestamp. Anything we cannot recognise
 * is reported as invalid in the editor rather than silently saved and shown
 * to visitors as a blank rectangle.
 */

const PATTERNS: RegExp[] = [
  // youtu.be/<id>
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  // youtube.com/watch?v=<id>
  /[?&]v=([A-Za-z0-9_-]{11})/,
  // youtube.com/embed/<id>, /v/<id>, /shorts/<id>, /live/<id>
  /(?:youtube(?:-nocookie)?\.com\/(?:embed|v|shorts|live)\/)([A-Za-z0-9_-]{11})/,
];

/** The 11-character video id, or null if this is not a YouTube link. */
export function youTubeId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // A bare id, which is what someone pastes if they copied it out of a URL.
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  for (const pattern of PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export function isYouTubeUrl(url: string | undefined | null): boolean {
  return youTubeId(url) !== null;
}

/**
 * The player URL, for an inline <iframe>.
 *
 * youtube-nocookie.com is used deliberately: it does not write tracking
 * cookies until the visitor actually plays the video, which matters on a site
 * whose privacy policy promises health information is not shared. `rel=0`
 * keeps the end-screen suggestions inside the same channel, so a client story
 * does not end by recommending a competitor.
 */
export function youTubeEmbedUrl(url: string, { autoplay = true } = {}): string | null {
  const id = youTubeId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
}

/**
 * A poster frame, used when the practice has not uploaded their own.
 *
 * `hqdefault` rather than `maxresdefault`: maxres only exists for videos
 * uploaded above 720p, and when it is missing YouTube serves a 120x90 grey
 * placeholder instead of a 404 — so the card silently degrades to a blurred
 * grey smear. hqdefault always exists.
 */
export function youTubeThumbnail(url: string): string | null {
  const id = youTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

export function youTubeWatchUrl(url: string): string | null {
  const id = youTubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
