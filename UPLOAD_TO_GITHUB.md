# How to Upload to GitHub

Your repository is ready at: **https://github.com/MartimPoke/Finance-Tracker.git**

## Option 1: Install Git and Use Command Line (Recommended)

### Step 1: Install Git
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default options
3. **Important**: Restart your terminal/PowerShell after installation

### Step 2: Run These Commands
Open PowerShell in this folder and run:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: FinTrack - Minimalist Expense Tracker"

# Set branch to main
git branch -M main

# Add remote repository
git remote add origin https://github.com/MartimPoke/Finance-Tracker.git

# Push to GitHub (you'll be prompted for credentials)
git push -u origin main
```

### Step 3: Authentication
When prompted, you'll need a **Personal Access Token**:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Finance-Tracker")
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it as your password when pushing

---

## Option 2: Use GitHub Desktop (Easier GUI)

1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in with your GitHub account
3. Click "File" → "Add Local Repository"
4. Browse to this folder: `C:\Users\Martim Paz\Downloads\fintrack---minimalist-expense-tracker`
5. Click "Publish repository"
6. Make sure the name is "Finance-Tracker" and it's set to your account
7. Click "Publish Repository"

---

## Option 3: Use GitHub Web Interface (Manual Upload)

1. Go to: https://github.com/MartimPoke/Finance-Tracker
2. Click "uploading an existing file"
3. Drag and drop all your files (but NOT the `.git` folder if one exists)
4. Add commit message: "Initial commit: FinTrack - Minimalist Expense Tracker"
5. Click "Commit changes"

**Note**: This method doesn't preserve git history but works if you just want to upload files quickly.

---

## Quick PowerShell Script (After Installing Git)

I've created `upload-to-github.ps1` in this folder. After installing Git:
1. Right-click on `upload-to-github.ps1`
2. Select "Run with PowerShell"
3. Follow the prompts

---

## What Files Are Ready to Upload?

All your project files have been reviewed and improved:
✅ All source code files
✅ README.md with documentation
✅ package.json with proper metadata
✅ Configuration files (tsconfig.json, vite.config.ts)
✅ All components and types

**Note**: The `.gitignore` file will prevent `node_modules` and `dist` folders from being uploaded (which is correct).

