import type { ReactNode } from 'react'
import { formatDelta } from '../lib/format'

type Props = {
  title: string
  value: string
  delta?: number
  hint?: string
  icon: ReactNode
}

export default function StatCard({ title, value, delta, hint, icon }: Props) {
  const positive = (delta ?? 0) >= 0
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</p>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta !== undefined && (
          <span
            className={`rounded px-1.5 py-0.5 font-medium ${
              positive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}
          >
            {formatDelta(delta)}
          </span>
        )}
        {hint && <span className="text-slate-500">{hint}</span>}
      </div>
    </div>
  )
}