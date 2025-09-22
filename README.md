# Azure AI Services Showcase

A production-ready demonstration application showcasing Microsoft Azure AI services integration with proper security practices and vertical slice architecture.

## Features

### 🎯 Core AI Services Showcased

- **Azure OpenAI Service**: Text generation, chat interface, and content summarization
- **Azure AI Vision**: Image analysis, OCR (text recognition), and object detection
- **Azure AI Speech**: Speech-to-text, text-to-speech, and voice translation
- **Azure AI Language**: Sentiment analysis, key phrase extraction, and entity recognition
- **Azure AI Translator**: Multi-language text translation with 100+ languages
- **Azure AI Content Safety**: Text and image content moderation

### 🎨 Design & User Experience

- **Microsoft Fluent Design System**: Authentic Microsoft visual language
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation and screen reader support
- **Interactive Demos**: Real-time simulations with dummy data for all AI services
- **Modern UI Components**: Cards, buttons, forms, and animations following Microsoft guidelines

### 🛠️ Technical Implementation

- **Pure HTML/CSS/JavaScript**: No frameworks required, lightweight and fast
- **Microsoft Design Tokens**: Consistent colors, typography, and spacing
- **CSS Grid & Flexbox**: Modern layout techniques for responsive design
- **ES6+ JavaScript**: Modern JavaScript features with clean, maintainable code
- **Simulated API Calls**: Realistic dummy data and response times for demonstrations

## Project Structure

```
ai-services/
├── index.html              # Main HTML file
├── styles/
│   ├── design-tokens.css   # Microsoft design system variables
│   ├── base.css           # Reset and typography
│   ├── components.css     # UI components (buttons, cards, etc.)
│   ├── layout.css         # Page layout and sections
│   └── responsive.css     # Mobile-first responsive design
├── js/
│   ├── app.js            # Main application logic
│   ├── services.js       # AI services simulation and dummy data
│   └── showcase.js       # Service demonstration components
├── assets/
│   ├── microsoft-logo.svg # Microsoft logo
│   └── favicon.svg       # Site favicon
└── README.md             # This file
```

## Quick Start

### 🚀 One-Command HTTPS Setup (Recommended)

For the complete experience with microphone access and all browser features:

```bash
# Automatically install everything and set up HTTPS
chmod +x setup-https.sh && ./setup-https.sh
```

Then start the server:
```bash
python3 start_https.py
```

Access at: **https://localhost:8443**

> **Note**: Your browser will show a security warning (normal for development). Click "Advanced" → "Proceed to localhost".

### Alternative Setup Options

#### Option 1: Manual HTTPS Setup
```bash
# Start with HTTPS (requires OpenSSL installed)
python3 start_https.py
```

#### Option 2: HTTP Mode (Limited Features)
```bash
# Basic testing without microphone access
python3 start_http.py
```
Access at: http://localhost:8000

#### Option 3: Node.js Server
```bash
# Using the included server.js
node server.js
```

#### Option 4: Simple File Server
Open `index.html` directly in your web browser, or serve the files using any static file server.

#### Option 5: Live Server (VS Code)
Install the "Live Server" extension in VS Code and right-click on `index.html` → "Open with Live Server"

### 🔧 Troubleshooting

**If the setup script fails:**
- **Ubuntu/Debian**: `sudo apt-get install openssl python3-pip`
- **CentOS/RHEL**: `sudo yum install openssl python3-pip`
- **macOS**: Install [Homebrew](https://brew.sh/) first, then run the script

**Common issues:**
- **Permission errors**: Try `sudo ./setup-https.sh`
- **Port 8443 in use**: The script will show how to change the port
- **Python not found**: Install Python 3.7+ from [python.org](https://python.org)

For detailed HTTPS configuration, see [HTTPS_SETUP.md](HTTPS_SETUP.md).

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

### Azure AI Vision
- **Image Analysis**: Describe images, extract tags, and detect objects
- **OCR (Text Recognition)**: Extract text from images, documents, and handwritten notes
- **Object Detection**: Identify and locate objects within images

### Azure AI Speech
- **Speech-to-Text**: Convert audio recordings to accurate transcriptions
- **Text-to-Speech**: Generate natural-sounding speech from text
- **Voice Selection**: Choose from multiple voice options and languages

### Azure AI Language
- **Sentiment Analysis**: Determine positive, negative, or neutral sentiment
- **Key Phrase Extraction**: Identify main topics and concepts
- **Entity Recognition**: Find people, places, organizations, and dates

### Azure AI Translator
- **Multi-Language Translation**: Support for 100+ languages
- **Real-time Translation**: Instant text translation with confidence scores
- **Language Detection**: Automatic source language identification

### Azure AI Content Safety
- **Text Moderation**: Detect harmful content, hate speech, and inappropriate material
- **Image Moderation**: Analyze images for inappropriate visual content
- **Safety Scoring**: Detailed category analysis with severity levels

## Design System

The application follows Microsoft's Fluent Design System principles:

- **Colors**: Microsoft brand colors with proper contrast ratios
- **Typography**: Segoe UI font family with consistent sizing scale
- **Spacing**: 8px base unit grid system
- **Shadows**: Fluent depth system for layering
- **Motion**: Smooth transitions and micro-interactions
- **Accessibility**: High contrast mode and reduced motion support

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Features Used**: CSS Grid, Flexbox, CSS Custom Properties, ES6+ JavaScript

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Automatic adaptation for high contrast preferences
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear focus indicators and logical tab order

## Performance

- **Lightweight**: No external dependencies or frameworks
- **Fast Loading**: Optimized CSS and JavaScript with minimal file sizes
- **Responsive Images**: SVG icons and optimized assets
- **Efficient Animations**: CSS-based animations with hardware acceleration

## Customization

The design system is built with CSS custom properties, making it easy to customize:

```css
:root {
  --color-primary: #0078d4;        /* Microsoft Blue */
  --color-secondary: #107c10;      /* Microsoft Green */
  --font-family-primary: 'Segoe UI', sans-serif;
  --spacing-md: 1rem;              /* 16px */
  --radius-lg: 0.5rem;             /* 8px */
}
```

## Contributing

This is a demonstration project showcasing Microsoft AI services. The dummy data and simulated responses are for educational purposes only.

## License

This project is for demonstration purposes. Microsoft trademarks and design elements are property of Microsoft Corporation.

---

Built with ❤️ using Microsoft Fluent Design System
