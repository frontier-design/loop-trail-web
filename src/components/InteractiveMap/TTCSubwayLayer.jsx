import { useEffect, useRef } from 'react'

const TTC_LINE_COLORS = {
  1: '#FFD400', // yellow (Line 1 Yonge-University)
  2: '#00843D', // green (Line 2 Bloor-Danforth)
  3: '#80276C', // purple (Line 3 Scarborough)
  4: '#D3509D', // magenta (Line 4 Sheppard)
  5: '#F7941D', // orange (Line 5 Eglinton)
  6: '#808080', // gray (Line 6 Finch West)
}

export default function TTCSubwayLayer({ map, data, lineWidth = 3, lineOpacity = 1, id = 'ttc-subway' }) {
  const addedRef = useRef(false)

  useEffect(() => {
    if (!map || !data || addedRef.current) return
    if (!data.features || data.features.length === 0) return

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
        'line-color': [
          'match',
          ['get', 'ROUTE_ID'],
          1, TTC_LINE_COLORS[1],
          2, TTC_LINE_COLORS[2],
          3, TTC_LINE_COLORS[3],
          4, TTC_LINE_COLORS[4],
          5, TTC_LINE_COLORS[5],
          6, TTC_LINE_COLORS[6],
          '#666',
        ],
        'line-width': lineWidth,
        'line-opacity': lineOpacity,
        'line-dasharray': [2, 2],
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
  }, [map, data, lineWidth, lineOpacity, id])

  return null
}
