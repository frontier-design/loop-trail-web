import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { fetchCached } from '../../api/prefetchCache.js'
import { renderStrapiRichText } from '../../api/strapiRichText.jsx'
import PageIntro from '../../components/PageIntro.jsx'
import PageSkeleton from '../../components/skeletons/PageSkeleton.jsx'
import FadeInWrapper from '../../components/FadeInWrapper.jsx'
import RevealOnScroll from '../../components/RevealOnScroll.jsx'
import { ExplainerSection, StewardshipItems } from './components/index.js'
import SEOHead from '../../components/SEOHead.jsx'

const IntroParagraph = styled.div`
  white-space: pre-line;
`

const IntroHeading = styled.h2`
  font-size: 2rem !important;
  line-height: 1.15;

  @media (min-width: 769px) {
    font-size: 2.75rem !important;
  }

  @media (min-width: 1025px) {
    font-size: 3.5rem !important;
  }
`

const IntroSection = styled.div`
  margin-top: 4rem;
`

const ErrorMsg = styled.p`
  padding: 2rem 0;
  font-size: 1rem;
  color: crimson;
`

function IndigenousStewardship() {
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
          '/api/indigenous-stewardship?populate[0]=Hero&populate[1]=ExplainerImage&populate[2]=ComponentExplainer&populate[3]=ComponentExplainer.Image&populate[4]=Meta&populate[5]=Meta.MetaImage',
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

  if (loading) return <PageSkeleton cardRows={3} />

  if (error) {
    return (
      <Grid as="main">
        <GridCell $start={1} $span={6}>
          <ErrorMsg>Error: {error}</ErrorMsg>
        </GridCell>
      </Grid>
    )
  }

  const page = data?.data ?? data
  const headline = page?.Headline ?? 'Indigenous Stewardship'

  const introTitle = page?.IntroTitle ?? ''
  const introParagraph = page?.IntroParagraph ?? ''
  const explainerText = page?.ExplainerText ?? null
  const explainerImage = page?.ExplainerImage ?? null
  const stewardshipItems = Array.isArray(page?.ComponentExplainer)
    ? page.ComponentExplainer
    : []
  const meta = page?.Meta ?? page?.meta ?? null

  return (
    <FadeInWrapper ready={!loading}>
    <SEOHead meta={meta} />
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <PageIntro headline={headline} />
      </GridCell>

      <GridCell $start={1} $span={6}>
        <RevealOnScroll>
          <ExplainerSection
            explainerText={explainerText}
            explainerImage={explainerImage}
            websiteUrlOverride="/"
          />
        </RevealOnScroll>
      </GridCell>

      {(introTitle || introParagraph) && (
        <GridCell $start={1} $span={6}>
          <IntroSection>
            <Grid as="div" $fullBleed>
              {introTitle && (
                <GridCell $start={1} $span={3} $spanMobile={4}>
                  <IntroHeading>{introTitle}</IntroHeading>
                </GridCell>
              )}
              {introParagraph && (
                <GridCell $start={4} $span={3} $spanMobile={4} $startMobile={1}>
                  <IntroParagraph>{renderStrapiRichText(introParagraph, { websiteUrlOverride: '/' })}</IntroParagraph>
                </GridCell>
              )}
            </Grid>
          </IntroSection>
        </GridCell>
      )}

      {stewardshipItems.length > 0 && (
        <GridCell $start={1} $span={6}>
          <RevealOnScroll delay={0.1}>
            <StewardshipItems items={stewardshipItems} />
          </RevealOnScroll>
        </GridCell>
      )}
    </Grid>
    </FadeInWrapper>
  )
}

export default IndigenousStewardship
