#!/bin/bash

# IELTS Vocabulary App Setup Script
echo "🚀 Setting up IELTS Vocabulary App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version must be 16 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: mongod"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Check if .env files exist
echo "🔧 Checking environment configuration..."

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Please create backend/.env with required variables."
    echo "   See backend/.env.example for reference."
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found. Please create frontend/.env with required variables."
    echo "   See frontend/.env.example for reference."
fi

echo "✅ Setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Configure your .env files with proper values"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "📚 For more information, see README.md"