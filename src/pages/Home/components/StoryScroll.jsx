import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GRID } from '../../../grid/config.js'
import { useMobileVideo, videoSrc } from '../../../hooks/useMobileVideo.js'
gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { text: <>Imagine Toronto with a groundbreaking, 80km trail network. <span>Brought to life by community hubs, great amenities, public art and ecological stewardship.</span></>, video: 'video-1' },
  { text: 'Making the city more explorable, accessible and supporting the local economy.', video: 'video-3' },
  { text: 'The trail is mostly there. The opportunity is to complete, enhance and better connect it.', video: 'story-vid-3' },
  { cta: true }
]

const Wrapper = styled.div`
  position: relative;
  height: 400vh;

  @media ${GRID.MEDIA_MOBILE} {
    height: 350vh;
  }
`

const Section = styled.section`
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  touch-action: pan-y;
`

const VideoContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    z-index: 1;
  }
`

const VideoLayer = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`

const TextOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
`

const TextSlide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 ${GRID.PADDING}px;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 0 ${GRID.PADDING_MOBILE}px;
  }
`

const StepText = styled.p`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  line-height: 1.25;
  color: white;
  hyphens: none;
  overflow-wrap: normal;
  word-break: normal;
  white-space: pre-line;

  @media (min-width: 480px) {
    font-size: 2.25rem;
  }

  @media (min-width: 640px) {
    font-size: 2.75rem;
  }

  @media (min-width: 769px) {
    font-size: 3.25rem;
    line-height: 1.15;
  }

  @media (min-width: 1024px) {
    font-size: 4rem;
    max-width: 1000px;
  }

  span {
    display: block;
    margin-top: 1.5rem;
  }
`

const CTASlide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 0 ${GRID.PADDING}px;
  pointer-events: auto;

  @media ${GRID.MEDIA_MOBILE} {
    padding: 0 12px;
    gap: 1rem;
  }
`

const CTATitle = styled.h2`
  text-align: center;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 800;
  font-size: 5rem;
  line-height: 1.05;
  letter-spacing: -0.025em;
  color: white;
  text-transform: uppercase;
  hyphens: none;
  overflow-wrap: normal;
  word-break: normal;

  @media (min-width: 769px) {
    font-size: 6rem;
    max-width: 1000px;
  }

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 3.5rem;
  }
`

const CTAButton = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  display: inline-flex;
  align-items: center;
  background: var(--color-brick);
  color: var(--color-on-brick);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--color-brick) 88%, black);
  }

  @media (min-width: 769px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`

