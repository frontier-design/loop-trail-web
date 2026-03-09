import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { GRID } from '../../../grid/config.js'

// ─── Structure ───────────────────────────────────────────────────────────────
// FullbleedDiv
//   ├── Title + InnerLayout
//   │     ├── ParentForRedAndBlue (left ~2/3)
//   │     │     ├── RedParent (3 stat blocks)
//   │     │     │     ├── Block1
//   │     │     │     ├── Block2
//   │     │     │     └── Block3
//   │     │     └── BlueIndividual (City-wide)
//   │     └── GreenIndividual (right ~1/3)

const FullbleedDiv = styled.section`
  width: 100%;

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 2.5rem;
    padding-bottom: 0;
    margin-bottom: 0;
  }
`

const SectionGrid = styled(Grid)`
  width: 100%;
`

const TitleCell = styled(GridCell)`
  margin-bottom: 2rem;
  margin-top: 4rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-bottom: 1.5rem;
    margin-top: 2rem;
  }
`

const TitleHeading = styled.h2`
  color: ${p => p.$color};
`

const InnerLayoutWrapper = styled.div`
  width: 100vw;
  margin-left: calc(50% - 50vw);
`

const InnerLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 0;
  width: 100%;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: 1fr;
  }
`

const ParentForRedAndBlue = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`

const RedParent = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: repeat(2, 1fr);
    
    & > *:nth-child(3) {
      grid-column: 1 / -1;
    }
  }
`

const StatBlock = styled.div`
  --stat-number-color: ${p => p.$numberColor ?? 'inherit'};
  --stat-text-color: ${p => p.$textColor ?? p.$color};
  padding: 2rem;
  background-color: ${p => p.$bg};
  color: ${p => p.$color};
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 38vh;

  @media ${GRID.MEDIA_MOBILE} {
    min-height: 10rem;
    padding: 1.5rem;
  }
`

const StatNumber = styled.span`
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
  color: var(--stat-number-color);
`

const StatText = styled.span`
  font-size: 1.35rem;
  line-height: 1.4;
  font-weight: 400;
  color: var(--stat-text-color);

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1rem;
  }
`

const BlueIndividual = styled.div`
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background-color: var(--color-forest);
  color: var(--color-lime);
  min-height: 10rem;
  display: flex;
  flex-direction: column; 
  justify-content: space-between;
  min-height: 35vh;

  @media ${GRID.MEDIA_MOBILE} {
    min-height: 9rem;
    padding: 1.5rem;
  }
`

const BlueLabel = styled.span`
  font-size: clamp(6rem, 10vw, 10rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`

const BlueText = styled.span`
  font-size: 1.35rem;
  line-height: 1.4;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1rem;
  }
`

const GreenIndividual = styled.div`
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background-color: var(--color-lime);
  color: var(--color-forest);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;

  @media ${GRID.MEDIA_MOBILE} {
    min-height: 10rem;
  }
`

const GreenLabel = styled.span`
  font-size: clamp(6rem, 10vw, 10rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
`

const GreenText = styled.span`
  font-size: 1.35rem;
  line-height: 1.4;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1rem;
  }
`

function AtAGlance() {
  return (
    <FullbleedDiv>
      <SectionGrid as="div">
        {/* <TitleCell $start={1} $span={6} $spanMobile={4}>
          <TitleHeading>The Loop at a Glance</TitleHeading>
        </TitleCell> */}
      </SectionGrid>
      <InnerLayoutWrapper>
        <InnerLayout>
          <ParentForRedAndBlue>
            <RedParent>
              <StatBlock $bg="var(--color-sky)" $color="var(--color-lime)">
                <StatNumber>17</StatNumber>
                <StatText>
                  Neighbourhood Improvement Areas will be connected by the Loop
                </StatText>
              </StatBlock>
              <StatBlock $bg="var(--color-mint)" $color="var(--color-lime)" $numberColor="var(--color-sky)" $textColor="var(--color-sky)">
                <StatNumber>5</StatNumber>
                <StatText>
                  community hubs to bring culture, community, food and art to the trail
                </StatText>
              </StatBlock>
              <StatBlock $bg="var(--color-brick)" $color="var(--color-lime)">
                <StatNumber>XX</StatNumber>
                <StatText>Lorem Ipsum</StatText>
              </StatBlock>
            </RedParent>
            <BlueIndividual>
              <BlueLabel>City-wide</BlueLabel>
              <BlueText>project that will transform dozens of neighbourhoods</BlueText>
            </BlueIndividual>
          </ParentForRedAndBlue>
          <GreenIndividual>
            <GreenLabel>Over 80km</GreenLabel>
            <GreenText>of new and existing trails</GreenText>
          </GreenIndividual>
        </InnerLayout>
      </InnerLayoutWrapper>
    </FullbleedDiv>
  )
}

export default AtAGlance
