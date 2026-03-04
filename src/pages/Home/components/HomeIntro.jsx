import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { GRID } from '../../../grid/config.js'

const Section = styled.section`
  width: 100%;
  padding: clamp(4rem, 8vw, 6rem) 0;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 3rem 0;
  }
`

const ContentGrid = styled(Grid)`
  width: 100%;
`

const TextCell = styled(GridCell)`
  display: flex;
  align-items: center;
`

const TextWrapper = styled.div`
  font-size: 5rem !important;

  strong {
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 1.25;
  }

  p + p {
    margin-top: 1.25rem;
  }

  p {
    margin: 0;
  }
`

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
    min-height: 500px;
  }
`

function getMediaUrl(media) {
  const attrs = media?.attributes ?? media?.data?.attributes ?? media
  const url = attrs?.url ?? media?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function normalizeMediaList(mediaField) {
  if (!mediaField) return []
  if (Array.isArray(mediaField)) return mediaField
  if (mediaField?.data != null) {
    const d = mediaField.data
    return Array.isArray(d) ? d : [d]
  }
  return [mediaField].filter(Boolean)
}

/**
 * HomeIntro: IntroText on left, StackingImage on right.
 * Bold text: font-weight 700, slightly larger.
 *
 * @param {string|Array|object} introText - Rich text (Blocks) from Strapi
 * @param {object|Array} stackingImage - Multiple Media from Strapi
 */
function HomeIntro({ introText, stackingImage }) {
  const images = normalizeMediaList(stackingImage)
  const firstImage = images[0] ?? null
  const imageSrc = firstImage ? getMediaUrl(firstImage) : null
  const imageAlt = firstImage?.alternativeText ?? firstImage?.attributes?.alternativeText ?? ''
  const hasContent = introText || imageSrc

  if (!hasContent) return null

  return (
    <Section>
      <ContentGrid as="div">
        {introText && (
          <TextCell $start={1} $span={3} $spanMobile={4}>
            <TextWrapper>{renderStrapiRichText(introText)}</TextWrapper>
          </TextCell>
        )}
        {imageSrc && (
          <GridCell $start={4} $span={3} $spanMobile={4} $startMobile={1}>
            <ImageWrapper>
              <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
            </ImageWrapper>
          </GridCell>
        )}
      </ContentGrid>
    </Section>
  )
}

export default HomeIntro
