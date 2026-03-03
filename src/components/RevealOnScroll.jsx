import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import gsap from 'gsap'

const Wrapper = styled.div`
  opacity: 0;
`

/**
 * Fades in children when the element enters the viewport.
 * Triggers once — no re-animation on scroll out.
 *
 * @param {React.ReactNode} children
 * @param {number} [delay=0] - GSAP delay in seconds
 */
function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.unobserve(el)
        gsap.to(el, {
          opacity: 1,
          duration: 0.55,
          delay,
          ease: 'power2.out',
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return <Wrapper ref={ref}>{children}</Wrapper>
}

export default RevealOnScroll
