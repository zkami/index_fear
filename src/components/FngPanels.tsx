import type { FngPoint } from '../lib/fng'
import { fmtFullDate, fmtFullPrice, ZONES } from '../lib/fng'

export function RecentTable({ data }: { data: FngPoint[] }) {
  const rows = data.slice(-10).reverse()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
            <th className="px-3 py-2 font-medium">日期</th>
            <th className="px-3 py-2 font-medium">指数</th>
            <th className="px-3 py-2 font-medium">分类</th>
            <th className="px-3 py-2 font-medium">BTC</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.timestamp} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
              <td className="px-3 py-2.5 text-slate-500">{fmtFullDate(p.timestamp)}</td>
              <td className="px-3 py-2.5 font-semibold text-slate-900">{p.value}</td>
              <td className="px-3 py-2.5">
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700">
                  {p.classification === 'Extreme Fear'
                    ? '极度恐惧'
                    : p.classification === 'Fear'
                      ? '恐惧'
                      : p.classification === 'Neutral'
                        ? '中性'
                        : p.classification === 'Greed'
                          ? '贪婪'
                          : '极度贪婪'}
                </span>
              </td>
              <td className="px-3 py-2.5 text-amber-600">
                {typeof p.btc === 'number' ? fmtFullPrice(p.btc) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ZoneLegend() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {ZONES.map((z) => (
        <div key={z.en} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: z.color }} />
            <span className="text-xs font-medium text-slate-600">{z.name}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {z.min}–{z.max}
          </p>
        </div>
      ))}
    </div>
  )
}