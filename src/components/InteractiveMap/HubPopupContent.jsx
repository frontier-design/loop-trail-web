import styled from 'styled-components'

const Wrapper = styled.a`
  display: block;
  width: 300px;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
`

const ImageWrap = styled.div`
  width: 100%;
  max-height: 180px;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
`

const TextSection = styled.div`
  padding: 1rem 1.25rem;
  padding-bottom: 1.5rem;
  background: var(--color-mint);
  color: var(--color-forest);
`

const Title = styled.h3`
  margin: 1rem 0 1.25rem 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-forest);
`

const Description = styled.p`
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--color-forest);
`

const LearnMoreText = styled.span`
  color: var(--color-forest);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
  font-size: 1rem;
`

export default function HubPopupContent({ title, imageUrl, description, hubId }) {
  const hasImage = Boolean(imageUrl)
  const href = hubId ? `/hubs#${hubId}` : '/hubs'

  return (
    <Wrapper href={href}>
      {hasImage && (
        <ImageWrap>
          <img src={imageUrl} alt={title || ''} />
        </ImageWrap>
      )}
      <TextSection>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}...</Description>}
        <LearnMoreText>Click to learn more &rarr;</LearnMoreText>
      </TextSection>
    </Wrapper>
  )
}
