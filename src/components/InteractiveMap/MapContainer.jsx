import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

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

function MapContainer({ children, onMapLoad, mapStyle: mapStyleProp, minZoom = DEFAULT_MIN_ZOOM, maxBounds = TORONTO_BOUNDS, fitBoundsOnMobile = null }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const mapLoadedRef = useRef(false)
  const isInitializingRef = useRef(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)

  const mapStyle = mapStyleProp || defaultVectorStyle

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

            if (layer.type === 'fill') {
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

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#F5F5F1',
      }}
    >
      {children && mapReady && mapInstance ? children(mapInstance) : null}
    </div>
  )
}

export default MapContainer
