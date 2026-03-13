import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { getStrapiUrl } from '../../api/strapi.js'
import { fetchCached } from '../../api/prefetchCache.js'
import PageIntro from '../../components/PageIntro.jsx'
import PageSkeleton from '../../components/skeletons/PageSkeleton.jsx'
import CTA from '../../components/CTA.jsx'
import FadeInWrapper from '../../components/FadeInWrapper.jsx'
import RevealOnScroll from '../../components/RevealOnScroll.jsx'
import { FAQItem } from './components/index.js'
import SEOHead from '../../components/SEOHead.jsx'

const ErrorMsg = styled.p`
  padding: 2rem 0;
  font-size: 1rem;
  color: crimson;
`

function FAQs() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams] = useSearchParams()

  const isPreview =
    searchParams.get('preview') === 'true' &&
    searchParams.get('secret') === import.meta.env.VITE_PREVIEW_SECRET

  const draftStatus = isPreview ? searchParams.get('status') : null
  const isDraft = draftStatus === 'draft'

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCached(
          '/api/faqs?populate[0]=Hero&populate[1]=FAQItem&populate[2]=FAQItem.QuestionItem&populate[3]=CTA&populate[4]=CTA.Background&populate[5]=CTA.Button&populate[6]=SharedMeta&populate[7]=SharedMeta.MetaImage',
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

  if (loading) return <PageSkeleton cardRows={0} />
  if (error) return <Grid as="main"><GridCell $start={1} $span={6}><ErrorMsg>Error: {error}</ErrorMsg></GridCell></Grid>

  const page = data?.data ?? data
  const headline = page?.Headline ?? 'FAQs'
  const faqItems = Array.isArray(page?.FAQItem) ? page.FAQItem : []
  const cta = page?.CTA ?? null
  const meta = page?.SharedMeta ?? page?.sharedMeta ?? null
  const hero = page?.Hero ?? null
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
    <SEOHead meta={meta} />
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <PageIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
          heroPoster={heroPoster}
        />
      </GridCell>

      {faqItems.length > 0 && (
        <GridCell $start={1} $span={6}>
          {faqItems.map((item, i) => (
            <RevealOnScroll key={item?.id ?? i} delay={i * 0.05}>
              <FAQItem item={item} />
            </RevealOnScroll>
          ))}
        </GridCell>
      )}

      {cta && (
        <GridCell $start={1} $span={6}>
          <CTA
            title={cta.Title}
            subtitle={cta.Subtitle}
            background={cta.Background}
            button={cta.Button}
          />
        </GridCell>
      )}
    </Grid>
    </FadeInWrapper>
  )
}

export default FAQs
