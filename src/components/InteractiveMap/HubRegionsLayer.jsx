import { useEffect, useRef, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import * as maplibregl from 'maplibre-gl'
import { hubPointsClosestToLoop } from './hubPointsFromRegions.js'
import HubPopupContent from './HubPopupContent.jsx'

const HubPopupStyles = createGlobalStyle`
  .hub-map-popup .maplibregl-popup-content {
    background: transparent;
    padding: 0;
    box-shadow: none;
  }
  .hub-map-popup .maplibregl-popup-tip {
    display: none;
  }
`

function renderPopupContent(container, meta, hubId) {
  const root = createRoot(container)
  root.render(
    <HubPopupContent
      title={meta.title}
      imageUrl={meta.imageUrl}
      description={meta.description}
      hubId={hubId}
    />
  )
  return root
}

export default function HubRegionsLayer({
  map,
  regionsData,
  trailData,
  hubMeta = {},
  onRegionClick,
  id = 'hub-regions',
}) {
  const addedRef = useRef(false)
  const popupRef = useRef(null)
  const popupRootRef = useRef(null)
  const hubMetaRef = useRef(hubMeta)
  const hideTimeoutRef = useRef(null)

  useEffect(() => {
    hubMetaRef.current = hubMeta
  }, [hubMeta])

  const pointsData = useMemo(() => {
    if (!regionsData || !trailData) return null
    return hubPointsClosestToLoop(regionsData, trailData)
  }, [regionsData, trailData])

  useEffect(() => {
    if (!map || !pointsData || addedRef.current) return
    if (!pointsData.features || pointsData.features.length === 0) return

    const sourceId = `${id}-source`
    const layerId = `${id}-layer`
    const popup = new maplibregl.Popup({
      className: 'hub-map-popup',
      anchor: 'center',
      offset: [0, 50],
      closeButton: false,
      closeOnClick: false,
      maxWidth: 'none',
    })
    popupRef.current = popup

    map.addSource(sourceId, {
      type: 'geojson',
      data: pointsData,
    })

    map.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 80,
        'circle-color': '#00A86B',
        'circle-opacity': 0.5,
        'circle-blur': 0.6,
      },
    })

    if (onRegionClick) {
      map.on('click', layerId, (e) => {
        const feature = e.features?.[0]
        if (feature) {
          const props = feature.properties ?? {}
          onRegionClick({ id: props.id ?? props.hubId, ...props })
        }
      })
    }

    function unmountPopup() {
      const root = popupRootRef.current
      if (root) {
        try {
          root.unmount()
        } catch {
          /* popup DOM may already be removed */
        }
        popupRootRef.current = null
      }
    }

    map.on('mouseenter', layerId, (e) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
        hideTimeoutRef.current = null
      }
      map.getCanvas().style.cursor = 'pointer'
      const feature = e.features?.[0]
      if (!feature) return
      const hubId = feature.properties?.hubId ?? feature.properties?.id ?? ''
      const meta = hubMetaRef.current[hubId]
      if (!meta) return
      const coords = feature.geometry?.coordinates?.slice()
      if (!coords) return
      const container = document.createElement('div')
      container.addEventListener('mouseenter', () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
          hideTimeoutRef.current = null
        }
      })
      container.addEventListener('mouseleave', () => {
        hideTimeoutRef.current = setTimeout(() => {
          hideTimeoutRef.current = null
          unmountPopup()
          popup.remove()
        }, 100)
      })
      popupRootRef.current = renderPopupContent(container, meta, hubId)
      popup.setLngLat(coords).setDOMContent(container).addTo(map)
    })

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = ''
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null
        unmountPopup()
        popup.remove()
      }, 100)
    })

    addedRef.current = true

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      unmountPopup()
      popup.remove()
      popupRef.current = null
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch { /* ignore */ }
      addedRef.current = false
    }
  }, [map, pointsData, onRegionClick, id])

  return <HubPopupStyles />
}
