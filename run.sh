#!/bin/bash

echo "🚀 Azure AI Services Showcase - Production Setup"
echo "================================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found! Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file - please edit it with your Azure credentials"
    echo "📝 Edit: nano .env"
    exit 1
fi

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

# Install dependencies if needed
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "📦 Installing Python dependencies..."
    pip install --break-system-packages -r requirements.txt
fi

# Start the application
echo "🌐 Starting Azure AI Services server..."
python3 start.py