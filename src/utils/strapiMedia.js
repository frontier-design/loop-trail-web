import { getStrapiUrl } from "../api/strapi.js";

function resolveUrl(url) {
  if (!url) return null;
  return String(url).startsWith("http") ? url : getStrapiUrl(url);
}

/** Strapi media can arrive as a raw object, `{ data: { attributes } }`, or `{ attributes }`. */
export function getMediaAttrs(media) {
  return media?.data?.attributes ?? media?.attributes ?? media ?? null;
}

/** Full URL for the original (unscaled) media file. */
export function getMediaUrl(media) {
  const attrs = getMediaAttrs(media);
  return resolveUrl(attrs?.url ?? media?.url);
}

/**
 * Build responsive <img> props from a Strapi media object using its generated
 * `formats` (thumbnail/small/medium/large) plus the original. Returns `src`,
 * `srcSet`, `sizes`, and intrinsic `width`/`height` (to avoid layout shift).
 *
 * Without this, components default to the original upload, which can be several
 * MB even when displayed small.
 *
 * @param {object} media - Strapi media field
 * @param {object} [opts]
 * @param {string} [opts.sizes] - CSS `sizes` attribute for the browser to pick a candidate
 */
export function getStrapiImageProps(media, { sizes } = {}) {
  const attrs = getMediaAttrs(media);
  const src = getMediaUrl(media);
  if (!src || !attrs) return null;

  const candidates = Object.values(attrs?.formats ?? {})
    .filter((f) => f?.url && Number.isFinite(f?.width))
    .map((f) => ({ url: resolveUrl(f.url), width: Number(f.width) }));

  if (Number.isFinite(attrs?.width)) {
    candidates.push({ url: src, width: Number(attrs.width) });
  }

  const byWidth = new Map();
  candidates.forEach((c) => {
    if (!byWidth.has(c.width)) byWidth.set(c.width, c.url);
  });

  const srcSet = [...byWidth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([width, url]) => `${url} ${width}w`)
    .join(", ");

  return {
    src,
    ...(srcSet ? { srcSet, sizes: sizes ?? "100vw" } : {}),
    ...(Number.isFinite(attrs?.width) ? { width: Number(attrs.width) } : {}),
    ...(Number.isFinite(attrs?.height) ? { height: Number(attrs.height) } : {}),
  };
}
