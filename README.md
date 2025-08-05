# linking Bio Clone - Modern Interactive Web Application

A modern, interactive web application inspired by gun.lol/zyo.lol featuring stunning 3D visuals, smooth animations, Discord OAuth2 authentication, and a complete task management system.

## 👁️ Showcase

[mainpage](Images/mainpage.png)

[loginpage](Images/loginpage.png)

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
   # Build shared package
   pnpm build:shared
   # Build frontend
   pnpm build:frontend
   # Build backend
   pnpm build:backend
   ```

3. **Set up environment variables**
   - Discord OAuth2 Setup
4. Go to [Discord Developer Portal](https://discord.com/developers/applications)
5. Create a new application
6. Go to OAuth2 settings
7. Add redirect URI: `http://localhost:3000/auth/discord/callback`
8. Copy Client ID and Client Secret to your `.env` file

9. **Start the application**

   ```bash
   # Start all services
   pnpm dev

   # Or start individually
   pnpm dev:backend    # Backend on http://localhost:3000
   pnpm dev:frontend   # Frontend on http://localhost:3001
   ```

## 🐳 Docker Deployment

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

## 🔧 Troubleshooting

If you encounter issues during development:

- **ESLint configuration errors**: See [docs/ESLINT_FIX.md](docs/ESLINT_FIX.md)
- **Prettier command not found**: See [docs/PRETTIER_FIX.md](docs/PRETTIER_FIX.md)
- **Pre-commit hook failures**: Run the fix scripts in the `scripts/` directory

### Quick Fixes

```bash
# Fix ESLint issues
scripts/fix-eslint.sh  # or .bat on Windows

# Test Prettier configuration
scripts/test-prettier.sh  # or .bat on Windows
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
