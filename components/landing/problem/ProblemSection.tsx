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
    <section className="relative bg-white py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
            The problem
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Hotels have the rooms.
            <br />
            <span className="text-gray-500">OTAs own the guests.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {POINTS.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl border border-border bg-[#f7f8fc]/60 p-8 transition-all hover:border-border-strong hover:bg-surface-elevated"
            >
              <p className="font-display text-sm text-primary-500">{p.n}</p>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-border-strong bg-[#f7f8fc] p-8 md:p-12">
          <h3 className="mb-8 font-display text-lg font-semibold text-ink md:text-xl">
            Example: how OTAs capture the high-season upside
          </h3>
          <div className="grid gap-10 md:grid-cols-[1fr_1fr_auto] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">January · Low demand</p>
              <p className="mt-3 font-display text-5xl font-semibold text-ink">$85</p>
              <p className="mt-2 text-sm text-gray-500">
                Hotel sells the room early to secure occupancy.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent md:block" />
              <p className="text-xs uppercase tracking-widest text-gray-500">August · High demand</p>
              <p className="mt-3 font-display text-5xl font-semibold text-primary-500">$140</p>
              <p className="mt-2 text-sm text-gray-500">
                OTA resells the same room when demand peaks.
              </p>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-xs uppercase tracking-widest text-red-600">Margin captured by OTA</p>
              <p className="mt-2 font-display text-4xl font-semibold text-ink">$55</p>
              <p className="mt-1 text-xs text-gray-500">per room, per night</p>
            </div>
          </div>
          <p className="mt-8 text-sm leading-relaxed text-gray-500 md:text-base">
            Result: the hotel gets occupancy, but the OTA captures the pricing
            upside, guest relationship and demand data.
          </p>
        </div>
      </div>
    </section>
  )
}
