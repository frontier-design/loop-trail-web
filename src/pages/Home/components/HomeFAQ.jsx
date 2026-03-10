import styled from 'styled-components'
import { Grid, GridCell, GRID } from '../../../grid/index.js'
import PageIntro from '../../../components/PageIntro.jsx'
import homeFaqImage from '../../../assets/images/home-faq.jpg'

const HOME_FAQ_DATA = {
  headline: 'YOUR QUESTIONS, ANSWERED.',
  linkText: 'Frequently Asked Questions →',
  linkHref: '/faqs',
  heroSrc: homeFaqImage,
  heroAlt: 'Children and adults observing a calm body of water along a paved trail, with dense forest in the background.',
}

const Section = styled.section`
  width: 100%;
  padding-top: 5rem;

  @media ${GRID.MEDIA_MOBILE} {
    padding-top: 2.5rem;
  }

  h1 {
    font-size: 3.25rem !important;
    letter-spacing: 0em;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4rem !important;
    }
  }

  @media (min-width: 640px) {
    h1 {
      font-size: 4.75rem !important;
    }
  }

  @media (min-width: 769px) {
    h1 {
      font-size: 5.25rem !important;
      letter-spacing: -0.025em !important;
    }
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 6rem !important;
    }
  }
`

function HomeFAQ() {
  return (
    <Section>
      <Grid as="div">
        <GridCell $start={1} $span={6} $spanMobile={4}>
          <PageIntro
            headline={HOME_FAQ_DATA.headline}
            linkText={HOME_FAQ_DATA.linkText}
            linkHref={HOME_FAQ_DATA.linkHref}
            heroSrc={HOME_FAQ_DATA.heroSrc}
            heroAlt={HOME_FAQ_DATA.heroAlt}
            compact
          />
        </GridCell>
      </Grid>
    </Section>
  )
}

export default HomeFAQ
