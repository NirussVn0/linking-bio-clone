#!/bin/bash

echo "🧪 Testing Prettier configuration..."

# Test root prettier
echo "📦 Testing root Prettier:"
npx prettier --version
if [ $? -eq 0 ]; then
    echo "✅ Root Prettier working"
else
    echo "❌ Root Prettier failed"
    exit 1
fi

# Test backend prettier
echo "📦 Testing backend Prettier:"
cd backend
npx prettier --version
if [ $? -eq 0 ]; then
    echo "✅ Backend Prettier working"
else
    echo "❌ Backend Prettier failed"
    exit 1
fi
cd ..

# Test lint-staged configuration
echo "📦 Testing lint-staged with a dummy file:"
echo '{"test": "value"}' > test-prettier.json
git add test-prettier.json

echo "Running lint-staged on test file..."
npx lint-staged --relative
LINT_STAGED_EXIT_CODE=$?

# Clean up test file
rm -f test-prettier.json
git reset HEAD test-prettier.json 2>/dev/null || true

if [ $LINT_STAGED_EXIT_CODE -eq 0 ]; then
    echo "✅ lint-staged with Prettier working"
else
    echo "❌ lint-staged with Prettier failed"
    exit 1
fi

echo "🎉 All Prettier configurations are working!"
echo "💡 You can now commit files successfully."
