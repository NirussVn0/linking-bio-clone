# Next.js 15.4.5 Frontend Fixes

This document outlines the fixes applied to resolve issues in the Next.js 15.4.5 frontend application.

## Issues Resolved

### 1. Package Manager Lockfile Conflict ✅

**Issue**: Warning about multiple lockfiles (package-lock.json and pnpm-lock.yaml)
```
⚠ Warning: Found multiple lockfiles. Selecting B:\__CODEBASE__\package-lock.json.
```

**Solution**: 
- Ensured the project uses pnpm consistently as configured in `package.json` (`"packageManager": "pnpm@8.15.0"`)
- Built the shared package using `pnpm --filter shared build`
- The project is properly configured as a pnpm workspace with `pnpm-workspace.yaml`

### 2. Next.js Metadata Configuration Warnings ✅

**Issue**: Unsupported metadata configuration warnings
```
⚠ Unsupported metadata viewport is configured in metadata export
⚠ Unsupported metadata themeColor is configured in metadata export
```

**Solution**: Updated `frontend/src/app/layout.tsx` to use Next.js 15 App Router pattern:

**Before**:
```typescript
export const metadata: Metadata = {
  // ...
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  // ...
};
```

**After**:
```typescript
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  // viewport and themeColor removed from here
  // ...
};
```

### 3. Missing Discord Authentication Route ✅

**Issue**: 404 errors for `/auth/discord` endpoint
```
GET /auth/discord 404
```

**Solution**: Created complete Discord OAuth2 authentication flow:

#### Files Created:
1. **`frontend/src/app/api/auth/discord/route.ts`**
   - Handles Discord OAuth2 authorization initiation
   - Generates secure state parameter for CSRF protection
   - Redirects to Discord authorization URL

2. **`frontend/src/app/api/auth/discord/callback/route.ts`**
   - Handles Discord OAuth2 callback
   - Exchanges authorization code for access token
   - Fetches user information from Discord API
   - Communicates with backend for authentication
   - Sets secure authentication cookies

3. **`frontend/src/app/api/auth/logout/route.ts`**
   - Handles user logout
   - Clears authentication cookies
   - Supports both POST and GET methods

4. **`frontend/.env.example`**
   - Documents required environment variables for Discord OAuth2

#### Environment Variables Required:
```env
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback
BACKEND_URL=http://localhost:3001
```

### 4. Shared Package Module Resolution ✅

**Issue**: Module not found errors for `@gun-lol-clone/shared`
```
Module not found: Can't resolve '@gun-lol-clone/shared'
```

**Solution**: 
- Built the shared package using `pnpm --filter shared build`
- This generated the required `dist/` folder with compiled JavaScript and TypeScript definitions
- The shared package is now properly available to frontend and backend

## Development Workflow

### Initial Setup:
```bash
# Install dependencies
pnpm install

# Build shared package (required before running frontend/backend)
pnpm --filter shared build

# Run development servers
pnpm dev
```

### For Discord OAuth2 Setup:
1. Create a Discord application at https://discord.com/developers/applications
2. Copy the Client ID and Client Secret
3. Set the redirect URI to `http://localhost:3000/api/auth/discord/callback`
4. Create a `.env.local` file in the frontend directory with the required variables

## Security Considerations

- State parameter used for CSRF protection in OAuth2 flow
- Secure cookie settings for production environment
- HttpOnly cookies for authentication tokens
- Proper error handling and logging
- Input validation for OAuth2 parameters

## Testing the Fixes

1. **Package Manager**: No more lockfile warnings when running `pnpm dev`
2. **Metadata**: No more viewport/themeColor warnings in Next.js console
3. **Discord Auth**: `/auth/discord` route now returns proper OAuth2 redirect instead of 404
4. **Shared Package**: Frontend can now import from `@gun-lol-clone/shared` without errors

All issues have been resolved and the application should now run without the reported warnings and errors.
