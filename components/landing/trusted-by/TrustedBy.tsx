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
    <section className="bg-[#f4f5fb] py-12 md:py-16 border-y border-gray-100">
      <p className="text-center text-xs uppercase tracking-[0.18em] text-gray-500 font-medium mb-8">
        Trusted by independent properties
      </p>
      <div className="relative overflow-hidden">
        <div className="flex gap-12 md:gap-16 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {items.map((name, idx) => (
            <span
              key={idx}
              className="text-base md:text-lg text-gray-500 font-medium flex-shrink-0"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
