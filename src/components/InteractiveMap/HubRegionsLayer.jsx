import { useEffect, useRef, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import * as maplibregl from 'maplibre-gl'
import { hubPointsClosestToLoop, hubPointsCentroids } from './hubPointsFromRegions.js'
import HubPopupContent from './HubPopupContent.jsx'

const FADE_DURATION_MS = 180

const RING_DURATION = 2.4
const RING_START_SIZE = 8
const RING_MAX_SIZE = 60
const RING_STROKE = 3
const HUB_COLOR = '#5abe67'

const HubPopupStyles = createGlobalStyle`
  @keyframes hubPopupFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes hubPopupFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  .hub-map-popup .maplibregl-popup-content {
    background: transparent;
    padding: 0;
    box-shadow: none;
    animation: hubPopupFadeIn ${FADE_DURATION_MS}ms ease-out forwards;
  }
  .hub-map-popup.hub-map-popup--closing .maplibregl-popup-content {
    animation: hubPopupFadeOut ${FADE_DURATION_MS}ms ease-in forwards;
  }
  .hub-map-popup .maplibregl-popup-tip {
    display: none;
  }

  @keyframes hubRingExpand {
    0% {
      width: ${RING_START_SIZE}px;
      height: ${RING_START_SIZE}px;
      margin-left: -${RING_START_SIZE / 2}px;
      margin-top: -${RING_START_SIZE / 2}px;
      opacity: 1;
    }
    60% {
      opacity: 0.6;
    }
    100% {
      width: ${RING_MAX_SIZE}px;
      height: ${RING_MAX_SIZE}px;
      margin-left: -${RING_MAX_SIZE / 2}px;
      margin-top: -${RING_MAX_SIZE / 2}px;
      opacity: 0;
    }
  }

  .hub-ring-marker {
    pointer-events: none;
    width: 0;
    height: 0;
    position: relative;
    overflow: visible;
  }
  .hub-ring-marker__container {
    position: absolute;
    left: 0;
    top: 0;
    width: ${RING_MAX_SIZE * 2}px;
    height: ${RING_MAX_SIZE * 2}px;
    transform: translate(-50%, -50%);
  }
  .hub-ring-marker__ring {
    position: absolute;
    left: 50%;
    top: 50%;
    border: ${RING_STROKE}px solid ${HUB_COLOR};
    border-radius: 50%;
    background: transparent;
    animation: hubRingExpand ${RING_DURATION}s ease-out infinite;
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
  const dotMarkersRef = useRef([])

  useEffect(() => {
    hubMetaRef.current = hubMeta
  }, [hubMeta])

  const pointsData = useMemo(() => {
    if (!regionsData || !trailData) return null
    return hubPointsClosestToLoop(regionsData, trailData)
  }, [regionsData, trailData])

  const centroidData = useMemo(() => {
    if (!regionsData) return null
    return hubPointsCentroids(regionsData)
  }, [regionsData])

  useEffect(() => {
    if (!map || !pointsData || !centroidData || addedRef.current) return
    if (!pointsData.features || pointsData.features.length === 0) return

    const sourceId = `${id}-source`
    const centroidSourceId = `${id}-centroid-source`
    const layerId = `${id}-layer`

    function createPopup(hubId) {
      const id = String(hubId || '').toLowerCase()
      const isLowerDon = id === 'lower-don'
      const offset = isLowerDon
        ? { 'bottom-right': [30, 40] }
        : id === 'don-valley'
          ? [0, 60]
          : id === 'black-creek'
            ? [0, 45]
            : [0, 25]
      return new maplibregl.Popup({
        className: 'hub-map-popup',
        anchor: isLowerDon ? 'bottom-right' : 'center',
        offset,
        closeButton: false,
        closeOnClick: false,
        maxWidth: 'none',
      })
    }

    map.addSource(sourceId, {
      type: 'geojson',
      data: pointsData,
    })

    map.addSource(centroidSourceId, {
      type: 'geojson',
      data: centroidData,
    })

    map.addLayer({
      id: layerId,
      type: 'circle',
      source: centroidSourceId,
      paint: {
        'circle-radius': 80,
        'circle-color': '#66D575',
        'circle-opacity': 0.5,
        'circle-blur': 0.6,
      },
    })

    const dotMarkers = []
    centroidData.features.forEach((feature, idx) => {
      const coords = feature.geometry?.coordinates
      if (!coords || coords.length < 2) return
      const el = document.createElement('div')
      el.className = 'hub-ring-marker'
      const container = document.createElement('div')
      container.className = 'hub-ring-marker__container'
      const ring = document.createElement('span')
      ring.className = 'hub-ring-marker__ring'
      ring.style.animationDelay = `${idx * 0.6}s`
      container.appendChild(ring)
      el.appendChild(container)
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords)
        .addTo(map)
      dotMarkers.push(marker)
    })
    dotMarkersRef.current = dotMarkers

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

    function removePopupWithFade(popup, onDone) {
      const el = popup?.getElement?.()
      if (!el || !el.classList) {
        if (onDone) onDone()
        return
      }
      el.classList.add('hub-map-popup--closing')
      setTimeout(() => {
        popup.remove()
        if (onDone) onDone()
      }, FADE_DURATION_MS)
    }

    const hideDelayMs = 200

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

      const prevPopup = popupRef.current
      const prevHubId = prevPopup ? (prevPopup._hubId ?? '') : ''
      const isSameHub = prevHubId && String(hubId).toLowerCase() === String(prevHubId).toLowerCase()

      if (prevPopup && !isSameHub) {
        prevPopup.remove()
        popupRef.current = null
      }
      if (!isSameHub) unmountPopup()

      const doShow = () => {
        const thisPopup = createPopup(hubId)
        thisPopup._hubId = hubId
        popupRef.current = thisPopup

        const container = document.createElement('div')
        container.style.paddingTop = '8px'
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
            removePopupWithFade(thisPopup, () => {
              if (popupRef.current === thisPopup) popupRef.current = null
            })
          }, hideDelayMs)
        })

        popupRootRef.current = renderPopupContent(container, meta, hubId)
        thisPopup.setLngLat(coords).setDOMContent(container).addTo(map)
      }

      if (isSameHub && prevPopup) {
        return
      }
      doShow()
    })

    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = ''
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null
        unmountPopup()
        const p = popupRef.current
        if (p) {
          removePopupWithFade(p, () => { popupRef.current = null })
        }
      }, hideDelayMs)
    })

    addedRef.current = true

    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      unmountPopup()
      const p = popupRef.current
      if (p) p.remove()
      popupRef.current = null
      dotMarkersRef.current.forEach((m) => {
        try { m.remove() } catch { /* ignore */ }
      })
      dotMarkersRef.current = []
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(centroidSourceId)) map.removeSource(centroidSourceId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch { /* ignore */ }
      addedRef.current = false
    }
  }, [map, pointsData, centroidData, onRegionClick, id])

  return <HubPopupStyles />
}
