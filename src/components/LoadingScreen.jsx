import { useState, useRef, useCallback, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { LOOP_TRAIL_LOADING_PATHS, LOOP_TRAIL_LOADING_LENGTHS } from '../assets/icons/loopTrailLoadingPaths.js'

const TOTAL_TRACE_DURATION = 1.8

const TOTAL_TRACE_LENGTH = LOOP_TRAIL_LOADING_LENGTHS.reduce((sum, len) => sum + len, 0)

const TRACE_TIMINGS = (() => {
  let cumulative = 0
  return LOOP_TRAIL_LOADING_LENGTHS.map((len) => {
    const delay = (cumulative / TOTAL_TRACE_LENGTH) * TOTAL_TRACE_DURATION
    const duration = (len / TOTAL_TRACE_LENGTH) * TOTAL_TRACE_DURATION
    cumulative += len
    return { delay, duration }
  })
})()

const tracePath = keyframes`
  to {
    stroke-dashoffset: 0;
  }
`

const fadeOut = keyframes`
  to {
    opacity: 0;
  }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-forest);
  z-index: 99999;
  pointer-events: ${props => props.$fading ? 'none' : 'auto'};
  animation: ${props => props.$fading ? fadeOut : 'none'} 0.5s ease-out forwards;
`

const SvgWrapper = styled.div`
  width: min(80vw, 80vh);
  max-width: 363px;
  max-height: 376px;
`

const TracePath = styled.path`
  fill: none;
  stroke: var(--color-mint);
  stroke-width: 5.5;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1.05;
  stroke-dashoffset: 1.05;
  animation-name: ${tracePath};
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-iteration-count: 1;
`

function LoadingScreen({ onComplete }) {
  const [fading, setFading] = useState(false)
  const overlayRef = useRef(null)
  const timerRef = useRef(null)

  const handleTraceEnd = useCallback(() => {
    const fontsReady = document.fonts.ready
    const timeout = new Promise((resolve) => setTimeout(resolve, 3500))
    Promise.race([fontsReady, timeout]).then(() => {
      timerRef.current = setTimeout(() => setFading(true), 150)
    })
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleFadeEnd = useCallback(
    (e) => {
      if (e.target === overlayRef.current && e.propertyName === 'opacity') {
        onComplete?.()
      }
    },
    [onComplete]
  )

  return (
    <Overlay
      ref={overlayRef}
      $fading={fading}
      onAnimationEnd={handleFadeEnd}
    >
      <SvgWrapper>
        <svg
          viewBox="0 0 363 376"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {LOOP_TRAIL_LOADING_PATHS.map((d, i) => {
            const { delay, duration } = TRACE_TIMINGS[i]
            return (
              <TracePath
                key={i}
                pathLength={1}
                d={d}
                style={{
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
                onAnimationEnd={i === LOOP_TRAIL_LOADING_PATHS.length - 1 ? handleTraceEnd : undefined}
              />
            )
          })}
        </svg>
      </SvgWrapper>
    </Overlay>
  )
}

export default LoadingScreen
