// src/components/Charts/CookChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COOK_COLORS } from '../../constants/cooks';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 text-sm">
        <p className="font-semibold text-gray-800 dark:text-white">{payload[0].name}</p>
        <p className="font-bold" style={{ color: payload[0].payload.fill }}>
          {payload[0].value} entries
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function CookChart({ entries }) {
  const cookMap = {};
  entries.forEach((e) => {
    cookMap[e.cookName] = (cookMap[e.cookName] || 0) + 1;
  });

  const data = Object.entries(cookMap)
    .map(([name, value]) => ({ name, value, fill: COOK_COLORS[name] || '#0D47A1' }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
        No cook data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={55}
          outerRadius={90}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          align="center"
          verticalAlign="bottom"
          iconType="circle"
          iconSize={10}
          formatter={(val) => <span className="text-xs text-gray-700 dark:text-gray-300">{val}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
