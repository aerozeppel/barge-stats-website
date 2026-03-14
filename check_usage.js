const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://euqdnrmvnnbptnbtoazr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cWRucm12bm5icHRuYnRvYXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTM4OTUsImV4cCI6MjA2MDYyOTg5NX0.0hnGkG9eKGjgXl-iCYigkTfztOuAZryy_AUXVCUnbYM"
);

async function main() {
  // Replicate EXACTLY what the app does
  const { data: usagesData } = await supabase
    .from("Usages")
    .select("ProductID, AmountUsed, CheckDate")
    .eq("IgnoreWeek", 0)
    .order("CheckDate", { ascending: false });

  console.log("Total usage records from query:", usagesData.length);

  // Build the same usage map
  const usageMap = {};
  usagesData.forEach(u => {
    if (!usageMap[u.ProductID]) usageMap[u.ProductID] = [];
    usageMap[u.ProductID].push(u);
  });

  // Check Guinness (ID 159) and Carling (ID 164)
  for (const pid of [159, 164]) {
    const usages = usageMap[pid] || [];
    const last11 = usages.slice(0, 11);
    const sum = last11.reduce((acc, c) => acc + (c.AmountUsed || 0), 0);
    const avg = last11.length > 0 ? sum / last11.length : 0;

    console.log("\n=== ProductID:", pid, "===");
    console.log("Total usage records:", usages.length);
    console.log("Last 11:");
    last11.forEach(u => console.log("  ", u.CheckDate, "AmountUsed:", u.AmountUsed));
    console.log("Sum:", sum);
    console.log("Count:", last11.length);
    console.log("Avg (current app):", avg.toFixed(4));
    console.log("Avg (divide by 11):", (sum / 11).toFixed(4));
  }
}

main().catch(console.error);
