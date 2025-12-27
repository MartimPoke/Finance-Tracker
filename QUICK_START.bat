@echo off
echo ========================================
echo FinTrack - GitHub Upload Helper
echo ========================================
echo.

REM Check if git is available
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from:
    echo https://git-scm.com/download/win
    echo.
    echo After installing, restart this script.
    pause
    exit /b 1
)

echo Git found! Starting upload process...
echo.

REM Initialize git if needed
if not exist .git (
    echo Initializing Git repository...
    git init
)

REM Add all files
echo Adding files...
git add .

REM Check if there are changes
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to commit.
    echo Files may already be committed.
) else (
    echo Creating commit...
    git commit -m "Initial commit: FinTrack - Minimalist Expense Tracker"
)

REM Set branch to main
git branch -M main 2>nul

REM Add remote (remove if exists first)
git remote remove origin 2>nul
git remote add origin https://github.com/MartimPoke/Finance-Tracker.git

echo.
echo Ready to push to GitHub!
echo You will be prompted for your GitHub username and password.
echo (Use a Personal Access Token as password)
echo.
echo Press any key to continue with git push...
pause >nul

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Files uploaded to GitHub!
    echo ========================================
    echo Repository: https://github.com/MartimPoke/Finance-Tracker
) else (
    echo.
    echo ========================================
    echo Push failed. You may need to:
    echo 1. Create a Personal Access Token at:
    echo    https://github.com/settings/tokens
    echo 2. Use the token as your password
    echo ========================================
)

echo.
pause

