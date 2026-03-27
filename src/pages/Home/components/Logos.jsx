import styled, { css } from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import { GRID } from '../../../grid/config.js'
import { getStrapiUrl } from '../../../api/strapi.js'

const Section = styled.section`
  width: 100%;
  padding: clamp(2rem, 4vw, 3rem) 0;
  padding-top: 0 !important;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 2rem 0 1.5rem !important;
  }
`

const SectionGrid = styled(Grid)`
  margin-top: 5rem;
  margin-bottom: 2rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-top: 2rem;
    margin-bottom: 1.5rem;
  }
`

const SectionTitle = styled.h2`
  color: #000;
  margin: 0 0 1rem;
  font-size: clamp(1.1rem, 1.9vw, 1.7rem) !important;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-align: center;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1.25rem !important;
    margin-bottom: 0.75rem;
  }
`

const LogoGrid = styled.div`
  padding: 0.5rem 0 0.85rem;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 0.5rem 0 1rem;
  }
`

const LogoCard = styled.div`
  flex: 1 1 0;
  min-width: 14rem;
  max-width: 22rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  min-height: 11rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid rgba(21, 76, 44, 0.14);
  background: #fff;
  transition: border-color 180ms ease, transform 180ms ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }

  &:hover {
    border-color: rgba(21, 76, 44, 0.24);
    transform: translateY(-1px);
  }

  @media (hover: none) {
    &:hover {
      transform: none;
    }
  }

  ${p =>
    p.$sectionType === 'titleOnly' &&
    css`
      min-width: 12rem;
      max-width: 18rem;
      min-height: 6.25rem;
      padding: 0.85rem 0.75rem;

      &:hover {
        border-color: rgba(21, 76, 44, 0.32);
      }
    `}

  /* imageOnly: same card / logo scale as full — only image+text sections used to shrink these */
  ${p =>
    p.$sectionType === 'imageOnly' &&
    css`
      border-color: rgba(21, 76, 44, 0.1);
    `}

  @media ${GRID.MEDIA_MOBILE} {
    min-width: 8rem;
    max-width: none;
    min-height: 9.5rem;
    padding: 1rem;

    ${p =>
      p.$sectionType === 'titleOnly' &&
      css`
        min-height: 6.25rem;
      `}
  }
`

const LogoImageWrapper = styled.div`
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    object-fit: contain;
    object-position: center;
    filter: grayscale(1) contrast(1.05);
    opacity: 0.9;
    transition: filter 160ms ease, opacity 160ms ease;
  }

  ${LogoCard}:hover & img {
    filter: grayscale(0);
    opacity: 1;
  }

  @media ${GRID.MEDIA_MOBILE} {
    height: 4rem;
  }
`

const LogoTitle = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.25;
  color: #000;
  width: 100%;
  text-align: center;
  ${p => p.$hidden && 'display: none;'}

  ${p =>
    p.$sectionType === 'titleOnly' &&
    css`
      font-size: 1.2rem;
      line-height: 1.2;
    `}

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 1rem;
  }
`

const LogoText = styled.p`
  font-size: 0.98rem;
  line-height: 1.45;
  color: #000;
  margin: 0;
  width: 100%;
  text-align: center;
  max-width: 85%;
  hyphens: none;

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 0.9rem;
  }
`

const LogoRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: clamp(1rem, 2vw, 1.75rem);
  margin-bottom: clamp(1rem, 2vw, 1.75rem);

  &:last-child {
    margin-bottom: 0;
  }

  @media ${GRID.MEDIA_MOBILE} {
    gap: 1rem;
    margin-bottom: 1rem;
  }
`

const LogoGridDesktop = styled.div`
  @media ${GRID.MEDIA_MOBILE} {
    display: none;
  }
`

const LogoGridMobile = styled.div`
  display: none;

  @media ${GRID.MEDIA_MOBILE} {
    display: block;
  }
`

function getLogoLink(item) {
  const raw = item?.LogoLink ?? item?.logoLink
  if (raw == null) return null
  const s = String(raw).trim()
  return s || null
}

