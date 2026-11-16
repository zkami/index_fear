import { useState } from 'react'

type Props = {
  domain: string
  loading: boolean
  onSearch: (value: string) => void
}

export default function Header({ domain, loading, onSearch }: Props) {
  const [value, setValue] = useState(domain)

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/70 bg-[#0b1120]/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-lg font-black text-white shadow-lg shadow-indigo-500/20">
            S
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">SitePulse</p>
            <p className="text-[11px] text-slate-500">Website Metrics Dashboard</p>
          </div>
        </div>

        <form
          className="ml-auto flex w-full max-w-xl items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            onSearch(value)
          }}
        >
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="输入域名，例如 example.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/70 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? '查询中…' : '查询'}
          </button>
        </form>
      </div>
    </header>
  )
}