import { roadmap, RoadmapItem } from '../data/livwell'

const STATUS_STYLES = {
  complete:    { dot: 'bg-emerald-500 border-emerald-500', label: 'text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-400', tag: 'DONE' },
  'in-progress': { dot: 'bg-[#c9a96e] border-[#c9a96e]', label: 'text-[#c9a96e]', badge: 'bg-[#c9a96e]/10 text-[#c9a96e]', tag: 'IN PROGRESS' },
  upcoming:    { dot: 'bg-transparent border-[#1a2e40]',  label: 'text-[#445a70]', badge: 'bg-[#1a2e40]/50 text-[#445a70]', tag: 'UPCOMING' },
}

function Phase({ item, last }: { item: RoadmapItem; last: boolean }) {
  const s = STATUS_STYLES[item.status]
  return (
    <div className="flex gap-4 flex-1">
      <div className="flex flex-col items-center">
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 ${s.dot}`} />
        {!last && <div className="w-px flex-1 bg-[#1a2e40] mt-2" />}
      </div>
      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs text-[#445a70] font-medium">{item.quarter}</span>
          <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full ${s.badge}`}>
            {s.tag}
          </span>
        </div>
        <h3 className={`font-semibold text-sm mb-1 ${item.status === 'upcoming' ? 'text-[#8aa0b8]' : 'text-[#dce6f0]'}`}>
          {item.title}
        </h3>
        <p className="text-xs text-[#445a70] mb-3">{item.description}</p>
        <div className="space-y-1.5">
          {item.milestones.map(ms => (
            <div key={ms} className="flex items-center gap-2">
              <span className={`text-xs ${item.status === 'complete' ? 'text-emerald-500' : 'text-[#445a70]'}`}>
                {item.status === 'complete' ? '✓' : '·'}
              </span>
              <span className="text-xs text-[#8aa0b8]">{ms}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RoadmapTimeline() {
  return (
    <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6">
      <h2 className="text-sm font-semibold tracking-widest text-[#445a70] uppercase mb-1">Business OS Roadmap</h2>
      <p className="text-2xl font-semibold text-[#dce6f0] mb-6">2026 milestones</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
        {roadmap.map((item, i) => (
          <Phase key={item.id} item={item} last={i === roadmap.length - 1} />
        ))}
      </div>
    </div>
  )
}
