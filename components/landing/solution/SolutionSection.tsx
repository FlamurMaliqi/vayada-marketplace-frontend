const POINTS = [
  {
    n: '01',
    title: 'Data becomes the advantage',
    body: 'Hotels need to own guest, pricing and demand data to understand which channels drive profitable direct bookings.',
  },
  {
    n: '02',
    title: 'Trust becomes distribution',
    body: 'Travel decisions increasingly start with friends, family, creators and communities. Guests trust referrals more than any ad.',
  },
  {
    n: '03',
    title: 'AI automates distribution',
    body: 'Hotels can now automate pricing, guest communication and channel decisions instead of managing direct bookings manually.',
  },
]

export default function SolutionSection() {
  return (
    <section className="bg-[#f4f5fb] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-4">
            The solution
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
            AI, data and trust-based demand will define the{' '}
            <span className="text-primary-500">
              future of direct hotel distribution.
            </span>
          </h2>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {POINTS.map((p) => (
            <div
              key={p.n}
              className="rounded-2xl bg-white border border-gray-200 p-8"
            >
              <p className="text-sm font-semibold text-primary-500 mb-4">{p.n}</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
