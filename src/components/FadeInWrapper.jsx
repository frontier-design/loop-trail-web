import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

const Wrapper = styled.div`
  opacity: 0;
`

/**
 * Fades in its children when `ready` becomes true.
 * Use for CMS pages: pass `ready={!loading}` so content
 * fades in smoothly once data arrives.
 *
 * @param {boolean} ready - Trigger for the fade-in animation
 * @param {React.ReactNode} children
 */
function FadeInWrapper({ ready, children }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ready || !ref.current) return
    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.45, ease: 'power2.out' }
    )
  }, [ready])

  return <Wrapper ref={ref}>{children}</Wrapper>
}

export default FadeInWrapper
