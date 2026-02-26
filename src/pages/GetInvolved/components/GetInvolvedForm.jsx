import { useState } from 'react'
import styled from 'styled-components'
import { GRID } from '../../../grid/config.js'
import { postGetInvolvedSubmission } from '../../../api/strapi.js'

const FormWrapper = styled.div`
  color: black;
  margin-bottom: 6rem;
  margin-top: 3rem;

  @media ${GRID.MEDIA_MOBILE} {
    margin-bottom: 2.5rem;
    margin-top: 1.5rem;
  }
`

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (min-width: 769px) {
    font-size: 1.75rem;
  }
`

const FormEl = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media ${GRID.MEDIA_MOBILE} {
    grid-template-columns: 1fr;
  }
`

const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  background: white;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: var(--color-forest, #154C2C);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.6rem 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  border: 1px solid #ccc;
  background: white;
  box-sizing: border-box;
  resize: vertical;
  outline: none;

  &::placeholder {
    color: #666;
  }

  &:focus {
    border-color: var(--color-forest, #154C2C);
  }
`

const SubmitBtn = styled.button`
  font-family: 'ABCDiatype', system-ui, sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.6rem 1.25rem;
  min-height: 44px;
  background: var(--color-forest, #154C2C);
  color: var(--color-lime, #E7F5A6);
  border: none;
  cursor: pointer;
  outline: none;
  transition: background 0.2s ease, color 0.2s ease;
  width: fit-content;

  &:hover {
    background: #0f3d22;
  }

  &:focus {
    background: #0f3d22;
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

const EmailFooter = styled.p`
  margin-top: 1rem;
  font-size: 1rem;

  a {
    color: currentColor;
    text-decoration: underline;
    text-underline-offset: 4px;
    outline: none;
  }

  a:focus {
    text-decoration-thickness: 2px;
  }
`

const StatusMessage = styled.p`
  font-size: 1rem;
  margin: 0;
  padding: 0.75rem 0;

  &[data-status='success'] {
    color: var(--color-forest, #154C2C);
  }

  &[data-status='error'] {
    color: #b91c1c;
  }
`

const SuccessCard = styled.div`
  padding: 1.5rem;
  background: rgba(21, 76, 44, 0.08);
  border: 1px solid var(--color-forest, #154C2C);
  color: var(--color-forest, #154C2C);
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
`

function GetInvolvedForm() {
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const form = e.target
    const formData = {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      organization: form.organization.value.trim() || undefined,
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      submittedAt: new Date().toISOString(),
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      await postGetInvolvedSubmission(formData)
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <FormWrapper>
      {status === 'success' && (
        <SuccessCard role="status">
          Thanks, we&apos;ve received your submission. We&apos;ll be in touch soon.
        </SuccessCard>
      )}
      <FormTitle>Send Us a Message</FormTitle>
      <FormEl onSubmit={handleSubmit}>
        {status === 'error' && (
          <StatusMessage data-status="error" role="alert">
            {errorMessage}
          </StatusMessage>
        )}
        <Row>
          <Input type="text" name="firstName" placeholder="First Name" aria-label="First Name" />
          <Input type="text" name="lastName" placeholder="Last Name" aria-label="Last Name" />
        </Row>
        <Input
          type="text"
          name="organization"
          placeholder="Organization (Optional)"
          aria-label="Organization (Optional)"
        />
        <Input type="email" name="email" placeholder="Email" aria-label="Email" required />
        <Textarea
          name="message"
          placeholder="How would you like to get involved?"
          aria-label="How would you like to get involved?"
          rows={4}
        />
        <SubmitBtn type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Submit'}
        </SubmitBtn>
      </FormEl>
      <EmailFooter>
        Prefer to send us an email? Email{' '}
        <a href="mailto:looptrail@evergreen.ca">looptrail@evergreen.ca</a>
      </EmailFooter>
    </FormWrapper>
  )
}

export default GetInvolvedForm
