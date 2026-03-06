import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GRID } from '../../../grid/config.js'
import video1 from '../../../assets/videos/video-1.mp4'
import video2 from '../../../assets/videos/video-2.mp4'
import video3 from '../../../assets/videos/video-3.mp4'
import video4 from '../../../assets/videos/video-4.mp4'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { text: 'Imagine Toronto with a groundbreaking trail network.', video: video1 },
  { text: 'Over 80km of trails for hiking, biking, community, and adventuring.', video: video2 },
  { text: 'Making the city more explorable, accessible, and supporting the local economy.', video: video3 },
  { text: 'Opening up brand new ways to explore the rich and unique natural landscapes of the city.', video: video4 },
  { cta: true }
]

const Wrapper = styled.div`
  position: relative;
  height: 500vh;
`

const Section = styled.section`
  position: sticky;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.3;
  color: white;
  hyphens: none;
  overflow-wrap: normal;
  word-break: normal;

  @media (min-width: 480px) {
    font-size: 1.75rem;
  }

  @media (min-width: 640px) {
    font-size: 2rem;
  }

  @media (min-width: 769px) {
    font-size: 2.75rem;
    line-height: 1.2;
  }

  @media (min-width: 1024px) {
    font-size: 3.5rem;
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
    padding: 0 ${GRID.PADDING_MOBILE}px;
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
  }

  @media ${GRID.MEDIA_MOBILE} {
    font-size: 2.75rem;
  }
`

const CTAButton = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  display: inline-flex;
  align-items: center;
  background: var(--color-lime, #E7F5A6);
  color: var(--color-forest, #154C2C);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #d4ed8f;
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
    const fadeDuration = 4
    const segmentDuration = holdDuration + fadeDuration * 2

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    })

    for (let i = 0; i < 4; i++) {
      const segStart = i * segmentDuration

      tl.to(texts[i], {
        opacity: 0,
        duration: fadeDuration,
        ease: 'power2.inOut'
      }, segStart + holdDuration)

      if (i < 3) {
        tl.to(videos[i], {
          opacity: 0,
          duration: fadeDuration,
          ease: 'power2.inOut'
        }, segStart + holdDuration)

        tl.to(videos[i + 1], {
          opacity: 1,
          duration: fadeDuration,
          ease: 'power2.inOut'
        }, segStart + holdDuration)

        tl.fromTo(texts[i + 1], { opacity: 0 }, {
          opacity: 1,
          duration: fadeDuration,
          ease: 'power2.out'
        }, segStart + holdDuration + fadeDuration)
      } else {
        if (cta) {
          tl.fromTo(cta, { opacity: 0 }, {
            opacity: 1,
            duration: fadeDuration,
            ease: 'power2.out'
          }, segStart + holdDuration + fadeDuration)
        }
      }
    }

    videos.forEach(v => { v.play().catch(() => {}) })

    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(document.body)

    return () => {
      ro.disconnect()
      tl.scrollTrigger?.kill()
    }
  }, [])

  const videoSteps = STEPS.filter(s => !s.cta)

  return (
    <Wrapper ref={wrapperRef}>
    <Section ref={sectionRef}>
      <VideoContainer>
        {videoSteps.map((step, i) => (
          <VideoLayer
            key={i}
            ref={el => { videoRefs.current[i] = el }}
            src={step.video}
            autoPlay
            loop
            muted
            playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
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
          <CTATitle>
            Love Toronto<br />Love the Loop
          </CTATitle>
          <CTAButton to="/get-involved">Get Involved</CTAButton>
        </CTASlide>
      </TextOverlay>
    </Section>
    </Wrapper>
  )
}

export default StoryScroll
