import { supabase } from "./supabase";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

// Types based on the database schema observed
export type Category = { CategoryID: number; CategoryName: string };
export type Supplier = { SupplierID: number; SupplierName: string };

export type Product = {
  ProductID: number;
  ProductName: string;
  CategoryID: number;
  CaseSize: number;
  BottleSize: number;
  Categories: { CategoryName: string } | null;
};

export type ProductPrice = {
  ProductID: number;
  SupplierID: number;
  Price: number;
  Suppliers: { SupplierName: string } | null;
};

export type Usage = {
  ProductID: number;
  AmountUsed: number;
  CheckDate: string;
};

export type StockCheck = {
  ProductID: number;
  StockLevel: number;
};

// MARKUP REPORT CALCULATION
export async function getMarkupReportData() {
  // 1. Fetch products
  const { data: productsData, error: productsError } = await supabase
    .from("Products")
    .select("ProductID, ProductName, CategoryID, CaseSize, BottleSize, Categories(CategoryName)");

  if (productsError) throw new Error("Failed to fetch products: " + productsError.message);

  // 2. Fetch prices
  const { data: pricesData, error: pricesError } = await supabase
    .from("ProductPrices")
    .select("ProductID, SupplierID, Price, Suppliers(SupplierName)");

  if (pricesError) throw new Error("Failed to fetch prices: " + pricesError.message);

  // Calculate cheapest price per product
  const cheapestPriceLookup: Record<number, { price: number; supplierName: string }> = {};
  
  (pricesData as Row[]).forEach((priceRow) => {
    const pid = priceRow.ProductID;
    const price = priceRow.Price;
    const supplier = priceRow.Suppliers?.SupplierName || "N/A";
    
    if (!cheapestPriceLookup[pid] || price < cheapestPriceLookup[pid].price) {
      cheapestPriceLookup[pid] = { price: price, supplierName: supplier };
    }
  });

  // Calculate Report Rows
  const reportRows = (productsData as Row[]).map((product) => {
    const pid = product.ProductID;
    const catId = product.CategoryID;
    const caseSize = product.CaseSize || 1.0;
    const bottleSize = product.BottleSize || 700.0;
    
    const cheapest = cheapestPriceLookup[pid];
    const lowestPrice = cheapest?.price ?? null;
    const supplierInitial = cheapest?.supplierName !== "N/A" && cheapest?.supplierName ? cheapest.supplierName.substring(0, 3) : "N/A";

    let costPerSale: number | null = null;

    if (lowestPrice !== null) {
      if (catId === 1) { // Spirits
        const shotsPerBottle = bottleSize / 25.0;
        costPerSale = shotsPerBottle !== 0 && caseSize !== 0 ? (lowestPrice / shotsPerBottle) / caseSize : null;
      } else if (catId === 2) { // Bottles
        costPerSale = caseSize !== 0 ? lowestPrice / caseSize : null;
      } else if (catId === 3) { // Kegs
        const divisor = caseSize * 8.0;
        costPerSale = divisor !== 0 ? lowestPrice / divisor : null;
      } else if (catId === 4) { // BIB
        costPerSale = lowestPrice / (20 / 0.568);
      } else if (catId === 5) { // Wines
        costPerSale = caseSize !== 0 ? lowestPrice / caseSize : null;
      }
    }

    let markup70: number | null = null;

    if (costPerSale !== null && isFinite(costPerSale)) {
      const costIncVat = costPerSale * 1.20;
      markup70 = costIncVat / 0.30;
    }

    return {
      productID: pid,
      name: product.ProductName,
      categoryID: catId,
      categoryName: product.Categories?.CategoryName || "Unknown",
      supplier: supplierInitial,
      lowestPrice: lowestPrice,
      costPerSale: costPerSale,
      markup70: markup70,
    };
  });

  return reportRows.sort((a, b) => {
    if (a.categoryID !== b.categoryID) return a.categoryID - b.categoryID;
    return a.name.localeCompare(b.name);
  });
}

