#!/bin/bash

# Health check script for IELTS Vocabulary App
echo "🏥 Running health checks..."

# Check if backend is running
echo "🔍 Checking backend..."
if curl -s http://localhost:3001/api/vocabulary > /dev/null; then
    echo "✅ Backend is running on port 3001"
else
    echo "❌ Backend is not responding on port 3001"
fi

# Check if frontend is running
echo "🔍 Checking frontend..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend is running on port 3000"
else
    echo "❌ Frontend is not responding on port 3000"
fi

# Check MongoDB connection
echo "🔍 Checking MongoDB..."
if curl -s http://localhost:3001/api/vocabulary/topics > /dev/null; then
    echo "✅ MongoDB connection is working"
else
    echo "❌ MongoDB connection failed"
fi

echo "🏥 Health check completed!"