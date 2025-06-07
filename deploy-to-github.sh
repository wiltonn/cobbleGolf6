#!/bin/bash

# Cobble Hills Golf Booking App - GitHub Deployment Script

echo "🏌️ Cobble Hills Golf Booking App - GitHub Deployment"
echo "================================================="

# Step 1: Create the repository on GitHub
echo "📝 Step 1: Create GitHub Repository"
echo "Go to: https://github.com/new"
echo "Repository name: cobbleGolf6"
echo "Description: Automated golf booking app for Cobble Hills Men's League 2025"
echo "Set to: Public or Private (your choice)"
echo "DO NOT initialize with README, .gitignore, or license (we already have these)"
echo ""
echo "Press Enter after creating the repository on GitHub..."
read

# Step 2: Push to GitHub
echo "🚀 Step 2: Pushing to GitHub..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/wiltonn/cobbleGolf6.git
git branch -M main
git push -u origin main

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🔗 Repository: https://github.com/wiltonn/cobbleGolf6"
echo "🚀 Deploy to Vercel: https://vercel.com/new"
echo ""
echo "📋 Next Steps:"
echo "1. Go to Vercel and connect your GitHub repository"
echo "2. Set environment variables in Vercel dashboard:"
echo "   - EMAIL_USER=your-gmail@gmail.com"
echo "   - EMAIL_PASS=your-gmail-app-password"
echo "   - LOGIN_EMAIL=your-booking-credentials"
echo "   - LOGIN_PASSWORD=your-booking-password"
echo "3. Deploy and test your automated booking system!"
echo ""
echo "🎯 Your app will automatically:"
echo "   • Find next Wednesday's date"
echo "   • Apply filters (4 players, 9 holes, Any cart)"
echo "   • Select preferred times (4:15-5PM or 5-6PM)"
echo "   • Send email confirmations to nathan.wilton@gmail.com"
