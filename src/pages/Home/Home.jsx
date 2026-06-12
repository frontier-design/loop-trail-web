import { lazy, Suspense, useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import RevealOnScroll from '../../components/RevealOnScroll.jsx'
import DeferMount from '../../components/DeferMount.jsx'
import { fetchCached } from '../../api/prefetchCache.js'
import SEOHead from '../../components/SEOHead.jsx'

const HomeIntro = lazy(() => import('./components/HomeIntro.jsx'))
const StoryScroll = lazy(() => import('./components/StoryScroll.jsx'))
const IndigenousComponent = lazy(() => import('./components/IndigenousComponent.jsx'))
const Carousel = lazy(() => import('./components/Carousel.jsx'))
const ProjectStatus = lazy(() => import('./components/ProjectStatus.jsx'))
const HomeFAQ = lazy(() => import('./components/HomeFAQ.jsx'))
const Logos = lazy(() => import('./components/Logos.jsx'))
const AtAGlance = lazy(() => import('./components/AtAGlance.jsx'))
const MapSection = lazy(() => import('./components/MapSection.jsx'))
const CTA = lazy(() => import('../../components/CTA.jsx'))

const HOME_API =
  '/api/home?populate[HomeIntro][populate]=*&populate[IndigenousHomepageComponent][populate]=*&populate[HomeCta][populate]=*&populate[WaysTheLoopWillTransformToronto][populate]=*&populate[Logos][populate][LogoItem][populate]=*&populate[SharedMeta][populate]=*&populate[StatusDescription][populate]=*'

function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCached(HOME_API)
        setData(res)
      } catch {
        setData(null)
      }
    }
    load()
  }, [])

  const page = data?.data ?? data ?? {}
  const attrs = page?.attributes ?? page
  const homeIntroRaw = attrs?.HomeIntro ?? attrs?.homeIntro ?? null
  const firstIntro = Array.isArray(homeIntroRaw) ? (homeIntroRaw[0] ?? null) : homeIntroRaw
  const indigenousData = attrs?.IndigenousHomepageComponent ?? attrs?.indigenousHomepageComponent ?? null
  const homeCtaRaw =
    attrs?.HomeCTA ??
    attrs?.homeCTA ??
    attrs?.HomeCta ??
    attrs?.homeCta ??
    null
  const homeCtaData = Array.isArray(homeCtaRaw) ? (homeCtaRaw[0] ?? null) : homeCtaRaw
  const carouselItems = Array.isArray(attrs?.WaysTheLoopWillTransformToronto)
    ? attrs.WaysTheLoopWillTransformToronto
    : Array.isArray(attrs?.waysTheLoopWillTransformToronto)
      ? attrs.waysTheLoopWillTransformToronto
      : Array.isArray(attrs?.Carousel)
        ? attrs.Carousel
        : Array.isArray(attrs?.carousel)
          ? attrs.carousel
          : []
  const logosData = Array.isArray(attrs?.Logos) ? attrs.Logos : Array.isArray(attrs?.logos) ? attrs.logos : []
  const statusItems = attrs?.StatusDescription ?? attrs?.statusDescription ?? []
  const sharedMeta = attrs?.SharedMeta ?? attrs?.sharedMeta ?? []
  const meta = Array.isArray(sharedMeta) ? (sharedMeta[0] ?? null) : sharedMeta

  return (
    <main>
      <SEOHead meta={meta} />
      <Landing />
      <Suspense fallback={null}>
        {firstIntro && (
          <RevealOnScroll>
            <HomeIntro
              introText={firstIntro.IntroText}
              stackingImage={firstIntro.StackingImage}
            />
          </RevealOnScroll>
        )}
        <StoryScroll />

        {indigenousData && (
          <RevealOnScroll>
            <IndigenousComponent data={indigenousData} />
          </RevealOnScroll>
        )}
        <DeferMount minHeight="100vh">
          <RevealOnScroll>
            <MapSection />
          </RevealOnScroll>
        </DeferMount>
        <RevealOnScroll>
          <AtAGlance />
        </RevealOnScroll>

        <RevealOnScroll>
          <CTA
            title={homeCtaData?.Title ?? homeCtaData?.title ?? 'Get Involved'}
            subtitle={homeCtaData?.Subtitle ?? homeCtaData?.subtitle}
            background={homeCtaData?.Background ?? homeCtaData?.background}
            button={homeCtaData?.Button ?? homeCtaData?.button}
          />
        </RevealOnScroll>

        <RevealOnScroll>
          <Carousel items={carouselItems} />
        </RevealOnScroll>

        <RevealOnScroll>
          <ProjectStatus statusItems={statusItems} />
        </RevealOnScroll>

        <RevealOnScroll>
          <HomeFAQ />
        </RevealOnScroll>

        <RevealOnScroll>
          <Logos data={logosData} />
        </RevealOnScroll>
      </Suspense>
    </main>
  )
}

export default Home
