# linking Bio Clone - Modern Interactive Web Application

A modern, interactive web application inspired by gun.lol/zyo.lol featuring stunning 3D visuals, smooth animations, Discord OAuth2 authentication, and a complete task management system.

## 👁️ Showcase

[mainpage](Images/mainpage.png)

[loginpage](Images/loginpage.png)

[taskpage](Images/taskpage.png)

## 🛠 Tech Stack

### Frontend

- Next.js
- Three.js
- Anime.js
- TailwindCSS

### Backend

- NestJS
- MongoDB 6+
- Node.js 18+
- pnpm 8+
- Discord Application (for OAuth2)

## 🚀Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NirussVn0/linking-bio-clone
   cd linking-bio-clone
   ```

2. **Install dependencies**

   ```bash
   pnpm i
   ```

3. **Set up environment variables**

### Discord OAuth2 Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/auth/discord/callback`
5. Copy Client ID and Client Secret to your `.env` file

6. **Start the application**

   ```bash
   # Start all services
   pnpm dev

   # Or start individually
   pnpm dev:backend    # Backend on http://localhost:3000
   pnpm dev:frontend   # Frontend on http://localhost:3001
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Test your changes
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
