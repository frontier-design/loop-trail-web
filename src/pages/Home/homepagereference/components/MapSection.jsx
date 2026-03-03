import { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { GRID } from '../../../grid/config.js'
import { Grid, GridCell } from '../../../grid/index.js'
import stackImage1 from '../../../assets/images/black-creek.png'
import mountDennisImage from '../../../assets/images/mount-dennis.jpg'
import lowerDonImage from '../../../assets/images/lower-don.jpg'
import donValleyImage from '../../../assets/images/don-valley.png'
import donMillsImage from '../../../assets/images/don-mills.png'
import MapContainer from '../../../components/MapContainer'
import GeoJSONLineLayer from '../../../components/GeoJSONLineLayer'
import TTCSubwayLayer from '../../../components/TTCSubwayLayer'
import HubRegionsLayer from '../../../components/HubRegionsLayer'
import MapLegend from '../../../components/MapLegend'
import Hub from './Hub'
import trailData from '../../../data/torontoTrailLoop.json'
import ttcSubwayData from '../../../data/ttcSubwayLines.json'
import hubRegionsData from '../../../data/hubRegions.json'
import landmarksData from '../../../data/landmarks.json'

const Section = styled.section`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: visible;
`

const MapIntroBlock = styled.div`
  width: 100%;
  padding: clamp(13rem, 6vw, 15rem) 0 clamp(2rem, 4vw, 3rem);
  background: #f5f4f0;
`

const MapIntroTitle = styled.h2`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #1a1a1a;
  margin: 0 0 0.5em 0;
`

const MapIntroParagraph = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  line-height: 1.4;
  color: #333;
  margin: 0;
  max-width: 32em;
`

const SectionRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 100vh;

  @media (max-width: ${GRID.BREAKPOINT}) {
    flex-direction: column;
  }
`

const ContentColumn = styled.div`
  flex: 0 0 38%;
  display: flex;
  flex-direction: column;

  @media (max-width: ${GRID.BREAKPOINT}) {
    flex: 1 1 auto;
    padding: 2rem ${GRID.PADDING_MOBILE}px;
  }
`

const MapColumn = styled.aside`
  flex: 1 1 62%;
  flex-shrink: 0;
  align-self: stretch;
  min-height: 100vh;

  @media (max-width: ${GRID.BREAKPOINT}) {
    flex: 0 0 auto;
    align-self: auto;
    min-height: 60vh;
    height: 60vh;
  }
`

const MapSticky = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  background: #e8e8e8;

  @media (max-width: ${GRID.BREAKPOINT}) {
    position: relative;
    height: 100%;
    min-height: 320px;
  }
`

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: 0.875rem;
`

const ContentBlock = styled.div`
  padding: ${props => props.$imageOnly ? 0 : '3rem'};
  background: ${props => props.$bgColor};
  color: ${props => props.$textColor};
`

const BlockTitle = styled.h2`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 0.5em 0;
  /* text-transform: uppercase; */
  color: inherit;

  span {
    display: block;
  }
`

const BlockParagraph = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(1.1rem, 1.75vw, 1.2rem);
  line-height: 1.4;
  margin: 0 0 1em 0;
  color: inherit;
  opacity: 0.95;

  &:last-child {
    margin-bottom: 0;
  }
`

const BlockLink = styled.a`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: clamp(1.05rem, 1.75vw, 1.35rem);
  font-weight: 700;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
`

const BlockList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`

const BlockListItem = styled.li`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
  color: inherit;

  a, span {
    color: inherit;
    text-decoration: none;
    transition: text-decoration 0.2s ease;
  }

  a:hover, span:hover {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  a {
    cursor: pointer;
  }

  span {
    cursor: pointer;
  }
`

const HubWrapper = styled.div`
  /* Wrapper for hub blocks to enable scroll targeting and intersection observing */
`

const CONTENT_BLOCKS = [
  {
    title: ['Over', '80Km'],
    paragraph: 'of new and existing trails',
    link: null,
    bgColor: 'var(--color-brick)',
    textColor: 'var(--color-lime)',
  },
  {
    type: 'hub',
    hubId: 'black-creek',
    image: stackImage1,
    imageAlt: 'Trail landscape',
    title: ['Black Creek'],
    paragraph: 'Found at the north end of the project, this section of the trail is bisected by the Finch Corridor section of the Loop Trail, and services the Black Creek neighbourhood.',
    link: { text: 'Learn more about the Black Creek Hub', href: '#black-creek' },
    bgColor: 'var(--color-sky)',
    textColor: 'var(--color-forest)',
  },
  {
    title: ['17'],
    paragraph: 'neighbourhood Improvement Areas will be connected by the Loop',
    bgColor: 'var(--color-lime)',
    textColor: 'var(--color-forest)',
  },
  {
    type: 'hub',
    hubId: 'mount-dennis',
    image: mountDennisImage,
    imageAlt: 'Trail landscape',
    title: ['Mount Dennis'],
    paragraph: 'In the North West, the Mount Dennis hub will be at the heart of the diverse Weston Mount Dennis communities.',
    link: { text: 'Learn more about the Mount Dennis Hub', href: '#mount-dennis' },
    bgColor: 'var(--color-mint)',
    textColor: 'var(--color-forest)',
  },
  {
    title: ['17'],
    paragraph: 'neighbourhood Improvement Areas will be connected by the Loop',
    bgColor: 'var(--color-forest)',
    textColor: 'var(--color-lime)',
  },
  {
    type: 'hub',
    hubId: 'lower-don',
    image: lowerDonImage,
    imageAlt: 'Trail landscape',
    title: ['Lower Don'],
    paragraph: 'This hub will be the connection point to the Martin Goodman trail along the lakefront and will be at the core of the new Portlands neighbourhood.',
    link: { text: 'Learn more about the Lower Don Hub', href: '#lower-don' },
    bgColor: 'var(--color-sky)',
    textColor: 'var(--color-forest)',
  },
  {
    title: ['12+'],
    paragraph: 'neighbourhoods transformed through this city-wide project',
    bgColor: 'var(--color-lime)',
    textColor: 'var(--color-forest)',
  },
  {
    type: 'hub',
    hubId: 'don-valley',
    image: donValleyImage,
    imageAlt: 'Trail landscape',
    title: ['Don Valley'],
    paragraph: 'Found at the north end of the project, this section of the trail is bisected by the Finch Corridor section of the Loop Trail, and services the Black Creek neighbourhood.',
    link: { text: 'Learn more about the Don Valley Hub', href: '#don-valley' },
    bgColor: 'var(--color-brick)',
    textColor: 'var(--color-lime)',
  },
  {
    type: 'list',
    title: ['Connecting Landmarks'],
    items: [
      'CN Tower',
      'Casa Loma',
      'Nathan Phillips Square',
      'Old City Hall',
      'Union Station',
      'Royal Ontario Museum (ROM)',
      'Art Gallery of Ontario (AGO)',
      "Ripley's Aquarium of Canada",
      'St. Lawrence Market',
      'Rogers Centre',
    ],
    bgColor: 'var(--color-forest)',
    textColor: 'var(--color-lime)',
  },
  {
    type: 'hub',
    hubId: 'don-mills',
    image: donMillsImage,
    imageAlt: 'Trail landscape',
    title: ['Don Mills'],
    paragraph: 'Anchored by Edwards Gardens and the Toronto Botanical Gardens, this hub will focus on conservation and connection to nature. ',
    link: { text: 'Learn more about the Don Mills Hub', href: '#don-mills' },
    bgColor: 'var(--color-lime)',
    textColor: 'var(--color-forest)',
  },
  {
    title: ['Dive Deeper'],
    link: { text: 'Explore Detailed Local Maps', href: '#don-mills' },
    bgColor: 'var(--color-sky)',
    textColor: 'var(--color-forest)',
  },
]

function pickRandomLandmarkIds(landmarks, count = 2) {
  if (!landmarks?.length) return []
  const shuffled = [...landmarks].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, landmarks.length)).map((l) => l.id)
}

