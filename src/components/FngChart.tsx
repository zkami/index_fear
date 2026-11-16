import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FngPoint } from '../lib/fng'
import { fmtDate, fmtFullDate } from '../lib/fng'

const FNG_COLOR = '#4f46e5'

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload as FngPoint
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400">{fmtFullDate(p.timestamp)}</p>
      <p className="mt-1 text-base font-bold text-slate-900">指数 {p.value}</p>
    </div>
  )
}

type Props = {
  data: FngPoint[]
  startIndex?: number
  endIndex?: number
  onBrushChange?: (startIndex: number, endIndex: number) => void
}

/** 下图：恐慌与贪婪指数（0–100），底部滑块选择时间区间（上方 BTC 图跟随同一区间） */
export default function FngChart({ data, startIndex, endIndex, onBrushChange }: Props) {
  return (
    <div className="h-[120px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          syncId="fear-btc"
          syncMethod="value"
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gFng" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={FNG_COLOR} stopOpacity={0.28} />
              <stop offset="100%" stopColor={FNG_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(ts: number) => fmtDate(ts)}
            minTickGap={40}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={34}
          />
          <YAxis yAxisId="brush" hide domain={[0, 100]} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
          <ReferenceLine y={25} stroke="#f43f5e" strokeDasharray="4 4" strokeOpacity={0.5} />
          <ReferenceLine y={75} stroke="#10b981" strokeDasharray="4 4" strokeOpacity={0.5} />
          <Area
            type="monotone"
            dataKey="value"
            name="恐惧与贪婪指数"
            stroke={FNG_COLOR}
            strokeWidth={1.8}
            fill="url(#gFng)"
            dot={false}
            isAnimationActive={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Brush
            dataKey="timestamp"
            {...({ yAxisId: 'brush' } as any)}
            height={36}
            travellerWidth={10}
            stroke={FNG_COLOR}
            fill="#eef2ff"
            startIndex={startIndex}
            endIndex={endIndex}
            tickFormatter={(ts: number) => fmtDate(ts, true)}
            onChange={(e: any) => { if (e?.startIndex != null && e?.endIndex != null) onBrushChange?.(e.startIndex, e.endIndex) }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
