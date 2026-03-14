"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: { amount: number; date: string }[];
}

export function Sparkline({ data }: SparklineProps) {
  // We reverse the data so the oldest is on the left, newest on the right
  const chartData = [...data].reverse().map((d) => ({
    value: d.amount,
  }));

  if (!chartData || chartData.length === 0) {
    return <div className="h-full w-full bg-zinc-800/20 rounded flex items-center justify-center text-[10px] text-zinc-600">No Data</div>;
  }

  return (
    <div className="h-12 w-24">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#818cf8"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
