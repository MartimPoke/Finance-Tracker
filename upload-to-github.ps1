# PowerShell script to upload project to GitHub
# Run this script in PowerShell: .\upload-to-github.ps1

Write-Host "Checking for Git..." -ForegroundColor Cyan

# Check if git is available
$gitPath = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $gitPath) {
    Write-Host "ERROR: Git is not found in your PATH." -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/downloads" -ForegroundColor Yellow
    Write-Host "Or add Git to your system PATH." -ForegroundColor Yellow
    exit 1
}

Write-Host "Git found at: $gitPath" -ForegroundColor Green
Write-Host ""

# Initialize git repository (if not already initialized)
if (-not (Test-Path .git)) {
    Write-Host "Initializing Git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to initialize git repository" -ForegroundColor Red
        exit 1
    }
}

# Add all files
Write-Host "Adding all files..." -ForegroundColor Cyan
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to add files" -ForegroundColor Red
    exit 1
}

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "Creating initial commit..." -ForegroundColor Cyan
    git commit -m "Initial commit: FinTrack - Minimalist Expense Tracker"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to create commit" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# Add remote (if not already added)
$remotes = git remote -v
if (-not $remotes -or $remotes -notmatch "origin.*Finance-Tracker") {
    Write-Host "Adding remote repository..." -ForegroundColor Cyan
    git remote remove origin 2>$null
    git remote add origin https://github.com/MartimPoke/Finance-Tracker.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to add remote" -ForegroundColor Red
        exit 1
    }
}

# Set branch to main
Write-Host "Setting branch to main..." -ForegroundColor Cyan
git branch -M main 2>$null

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "Note: You may be prompted for authentication credentials." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully uploaded to GitHub!" -ForegroundColor Green
    Write-Host "Repository: https://github.com/MartimPoke/Finance-Tracker" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "Failed to push to GitHub. You may need to:" -ForegroundColor Red
    Write-Host "1. Set up a Personal Access Token in GitHub" -ForegroundColor Yellow
    Write-Host "2. Or use GitHub CLI: gh auth login" -ForegroundColor Yellow
    Write-Host "3. Or configure Git credentials" -ForegroundColor Yellow
}

