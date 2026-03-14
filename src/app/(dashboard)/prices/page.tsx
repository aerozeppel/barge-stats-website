"use client";

import { useEffect, useState } from "react";
import { getMarkupReportData } from "@/lib/api";
import { BarChart3, Info } from "lucide-react";

type MarkupRow = {
  productID: number;
  name: string;
  categoryID: number;
  categoryName: string;
  supplier: string;
  lowestPrice: number | null;
  costPerSale: number | null;
  markup70: number | null;
};

export default function PricesPage() {
  const [markupData, setMarkupData] = useState<MarkupRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getMarkupReportData();
        setMarkupData(data);
      } catch (err) {
        console.error("Failed to load pricing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatPrice = (val: number | null) => {
    if (val === null || !isFinite(val)) return "-";
    return `£${val.toFixed(2)}`;
  };

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
          <BarChart3 className="w-8 h-8 text-indigo-400" />
          Prices & Margins
        </h1>
        <p className="text-zinc-400 mt-2">Lowest supplier prices, estimated cost per sale, and target markups.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-900/80 border-b border-white/5 text-xs uppercase text-zinc-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Product</th>
                <th className="px-4 py-4 whitespace-nowrap">Supplier</th>
                <th className="px-4 py-4 text-right whitespace-nowrap">Cost</th>
                <th className="px-4 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    Cost/Sale
                    <Info className="w-3 h-3 text-zinc-500" />
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-emerald-300 rounded-tr-xl whitespace-nowrap">70% Markup</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-zinc-950/30">
              {markupData.map((item) => (
                <tr key={item.productID} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-100">{item.name}</div>
                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5">{item.categoryName}</div>
                  </td>
                  <td className="px-4 py-4">
                    {item.supplier !== "N/A" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-white/5 uppercase tracking-wider">
                        {item.supplier}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-zinc-300">
                    {formatPrice(item.lowestPrice)}
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-zinc-300">
                    {formatPrice(item.costPerSale)}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-300 font-bold bg-emerald-300/[0.08]">
                    {formatPrice(item.markup70)}
                  </td>
                </tr>
              ))}
              {markupData.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                    No pricing data found.
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
