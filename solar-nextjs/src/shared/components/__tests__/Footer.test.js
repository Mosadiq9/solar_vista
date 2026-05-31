import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

// Mock the NewsletterForm since it might be complex or have its own dependencies
jest.mock('@/features/landing/components/NewsletterForm', () => {
  return function MockNewsletterForm() {
    return <div data-testid="newsletter-form-mock" />
  }
})

describe('Footer Component', () => {
  it('renders the footer content properly', () => {
    render(<Footer />)
    
    // Check if the logo/brand name exists (assuming 'Solar Vista' is somewhere in the footer)
    // We can also just check if the mock NewsletterForm is rendered
    expect(screen.getByTestId('newsletter-form-mock')).toBeInTheDocument()
  })
})
