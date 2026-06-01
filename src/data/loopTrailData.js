import updatedLoopAlignment from './UpdatedLoopAlignment.json'

function arcGISPolylineToGeoJSON(data) {
  const features = Array.isArray(data?.features) ? data.features : []

  return {
    type: 'FeatureCollection',
    features: features
      .map((feature) => {
        const paths = feature?.geometry?.paths
        if (!Array.isArray(paths) || paths.length === 0) return null

        return {
          type: 'Feature',
          properties: feature?.attributes ?? {},
          geometry: {
            type: 'MultiLineString',
            coordinates: paths,
          },
        }
      })
      .filter(Boolean),
  }
}

function normalizeTrailData(data) {
  if (data?.type === 'FeatureCollection') return data
  return arcGISPolylineToGeoJSON(data)
}

export default normalizeTrailData(updatedLoopAlignment)
