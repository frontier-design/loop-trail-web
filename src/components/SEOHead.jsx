import { Helmet } from 'react-helmet-async'
import { getStrapiUrl } from '../api/strapi.js'

const DEFAULTS = {
  title: 'Loop Trail',
  description:
    "Discover Toronto's groundbreaking 80km trail network connecting neighbourhoods, parks, transit, and waterfront destinations.",
}

function getImageUrl(media) {
  const attrs = media?.data?.attributes ?? media?.attributes ?? media
  const url = attrs?.url ?? media?.url
  if (!url) return null
  return String(url).startsWith('http') ? url : getStrapiUrl(url)
}

function SEOHead({ meta }) {
  const title = meta?.MetaTitle || meta?.metaTitle || DEFAULTS.title
  const description =
    meta?.MetaDescription || meta?.metaDescription || DEFAULTS.description
  const imageUrl = getImageUrl(
    meta?.MetaImage ??
    meta?.metaImage ??
    meta?.MetaImage_1200x630_max500kb
  )

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  )
}

export default SEOHead
