# Gun.lol Clone - Modern Interactive Web Application

A modern, interactive web application inspired by gun.lol/zyo.lol featuring stunning 3D visuals, smooth animations, Discord OAuth2 authentication, and a complete task management system.

## 🚀 Features

- **Modern Design**: Bold, colorful aesthetic inspired by gun.lol/zyo.lol
- **3D Visuals**: Three.js powered rotating geometric shapes and particle systems
- **Smooth Animations**: Anime.js micro-interactions and page transitions
- **Discord OAuth2**: Secure authentication with Discord integration
- **Task Management**: Complete CRUD operations with real-time updates
- **Performance Optimized**: Core Web Vitals scores of 90+
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Responsive Design**: Mobile-first approach with modern CSS

## 🛠 Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Three.js** - 3D graphics and animations
- **Anime.js** - Smooth micro-interactions
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Backend
- **NestJS** - Node.js framework with TypeScript
- **MongoDB** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for session management
- **Jest** - Unit and integration testing
- **Helmet** - Security middleware

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance

## 📁 Project Structure

```
gun.lol-clone/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utility functions
│   ├── tests/               # E2E tests
│   └── public/              # Static assets
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── tasks/           # Task management module
│   │   ├── schemas/         # MongoDB schemas
│   │   └── dto/             # Data Transfer Objects
│   └── test/                # E2E tests
├── shared/                  # Shared types and utilities
│   └── src/
│       ├── types/           # TypeScript interfaces
│       └── utils/           # Shared utilities
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB 6+
- Discord Application (for OAuth2)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gun.lol-clone
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Backend (.env):
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Configure the following variables:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gun-lol-clone
   JWT_SECRET=your-super-secret-jwt-key
   DISCORD_CLIENT_ID=your-discord-client-id
   DISCORD_CLIENT_SECRET=your-discord-client-secret
   DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start the development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   pnpm dev:backend    # Backend on http://localhost:3000
   pnpm dev:frontend   # Frontend on http://localhost:3001
   ```

### Discord OAuth2 Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 settings
4. Add redirect URI: `http://localhost:3000/auth/discord/callback`
5. Copy Client ID and Client Secret to your `.env` file

## 🧪 Testing

### Unit Tests
```bash
# Frontend tests
pnpm test:frontend

# Backend tests  
pnpm test:backend

# All tests with coverage
pnpm test:coverage
```

### E2E Tests
```bash
# Install Playwright browsers
pnpm exec playwright install

# Run E2E tests
pnpm test:e2e

# Run E2E tests with UI
pnpm test:e2e:ui
```

## 📦 Building for Production

```bash
# Build all packages
pnpm build

# Build specific packages
pnpm build:frontend
pnpm build:backend
pnpm build:shared
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your repository to Vercel
2. Set environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku)

1. Set up MongoDB Atlas or use Railway's MongoDB
2. Configure environment variables
3. Deploy using Docker or direct deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🎨 Design System

### Colors
- **Primary**: `#ff0080` (Hot Pink)
- **Secondary**: `#00ff80` (Neon Green)  
- **Accent**: `#8000ff` (Purple)
- **Background**: `#000000` (Black)
- **Text**: `#ffffff` (White)

### Typography
- **Primary Font**: Inter (Sans-serif)
- **Monospace Font**: JetBrains Mono

### Components
- Glass morphism effects with backdrop blur
- Gradient text animations
- Smooth hover transitions
- Responsive grid layouts

## 🔧 API Documentation

### Authentication Endpoints

- `GET /auth/discord` - Initiate Discord OAuth2 flow
- `GET /auth/discord/callback` - Handle OAuth2 callback
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile

### Task Management Endpoints

- `GET /tasks` - Get paginated tasks with filters
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get specific task
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/stats` - Get task statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use conventional commit messages
- Write tests for new features
- Ensure accessibility compliance
- Maintain performance standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by gun.lol and zyo.lol design aesthetics
- Three.js community for 3D graphics resources
- Anime.js for smooth animation capabilities
- Next.js and NestJS teams for excellent frameworks
