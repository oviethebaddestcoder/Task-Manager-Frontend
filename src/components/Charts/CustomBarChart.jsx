import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CustomBarChart = ({ data = [], xKey = 'x', yKey = 'y', colors = [] }) => {
  const chartCells = useMemo(() => (
    data.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={colors[index % colors.length] || '#8884d8'}
      />
    ))
  ), [data, colors]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] border rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey={xKey} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey}>
            {chartCells}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