function getMediaUrl(media) {
  const attrs = media?.data?.attributes ?? media?.attributes ?? media
  const url = attrs?.url ?? media?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function getLogoImageProps(media) {
  const attrs = media?.data?.attributes ?? media?.attributes ?? media
  const src = getMediaUrl(media)
  if (!src || !attrs) return null

  const formatCandidates = Object.values(attrs?.formats ?? {})
    .filter(format => format?.url && Number.isFinite(format?.width))
    .map(format => ({
      url: String(format.url).startsWith('http') ? format.url : getStrapiUrl(format.url),
      width: Number(format.width),
    }))

  if (Number.isFinite(attrs?.width)) {
    formatCandidates.push({ url: src, width: Number(attrs.width) })
  }

  const byWidth = new Map()
  formatCandidates.forEach(item => {
    if (!byWidth.has(item.width)) byWidth.set(item.width, item.url)
  })

  const srcSet = [...byWidth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([width, url]) => `${url} ${width}w`)
    .join(', ')

  return {
    src,
    ...(srcSet ? { srcSet, sizes: '(max-width: 768px) 42vw, 16vw' } : {}),
  }
}

function getSectionType(items) {
  if (!Array.isArray(items) || items.length === 0) return 'full'

  let withImageOnly = 0
  let withTitleOnly = 0

  items.forEach(item => {
    const imgSrc = getMediaUrl(item.LogoImage ?? item.logoImage)
    const itemTitle = String(item.LogoTitle ?? item.logoTitle ?? '').trim()
    const itemText = String(item.LogoText ?? item.logoText ?? '').trim()

    if (imgSrc && !itemTitle && !itemText) withImageOnly += 1
    if (!imgSrc && itemTitle && !itemText) withTitleOnly += 1
  })

  if (withImageOnly === items.length) return 'imageOnly'
  if (withTitleOnly === items.length) return 'titleOnly'
  return 'full'
}

/**
 * Chunk items into rows so the last row never has a single item.
 * When remainder is 1, put the short row first (e.g. 4 items @ 3 cols -> [2, 2]).
 */
function chunkRows(items, cols) {
  const n = items.length
  if (n === 0) return []
  if (n <= cols) return [items]
  if (cols <= 1) return items.map(item => [item])

  const remainder = n % cols
  if (remainder !== 1) {
    const rows = []
    for (let i = 0; i < n; i += cols) rows.push(items.slice(i, i + cols))
    return rows
  }

  const firstRowSize = cols - 1
  const rows = [items.slice(0, firstRowSize)]
  let i = firstRowSize
  while (i < n - 2) {
    rows.push(items.slice(i, i + cols))
    i += cols
  }
  rows.push(items.slice(n - 2))
  return rows
}

function LogoItem({ item, sectionType, sIdx }) {
  const imgProps = getLogoImageProps(item.LogoImage ?? item.logoImage)
  const itemTitle = item.LogoTitle ?? item.logoTitle
  const itemText = item.LogoText ?? item.logoText
  const logoLink = getLogoLink(item)
  const linkProps = logoLink
    ? { href: logoLink, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <LogoCard as={logoLink ? 'a' : 'div'} {...linkProps} $sectionType={sectionType}>
      {imgProps && (
        <LogoImageWrapper $sectionType={sectionType}>
          <img {...imgProps} alt={itemTitle || ''} loading="lazy" decoding="async" />
        </LogoImageWrapper>
      )}
      {itemTitle && <LogoTitle $sectionType={sectionType} $hidden={sIdx === 0}>{itemTitle}</LogoTitle>}
      {itemText && <LogoText>{itemText}</LogoText>}
    </LogoCard>
  )
}

function Logos({ data }) {
  const sections = Array.isArray(data) ? data : []

  return (
    <Section>
      {sections.map((section, sIdx) => {
        const title = section.LogoSectionTitle ?? section.logoSectionTitle
        const items = Array.isArray(section.LogoItem ?? section.logoItem)
          ? (section.LogoItem ?? section.logoItem)
          : []
        const sectionType = getSectionType(items)

        if (!title && items.length === 0) return null

        return (
          <SectionGrid as="div" key={sIdx}>
            {title && (
              <GridCell $start={1} $span={6} $spanMobile={4}>
                <SectionTitle>{title}</SectionTitle>
              </GridCell>
            )}

            {items.length > 0 && (
              <GridCell $start={1} $span={6} $spanMobile={4}>
                <LogoGrid $sectionType={sectionType}>
                  <LogoGridDesktop>
                    {chunkRows(items, sIdx === 0 ? 4 : (sectionType === 'imageOnly' ? 4 : 3)).map((row, rIdx) => (
                      <LogoRow key={`d-${rIdx}`}>
                        {row.map((item, iIdx) => (
                          <LogoItem key={iIdx} item={item} sectionType={sectionType} sIdx={sIdx} />
                        ))}
                      </LogoRow>
                    ))}
                  </LogoGridDesktop>
                  <LogoGridMobile>
                    {chunkRows(items, sIdx === 0 ? 1 : (sectionType === 'imageOnly' ? 3 : 2)).map((row, rIdx) => (
                      <LogoRow key={`m-${rIdx}`}>
                        {row.map((item, iIdx) => (
                          <LogoItem key={iIdx} item={item} sectionType={sectionType} sIdx={sIdx} />
                        ))}
                      </LogoRow>
                    ))}
                  </LogoGridMobile>
                </LogoGrid>
              </GridCell>
            )}
          </SectionGrid>
        )
      })}
    </Section>
  )
}

export default Logos
