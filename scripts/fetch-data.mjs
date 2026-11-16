/**
 * 拉取 Fear & Greed 指数 + BTC 日线数据到 public/data/
 * 用法: pnpm fetch-data
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, 'public', 'data')

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`)
  return res.json()
}

async function fetchFng() {
  const json = await getJson('https://api.alternative.me/fng/?limit=0&format=json')
  if (json?.metadata?.error) throw new Error('FNG API error')
  return (json.data ?? [])
    .map((d) => ({
      timestamp: Number(d.timestamp),
      value: Number(d.value),
      classification: d.value_classification,
    }))
    .filter((d) => Number.isFinite(d.value) && Number.isFinite(d.timestamp))
    .sort((a, b) => a.timestamp - b.timestamp)
}

async function fetchBtc() {
  const limit = 1000
  const all = []
  let startTime = 0
  for (let page = 0; page < 20; page++) {
    const url =
      `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d` +
      `&limit=${limit}&startTime=${startTime}`
    const arr = await getJson(url)
    if (!Array.isArray(arr) || arr.length === 0) break
    for (const k of arr) {
      all.push({ t: k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] })
    }
    if (arr.length < limit) break
    startTime = arr[arr.length - 1][6] + 1
  }
  all.sort((a, b) => a.t - b.t)
  return all
}

await mkdir(outDir, { recursive: true })

const fng = await fetchFng()
await writeFile(path.join(outDir, 'fng.json'), JSON.stringify(fng))
console.log(`fng.json: ${fng.length} 条 (${new Date(fng[0].timestamp * 1000).toISOString().slice(0, 10)} ~ ${new Date(fng.at(-1).timestamp * 1000).toISOString().slice(0, 10)})`)

const btc = await fetchBtc()
await writeFile(path.join(outDir, 'btc.json'), JSON.stringify(btc))
console.log(`btc.json: ${btc.length} 条 (${new Date(btc[0].t).toISOString().slice(0, 10)} ~ ${new Date(btc.at(-1).t).toISOString().slice(0, 10)})`)