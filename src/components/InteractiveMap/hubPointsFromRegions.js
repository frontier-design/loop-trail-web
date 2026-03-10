/**
 * For each hub region (MultiPolygon), find the point on its boundary
 * that is closest to the loop trail, and return a FeatureCollection of Points.
 */
function getLineSegments(feature) {
  const segs = []
  const geom = feature?.geometry
  if (!geom) return segs
  if (geom.type === 'LineString' && geom.coordinates?.length >= 2) {
    for (let i = 0; i < geom.coordinates.length - 1; i++) {
      segs.push([geom.coordinates[i], geom.coordinates[i + 1]])
    }
  }
  if (geom.type === 'MultiLineString' && geom.coordinates) {
    geom.coordinates.forEach((ring) => {
      for (let i = 0; i < ring.length - 1; i++) {
        segs.push([ring[i], ring[i + 1]])
      }
    })
  }
  return segs
}

function pointToSegmentDist(px, py, [ax, ay], [bx, by]) {
  const abx = bx - ax
  const aby = by - ay
  const apx = px - ax
  const apy = py - ay
  const ab2 = abx * abx + aby * aby
  if (ab2 === 0) return Math.hypot(apx, apy)
  let t = (apx * abx + apy * aby) / ab2
  t = Math.max(0, Math.min(1, t))
  const projX = ax + t * abx
  const projY = ay + t * aby
  return { d: Math.hypot(px - projX, py - projY), x: projX, y: projY }
}

function getPolygonBoundaryPoints(geom) {
  const pts = []
  if (geom.type === 'Polygon' && geom.coordinates?.[0]) {
    geom.coordinates[0].forEach((c) => pts.push(c))
  }
  if (geom.type === 'MultiPolygon' && geom.coordinates) {
    geom.coordinates.forEach((poly) => {
      if (poly?.[0]) poly[0].forEach((c) => pts.push(c))
    })
  }
  return pts
}

export function hubPointsCentroids(regionsData) {
  const pointFeatures = []
  ;(regionsData?.features ?? []).forEach((feature) => {
    const geom = feature?.geometry
    const props = feature?.properties ?? {}
    if (!geom) return
    const pts = getPolygonBoundaryPoints(geom)
    if (pts.length === 0) return

    let sumX = 0
    let sumY = 0
    for (const [x, y] of pts) {
      sumX += x
      sumY += y
    }
    pointFeatures.push({
      type: 'Feature',
      properties: props,
      geometry: { type: 'Point', coordinates: [sumX / pts.length, sumY / pts.length] },
    })
  })
  return { type: 'FeatureCollection', features: pointFeatures }
}

export function hubPointsClosestToLoop(regionsData, trailData) {
  const loopSegments = []
  ;(trailData?.features ?? []).forEach((f) => {
    loopSegments.push(...getLineSegments(f))
  })

  const pointFeatures = []
  ;(regionsData?.features ?? []).forEach((feature) => {
    const geom = feature?.geometry
    const props = feature?.properties ?? {}
    if (!geom) return
    const boundaryPts = getPolygonBoundaryPoints(geom)
    if (boundaryPts.length === 0) return

    let best = { d: Infinity, x: 0, y: 0 }
    boundaryPts.forEach(([px, py]) => {
      loopSegments.forEach(([a, b]) => {
        const { d, x, y } = pointToSegmentDist(px, py, a, b)
        if (d < best.d) best = { d, x, y }
      })
    })

    pointFeatures.push({
      type: 'Feature',
      properties: props,
      geometry: { type: 'Point', coordinates: [best.x, best.y] },
    })
  })

  return { type: 'FeatureCollection', features: pointFeatures }
}
