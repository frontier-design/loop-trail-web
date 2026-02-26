import styled from 'styled-components'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GRID } from '../grid'

const NAV_LINKS = [
  { label: 'Hubs', to: '/hubs' },
  { label: 'Indigenous Stewardship', to: '/indigenous-stewardship' },
  { label: 'Maps', to: '/maps' },
  { label: 'FAQs', to: '/faqs' },
]

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0;
  background: ${props => props.$onLanding ? 'transparent' : '#fff'};
  box-sizing: border-box;
  transform: translateY(${props => props.$hidden ? '-100%' : '0'});
  transition: transform 0.3s ease, background 0.2s ease;

  @media (max-width: ${GRID.BREAKPOINT}) {
    background: ${props => props.$menuOpen || !props.$onLanding ? '#fff' : 'transparent'};
  }
`

const NavInner = styled.div`
  width: 100%;
  max-width: min(${GRID.MAX_WIDTH}px, 100%);
  margin: 0 auto;
  padding: 0 ${GRID.PADDING}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;

  @media ${GRID.MEDIA_TABLET} {
    padding: 0 ${GRID.PADDING_TABLET}px;
  }

  @media ${GRID.MEDIA_MOBILE} {
    padding: 0 ${GRID.PADDING_MOBILE}px;
  }

  @media ${GRID.MEDIA_LARGE} {
    max-width: min(${GRID.MAX_WIDTH_LARGE}px, 100%);
    padding: 0 ${GRID.PADDING_LARGE}px;
  }
`

const NavLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
`

const Logo = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: ${props => props.$dark ? '#fff' : '#1a1a1a'};

  text-decoration: none;
  transition: color 0.2s ease;

  @media (min-width: 769px) {
    font-size: 1.5rem;
  }

  &:hover {
    color: ${props => props.$dark ? '#fff' : '#1a1a1a'};
  }

  @media (max-width: ${GRID.BREAKPOINT}) {
    color: ${props => props.$menuOpen ? '#1a1a1a' : (props.$dark ? '#fff' : '#1a1a1a')};
  }
`

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(1.25rem, 2.5vw, 2.5rem);
`

const NavRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: clamp(1.25rem, 2.5vw, 2.5rem);
  min-width: 0;

  @media (max-width: ${GRID.BREAKPOINT}) {
    display: none;
  }
`

const MenuToggle = styled.button`
  display: none;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: ${props => props.$dark ? '#fff' : '#1a1a1a'};
  transition: color 0.2s ease, transform 0.2s ease;

  @media (max-width: ${GRID.BREAKPOINT}) {
    display: flex;
    color: ${props => props.$menuOpen ? '#1a1a1a' : (props.$dark ? '#fff' : '#1a1a1a')};
  }

  &:hover {
    transform: scale(1.05);
  }
`

const MenuToggleIcon = styled.span`
  position: relative;
  width: 1.25rem;
  height: 1.25rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background: currentColor;
    transition: transform 0.25s ease;
  }

  &::before {
    width: 100%;
    height: 2px;
    transform: translate(-50%, -50%) ${props => props.$open ? 'rotate(45deg)' : 'rotate(0)'};
  }

  &::after {
    width: 2px;
    height: 100%;
    transform: translate(-50%, -50%) ${props => props.$open ? 'rotate(45deg)' : 'rotate(0)'};
  }
`

const MobileMenu = styled.div`
  display: none;
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: #fff;
  padding: 5rem ${GRID.PADDING_MOBILE}px 2rem;
  flex-direction: column;
  gap: 1.5rem;
  opacity: ${props => props.$open ? 1 : 0};
  visibility: ${props => props.$open ? 'visible' : 'hidden'};
  transition: opacity 0.25s ease, visibility 0.25s ease;

  @media (max-width: ${GRID.BREAKPOINT}) {
    display: flex;
    padding-top: calc(4rem + env(safe-area-inset-top));
  }
