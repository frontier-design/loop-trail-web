import React from 'react'

const DESIGN_DE_PLUME_URL =
  'https://deplume.ca/hello?gad_source=1&gad_campaignid=22575603780&gbraid=0AAAAADzwlKxv7gFH1HRLV2h8WHAl3e2eR&gclid=Cj0KCQjw37nNBhDkARIsAEBGI8MDgRrRF98QaQRiQyKdC5klwIC9zvnM5D3m_ZoqwrMTbRoivVbufEAaAi9-EALw_wcB'

/**
 * Renders Strapi Rich Text content (plain string, HTML, or Blocks format).
 * @param {string|Array|object} content - From Strapi: plain string, HTML string, or blocks array
 * @returns {React.ReactNode}
 */
export function renderStrapiRichText(content) {
  if (content == null) return null

  // Plain string
  if (typeof content === 'string') {
    if (content.trim() === '') return null
    const withLink = content.replace(
      /<u>drafting on their website here<\/u>|drafting on their website here/gi,
      `<a href="${DESIGN_DE_PLUME_URL}" target="_blank" rel="noopener noreferrer" style="color: black;">drafting on their website here</a>`
    )
    // HTML string (contains tags) – render as HTML
    if (/<[a-z][\s\S]*>/i.test(withLink)) {
      return <span dangerouslySetInnerHTML={{ __html: withLink }} />
    }
    // Plain text – preserve line breaks
    return content
  }

  // Strapi Blocks (array of block nodes)
  if (Array.isArray(content)) {
    return content.map((block, i) => renderBlock(block, i))
  }

  // Single block object
  if (typeof content === 'object' && content !== null) {
    return renderBlock(content, 0)
  }

  return null
}

function renderBlock(block, key) {
  if (!block || typeof block !== 'object') return null

  const { type, children, level, format, url } = block

  // Text node
  if (type === 'text') {
    const text = block.text ?? ''
    const isWebsitePhrase = /^drafting on their website here$/i.test(String(text).trim())
    if (isWebsitePhrase) {
      return (
        <a
          key={key}
          href={DESIGN_DE_PLUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'black' }}
        >
          {text}
        </a>
      )
    }
    let node = text
    if (block.bold) node = <strong key={key}>{node}</strong>
    else if (block.italic) node = <em key={key}>{node}</em>
    else if (block.underline) node = <u key={key}>{node}</u>
    else if (block.strikethrough) node = <s key={key}>{node}</s>
    else if (block.code) node = <code key={key}>{node}</code>
    return <React.Fragment key={key}>{node}</React.Fragment>
  }

  // Render children recursively
  const childNodes = Array.isArray(children)
    ? children.map((child, i) => renderBlock(child, `${key}-${i}`))
    : null

  switch (type) {
    case 'paragraph':
      return <p key={key}>{childNodes}</p>
    case 'heading': {
      const tag = level >= 1 && level <= 6 ? `h${level}` : 'h2'
      return React.createElement(tag, { key }, childNodes)
    }
    case 'list': {
      const tag = format === 'ordered' ? 'ol' : 'ul'
      return React.createElement(tag, { key }, childNodes)
    }
    case 'list-item':
      return <li key={key}>{childNodes}</li>
    case 'quote':
      return <blockquote key={key}>{childNodes}</blockquote>
    case 'code':
      return <pre key={key}><code>{childNodes}</code></pre>
    case 'link': {
      const href = url ?? block.link?.url ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          key={key}
          href={href}
          {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {childNodes}
        </a>
      )
    }
    case 'image':
      return block.image
        ? <img key={key} src={block.image.url} alt={block.image.alternativeText || ''} loading="lazy" decoding="async" />
        : null
    default:
      if (childNodes) return <span key={key}>{childNodes}</span>
      return null
  }
}
