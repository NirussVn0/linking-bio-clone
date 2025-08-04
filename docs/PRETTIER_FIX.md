# Prettier Command Fix

This document explains how to fix the "prettier is not recognized as a command" error during git commits.

## Problem

When attempting to commit files, the pre-commit hook fails with:

```
✖ prettier --write:
'prettier' is not recognized as an internal or external command
```

This happens because:

1. The `prettier` command isn't found in the PATH during pre-commit hook execution
2. lint-staged was calling `prettier --write` directly instead of using `npx`
3. The hook execution environment doesn't include `node_modules/.bin` in the PATH

## Solution

### Fixed lint-staged Configuration

**Before:**

```json
{
  "lint-staged": {
    "*.{json,md}": ["prettier --write"]
  }
}
```

**After:**

```json
{
  "lint-staged": {
    "*.{json,md}": ["npx prettier --write"]
  }
}
```

### Updated All Prettier Commands

All package.json scripts now use `npx prettier`:

**Root package.json:**

```json
{
  "scripts": {
    "format": "npx prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "npx prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

**Backend package.json:**

```json
{
  "scripts": {
    "format": "npx prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  }
}
```

## How to Apply the Fix

The fix has already been applied to the codebase. If you encounter similar issues:

### Option 1: Use the Test Script

```bash
# On Windows
scripts\test-prettier.bat

# On Unix/Linux/Mac
chmod +x scripts/test-prettier.sh
./scripts/test-prettier.sh
```

### Option 2: Manual Verification

1. **Test Prettier directly:**

   ```bash
   npx prettier --version
   ```

2. **Test lint-staged:**

   ```bash
   echo '{"test": "value"}' > test.json
   git add test.json
   npx lint-staged --relative
   git reset HEAD test.json
   rm test.json
   ```

3. **Test full commit:**
   ```bash
   git add .
   git commit -m "test: verify prettier fix"
   ```

## Why This Works

### npx Command Resolution

`npx` automatically:

- Looks for commands in `node_modules/.bin`
- Falls back to installing packages if not found locally
- Works consistently across different environments
- Resolves PATH issues during hook execution

### Consistent Environment

Using `npx` ensures that:

- The same Prettier version is used everywhere
- Commands work in CI/CD environments
- No global Prettier installation is required
- Works across different operating systems

## Testing the Fix

After applying the fix, you can verify it works:

```bash
# Test individual commands
npx prettier --version
npx prettier --write "**/*.json"

# Test lint-staged
echo '{"test":"value"}' > test.json
git add test.json
npx lint-staged --relative

# Test full commit flow
git add test.json
git commit -m "test: prettier fix verification"
git reset HEAD~1  # Undo test commit
rm test.json
```

## Troubleshooting

If you still encounter issues:

### 1. Clear Package Cache

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### 2. Verify Prettier Installation

```bash
# Check if prettier is installed
pnpm list prettier

# Install if missing
pnpm add -D prettier
```

### 3. Check npx Functionality

```bash
# Test npx works
npx --version

# Test prettier via npx
npx prettier --help
```

### 4. Verify Git Hooks

```bash
# Check husky installation
ls -la .husky/

# Verify pre-commit hook
cat .husky/pre-commit
```

## Prevention

To avoid similar issues in the future:

1. **Always use npx for CLI tools** in scripts and hooks
2. **Test hooks locally** before pushing
3. **Use consistent commands** across all package.json files
4. **Document CLI tool usage** in project README

## Related Files

The following files were updated to fix this issue:

- `package.json` - Root lint-staged configuration and format scripts
- `backend/package.json` - Backend format script
- `scripts/test-prettier.sh` - Test script for Unix/Linux/Mac
- `scripts/test-prettier.bat` - Test script for Windows
- `docs/PRETTIER_FIX.md` - This documentation

## Additional Resources

- [npx Documentation](https://docs.npmjs.com/cli/v7/commands/npx)
- [Prettier CLI Documentation](https://prettier.io/docs/en/cli.html)
- [lint-staged Documentation](https://github.com/okonet/lint-staged)
- [Husky Documentation](https://typicode.github.io/husky/)
