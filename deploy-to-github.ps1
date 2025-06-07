# Cobble Hills Golf Booking App - GitHub Deployment Script

Write-Host "🏌️ Cobble Hills Golf Booking App - GitHub Deployment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Step 1: Create the repository on GitHub
Write-Host "📝 Step 1: Create GitHub Repository" -ForegroundColor Yellow
Write-Host "Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host "Repository name: cobbleGolf6" -ForegroundColor White
Write-Host "Description: Automated golf booking app for Cobble Hills Men's League 2025" -ForegroundColor White
Write-Host "Set to: Public or Private (your choice)" -ForegroundColor White
Write-Host "DO NOT initialize with README, .gitignore, or license (we already have these)" -ForegroundColor Red
Write-Host ""
Write-Host "Press Enter after creating the repository on GitHub..." -ForegroundColor Yellow
Read-Host

# Step 2: Push to GitHub
Write-Host "🚀 Step 2: Pushing to GitHub..." -ForegroundColor Yellow

# Remove existing origin if it exists
git remote remove origin 2>$null

# Add new origin and push
git remote add origin https://github.com/wiltonn/cobbleGolf6.git
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Repository: https://github.com/wiltonn/cobbleGolf6" -ForegroundColor Cyan
Write-Host "🚀 Deploy to Vercel: https://vercel.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Vercel and connect your GitHub repository"
Write-Host "2. Set environment variables in Vercel dashboard:"
Write-Host "   - EMAIL_USER=your-gmail@gmail.com"
Write-Host "   - EMAIL_PASS=your-gmail-app-password" 
Write-Host "   - LOGIN_EMAIL=your-booking-credentials"
Write-Host "   - LOGIN_PASSWORD=your-booking-password"
Write-Host "3. Deploy and test your automated booking system!"
Write-Host ""
Write-Host "🎯 Your app will automatically:" -ForegroundColor Green
Write-Host "   • Find next Wednesday's date"
Write-Host "   • Apply filters (4 players, 9 holes, Any cart)"
Write-Host "   • Select preferred times (4:15-5PM or 5-6PM)"
Write-Host "   • Send email confirmations to nathan.wilton@gmail.com"
