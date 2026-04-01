import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'

const defaultVectorStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'

const TORONTO_BOUNDS = [
  [-79.95, 43.4],
  [-78.85, 43.95],
]

const TORONTO_CENTER = [-79.5289, 43.7075]
const DEFAULT_ZOOM = 11.08
const DEFAULT_MIN_ZOOM = 10
const MAX_ZOOM = 18
const MOBILE_BREAKPOINT = 950


function MapContainer({
  children,
  onMapLoad,
  mapStyle: mapStyleProp,
  minZoom = DEFAULT_MIN_ZOOM,
  maxBounds = TORONTO_BOUNDS,
  fitBoundsOnMobile = null,
  mobileTapToInteract = false,
}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const mapLoadedRef = useRef(false)
  const isInitializingRef = useRef(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isInteractionEnabled, setIsInteractionEnabled] = useState(false)

  const mapStyle = mapStyleProp || defaultVectorStyle

  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  const interactionEnabled = mobileTapToInteract
    ? (isMobile ? isInteractionEnabled : true)
    : true

  useEffect(() => {
    const id = 'maplibre-gl-css'
    if (!document.getElementById(id)) {
      const link = document.createElement('link')
      link.id = id
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css'
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    if (map.current || isInitializingRef.current) return
    if (!mapContainer.current) return

    isInitializingRef.current = true

    const instance = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: TORONTO_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom,
      maxZoom: MAX_ZOOM,
      maxBounds: maxBounds ?? undefined,
      fadeDuration: 0,
      attributionControl: false,
      scrollZoom: false,
    })

    map.current = instance

    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')

    const handleLoad = () => {
      if (!mapLoadedRef.current) {
        mapLoadedRef.current = true

        const mapBg = '#F5F5F1'
        const allLayers = instance.getStyle().layers
        const roadGray = '#E2E2E2'

        let backgroundLayerId = null
        allLayers.forEach((layer) => {
          if (layer.type === 'background') backgroundLayerId = layer.id
        })

        if (!backgroundLayerId) {
          instance.addLayer({
            id: 'background-layer',
            type: 'background',
            paint: { 'background-color': mapBg },
          })
        } else {
          try {
            instance.setPaintProperty(backgroundLayerId, 'background-color', mapBg)
          } catch {
            // ignore
          }
        }

        allLayers.forEach((layer) => {
          try {
            const layerName = layer.id.toLowerCase()
            const isBuilding = layerName.includes('building') || layerName.includes('extrusion')
            const isPlaceLayer = layer.type === 'symbol' && layer['source-layer'] === 'place'

            if (isPlaceLayer) {
              const base = layer.filter ? [...layer.filter] : ['all']
              base.push(['!=', 'name', 'Toronto'], ['!=', 'name', 'Vaughan'])
              base.push(['!=', 'name_en', 'Toronto'], ['!=', 'name_en', 'Vaughan'])
              instance.setFilter(layer.id, base)
            } else if (layer.type === 'fill') {
              const isWater = layerName.includes('water')
              if (isWater) {
                instance.setPaintProperty(layer.id, 'fill-color', '#d7e4ed')
              } else {
                instance.setPaintProperty(layer.id, 'fill-color', mapBg)
              }
              if (isBuilding) {
                instance.setPaintProperty(layer.id, 'fill-opacity', [
                  'interpolate', ['linear'], ['zoom'],
                  11, 0, 13, 0, 14, 1, 15, 1,
                ])
                try {
                  instance.setPaintProperty(layer.id, 'fill-outline-opacity', [
                    'interpolate', ['linear'], ['zoom'],
                    11, 0, 13, 0, 14, 1, 15, 1,
                  ])
                } catch { /* ignore */ }
              } else {
                instance.setPaintProperty(layer.id, 'fill-opacity', 1)
              }
              try {
                instance.setPaintProperty(layer.id, 'fill-outline-color', roadGray)
              } catch { /* ignore */ }
            } else if (layer.type === 'fill-extrusion') {
              instance.setPaintProperty(layer.id, 'fill-extrusion-color', mapBg)
              instance.setPaintProperty(layer.id, 'fill-extrusion-opacity', [
                'interpolate', ['linear'], ['zoom'],
                11, 0, 13, 0, 14, 1, 15, 1,
              ])
            } else if (layer.type === 'line') {
              instance.setPaintProperty(layer.id, 'line-color', roadGray)
              const isHighway = layerName.includes('highway') || layerName.includes('motorway') || layerName.includes('trunk')
              if (isHighway) {
                instance.setPaintProperty(layer.id, 'line-width', 2)
              }
            }
          } catch { /* ignore */ }
        })

        setMapInstance(instance)
        setMapReady(true)

        if (fitBoundsOnMobile && window.innerWidth <= MOBILE_BREAKPOINT) {
          const [minLng, minLat, maxLng, maxLat] = fitBoundsOnMobile
          instance.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 24, maxZoom: 14 })
        }

        if (onMapLoad && map.current === instance) {
          onMapLoad(instance)
        }
      }
    }

    instance.on('load', handleLoad)
    instance.on('error', (e) => console.error('Map error:', e))

    return () => {
      if (instance) {
        try { instance.remove() } catch { /* ignore */ }
        map.current = null
        mapLoadedRef.current = false
        isInitializingRef.current = false
        setMapReady(false)
        setMapInstance(null)
      }
    }
  }, [onMapLoad, mapStyle, minZoom, maxBounds, fitBoundsOnMobile])

  useEffect(() => {
    if (!mapInstance) return
    const shouldLock = mobileTapToInteract && isMobile && !interactionEnabled

    if (shouldLock) {
      mapInstance.dragPan.disable()
      mapInstance.touchZoomRotate.disable()
      mapInstance.doubleClickZoom.disable()
    } else {
      mapInstance.dragPan.enable()
      mapInstance.touchZoomRotate.enable()
      mapInstance.doubleClickZoom.enable()
    }
  }, [mapInstance, isMobile, interactionEnabled, mobileTapToInteract])

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#F5F5F1',
        display: 'block',
      }}
    >
      {mobileTapToInteract && isMobile && !interactionEnabled ? (
        <button
          type="button"
          onClick={() => setIsInteractionEnabled(true)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            border: 0,
            margin: 0,
            padding: '1rem',
            cursor: 'pointer',
            color: '#fff',
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.08) 45%, transparent 70%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            touchAction: 'pan-y',
            fontFamily: 'ABCDiatype, system-ui, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 700,
            lineHeight: 1.2,
          }}
          aria-label="Enable map interaction"
        >
          Tap to interact with map
        </button>
      ) : null}

      {mobileTapToInteract && isMobile && interactionEnabled ? (
        <button
          type="button"
          onClick={() => setIsInteractionEnabled(false)}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            zIndex: 21,
            border: 0,
            padding: '0.5rem 0.9rem',
            cursor: 'pointer',
            color: '#fff',
            background: 'rgba(0, 0, 0, 0.7)',
            fontFamily: 'ABCDiatype, system-ui, sans-serif',
            fontSize: '0.85rem',
            fontWeight: 700,
            lineHeight: 1,
          }}
          aria-label="Disable map interaction"
        >
          Done
        </button>
      ) : null}

      {children && mapReady && mapInstance ? children(mapInstance) : null}
    </div>
  )
}

export default MapContainer
