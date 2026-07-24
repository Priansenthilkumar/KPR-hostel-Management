// src/components/Charts/WastageChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { formatDisplayDate } from '../../utils/dateUtils';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 text-sm">
        <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
        <p className="text-orange-600 font-bold">{payload[0].value.toFixed(2)} KG wasted</p>
      </div>
    );
  }
  return null;
};

export default function WastageChart({ entries }) {
  // Aggregate wastage by date
  const dateMap = {};
  entries.forEach((e) => {
    if (!dateMap[e.date]) dateMap[e.date] = 0;
    dateMap[e.date] += parseFloat(e.wastage) || 0;
  });

  const data = Object.entries(dateMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14) // Last 14 days
    .map(([date, wastage]) => ({
      date: formatDisplayDate(date),
      wastage: parseFloat(wastage.toFixed(2)),
    }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px] text-gray-400 text-sm">
        No wastage data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--chart-axis)' }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11, fill: 'var(--chart-axis)' }} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="wastage"
          stroke="#F57C00"
          strokeWidth={2.5}
          dot={{ fill: '#F57C00', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
