import { fetchStrapiWithStatus } from './strapi.js'

// In-memory session cache: survives SPA navigation, cleared on full page reload
const cache = new Map()
// Track in-flight promises to avoid duplicate requests
const inflight = new Map()

export const ROUTE_APIS = {
  '/hubs': '/api/hubs?populate[0]=Hero&populate[1]=HubItem&populate[2]=HubItem.Image&populate[3]=HubItem.Link',
  '/indigenous-stewardship': '/api/indigenous-stewardship?populate[0]=Hero&populate[1]=ExplainerImage&populate[2]=ComponentExplainer&populate[3]=ComponentExplainer.Image',
  '/maps': '/api/maps?populate[0]=Hero&populate[1]=MapContainer&populate[2]=MapContainer.MapThumbnail&populate[3]=MapContainer.MapDownloadLink',
  '/faqs': '/api/faqs?populate[0]=Hero&populate[1]=FAQItem&populate[2]=FAQItem.QuestionItem&populate[3]=CTA&populate[4]=CTA.Background&populate[5]=CTA.Button',
  '/get-involved': '/api/get-involved?populate[0]=Hero',
  '/': '/api/home?populate[0]=HomeIntro&populate[1]=HomeIntro.StackingImage',
}

/**
 * Fetch CMS data for an API path, using the session cache.
 * If a cached result exists it is returned immediately with no network request.
 * Draft mode always bypasses cache.
 *
 * @param {string} apiPath - Full API path with populate params
 * @param {{ draft?: boolean }} [opts]
 * @returns {Promise<any>}
 */
export async function fetchCached(apiPath, { draft = false } = {}) {
  // Never cache draft/preview content
  if (draft) {
    return fetchStrapiWithStatus(apiPath, { draft: true })
  }

  if (cache.has(apiPath)) {
    return cache.get(apiPath)
  }

  // If already in-flight, wait for the same promise
  if (inflight.has(apiPath)) {
    return inflight.get(apiPath)
  }

  const promise = fetchStrapiWithStatus(apiPath, { draft: false })
    .then(data => {
      cache.set(apiPath, data)
      inflight.delete(apiPath)
      return data
    })
    .catch(err => {
      inflight.delete(apiPath)
      throw err
    })

  inflight.set(apiPath, promise)
  return promise
}

/**
 * Prefetch and cache CMS data for a given route path.
 * Silently ignores errors — prefetch is best-effort.
 * @param {string} routePath - e.g. '/hubs'
 */
export async function prefetchRoute(routePath) {
  const apiPath = ROUTE_APIS[routePath]
  if (!apiPath) return
  try {
    await fetchCached(apiPath)
  } catch {
    // best-effort
  }
}
