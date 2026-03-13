import { fetchStrapiWithStatus } from "./strapi.js";

// In-memory session cache: survives SPA navigation, cleared on full page reload
const cache = new Map();
// Track in-flight promises to avoid duplicate requests
const inflight = new Map();

export const ROUTE_APIS = {
  "/hubs":
    "/api/hubs?populate[0]=Hero&populate[1]=HubItem&populate[2]=HubItem.Image&populate[3]=HubItem.Link&populate[4]=Neighbourhoods",
  "/indigenous-stewardship":
    "/api/indigenous-stewardship?populate[0]=Hero&populate[1]=ExplainerImage&populate[2]=ComponentExplainer&populate[3]=ComponentExplainer.Image",
  "/maps":
    "/api/maps?populate[0]=Hero&populate[1]=MapContainer&populate[2]=MapContainer.MapThumbnail&populate[3]=MapContainer.MapDownloadLink",
  "/faqs":
    "/api/faqs?populate[0]=Hero&populate[1]=FAQItem&populate[2]=FAQItem.QuestionItem&populate[3]=CTA&populate[4]=CTA.Background&populate[5]=CTA.Button",
  "/get-involved": "/api/get-involved?populate[0]=Hero",
  "/": "/api/home?populate[0]=HomeIntro&populate[1]=HomeIntro.StackingImage&populate[2]=IndigenousHomepageComponent&populate[3]=IndigenousHomepageComponent.Image&populate[4]=IndigenousHomepageComponent.Link&populate[5]=HomeCta&populate[6]=HomeCta.Background&populate[7]=HomeCta.Button&populate[8]=WaysTheLoopWillTransformToronto&populate[9]=Logos&populate[10]=Logos.LogoItem&populate[11]=Logos.LogoItem.LogoImage",
};

// Max age before a background revalidation is triggered (5 minutes)
const STALE_MS = 5 * 60 * 1000;
const timestamps = new Map();

/**
 * Fetch CMS data with stale-while-revalidate semantics.
 * - If cached data exists, it is returned immediately.
 * - If the cached data is older than STALE_MS, a background refetch updates
 *   the cache for the next caller (the current caller still gets the stale data
 *   instantly — no waiting).
 * - Draft mode always bypasses cache.
 *
 * @param {string} apiPath - Full API path with populate params
 * @param {{ draft?: boolean }} [opts]
 * @returns {Promise<any>}
 */
export async function fetchCached(apiPath, { draft = false } = {}) {
  if (draft) {
    return fetchStrapiWithStatus(apiPath, { draft: true });
  }

  const cached = cache.get(apiPath);
  if (cached) {
    const age = Date.now() - (timestamps.get(apiPath) ?? 0);
    if (age > STALE_MS && !inflight.has(apiPath)) {
      revalidate(apiPath);
    }
    return cached;
  }

  if (inflight.has(apiPath)) {
    return inflight.get(apiPath);
  }

  const promise = fetchStrapiWithStatus(apiPath, { draft: false })
    .then((data) => {
      cache.set(apiPath, data);
      timestamps.set(apiPath, Date.now());
      inflight.delete(apiPath);
      return data;
    })
    .catch((err) => {
      inflight.delete(apiPath);
      throw err;
    });

  inflight.set(apiPath, promise);
  return promise;
}

function revalidate(apiPath) {
  const promise = fetchStrapiWithStatus(apiPath, { draft: false })
    .then((data) => {
      cache.set(apiPath, data);
      timestamps.set(apiPath, Date.now());
      inflight.delete(apiPath);
    })
    .catch(() => {
      inflight.delete(apiPath);
    });
  inflight.set(apiPath, promise);
}

/**
 * Prefetch and cache CMS data for a given route path.
 * Silently ignores errors — prefetch is best-effort.
 * @param {string} routePath - e.g. '/hubs'
 */
export async function prefetchRoute(routePath) {
  const apiPath = ROUTE_APIS[routePath];
  if (!apiPath) return;
  try {
    await fetchCached(apiPath);
  } catch {
    // best-effort
  }
}
