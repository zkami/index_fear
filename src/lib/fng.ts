/**
 * 数据文件在 public/data/ 下，构建后随站点一起发布。
 * 用 import.meta.env.BASE_URL 拼路径，兼容 GitHub Pages 子路径部署。
 */
const dataUrl = (file: string) => `${import.meta.env.BASE_URL}data/${file}`
export type FngPoint = {
  value: number
  classification: string
  timestamp: number // unix seconds (UTC)
  btc?: number | null
}

/**
 * 指数数据来自本地 public/data/fng.json（由 scripts/fetch-data.mjs 生成）。
 * 这样访问快、且可离线查看；运行 `pnpm fetch-data` 更新。
 */
export async function fetchFng(): Promise<FngPoint[]> {
  const res = await fetch(dataUrl('fng.json'))
  if (!res.ok) throw new Error(`本地指数数据读取失败 HTTP ${res.status}`)
  const arr = (await res.json()) as Array<{
    timestamp: number
    value: number
    classification: string
  }>
  return arr
    .filter((d) => Number.isFinite(d.value) && Number.isFinite(d.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp)
}

/** UTC date key (yyyy-mm-dd) from a unix timestamp in seconds. */
export function dateKey(tsSeconds: number): string {
  const d = new Date(tsSeconds * 1000)
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${d.getUTCFullYear()}-${m}-${day}`
}

/**
 * BTC 日线来自本地 public/data/btc.json（Binance 全历史，由 scripts/fetch-data.mjs 生成）。
 * 返回按 UTC 日期索引的收盘价 Map。
 */
export async function fetchBtcPrices(): Promise<Map<string, number>> {
  const res = await fetch(dataUrl('btc.json'))
  if (!res.ok) throw new Error(`本地 BTC 数据读取失败 HTTP ${res.status}`)
  const arr = (await res.json()) as Array<{ t: number; c: number }>
  const map = new Map<string, number>()
  for (const p of arr) {
    if (Number.isFinite(p.t) && Number.isFinite(p.c)) map.set(dateKey(p.t / 1000), p.c)
  }
  return map
}

export function fmtPrice(v: number): string {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}K`
  return `$${v.toFixed(0)}`
}

export function fmtFullPrice(v: number): string {
  return `$${v.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export type Zone = {
  name: string
  en: string
  min: number
  max: number
  color: string
}

export const ZONES: Zone[] = [
  { name: '极度恐惧', en: 'Extreme Fear', min: 0, max: 25, color: '#f43f5e' },
  { name: '恐惧', en: 'Fear', min: 25, max: 45, color: '#f97316' },
  { name: '中性', en: 'Neutral', min: 45, max: 55, color: '#eab308' },
  { name: '贪婪', en: 'Greed', min: 55, max: 75, color: '#22c55e' },
  { name: '极度贪婪', en: 'Extreme Greed', min: 75, max: 100, color: '#10b981' },
]

export function zoneOf(value: number): Zone {
  return ZONES.find((z) => value >= z.min && value < z.max) ?? ZONES[ZONES.length - 1]
}

export function fmtDate(ts: number, withYear = false): string {
  const d = new Date(ts * 1000)
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return withYear ? `${d.getUTCFullYear()}-${m}-${day}` : `${m}-${day}`
}

export function fmtFullDate(ts: number): string {
  const d = new Date(ts * 1000)
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${d.getUTCFullYear()}-${m}-${day}`
}

export function deltaLabel(delta: number): string {
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta}`
}