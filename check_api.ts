import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getUsageReportData } from './src/lib/api';

async function test() {
  try {
    const data = await getUsageReportData();
    const guinness = data.find((p: any) => p.name.toLowerCase().includes('guinness'));
    console.log(JSON.stringify(guinness, null, 2));
  } catch(e) {
    console.error(e);
  }
}
test();
