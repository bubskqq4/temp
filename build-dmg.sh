#!/bin/bash

# Build Founder DMG
# This script builds a macOS DMG that connects to localhost:3000

echo "🚀 Building Founder DMG..."
echo "⚠️  Make sure your dev server is running on localhost:3000"
echo ""

# Build the Tauri app
npm run tauri:build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📦 Your DMG is located at:"
    echo "   src-tauri/target/release/bundle/dmg/Founder_0.1.0_universal.dmg"
    echo ""
    echo "🎉 You can now install and run the Founder app!"
else
    echo ""
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
