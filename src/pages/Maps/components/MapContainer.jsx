import styled from 'styled-components'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { CardTitle, CardParagraph, CardLink } from '../../../styles/cardContent.js'

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  column-gap: 2rem;
  row-gap: 0;
  margin-bottom: 6rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    row-gap: 0;
  }
`

const Card = styled.article`
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 4;
  gap: 1rem;
  padding-bottom: 5rem;

  @media (max-width: 768px) {
    padding-bottom: 2.5rem;

    ${CardParagraph} {
      line-height: 1.4;
    }

    &:not(:first-child) {
      margin-top: 2.5rem;
    }
  }
`

const MapCardTitle = styled(CardTitle)`
  font-size: 2.75rem;
  line-height: 1.15;
  text-transform: capitalize;

  @media (max-width: 768px) {
    font-size: 1.75rem;
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
        const mapFile = link?.MapFile
        const fileUrl = mapFile ? getMediaUrl(mapFile) : (link?.URL ?? '')
        const fileName = mapFile?.name ?? null
        const linkLabel = link?.LinkDisplay ?? 'Download Map'

        const thumbSrc = thumbnail ? getMediaUrl(thumbnail) : null
        const thumbAlt = thumbnail?.alternativeText ?? thumbnail?.attributes?.alternativeText ?? title

        return (
          <Card key={item?.id ?? i}>
            {title && <MapCardTitle>{title}</MapCardTitle>}
            {description && <CardParagraph>{renderStrapiRichText(description)}</CardParagraph>}
            {thumbSrc && (
              <ThumbnailWrapper>
                <img src={thumbSrc} alt={thumbAlt || ''} loading="lazy" decoding="async" />
              </ThumbnailWrapper>
            )}
            {fileUrl && (
              <CardLink
                href={fileUrl}
                download={fileName || true}
                target="_blank"
                rel="noopener noreferrer"
              >
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