`

const MobileNavLink = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  font-size: 1.5rem;
  color: #1a1a1a;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`

const MobileCtaButton = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-lime, #E7F5A6);
  color: var(--color-forest, #154C2C);
  text-decoration: none;
  margin-top: 0.5rem;
  align-self: flex-start;
  transition: background 0.2s ease;

  &:hover {
    background: #d4ed8f;
  }
`

const NavLink = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: ${props => props.$dark ? '#fff' : '#1a1a1a'};
  text-decoration: none;
  transition: color 0.2s ease;

  @media (min-width: 769px) {
    font-size: 1rem;
  }

  &:hover {
    text-decoration: underline;
  }
`

const CtaButton = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  background: ${props => props.$dark ? 'var(--color-lime, #E7F5A6)' : 'var(--color-forest, #154C2C)'};

  @media (min-width: 769px) {
    font-size: 1rem;
  }
  color: ${props => props.$dark ? 'var(--color-forest, #154C2C)' : 'var(--color-lime, #E7F5A6)'};
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: ${props => props.$dark ? '#d4ed8f' : '#1a5c38'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`

function Navbar() {
  const [isDarkBackground, setIsDarkBackground] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)
  const programmaticScrollRef = useRef(false)
  const { pathname } = useLocation()

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const targetId =
      pathname === '/get-involved'
        ? 'fullbleed-intro'
        : pathname === '/'
          ? 'landing'
          : null

    if (!targetId) {
      const id = requestAnimationFrame(() => setIsDarkBackground(false))
      return () => cancelAnimationFrame(id)
    }

    const target = document.getElementById(targetId)
    if (!target) {
      const id = requestAnimationFrame(() => setIsDarkBackground(false))
      return () => cancelAnimationFrame(id)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsDarkBackground(entry.isIntersecting)
      },
      { threshold: 0.5, rootMargin: '-10% 0px 0px 0px' }
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    const onHubScrollStart = () => {
      programmaticScrollRef.current = true
    }
    const onHubScrollEnd = () => {
      programmaticScrollRef.current = false
    }
    window.addEventListener('hub-scroll-start', onHubScrollStart)
    window.addEventListener('hub-scroll-end', onHubScrollEnd)
    return () => {
      window.removeEventListener('hub-scroll-start', onHubScrollStart)
      window.removeEventListener('hub-scroll-end', onHubScrollEnd)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        if (programmaticScrollRef.current) {
          lastScrollY.current = y
          ticking.current = false
          return
        }
        if (y > lastScrollY.current && y > 80) {
          setIsHidden(true)
        } else {
          setIsHidden(false)
        }
        lastScrollY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const onLanding = isDarkBackground
  const dark = onLanding

  return (
    <>
      <NavBar $hidden={isHidden} $onLanding={onLanding} $menuOpen={menuOpen}>
        <NavInner>
          <NavLeft>
            <Logo to="/" $dark={dark} $menuOpen={menuOpen}>The Loop Trail</Logo>
          </NavLeft>
          <NavRight>
            <Links>
              {NAV_LINKS.map(({ label, to }) => (
                <NavLink key={to} to={to} $dark={dark}>
                  {label}
                </NavLink>
              ))}
            </Links>
            <CtaButton to="/get-involved" $dark={dark}>Get Involved</CtaButton>
          </NavRight>
          <MenuToggle
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            $dark={dark}
            $menuOpen={menuOpen}
          >
            <MenuToggleIcon $open={menuOpen} />
          </MenuToggle>
        </NavInner>
      </NavBar>
      <MobileMenu $open={menuOpen}>
        {NAV_LINKS.map(({ label, to }) => (
          <MobileNavLink key={to} to={to} onClick={closeMenu}>
            {label}
          </MobileNavLink>
        ))}
        <MobileCtaButton to="/get-involved" onClick={closeMenu}>Get Involved</MobileCtaButton>
      </MobileMenu>
    </>
  )
}

export default Navbar
