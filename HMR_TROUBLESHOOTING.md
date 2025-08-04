# Next.js 15 + React 19 + Turbopack HMR Troubleshooting Guide

## Issue Description
Error: Module jsx-dev-runtime was instantiated but the module factory is not available during HMR updates.

## Root Causes
1. **React 19 + Turbopack Compatibility**: React 19 is cutting-edge and has some HMR edge cases with Turbopack
2. **Monorepo Module Resolution**: Shared package dependencies can cause module resolution conflicts
3. **JSX Runtime Instability**: Turbopack's HMR can lose track of React's JSX runtime during hot reloads

## Solutions Applied

### 1. Next.js Configuration Updates
- Added Turbopack-specific configuration for better HMR stability
- Configured resolve aliases for consistent React resolution
- Disabled experimental React compiler for stability

### 2. TypeScript Configuration Improvements
- Updated target to ES2020 for better React 19 compatibility
- Added `verbatimModuleSyntax: false` for module resolution
- Enhanced module resolution settings

### 3. Error Recovery System
- Created ErrorBoundary component for HMR error recovery
- Added automatic recovery for HMR-related errors
- Implemented development-specific error handling

### 4. Alternative Development Scripts
- `pnpm dev` - Default with Turbopack (recommended)
- `pnpm dev:webpack` - Fallback using Webpack bundler
- `pnpm dev:safe` - Turbopack with experimental HTTPS
- `pnpm clean` - Clean build cache when issues persist

## Troubleshooting Steps

### Step 1: Quick Recovery
```bash
# Clear Next.js cache
pnpm clean

# Restart development server
pnpm dev
```

### Step 2: If Error Persists
```bash
# Try Webpack instead of Turbopack
pnpm dev:webpack
```

### Step 3: For Persistent Issues
```bash
# Clean everything and reinstall
rm -rf .next node_modules/.cache
pnpm install
pnpm --filter shared build
pnpm dev
```

### Step 4: Monorepo-Specific Issues
```bash
# Ensure shared package is built
pnpm --filter shared build

# Check for version conflicts
pnpm list react react-dom
```

## Prevention Measures

### 1. Development Best Practices
- Always build shared package before starting development
- Use consistent Node.js and pnpm versions across team
- Avoid mixing npm and pnpm in the same project

### 2. Code Practices
- Minimize dynamic imports in development
- Use stable component patterns
- Avoid complex HOCs that might confuse HMR

### 3. Environment Setup
- Use Node.js 18+ for best compatibility
- Keep dependencies up to date
- Use exact versions for critical packages

## Error Recovery Features

The ErrorBoundary component now includes:
- Automatic detection of HMR-related errors
- Self-recovery attempts for development errors
- Detailed error information in development mode
- Graceful fallback UI for users

## When to Use Each Development Mode

### Use Turbopack (`pnpm dev`) when:
- Normal development workflow
- Working on UI components
- Making frequent changes

### Use Webpack (`pnpm dev:webpack`) when:
- Experiencing persistent HMR issues
- Working with complex build configurations
- Need maximum stability

### Use Clean Build when:
- Switching between branches
- After major dependency updates
- When cache corruption is suspected

## Monitoring and Debugging

### Browser Console
- Check for HMR-related warnings
- Look for module resolution errors
- Monitor React DevTools for component updates

### Development Server Logs
- Watch for compilation errors
- Check for module not found warnings
- Monitor build performance

## Future Considerations

As React 19 and Turbopack mature:
- Monitor Next.js release notes for HMR improvements
- Consider upgrading to stable React 19 releases
- Evaluate Turbopack stability improvements

## Emergency Fallbacks

If all else fails:
1. Use `pnpm dev:webpack` for immediate stability
2. Consider temporarily downgrading to React 18
3. Use production build for critical demos: `pnpm build && pnpm start`
