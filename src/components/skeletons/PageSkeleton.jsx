import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { GRID } from '../../grid/config.js'
import SkeletonBlock from './SkeletonBlock.jsx'

const Wrapper = styled.div`
  padding-top: 25vh;

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 10vh;
  }
`

const HeroSkeleton = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 200px;
  background: linear-gradient(90deg, #e0e0e0 25%, #ebebeb 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 2rem;

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`

const IntroSectionSkeleton = styled.div`
  margin-bottom: 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const CardRowSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const CardSkeleton = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  column-gap: ${GRID.GAP}px;
  gap: 1rem;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: 1fr;
  }
`

const CardImage = styled.div`
  grid-column: 1 / span 3;
  aspect-ratio: 16 / 9;
  background: linear-gradient(90deg, #e0e0e0 25%, #ebebeb 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  @media ${GRID.MEDIA_MOBILE} {
    grid-column: 1 / -1;
  }
`

const CardText = styled.div`
  grid-column: 4 / span 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  @media ${GRID.MEDIA_MOBILE} {
    grid-column: 1 / -1;
  }
`

/**
 * Generic page skeleton: headline + hero + intro + optional card rows.
 * Used by CMS pages while loading instead of plain "Loading…" text.
 *
 * @param {number} [cardRows=0] - Number of card-row skeletons to render
 */
function PageSkeleton({ cardRows = 0 }) {
  return (
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <Wrapper>
          {/* Headline */}
          <SkeletonBlock $height="5rem" $width="70%" $mb="1.5rem" />

          {/* Hero */}
          <HeroSkeleton />

          {/* Intro */}
          <IntroSectionSkeleton>
            <SkeletonBlock $height="4rem" $width="55%" />
            <SkeletonBlock $height="1rem" $width="40%" />
            <SkeletonBlock $height="1rem" $width="35%" />
            <SkeletonBlock $height="1rem" $width="38%" />
          </IntroSectionSkeleton>
        </Wrapper>
      </GridCell>

      {cardRows > 0 && (
        <GridCell $start={1} $span={6}>
          <CardRowSkeleton>
            {Array.from({ length: cardRows }).map((_, i) => (
              <CardSkeleton key={i}>
                <CardImage />
                <CardText>
                  <SkeletonBlock $height="3rem" $width="60%" />
                  <SkeletonBlock $height="1rem" $width="90%" />
                  <SkeletonBlock $height="1rem" $width="80%" />
                  <SkeletonBlock $height="1rem" $width="75%" />
                </CardText>
              </CardSkeleton>
            ))}
          </CardRowSkeleton>
        </GridCell>
      )}
    </Grid>
  )
}

export default PageSkeleton
