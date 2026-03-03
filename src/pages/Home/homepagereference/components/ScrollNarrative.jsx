import styled from 'styled-components'
import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import scroll2 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-2.jpeg'
import scroll3 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-3.jpeg'
import scroll4 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-4.jpeg'
import scroll5 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-5.jpeg'
import scroll6 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-6.png'
import scroll7 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-7.png'
import scroll8 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-8.png'
import scroll9 from '../../../assets/images/narrative-scroll-pics/optimized/scroll-9.jpeg'

gsap.registerPlugin(ScrollTrigger)

const imageUrls = [scroll2, scroll3, scroll4, scroll5, scroll6, scroll7, scroll8, scroll9]

const rectConfigs = [
  { start: 0,  duration: 10, startX: '-1vw',  startY: '-3vh',  exit: { x: '-100vw', y: '-100vh' }, scale: 5 },
  { start: 0,  duration: 15, startX: '2vw',   startY: '1vh',   exit: { x: '100vw',  y: '100vh' },  scale: 5 },
  { start: 3.5,  duration: 15, startX: '-3vw',  startY: '-2vh',  exit: { x: '-100vw', y: '100vh' },   scale: 5 },
  { start: 5,  duration: 10, startX: '2vw',  startY: '4vh',   exit: { x: '100vw',  y: '-100vh' },   scale: 5 },
  { start: 6.5,  duration: 17, startX: '0',     startY: '-1vh',  exit: { x: '-100vw', y: '100vh' },   scale: 5 },
  { start: 9,  duration: 15, startX: '-2vw',  startY: '2vh',   exit: { x: '100vw',  y: '-100vh' },   scale: 5 },
  { start: 15,  duration: 10, startX: '1vw',   startY: '-1vh',  exit: { x: '-100vw', y: '-100vh' },  scale: 5 },
  { start: 25,  duration: 8, startX: '-1vw',  startY: '3vh',   exit: { x: '100vw',  y: '100vh' },   scale: 5 },
]

const ScrollNarrativeSection = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /* background: #f5f5f5; */
  perspective: 1200px;
  background-color: var(--color-forest);

  @media (max-width: 768px) {
    perspective: 800px;
  }

  @media (max-width: 480px) {
    perspective: 600px;
  }
`

const RectanglesContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transform-style: preserve-3d;
`

const BlurRectangle = styled.div`
  position: absolute;
  width: 250px;
  height: 250px;
  left: 50%;
  top: 50%;
  background: rgba(107, 107, 107, 0.5);
  transform-origin: center center;
  will-change: transform, filter;
  backface-visibility: hidden;
  overflow: hidden;
  opacity: 0;

  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
  }
`

const BlurRectangleImage = styled.img.attrs({ decoding: 'async' })`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
`

const SCROLL_TEXTS = [
  'Imagine Toronto with a groundbreaking multi-use trail that connects diverse neighbourhoods across the city.',
  '80km of accessible paths for hiking, biking, community, and adventuring.',
  'Making the city more explorable, accessible, and supporting the local economy.',
  'Opening up brand new ways for Torontonians to explore the rich and unique natural landscapes of the city.'
]

const CenteredTextWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 10;
  width: 100%;
  pointer-events: none;
`

const TextSlide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`

const CenteredText = styled.p`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: clamp(3rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-lime);

  @media (max-width: 768px) {
    max-width: 100%;
    font-size: clamp(1.25rem, 4.5vw, 2rem);
    line-height: 1.3;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.1rem, 5vw, 1.5rem);
    line-height: 1.35;
  }
`

