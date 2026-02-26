import { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Grid, GridCell } from '../grid'
import { postNewsletterSubscription } from '../api/strapi.js'

const FOOTER_LINKS = [
  { label: 'Hubs', to: '/hubs' },
  { label: 'Indigenous Stewardship', to: '/indigenous-stewardship' },
  { label: 'Maps', to: '/maps' },
  { label: 'FAQs', to: '/faqs' },
]

const FooterWrapper = styled.footer`
  background: var(--color-forest);
  color: white;
  padding: 3rem 0;
`

const FooterGrid = styled(Grid)`
  align-items: stretch;
`

const LeftCell = styled(GridCell)`
  display: flex;
  flex-direction: column;
`

const NavColumn = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

`

const FooterLink = styled(Link)`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: white;
  text-decoration: none;
  transition: opacity 0.2s ease;
  display: inline-flex;
  align-items: center;

  &:hover {
    opacity: 0.85;
  }

  @media (min-width: 769px) {
    font-size: 1.125rem;
  }
`

const Copyright = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 400;
  font-size: 0.875rem;
  color: white;
  margin-top: auto;
  margin-bottom: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`

const CopyrightBottom = styled(Copyright)`
  margin-top: 2rem;

  @media (min-width: 1025px) {
    display: none;
  }

  @media (max-width: 1024px) {
    display: block;
  }
`

const CopyrightCell = styled(GridCell)`
  @media (min-width: 1025px) {
    display: none;
  }
`

const NewsletterCell = styled(GridCell)`
  @media (max-width: 1024px) {
    margin-top: 2.5rem;
  }
`

const NewsletterHeading = styled.h2`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 2.5rem!important;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: white;
`

const NewsletterText = styled.p`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5;
  color: white;
  margin-bottom: 1.5rem;
`

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 1rem;

  @media (min-width: 769px) {
    flex-direction: row;
    align-items: stretch;
  }
`

const EmailInput = styled.input`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-size: 1rem;
  padding: 0.875rem 1rem;
  min-height: 44px;
  background: rgba(21, 76, 44, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  flex: 1;
  min-width: 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`

const SubmitButton = styled.button`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  min-height: 44px;
  background: var(--color-lime, #E7F5A6);
  color: var(--color-forest, #154C2C);
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    background: #d4ed8f;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (min-width: 769px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`

const StatusMessage = styled.p`
  font-size: 1rem;
  margin: 0 0 1rem;
  color: white;
  flex-basis: 100%;

  &[data-status='success'] {
    color: var(--color-lime, #E7F5A6);
  }

  &[data-status='error'] {
    color: #fca5a5;
  }
`

function Footer() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const email = form.email?.value?.trim()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      await postNewsletterSubscription({ email })
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <FooterWrapper>
      <FooterGrid as="div">
        <LeftCell $span={2} $spanTablet={3} $spanMobile={4}>
          <NavColumn aria-label="Footer navigation">
            {FOOTER_LINKS.map(({ label, to }) => (
              <FooterLink key={to} to={to}>
                {label}
              </FooterLink>
            ))}
          </NavColumn>
          <Copyright>Copyright 2026</Copyright>
        </LeftCell>
        <NewsletterCell $start={4} $span={3} $startTablet={4} $spanTablet={5} $spanMobile={4}>
          <NewsletterHeading>Sign up to stay in the Loop</NewsletterHeading>
          <NewsletterText>
            We'll send you quarterly updates about the Loop, so you can stay up to date with the progress of the project. We'll also share other opportunities for you to get involved and support the project.
          </NewsletterText>
          <NewsletterForm onSubmit={handleSubmit}>
            {status === 'success' && (
              <StatusMessage data-status="success" role="status">
                Thanks for signing up! We&apos;ll keep you in the loop.
              </StatusMessage>
            )}
            {status === 'error' && (
              <StatusMessage data-status="error" role="alert">
                {errorMessage}
              </StatusMessage>
            )}
            <EmailInput
              type="email"
              name="email"
              placeholder="Your Email Here"
              aria-label="Email address for newsletter"
              required
            />
            <SubmitButton type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Signing up...' : 'Submit'}
            </SubmitButton>
          </NewsletterForm>
        </NewsletterCell>
        <CopyrightCell $span={2} $spanTablet={8} $spanMobile={4}>
          <CopyrightBottom>Copyright 2026</CopyrightBottom>
        </CopyrightCell>
      </FooterGrid>
    </FooterWrapper>
  )
}

export default Footer
