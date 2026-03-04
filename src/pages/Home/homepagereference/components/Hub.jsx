import styled from 'styled-components'

const HubBlock = styled.div`
  background: ${(p) => p.$bgColor};
  color: ${(p) => p.$textColor};
`

const HubImage = styled.div`
  width: 100%;
  background: ${(p) => p.$bgColor || '#e8e8e8'};
  overflow: hidden;
  max-height: 350px;
  /* center image */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const HubTitle = styled.h2`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 800;
  font-size: clamp(1.35rem, 3.25vw, 2.25rem);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0 0 0.5em 0;
  color: inherit;

  span {
    display: block;
  }
`

const HubParagraph = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(1.1rem, 1.75vw, 1.2rem);
  line-height: 1.4;
  margin: 0 0 1em 0;
  color: inherit;
  opacity: 0.95;

  &:last-child {
    margin-bottom: 0;
  }
`

const HubLink = styled.a`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: clamp(1.05rem, 1.75vw, 1.35rem);
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  transition: opacity 0.2s ease;
  font-weight: 700;

  &:hover {
    opacity: 0.85;
  }
`

const HubContent = styled.div`
  padding: 3rem;
`

/**
 * Single hub block for the map sidebar: image, title, paragraph, link, and colors.
 * @param {string} [image] - Image src (optional)
 * @param {string} [imageAlt] - Alt text for image
 * @param {string[]} title - Title lines (e.g. ['Don Mills'])
 * @param {string} paragraph - Body text
 * @param {{ text: string, href: string }} [link] - Optional link
 * @param {string} bgColor - CSS background color (e.g. 'var(--color-lime)')
 * @param {string} textColor - CSS text color (e.g. 'var(--color-forest)')
 */
function Hub({ image, imageAlt = '', title, paragraph, link, bgColor, textColor }) {
  return (
    <HubBlock $bgColor={bgColor} $textColor={textColor}>
      {image && (
        <HubImage $bgColor={bgColor}>
          <img src={image} alt={imageAlt} loading="lazy" decoding="async" />
        </HubImage>
      )}
      <HubContent>
        {title?.length > 0 && (
          <HubTitle>
            {title.map((line, j) => (
              <span key={j}>{line}</span>
            ))}
          </HubTitle>
        )}
        {paragraph && <HubParagraph>{paragraph}</HubParagraph>}
        {link?.href && link?.text && (
          <HubLink href={link.href}>
            {link.text} →
          </HubLink>
        )}
      </HubContent>
    </HubBlock>
  )
}

export default Hub
