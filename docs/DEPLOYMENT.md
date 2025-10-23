# DEPLOYMENT GUIDE - Pairings Project

**Last Updated:** October 22, 2025  
**Supported Environments:** Local, Beta (Free), Production (VPS)

---

## Overview

This guide covers three deployment scenarios:
1. **Local Development** - Running everything on your machine ($0)
2. **Beta Deployment** - Free tier hosting for testing ($0-5/month)
3. **Production Deployment** - Self-hosted VPS ($6-10/month)

---

## Prerequisites

### Required Software

**For All Environments:**
- Node.js (v18 or higher)
- npm or yarn
- Git
- VS Code (recommended)

**For Production:**
- SSH client
- Basic Linux command line knowledge

---

## Environment Variables

Create `.env` files for each environment with these variables:

### Backend `.env`

```bash
# Application
NODE_ENV=development # or 'production'
PORT=3000
API_URL=http://localhost:3000

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Authentication (Supabase)
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:19006

# Push Notifications (Firebase)
FIREBASE_SERVER_KEY=your-firebase-key

# File Storage (Optional)
CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY=your-access-key
CLOUDFLARE_R2_SECRET_KEY=your-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info # or 'debug', 'warn', 'error'
```

### Frontend `.env`

```bash
# API Configuration
API_URL=http://localhost:3000
WS_URL=ws://localhost:3000

# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
EXPO_PUBLIC_APP_NAME=Pairings Project
EXPO_PUBLIC_APP_VERSION=0.1.0

# Environment
EXPO_PUBLIC_ENV=development # or 'production'
```

---

## Deployment Scenario 1: Local Development

**Cost:** $0  
**Purpose:** Development and testing

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/pairings-project.git
cd pairings-project
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project (free tier)
3. Go to Project Settings → API
4. Copy Project URL and anon key
5. Go to Database → Connection String
6. Copy connection string

### Step 3: Set Up Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

**Run database migrations:**
```bash
npm run migrate
# or manually run SQL from docs/DATABASE.md
```

**Start backend server:**
```bash
npm run dev
```

Server should be running at `http://localhost:3000`

### Step 4: Set Up Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
```

**Start Expo dev server:**
```bash
npx expo start
```

### Step 5: Test

1. Open Expo Go app on your phone
2. Scan QR code
3. App should load
4. Create test account
5. Test features

---

## Deployment Scenario 2: Free Beta Hosting

**Cost:** $0-5/month  
**Purpose:** Beta testing with real users

### Architecture

```
Frontend: Vercel (free)
Backend: Railway.app (free $5 credit/month)
Database: Supabase (free tier)
```

### Step 1: Deploy Database (Supabase)

Already set up from local dev - use same project.

**Check limits:**
- 500 MB database
- 2 GB bandwidth/month
- 50 MB file storage

If you need more, upgrade to Pro ($25/month).

### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Select your backend repository

**Configure environment variables:**
- Go to Variables tab
- Add all variables from backend `.env`
- Update `FRONTEND_URL` to your Vercel URL (after Step 3)

**Railway will automatically:**
- Detect Node.js
- Install dependencies
- Start server
- Provide public URL

**Copy the public URL** (e.g., `your-app.up.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your frontend repository

**Configure build settings:**
```
Framework Preset: Other
Build Command: expo export:web
Output Directory: dist
```

**Environment variables:**
- Add all variables from frontend `.env`
- Update `API_URL` to Railway URL from Step 2

**Deploy!**

Vercel provides URL (e.g., `your-app.vercel.app`)

### Step 4: Update Backend CORS

Go back to Railway → Variables:
- Update `FRONTEND_URL` to your Vercel URL
- Redeploy if needed

### Step 5: Test Production

1. Visit your Vercel URL
2. Create account
3. Test all features
4. Monitor Railway logs for errors

### Monitoring

**Railway:**
- View logs in dashboard
- Check deployments
- Monitor usage

**Supabase:**
- Check database usage
- Monitor API requests
- View auth logs

---

## Deployment Scenario 3: Production VPS

**Cost:** $6-10/month  
**Purpose:** Full control, best for scaling

### Architecture

```
Frontend: Vercel (free)
Backend + Database: Hetzner VPS
```

### Step 1: Purchase VPS

**Recommended: Hetzner**

