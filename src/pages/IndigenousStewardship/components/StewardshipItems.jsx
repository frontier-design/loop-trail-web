import styled from 'styled-components'
import { getStrapiUrl } from '../../../api/strapi.js'
import { CardParagraph } from '../../../styles/cardContent.js'
import { GRID } from '../../../grid/config.js'

const ItemTitle = styled.h3`
  font-size: 2.6rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  overflow-wrap: break-word;
  word-wrap: break-word;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.75rem;
  }
`

const GridWrapper = styled.div`
  margin-top: 6rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: ${GRID.GAP}px;
  row-gap: 3rem;
  margin-bottom: 6rem;

  @media ${GRID.MEDIA_TABLET} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: ${GRID.GAP_TABLET};
    row-gap: 2rem;
  }

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    column-gap: ${GRID.GAP_MOBILE};
    row-gap: 2rem;
  }
`

const Card = styled.article`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const ImageWrapper = styled.div`
  width: 100%;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  img,
  svg,
  object {
    max-width: 100%;
    height: auto;
    display: block;
  }
`

const ParagraphWrapper = styled.div`
  p + p {
    margin-top: 1rem;
  }
`

function normalizeMediaList(imageField) {
  if (!imageField) return []
  if (Array.isArray(imageField)) return imageField
  if (imageField?.data != null) {
    const d = imageField.data
    return Array.isArray(d) ? d : [d]
  }
  return [imageField].filter(Boolean)
}

function getMediaUrl(media) {
  const attrs = media?.attributes ?? media?.data?.attributes ?? media
  const url = attrs?.url ?? media?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function renderParagraphWithBreaks(text) {
  if (!text || typeof text !== 'string') return null
  const paragraphs = text.split(/\n\n+/)
  if (paragraphs.length > 1) {
    return paragraphs.map((para, i) => <p key={i}>{para.trim()}</p>)
  }
  return <p>{text.trim()}</p>
}

function StewardshipItem({ item }) {
  const title = item?.Title ?? ''
  const paragraph = item?.Paragraph ?? ''

  const images = normalizeMediaList(item?.Image)
  const firstImage = images[0] ?? null
  const imageSrc = firstImage ? getMediaUrl(firstImage) : null
  const imageAlt = firstImage?.alternativeText ?? firstImage?.attributes?.alternativeText ?? title

  return (
    <Card>
      {imageSrc && (
        <ImageWrapper>
          <img src={imageSrc} alt={imageAlt || ''} loading="lazy" decoding="async" />
        </ImageWrapper>
      )}
      {title && <ItemTitle>{title}</ItemTitle>}
      {paragraph && (
        <CardParagraph as="div">
          <ParagraphWrapper>{renderParagraphWithBreaks(paragraph)}</ParagraphWrapper>
        </CardParagraph>
      )}
    </Card>
  )
}

/**
 * Grid of stewardship items: image (SVG) at top, then title, then paragraph.
 * Each item from ComponentExplainer (Stewardship-item): Title, Paragraph, Image (Multiple Media).
 *
 * @param {Array} items - ComponentExplainer array from Strapi
 */
function StewardshipItems({ items = [] }) {
  const list = Array.isArray(items) ? items : []

  if (list.length === 0) return null

  return (
    <GridWrapper>
      {list.map((item, i) => (
        <StewardshipItem key={item?.id ?? i} item={item} />
      ))}
    </GridWrapper>
  )
}

export default StewardshipItems
