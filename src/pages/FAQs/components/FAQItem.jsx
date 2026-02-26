import styled from 'styled-components'
import { Grid, GridCell } from '../../../grid/index.js'
import FAQQuestionItem from './FAQQuestionItem.jsx'

const Section = styled.section`
  margin-bottom: 6rem;
`

const Title = styled.h2`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 0rem;
  }
`

const QuestionList = styled.div`
`

function FAQItem({ item }) {
  const title = item?.Title ?? ''
  const raw = item?.QuestionItem ?? item?.FAQQuestionItem
  const questions = Array.isArray(raw) ? raw : raw ? [raw] : []

  if (!title && questions.length === 0) return null

  return (
    <Section>
      <Grid as="div" $fullBleed>
        {title && (
          <GridCell $start={1} $span={2} $spanMobile={4}>
            <Title>{title}</Title>
          </GridCell>
        )}
        {questions.length > 0 && (
          <GridCell $start={3} $span={4} $spanMobile={4} $startMobile={1}>
            <QuestionList>
              {questions.map((q, i) => (
                <FAQQuestionItem
                  key={q?.id ?? i}
                  question={q?.Question ?? ''}
                  answer={q?.Answer ?? ''}
                />
              ))}
            </QuestionList>
          </GridCell>
        )}
      </Grid>
    </Section>
  )
}

export default FAQItem
