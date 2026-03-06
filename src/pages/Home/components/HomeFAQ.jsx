import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
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
