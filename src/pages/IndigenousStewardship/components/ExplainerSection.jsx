import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { GRID } from '../../../grid/config.js'

const Section = styled.section`
  width: 100vw;
  margin-left: calc(50% - 50vw);
  background-color: #ECF4D4;
  padding-top: 4rem;
  padding-bottom: 4rem;

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
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
  color: #333;

  p + p {
    margin-top: 1.5rem;
  }
`

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img,
  svg,
  object {
    max-width: 100%;
    height: auto;
    display: block;
  }
`

const ImageCredit = styled.p`
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
`

function getMediaUrl(media) {
  const attrs = media?.data?.attributes ?? media?.attributes ?? media
  const url = attrs?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function renderExplainerText(content) {
  if (content == null) return null
  // Plain string with paragraph breaks – split by double newlines and wrap in <p>
  if (typeof content === 'string' && content.trim() !== '') {
    const paragraphs = content.split(/\n\n+/)
    if (paragraphs.length > 1) {
      return paragraphs.map((para, i) => <p key={i}>{para.trim()}</p>)
    }
    return renderStrapiRichText(content)
  }
  return renderStrapiRichText(content)
}

/**
 * Full-bleed Explainer section: text on left, image (SVG) on right.
 * Background: light yellowish-green.
 *
 * @param {string|Array|object} explainerText - Rich text from Strapi
 * @param {object} explainerImage - Media from Strapi (single Media field)
 */
function ExplainerSection({ explainerText, explainerImage }) {
  const imageSrc = explainerImage ? getMediaUrl(explainerImage) : null
  const hasContent = explainerText || imageSrc

  if (!hasContent) return null

  return (
    <Section>
      <ContentGrid as="div">
        {explainerText && (
          <TextCell $start={1} $span={3} $spanMobile={4}>
            <TextWrapper>{renderExplainerText(explainerText)}</TextWrapper>
          </TextCell>
        )}
        {imageSrc && (
          <GridCell
            $start={4}
            $span={3}
            $spanMobile={4}
            $startMobile={1}
          >
            <ImageWrapper>
              <img src={imageSrc} alt="" aria-hidden loading="lazy" decoding="async" />
              <ImageCredit>Design de Plume Agency</ImageCredit>
            </ImageWrapper>
          </GridCell>
        )}
      </ContentGrid>
    </Section>
  )
}

export default ExplainerSection
