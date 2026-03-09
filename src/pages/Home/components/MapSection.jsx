import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { GRID } from '../../../grid/config.js'
import { Grid, GridCell } from '../../../grid/index.js'
import {
  MapContainer,
  GeoJSONLineLayer,
  TTCSubwayLayer,
  HubRegionsLayer,
} from '../../../components/InteractiveMap/index.js'
import { CardLink } from '../../../styles/cardContent.js'
import { fetchCached } from '../../../api/prefetchCache.js'
import { getStrapiUrl } from '../../../api/strapi.js'
import { getGeoJSONBbox } from '../../../utils/geojsonBbox.js'
import trailData from '../../../data/loopTrailData.js'
import ttcSubwayData from '../../../data/ttcSubwayLines.json'
import hubRegionsData from '../../../data/hubRegions.json'

const trailBbox = getGeoJSONBbox(trailData)

const HUBS_API =
  '/api/hubs?populate[0]=Hero&populate[1]=HubItem&populate[2]=HubItem.Image&populate[3]=HubItem.Link'

function toSlug(title) {
  if (!title || typeof title !== 'string') return ''
  return title.toLowerCase().replace(/\s+/g, '-').trim()
}

function getMediaUrl(media) {
  if (!media) return null
  const url = media?.url ?? media?.attributes?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function normalizeMediaList(imageField) {
  if (!imageField) return []
  if (Array.isArray(imageField)) return imageField
  if (imageField?.data != null) {
    const d = imageField.data
    return Array.isArray(d) ? d : [d]
  }
  return []
}

function getPlainText(content) {
  if (!content) return ''
  if (typeof content === 'string') return content.replace(/<[^>]*>/g, '').trim()
  if (Array.isArray(content)) {
    return content
      .map((b) => (Array.isArray(b?.children) ? b.children.map((c) => c?.text ?? '').join('') : ''))
      .filter(Boolean)
      .join(' ')
      .slice(0, 200)
  }
  return ''
}

/* ── Desktop: overlay layout ── */
const DesktopSection = styled.section`
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;

  @media ${GRID.MEDIA_MOBILE} {
    display: none;
  }
`

const DesktopMapWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`

const DesktopGrid = styled(Grid)`
  position: relative;
  z-index: 1;
  align-items: center;
  min-height: 100vh;
  padding-top: clamp(2rem, 4vw, 3rem);
  padding-bottom: clamp(2rem, 4vw, 3rem);
  pointer-events: none;
`

const DesktopIntroBlock = styled(GridCell)`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  background: var(--color-forest);
  color: var(--color-lime);
  width: fit-content;
  align-self: center;
  pointer-events: auto;
  min-height: 85vh;
  justify-content: space-between;
`

/* ── Mobile: two stacked blocks ── */
const MobileSection = styled.section`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: block;
    width: 100%;
  }
`

const MobileInfoBlock = styled.div`
  width: 100%;
  background: var(--color-forest);
  color: var(--color-lime);
  padding: 2rem ${GRID.PADDING_MOBILE}px;
`

const MobileMapBlock = styled.div`
  width: 100%;
  height: 60vh;
`

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const IntroTitle = styled.h2`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  color: var(--color-lime);
  margin: 0 0 0.35em 0;
`

const IntroParagraph = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  line-height: 1.45;
  color: var(--color-lime);
  margin: 0 0 0.75em 0;
  max-width: 24em;
`

const SidebarLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  color: var(--color-lime);
`

const LegendIconSolid = styled.span`
  display: inline-block;
  width: 24px;
  height: 4px;
  background: var(--color-lime);
  flex-shrink: 0;
`

const LegendIconDashed = styled.span`
  display: inline-block;
  width: 24px;
  height: 4px;
  border-top: 3px dashed var(--color-lime);
  flex-shrink: 0;
`

function MapSection() {
  const [hubMeta, setHubMeta] = useState({})

  useEffect(() => {
    let cancelled = false
    fetchCached(HUBS_API)
      .then((res) => {
        if (cancelled) return
        const page = res?.data ?? res
        const items = Array.isArray(page?.HubItem) ? page.HubItem : []
        const meta = {}
        items.forEach((item) => {
          const title = item?.Title ?? ''
          const slug = toSlug(title)
          if (!slug) return
          const images = normalizeMediaList(item?.Image)
          const first = images[0]
          const imageUrl = first ? getMediaUrl(first) : null
          const description = getPlainText(item?.Paragraph ?? '')
          meta[slug] = { title, imageUrl, description }
        })
        setHubMeta(meta)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const mapLayers = (map) => (
    <>
      <GeoJSONLineLayer
        map={map}
        data={trailData}
        lineColor="#154C44"
        lineWidth={8}
        lineOpacity={1}
      />
      <HubRegionsLayer
        map={map}
        regionsData={hubRegionsData}
        trailData={trailData}
        hubMeta={hubMeta}
      />
      <TTCSubwayLayer
        map={map}
        data={ttcSubwayData}
        lineWidth={4}
        lineOpacity={1}
      />
    </>
  )

  const introContent = (
    <>
      <TopSection>
        <IntroTitle>Explore the Loop</IntroTitle>
        <IntroParagraph>
          Dive deeper into the Loop Trail&apos;s route, features, and connections through our
          detailed interactive maps.
        </IntroParagraph>
        <CardLink as={Link} to="/maps">Explore More →</CardLink>
      </TopSection>
      <BottomSection>
        <SidebarLegend>
          <LegendItem>
            <LegendIconSolid aria-hidden />
            <span>Loop Trail</span>
          </LegendItem>
          <LegendItem>
            <LegendIconDashed aria-hidden />
            <span>TTC Lines</span>
          </LegendItem>
        </SidebarLegend>
      </BottomSection>
    </>
  )

  return (
    <>
      {/* Desktop: map behind, intro overlaid */}
      <DesktopSection>
        <DesktopMapWrapper>
          <MapContainer>{mapLayers}</MapContainer>
        </DesktopMapWrapper>
        <DesktopGrid as="div">
          <DesktopIntroBlock $start={1} $span={2}>
            {introContent}
          </DesktopIntroBlock>
        </DesktopGrid>
      </DesktopSection>

      {/* Mobile: two normal stacked divs */}
      <MobileSection>
        <MobileInfoBlock>
          {introContent}
        </MobileInfoBlock>
        <MobileMapBlock>
          <MapContainer fitBoundsOnMobile={trailBbox}>{mapLayers}</MapContainer>
        </MobileMapBlock>
      </MobileSection>
    </>
  )
}

export default MapSection
