import fs from 'fs';
import path from 'path';

const basePath = '/barge';

const outDir = path.join(process.cwd(), 'out');
const tempDir = path.join(process.cwd(), 'temp_out');
const targetDir = path.join(tempDir, basePath);

if (fs.existsSync(outDir)) {
  console.log(`Moving exported files to subpath: ${basePath}`);
  
  // Ensure the temporary target directory exists
  fs.mkdirSync(tempDir, { recursive: true });
  
  // Move the entire "out" directory to "temp_out/barge"
  fs.renameSync(outDir, targetDir);
  
  // Rename "temp_out" back to "out", effectively making the contents live in "out/barge"
  fs.renameSync(tempDir, outDir);
  
  console.log(`Successfully moved exported files.`);
} else {
  console.log(`Directory ${outDir} not found, skipping postbuild script.`);
}
