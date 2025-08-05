# MongoDB Setup Guide

## Option A: Local MongoDB Installation (Recommended for Development)

### Windows Installation:
1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB**:
   - Run the installer as Administrator
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**:
   ```bash
   # Check if MongoDB service is running
   net start | findstr MongoDB
   
   # Or start MongoDB manually
   mongod --dbpath "C:\data\db"
   ```

4. **Create Database Directory** (if not using service):
   ```bash
   mkdir C:\data\db
   ```

## Option B: MongoDB Atlas (Cloud Database - Quick Setup)

### Setup Steps:
1. **Create MongoDB Atlas Account**:
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create a Cluster**:
   - Choose "Build a Database" → "Free" tier
   - Select a cloud provider and region
   - Create cluster (takes 1-3 minutes)

3. **Configure Database Access**:
   - Go to "Database Access" → "Add New Database User"
   - Create username/password (save these!)
   - Grant "Read and write to any database" permissions

4. **Configure Network Access**:
   - Go to "Network Access" → "Add IP Address"
   - Add "0.0.0.0/0" for development (allows all IPs)
   - **Note**: In production, restrict to specific IPs

5. **Get Connection String**:
   - Go to "Databases" → "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Environment Configuration:

Create `backend/.env.local` file:
```env
# Local MongoDB (Option A)
MONGODB_URI=mongodb://localhost:27017/gun-lol-clone

# OR MongoDB Atlas (Option B)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gun-lol-clone?retryWrites=true&w=majority

# Server Configuration
PORT=3001
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Discord OAuth (Optional - for authentication)
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_CALLBACK_URL=http://localhost:3001/auth/discord/callback
```

## Quick Start Commands:

### After MongoDB Setup:
```bash
# Start development servers
pnpm dev

# Or start individually:
pnpm --filter backend start:dev
pnpm --filter frontend dev
```

### Verify Database Connection:
The backend will show connection status in the console:
- ✅ Success: "Connected to MongoDB"
- ❌ Error: "Unable to connect to the database"

## Troubleshooting:

### Common Issues:
1. **Connection Refused**: MongoDB service not running
2. **Authentication Failed**: Wrong username/password for Atlas
3. **Network Error**: IP not whitelisted in Atlas
4. **Database Not Found**: Database will be created automatically on first connection

### Solutions:
- Check MongoDB service status: `net start | findstr MongoDB`
- Verify connection string format
- Check firewall settings
- Ensure environment variables are loaded correctly
