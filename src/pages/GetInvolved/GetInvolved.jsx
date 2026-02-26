import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { GRID } from '../../grid/config.js'
import { fetchStrapiWithStatus, getStrapiUrl } from '../../api/strapi.js'
import { renderStrapiRichText } from '../../api/strapiRichText.jsx'
import FullBleedIntro from '../../components/FullBleedIntro.jsx'
import { CardTitle, CardParagraph } from '../../styles/cardContent.js'
import { GetInvolvedForm } from './components/index.js'

const IntroSection = styled.div`
  padding: 0;
  margin-top: 3rem;
  margin-bottom: 6rem;
  @media ${GRID.MEDIA_MOBILE} {
    margin-top: 2rem;
    margin-bottom: 2.5rem;
  }
`

function GetInvolved() {
  const [data, setData] = useState(null)
  const [searchParams] = useSearchParams()

  const isPreview =
    searchParams.get('preview') === 'true' &&
    searchParams.get('secret') === import.meta.env.VITE_PREVIEW_SECRET

  const draftStatus = isPreview ? searchParams.get('status') : null
  const isDraft = draftStatus === 'draft'

  useEffect(() => {
    async function load() {
      const res = await fetchStrapiWithStatus(
        '/api/get-involved?populate[0]=Hero',
        { draft: isDraft }
      )
      setData(res)
    }
    load()
  }, [isDraft])

  const page = data?.data ?? data ?? {}
  const headline = page?.Headline ?? 'Get Involved'
  const hero = page?.Hero ?? null
  const introTitle = page?.IntroTitle ?? ''
  const introParagraph = page?.IntroParagraph ?? ''

  const heroUrl = hero?.url
  const heroMime = hero?.mime ?? ''
  const heroAlt = hero?.alternativeText ?? headline
  const heroSrc = heroUrl
    ? (String(heroUrl).startsWith('http') ? heroUrl : getStrapiUrl(heroUrl))
    : null
  const isVideo = heroMime.startsWith('video/')

  return (
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <FullBleedIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
        />
      </GridCell>

      <GridCell $start={1} $span={3} $spanMobile={4}>
        {(introTitle || introParagraph) && (
          <IntroSection>
            {introTitle && <CardTitle as="h2">{introTitle}</CardTitle>}
            {introParagraph && (
              <CardParagraph>{renderStrapiRichText(introParagraph)}</CardParagraph>
            )}
          </IntroSection>
        )}
      </GridCell>

      <GridCell $start={4} $span={3} $spanMobile={4}>
        <GetInvolvedForm />
      </GridCell>
    </Grid>
  )
}

export default GetInvolved
