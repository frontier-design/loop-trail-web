import styled from 'styled-components'
import { forwardRef } from 'react'
import { GRID } from '../../../grid/config.js'

const CursorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: 1rem;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  will-change: transform, opacity;
  opacity: 0;
  transition: opacity 0.2s ease;

  &.visible {
    opacity: 1;
  }

  @media ${GRID.MEDIA_TABLET} {
    display: none;
  }
`

const PlayIconWrapper = styled.span`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CustomCursor = forwardRef(({ isVisible }, ref) => {
  return (
    <CursorContainer ref={ref} className={isVisible ? 'visible' : ''}>
      <PlayIconWrapper aria-hidden>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="8,5 8,19 18,12" />
        </svg>
      </PlayIconWrapper>
      Watch the launch video
    </CursorContainer>
  )
})

CustomCursor.displayName = 'CustomCursor'

export default CustomCursor
