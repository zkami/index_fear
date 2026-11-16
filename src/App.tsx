import { useEffect, useMemo, useState } from 'react'
import FngChart from './components/FngChart'
import { RecentTable, ZoneLegend } from './components/FngPanels'
import { dateKey, fetchBtcPrices, fetchFng, fmtFullDate, fmtFullPrice, zoneOf, type FngPoint } from './lib/fng'

type BrushRange = { startIndex: number; endIndex: number }

export default function App() {
  const [points, setPoints] = useState<FngPoint[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  const [btcMap, setBtcMap] = useState<Map<string, number>>(new Map())
  const [btcError, setBtcError] = useState('')

  const [brush, setBrush] = useState<BrushRange | null>(null)

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchFng()
      .then((d) => {
        if (!alive) return
        setPoints(d)
        setStatus('ready')
      })
      .catch((e) => {
        if (!alive) return
        setError(e instanceof Error ? e.message : String(e))
        setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    fetchBtcPrices()
      .then((m) => {
        if (alive) setBtcMap(m)
      })
      .catch((e) => {
        if (alive) setBtcError(e instanceof Error ? e.message : String(e))
      })
    return () => {
      alive = false
    }
  }, [])

  const merged = useMemo<FngPoint[]>(
    () => points.map((p) => ({ ...p, btc: btcMap.get(dateKey(p.timestamp)) ?? null })),
    [points, btcMap],
  )

  // 默认选中最新一年
  useEffect(() => {
    if (merged.length > 1 && !brush) {
      const endIndex = merged.length - 1
      const startTs = merged[endIndex].timestamp - 365 * 86400
      let startIndex = merged.findIndex((p) => p.timestamp >= startTs)
      if (startIndex < 0) startIndex = 0
      setBrush({ startIndex, endIndex })
    }
  }, [merged, brush])

  const latest = merged[merged.length - 1]
  const brushCount = brush ? brush.endIndex - brush.startIndex + 1 : merged.length
  const rangeLabel =
    brush && merged[brush.startIndex] && merged[brush.endIndex]
      ? `${fmtFullDate(merged[brush.startIndex].timestamp)} ~ ${fmtFullDate(merged[brush.endIndex].timestamp)} · ${brushCount} 天`
      : ''

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Crypto Fear &amp; Greed Index
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              加密货币市场情绪 + BTC 价格 · 指数来源{' '}
              <a
                href="https://alternative.me/crypto/fear-and-greed-index/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                alternative.me
              </a>
              {' · '}价格来源{' '}
              <a href="https://www.binance.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                Binance
              </a>
            </p>
          </div>
          <div className="ml-auto">
            {latest?.btc != null && (
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                BTC {fmtFullPrice(latest.btc)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {btcError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
            BTC 价格加载失败（不影响指数）：{btcError}
          </div>
        )}

        {status === 'loading' && (
          <div className="flex h-96 items-center justify-center text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
              正在读取本地数据…
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
            数据读取失败：{error}
          </div>
        )}

        {status === 'ready' && latest && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">历史走势 · 指数 vs BTC</h2>
                  <p className="text-xs text-slate-500">
                    {rangeLabel}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    指数 {latest.value} · {zoneOf(latest.value).name}
                  </span>
                  <span className="text-xs text-slate-400">左轴 0–100 · 右轴 BTC</span>
                </div>
              </div>
              <FngChart
                data={merged}
                startIndex={brush?.startIndex}
                endIndex={brush?.endIndex}
                onBrushChange={(startIndex, endIndex) => setBrush({ startIndex, endIndex })}
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">最近 10 天</h2>
                <RecentTable data={merged} />
              </section>
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">指数区间说明</h2>
                <ZoneLegend />
                <p className="mt-4 text-xs leading-relaxed text-slate-500">
                  该指数综合波动率、成交量、社交媒体情绪、市场动能与占比等指标，
                  每日更新一次。数值越低代表市场越恐惧，越高代表越贪婪。
                </p>
              </section>
            </div>
          </>
        )}

        <footer className="pt-2 text-center text-[11px] text-slate-400">
          数据来自 alternative.me 与 Binance · 不构成投资建议
        </footer>
      </main>
    </div>
  )
}