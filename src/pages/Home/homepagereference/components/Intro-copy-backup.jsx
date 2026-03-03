import styled from 'styled-components'
import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Grid, GridCell } from '../../../grid/index.js'
import image1 from '../../../assets/images/stack_Image1.png'
import image2 from '../../../assets/images/stack_Image2.jpg'
import image3 from '../../../assets/images/stack_Image3.png'

// Placeholder images - replace with real image paths
const introImages = [
  image1,
  image2,
  image3
]

const IntroSection = styled.section`
  padding: clamp(3rem, 6vw, 5rem) 0;
`

const TextContent = styled.div``

const LeadParagraph = styled.p`
  font-weight: 700;
  font-size: clamp(3rem, 2vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
`

const BodyParagraph = styled.p`
  /* Style body copy separately from lead — adjust as needed */
  margin-bottom: 1rem;
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 75vh;
  overflow: hidden;
  background: #e5e5e5;
`

const StackedImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  transform-origin: center;
`

function Intro() {
  const image2Ref = useRef(null)
  const image3Ref = useRef(null)
  const image1ResetRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const img2 = image2Ref.current
    const img3 = image3Ref.current
    const img1Reset = image1ResetRef.current

    if (!img2 || !img3 || !img1Reset) return

    // Set initial states
    // Image 1 base is always at scale 1 via CSS (no animation)
    gsap.set(img2, { scale: 0 })
    gsap.set(img3, { scale: 0 })
    gsap.set(img1Reset, { scale: 0 })

    // Create looping timeline
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 })

    // Image 2 scales in to 75%
    tl.to(img2, {
      scale: 0.75,
      duration: 1.2,
      ease: 'power3.out'
    })

    // Pause before next image
    tl.to({}, { duration: 0.8 })

    // Image 3 scales in to 50%
    tl.to(img3, {
      scale: 0.5,
      duration: 1.2,
      ease: 'power3.out'
    })

    // Pause before reset
    tl.to({}, { duration: 0.8 })

    // Image 1 Reset scales from 0 to 1 on top of everything
    tl.to(img1Reset, {
      scale: 1,
      duration: 1.2,
      ease: 'power3.out'
    })

    // Reset all layers for the next cycle
    tl.set(img2, { scale: 0 })
    tl.set(img3, { scale: 0 })
    tl.set(img1Reset, { scale: 0 })

    timelineRef.current = tl

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <IntroSection>
      <Grid as="div">
        <GridCell $start={1} $span={6} $startMobile={1} $spanMobile={4}>
          <TextContent>
            <LeadParagraph>
              Toronto&apos;s ravine system is the city&apos;s most defining and cherished natural treasure.
            </LeadParagraph>
            <BodyParagraph>
              They offer a vital connection to nature, weaving together rivers, valleys, parks and dozens of neighbourhoods.
            </BodyParagraph>
            <BodyParagraph>
              The Loop is a new 80km circular trail that will connect the Don and Humber valleys, the Finch Hydro Corridor and the Lake Ontario waterfront.
            </BodyParagraph>
            <BodyParagraph>
              The Loop imagines a Toronto where nature, people, and neighbourhoods are seamlessly connected.
            </BodyParagraph>
          </TextContent>
        </GridCell>
        <GridCell $start={8} $span={5} $startMobile={1} $spanMobile={4}>
          <ImageWrapper>
            <StackedImage $src={introImages[0]} style={{ zIndex: 1 }} />
            <StackedImage ref={image2Ref} $src={introImages[1]} style={{ zIndex: 2 }} />
            <StackedImage ref={image3Ref} $src={introImages[2]} style={{ zIndex: 3 }} />
            <StackedImage ref={image1ResetRef} $src={introImages[0]} style={{ zIndex: 4 }} />
          </ImageWrapper>
        </GridCell>
      </Grid>
    </IntroSection>
  )
}

export default Intro
