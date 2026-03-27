import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { GRID } from '../grid/config.js'
import { CardLink } from '../styles/cardContent.js'

const Headline = styled.h1`
  color: black;
  max-width: 85%;
  hyphens: none;
  /* Fluid type; lower floor than before so long titles fit narrow viewports (#root h1 is high-specificity) */
  font-size: clamp(1.625rem, 0.4rem + 6.25vw, 7rem) !important;
  /* Global #root h1 uses line-height: 1 — too tight on mobile; beat specificity for glyph clipping */
  line-height: 1.08 !important;
  letter-spacing: -0.025em;
  overflow-wrap: break-word;
  text-transform: uppercase;
  font-weight: 800;

  @media ${GRID.MEDIA_MOBILE} {
    max-width: 100%;
    line-height: 1.1 !important;
  }
`

const IntroLink = styled(CardLink).attrs({ as: Link })`
  display: inline-block;
  margin-top: 0.5rem;
`

const HeroWrapper = styled.div`
  padding-top: ${p => (p.$compact ? '0' : '25vh')};

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: ${p => (p.$compact ? '0' : '7.5rem')};
  }
`

const HeroMedia = styled.div`
  width: 100%;
  margin: 2.5rem 0;
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
 * @param {boolean} [compact] - When true, reduces top padding for section use
 */
function PageIntro({ headline, linkText, linkHref, heroSrc, heroAlt = '', isVideo = false, heroPoster, compact = false }) {
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
    <HeroWrapper $compact={compact}>
      {headline && <Headline>{headline}</Headline>}
      {linkText && linkHref && (
        <IntroLink to={linkHref}>{linkText}</IntroLink>
      )}
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