1. Go to [hetzner.com](https://www.hetzner.com)
2. Create account
3. Order Cloud Server

**Recommended specs:**
- **Model:** CX21 or CPX11
- **CPU:** 2-4 cores
- **RAM:** 4-8 GB
- **Storage:** 40-80 GB
- **Location:** Choose closest to users
- **OS:** Ubuntu 24.04 LTS
- **Cost:** €4.50-8/month (~$5-9 USD)

**After creation, note:**
- IP address
- Root password (sent via email)

### Step 2: Initial Server Setup

**SSH into server:**
```bash
ssh root@YOUR_SERVER_IP
```

**Update system:**
```bash
apt update && apt upgrade -y
```

**Create non-root user:**
```bash
adduser deploy
usermod -aG sudo deploy
```

**Set up SSH keys:**
```bash
# On your local machine:
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-copy-id deploy@YOUR_SERVER_IP
```

**Disable root login:**
```bash
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
systemctl restart ssh
```

**Set up firewall:**
```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 3: Install Dependencies

**Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

**Install PostgreSQL:**
```bash
sudo apt install postgresql postgresql-contrib
```

**Install Nginx:**
```bash
sudo apt install nginx
```

**Install PM2 (process manager):**
```bash
sudo npm install -g pm2
```

### Step 4: Set Up Database

**Switch to postgres user:**
```bash
sudo -u postgres psql
```

**Create database and user:**
```sql
CREATE DATABASE pairings_db;
CREATE USER pairings_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pairings_db TO pairings_user;
\q
```

**Configure PostgreSQL for remote access (if needed):**
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
# Uncomment and set: listen_addresses = 'localhost'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: local   all   pairings_user   md5

sudo systemctl restart postgresql
```

### Step 5: Deploy Backend Application

**Create app directory:**
```bash
sudo mkdir -p /var/www/pairings-backend
sudo chown deploy:deploy /var/www/pairings-backend
cd /var/www/pairings-backend
```

**Clone repository:**
```bash
git clone https://github.com/yourusername/pairings-project.git .
cd backend
```

**Install dependencies:**
```bash
npm install --production
```

**Create .env file:**
```bash
nano .env
# Add production environment variables
# DATABASE_URL=postgresql://pairings_user:password@localhost:5432/pairings_db
```

**Run database migrations:**
```bash
npm run migrate
```

**Start with PM2:**
```bash
pm2 start npm --name "pairings-api" -- start
pm2 save
pm2 startup
```

**Test:**
```bash
curl http://localhost:3000/health
```

### Step 6: Configure Nginx

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/pairings-api
```

**Add configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com; # or use IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/pairings-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: Set Up SSL (Let's Encrypt)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

**Get certificate:**
```bash
sudo certbot --nginx -d api.yourdomain.com
```

Certbot will automatically configure Nginx for HTTPS.

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

### Step 8: Deploy Frontend to Vercel

Same as Beta deployment (Step 3 in Scenario 2), but:
- Update `API_URL` to `https://api.yourdomain.com`

### Step 9: Set Up Monitoring

**Install monitoring tools:**
```bash
# System monitoring
sudo apt install htop

# Log monitoring
pm2 install pm2-logrotate
```

**Set up backups:**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/deploy/backups"
mkdir -p $BACKUP_DIR

pg_dump -U pairings_user pairings_db > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-db.sh
```

### Step 10: Configure DNS

**If using domain name:**

1. Go to your domain registrar
2. Add A record:
   - Name: `api` (or `@` for root domain)
   - Type: `A`
   - Value: `YOUR_SERVER_IP`
   - TTL: `3600`

3. Wait for DNS propagation (up to 24 hours)

### Step 11: Final Testing

1. Visit `https://api.yourdomain.com/health`
2. Should return 200 OK
3. Test frontend at Vercel URL
4. Create account and test features
5. Monitor logs: `pm2 logs pairings-api`

---

## Updating Production

### Backend Updates

**SSH into server:**
```bash
ssh deploy@YOUR_SERVER_IP
cd /var/www/pairings-backend/backend
```

**Pull latest code:**
```bash
git pull origin main
npm install --production
```

**Run migrations if any:**
```bash
npm run migrate
```

**Restart application:**
```bash
pm2 restart pairings-api
```

**Check logs:**
```bash
pm2 logs pairings-api
```

### Frontend Updates

**Push to GitHub:**
```bash
git push origin main
```

**Vercel auto-deploys** from GitHub (if configured).

Or manually:
```bash
vercel --prod
```

---

## Scaling

### When You Need to Scale

**Signs:**
- Server CPU consistently > 80%
- Database queries slow (> 1 second)
- Many users (> 1000 active)
- Large tournaments (> 100 players)

### Vertical Scaling (Easier)

**Upgrade VPS:**
1. Go to Hetzner dashboard
2. Select larger server (CX31, CX41)
3. Resize (usually requires restart)

### Horizontal Scaling (More complex)

**Add load balancer:**
1. Create multiple backend instances
2. Use Nginx as load balancer
3. Share database between instances

**Add caching:**
```bash
sudo apt install redis-server
```

Update backend to use Redis for:
- Session storage
- Tournament standings cache
- User data cache

**Database optimization:**
- Add indexes (see DATABASE.md)
- Enable query caching
- Consider read replicas

---

## Monitoring & Maintenance

### Daily Checks

**PM2 Status:**
```bash
pm2 status
```

**System resources:**
```bash
htop
df -h
```

**Database size:**
```bash
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('pairings_db'));"
```

### Weekly Maintenance

**Update system packages:**
```bash
sudo apt update && sudo apt upgrade -y
```

**Check PM2 logs:**
```bash
pm2 logs pairings-api --lines 100
```

**Database vacuum:**
```bash
sudo -u postgres psql pairings_db -c "VACUUM ANALYZE;"
```

### Monthly Maintenance

**Review backups:**
```bash
ls -lh /home/deploy/backups/
```

**Check SSL certificate expiry:**
```bash
sudo certbot certificates
```

**Review disk space:**
```bash
du -sh /var/www/*
du -sh /var/lib/postgresql/*
```

---

## Troubleshooting

### Backend Not Responding

**Check if running:**
```bash
pm2 status
```

**Restart:**
```bash
pm2 restart pairings-api
```

**Check logs:**
```bash
pm2 logs pairings-api --lines 50
```

### Database Connection Issues

**Check PostgreSQL status:**
```bash
sudo systemctl status postgresql
```

**Check connections:**
```bash
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

**Restart PostgreSQL:**
```bash
sudo systemctl restart postgresql
```

### High CPU Usage

**Check processes:**
```bash
htop
```

**Check PM2 processes:**
```bash
pm2 monit
```

**Optimize queries:**
- Check slow query log
- Add database indexes
- Implement caching

### Nginx Issues

**Test configuration:**
```bash
sudo nginx -t
```

**Check logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Restart:**
```bash
sudo systemctl restart nginx
```

---

## Security Best Practices

### Regular Updates

```bash
# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Firewall Rules

```bash
# Check current rules
sudo ufw status verbose

# Only allow necessary ports
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
```

### Database Security

```bash
# Limit connections to localhost
sudo nano /etc/postgresql/14/main/postgresql.conf
# Ensure: listen_addresses = 'localhost'

# Use strong passwords
# Never expose database port to internet
```

### Application Security

- Keep dependencies updated: `npm audit fix`
- Use environment variables for secrets
- Never commit `.env` files
- Enable rate limiting
- Implement HTTPS everywhere
- Regular security audits

---

## Backup & Disaster Recovery

### Automated Backups

**Database:**
```bash
# Already set up in Step 9
# Runs daily at 2 AM
```

**Application code:**
```bash
# Already in Git
# Always push changes
```

**Recovery Process:**

1. Set up new server (Steps 1-6)
2. Restore database:
```bash
psql -U pairings_user pairings_db < backup_file.sql
```
3. Deploy application (Step 5)
4. Update DNS (Step 10)

---

## Cost Breakdown

### Local Development
**Total: $0/month**

### Beta Deployment
- Supabase: $0 (free tier)
- Railway: $0-5 (free credit)
- Vercel: $0 (free tier)
**Total: $0-5/month**

### Production VPS
- Hetzner CX21: ~$6/month
- Vercel: $0 (free tier)
- Domain: ~$1/month (optional)
**Total: $6-10/month**

### At Scale (10,000 users)
- Hetzner CX41: ~$15/month
- Supabase Pro: $25/month (or migrate to VPS)
- Vercel Pro: $20/month (if needed)
- Domain + CDN: ~$5/month
**Total: $40-65/month**

---

## Support & Resources

**Hetzner:**
- Docs: https://docs.hetzner.com
- Support: Via customer portal

**Supabase:**
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

**Vercel:**
- Docs: https://vercel.com/docs
- Support: Via dashboard

---

**Document Version:** 1.0  
**Last Updated:** October 22, 2025  
**Next Review:** After first production deployment
