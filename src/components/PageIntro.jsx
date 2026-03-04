import { useEffect, useRef } from 'react'
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
  aspect-ratio: 16 / 9;
  min-height: 200px;
  max-height: 500px;
  img,
  video {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`

/**
 * Reusable page intro with headline and hero image/video.
 *
 * @param {string} [headline] - Page title
 * @param {string} [heroSrc] - URL for image or video
 * @param {string} [heroAlt] - Alt text for image
 * @param {boolean} [isVideo] - Whether heroSrc is a video
 * @param {string} [heroPoster] - Poster/thumbnail URL shown while video loads
 */
function PageIntro({ headline, heroSrc, heroAlt = '', isVideo = false, heroPoster }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    // Let the browser load metadata first, then begin playback.
    // This avoids downloading the full file upfront.
    el.play().catch(() => {})
  }, [heroSrc])

  if (!headline && !heroSrc) return null

  return (
    <HeroWrapper>
      {headline && <Headline>{headline}</Headline>}
      {heroSrc && (
        <HeroMedia>
          {isVideo ? (
            <video
              ref={videoRef}
              src={heroSrc}
              poster={heroPoster || undefined}
              preload="metadata"
              loop
              muted
              playsInline
            />
          ) : (
            <img src={heroSrc} alt={heroAlt} loading="lazy" decoding="async" />
          )}
        </HeroMedia>
      )}
    </HeroWrapper>
  )
}

export default PageIntro
