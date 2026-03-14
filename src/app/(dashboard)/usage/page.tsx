"use client";

import { useEffect, useState, useMemo } from "react";
import { getUsageReportData } from "@/lib/api";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Sparkline } from "@/components/Sparkline";
import { TrendingDown } from "lucide-react";

type UsageRow = {
  productID: number;
  name: string;
  categoryID: number;
  categoryName: string;
  usageValue: number;
  units: string;
  rawUsages: { amount: number; date: string }[];
};

export default function UsagePage() {
  const [usageData, setUsageData] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    if (selectedCategory === null) return usageData;
    return usageData.filter((item) => item.categoryID === selectedCategory);
  }, [usageData, selectedCategory]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsageReportData();
        setUsageData(data);
      } catch (err) {
        console.error("Failed to load usage data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-48" />
        <div className="h-96 bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <TrendingDown className="w-8 h-8 text-indigo-400" />
          Usage Reports
        </h1>
        <p className="text-zinc-400 mt-2">11-week average product usage and recent trends.</p>
      </div>

      <CategoryFilter
        items={usageData}
        selectedCategoryID={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-900/80 border-b border-white/5 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Avg Weekly Usage</th>
                <th className="px-6 py-4 text-center rounded-tr-xl">11-Wk Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-zinc-950/30">
              {filteredData.map((item) => (
                <tr key={item.productID} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/5">
                      {item.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-bold text-indigo-400">{item.usageValue.toFixed(2)}</div>
                    <div className="text-xs text-zinc-500">{item.units} / wk</div>
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <Sparkline data={item.rawUsages} />
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                    No usage data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
