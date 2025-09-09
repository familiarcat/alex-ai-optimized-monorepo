# N8N Bi-Directional Sync System

## Overview

This system provides comprehensive bi-directional synchronization between your development environment and N8N production instance at https://n8n.pbradygeorgen.com.

## Features

- **Bi-Directional Sync**: Changes flow both ways between dev and production
- **Real-time Monitoring**: Live monitoring of sync operations
- **Change Analysis**: Automatic analysis of workflow changes
- **Conflict Resolution**: Intelligent conflict detection and resolution
- **Web Dashboard**: Real-time dashboard for monitoring
- **Automated Scheduling**: Cron-based automated sync operations

## Quick Start

### 1. Start Sync
```bash
./start-sync.sh
```

### 2. Start Monitor
```bash
./start-monitor.sh
```

### 3. View Dashboard
```bash
./start-dashboard.sh
```
Then open http://localhost:8080/n8n-sync-dashboard.html

### 4. Check Status
```bash
./sync-status.sh
```

## Configuration

- **N8N_URL**: https://n8n.pbradygeorgen.com
- **Workflows Directory**: workflows
- **Analysis Directory**: analysis
- **Sync Interval**: Every 15 minutes
- **Monitor Interval**: Every 5 minutes

## Files Created

- `n8n-sync-config.json` - Main configuration
- `n8n-sync-history.json` - Sync operation history
- `n8n-sync-dashboard.json` - Dashboard data
- `workflows/` - Synced workflow files
- `analysis/` - Workflow change analyses

## Management Scripts

- `start-sync.sh` - Run sync manually
- `start-monitor.sh` - Start monitoring
- `start-dashboard.sh` - Start web dashboard
- `sync-status.sh` - Check sync status

## Logs

- `n8n-sync.log` - Sync operation logs
- `n8n-monitor.log` - Monitor logs

## Troubleshooting

1. **Check N8N connectivity**: Ensure N8N_API_KEY is set correctly
2. **Check logs**: Review log files for errors
3. **Check status**: Run `./sync-status.sh` for current status
4. **Manual sync**: Run `./start-sync.sh` for manual sync

## Support

For issues or questions, check the log files and run the status script.
