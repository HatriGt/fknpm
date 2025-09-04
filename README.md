# npm-package-script-installer

🚀 **High-performance parallel npm package installer** to increase download counts rapidly with configurable concurrency.

> ⚠️ **Note**: If you created a good and useful project, you probably don't need this script. This is primarily for testing or demonstration purposes.

## ✨ Features

- **Parallel Processing**: Install multiple packages simultaneously for maximum speed
- **Configurable Concurrency**: Control how many installations run in parallel
- **Batch Processing**: Intelligent batching to avoid overwhelming npm registry
- **Progress Tracking**: Real-time progress updates with emojis and timing
- **Error Handling**: Robust error handling with detailed logging
- **Random Delays**: Simulates real user behavior with random delays

## 📦 Installation

1. Clone this repository
```bash
git clone git@github.com:JoshK2/npm-package-script-installer.git
```

2. Install dependencies (using bun for faster installs)
```bash
bun install
```

3. Build the project
```bash
bun run build
```

## 🚀 Usage

### Basic Usage
```bash
node lib/index.js <package-name> [install-count] [concurrency]
```

### Parameters
- `package-name` (required): The npm package to install
- `install-count` (optional): Number of installations (default: 1)
- `concurrency` (optional): Parallel installations per batch (default: 5)

### Examples

**Install lodash 10 times with default concurrency (5):**
```bash
node lib/index.js lodash 10
```

**Install react 50 times with 10 parallel installations:**
```bash
node lib/index.js react 50 10
```

**Quick test with 3 installations and 2 parallel:**
```bash
node lib/index.js lodash 3 2
```

### Performance Comparison

| Method | 10 Installations | 50 Installations | 100 Installations |
|--------|------------------|------------------|-------------------|
| **Old (Sequential)** | ~200 seconds | ~1000 seconds | ~2000 seconds |
| **New (Parallel)** | ~20 seconds | ~100 seconds | ~200 seconds |
| **Speed Improvement** | **10x faster** | **10x faster** | **10x faster** |

## 🔧 How It Works

1. **Batch Processing**: Splits installations into batches based on concurrency setting
2. **Parallel Execution**: Within each batch, installations run simultaneously using `Promise.all()`
3. **Smart Delays**: Random delays between 1-5 seconds simulate real user behavior
4. **Registry Protection**: 2-second delays between batches prevent overwhelming npm registry
5. **Cleanup**: Automatically creates and deletes temporary directories for each installation

## 📊 Output Example

```
📦 Package: lodash
🔢 Total installations: 10
⚡ Concurrency: 5 parallel installations
⏱️  Estimated time: 6 seconds

🚀 Processing batch 1 with 5 installations...
[1] Created directory abc123
[1] Package installed: true
[1] ✅ Installation completed successfully
...

🎉 All installations completed!
📊 Total time: 12.34 seconds
📈 Average time per installation: 1.23 seconds
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
