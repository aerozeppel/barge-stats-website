"use client";

import { useEffect, useState } from "react";
import { getDashboardKPIs, getUsageReportData } from "@/lib/api";
import { PoundSterling, PackageSearch, TrendingUp } from "lucide-react";

type KPIs = { totalStockValue: number; totalProductsTracked: number } | null;
type UsageRow = {
  productID: number;
  name: string;
  categoryName: string;
  usageValue: number;
  units: string;
};

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIs>(null);
  const [topProducts, setTopProducts] = useState<UsageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [kpiData, usageData] = await Promise.all([
          getDashboardKPIs(),
          getUsageReportData(),
        ]);
        setKpis(kpiData);
        setTopProducts(usageData.slice(0, 5));
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-zinc-800 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-24 bg-zinc-800/50 rounded-2xl" />
          <div className="h-24 bg-zinc-800/50 rounded-2xl" />
        </div>
        <div className="h-64 bg-zinc-800/50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-zinc-400 mt-2">Welcome to the Barge Stats control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <PoundSterling className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Est. Total Stock Value</p>
            <h3 className="text-2xl font-bold text-white">
              £{kpis?.totalStockValue ? kpis.totalStockValue.toFixed(2) : "0.00"}
            </h3>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <PackageSearch className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">Products Tracked</p>
            <h3 className="text-2xl font-bold text-white">
              {kpis?.totalProductsTracked || 0}
            </h3>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-white">Top 5 Products by Usage</h2>
        </div>
        
        <div className="space-y-4">
          {topProducts.map((product, idx) => (
            <div key={product.productID} className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100">{product.name}</h4>
                  <p className="text-xs text-zinc-500">{product.categoryName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-indigo-400">{product.usageValue.toFixed(2)}</span>
                <span className="text-xs text-zinc-500 ml-1 block md:inline">{product.units}/wk</span>
              </div>
            </div>
          ))}
          {topProducts.length === 0 && (
            <p className="text-zinc-500 text-center py-4">No usage data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
