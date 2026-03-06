import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { getStrapiUrl } from '../../api/strapi.js'
import { fetchCached } from '../../api/prefetchCache.js'
import { renderStrapiRichText } from '../../api/strapiRichText.jsx'
import PageIntro from '../../components/PageIntro.jsx'
import PageSkeleton from '../../components/skeletons/PageSkeleton.jsx'
import FadeInWrapper from '../../components/FadeInWrapper.jsx'
import RevealOnScroll from '../../components/RevealOnScroll.jsx'
import HubItem from './components/HubItem.jsx'

const IntroParagraph = styled.div`
  white-space: pre-line;
`

const IntroSection = styled.div`
  margin-bottom: 6rem;
`

const HubItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
`

const ErrorMsg = styled.p`
  padding: 2rem 0;
  font-size: 1rem;
  color: crimson;
`

function Hubs() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()
  const { hash } = useLocation()

  const isPreview =
    searchParams.get('preview') === 'true' &&
    searchParams.get('secret') === import.meta.env.VITE_PREVIEW_SECRET

  const draftStatus = isPreview ? searchParams.get('status') : null
  const isDraft = draftStatus === 'draft'

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCached(
          '/api/hubs?populate[0]=Hero&populate[1]=HubItem&populate[2]=HubItem.Image&populate[3]=HubItem.Link',
          { draft: isDraft }
        )
        setData(res)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isDraft])

  useEffect(() => {
    if (loading) return
    const id = hash?.slice(1)
    if (!id) return
    const scrollToHub = () => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    scrollToHub()
    const t = setTimeout(scrollToHub, 150)
    return () => clearTimeout(t)
  }, [loading, hash])

  if (loading) return <PageSkeleton cardRows={2} />
  if (error) return <Grid as="main"><GridCell $start={1} $span={6}><ErrorMsg>Error: {error}</ErrorMsg></GridCell></Grid>


  const page = data?.data ?? data
  if (!page || typeof page !== 'object') {
    return <Grid as="main"><GridCell $start={1} $span={6}><ErrorMsg>No content returned from CMS.</ErrorMsg></GridCell></Grid>
  }

  const headline = page.Headline ?? ''
  const hero = page.Hero
  const introTitle = page.IntroTitle ?? ''
  const introParagraph = page.IntroParagraph ?? ''
  const hubItems = Array.isArray(page.HubItem) ? page.HubItem : []

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
        <PageIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
          heroPoster={heroPoster}
        />

        {(introTitle || introParagraph) && (
          <IntroSection>
            <Grid as="div" $fullBleed>
              {introTitle && (
                <GridCell $start={1} $span={3}>
                  <h2>{introTitle}</h2>
                </GridCell>
              )}
              {introParagraph && (
                <GridCell $start={4} $span={3}>
                  <IntroParagraph>{renderStrapiRichText(introParagraph)}</IntroParagraph>
                </GridCell>
              )}
            </Grid>
          </IntroSection>
        )}
      </GridCell>

      {hubItems.length > 0 && (
        <GridCell $start={1} $span={6}>
          <HubItemList>
            {hubItems.map((item, i) => (
              <RevealOnScroll key={item?.id ?? i} delay={i * 0.05}>
                <HubItem item={item} index={i} />
              </RevealOnScroll>
            ))}
          </HubItemList>
        </GridCell>
      )}
    </Grid>
    </FadeInWrapper>
  )
}

export default Hubs
