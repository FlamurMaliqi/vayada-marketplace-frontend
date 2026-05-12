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
    <section className="relative border-t border-border bg-white py-14 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-500">
            The solution
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            AI, data and trust-based demand will define the{' '}
            <span className="text-primary-500">
              future of direct hotel distribution.
            </span>
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
      </div>
    </section>
  )
}
