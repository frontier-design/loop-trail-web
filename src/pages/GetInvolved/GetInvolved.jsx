import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { GRID } from '../../grid/config.js'
import { getStrapiUrl } from '../../api/strapi.js'
import { fetchCached } from '../../api/prefetchCache.js'
import { renderStrapiRichText } from '../../api/strapiRichText.jsx'
import FullBleedIntro from '../../components/FullBleedIntro.jsx'
import PageSkeleton from '../../components/skeletons/PageSkeleton.jsx'
import FadeInWrapper from '../../components/FadeInWrapper.jsx'
import { CardTitle, CardParagraph } from '../../styles/cardContent.js'
import { GetInvolvedForm } from './components/index.js'

const IntroSection = styled.div`
  padding: 0;
  margin-top: 4rem;
  margin-bottom: 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    gap: 1.25rem;
  }
`

function GetInvolved() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()

  const isPreview =
    searchParams.get('preview') === 'true' &&
    searchParams.get('secret') === import.meta.env.VITE_PREVIEW_SECRET

  const draftStatus = isPreview ? searchParams.get('status') : null
  const isDraft = draftStatus === 'draft'

  useEffect(() => {
    async function load() {
      const res = await fetchCached(
        '/api/get-involved?populate[0]=Hero',
        { draft: isDraft }
      )
      setData(res)
      setLoading(false)
    }
    load()
  }, [isDraft])

  if (loading) return <PageSkeleton cardRows={0} />

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
  const posterUrl = hero?.formats?.thumbnail?.url
  const heroPoster = posterUrl
    ? (String(posterUrl).startsWith('http') ? posterUrl : getStrapiUrl(posterUrl))
    : null

  return (
    <FadeInWrapper ready={!loading}>
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <FullBleedIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
          heroPoster={heroPoster}
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
    </FadeInWrapper>
  )
}

export default GetInvolved