function ScrollNarrative() {
  const sectionRef = useRef(null)
  const text1Ref = useRef(null)
  const text2Ref = useRef(null)
  const text3Ref = useRef(null)
  const text4Ref = useRef(null)
  const rect1Ref = useRef(null)
  const rect2Ref = useRef(null)
  const rect3Ref = useRef(null)
  const rect4Ref = useRef(null)
  const rect5Ref = useRef(null)
  const rect6Ref = useRef(null)
  const rect7Ref = useRef(null)
  const rect8Ref = useRef(null)
  const [imagesReady, setImagesReady] = useState(false)

  // Preload and decode all images so they're ready before scroll animation (reduces lag)
  useEffect(() => {
    const preload = async () => {
      try {
        await Promise.all(
          imageUrls.map((src) => {
            const img = new Image()
            img.src = src
            return img.decode()
          })
        )
        setImagesReady(true)
      } catch {
        setImagesReady(true)
      }
    }
    preload()
  }, [])

  useEffect(() => {
    if (!imagesReady) return

    const section = sectionRef.current
    const rects = [
      rect1Ref.current,
      rect2Ref.current,
      rect3Ref.current,
      rect4Ref.current,
      rect5Ref.current,
      rect6Ref.current,
      rect7Ref.current,
      rect8Ref.current
    ]

    if (!section || rects.some(r => !r)) return

    // Adjust scale based on viewport width for mobile
    const isMobile = window.innerWidth <= 768
    const isSmallMobile = window.innerWidth <= 480
    const scaleMultiplier = isSmallMobile ? 0.5 : isMobile ? 0.65 : 1

    const textEls = [text1Ref.current, text2Ref.current, text3Ref.current, text4Ref.current]
    textEls.forEach(el => { if (el) gsap.set(el, { opacity: 0 }) })

    // Initialize each rectangle: closer to center (x,y), small scale, far away, blurry
    rectConfigs.forEach((cfg, i) => {
      const rect = rects[i]
      gsap.set(rect, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        x: cfg.startX,
        y: cfg.startY,
        scale: 0.2,
        z: -400,
        opacity: 0,
        filter: 'blur(100px)'
      })
    })

    // Separate pin ScrollTrigger - releases before animation completes
    const pinTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=700%', // Pin releases at 70% of the animation
      pin: true,
      anticipatePin: 1
    })

    // Animation timeline - continues after pin releases
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1000%',
        scrub: true
      }
    })

    // Text sequence — each fully fades out before the next fades in
    const fadeOutStart = [6, 13, 20]
    const fadeInStart = [7, 14, 21]  // Longer gap after first sentence (was 5, now 7)
    const fadeDuration = 1
    textEls.forEach((el, i) => {
      if (!el) return
      if (i === 0) {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: fadeDuration * 0.5, ease: 'power2.out' }, 0)
        tl.to(el, { opacity: 0, duration: fadeDuration, ease: 'power2.inOut' }, fadeOutStart[0])
      } else if (i < 3) {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: fadeDuration * 0.5, ease: 'power2.out' }, fadeInStart[i - 1])
        tl.to(el, { opacity: 0, duration: fadeDuration, ease: 'power2.inOut' }, fadeOutStart[i])
      } else {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: fadeDuration * 0.5, ease: 'power2.out' }, fadeInStart[2])
      }
    })

    // Build timeline — scale, move, blur, opacity
    rectConfigs.forEach((cfg, i) => {
      const rect = rects[i]

      // Opacity: fully visible by 10% of animation (starts slow, gets faster)
      tl.to(
        rect,
        {
          opacity: 1,
          duration: cfg.duration * 0.2,
          ease: 'power2.in'
        },
        cfg.start
      )

      // Main animation: scale, move (starts slow, gets faster)
      tl.to(
        rect,
        {
          scale: cfg.scale * scaleMultiplier,
          z: 0,
          x: cfg.exit.x,
          y: cfg.exit.y,
          duration: cfg.duration,
          ease: 'power2.in'
        },
        cfg.start
      )

      // Blur: extremely blurry → sharp by 20% of animation (starts slow, gets faster)
      tl.to(
        rect,
        {
          filter: 'blur(0px)',
          duration: cfg.duration * 0.45,
          ease: 'power2.in'
        },
        cfg.start
      )
    })

    // Handle resize for orientation changes
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      pinTrigger.kill()
      tl.scrollTrigger?.kill()
    }
  }, [imagesReady])

  return (
    <ScrollNarrativeSection ref={sectionRef}>
      <CenteredTextWrapper>
        <TextSlide ref={text1Ref}>
          <CenteredText>{SCROLL_TEXTS[0]}</CenteredText>
        </TextSlide>
        <TextSlide ref={text2Ref}>
          <CenteredText>{SCROLL_TEXTS[1]}</CenteredText>
        </TextSlide>
        <TextSlide ref={text3Ref}>
          <CenteredText>{SCROLL_TEXTS[2]}</CenteredText>
        </TextSlide>
        <TextSlide ref={text4Ref}>
          <CenteredText>{SCROLL_TEXTS[3]}</CenteredText>
        </TextSlide>
      </CenteredTextWrapper>
      <RectanglesContainer>
        <BlurRectangle ref={rect1Ref} $width="26vw" $height="36vh">
          <BlurRectangleImage src={imageUrls[0]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect2Ref} $width="22vw" $height="32vh">
          <BlurRectangleImage src={imageUrls[1]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect3Ref} $width="28vw" $height="38vh">
          <BlurRectangleImage src={imageUrls[2]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect4Ref} $width="24vw" $height="34vh">
          <BlurRectangleImage src={imageUrls[3]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect5Ref} $width="25vw" $height="35vh">
          <BlurRectangleImage src={imageUrls[4]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect6Ref} $width="23vw" $height="33vh">
          <BlurRectangleImage src={imageUrls[5]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect7Ref} $width="27vw" $height="37vh">
          <BlurRectangleImage src={imageUrls[6]} alt="" />
        </BlurRectangle>
        <BlurRectangle ref={rect8Ref} $width="24vw" $height="34vh">
          <BlurRectangleImage src={imageUrls[7]} alt="" />
        </BlurRectangle>
      </RectanglesContainer>
    </ScrollNarrativeSection>
  )
}

export default ScrollNarrative
