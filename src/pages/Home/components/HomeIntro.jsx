import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { getStrapiImageProps } from '../../../utils/strapiMedia.js'
import { GRID } from '../../../grid/config.js'

const Section = styled.section`
  width: 100%;
  padding: clamp(4rem, 8vw, 6rem) 0;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 5rem 0 !important;
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

  strong {
    font-weight: 700;
  }

  p + p {
    margin-top: 1.25rem;
  }

  p {
    margin: 0;
    font-size: 2rem;
    line-height: 1.3;
  }

  @media ${GRID.MEDIA_MOBILE} {
    p {
      font-size: 1.5rem;
    }
  }
`

const ImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
  }
`

// The image cell spans 3 of 6 columns on desktop (~half the 1700px max grid)
// and full width on mobile, so request candidates accordingly.
const IMAGE_SIZES = '(max-width: 950px) 92vw, 45vw'

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
  const imageProps = firstImage ? getStrapiImageProps(firstImage, { sizes: IMAGE_SIZES }) : null
  const imageAlt = firstImage?.alternativeText ?? firstImage?.attributes?.alternativeText ?? ''
  const hasContent = introText || imageProps

  if (!hasContent) return null

  return (
    <Section>
      <ContentGrid as="div">
        {introText && (
          <TextCell $start={1} $span={3} $spanMobile={4}>
            <TextWrapper>{renderStrapiRichText(introText)}</TextWrapper>
          </TextCell>
        )}
        {imageProps && (
          <GridCell $start={4} $span={3} $spanMobile={4} $startMobile={1}>
            <ImageWrapper>
              <img {...imageProps} alt={imageAlt} loading="lazy" decoding="async" />
            </ImageWrapper>
          </GridCell>
        )}
      </ContentGrid>
    </Section>
  )
}

export default HomeIntro
