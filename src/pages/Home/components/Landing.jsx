import styled from 'styled-components'
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { Grid, GridCell, GRID } from '../../../grid/index.js'
import CustomCursor from './CustomCursor.jsx'

/* Navbar height for inner padding so content and buttons don't intersect with fixed navbar */
const NAVBAR_HEIGHT = '5rem'

const LandingSection = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100svh;
  min-height: 100vh;
  min-height: 100svh;
  min-height: -webkit-fill-available;
  overflow: hidden;
  background: #1a1a1a;

  @media (min-width: calc(${GRID.BREAKPOINT_TABLET} + 1px)) {
    cursor: ${props => props.$isCursorVisible ? 'none' : 'auto'};
  }
`

const VIMEO_VIDEO_ID = '1047610171'
const VIMEO_HASH = '02b5799fd9'
const VIMEO_MODAL_URL = `https://player.vimeo.com/video/${VIMEO_VIDEO_ID}?h=${VIMEO_HASH}&autoplay=1`

const VideoBackground = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 0;
  filter: saturate(1.3);
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
`

const ContentWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  padding-top: ${NAVBAR_HEIGHT};
  padding-bottom: clamp(0rem, 5vw, 2rem);

  @media ${GRID.MEDIA_MOBILE} {
    padding-bottom: calc((100vh - 100svh) + env(safe-area-inset-bottom, 0px) + 1.25rem);
  }
`

const Title = styled.h1`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(3rem, 8vw, 7rem) !important;
  letter-spacing: -0.02em;
  color: white;
  text-transform: uppercase;
  hyphens: none;
  overflow-wrap: normal;
  word-break: keep-all;

  span {
    white-space: nowrap;
    display: block;
  }
`

const Subtitle = styled.p`
  font-size: 1rem;
  line-height: 1.35;
  margin-bottom: 1rem;
  color: white;
  hyphens: none;
  overflow-wrap: normal;
  word-break: keep-all;

  span {
    display: block;
    margin-bottom: 0.75em;
  }

  span:last-child {
    margin-bottom: 0;
  }

  @media (min-width: 769px) {
    font-size: 1.25rem;
  }
`

const VideoModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95) ;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
  padding: 20px;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;
`

const VideoModalWrapper = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0.9)'};
  transition: transform 0.3s ease;
`

const VideoModalContent = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: #000;

  video,
  iframe {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border: none;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 44px;
  height: 44px;
  background: white;
  border: none;
  color: black;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
  font-size: 20px;
  line-height: 1;

  &:hover {
    opacity: 0.9;
  }
`

const LaunchVideoButton = styled.button`
  display: inline-block;
  margin-top: 1.25rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 0.5px solid rgba(255, 255, 255, 1);
  color: white;
  font-size: 1rem;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (min-width: 769px) {
    display: none;
  }
`

const VideoToggleButton = styled.button`
  position: absolute;
  bottom: clamp(2rem, 5vw, 4rem);
  right: clamp(1.25rem, 4vw, 3.125rem);
  z-index: 4;
  width: 44px;
  height: 44px;
  padding: 0;
  border-radius: 50%;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.5;
  }

  @media ${GRID.MEDIA_MOBILE} {
    bottom: calc((100vh - 100svh) + env(safe-area-inset-bottom, 0px) + 1.25rem);
  }
