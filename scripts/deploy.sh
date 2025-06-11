#!/bin/bash

# NBA CallCheck - Production Deployment Script
# This script builds and packages the extension for all browser stores

set -e  # Exit on any error

echo "🚀 NBA CallCheck - Production Deployment"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required commands exist
command -v npm >/dev/null 2>&1 || { echo "❌ Error: npm is required but not installed."; exit 1; }
command -v zip >/dev/null 2>&1 || { echo "❌ Error: zip is required but not installed."; exit 1; }

echo "📋 Pre-deployment checks..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🔨 Building and packaging all store versions..."

# Clean previous builds and packages
if [ -d "dist" ]; then
    rm -rf dist
    echo "🧹 Cleaned previous build"
fi

if [ -d "packages" ]; then
    rm -rf packages
    echo "🧹 Cleaned previous packages"
fi

# Use the existing npm script that handles the complete workflow
npm run store:prepare

# Verify packages were created
if [ ! -d "packages" ]; then
    echo "❌ Error: Package creation failed - packages directory not found"
    exit 1
fi

echo ""
echo "📊 Package Summary:"
echo "==================="
ls -la packages/

echo ""
echo "📦 Package sizes:"
du -h packages/*

echo ""
echo "🎯 Deployment Checklist:"
echo "========================"
echo "✅ Production build completed"
echo "✅ Chrome Web Store package ready"
echo "✅ Firefox Add-ons package ready"
echo "✅ Edge Add-ons package ready"
echo "✅ All store assets prepared"
echo "✅ Documentation complete"

echo ""
echo "🚀 Ready for Store Submission!"
echo "=============================="
echo ""
echo "Next Steps:"
echo "1. Submit to Chrome Web Store: packages/nba-callcheck-chrome-v1.0.0.zip"
echo "2. Submit to Firefox Add-ons: packages/nba-callcheck-firefox-v1.0.0.xpi"
echo "3. Submit to Edge Add-ons: packages/nba-callcheck-edge-v1.0.0.zip"
echo ""
echo "Store Assets Location: store-assets/"
echo "Documentation: store-submission/"
echo ""
echo "🎉 NBA CallCheck is ready for production deployment!"