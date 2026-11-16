import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FngPoint } from '../lib/fng'
import { fmtDate, fmtFullDate, fmtFullPrice } from '../lib/fng'
import { btcCyclePhases, halvingMarks } from '../lib/cycles'

const BULL_FILL = '#facc15'
const BEAR_FILL = '#ef4444'
const PRICE_COLOR = '#f59e0b'

const fmtYMD = (ts: number) => {
  const d = new Date(ts * 1000)
  const q = (n: number) => String(n).padStart(2, '0')
  return d.getUTCFullYear() + '/' + q(d.getUTCMonth() + 1) + '/' + q(d.getUTCDate())
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload as FngPoint
  if (typeof p.btc !== 'number') return null
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400">{fmtFullDate(p.timestamp)}</p>
      <p className="mt-1 text-base font-bold text-amber-600">BTC {fmtFullPrice(p.btc)}</p>
    </div>
  )
}

type Props = {
  data: FngPoint[]
  startIndex?: number
  endIndex?: number
}

/** 上图：BTC 日线收盘价，线下按牛熊周期分色填充（黄=牛、红=熊），线上方留白 */
export default function BtcChart({ data, startIndex, endIndex }: Props) {
  const fromTs = data[0]?.timestamp ?? 0
  const toTs = data[data.length - 1]?.timestamp ?? 0
  const viewFrom = startIndex != null ? data[startIndex]?.timestamp ?? fromTs : fromTs
  const viewTo = endIndex != null ? data[endIndex]?.timestamp ?? toTs : toTs
  const phases = btcCyclePhases(viewFrom, viewTo)
  const halvings = halvingMarks(viewFrom, viewTo)

  // 用一条水平渐变给整条价格线下方的填充分色：色标位置按可见区间换算，
  // 相邻周期共用同一个 offset，形成硬切边界。
  const span = Math.max(viewTo - viewFrom, 1)
  const stops: { off: number; color: string }[] = []
  for (const ph of phases) {
    const color = ph.kind === 'bull' ? BULL_FILL : BEAR_FILL
    stops.push({ off: Math.min(Math.max((ph.start - viewFrom) / span, 0), 1), color })
    stops.push({ off: Math.min(Math.max((ph.end - viewFrom) / span, 0), 1), color })
  }
  stops.sort((a, b) => a.off - b.off)

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          syncId="fear-btc"
          syncMethod="value"
          data={data}
          margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="phaseGrad" x1="0" y1="0" x2="1" y2="0">
              {stops.map((s, i) => (
                <stop key={i} offset={s.off} stopColor={s.color} />
              ))}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={['dataMin', 'dataMax']}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(ts: number) => fmtDate(ts)}
            minTickGap={40}
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#b45309', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v: number) => '$' + (v / 1000).toFixed(0) + 'k'}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
          {halvings.map((m) => (
            <ReferenceLine
              key={m.h}
              x={m.ts}
              stroke="#2e6bff"
              strokeOpacity={0.55}
              strokeDasharray="6 4"
              label={{
                value: 'H#' + m.h / 210000 + ' ' + fmtYMD(m.ts),
                angle: -90,
                fill: '#7da3ff',
                fontSize: 10,
                position: 'insideTopLeft',
              }}
            />
          ))}
          <Area
            type="monotone"
            dataKey="btc"
            stroke={PRICE_COLOR}
            strokeWidth={1.8}
            fill="url(#phaseGrad)"
            fillOpacity={0.32}
            dot={false}
            isAnimationActive={false}
            connectNulls={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
