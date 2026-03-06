import { useEffect, useRef } from 'react'

export default function GeoJSONLineLayer({ map, data, lineColor = '#00A86B', lineWidth = 4, lineOpacity = 1, id = 'trail-line' }) {
  const addedRef = useRef(false)

  useEffect(() => {
    if (!map || !data || addedRef.current) return

    const sourceId = `${id}-source`
    const layerId = `${id}-layer`

    map.addSource(sourceId, {
      type: 'geojson',
      data,
    })

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': lineColor,
        'line-width': lineWidth,
        'line-opacity': lineOpacity,
      },
    })

    addedRef.current = true

    return () => {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch { /* ignore */ }
      addedRef.current = false
    }
  }, [map, data, lineColor, lineWidth, lineOpacity, id])

  return null
}
