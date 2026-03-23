import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { GRID } from '../../../grid/config.js'

/*
 * 6-column grid — one column per year (2024–2029), right edge = 2030.
 * Column borders double as vertical timeline lines.
 *
 * Phase 1:  Co-Design & Project Development → cols 1–2
 * Phase 2:  Activation & Public Engagement  → cols 3–5
 * Phase 3:  Full-Scale Project Execution    → cols 5–6
 * Ongoing:  full width                      → cols 1–6
 */

const PHASES = [
  {
    name: 'Co-Design & Project Development',
    range: 'Winter 2024 – Spring 2026',
    bg: 'var(--color-forest)',
    color: 'white',
    colStart: 1,
    colEnd: 3,
    mobileCol: 1,
  },
  {
    name: 'Activation & Public Engagement',
    range: 'Summer 2026 – Fall 2028',
    bg: 'var(--color-mint)',
    color: 'var(--color-forest)',
    colStart: 3,
    colEnd: 6,
    mobileCol: 1,
  },
  {
    name: 'Full-Scale Project Execution',
    range: 'Spring 2028 – Winter 2030',
    bg: 'var(--color-brick)',
    color: 'white',
    colStart: 5,
    colEnd: 7,
    mobileCol: 2,
  },
]

const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030]

const Section = styled.section`
  width: 100%;
  margin-top: 5rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-top: 0;
  }
`

const SectionGrid = styled(Grid)`
  margin-top: 4rem;
  margin-bottom: 2rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
  }
`

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
  margin-bottom: 3rem;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 0;
  }
`

const TitleHeading = styled.h2`
  color: black;
  font-size: 1.5rem !important;
  margin-bottom: 1rem;

  @media (min-width: 480px) {
    font-size: 2.5rem !important;
  }

  @media (min-width: 769px) {
    font-size: 4rem !important;
  }

  @media ${GRID.MEDIA_MOBILE} {
    margin-bottom: 0.5rem;
  }
`

const Paragraph = styled.p`
  padding-bottom: 2rem;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
  
  span {
    display: block;
    margin-bottom: 1rem;
  }

  span:last-child {
    margin-bottom: 0;
  }
`

const Roadmap = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  row-gap: 0.75rem;
`

const YearRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  padding-bottom: 0.75rem;

  @media ${GRID.MEDIA_MOBILE} {
    display: none;
  }
`

const MobileTimelineGrid = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: repeat(6, minmax(3.5rem, 1fr));
    height: 38rem;
  }
`

const YearColumnFlex = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 0.75rem;
    grid-column: 1;
    grid-row: 1 / -1;
    align-self: stretch;
  }
`

const YearColumnLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-forest);
`

const YearLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-forest);
  margin-left: 0.5rem;
`

const YearCellLast = styled.div`
  grid-column: 6;
  display: flex;
  justify-content: space-between;

  ${YearLabel}:last-child {
    margin-right: 0.5rem;
  }
`

const PhaseBar = styled.div`
  grid-column: ${p => p.$colStart} / ${p => p.$colEnd};
  background: ${p => p.$bg};
  color: ${p => p.$color};
  padding: 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-height: 5.5rem;
  justify-content: flex-start;

  @media ${GRID.MEDIA_MOBILE} {
    grid-column: ${p => p.$mobileCol + 1};
    grid-row: ${p => p.$colStart} / ${p => p.$colEnd};
    padding: 1.25rem;
    min-height: auto;
    z-index: 1;
  }
`

const PhaseName = styled.span`
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.015em;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1rem;
  }
`

const PhaseRange = styled.span`
  font-size: 0.95rem;
  line-height: 1.4;
  opacity: 0.8;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 0.8rem;
    opacity: 0.85;
  }
`

const PhaseDescription = styled.span`
  font-size: 0.9rem;
  line-height: 1.3;
  color: ${p => p.$color};
  margin-top: 1rem;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 0.75rem;
    margin-top: 0.45rem;
  }
`

const OngoingBar = styled.div`
  grid-column: 1 / -1;
  background: var(--color-lime);
  color: var(--color-forest);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media ${GRID.MEDIA_MOBILE} {
    display: none;
  }
`

const OngoingBarMobile = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: var(--color-lime);
    color: var(--color-forest);
    padding: 1rem;
    margin-bottom: 0.75rem;
  }
`

const OngoingName = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.1rem;
  }
`

const OngoingRange = styled.span`
  font-size: 0.95rem;
  line-height: 1.4;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 0.95rem;
  }
`

const RoadmapWrapper = styled.div``

const RoadmapInner = styled.div`
  position: relative;
