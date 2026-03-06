/**
 * Extract coordinates from a GeoJSON geometry.
 * @param {object} geom
 * @returns {number[][]}
 */
function getCoords(geom) {
  if (!geom?.coordinates) return []
  const c = geom.coordinates
  if (geom.type === 'Point') return [c]
  if (geom.type === 'LineString') return c
  if (geom.type === 'Polygon' && c[0]) return c[0]
  if (geom.type === 'MultiPoint') return c
  if (geom.type === 'MultiLineString') return c.flat()
  if (geom.type === 'MultiPolygon') return c.flatMap((p) => (p && p[0]) || [])
  return []
}

/**
 * Compute bounding box [minLng, minLat, maxLng, maxLat] from GeoJSON.
 * @param {object} geojson - GeoJSON FeatureCollection or Feature
 * @returns {[number, number, number, number]|null}
 */
export function getGeoJSONBbox(geojson) {
  const features = geojson?.features ?? (geojson ? [geojson] : [])
  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity
  let hasAny = false

  for (const f of features) {
    const geom = f?.geometry
    const coords = getCoords(geom)
    for (const [lng, lat] of coords) {
      if (typeof lng === 'number' && typeof lat === 'number') {
        minLng = Math.min(minLng, lng)
        minLat = Math.min(minLat, lat)
        maxLng = Math.max(maxLng, lng)
        maxLat = Math.max(maxLat, lat)
        hasAny = true
      }
    }
  }

  if (!hasAny) return null
  return [minLng, minLat, maxLng, maxLat]
}
