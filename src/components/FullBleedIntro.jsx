import styled from 'styled-components'
import { Grid, GridCell } from '../grid/index.js'
import { GRID } from '../grid/config.js'

const Section = styled.section`
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  min-height: 65vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
  color: white;

  @media ${GRID.MEDIA_MOBILE} {
    min-height: 50vh;
  }
`

const BackgroundMedia = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }
`

const ContentGrid = styled(Grid)`
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 1rem;
`

const Headline = styled.h1`
  color: white;
  max-width: 85%;
  font-size: 5rem !important;
  letter-spacing: 0 !important;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  font-weight: 800;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 3rem !important;
  }
`

/**
 * Full-bleed hero with headline overlay (background image/video + white headline).
 * Design similar to CTA; used for Get Involved and other landing moments.
 *
 * @param {string} [headline] - Page title
 * @param {string} [heroSrc] - URL for image or video
 * @param {string} [heroAlt] - Alt text for image
 * @param {boolean} [isVideo] - Whether heroSrc is a video
 */
function FullBleedIntro({ headline, heroSrc, heroAlt = '', isVideo = false }) {
  if (!headline && !heroSrc) return null

  return (
    <Section id="fullbleed-intro">
      {heroSrc && (
        <BackgroundMedia>
          {isVideo ? (
            <video src={heroSrc} autoPlay loop muted playsInline />
          ) : (
            <img src={heroSrc} alt={heroAlt} />
          )}
        </BackgroundMedia>
      )}
      <ContentGrid as="div">
        <GridCell $start={1} $span={5} $spanMobile={4}>
          {headline && <Headline>{headline}</Headline>}
        </GridCell>
      </ContentGrid>
    </Section>
  )
}

export default FullBleedIntro
