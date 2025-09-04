# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated daily package installations.

## 🚀 Available Workflows

### 1. `simple-daily.yml` (Recommended for beginners)
- **Purpose**: Simple daily installation with minimal configuration
- **Schedule**: Daily at 10:00 AM UTC
- **Mode**: Random daily mode
- **Packages**: hana-mcp-ui, hana-mcp-server (randomly selected)
- **Installations**: 50-60 per day (random)
- **Gaps**: 3-12 seconds between installations (random)
- **Concurrency**: Auto-calculated (safe)

### 2. `daily-install.yml` (Standard)
- **Purpose**: Configurable daily installation with manual trigger
- **Schedule**: Daily at 10:00 AM UTC
- **Modes**: Random daily mode (default) or manual mode
- **Features**: Manual trigger with custom parameters
- **Safety**: Input validation and error handling

### 3. `advanced-daily-install.yml` (Advanced)
- **Purpose**: Full-featured workflow with comprehensive monitoring
- **Schedule**: Daily at 10:00 AM UTC
- **Modes**: Random daily mode (default) or manual mode
- **Features**: 
  - Input validation
  - Multiple timezone support
  - Detailed logging
  - Artifact uploads
  - Performance monitoring

## 🛠️ Setup Instructions

### 1. Enable GitHub Actions
1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Enable GitHub Actions if prompted

### 2. Choose a Workflow
- **For beginners**: Use `simple-daily.yml`
- **For customization**: Use `daily-install.yml`
- **For advanced users**: Use `advanced-daily-install.yml`

### 3. Configure the Schedule
Edit the workflow file to change the schedule:

```yaml
on:
  schedule:
    - cron: '0 10 * * *'  # Daily at 10:00 AM UTC
```

**Cron Schedule Examples:**
- `'0 10 * * *'` - Daily at 10:00 AM UTC
- `'0 9 * * 1-5'` - Weekdays at 9:00 AM UTC
- `'0 14 * * 0'` - Sundays at 2:00 PM UTC
- `'0 8,20 * * *'` - Twice daily at 8:00 AM and 8:00 PM UTC

### 4. Customize Package and Settings
For `daily-install.yml` and `advanced-daily-install.yml`, you can customize:

```yaml
env:
  PACKAGE_NAME: 'your-package-name'  # Change this
  INSTALL_COUNT: '20'                # Number of installations
  CONCURRENCY: '5'                   # Parallel installations (optional)
```

## 🎯 Manual Triggering

You can manually run any workflow:

1. Go to the "Actions" tab in your repository
2. Select the workflow you want to run
3. Click "Run workflow"
4. Fill in the parameters (for configurable workflows)
5. Click "Run workflow"

## 📊 Monitoring

### View Run History
- Go to "Actions" tab
- Click on a workflow
- View run history and logs

### Check Logs
- Click on any run
- Expand the steps to see detailed logs
- Download artifacts if the run failed

### Success Indicators
- ✅ Green checkmark = Success
- ❌ Red X = Failure
- 🟡 Yellow circle = In progress

## ⚠️ Important Notes

### Rate Limiting
- The workflows use safe concurrency settings
- Default: 10 installations per day
- Maximum recommended: 50 installations per day

### Security
- Workflows run in isolated environments
- No access to your local machine
- Temporary files are cleaned up automatically

### Costs
- GitHub Actions provides 2,000 free minutes per month
- Each run typically takes 2-5 minutes
- Free tier should be sufficient for daily runs

## 🔧 Troubleshooting

### Common Issues

**Workflow not running:**
- Check if GitHub Actions is enabled
- Verify the cron schedule syntax
- Ensure the workflow file is in `.github/workflows/`

**Installation failures:**
- Check the logs for error messages
- Verify the package name is correct
- Reduce install count or concurrency

**Rate limiting:**
- Reduce the number of installations
- Increase delays between runs
- Check npm registry status

### Getting Help
1. Check the workflow logs
2. Review the error messages
3. Try reducing the install count
4. Test with manual runs first

## 📈 Best Practices

1. **Start Small**: Begin with 5-10 installations
2. **Monitor Closely**: Check logs for the first few runs
3. **Use Safe Settings**: Let the tool auto-calculate concurrency
4. **Regular Monitoring**: Check weekly for any issues
5. **Backup Strategy**: Keep local copies of successful configurations

## 🎉 Success Metrics

A successful daily run should show:
- ✅ All installations completed
- 📊 Reasonable completion time (2-10 minutes)
- 🛡️ No rate limiting errors
- 🧹 Clean cleanup

---

**Remember**: These workflows are for testing and demonstration purposes. Use responsibly and in accordance with npm's terms of service.
