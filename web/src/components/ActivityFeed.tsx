import { activity } from '../data/livwell'

const TYPE_ICON: Record<string, string> = {
  invoice:  '💳',
  stage:    '🔧',
  delivery: '📦',
  qa:       '✅',
  start:    '🚀',
  complete: '🏆',
}

const TYPE_COLOR: Record<string, string> = {
  invoice:  'text-[#c9a96e]',
  stage:    'text-blue-400',
  delivery: 'text-purple-400',
  qa:       'text-amber-400',
  start:    'text-emerald-400',
  complete: 'text-emerald-500',
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff}d ago`
}

export default function ActivityFeed() {
  return (
    <div className="bg-[#111e2b] border border-[#1a2e40] rounded-2xl p-6 h-full">
      <h2 className="text-sm font-semibold tracking-widest text-[#445a70] uppercase mb-1">Activity</h2>
      <p className="text-2xl font-semibold text-[#dce6f0] mb-6">Recent updates</p>

      <div className="space-y-4">
        {activity.map((a, i) => (
          <div key={a.id} className="flex gap-3" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#0d1520] border border-[#1a2e40] flex items-center justify-center text-sm flex-shrink-0">
                {TYPE_ICON[a.type]}
              </div>
              {i < activity.length - 1 && (
                <div className="w-px flex-1 bg-[#1a2e40] mt-1" />
              )}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <p className={`text-xs font-semibold ${TYPE_COLOR[a.type]} mb-0.5`}>{a.event}</p>
              <p className="text-xs text-[#dce6f0] truncate">{a.client}</p>
              <p className="text-xs text-[#445a70] mt-0.5">{timeAgo(a.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
