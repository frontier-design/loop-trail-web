import styled from 'styled-components'
import { GRID } from '../grid/config.js'

const Headline = styled.h1`
  color: black;
  max-width: 85%;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 2.25rem !important;
  }
`

const HeroWrapper = styled.div`
  padding-top: 25vh;
  

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 10vh;
  }
`

const HeroMedia = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  overflow: hidden;

  img,
  video {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }
`

/**
 * Reusable page intro with headline and hero image/video.
 * Used by Hubs, Maps, and other pages with the same hero layout.
 *
 * @param {string} [headline] - Page title
 * @param {string} [heroSrc] - URL for image or video
 * @param {string} [heroAlt] - Alt text for image
 * @param {boolean} [isVideo] - Whether heroSrc is a video
 */
function PageIntro({ headline, heroSrc, heroAlt = '', isVideo = false }) {
  if (!headline && !heroSrc) return null

  return (
    <HeroWrapper>
      {headline && <Headline>{headline}</Headline>}
      {heroSrc && (
        <HeroMedia>
          {isVideo ? (
            <video src={heroSrc} autoPlay loop muted playsInline />
          ) : (
            <img src={heroSrc} alt={heroAlt} />
          )}
        </HeroMedia>
      )}
    </HeroWrapper>
  )
}

export default PageIntro
