import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function EngagementChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#232B3D" vertical={false} />
        <XAxis
          dataKey="platform"
          tick={{ fill: '#8A93A6', fontSize: 12, fontFamily: 'Inter' }}
          tickLine={false}
          axisLine={{ stroke: '#232B3D' }}
        />
        <YAxis tick={{ fill: '#545E73', fontSize: 11, fontFamily: 'IBM Plex Mono' }} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: '#171D2B', border: '1px solid #232B3D', borderRadius: 8, fontSize: 12 }}
          cursor={{ fill: 'rgba(124,111,240,0.06)' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: '#8A93A6' }} />
        <Bar dataKey="likes" fill="#7C6FF0" radius={[4, 4, 0, 0]} />
        <Bar dataKey="comments" fill="#4FA8E0" radius={[4, 4, 0, 0]} />
        <Bar dataKey="shares" fill="#F77737" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
