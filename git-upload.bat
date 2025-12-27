@echo off
REM Git upload script for Finance-Tracker
REM Run this after Git is installed

git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/MartimPoke/Finance-Tracker.git
git push -u origin main

