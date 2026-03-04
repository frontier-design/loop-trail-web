import { useEffect, useState } from 'react'
import Landing from './components/Landing.jsx'
import HomeIntro from './components/HomeIntro.jsx'
import RevealOnScroll from '../../components/RevealOnScroll.jsx'
import { fetchCached } from '../../api/prefetchCache.js'

function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCached(
          '/api/home?populate[0]=HomeIntro&populate[1]=HomeIntro.StackingImage'
        )
        setData(res)
      } catch {
        setData(null)
      }
    }
    load()
  }, [])

  const page = data?.data ?? data ?? {}
  const homeIntroItems = Array.isArray(page?.HomeIntro) ? page.HomeIntro : []
  const firstIntro = homeIntroItems[0] ?? null

  return (
    <>
      <Landing />
      {firstIntro && (
        <RevealOnScroll>
          <HomeIntro
            introText={firstIntro.IntroText}
            stackingImage={firstIntro.StackingImage}
          />
        </RevealOnScroll>
      )}
    </>
  )
}

export default Home
