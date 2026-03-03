import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import eastIcon from '../../../assets/icons/east.svg'
import westIcon from '../../../assets/icons/west.svg'
import northIcon from '../../../assets/icons/north.svg'
import southIcon from '../../../assets/icons/south.svg'

const IntroSection = styled.section`
  background: var(--color-lime, #E7F5A6);
  min-height: 100vh;
  display: flex;
  align-items: flex-end;
  padding: clamp(4rem, 10vw, 8rem) 0 clamp(3rem, 6vw, 5rem) 0;
`

const IntroText = styled.p`
  font-family: 'ABCDiatype', system-ui, -apple-system, sans-serif;
  font-weight: 700;
  font-size: clamp(5.5rem, 4vw, 10rem);
  line-height: 1.1;
  color: var(--color-forest, #154C2C);
  max-width: 20em;
  margin: 0;
`

const DirectionIcon = styled.img`
  display: inline-block;
  vertical-align: middle;
  width: 1em;
  height: 1em;
  margin: 0 0.06em;
`

function Intro() {
  return (
    <IntroSection>
      <Grid as="div">
        <GridCell $start={1} $span={12} $startMobile={1} $spanMobile={4}>
          <IntroText>
            The Loop is a new 80km circular trail that will connect the Don{' '}
            <DirectionIcon src={eastIcon} alt="East" aria-hidden /> and Humber{' '}
            <DirectionIcon src={westIcon} alt="West" aria-hidden /> valleys, the Finch Hydro Corridor{' '}
            <DirectionIcon src={northIcon} alt="North" aria-hidden /> and the Lake Ontario waterfront{' '}
            <DirectionIcon src={southIcon} alt="South" aria-hidden />.
          </IntroText>
        </GridCell>
      </Grid>
    </IntroSection>
  )
}

export default Intro
