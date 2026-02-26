import React from 'react'

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
    // HTML string (contains tags)
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return <span dangerouslySetInnerHTML={{ __html: content }} />
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
    let node = block.text ?? ''
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
    case 'link':
      return <a key={key} href={url || '#'}>{childNodes}</a>
    case 'image':
      return block.image
        ? <img key={key} src={block.image.url} alt={block.image.alternativeText || ''} />
        : null
    default:
      if (childNodes) return <span key={key}>{childNodes}</span>
      return null
  }
}
