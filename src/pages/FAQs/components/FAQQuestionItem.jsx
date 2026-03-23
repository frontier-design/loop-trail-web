import { useState, useId } from 'react'
import styled from 'styled-components'
import { renderStrapiRichText } from '../../../api/strapiRichText.jsx'

const Row = styled.div`
  margin-bottom: 1rem;
  background-color: var(--color-forest);
  color: #fff;
  transition: background-color 0.25s ease, color 0.25s ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &:hover {
    background-color: #f0f0f0;
    color: #1a1a1a;
  }
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.4;
  text-align: left;
  color: inherit;
  min-height: 44px;
  gap: 1rem;

  @media (min-width: 769px) {
    font-size: 1.5rem;
  }
`

const PlusIcon = styled.span`
  flex-shrink: 0;
  position: relative;
  width: 1.25rem;
  height: 1.25rem;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background: currentColor;
    transition: transform 0.25s ease;
  }

  &::before {
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
  }

  &::after {
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    transform: translateX(-50%) rotate(${props => (props.$isOpen ? '90deg' : '0deg')});
  }
`

const AnswerRegion = styled.div`
  overflow: hidden;
  max-height: ${props => (props.$isOpen ? '1000px' : '0')};
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  transition: max-height 0.3s ease, opacity 0.25s ease;
`

const AnswerText = styled.div`
  padding: 2rem;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 1000px;
  color: inherit;

  a {
    color: var(--color-mint);
    text-decoration: underline;
  }

  ${Row}:hover & a {
    color: inherit;
    text-decoration: underline;
  }

  p {
    margin: 0 0 1rem;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0 0 1rem;
    padding-left: 1.5rem;
  }

  li + li {
    margin-top: 0.25rem;
  }

  @media (min-width: 769px) {
    font-size: 1.1rem;
  }
`

function FAQQuestionItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  const id = useId()
  const answerId = `faq-answer-${id}`

  if (!question) return null

  return (
    <Row>
      <Trigger
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-controls={answerId}
      >
        {question}
        <PlusIcon $isOpen={isOpen} aria-hidden="true" />
      </Trigger>
      <AnswerRegion id={answerId} $isOpen={isOpen} role="region" aria-labelledby={undefined}>
        {answer && <AnswerText>{renderStrapiRichText(answer)}</AnswerText>}
      </AnswerRegion>
    </Row>
  )
}

export default FAQQuestionItem
