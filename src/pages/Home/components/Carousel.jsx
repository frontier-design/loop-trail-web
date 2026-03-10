import { useState } from 'react'
import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { GRID } from '../../../grid/config.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'

const COLORS = [
  { bg: 'var(--color-forest)', text: 'var(--color-lime)', number: 'var(--color-lime)' },
  { bg: 'var(--color-lime)', text: 'var(--color-forest)', number: 'var(--color-forest)' },
  { bg: 'var(--color-mint)', text: 'var(--color-forest)', number: 'var(--color-forest)' },
  { bg: 'var(--color-sky)', text: 'var(--color-lime)', number: 'var(--color-lime)' },
  { bg: 'var(--color-brick)', text: 'var(--color-lime)', number: 'var(--color-lime)' },
]

function getColor(index) {
  return COLORS[index % COLORS.length]
}

const Section = styled.section`
  width: 100%;
`

const SectionGrid = styled(Grid)`
  margin-bottom: 2rem;
  margin-top: 4rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-bottom: 2.5rem;
    margin-top: 2.5rem;
  }
`

const TitleHeading = styled.h2`
  color: black;
  font-size: 1.5rem !important;

  @media (min-width: 480px) {
    font-size: 2.5rem !important;
  }

  @media (min-width: 769px) {
    font-size: 4rem !important;
  }
`

const PanelWrapper = styled.div`
  width: 100%;
`

const PanelRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60vh;
  gap: 0;

  @media ${GRID.MEDIA_MOBILE} {
    flex-direction: column;
    height: auto;
    max-height: none;
    overflow: visible;
  }
`

const Panel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: ${p => p.$bg};
  color: ${p => p.$color};
  cursor: pointer;
  overflow: hidden;
  transition: flex 0.3s cubic-bezier(0, 1.118, 0.68, 1);
  flex: ${p => (p.$isActive ? '5 1 0%' : '0 0 auto')};
  width: ${p => (p.$isActive ? 'auto' : 'clamp(50px, 5vw, 80px)')};
  min-width: ${p => (p.$isActive ? '0' : 'clamp(50px, 5vw, 80px)')};

  @media ${GRID.MEDIA_MOBILE} {
    width: 100%;
    min-width: 100%;
    flex: ${p => (p.$isActive ? '0 0 auto' : '0 0 auto')};
    height: ${p => (p.$isActive ? '250px' : '3.5rem')};
    min-height: ${p => (p.$isActive ? '250px' : '3.5rem')};
    max-height: ${p => (p.$isActive ? '250px' : '3.5rem')};
    transition: height 0.3s cubic-bezier(0, 1.118, 0.68, 1),
                min-height 0.3s cubic-bezier(0, 1.118, 0.68, 1);
  }
`

const PanelNumber = styled.span`
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  color: ${p => p.$numColor};
  padding: 1.25rem;
  position: absolute;
  top: 0;
  left: ${p => (p.$isActive ? '0' : '50%')};
  transform: ${p => (p.$isActive ? 'none' : 'translateX(-50%)')};
  z-index: 2;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.25rem;
    padding: 1rem;
    left: 0;
    transform: none;
  }
`

const CollapsedLabel = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: ${p => (p.$isActive ? 'none' : 'flex')};
    align-items: center;
    position: absolute;
    top: 0;
    left: 2.75rem;
    height: 3.5rem;
    font-size: 1rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: calc(100% - 4rem);
  }
`

const ExpandedContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  opacity: ${p => (p.$isActive ? 1 : 0)};
  visibility: ${p => (p.$isActive ? 'visible' : 'hidden')};
  transform: scale(${p => (p.$isActive ? 1 : 0.92)});
  transform-origin: bottom left;
  transition: ${p =>
    p.$isActive
      ? 'opacity 0.2s cubic-bezier(0, 1.118, 0.68, 1) 0.2s, transform 0.2s cubic-bezier(0, 1.118, 0.68, 1) 0.2s'
      : 'opacity 0.06s cubic-bezier(0, 1.118, 0.68, 1), transform 0.06s cubic-bezier(0, 1.118, 0.68, 1)'};
  flex: 1;
  min-height: 0;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 3.25rem 1.25rem 1.5rem 1rem;
  }
`