// USAGE REPORT CALCULATION
export async function getUsageReportData() {
  const { data: productsData, error: productsError } = await supabase
    .from("Products")
    .select("ProductID, ProductName, CategoryID, CaseSize, BottleSize, Categories(CategoryName)");

  if (productsError) throw new Error("Failed to fetch products: " + productsError.message);

  const { data: usagesData, error: usagesError } = await supabase
    .from("Usages")
    .select("ProductID, AmountUsed, CheckDate")
    .eq("IgnoreWeek", 0)
    .order("CheckDate", { ascending: false });

  if (usagesError) throw new Error("Failed to fetch usages: " + usagesError.message);

  const usageMap: Record<number, Row[]> = {};
  (usagesData as Row[]).forEach((u) => {
    if (!usageMap[u.ProductID]) usageMap[u.ProductID] = [];
    usageMap[u.ProductID].push(u);
  });

  const reportRows = (productsData as Row[]).map((product) => {
    const pid = product.ProductID;
    const catId = product.CategoryID;
    const caseSize = product.CaseSize && product.CaseSize > 0 ? product.CaseSize : 1.0;
    const bottleSize = product.BottleSize && product.BottleSize > 0 ? product.BottleSize : 700.0;

    const usages = usageMap[pid] || [];
    const last11 = usages.slice(0, 11);
    
    let usageAverage = 0;
    if (last11.length > 0) {
      const sum = last11.reduce((acc, curr) => acc + (curr.AmountUsed || 0), 0);
      usageAverage = sum / last11.length;
    }

    let unitsDisplay = "Units";
    let usageValue = 0;

    if (catId === 1) {
      unitsDisplay = "Shots";
      usageValue = bottleSize > 0 ? ((usageAverage * caseSize) * bottleSize) / 25.0 : 0;
    } else if (catId === 2) {
      unitsDisplay = "Bottles";
      usageValue = usageAverage * caseSize;
    } else if (catId === 3) {
      unitsDisplay = "Gallons";
      usageValue = usageAverage;
    } else if (catId === 4) {
      unitsDisplay = "Litres";
      usageValue = usageAverage;
    } else if (catId === 5) {
      unitsDisplay = "Bottles";
      usageValue = usageAverage * caseSize;
    } else {
      usageValue = usageAverage * caseSize;
    }

    usageValue = Math.max(0, usageValue);

    return {
      productID: pid,
      name: product.ProductName,
      categoryID: catId,
      categoryName: product.Categories?.CategoryName || "Unknown",
      usageValue: usageValue,
      units: unitsDisplay,
      rawUsages: last11.map(u => ({ amount: u.AmountUsed, date: u.CheckDate })),
    };
  }).filter((p) => p.categoryID !== 6);

  // Group and sort
  return reportRows.sort((a, b) => {
    if (a.categoryID !== b.categoryID) return a.categoryID - b.categoryID;
    return b.usageValue - a.usageValue;
  });
}

// DASHBOARD KPIS
export async function getDashboardKPIs() {
  const { data: latestStock, error: stockError } = await supabase
    .from("LatestStockCheck")
    .select("ProductID, StockCount");

  const { data: prices, error: priceError } = await supabase
    .from("ProductPrices")
    .select("ProductID, Price");

  if (stockError || priceError) return null;

  // Approximate total stock value
  let totalStockValue = 0;
  const priceMap: Record<number, number> = {};
  
  (prices as Row[]).forEach(p => {
    if (!priceMap[p.ProductID] || p.Price < priceMap[p.ProductID]) {
      priceMap[p.ProductID] = p.Price;
    }
  });

  (latestStock as Row[]).forEach(s => {
    const price = priceMap[s.ProductID] || 0;
    totalStockValue += s.StockCount * price;
  });

  return {
    totalStockValue,
    totalProductsTracked: priceMap ? Object.keys(priceMap).length : 0
  };
}
