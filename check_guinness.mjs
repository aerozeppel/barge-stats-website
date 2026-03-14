import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGuinness() {
  const pid = 159;
  const { data: usages, error } = await supabase
    .from("Usages")
    .select("ProductID, AmountUsed, CheckDate, IgnoreWeek")
    .eq("ProductID", pid)
    .order("CheckDate", { ascending: false });

  if (error) {
    console.error("Error fetching usages:", error);
    return;
  }

  console.log("All Guinness usages:");
  console.log(usages);

  const filteredUsages = usages.filter(u => u.IgnoreWeek === 0);
  console.log("Filtered usages (IgnoreWeek = 0):");
  console.log(filteredUsages);

  const top11 = filteredUsages.slice(0, 11);
  console.log("Top 11 filtered usages:");
  console.log(top11);

  const sum = top11.reduce((acc, curr) => acc + curr.AmountUsed, 0);
  console.log("Sum of top 11:", sum);
  console.log("Average:", sum / 11);
}

checkGuinness();