const ContentTitle = styled.h3`
  font-size: 5rem;
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;
  max-width: 70%;
  hyphens: none;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: clamp(1.35rem, 5vw, 2.5rem);
    font-weight: 600;
    margin-bottom: 0.75rem;
    max-width: 100%;
  }
`

const ContentParagraph = styled.div`
  font-size: clamp(0.875rem, 1.25vw, 1.35rem);
  line-height: 1.4;
  max-width: 34em;

  p {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
  }

  p + p {
    margin-top: 0.75rem;
  }

  @media ${GRID.MEDIA_MOBILE} {
    font-size: clamp(0.875rem, 2.5vw, 1rem);
  }
`

const FALLBACK_ITEMS = [
  { Title: 'Healthier ways to travel and explore', Paragraph: 'The Loop will be the healthiest way to explore Toronto: outdoors, in nature, being active and with friends and family.' },
  { Title: 'New neighbours and friends', Paragraph: 'By bringing together disconnected trail fragments into one beautiful trail, the Loop will connect neighbourhoods with each other and with our city\'s greatest natural assets.' },
  { Title: 'Improved access to nature', Paragraph: 'The Loop will create new accessible entry points to the city\'s most beautiful natural assets. No matter where you live in Toronto you will be able to experience the joy and calm of nature.' },
  { Title: 'A boost for the local economy', Paragraph: 'The Loop will breathe new life into every corner of the city, making it easier for us to explore new neighbourhoods and support local businesses.' },
  { Title: 'Protections for Toronto\'s natural beauty', Paragraph: 'By working closely with local communities and Indigenous partners, the Loop will be built to carefully steward the land, protect native plants and animals and ensure the city\'s natural environment is preserved for future generations.' },
]

function Carousel({ items, sectionTitle }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const displayItems = items && items.length > 0 ? items : FALLBACK_ITEMS
  const title = sectionTitle ?? `${displayItems.length} ways the Loop will transform Toronto:`

  return (
    <Section>
      <SectionGrid as="div">
        <GridCell $start={1} $span={3} $spanMobile={4}>
          <TitleHeading>{title}</TitleHeading>
        </GridCell>
        <GridCell $start={1} $span={6} $spanMobile={4}>
          <PanelWrapper>
        <PanelRow role="tablist">
          {displayItems.map((item, i) => {
            const color = getColor(i)
            const isActive = i === activeIndex
            const itemTitle = item.Title ?? item.title ?? ''
            const paragraph = item.Paragraph ?? item.paragraph

            return (
              <Panel
                key={item.id ?? i}
                $bg={color.bg}
                $color={color.text}
                $isActive={isActive}
                role="tab"
                aria-selected={isActive}
                aria-expanded={isActive}
                tabIndex={0}
                onClick={() => setActiveIndex(i)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveIndex(i)
                  }
                }}
              >
                <PanelNumber $numColor={color.number} $isActive={isActive}>{i + 1}</PanelNumber>
                <CollapsedLabel $isActive={isActive}>{itemTitle}</CollapsedLabel>
                <ExpandedContent $isActive={isActive}>
                  {itemTitle && <ContentTitle>{itemTitle}</ContentTitle>}
                  {paragraph && (
                    <ContentParagraph>
                      {renderStrapiRichText(paragraph)}
                    </ContentParagraph>
                  )}
                </ExpandedContent>
              </Panel>
            )
          })}
        </PanelRow>
          </PanelWrapper>
        </GridCell>
      </SectionGrid>
    </Section>
  )
}

export default Carousel
