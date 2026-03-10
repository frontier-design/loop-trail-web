import { useEffect, useRef } from 'react'

/**
 * GeoJSON for Toronto and Vaughan labels at positions chosen to avoid
 * overlapping the Loop Trail and TTC subway lines.
 *
 * Toronto: east-central position for visibility in the main viewport
 * Vaughan: moved closer to GTA core while staying off major lines
 */
const CITY_LABELS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'TORONTO' },
      geometry: {
        type: 'Point',
        coordinates: [-79.42, 43.65],
      },
    },
    {
      type: 'Feature',
      properties: { name: 'VAUGHAN' },
      geometry: {
        type: 'Point',
        coordinates: [-79.48, 43.80],
      },
    },
  ],
}

export default function CityLabelsLayer({
  map,
  id = 'city-labels',
  beforeId = null,
  textColor = '#333',
  textSize = 14,
  textHaloColor = '#fff',
  textHaloWidth = 1.5,
}) {
  const addedRef = useRef(false)

  useEffect(() => {
    if (!map || addedRef.current) return

    const sourceId = `${id}-source`
    const layerId = `${id}-layer`

    map.addSource(sourceId, {
      type: 'geojson',
      data: CITY_LABELS_GEOJSON,
    })

    const layerConfig = {
      id: layerId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'text-field': ['get', 'name'],
        'text-font': ['Montserrat Medium', 'Open Sans Bold', 'Noto Sans Regular', 'HanWangHeiLight Regular', 'NanumBarunGothic Regular'],
        'text-size': textSize,
        'text-anchor': 'center',
        'text-allow-overlap': true,
        'text-ignore-placement': true,
      },
      paint: {
        'text-color': textColor,
        'text-halo-color': textHaloColor,
        'text-halo-width': textHaloWidth,
      },
    }

    if (beforeId) {
      map.addLayer(layerConfig, beforeId)
    } else {
      map.addLayer(layerConfig)
    }

    addedRef.current = true

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch { /* ignore */ }
      addedRef.current = false
    }
  }, [map, id, beforeId, textColor, textSize, textHaloColor, textHaloWidth])

  return null
}
