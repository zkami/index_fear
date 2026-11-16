const checks = [
  { label: '标题与 Meta 优化', status: 'pass', note: '全部页面已优化' },
  { label: '移动端适配', status: 'pass', note: '响应式正常' },
  { label: '页面加载速度', status: 'warn', note: 'LCP 1.8s，可优化' },
  { label: 'Core Web Vitals', status: 'pass', note: '三项指标达标' },
  { label: 'XML Sitemap', status: 'pass', note: '已提交搜索引擎' },
  { label: 'robots.txt', status: 'fail', note: '未检测到，建议补充' },
] as const

const statusStyle: Record<string, string> = {
  pass: 'bg-emerald-500/10 text-emerald-400',
  warn: 'bg-amber-500/10 text-amber-400',
  fail: 'bg-rose-500/10 text-rose-400',
}

const statusLabel: Record<string, string> = {
  pass: '通过',
  warn: '警告',
  fail: '失败',
}

export default function HealthScore({ score }: { score: number }) {
  const r = 52
  const c = 2 * Math.PI * r
  const offset = c * (1 - score / 100)

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">SEO 健康度</p>

      <div className="mt-4 flex items-center justify-center">
        <div className="relative">
          <svg width="132" height="132" viewBox="0 0 132 132">
            <circle cx="66" cy="66" r={r} fill="none" stroke="#1e293b" strokeWidth="11" />
            <circle
              cx="66"
              cy="66"
              r={r}
              fill="none"
              stroke="url(#healthGradient)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={offset}
              transform="rotate(-90 66 66)"
            />
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{score}</span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center justify-between gap-3 text-sm">
            <div className="min-w-0">
              <p className="truncate text-slate-300">{c.label}</p>
              <p className="truncate text-xs text-slate-500">{c.note}</p>
            </div>
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
              {statusLabel[c.status]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}