function StoryScroll() {
  const wrapperRef = useRef(null)
  const sectionRef = useRef(null)
  const videoRefs = useRef([])
  const textRefs = useRef([])
  const ctaRef = useRef(null)
  const isMobile = useMobileVideo()
  const videoSteps = STEPS.filter(s => !s.cta)

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = wrapperRef.current
    if (!section || !wrapper) return

    const videos = videoRefs.current.filter(Boolean)
    const texts = textRefs.current.filter(Boolean)
    const cta = ctaRef.current

    texts.forEach((t, i) => { gsap.set(t, { opacity: i === 0 ? 1 : 0 }) })
    if (cta) gsap.set(cta, { opacity: 0 })

    videos.forEach((v, i) => {
      gsap.set(v, { opacity: i === 0 ? 1 : 0 })
    })

    const holdDuration = 8
    const fadeDuration = 7.5
    const textOverlap = 1
    const segmentDuration = holdDuration + fadeDuration * 2

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    })

    for (let i = 0; i < videoSteps.length; i++) {
      const segStart = i * segmentDuration
      const transitionStart = segStart + holdDuration
      const textInStart = transitionStart + fadeDuration * textOverlap

      tl.to(texts[i], {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.inOut'
      }, transitionStart)

      if (i < videoSteps.length - 1) {
        tl.to(videos[i], {
          opacity: 0,
          duration: fadeDuration,
          ease: 'power2.inOut'
        }, transitionStart)

        tl.to(videos[i + 1], {
          opacity: 1,
          duration: fadeDuration,
          ease: 'power2.inOut'
        }, transitionStart)

        tl.fromTo(texts[i + 1], { opacity: 0 }, {
          opacity: 1,
          duration: fadeDuration,
          ease: 'power2.inOut'
        }, textInStart)
      } else {
        if (cta) {
          tl.fromTo(cta, { opacity: 0 }, {
            opacity: 1,
            duration: fadeDuration,
            ease: 'power2.inOut'
          }, textInStart)
        }
      }
    }

    // Defer ALL video loading until the section nears the viewport. This block
    // is far below the fold, so loading its videos on mount steals bandwidth
    // from the hero video (the LCP element) and tanks mobile load time. Once
    // near, prioritize the first video, then buffer the rest after it can play.
    const firstVideo = videos[0]
    let restFallbackTimer

    const startRest = () => {
      videos.slice(1).forEach(v => {
        v.preload = 'auto'
        v.play().catch(() => {})
      })
    }

    let restStarted = false
    const startRestOnce = () => {
      if (restStarted) return
      restStarted = true
      startRest()
    }

    let loadStarted = false
    const loadVideos = () => {
      if (loadStarted) return
      loadStarted = true
      if (!firstVideo) { startRestOnce(); return }
      firstVideo.preload = 'auto'
      firstVideo.play().catch(() => {})
      if (firstVideo.readyState >= 3) {
        startRestOnce()
      } else {
        firstVideo.addEventListener('canplay', startRestOnce, { once: true })
        restFallbackTimer = setTimeout(startRestOnce, 4000)
      }
    }

    // Never start loading before the page has finished its initial load, so the
    // hero video / first paint always gets bandwidth priority.
    let pendingLoad = false
    const requestLoad = () => {
      if (loadStarted) return
      if (document.readyState === 'complete') {
        loadVideos()
      } else if (!pendingLoad) {
        pendingLoad = true
        window.addEventListener('load', loadVideos, { once: true })
      }
    }

    // Start loading when within ~half a viewport so videos are buffered shortly
    // before the user reaches the sticky section. A larger margin would fire on
    // initial load (this section sits just below the hero) and steal bandwidth
    // from the hero video, which is the LCP element.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          requestLoad()
        }
      },
      { rootMargin: '50% 0px 50% 0px' }
    )
    io.observe(wrapper)

    let refreshTimer
    const ro = new ResizeObserver(() => {
      clearTimeout(refreshTimer)
      refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
    })
    ro.observe(document.body)

    return () => {
      clearTimeout(refreshTimer)
      clearTimeout(restFallbackTimer)
      firstVideo?.removeEventListener('canplay', startRestOnce)
      window.removeEventListener('load', loadVideos)
      io.disconnect()
      ro.disconnect()
      tl.scrollTrigger?.kill()
    }
  }, [videoSteps.length])

  return (
    <Wrapper ref={wrapperRef}>
    <Section ref={sectionRef}>
      <VideoContainer>
        {videoSteps.map((step, i) => (
          <VideoLayer
            key={i}
            ref={el => { videoRefs.current[i] = el }}
            src={videoSrc(step.video, isMobile)}
            loop
            muted
            playsInline
            preload="none"
          />
        ))}
      </VideoContainer>

      <TextOverlay>
        {videoSteps.map((step, i) => (
          <TextSlide key={i} ref={el => { textRefs.current[i] = el }}>
            <StepText>{step.text}</StepText>
          </TextSlide>
        ))}

        <CTASlide ref={ctaRef}>
          <CTATitle>Love Toronto<br />Love the Loop</CTATitle>
          <CTAButton to="/get-involved">Get Involved</CTAButton>
        </CTASlide>
      </TextOverlay>
    </Section>
    </Wrapper>
  )
}

export default StoryScroll
