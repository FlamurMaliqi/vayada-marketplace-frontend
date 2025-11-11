import { CREATORS_SECTION } from '@/lib/constants'
import { SECTIONS } from '@/lib/constants/sections'
import { Button } from '@/components/ui'

export default function CreatorsSection() {
  return (
    <section id={SECTIONS.CREATORS} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {CREATORS_SECTION.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {CREATORS_SECTION.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 lg:p-12 order-2 lg:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              How It Works for Creators
            </h3>
            <div className="space-y-6">
              {CREATORS_SECTION.steps.map((step) => (
                <div key={step.number} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-700 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href={CREATORS_SECTION.ctaHref} className="mt-8 inline-block w-full">
              <Button variant="primary" size="md" className="w-full">
                {CREATORS_SECTION.ctaText}
              </Button>
            </a>
          </div>

          <div className="order-1 lg:order-2">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Why Join vayada?
            </h3>
            <div className="space-y-6">
              {CREATORS_SECTION.advantages.map((advantage, index) => {
                const IconComponent = advantage.icon
                return (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                        <IconComponent className={advantage.iconClassName} />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h4>
                      <p className="text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

