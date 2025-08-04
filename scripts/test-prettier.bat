@echo off
echo 🧪 Testing Prettier configuration...

echo 📦 Testing root Prettier:
npx prettier --version
if %errorlevel% neq 0 (
    echo ❌ Root Prettier failed
    exit /b 1
)
echo ✅ Root Prettier working

echo 📦 Testing backend Prettier:
cd backend
npx prettier --version
if %errorlevel% neq 0 (
    echo ❌ Backend Prettier failed
    exit /b 1
)
echo ✅ Backend Prettier working
cd ..

echo 📦 Testing lint-staged with a dummy file:
echo {"test": "value"} > test-prettier.json
git add test-prettier.json

echo Running lint-staged on test file...
npx lint-staged --relative
set LINT_STAGED_EXIT_CODE=%errorlevel%

rem Clean up test file
del test-prettier.json 2>nul
git reset HEAD test-prettier.json 2>nul

if %LINT_STAGED_EXIT_CODE% neq 0 (
    echo ❌ lint-staged with Prettier failed
    exit /b 1
)
echo ✅ lint-staged with Prettier working

echo 🎉 All Prettier configurations are working!
echo 💡 You can now commit files successfully.
