# Azure AI Services Showcase

A comprehensive demonstration application showcasing Microsoft Azure AI services integration with modern web technologies and Microsoft Fluent Design System.

> **🎥 Demo Videos & Screenshots**: See this project in action through detailed documentation and video demonstrations below.
>
> **⚡ Live Demo**: Contact for private demo access due to Azure API rate limiting (optimized for 5-10 concurrent users).

## Features

### 🎯 Core AI Services Showcased

- **Azure OpenAI Service**: Text generation, chat interface, and content summarization
- **Azure AI Speech**: Speech-to-text, text-to-speech, and voice translation
- **Azure AI Language**: Sentiment analysis, key phrase extraction, and entity recognition
- **Azure AI Translator**: Multi-language text translation with 100+ languages
- **Azure Image Generation**: DALL-E 3 for image generation from text prompts

## Quick Start

### 🚀 Quick Start (Recommended)

```bash
# Start the application
python3 start.py
```

The application will automatically:
- ✅ Install dependencies if needed
- ✅ Set up HTTPS with self-signed certificates
- ✅ Start on https://localhost:8443

> **Note**: Your browser will show a security warning (normal for development). Click "Advanced" → "Proceed to localhost".

### Alternative Setup Options

#### Option 1: One-Command HTTPS Setup
```bash
# Automatically install everything and set up HTTPS
chmod +x setup-https.sh && ./setup-https.sh
python3 start.py
```

#### Option 2: Node.js Server
```bash
# Using the included server.js
node server.js
```

#### Option 3: Direct File Access
Open `index.html` directly in your web browser, or serve the files using any static file server.

#### Option 4: VS Code Live Server
Install the "Live Server" extension in VS Code and right-click on `index.html` → "Open with Live Server"

### 🔧 Troubleshooting

**If setup fails:**
- **Ubuntu/Debian**: `sudo apt-get install openssl python3-pip`
- **CentOS/RHEL**: `sudo yum install openssl python3-pip`
- **macOS**: Install [Homebrew](https://brew.sh/) first

**Common issues:**
- **Permission errors**: Try running with `sudo`
- **Port in use**: Change port in environment variables
- **Python not found**: Install Python 3.7+ from [python.org](https://python.org)

## Usage

1. **Landing Page**: Start with the hero section featuring an interactive search and quick actions
2. **Service Cards**: Click on any AI service card to open its interactive demonstration
3. **Try Demos**: Each service includes multiple demo sections with sample data and real-time simulations
4. **Sample Data**: Use "Use Sample" buttons to quickly populate forms with example data
5. **Interactive Results**: See realistic AI responses with proper formatting and confidence scores

## AI Service Demonstrations

### Azure OpenAI Service
- **Text Generation**: Create content from prompts (emails, descriptions, stories)
- **Chat Interface**: Conversational AI with context awareness
- **Content Summarization**: Automatically summarize long documents

### Azure AI Speech
- **Speech-to-Text**: Convert audio recordings to accurate transcriptions
- **Text-to-Speech**: Generate natural-sounding speech from text
- **Voice Selection**: Choose from multiple voice options and languages

### Azure AI Translator
- **Multi-Language Translation**: Support for 100+ languages
- **Real-time Translation**: Instant text translation with confidence scores
- **Language Detection**: Automatic source language identification

### Azure Image Generation
- **DALL-E 3**: Generate images from text prompts
- **Style Variation**: Choose from different art styles and quality options
- **Size Variation**: Select from 3 different image sizes


## Performance & Scalability

- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Optimized CSS and JavaScript with minimal file sizes
- **Responsive Images**: SVG icons and optimized assets
- **Efficient Animations**: CSS-based animations with hardware acceleration
- **Load Tested**: Capacity tested for concurrent users with Azure API rate limit considerations


## Technical Architecture

### Backend
- **Python FastAPI**: High-performance async web framework
- **Azure AI Services Integration**: Direct API integration with proper error handling
- **Rate Limiting**: Built-in protection against API quota exhaustion
- **Security**: HTTPS support with SSL certificates
- **Monitoring**: Request logging and performance tracking

### Frontend
- **Pure JavaScript**: No framework dependencies for maximum compatibility
- **Microsoft Fluent Design**: Authentic Microsoft visual language implementation
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Mobile-First**: Responsive design optimized for all screen sizes

### Deployment
- **Self-Hosted**: Easy deployment on any server or container platform
- **Environment Configuration**: Secure credential management with .env files
- **Load Balancing Ready**: Stateless design for horizontal scaling

## Contributing

This is a demonstration project showcasing Microsoft AI services integration best practices. The project demonstrates real Azure API integration with proper error handling and rate limiting.

## License

This project is for demonstration purposes. Microsoft trademarks and design elements are property of Microsoft Corporation.

---