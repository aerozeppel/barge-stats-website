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

  // Create a holding page at the root
  const holdingPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redkit - Domain Holding</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f8f9fa;
        }
        .container {
            text-align: center;
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            max-width: 500px;
        }
        h1 { color: #2c3e50; margin-top: 0; }
        p { color: #666; font-size: 1.1rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>redkit.co.uk</h1>
        <p>This domain is currently holding.</p>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(process.cwd(), 'out', 'index.html'), holdingPageHtml);
  console.log('Created holding page at out/index.html');

} else {
  console.log(`Directory ${outDir} not found, skipping postbuild script.`);
}