`

function Landing() {
  const [isCursorVisible, setIsCursorVisible] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [isBackgroundVideoPlaying, setIsBackgroundVideoPlaying] = useState(true)

  const cursorRef = useRef(null)
  const videoModalRef = useRef(null)
  const backgroundVideoRef = useRef(null)
  const isPressed = useRef(false)
  const modalTriggerRef = useRef(null)
  const modalOverlayRef = useRef(null)
  const closeButtonRef = useRef(null)

  const handleOpenVideoModal = () => {
    modalTriggerRef.current = document.activeElement
    setIsVideoModalOpen(true)
    setIsCursorVisible(false)
    requestAnimationFrame(() => { document.body.style.overflow = 'hidden' })
  }

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false)
    requestAnimationFrame(() => { document.body.style.overflow = '' })
    modalTriggerRef.current?.focus?.()
    modalTriggerRef.current = null
  }

  // Focus the close button when modal opens
  useEffect(() => {
    if (isVideoModalOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isVideoModalOpen])

  // Escape key + focus trap
  useEffect(() => {
    if (!isVideoModalOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseVideoModal()
        return
      }

      if (e.key === 'Tab') {
        const modal = modalOverlayRef.current
        if (!modal) return
        const focusable = modal.querySelectorAll('button, [href], iframe, [tabindex]:not([tabindex="-1"])')
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isVideoModalOpen])

  const handleVideoOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseVideoModal()
    }
  }

  const handleLandingClick = (e) => {
    const isInteractive = e.target.closest('[data-hide-cursor], a, button')
    if (!isInteractive && window.innerWidth >= 769) {
      handleOpenVideoModal()
    }
  }

  const handleBackgroundVideoToggle = (e) => {
    e.stopPropagation()
    if (!backgroundVideoRef.current) return
    if (isBackgroundVideoPlaying) {
      backgroundVideoRef.current.pause()
      setIsBackgroundVideoPlaying(false)
    } else {
      backgroundVideoRef.current.play().catch(() => {})
      setIsBackgroundVideoPlaying(true)
    }
  }

  const handleMouseMove = (e) => {
    const shouldHideCursor = e.target.closest('[data-hide-cursor], a, button')

    if (!cursorRef.current) return

    if (shouldHideCursor) {
      setIsCursorVisible(false)
      return
    }

    if (!isCursorVisible) {
      setIsCursorVisible(true)
    }

    const x = e.clientX
    const y = e.clientY

    gsap.to(cursorRef.current, {
      x: x,
      y: y,
      xPercent: -50,
      yPercent: -50,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto"
    })
  }

  const handleMouseEnter = (e) => {
    if (cursorRef.current) {
      gsap.set(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        xPercent: -50,
        yPercent: -50,
        scale: 0.8
      })
    }
    setIsCursorVisible(true)
    gsap.to(cursorRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    })
  }

  const handleMouseLeave = () => {
    setIsCursorVisible(false)
    isPressed.current = false
    gsap.to(cursorRef.current, {
      scale: 0.8,
      duration: 0.3,
      ease: "power2.in"
    })
  }

  const handleMouseDown = (e) => {
    const shouldHideCursor = e.target.closest('[data-hide-cursor], a, button')
    if (shouldHideCursor || !isCursorVisible || !cursorRef.current) return

    isPressed.current = true
    gsap.to(cursorRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.out"
    })
  }

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isPressed.current || !cursorRef.current) return
      isPressed.current = false

      gsap.to(cursorRef.current, {
        scale: 1.1,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto"
      }).then(() => {
        gsap.to(cursorRef.current, {
          scale: 1,
          duration: 0.5,
          ease: "back.out(2.5)",
          overwrite: "auto"
        })
      })
    }

    document.addEventListener('mouseup', handleMouseUp)
    return () => document.removeEventListener('mouseup', handleMouseUp)
  }, [])

  return (
    <>
      <LandingSection
        id="landing"
        $isCursorVisible={isCursorVisible}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onClick={handleLandingClick}
      >
        <VideoBackground
          ref={backgroundVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={`${import.meta.env.BASE_URL}video/landing-poster.jpg`}
          src={`${import.meta.env.BASE_URL}video/loop-landing-vid.mp4`}
          onPlay={() => setIsBackgroundVideoPlaying(true)}
          onPause={() => setIsBackgroundVideoPlaying(false)}
        />
        <Overlay />

        <CustomCursor
          ref={cursorRef}
          isVisible={isCursorVisible}
        />

        <ContentWrapper data-hide-cursor>
          <Grid as="div">
            <GridCell $start={1} $span={4} $startMobile={1} $spanMobile={4}>
              <Title>
                <span>A trail</span>
                <span>that moves</span>
                <span>Toronto</span>
              </Title>
            </GridCell>
            <GridCell $start={5} $span={2} $startMobile={1} $spanMobile={4}>
              <Subtitle>
              <span> A groundbreaking 80km network of trails that will connect Toronto’s ravines, neighbourhoods and people.</span>
              <span>The Loop will connect the people of Toronto with nature and each other.</span>
              <span>Made in Toronto, for everyone.</span>
              </Subtitle>
              <LaunchVideoButton type="button" data-hide-cursor onClick={handleOpenVideoModal}>
                Watch the launch video
              </LaunchVideoButton>
            </GridCell>
          </Grid>
        </ContentWrapper>

        <VideoToggleButton
          type="button"
          data-hide-cursor
          onClick={handleBackgroundVideoToggle}
          aria-label={isBackgroundVideoPlaying ? 'Pause background video' : 'Play background video'}
        >
          {isBackgroundVideoPlaying ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <rect x="5" y="4" width="3" height="12" rx="0.5" />
              <rect x="12" y="4" width="3" height="12" rx="0.5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <polygon points="8,5 8,19 18,12" />
            </svg>
          )}
        </VideoToggleButton>
      </LandingSection>

      <VideoModalOverlay ref={modalOverlayRef} $isOpen={isVideoModalOpen} onClick={handleVideoOverlayClick} aria-hidden={!isVideoModalOpen} role="dialog" aria-label="Launch video">
        <VideoModalWrapper $isOpen={isVideoModalOpen}>
          <VideoModalContent>
            <CloseButton ref={closeButtonRef} onClick={handleCloseVideoModal} aria-label="Close video" tabIndex={isVideoModalOpen ? 0 : -1}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M1 1l16 16M17 1L1 17" />
              </svg>
            </CloseButton>
            {isVideoModalOpen && (
              <iframe
                ref={videoModalRef}
                src={VIMEO_MODAL_URL}
                title="Launch video"
                allow="autoplay; fullscreen"
              />
            )}
          </VideoModalContent>
        </VideoModalWrapper>
      </VideoModalOverlay>
    </>
  )
}

export default Landing