function MapSection() {
  const [activeHubId, setActiveHubId] = useState(null)
  const [listHoverScaledLandmarkIds, setListHoverScaledLandmarkIds] = useState([])
  const hubRefs = useRef({})

  // Track intersection ratio per hub so we can require "fully in" to activate and "mostly out" to deactivate
  const hubRatiosRef = useRef({})

  // Intersection Observer: pin turns red only when hub has fully entered the viewport,
  // and turns off when the hub has mostly left, so there are moments with no active pin
  useEffect(() => {
    const hubBlocks = CONTENT_BLOCKS.filter((b) => b.type === 'hub')
    const elements = hubBlocks
      .map((b) => hubRefs.current[b.hubId])
      .filter(Boolean)

    if (elements.length === 0) return

    const FULLY_IN = 0.95   // hub must be at least 95% in view to activate pin
    const MOSTLY_OUT = 0.4 // when active hub drops below 40% in view (60% out of viewport), deactivate

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const hubId = entry.target.id.replace('hub-', '')
          hubRatiosRef.current[hubId] = entry.intersectionRatio
        })

        const ratios = hubRatiosRef.current
        const fullyInHubs = hubBlocks.filter((b) => (ratios[b.hubId] ?? 0) >= FULLY_IN)
        const bestFullyIn = fullyInHubs.length
          ? fullyInHubs.reduce((best, b) =>
              (ratios[b.hubId] ?? 0) > (ratios[best.hubId] ?? 0) ? b : best
            )
          : null

        setActiveHubId((prev) => {
          if (bestFullyIn) return bestFullyIn.hubId
          const currentRatio = prev ? (ratios[prev] ?? 0) : 0
          if (currentRatio < MOSTLY_OUT) return null
          return prev
        })
      },
      {
        root: null,
        threshold: [0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1],
        rootMargin: '0px',
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  // Handle click on map hub pin -> scroll to hub in left panel
  const handleHubMarkerClick = useCallback((hub) => {
    const el = document.getElementById(`hub-${hub.id}`)
    if (el) {
      window.dispatchEvent(new CustomEvent('hub-scroll-start'))
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Allow nav to treat scroll as user-driven again after smooth scroll likely finished
      const t = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('hub-scroll-end'))
        clearTimeout(t)
      }, 1200)
    }
  }, [])

  return (
    <Section>
      <MapIntroBlock>
        <Grid as="div">
          <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
            <MapIntroTitle>Discover the Loop</MapIntroTitle>
            <MapIntroParagraph>
              Discover how the Loop will breathe life into the city and connect us in brand new ways.
            </MapIntroParagraph>
          </GridCell>
        </Grid>
      </MapIntroBlock>
      <SectionRow>
      <ContentColumn>
        {CONTENT_BLOCKS.map((block, i) => {
          if (block.type === 'hub') {
            return (
              <HubWrapper
                key={i}
                id={`hub-${block.hubId}`}
                ref={(el) => {
                  hubRefs.current[block.hubId] = el
                }}
              >
                <Hub
                  image={block.image}
                  imageAlt={block.imageAlt}
                  title={block.title}
                  paragraph={block.paragraph}
                  link={block.link}
                  bgColor={block.bgColor}
                  textColor={block.textColor}
                />
              </HubWrapper>
            )
          }
          if (block.type === 'list') {
            return (
              <ContentBlock key={i} $bgColor={block.bgColor} $textColor={block.textColor}>
                <BlockTitle>
                  {block.title.map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </BlockTitle>
                <BlockList>
                  {block.items.map((item, j) => (
                    <BlockListItem
                      key={j}
                      onMouseEnter={() =>
                        setListHoverScaledLandmarkIds(
                          pickRandomLandmarkIds(landmarksData.landmarks, 2)
                        )
                      }
                      onMouseLeave={() => setListHoverScaledLandmarkIds([])}
                    >
                      {typeof item === 'string' ? (
                        <span>{item}</span>
                      ) : (
                        <a href={item.href || '#'}>{item.label}</a>
                      )}
                    </BlockListItem>
                  ))}
                </BlockList>
              </ContentBlock>
            )
          }
          return (
            <ContentBlock key={i} $bgColor={block.bgColor} $textColor={block.textColor}>
              <BlockTitle>
                {block.title.map((line, j) => (
                  <span key={j}>{line}</span>
                ))}
              </BlockTitle>
              <BlockParagraph>{block.paragraph}</BlockParagraph>
              {block.link && (
                <BlockLink href={block.link.href}>
                  {block.link.text} →
                </BlockLink>
              )}
            </ContentBlock>
          )
        })}
      </ContentColumn>
      <MapColumn>
        <MapSticky>
          <MapContainer>
            {(map) => (
              <>
                <GeoJSONLineLayer
                  map={map}
                  data={trailData}
                  lineColor="#00A86B"
                  lineWidth={8}
                  lineOpacity={1}
                />
                <HubRegionsLayer
                  map={map}
                  regionsData={hubRegionsData}
                  highlightedHubId={activeHubId}
                  onRegionClick={handleHubMarkerClick}
                />
                <TTCSubwayLayer
                  map={map}
                  data={ttcSubwayData}
                  lineWidth={4}
                  lineOpacity={1}
                />
                <MapLegend />
              </>
            )}
          </MapContainer>
        </MapSticky>
      </MapColumn>
      </SectionRow>
    </Section>
  )
}

export default MapSection
