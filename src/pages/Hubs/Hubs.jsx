import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { fetchStrapiWithStatus, getStrapiUrl } from '../../api/strapi.js'
import { renderStrapiRichText } from '../../api/strapiRichText.jsx'
import PageIntro from '../../components/PageIntro.jsx'
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

function Hubs() {
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

  if (loading) return <Grid as="main"><GridCell $start={1} $span={6}><Loading>Loading…</Loading></GridCell></Grid>
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

  return (
    <Grid as="main">
      <GridCell $start={1} $span={6}>
        <PageIntro
          headline={headline}
          heroSrc={heroSrc}
          heroAlt={heroAlt}
          isVideo={isVideo}
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
              <HubItem key={item?.id ?? i} item={item} index={i} />
            ))}
          </HubItemList>
        </GridCell>
      )}
    </Grid>
  )
}

export default Hubs
