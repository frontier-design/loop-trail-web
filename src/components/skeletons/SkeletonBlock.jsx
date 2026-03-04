import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, #d0d0d0 25%, #ececec 50%, #d0d0d0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 2px;
  width: ${p => p.$width ?? '100%'};
  height: ${p => p.$height ?? '1rem'};
  margin-bottom: ${p => p.$mb ?? '0'};
`

export default SkeletonBlock
