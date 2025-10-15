const fs = require('fs');
const rimraf = require('rimraf');
const exec = require('child-process-promise').exec;
const path = process.cwd();

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Generate realistic user agents to avoid detection
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  ];
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// Calculate safe concurrency based on total installations
function calculateSafeConcurrency(totalInstalls: number): number {
  if (totalInstalls <= 10) return Math.min(3, totalInstalls);
  if (totalInstalls <= 50) return Math.min(5, totalInstalls);
  if (totalInstalls <= 100) return Math.min(8, totalInstalls);
  return Math.min(10, totalInstalls); // Max 10 for safety
}

// Get random package from the list
function getRandomPackage(): string {
  const packages = ['hana-mcp-ui', 'hana-mcp-server', 'sap-cap-debugger'];
  return packages[Math.floor(Math.random() * packages.length)];
}

// Generate random daily count between 50-60
function getRandomDailyCount(): number {
  return Math.floor(Math.random() * 11) + 50; // 50-60 inclusive
}

async function asyncForEach(array: Array<any>, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function makeid(): string {
  var text: string = '';
  var possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 10; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function createDirectory(): Promise<string> {
  const name = makeid();
  await new Promise<void>(async (resolve, reject) => {
    fs.mkdir(`${path}/tmp/${name}`, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
  return name;
}

async function deleteDirectory(directory: string): Promise<boolean> {
  let deleted = false;
  await new Promise<void>(async (resolve, reject) => {
    rimraf(`${path}/tmp/${directory}`, function() {
      console.log('delete done');
      deleted = true;
      resolve();
    });
  });
  return deleted;
}

async function installPackage(dir: string, command: string): Promise<boolean> {
  try {
    // Set environment variables to mimic different users
    const env = {
      ...process.env,
      npm_config_user_agent: getRandomUserAgent(),
      npm_config_registry: 'https://registry.npmjs.org/',
      npm_config_cache: `${path}/tmp/${dir}/.npm-cache`,
    };

    // Initialize npm package
    const initResult = await exec(`npm init --yes`, {
      cwd: `${path}/tmp/${dir}`,
      env: env,
    });
    console.log('npm init stdout:', initResult.stdout);
    if (initResult.stderr) console.log('npm init stderr:', initResult.stderr);

    // Add small delay between init and install
    await timeout(getRandomNumber(500, 1500));

    // Install the package
    const installResult = await exec(command, {
      cwd: `${path}/tmp/${dir}`,
      env: env,
    });
    console.log('npm install stdout:', installResult.stdout);
    if (installResult.stderr) console.log('npm install stderr:', installResult.stderr);

    return true;
  } catch (error) {
    console.error('Package installation error:', error);
    return false;
  }
}

// Process a single package installation
async function processPackageInstallation(packageName: string, index: number): Promise<void> {
  try {
    // Add random delay to simulate real user behavior with longer gaps
    const delay = getRandomNumber(3000, 12000); // 3-12 seconds delay
    console.log(`[${index + 1}] ⏳ Waiting ${(delay / 1000).toFixed(1)}s before installation...`);
    await timeout(delay);

    const dir = await createDirectory();
    console.log(`[${index + 1}] Created directory ${dir}`);

    const packageInstalled = await installPackage(dir, `npm i ${packageName}`);
    console.log(`[${index + 1}] Package installed: ${packageInstalled}`);

    const deleted = await deleteDirectory(dir);
    console.log(`[${index + 1}] Directory deleted: ${deleted}`);

    console.log(`[${index + 1}] ✅ Installation completed successfully`);
  } catch (error) {
    console.error(`[${index + 1}] ❌ Installation failed:`, error);
    throw error;
  }
}

// Process packages in batches to control concurrency
async function processBatch(packageName: string, batch: number[], batchNumber: number): Promise<void> {
  console.log(`\n🚀 Processing batch ${batchNumber} with ${batch.length} installations...`);

  const promises = batch.map(index => processPackageInstallation(packageName, index));

  try {
    await Promise.all(promises);
    console.log(`✅ Batch ${batchNumber} completed successfully`);
  } catch (error) {
    console.error(`❌ Batch ${batchNumber} failed:`, error);
    throw error;
  }
}

// Split array into chunks for batch processing
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

async function main() {
  // Support for random daily mode
  const isRandomMode = process.argv[2] === '--random-daily';

  let packageName: string;
  let installNumber: number;
  let concurrency: number | null;

  if (isRandomMode) {
    // Random daily mode - use hana-mcp packages with random count
    packageName = getRandomPackage();
    installNumber = getRandomDailyCount();
    concurrency = null; // Auto-calculate
    console.log(`🎲 Random daily mode activated!`);
    console.log(`📦 Random package selected: ${packageName}`);
    console.log(`🔢 Random daily count: ${installNumber}`);
  } else {
    // Manual mode - use provided parameters
    if (process.argv.length === 2) {
      throw new Error('must enter a package name or use --random-daily');
    }

    packageName = process.argv[2];
    installNumber = typeof process.argv[3] === 'undefined' ? 1 : parseInt(process.argv[3]);
    concurrency = typeof process.argv[4] === 'undefined' ? null : parseInt(process.argv[4]);
  }

  // Auto-calculate safe concurrency if not provided
  if (concurrency === null) {
    concurrency = calculateSafeConcurrency(installNumber);
    console.log(`🛡️  Auto-calculated safe concurrency: ${concurrency}`);
  }

  // Warn if concurrency is too high
  if (concurrency > 10) {
    console.log(`⚠️  WARNING: High concurrency (${concurrency}) may trigger rate limiting!`);
    console.log(`💡 Recommended max: 10 for safety`);
  }

  console.log(`📦 Package: ${packageName}`);
  console.log(`🔢 Total installations: ${installNumber}`);
  console.log(`⚡ Concurrency: ${concurrency} parallel installations`);
  console.log(`⏱️  Estimated time: ${Math.ceil(installNumber / concurrency) * 5} seconds\n`);

  const startTime = Date.now();

  // Create array of indices
  const indices = Array.from({ length: installNumber }, (_, i) => i);

  // Split into batches based on concurrency
  const batches = chunkArray(indices, concurrency);

  try {
    // Process batches sequentially, but installations within each batch run in parallel
    for (let i = 0; i < batches.length; i++) {
      await processBatch(packageName, batches[i], i + 1);

      // Add longer delay between batches to avoid overwhelming npm registry
      if (i < batches.length - 1) {
        const delay = getRandomNumber(3000, 8000); // 3-8 seconds between batches
        console.log(`⏳ Waiting ${(delay / 1000).toFixed(1)}s before next batch...`);
        await timeout(delay);
      }
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;

    console.log(`\n🎉 All installations completed!`);
    console.log(`📊 Total time: ${totalTime.toFixed(2)} seconds`);
    console.log(`📈 Average time per installation: ${(totalTime / installNumber).toFixed(2)} seconds`);
    console.log(`🛡️  Used safe concurrency settings to avoid detection`);
  } catch (error) {
    console.error('\n💥 Installation process failed:', error);
    console.error('💡 This might be due to rate limiting. Try reducing concurrency or adding more delays.');
    process.exit(1);
  }
}

main();
