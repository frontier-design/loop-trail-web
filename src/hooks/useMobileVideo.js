import { useState, useEffect } from "react";

// Target phones specifically (tablets keep desktop-quality video). Also serve
// the lighter files when the browser reports Save-Data or a slow connection.
const PHONE_QUERY = "(max-width: 768px)";

function evaluate() {
  if (typeof window === "undefined") return false;
  const small = window.matchMedia(PHONE_QUERY).matches;
  const conn =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const slow =
    !!conn &&
    (conn.saveData === true || /(^|-)2g$/.test(conn.effectiveType || ""));
  return small || slow;
}

/**
 * Returns true when the lighter, lower-resolution mobile video variants
 * should be used. Evaluated synchronously on first render so the correct
 * source loads immediately (no large-then-small double download).
 */
export function useMobileVideo() {
  const [isMobile, setIsMobile] = useState(evaluate);

  useEffect(() => {
    const mql = window.matchMedia(PHONE_QUERY);
    const onChange = () => setIsMobile(evaluate());
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

// Bump this whenever a video file is re-encoded/replaced in place. It changes
// the URL so browsers (and the nginx 30-day cache) fetch the new file instead
// of requesting stale byte ranges from an old cached version, which otherwise
// causes "416 Requested Range Not Satisfiable" errors and broken playback.
export const VIDEO_VERSION = "3";

/** Build a public video URL, swapping in the `-mobile` variant when appropriate. */
export function videoSrc(name, isMobile) {
  const suffix = isMobile ? "-mobile" : "";
  return `${import.meta.env.BASE_URL}video/${name}${suffix}.mp4?v=${VIDEO_VERSION}`;
}

export default useMobileVideo;
