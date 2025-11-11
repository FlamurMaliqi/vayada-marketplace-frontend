import { HOW_IT_WORKS_STEPS } from '@/lib/constants'
import { SECTIONS } from '@/lib/constants/sections'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui'

export default function HowItWorks() {
  return (
    <section id={SECTIONS.HOW_IT_WORKS} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How vayada Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, transparent process from discovery to collaboration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-xl mb-8 text-primary-100">
            Join the transparent marketplace connecting hotels with travel creators
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`${ROUTES.SIGNUP}?type=hotel`}>
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Sign Up as Hotel
              </Button>
            </a>
            <a href={`${ROUTES.SIGNUP}?type=creator`}>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Sign Up as Creator
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

