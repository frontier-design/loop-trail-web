import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Grid, GridCell } from '../../../grid/index.js'
import { getStrapiUrl } from '../../../api/strapi.js'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'
import { CardLinkList, CardLink } from '../../../styles/cardContent.js'
import { GRID } from '../../../grid/config.js'

const Section = styled.section`
  width: 100vw;
  margin-left: calc(50% - 50vw);
  /* background-color: #ECF4D4; */
  padding-top: 4rem;
  padding-bottom: 4rem;

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 5rem 0;
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

  p {
    font-size: 1.75rem;
    line-height: 1.35;
  }

  p + p {
    margin-top: 1.5rem;
  }

  @media ${GRID.MEDIA_MOBILE} {
    p {
      font-size: 1.5rem;
    }
  }
`

const LinkListWrapper = styled(CardLinkList)`
  margin-top: 2rem;
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

function getMediaUrl(media) {
  const attrs = media?.data?.attributes ?? media?.attributes ?? media
  const url = attrs?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function getMediaItems(imageField) {
  if (!imageField) return []
  const data = imageField?.data ?? (Array.isArray(imageField) ? imageField : [imageField])
  return Array.isArray(data) ? data : [data]
}

/**
 * Indigenous section for homepage: paragraph, link, and image(s).
 * Styled like ExplainerSection (light green background, grid layout).
 *
 * @param {object} data - IndigenousHomepageComponent from Strapi
 * @param {string|Array|object} data.Paragraph - Rich text
 * @param {object} data.Link - { LinkDisplay, URL }
 * @param {object|Array} data.Image - Multiple Media
 */
function IndigenousComponent({ data }) {
  if (!data) return null

  const paragraph = data.Paragraph ?? data.paragraph
  const link = data.Link ?? data.link
  const linkDisplay = link?.LinkDisplay ?? link?.linkDisplay ?? 'Learn more'
  const imageItems = getMediaItems(
    data.Image ??
    data.image ??
    data.IndigenousHomepageComponent_Image_1600x1600_JPGorWebP_max700KB
  )

  const hasContent = paragraph || linkDisplay || imageItems.length > 0
  if (!hasContent) return null

  return (
    <Section>
      <ContentGrid as="div">
        {(paragraph || linkDisplay) && (
          <TextCell $start={1} $span={3} $spanMobile={4}>
            <TextWrapper>
              {paragraph && renderStrapiRichText(paragraph)}
              {linkDisplay && (
                <LinkListWrapper>
                  <li>
                    <CardLink as={Link} to="/indigenous-stewardship">
                      {linkDisplay} &rarr;
                    </CardLink>
                  </li>
                </LinkListWrapper>
              )}
            </TextWrapper>
          </TextCell>
        )}
        {imageItems.length > 0 && (
          <GridCell
            $start={4}
            $span={3}
            $spanMobile={4}
            $startMobile={1}
          >
            <ImageWrapper>
              {imageItems.map((item, i) => {
                const src = getMediaUrl(item)
                if (!src) return null
                return (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                  />
                )
              })}
            </ImageWrapper>
          </GridCell>
        )}
      </ContentGrid>
    </Section>
  )
}

export default IndigenousComponent
