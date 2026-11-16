export type CyclePhase = {
  /** 区间开始，unix 秒 (UTC) */
  start: number
  /** 区间结束，unix 秒 (UTC) */
  end: number
  kind: 'bull' | 'bear'
}

/** 减半周期：210,000 块 */
export const HALVING_INTERVAL = 210000
/** 牛市半径：减半 ± 78,750 块（牛 157,500 块，熊 52,500 块） */
export const BULL_HALF = 78750

/** 减半锚点：区块高度 → UTC 秒（最后一次为预估值） */
export const HALVING_ANCHORS = [
  { h: 210000, ts: Date.UTC(2012, 10, 28) / 1000 },
  { h: 420000, ts: Date.UTC(2016, 6, 9) / 1000 },
  { h: 630000, ts: Date.UTC(2020, 4, 11) / 1000 },
  { h: 840000, ts: Date.UTC(2024, 3, 20) / 1000 },
  { h: 1050000, ts: Date.UTC(2028, 3, 21) / 1000 },
]

/** 区块高度 → UTC 秒：锚点之间线性插值，范围外按 10 分钟/块外推 */
export function timeAtHeight(h: number): number {
  const a0 = HALVING_ANCHORS[0]
  if (h <= a0.h) return a0.ts + (h - a0.h) * 600
  for (let i = 0; i + 1 < HALVING_ANCHORS.length; i++) {
    const a = HALVING_ANCHORS[i]
    const b = HALVING_ANCHORS[i + 1]
    if (h <= b.h) return a.ts + ((h - a.h) / (b.h - a.h)) * (b.ts - a.ts)
  }
  const last = HALVING_ANCHORS[HALVING_ANCHORS.length - 1]
  return last.ts + (h - last.h) * 600
}

/** 减半日（高度 + 对应时间），按 210,000 块网格铺开 */
export function halvingMarks(fromTs: number, toTs: number) {
  const out: { h: number; ts: number }[] = []
  for (let k = 1; k <= 12; k++) {
    const h = k * HALVING_INTERVAL
    const ts = timeAtHeight(h)
    if (ts > toTs) break
    if (ts >= fromTs) out.push({ h, ts })
  }
  return out
}

/**
 * 牛熊区间（与 wolfyxbt.github.io/wolfy-wave-index 完全一致）：
 * 每个减半前后各 78,750 块为牛市，其余 52,500 块为熊市。
 */
export function btcCyclePhases(fromTs: number, toTs: number): CyclePhase[] {
  const phases: CyclePhase[] = []
  const push = (start: number, end: number, kind: CyclePhase['kind']) => {
    const s = Math.max(start, fromTs)
    const e = Math.min(end, toTs)
    if (e > s) phases.push({ start: s, end: e, kind })
  }
  for (let k = 0; k <= 12; k++) {
    const bullStart = timeAtHeight(k * HALVING_INTERVAL - BULL_HALF)
    const bullEnd = timeAtHeight(k * HALVING_INTERVAL + BULL_HALF)
    const nextBullStart = timeAtHeight((k + 1) * HALVING_INTERVAL - BULL_HALF)
    push(bullStart, bullEnd, 'bull')
    push(bullEnd, nextBullStart, 'bear')
  }
  return phases
}
