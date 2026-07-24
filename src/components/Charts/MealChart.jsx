// src/components/Charts/MealChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = {
  Breakfast: '#F5A623',
  Lunch: '#52B74A',
  Dinner: '#174351',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card px-4 py-3 text-sm">
        <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
        <p className="text-blue-600 dark:text-blue-400 font-bold">{payload[0].value} entries</p>
      </div>
    );
  }
  return null;
};

export default function MealChart({ entries }) {
  const data = ['Breakfast', 'Lunch', 'Dinner'].map((meal) => ({
    name: meal,
    count: entries.filter((e) => e.meal === meal).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--chart-axis)' }} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--chart-axis)' }} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.name} fill={COLORS[d.name] || '#0D47A1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
