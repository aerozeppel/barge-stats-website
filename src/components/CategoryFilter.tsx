"use client";

import { useMemo } from "react";

type CategoryFilterProps = {
  items: { categoryID: number; categoryName: string }[];
  selectedCategoryID: number | null;
  onSelect: (categoryID: number | null) => void;
};

export function CategoryFilter({ items, selectedCategoryID, onSelect }: CategoryFilterProps) {
  const categories = useMemo(() => {
    const seen = new Map<number, string>();
    items.forEach((item) => {
      if (!seen.has(item.categoryID)) {
        seen.set(item.categoryID, item.categoryName);
      }
    });
    return Array.from(seen.entries())
      .sort(([a], [b]) => a - b)
      .map(([id, name]) => ({ id, name }));
  }, [items]);

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
          selectedCategoryID === null
            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
            : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800/80 hover:text-zinc-300"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
            selectedCategoryID === cat.id
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
              : "bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800/80 hover:text-zinc-300"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
