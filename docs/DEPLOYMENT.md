# Deployment Guide

This guide covers various deployment options for the Gun.lol Clone application.

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Database Setup](#database-setup)
5. [SSL Configuration](#ssl-configuration)
6. [Monitoring](#monitoring)

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gun-lol-clone

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# Discord OAuth
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=https://your-api-domain.com/auth/discord/callback
```

### Frontend Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Docker Deployment

### Development

```bash
# Clone the repository
git clone <repository-url>
cd gun.lol-clone

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit environment files with your values
# Start services
docker-compose up --build
```

### Production

```bash
# Create production environment file
cp .env.example .env.production

# Edit with production values
nano .env.production

# Deploy with production configuration
docker-compose -f docker-compose.prod.yml up -d --build
```

## Cloud Deployment

### Vercel (Frontend)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your Git repository
   - Select the `frontend` directory as the root

2. **Configure Build Settings**
   ```bash
   # Build Command
   cd .. && pnpm build:shared && cd frontend && pnpm build
   
   # Output Directory
   .next
   
   # Install Command
   cd .. && pnpm install
   ```

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   ```

4. **Deploy**
   - Push to main branch for automatic deployment
   - Or manually trigger deployment from Vercel dashboard

### Railway (Backend)

1. **Create New Project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Create new project from GitHub repository

2. **Configure Service**
   - Select the `backend` directory
   - Set build command: `cd .. && pnpm build:shared && cd backend && pnpm build`
   - Set start command: `node dist/main`

3. **Add MongoDB**
   - Add MongoDB plugin to your Railway project
   - Copy the connection string

4. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://mongo:password@mongodb.railway.internal:27017
   JWT_SECRET=your-super-secret-jwt-key
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   DISCORD_CALLBACK_URL=https://your-backend-url.railway.app/auth/discord/callback
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Railway will automatically deploy on push to main branch

### Heroku (Alternative)

1. **Create Heroku Apps**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   
   # Create apps
   heroku create gun-lol-backend
   heroku create gun-lol-frontend
   ```

2. **Add MongoDB**
   ```bash
   # Add MongoDB Atlas addon
   heroku addons:create mongolab:sandbox -a gun-lol-backend
   ```

3. **Configure Environment Variables**
   ```bash
   # Backend
   heroku config:set NODE_ENV=production -a gun-lol-backend
   heroku config:set JWT_SECRET=your-secret -a gun-lol-backend
   heroku config:set DISCORD_CLIENT_ID=your-id -a gun-lol-backend
   heroku config:set DISCORD_CLIENT_SECRET=your-secret -a gun-lol-backend
   
   # Frontend
   heroku config:set NEXT_PUBLIC_API_URL=https://gun-lol-backend.herokuapp.com -a gun-lol-frontend
   ```

4. **Deploy**
   ```bash
   # Deploy backend
   git subtree push --prefix backend heroku-backend main
   
   # Deploy frontend
   git subtree push --prefix frontend heroku-frontend main
   ```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster
   - Choose your preferred region

2. **Configure Access**
   - Add your IP address to whitelist
   - Create database user with read/write permissions

3. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use gun-lol-clone
db.createUser({
  user: "gunlol",
  pwd: "secure-password",
  roles: ["readWrite"]
})
```

## SSL Configuration

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d your-domain.com -d api.your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Manual SSL Setup

1. **Obtain SSL Certificates**
   - Purchase from a CA or use Let's Encrypt
   - Place certificates in `nginx/ssl/` directory

2. **Update Nginx Configuration**
   - Uncomment HTTPS server block in `nginx/nginx.conf`
   - Update domain names and certificate paths

## Monitoring

### Health Checks

The application includes health check endpoints:

- Frontend: `GET /health`
- Backend: `GET /health`

### Logging

Configure logging for production:

```javascript
// backend/src/main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

// Log application startup
logger.log(`Application is running on: ${await app.getUrl()}`);
```

### Error Tracking

Consider integrating error tracking services:

- [Sentry](https://sentry.io) for error monitoring
- [LogRocket](https://logrocket.com) for session replay
- [DataDog](https://datadoghq.com) for comprehensive monitoring

### Performance Monitoring

Monitor application performance:

```javascript
// frontend/src/lib/analytics.ts
export function trackWebVitals(metric) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Google Analytics, Mixpanel, etc.
  }
}
```

## Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:port/database" --out=/backup/path

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
find /backups -type d -mtime +7 -exec rm -rf {} \;
```

### File Backups

```bash
# Backup uploaded files (if any)
rsync -av /app/uploads/ /backup/uploads/

# Backup configuration
tar -czf config_backup.tar.gz nginx/ docker-compose.prod.yml .env.production
```

## Scaling

### Horizontal Scaling

```yaml
# docker-compose.scale.yml
version: '3.8'
services:
  backend:
    deploy:
      replicas: 3
  
  frontend:
    deploy:
      replicas: 2
```

### Load Balancing

Update nginx configuration for multiple backend instances:

```nginx
upstream backend {
    server backend_1:3000;
    server backend_2:3000;
    server backend_3:3000;
}
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify `FRONTEND_URL` environment variable
   - Check CORS configuration in backend

2. **Database Connection**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database user has proper permissions

3. **Discord OAuth**
   - Verify callback URL matches Discord app settings
   - Check client ID and secret
   - Ensure redirect URI is whitelisted

### Logs

```bash
# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View specific container logs
docker logs gun-lol-backend-prod
```

### Health Checks

```bash
# Check application health
curl https://your-domain.com/health
curl https://api.your-domain.com/health

# Check database connection
mongo "mongodb://user:pass@host:port/database" --eval "db.stats()"
```
