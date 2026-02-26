const STRAPI_URL = (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/+$/, '')

/**
 * Build a full Strapi URL for a given path.
 * @param {string} path - e.g. '/api/restaurants' or '/uploads/image.jpg'
 * @returns {string}
 */
export function getStrapiUrl(path = '') {
  return `${STRAPI_URL}${path}`
}

/**
 * Fetch JSON from the Strapi REST API.
 * @param {string} path  - API path, e.g. '/api/restaurants?populate=*'
 * @param {RequestInit} [options] - Additional fetch options (headers, method, etc.)
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchStrapi(path, options = {}) {
  const url = getStrapiUrl(path)

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const res = await fetch(url, { ...options, headers })

  if (!res.ok) {
    throw new Error(`Strapi request failed: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/**
 * Fetch JSON from the Strapi REST API with optional draft status.
 * Appends `status=draft` to the query string when `draft` is true.
 * @param {string} path  - API path, e.g. '/api/hubs?populate=*'
 * @param {{ draft?: boolean }} [opts] - Options
 * @param {RequestInit} [fetchOptions] - Additional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export async function fetchStrapiWithStatus(path, { draft = false } = {}, fetchOptions = {}) {
  const separator = path.includes('?') ? '&' : '?'
  const fullPath = draft ? `${path}${separator}status=draft` : path
  return fetchStrapi(fullPath, fetchOptions)
}

/**
 * Submit a Get Involved form to Strapi.
 * @param {{ firstName: string, lastName: string, organization?: string, email: string, message: string, submittedAt?: string }} data
 * @returns {Promise<any>} Strapi response
 */
export async function postGetInvolvedSubmission(data) {
  return fetchStrapi('/api/get-involved-submissions', {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
}

/**
 * Subscribe an email to the newsletter via Strapi.
 * @param {{ email: string }} data
 * @returns {Promise<any>} Strapi response
 */
export async function postNewsletterSubscription(data) {
  return fetchStrapi('/api/newsletter-subscriptions', {
    method: 'POST',
    body: JSON.stringify({ data }),
  })
}
