import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function GrowthChart({ data, dataKey = 'followers', color = '#7C6FF0' }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.35} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#232B3D" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#545E73', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          tickLine={false}
          axisLine={{ stroke: '#232B3D' }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#545E73', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          tickLine={false}
          axisLine={false}
          width={50}
        />
        <Tooltip
          contentStyle={{ background: '#171D2B', border: '1px solid #232B3D', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8A93A6' }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill="url(#growthFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
