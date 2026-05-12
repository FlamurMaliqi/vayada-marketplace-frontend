const PROPERTIES = [
  'Green Poya Resort',
  'Santa Teresa Surfing Villa',
  'Sapo Management',
  'Aether Hilltop Villas',
  'Organic Harmony',
  'Nirvana Tetebatu',
  'Kimah Villas',
  'Kalima Resort Lombok',
]

export default function TrustedBy() {
  const items = [...PROPERTIES, ...PROPERTIES]
  return (
    <section className="border-y border-border bg-[#f7f8fc]/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-gray-500">
          Trusted by independent properties
        </p>
        <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {items.map((name, idx) => (
              <span
                key={idx}
                className="flex shrink-0 items-center font-display text-lg font-medium text-gray-500/80"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
