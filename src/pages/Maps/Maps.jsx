import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import { Grid, GridCell } from '../../grid/index.js'
import { GRID } from '../../grid/config.js'
import { getStrapiUrl } from '../../api/strapi.js'
import { fetchCached } from '../../api/prefetchCache.js'
import PageIntro from '../../components/PageIntro.jsx'
import PageSkeleton from '../../components/skeletons/PageSkeleton.jsx'
import FadeInWrapper from '../../components/FadeInWrapper.jsx'
import MapContainer from './components/MapContainer.jsx'

const IntroSection = styled.div`
  margin-bottom: 6rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-bottom: 2.5rem;
  }
`

const ErrorMsg = styled.p`
  padding: 2rem 0;
  font-size: 1rem;
  color: crimson;
`

function Maps() {
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
          '/api/maps?populate[0]=Hero&populate[1]=MapContainer&populate[2]=MapContainer.MapThumbnail&populate[3]=MapContainer.MapDownloadLink&populate[4]=MapContainer.MapDownloadLink.MapFile',
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

  if (loading) return <PageSkeleton cardRows={2} />
  if (error) return <Grid as="main"><GridCell $start={1} $span={6}><ErrorMsg>Error: {error}</ErrorMsg></GridCell></Grid>

  const page = data?.data ?? data ?? {}
  const rawHeadline = page?.Headline 
  const headline =
    typeof rawHeadline === 'string' && /Loop Trail\s+Maps/i.test(rawHeadline)
      ? <>Loop Trail<br />Maps</>
      : rawHeadline
  const introTitle = page?.IntroTitle ?? ''
  const introParagraph = page?.IntroParagraph ?? ''
  const mapItems = Array.isArray(page?.MapContainer) ? page.MapContainer : []
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
                <GridCell $start={1} $span={12}>
                  <h2>{introTitle}</h2>
                </GridCell>
              )}
            </Grid>
          </IntroSection>
        )}
      </GridCell>

      {mapItems.length > 0 && (
        <GridCell $start={1} $span={6}>
          <MapContainer items={mapItems} />
        </GridCell>
      )}
    </Grid>
    </FadeInWrapper>
  )
}

export default Maps
