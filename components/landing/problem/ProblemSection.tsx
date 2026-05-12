const POINTS = [
  {
    n: '01',
    title: 'OTAs own demand & data',
    body: 'Hotels depend on Booking.com, Airbnb and Expedia for visibility, paying 15–25% commissions while losing the guest relationship.',
  },
  {
    n: '02',
    title: 'Manual distribution',
    body: 'Direct channels like social media, email and referrals are managed separately. Direct bookings stay unpredictable and impossible to scale.',
  },
  {
    n: '03',
    title: 'No demand intelligence',
    body: "Without data on seasons, events and competitors, hotels can't optimize pricing and lose much revenue per room, per night.",
  },
]

export default function ProblemSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
            The problem
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            Hotels have the rooms.{' '}
            <span className="text-gray-400">OTAs own the guests.</span>
          </h2>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {POINTS.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-gray-200 bg-white p-8 hover:border-gray-300 transition-colors"
            >
              <p className="text-sm font-semibold text-primary-500 mb-4">{p.n}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>

        {/* OTA pricing example */}
        <div className="mt-12 md:mt-16 rounded-2xl border border-gray-200 bg-[#f4f5fb] p-8 md:p-10">
          <p className="text-sm font-semibold text-gray-900 mb-6">
            Example: how OTAs capture the high-season upside
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <p className="text-xs text-gray-500 mb-2">January · Low demand</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">$85</p>
              <p className="text-xs text-gray-600">
                Hotel sells the room early to secure occupancy.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-gray-200 p-6">
              <p className="text-xs text-gray-500 mb-2">August · High demand</p>
              <p className="text-3xl font-bold text-primary-500 mb-2">$140</p>
              <p className="text-xs text-gray-600">
                OTA resells the same room when demand peaks.
              </p>
            </div>
            <div className="rounded-xl bg-red-50 border border-red-100 p-6">
              <p className="text-xs text-red-700 mb-2">Margin captured by OTA</p>
              <p className="text-3xl font-bold text-red-600 mb-2">$55</p>
              <p className="text-xs text-red-700">per room, per night</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-gray-600 leading-relaxed">
            Result: the hotel gets occupancy, but the OTA captures the pricing
            upside, guest relationship and demand data.
          </p>
        </div>
      </div>
    </section>
  )
}
