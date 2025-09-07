# Alex AI System Deployment Guide

## Production Deployment Checklist

### Pre-Deployment Requirements

- [ ] All tests passing (`./scripts/quick-production-test.sh`)
- [ ] Security audit clean (`./scripts/security-audit.sh`)
- [ ] API keys validated (`./scripts/validate-api-keys.sh`)
- [ ] Documentation complete
- [ ] Performance benchmarks met
- [ ] Error handling tested
- [ ] Monitoring configured

### Environment Setup

#### 1. Server Requirements

**Minimum Specifications:**
- CPU: 2 cores, 2.4GHz
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+ / macOS 12+

**Recommended Specifications:**
- CPU: 4 cores, 3.0GHz
- RAM: 8GB
- Storage: 50GB SSD
- OS: Ubuntu 22.04 LTS

#### 2. Dependencies Installation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python 3.8+
sudo apt install python3 python3-pip python3-venv

# Install Git
sudo apt install git

# Install build tools
sudo apt install build-essential
```

#### 3. Application Deployment

```bash
# Clone repository
git clone <repository-url>
cd musician-show-tour-app

# Install dependencies
npm install
pip install -r requirements.txt

# Set up secure API keys
./scripts/setup-secure-api-keys.sh

# Configure environment
cp .env.example .env
# Edit .env with production values

# Initialize Alex AI
./scripts/alexai-init.sh

# Run tests
./scripts/quick-production-test.sh
./scripts/security-audit.sh
```

### Production Configuration

#### 1. Environment Variables

Create production environment file:

```bash
# Production environment
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# API Configuration
ANTHROPIC_API_KEY=your-production-key
OPENAI_API_KEY=your-production-key

# Security
SESSION_SECRET=your-secure-session-secret
JWT_SECRET=your-jwt-secret

# Database (if using)
DATABASE_URL=your-database-url

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
```

#### 2. Process Management

**Using PM2:**

```bash
# Install PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'alexai-system',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/musician-show-tour-app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

**Using systemd:**

```bash
# Create systemd service
sudo tee /etc/systemd/system/alexai-system.service > /dev/null << EOF
[Unit]
Description=Alex AI System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/musician-show-tour-app
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable alexai-system
sudo systemctl start alexai-system
```

#### 3. Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx

# Create site configuration
sudo tee /etc/nginx/sites-available/alexai-system > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/alexai-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Monitoring and Logging

#### 1. Application Monitoring

**Health Check Endpoint:**

```javascript
// Add to your application
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

**Monitoring Script:**

```bash
#!/bin/bash
# health-check.sh

HEALTH_URL="http://localhost:3000/health"
LOG_FILE="/var/log/alexai-health.log"

check_health() {
    local response=$(curl -s -w "%{http_code}" "$HEALTH_URL")
    local http_code="${response: -3}"
    
    if [[ "$http_code" == "200" ]]; then
        echo "$(date): Health check passed" >> "$LOG_FILE"
        return 0
    else
        echo "$(date): Health check failed - HTTP $http_code" >> "$LOG_FILE"
        return 1
    fi
}

check_health
```

#### 2. Log Management

**Log Rotation:**

```bash
# Install logrotate
sudo apt install logrotate

# Create logrotate configuration
sudo tee /etc/logrotate.d/alexai-system > /dev/null << EOF
/var/log/alexai-*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload alexai-system
    endscript
}
EOF
```

#### 3. Performance Monitoring

**System Metrics:**

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Create monitoring script
cat > monitor.sh << 'EOF'
#!/bin/bash

echo "=== System Resources ==="
echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
echo "Disk Usage: $(df -h / | awk 'NR==2{printf "%s", $5}')"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo ""

echo "=== Application Status ==="
systemctl is-active alexai-system
echo ""

echo "=== Recent Logs ==="
tail -5 /var/log/alexai-system.log
EOF

chmod +x monitor.sh
```

### Backup and Recovery

#### 1. Automated Backups

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/alexai-system"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/path/to/musician-show-tour-app"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup application files
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" -C "$APP_DIR" .

# Backup configuration
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" ~/.alexai-keys

# Backup logs
tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" /var/log/alexai-*.log

# Clean old backups (keep 30 days)
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

#### 2. Recovery Procedures

**Application Recovery:**

```bash
# Stop application
sudo systemctl stop alexai-system

# Restore from backup
tar -xzf /backups/alexai-system/app_YYYYMMDD_HHMMSS.tar.gz -C /path/to/musician-show-tour-app

# Restore configuration
tar -xzf /backups/alexai-system/config_YYYYMMDD_HHMMSS.tar.gz -C ~/

# Restart application
sudo systemctl start alexai-system
```

### Security Hardening

#### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### 2. System Hardening

```bash
# Disable unnecessary services
sudo systemctl disable bluetooth
sudo systemctl disable cups

# Configure automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Set up fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Deployment Validation

#### 1. Post-Deployment Tests

```bash
# Run production tests
./scripts/quick-production-test.sh
./scripts/security-audit.sh

# Test API endpoints
curl -f http://localhost:3000/health
curl -f http://localhost:3000/api/status

# Test SSL certificate
curl -f https://your-domain.com/health
```

#### 2. Performance Validation

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:3000/

# Memory usage check
ps aux | grep node

# Response time check
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/
```

### Maintenance Procedures

#### 1. Regular Maintenance

**Daily:**
- Check application logs
- Monitor system resources
- Verify backup completion

**Weekly:**
- Run security audit
- Update dependencies
- Review performance metrics

**Monthly:**
- Full system backup
- Security updates
- Performance optimization review

#### 2. Update Procedures

```bash
# Create update script
cat > update.sh << 'EOF'
#!/bin/bash

# Backup current version
./backup.sh

# Pull latest changes
git pull origin main

# Install dependencies
npm install
pip install -r requirements.txt

# Run tests
./scripts/quick-production-test.sh

# Restart application
sudo systemctl restart alexai-system

# Verify deployment
curl -f http://localhost:3000/health
EOF

chmod +x update.sh
```

---

**Deployment Checklist Complete** ✅

This guide provides a comprehensive deployment strategy for the Alex AI System in production environments. Follow these procedures to ensure a secure, scalable, and maintainable deployment.
