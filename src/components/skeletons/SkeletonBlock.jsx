import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`

const SkeletonBlock = styled.div`
  background: linear-gradient(90deg, #e8e8e8 25%, #f0f0f0 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 2px;
  width: ${p => p.$width ?? '100%'};
  height: ${p => p.$height ?? '1rem'};
  margin-bottom: ${p => p.$mb ?? '0'};
`

export default SkeletonBlock
