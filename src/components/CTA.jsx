import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Grid, GridCell } from '../grid/index.js'
import { getStrapiUrl } from '../api/strapi.js'

const Section = styled.section`
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  min-height: 90vh;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  overflow: hidden;
  color: white;


  @media (max-width: 768px) {
    min-height: 70vh;
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
  padding-top: 4rem;
  padding-bottom: 4rem;
`

const Title = styled.h1`
  color: white;
  margin-bottom: 1rem;
  font-size: 6rem !important;
  letter-spacing: -0.025em !important;


  @media (max-width: 768px) {
    font-size: 3.25rem !important;
    letter-spacing: 0em;
  }
`

const Subtitle = styled.p`
  color: white;
  margin-bottom: 1.5rem;
`

const CtaLink = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  background: var(--color-brick);
  color: var(--color-lime);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--color-brick) 88%, black);
  }

  @media (min-width: 769px) {
    font-size: 1rem;
  }
`

function getMediaUrl(media) {
  const attrs = media?.attributes ?? media?.data?.attributes ?? media
  const url = attrs?.url ?? media?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function getFirstMedia(media) {
  if (!media) return null
  const d = media?.data
  if (Array.isArray(d)) return d[0] ?? null
  if (d && typeof d === 'object') return d
  return Array.isArray(media) ? media[0] : media
}

function CTA({ title, subtitle, background, button }) {
  const bg = getFirstMedia(background) ?? (Array.isArray(background) ? background[0] : background)
  const bgSrc = bg ? getMediaUrl(bg) : null
  const attrs = bg?.attributes ?? bg?.data?.attributes ?? bg
  const bgMime = attrs?.mime ?? bg?.mime ?? ''
  const bgIsVideo = bgMime.startsWith('video/')
  const bgAlt = attrs?.alternativeText ?? bg?.alternativeText ?? ''

  const btnRaw = Array.isArray(button) ? button[0] : button
  const btn = btnRaw?.data ?? btnRaw
  const btnLabel = btn?.LinkDisplay ?? btn?.linkDisplay ?? 'Get Involved'

  if (!title && !bgSrc) return null

  return (
    <Section>
      {bgSrc && (
        <BackgroundMedia>
          {bgIsVideo ? (
            <video src={bgSrc} autoPlay loop muted playsInline />
          ) : (
            <img src={bgSrc} alt={bgAlt || ''} loading="lazy" decoding="async" />
          )}
        </BackgroundMedia>
      )}
      <ContentGrid as="div">
        <GridCell $start={1} $span={3} $spanMobile={4}>
          {title && <Title>{title}</Title>}
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          <CtaLink to="/get-involved">{btnLabel}</CtaLink>
        </GridCell>
      </ContentGrid>
    </Section>
  )
}

export default CTA
