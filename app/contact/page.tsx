'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input, Textarea } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    userType: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)

    try {
      // TODO: Implement API call to submit contact form
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        userType: '',
        message: '',
      })

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    } catch (error) {
      setSubmitError('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back to Home Link */}
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Heading */}
              <div>
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Get in touch with vayada
                </h1>
                <p className="text-lg text-gray-600">
                  Tell us a little about your property or creator profile, and we'll get back to you shortly.
                </p>
              </div>

              {/* Bullet Points */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 text-lg">
                    We help independent hotels grow their direct bookings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 text-lg">
                    We connect you with creators who inspire real travelers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <CheckIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-gray-700 text-lg">
                    We answer all questions and guide you through next steps
                  </p>
                </div>
              </div>

              {/* Large Image Section */}
              <div className="w-full h-64 lg:h-80 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=3389&auto=format&fit=crop&ixlib=rb-4.0.3"
                  alt="Luxury resort with infinity pool overlooking tropical landscape"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-6 pt-8">
                <a
                  href="mailto:hello@vayada.com"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>hello@vayada.com</span>
                </a>
                <a
                  href="https://www.instagram.com/glorioushotels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://linkedin.com/company/vayada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <Input
                    label="Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Input
                    label="Phone (optional)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Company */}
                <div>
                  <Input
                    label="Company (optional)"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>

                {/* Country */}
                <div>
                  <Input
                    label="Country (optional)"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Your country"
                  />
                </div>

                {/* I am a */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I am a
                  </label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  >
                    <option value="">Select...</option>
                    <option value="hotel">Hotel Owner/Manager</option>
                    <option value="creator">Content Creator</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <Textarea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your property or creator profile..."
                  />
                </div>

                {/* Success Message */}
                {submitSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-medium">
                      Thank you! We've received your message and will get back to you shortly.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800 font-medium">{submitError}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Book a Demo'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

