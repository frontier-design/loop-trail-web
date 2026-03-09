import { useEffect, useRef, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import * as maplibregl from 'maplibre-gl'
import { hubPointsClosestToLoop } from './hubPointsFromRegions.js'
import HubPopupContent from './HubPopupContent.jsx'

const FADE_DURATION_MS = 180

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

    map.addLayer({
      id: layerId,
      type: 'circle',
      source: sourceId,
      paint: {
        'circle-radius': 80,
        'circle-color': '#66D575',
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
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId)
        if (map.getSource(sourceId)) map.removeSource(sourceId)
      } catch { /* ignore */ }
      addedRef.current = false
    }
  }, [map, pointsData, onRegionClick, id])

  return <HubPopupStyles />
}
