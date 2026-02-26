## Strapi (Headless CMS)

This project fetches content from a **Strapi** instance. The CMS for this app is the sibling project **loop-trail-cms** (same parent folder as this repo).

### Start the CMS

From the parent folder (e.g. `Loop Trail MF`):

```bash
cd loop-trail-cms
npm run develop
```

On first run, a browser tab will open so you can create the first admin user. The API is at `http://localhost:1337`, admin at `http://localhost:1337/admin`.

### Setup (if you need a new Strapi project)

1. Create a Strapi project:
   ```bash
   npx create-strapi@latest my-strapi-project --non-interactive --skip-cloud --no-run --use-npm
   ```
   See the [Quick Start Guide](https://docs.strapi.io/cms/quick-start) for details.

2. Set `VITE_STRAPI_URL` in `.env` to point to your running Strapi instance:
   ```
   VITE_STRAPI_URL=http://localhost:1337
   ```

3. In the Strapi Admin panel, go to **Settings → Users & Permissions → Roles → Public** and enable **find** / **findOne** for any collection types you want to expose publicly.

### Usage

Use the helper in `src/api/strapi.js` to fetch content:

```js
import { fetchStrapi, getStrapiUrl } from './api/strapi.js'

// Fetch a collection
const { data } = await fetchStrapi('/api/restaurants?populate=*')

// Build a full URL (e.g. for images)
const imageUrl = getStrapiUrl(data[0].image.url)
```

### Docs

- [Strapi](https://strapi.io/)
- [CMS Introduction](https://docs.strapi.io/cms/intro)
- [Quick Start Guide](https://docs.strapi.io/cms/quick-start)
