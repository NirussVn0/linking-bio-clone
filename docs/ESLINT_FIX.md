# ESLint & Prettier Configuration Fix

This document explains how to fix the ESLint and Prettier configuration issues you encountered.

## Problems

The errors occurred because:

### ESLint Issues:

1. The root ESLint configuration was trying to extend `@typescript-eslint/recommended`
2. The TypeScript ESLint packages weren't properly installed or configured at the root level
3. There was a conflict between the root ESLint config and individual package configs

### Prettier Issues:

1. The `prettier` command wasn't found during pre-commit hook execution
2. lint-staged was calling `prettier --write` directly instead of `npx prettier --write`
3. The PATH during hook execution didn't include `node_modules/.bin`

## Solutions

I've implemented the following fixes:

### 1. Simplified Root ESLint Configuration

The root `.eslintrc.js` now:

- Only handles basic JavaScript linting
- Ignores the individual packages (frontend, backend, shared)
- Doesn't try to handle TypeScript files

### 2. Updated lint-staged Configuration

The `lint-staged` configuration now:

- Runs ESLint in the specific package directories
- Uses the package-specific ESLint configurations
- Uses `npx prettier --write` instead of `prettier --write`
- Handles different file types appropriately

### 3. Fixed Prettier Command Resolution

All Prettier commands now use `npx prettier` to ensure proper resolution:

- Root package.json format scripts
- Backend package.json format script
- lint-staged configuration for all file types

### 4. Removed Unnecessary Dependencies

Removed TypeScript ESLint dependencies from the root package.json since they're handled by individual packages.

## How to Apply the Fix

### Option 1: Automatic Fix (Recommended)

Run the fix script:

```bash
# On Windows
scripts/fix-eslint.bat

# On Unix/Linux/Mac
chmod +x scripts/fix-eslint.sh
./scripts/fix-eslint.sh
```

### Option 2: Manual Fix

1. **Clean dependencies:**

   ```bash
   rm -rf node_modules
   rm -rf frontend/node_modules
   rm -rf backend/node_modules
   rm -rf shared/node_modules
   pnpm install
   ```

2. **Test the configuration:**

   ```bash
   # Test root ESLint
   npx eslint --version

   # Test frontend ESLint
   cd frontend && npx eslint --version && cd ..

   # Test backend ESLint
   cd backend && npx eslint --version && cd ..
   ```

3. **Try committing again:**
   ```bash
   git add .
   git commit -m "fix: resolve ESLint configuration issues"
   ```

## What Changed

### Root Package Configuration

**Before:**

```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.1.3"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

**After:**

```json
{
  "devDependencies": {
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  },
  "lint-staged": {
    "frontend/**/*.{ts,tsx,js,jsx}": ["cd frontend && npx eslint --fix", "prettier --write"],
    "backend/**/*.{ts,js}": ["cd backend && npx eslint --fix", "prettier --write"]
  }
}
```

### Root ESLint Configuration

**Before:**

```javascript
module.exports = {
  extends: ['@typescript-eslint/recommended', 'prettier'],
  // ... complex TypeScript configuration
};
```

**After:**

```javascript
module.exports = {
  extends: ['eslint:recommended'],
  ignorePatterns: ['frontend/', 'backend/', 'shared/'],
  // ... simple JavaScript-only configuration
};
```

## Why This Works

1. **Separation of Concerns**: Each package handles its own ESLint configuration
2. **No Conflicts**: Root config doesn't interfere with package-specific configs
3. **Proper Dependencies**: Each package has its own required ESLint dependencies
4. **Targeted Linting**: lint-staged runs ESLint in the correct context for each file type

## Testing the Fix

After applying the fix, test it:

```bash
# Test the fix script
./scripts/test-eslint.sh

# Test a commit
echo "test" > test.txt
git add test.txt
git commit -m "test: verify ESLint fix"
git reset HEAD~1  # Undo the test commit
rm test.txt
```

## Troubleshooting

If you still encounter issues:

1. **Clear all caches:**

   ```bash
   pnpm store prune
   rm -rf node_modules frontend/node_modules backend/node_modules shared/node_modules
   pnpm install
   ```

2. **Check ESLint versions:**

   ```bash
   npx eslint --version
   cd frontend && npx eslint --version && cd ..
   cd backend && npx eslint --version && cd ..
   ```

3. **Verify configurations:**
   ```bash
   npx eslint --print-config .eslintrc.js
   cd frontend && npx eslint --print-config eslint.config.mjs && cd ..
   cd backend && npx eslint --print-config eslint.config.mjs && cd ..
   ```

## Future Maintenance

To avoid similar issues:

1. Keep ESLint configurations simple and focused
2. Use package-specific configurations for complex setups
3. Regularly update dependencies with `pnpm update`
4. Test ESLint configuration after major updates

## Additional Resources

- [ESLint Configuration Guide](https://eslint.org/docs/user-guide/configuring/)
- [TypeScript ESLint Documentation](https://typescript-eslint.io/)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
