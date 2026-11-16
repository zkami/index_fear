export type Overview = {
  domain: string
  domainRating: number
  organicKeywords: number
  organicTraffic: number
  backlinks: number
  referringDomains: number
  indexedPages: number
  trafficValue: number
  delta: {
    organicTraffic: number
    keywords: number
    backlinks: number
    domainRating: number
  }
}

export type TrendPoint = {
  month: string
  visits: number
  organic: number
  direct: number
  referral: number
}

export type SourceSlice = { name: string; value: number; color: string }
export type DeviceSlice = { name: string; value: number; color: string }

export type KeywordRow = {
  keyword: string
  position: number
  volume: number
  traffic: number
  difficulty: number
  url: string
}

export type PageRow = {
  path: string
  visits: number
  uniqueVisitors: number
  bounceRate: number
  avgDuration: string
}

export const overview: Overview = {
  domain: 'example.com',
  domainRating: 72,
  organicKeywords: 18420,
  organicTraffic: 1284000,
  backlinks: 96400,
  referringDomains: 4120,
  indexedPages: 82400,
  trafficValue: 218500,
  delta: {
    organicTraffic: 8.4,
    keywords: 3.1,
    backlinks: -1.2,
    domainRating: 2,
  },
}

export const trend: TrendPoint[] = [
  { month: '2024-12', visits: 812000, organic: 640000, direct: 96000, referral: 76000 },
  { month: '2025-01', visits: 858000, organic: 672000, direct: 101000, referral: 85000 },
  { month: '2025-02', visits: 902000, organic: 704000, direct: 104000, referral: 94000 },
  { month: '2025-03', visits: 886000, organic: 688000, direct: 103000, referral: 95000 },
  { month: '2025-04', visits: 968000, organic: 752000, direct: 108000, referral: 108000 },
  { month: '2025-05', visits: 1042000, organic: 812000, direct: 112000, referral: 118000 },
  { month: '2025-06', visits: 1108000, organic: 864000, direct: 115000, referral: 129000 },
  { month: '2025-07', visits: 1186000, organic: 924000, direct: 118000, referral: 144000 },
  { month: '2025-08', visits: 1248000, organic: 968000, direct: 121000, referral: 159000 },
  { month: '2025-09', visits: 1312000, organic: 1012000, direct: 124000, referral: 176000 },
  { month: '2025-10', visits: 1396000, organic: 1072000, direct: 128000, referral: 196000 },
  { month: '2025-11', visits: 1482000, organic: 1136000, direct: 132000, referral: 214000 },
]

export const sources: SourceSlice[] = [
  { name: '自然搜索', value: 62, color: '#6366f1' },
  { name: '直接访问', value: 18, color: '#22d3ee' },
  { name: '引荐流量', value: 11, color: '#34d399' },
  { name: '社媒', value: 6, color: '#fbbf24' },
  { name: '邮件', value: 3, color: '#f472b6' },
]

export const devices: DeviceSlice[] = [
  { name: '桌面端', value: 58, color: '#6366f1' },
  { name: '移动端', value: 37, color: '#22d3ee' },
  { name: '平板', value: 5, color: '#34d399' },
]

export const keywords: KeywordRow[] = [
  { keyword: 'seo tools', position: 3, volume: 74000, traffic: 9800, difficulty: 82, url: '/tools' },
  { keyword: 'backlink checker', position: 5, volume: 40500, traffic: 5100, difficulty: 76, url: '/backlink-checker' },
  { keyword: 'keyword rank tracker', position: 2, volume: 27100, traffic: 4400, difficulty: 68, url: '/rank-tracker' },
  { keyword: 'website traffic analysis', position: 8, volume: 22200, traffic: 2600, difficulty: 71, url: '/traffic' },
  { keyword: 'domain authority checker', position: 4, volume: 18100, traffic: 2300, difficulty: 64, url: '/da-checker' },
  { keyword: 'competitor analysis tool', position: 6, volume: 14800, traffic: 1700, difficulty: 69, url: '/competitor' },
  { keyword: 'site audit tool', position: 7, volume: 12100, traffic: 1200, difficulty: 73, url: '/audit' },
  { keyword: 'keyword research tool', position: 11, volume: 33900, traffic: 900, difficulty: 88, url: '/keywords' },
]

export const pages: PageRow[] = [
  { path: '/', visits: 486000, uniqueVisitors: 398000, bounceRate: 42.1, avgDuration: '3m 12s' },
  { path: '/tools', visits: 214000, uniqueVisitors: 186000, bounceRate: 38.6, avgDuration: '4m 40s' },
  { path: '/backlink-checker', visits: 168000, uniqueVisitors: 142000, bounceRate: 35.2, avgDuration: '5m 05s' },
  { path: '/rank-tracker', visits: 132000, uniqueVisitors: 118000, bounceRate: 33.8, avgDuration: '6m 21s' },
  { path: '/blog/seo-guide-2026', visits: 96000, uniqueVisitors: 88000, bounceRate: 51.4, avgDuration: '7m 48s' },
  { path: '/traffic', visits: 74000, uniqueVisitors: 61000, bounceRate: 44.9, avgDuration: '3m 55s' },
]