import { fetchStrapiWithStatus } from './strapi.js'

const cache = new Map()

const ROUTE_APIS = {
  '/hubs': '/api/hubs?populate[0]=Hero&populate[1]=HubItem&populate[2]=HubItem.Image&populate[3]=HubItem.Link',
  '/indigenous-stewardship': '/api/indigenous-stewardship?populate[0]=Hero&populate[1]=ExplainerImage&populate[2]=ComponentExplainer&populate[3]=ComponentExplainer.Image',
  '/maps': '/api/maps?populate[0]=Hero&populate[1]=MapContainer&populate[2]=MapContainer.MapThumbnail&populate[3]=MapContainer.MapDownloadLink',
  '/faqs': '/api/faqs?populate[0]=Hero&populate[1]=FAQItem&populate[2]=FAQItem.QuestionItem&populate[3]=CTA&populate[4]=CTA.Background&populate[5]=CTA.Button',
  '/get-involved': '/api/get-involved?populate[0]=Hero',
  '/': '/api/home?populate[0]=HomeIntro&populate[1]=HomeIntro.StackingImage',
}

/**
 * Prefetch and cache CMS data for a given route path.
 * Silently ignores errors — prefetch is best-effort.
 * @param {string} routePath - e.g. '/hubs'
 */
export async function prefetchRoute(routePath) {
  const apiPath = ROUTE_APIS[routePath]
  if (!apiPath || cache.has(routePath)) return

  // Mark as in-flight to avoid duplicate requests
  cache.set(routePath, null)

  try {
    const data = await fetchStrapiWithStatus(apiPath, { draft: false })
    cache.set(routePath, data)
  } catch {
    // Remove so it can be retried on next hover
    cache.delete(routePath)
  }
}

/**
 * Get cached data for a route, if available.
 * @param {string} routePath
 * @returns {any|null}
 */
export function getCachedRoute(routePath) {
  return cache.get(routePath) ?? null
}
