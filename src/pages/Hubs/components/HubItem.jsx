import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { CardTitle, CardParagraph, CardLinkList, CardLink } from '../../../styles/cardContent.js'

const Card = styled.article`
  overflow: hidden;

  &:last-child {
    margin-bottom: 4rem;
  }
`

const ContentCol = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
`

const ImageCol = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

const ImageWrapper = styled.div`
  flex: 1;
  min-height: 280px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (min-width: 769px) {
    min-height: 400px;
  }
`

const ImageCredit = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #888;
  text-align: right;
  padding: 0.5rem 1rem 0.75rem;
`

function normalizeMediaList(imageField) {
  if (!imageField) return []
  if (Array.isArray(imageField)) return imageField
  if (imageField?.data != null) {
    const d = imageField.data
    return Array.isArray(d) ? d : [d]
  }
  return []
}

function getMediaUrl(media) {
  const url = media?.url ?? media?.attributes?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function HubItem({ item, index = 0 }) {
  const title = item?.Title ?? ''
  const paragraph = item?.Paragraph ?? ''

  const images = normalizeMediaList(item?.Image)
  const firstImage = images[0] ?? null
  const firstSrc = firstImage ? getMediaUrl(firstImage) : null
  const firstAlt = firstImage?.alternativeText ?? firstImage?.attributes?.alternativeText ?? title
  const imageCaption = firstImage?.caption ?? firstImage?.attributes?.caption ?? ''

  const linkField = item?.Link
  const links = Array.isArray(linkField) ? linkField : []

  const imageLeft = index % 2 === 1

  const contentCell = (
    <GridCell $start={imageLeft ? 4 : 1} $span={3} $spanMobile={4} $startMobile={1}>
      <ContentCol>
        {title && <CardTitle>{title}</CardTitle>}
        {paragraph && <CardParagraph>{renderStrapiRichText(paragraph)}</CardParagraph>}

        {links.length > 0 && (
          <CardLinkList>
            {links.map((link, j) => (
              <li key={j}>
                <CardLink href={link?.URL ?? '#'} target="_blank" rel="noopener noreferrer">
                  {link?.LinkDisplay ?? link?.URL} &rarr;
                </CardLink>
              </li>
            ))}
          </CardLinkList>
        )}
      </ContentCol>
    </GridCell>
  )

  const imageCell = firstSrc ? (
    <GridCell $start={imageLeft ? 1 : 4} $span={3} $spanMobile={4} $startMobile={1}>
      <ImageCol>
        <ImageWrapper>
          <img src={firstSrc} alt={firstAlt || ''} />
        </ImageWrapper>
        {imageCaption && <ImageCredit>{imageCaption}</ImageCredit>}
      </ImageCol>
    </GridCell>
  ) : null

  return (
    <Card>
      <Grid $fullBleed>
        {imageLeft ? (
          <>{imageCell}{contentCell}</>
        ) : (
          <>{contentCell}{imageCell}</>
        )}
      </Grid>
    </Card>
  )
}

export default HubItem