`

const MobileTimelineOverlay = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: grid;
    grid-column: 2 / -1;
    grid-row: 1 / -1;
    grid-template-rows: repeat(6, 1fr);
    position: relative;
    pointer-events: none;
    z-index: 0;
  }
`

const DesktopTimeline = styled.div`
  @media ${GRID.MEDIA_MOBILE} {
    display: none;
  }
`

const MobileTimeline = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: block;
  }
`

const GridLines = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  pointer-events: none;
  z-index: -1;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(6, 1fr);
    z-index: -1;
  }
`

const GridLine = styled.div`
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  height: 100%;

  &:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
  }

  @media ${GRID.MEDIA_MOBILE} {
    border-left: none;
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    height: auto;
    width: 100%;

    &:last-child {
      border-right: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }
  }
`



function ProjectStatus({ statusItems = [] }) {
  return (
    <Section>
      <SectionGrid as="div">

        <GridCell $start={1} $span={6} $spanMobile={4}>
          <IntroGrid>
            <TitleHeading>Project Status</TitleHeading>
            <Paragraph>
              <span>The Loop is a multi-year, multi-phase project – part of the City of Toronto’s ambitious Ravine Strategy.</span>
              <span>The current phase is focused on laying the groundwork for the entire project by refining the vision for The Loop, establishing design standards and concept plans, and building a coalition of champions, trail users, and community leaders. Even while this planning work advances, shovels are already in the ground, as the City of Toronto undertakes ongoing improvements to the trail.</span>
            </Paragraph>
          </IntroGrid>
        </GridCell>

        <GridCell $start={1} $span={6} $spanMobile={4}>
          <OngoingBarMobile>
            <OngoingName>Ongoing Trail Improvements</OngoingName>
            <OngoingRange>Winter 2024 – Winter 2030</OngoingRange>
          </OngoingBarMobile>

          <DesktopTimeline>
          <RoadmapWrapper>
          <RoadmapInner>
            <GridLines>
              <GridLine />
              <GridLine />
              <GridLine />
              <GridLine />
              <GridLine />
              <GridLine />
            </GridLines>

          <YearRow>
            {YEARS.slice(0, 5).map(year => (
              <YearLabel key={year}>{year}</YearLabel>
            ))}
            <YearCellLast>
              <YearLabel>2029</YearLabel>
              <YearLabel>2030</YearLabel>
            </YearCellLast>
          </YearRow>

          <Roadmap>
            {PHASES.map((phase, i) => (
              <PhaseBar
                key={i}
                $colStart={phase.colStart}
                $colEnd={phase.colEnd}
                $mobileCol={phase.mobileCol}
                $bg={phase.bg}
                $color={phase.color}
              >
                <PhaseName>{statusItems[i]?.StatusTitle || phase.name}</PhaseName>
                <PhaseRange>{phase.range}</PhaseRange>
                {statusItems[i]?.StatusDescription && (
                  <PhaseDescription $color={phase.color}>{statusItems[i].StatusDescription}</PhaseDescription>
                )}
              </PhaseBar>
            ))}

            <OngoingBar>
              <OngoingName>Ongoing Trail Improvements</OngoingName>
              <OngoingRange>Winter 2024 – Winter 2030</OngoingRange>
            </OngoingBar>
          </Roadmap>
          </RoadmapInner>
          </RoadmapWrapper>
          </DesktopTimeline>

          <MobileTimeline>
          <MobileTimelineGrid>
            <YearColumnFlex>
              {YEARS.map(year => (
                <YearColumnLabel key={year}>{year}</YearColumnLabel>
              ))}
            </YearColumnFlex>

            <MobileTimelineOverlay>
              <GridLines>
                <GridLine />
                <GridLine />
                <GridLine />
                <GridLine />
                <GridLine />
                <GridLine />
              </GridLines>
            </MobileTimelineOverlay>

            {PHASES.map((phase, i) => (
              <PhaseBar
                key={i}
                $colStart={phase.colStart}
                $colEnd={phase.colEnd}
                $mobileCol={phase.mobileCol}
                $bg={phase.bg}
                $color={phase.color}
              >
                <PhaseName>{statusItems[i]?.StatusTitle || phase.name}</PhaseName>
                <PhaseRange>{phase.range}</PhaseRange>
                {statusItems[i]?.StatusDescription && (
                  <PhaseDescription $color={phase.color}>{statusItems[i].StatusDescription}</PhaseDescription>
                )}
              </PhaseBar>
            ))}
          </MobileTimelineGrid>
          </MobileTimeline>
        </GridCell>
      </SectionGrid>
    </Section>
  );
}

export default ProjectStatus;
