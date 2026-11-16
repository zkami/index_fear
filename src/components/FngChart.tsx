import {
  Area,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FngPoint } from '../lib/fng'
import { fmtDate, fmtFullDate, fmtFullPrice } from '../lib/fng'

const FNG_COLOR = '#4f46e5'
const BTC_COLOR = '#f59e0b'

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload as FngPoint
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400">{fmtFullDate(p.timestamp)}</p>
      <p className="mt-1 text-base font-bold text-slate-900">指数 {p.value}</p>
      {typeof p.btc === 'number' && <p className="mt-0.5 text-amber-600">BTC {fmtFullPrice(p.btc)}</p>}
    </div>
  )
}

type Props = {
  data: FngPoint[]
  startIndex?: number
  endIndex?: number
  onBrushChange?: (startIndex: number, endIndex: number) => void
}

export default function FngChart({ data, startIndex, endIndex, onBrushChange }: Props) {
  return (
    <div>
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 12, right: 4, left: 0, bottom: 0 }}>
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
              yAxisId="fng"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fill: '#64748b', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />
            <YAxis yAxisId="brush" hide domain={[0, 100]} />
            <YAxis
              yAxisId="btc"
              orientation="right"
              domain={['auto', 'auto']}
              tick={{ fill: '#b45309', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
            <Legend wrapperStyle={{ fontSize: 12, color: '#475569' }} />
            <Line
              yAxisId="fng"
              type="monotone"
              dataKey="value"
              name="恐惧与贪婪指数"
              stroke={FNG_COLOR}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              yAxisId="btc"
              type="monotone"
              dataKey="btc"
              name="BTC 价格 (USD)"
              stroke={BTC_COLOR}
              strokeWidth={1.5}
              fill={BTC_COLOR}
              fillOpacity={0.15}
              dot={false}
              connectNulls={false}
            />
            <Brush
              dataKey="timestamp"
              {...({ yAxisId: 'brush' } as any)}
              height={44}
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
    </div>
  )
}