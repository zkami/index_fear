/**
 * 拉取 Fear & Greed 指数 + BTC 日线数据到 public/data/
 * 用法: pnpm fetch-data
 *
 * 币安对部分云厂商 IP 返回 451，这里按 data-api.binance.vision -> api*.binance.com 顺序回退；
 * 某个源失败时保留仓库里的旧数据继续构建，不让整次部署挂掉。
 */
import { mkdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const outDir = path.join(root, 'public', 'data')

const BTC_HOSTS = [
  'https://data-api.binance.vision',
  'https://api.binance.com',
  'https://api1.binance.com',
  'https://api2.binance.com',
]

const FNG_URLS = [
  'https://api.alternative.me/fng/?limit=0&format=json',
  'https://api.alternative.me/fng/?limit=0',
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function getJson(url, tries = 3) {
  let lastErr
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'index-fear-ci/1.0' } })
      if (res.ok) return await res.json()
      lastErr = new Error(`${url} -> HTTP ${res.status}`)
      if (res.status === 403 || res.status === 404 || res.status === 451) break
    } catch (e) {
      lastErr = e
    }
    if (i < tries) await sleep(1500 * i)
  }
  throw lastErr
}

async function fetchFng() {
  let lastErr
  for (const url of FNG_URLS) {
    try {
      const json = await getJson(url)
      if (json?.metadata?.error) throw new Error('FNG API error')
      return (json.data ?? [])
        .map((d) => ({
          timestamp: Number(d.timestamp),
          value: Number(d.value),
          classification: d.value_classification,
        }))
        .filter((d) => Number.isFinite(d.value) && Number.isFinite(d.timestamp))
        .sort((a, b) => a.timestamp - b.timestamp)
    } catch (e) {
      lastErr = e
      console.warn(`FNG 源失败，换下一个：${e.message}`)
    }
  }
  throw lastErr
}

async function fetchBtc() {
  let lastErr
  for (const host of BTC_HOSTS) {
    try {
      const all = []
      let startTime = 0
      for (let page = 0; page < 20; page++) {
        const url =
          `${host}/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=1000&startTime=${startTime}`
        const arr = await getJson(url)
        if (!Array.isArray(arr) || arr.length === 0) break
        for (const k of arr) all.push({ t: k[0], o: +k[1], h: +k[2], l: +k[3], c: +k[4], v: +k[5] })
        if (arr.length < 1000) break
        startTime = arr[arr.length - 1][6] + 1
      }
      if (all.length === 0) throw new Error(`${host} 返回空数据`)
      all.sort((a, b) => a.t - b.t)
      return all
    } catch (e) {
      lastErr = e
      console.warn(`BTC 源 ${host} 失败：${e.message}`)
    }
  }
  throw lastErr
}

async function writeJson(file, data) {
  const target = path.join(outDir, file)
  const tmp = `${target}.tmp`
  await writeFile(tmp, JSON.stringify(data))
  await rename(tmp, target)
}

const day = (ms) => new Date(ms).toISOString().slice(0, 10)

await mkdir(outDir, { recursive: true })

let degraded = false

try {
  const fng = await fetchFng()
  await writeJson('fng.json', fng)
  console.log(`fng.json: ${fng.length} 条 (${day(fng[0].timestamp * 1000)} ~ ${day(fng.at(-1).timestamp * 1000)})`)
} catch (e) {
  degraded = true
  console.warn(`::warning::FNG 更新失败，沿用旧数据：${e.message}`)
}

try {
  const btc = await fetchBtc()
  await writeJson('btc.json', btc)
  console.log(`btc.json: ${btc.length} 条 (${day(btc[0].t)} ~ ${day(btc.at(-1).t)})`)
} catch (e) {
  degraded = true
  console.warn(`::warning::BTC 更新失败，沿用旧数据：${e.message}`)
}

if (degraded) console.warn('::warning::部分数据未更新，本次构建沿用仓库中已有的数据。')
