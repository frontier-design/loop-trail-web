import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { GRID } from '../../../grid/config.js'
import RevealOnScroll from '../../../components/RevealOnScroll.jsx'

const Section = styled.section`
  width: 100%;
  padding: 4rem 0;
  background-color: #F5F6E4;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 3rem 0;
  }
`

const TitleWrapper = styled.div`
  margin-bottom: 5rem;
`

const Title = styled.h1`
  font-size: 6rem !important;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.025em;
  text-transform: none !important;
  color: var(--color-forest, #154C2C);
  margin-bottom: 3rem;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 2.25rem !important;
  }
`

const ListColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media ${GRID.MEDIA_MOBILE} {
    gap: 1rem;
  }
`

const NeighbourhoodItem = styled.span`
  font-size: 1.25rem;
  font-weight: 400;
  color: #1a1a1a;
  display: block;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.1rem;
  }
`

function getNeighbourhoodNames(items) {
  if (!Array.isArray(items)) return []
  return items
    .map((item) => item?.NeighbourhoodName ?? item?.neighbourhoodName ?? '')
    .filter(Boolean)
}

function Neighbourhoods({ data }) {
  const names = getNeighbourhoodNames(data)
  if (names.length === 0) return null

  const midpoint = Math.ceil(names.length / 2)
  const leftColumn = names.slice(0, midpoint)
  const rightColumn = names.slice(midpoint)

  return (
    <Section>
      <Grid as="div">
        <GridCell $start={1} $span={6} $spanMobile={4}>
          <RevealOnScroll>
            <TitleWrapper>
              <Title>Neighbourhoods <br /> Connected by the Loop</Title>
            </TitleWrapper>
            <Grid as="div" $fullBleed>
              <GridCell $start={1} $span={3} $spanMobile={4}>
                <ListColumn>
                  {leftColumn.map((name, i) => (
                    <NeighbourhoodItem key={`left-${i}`}>{name}</NeighbourhoodItem>
                  ))}
                </ListColumn>
              </GridCell>
              <GridCell $start={4} $span={3} $spanMobile={4}>
                <ListColumn>
                  {rightColumn.map((name, i) => (
                    <NeighbourhoodItem key={`right-${i}`}>{name}</NeighbourhoodItem>
                  ))}
                </ListColumn>
              </GridCell>
            </Grid>
          </RevealOnScroll>
        </GridCell>
      </Grid>
    </Section>
  )
}

export default Neighbourhoods
