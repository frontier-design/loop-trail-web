import styled from 'styled-components'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { CardTitle, CardParagraph, CardLink } from '../../../styles/cardContent.js'

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &:last-child {
    margin-bottom: 4rem;
  }
`

const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

function getMediaUrl(media) {
  const url = media?.url ?? media?.attributes?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function MapContainer({ items = [] }) {
  if (!items || items.length === 0) return null

  return (
    <MapGrid>
      {items.map((item, i) => {
        const title = item?.Title ?? ''
        const description = item?.Description ?? ''
        const thumbnails = item?.MapThumbnail
        const thumbnail = Array.isArray(thumbnails) ? thumbnails[0] : thumbnails
        const links = item?.MapDownloadLink
        const link = Array.isArray(links) ? links[0] : links
        const linkUrl = link?.URL ?? ''
        const linkLabel = link?.LinkDisplay ?? 'Download Map'

        const thumbSrc = thumbnail ? getMediaUrl(thumbnail) : null
        const thumbAlt = thumbnail?.alternativeText ?? thumbnail?.attributes?.alternativeText ?? title

        return (
          <Card key={item?.id ?? i}>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardParagraph>{renderStrapiRichText(description)}</CardParagraph>}
            {thumbSrc && (
              <ThumbnailWrapper>
                <img src={thumbSrc} alt={thumbAlt || ''} />
              </ThumbnailWrapper>
            )}
            {linkUrl && (
              <CardLink href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkLabel} &rarr;
              </CardLink>
            )}
          </Card>
        )
      })}
    </MapGrid>
  )
}

export default MapContainer
