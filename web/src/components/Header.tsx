export default function Header() {
  const now = new Date().toLocaleDateString('en-ZA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <header className="border-b border-[#1a2e40] bg-[#07090c] sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#c9a96e] text-xl font-light tracking-[0.15em] uppercase">Livwell</span>
            <span className="text-[#1a2e40] text-xl">·</span>
            <span className="text-[#445a70] text-sm font-medium tracking-widest uppercase">Business OS</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-xs text-[#445a70]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-gold inline-block" />
            Live
          </div>
          <span className="text-xs text-[#445a70] hidden lg:block">{now}</span>
          <div className="w-8 h-8 rounded-full bg-[#111e2b] border border-[#1a2e40] flex items-center justify-center text-[#c9a96e] text-xs font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  )
}
