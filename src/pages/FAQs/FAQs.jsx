import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { fetchStrapiWithStatus, getStrapiUrl } from '../../api/strapi.js'
import PageIntro from '../../components/PageIntro.jsx'
import CTA from '../../components/CTA.jsx'
import { FAQItem } from './components/index.js'

const Loading = styled.p`
  padding: 2rem 0;
  font-size: 1rem;
  color: #666;
`

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
        const res = await fetchStrapiWithStatus(
          '/api/faqs?populate[0]=Hero&populate[1]=FAQItem&populate[2]=FAQItem.QuestionItem&populate[3]=CTA&populate[4]=CTA.Background&populate[5]=CTA.Button',
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

  if (loading) return <Grid as="main"><GridCell $start={1} $span={6}><Loading>Loading…</Loading></GridCell></Grid>
  if (error) return <Grid as="main"><GridCell $start={1} $span={6}><ErrorMsg>Error: {error}</ErrorMsg></GridCell></Grid>

  const page = data?.data ?? data
  const headline = page?.Headline ?? 'FAQs'
  const faqItems = Array.isArray(page?.FAQItem) ? page.FAQItem : []
  const cta = page?.CTA ?? null
  const hero = page?.Hero ?? null
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
        <PageIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
        />
      </GridCell>

      {faqItems.length > 0 && (
        <GridCell $start={1} $span={6}>
          {faqItems.map((item, i) => (
            <FAQItem key={item?.id ?? i} item={item} />
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
  )
}

export default FAQs
