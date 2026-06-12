import { useState, useRef, useEffect } from 'react'

/**
 * Delays mounting its children until the placeholder nears the viewport.
 *
 * Unlike RevealOnScroll (which mounts immediately and only fades opacity), this
 * does NOT render children at all until they're close to view. Use it to defer
 * heavy below-the-fold sections so their code (e.g. the maplibre chunk) and
 * network requests don't compete with above-the-fold content / LCP on load.
 *
 * @param {React.ReactNode} children
 * @param {string} [minHeight='100vh'] - Placeholder height to reserve (avoids layout shift)
 * @param {string} [rootMargin='200% 0px'] - How early to mount before entering view
 */
function DeferMount({ children, minHeight = '100vh', rootMargin = '200% 0px' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect()
          setShow(true)
        }
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  if (show) return children
  return <div ref={ref} style={{ minHeight }} aria-hidden />
}

export default DeferMount
