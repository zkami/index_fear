import type { KeywordRow, PageRow } from '../data/mock'
import { formatNumber } from '../lib/format'

function difficultyColor(d: number) {
  if (d >= 80) return 'bg-rose-500/10 text-rose-400'
  if (d >= 60) return 'bg-amber-500/10 text-amber-400'
  return 'bg-emerald-500/10 text-emerald-400'
}

export function TopKeywords({ data }: { data: KeywordRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
            <th className="px-3 py-2 font-medium">关键词</th>
            <th className="px-3 py-2 font-medium">排名</th>
            <th className="px-3 py-2 font-medium">搜索量</th>
            <th className="px-3 py-2 font-medium">流量</th>
            <th className="px-3 py-2 font-medium">难度</th>
          </tr>
        </thead>
        <tbody>
          {data.map((k) => (
            <tr
              key={k.keyword}
              className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/30"
            >
              <td className="px-3 py-2.5">
                <p className="font-medium text-slate-200">{k.keyword}</p>
                <p className="text-xs text-slate-500">{k.url}</p>
              </td>
              <td className="px-3 py-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-slate-800 text-xs font-semibold text-slate-200">
                  {k.position}
                </span>
              </td>
              <td className="px-3 py-2.5 text-slate-300">{formatNumber(k.volume)}</td>
              <td className="px-3 py-2.5 text-slate-300">{formatNumber(k.traffic)}</td>
              <td className="px-3 py-2.5">
                <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${difficultyColor(k.difficulty)}`}>
                  {k.difficulty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TopPages({ data }: { data: PageRow[] }) {
  const max = Math.max(...data.map((p) => p.visits))
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-800 text-xs uppercase tracking-wider text-slate-500">
          <th className="px-3 py-2 font-medium">页面</th>
          <th className="px-3 py-2 font-medium">访问量</th>
          <th className="px-3 py-2 font-medium">跳出率</th>
          <th className="px-3 py-2 font-medium">停留</th>
        </tr>
      </thead>
      <tbody>
        {data.map((p) => (
          <tr
            key={p.path}
            className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/30"
          >
            <td className="px-3 py-2.5">
              <p className="font-medium text-slate-200">{p.path}</p>
              <div className="mt-1.5 h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-indigo-500/70"
                  style={{ width: `${(p.visits / max) * 100}%` }}
                />
              </div>
            </td>
            <td className="px-3 py-2.5 text-slate-300">{formatNumber(p.visits)}</td>
            <td className="px-3 py-2.5 text-slate-300">{p.bounceRate}%</td>
            <td className="px-3 py-2.5 text-slate-300">{p.avgDuration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}