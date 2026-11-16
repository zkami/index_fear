import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DeviceSlice, SourceSlice, TrendPoint } from '../data/mock'
import { formatNumber } from '../lib/format'

const axisStyle = { fill: '#64748b', fontSize: 11 }
const tooltipStyle = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: 8,
  fontSize: 12,
}

export function TrafficChart({ data }: { data: TrendPoint[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gOrganic" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gDirect" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gReferral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis
            tick={axisStyle}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => formatNumber(v)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value) => formatNumber(Number(value))}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          <Area
            type="monotone"
            dataKey="organic"
            name="自然搜索"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gOrganic)"
          />
          <Area
            type="monotone"
            dataKey="direct"
            name="直接访问"
            stroke="#22d3ee"
            strokeWidth={2}
            fill="url(#gDirect)"
          />
          <Area
            type="monotone"
            dataKey="referral"
            name="引荐流量"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#gReferral)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SourceChart({ data }: { data: SourceSlice[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DeviceBars({ data }: { data: DeviceSlice[] }) {
  return (
    <div className="space-y-4 p-1">
      {data.map((d) => (
        <div key={d.name}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-400">{d.name}</span>
            <span className="font-medium text-slate-200">{d.value}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${d.value}%`, backgroundColor: d.color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}