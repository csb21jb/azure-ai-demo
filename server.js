require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Visitor tracking file
const VISITOR_STATS_FILE = path.join(__dirname, 'visitor-stats.json');

// Initialize visitor stats if file doesn't exist
if (!fs.existsSync(VISITOR_STATS_FILE)) {
    fs.writeFileSync(VISITOR_STATS_FILE, JSON.stringify({
        totalVisitors: 0,
        dailyVisitors: {},
        lastReset: new Date().toISOString()
    }, null, 2));
}

// Helper function to read visitor stats
function readVisitorStats() {
    try {
        const data = fs.readFileSync(VISITOR_STATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            totalVisitors: 0,
            dailyVisitors: {},
            lastReset: new Date().toISOString()
        };
    }
}

// Helper function to write visitor stats
function writeVisitorStats(stats) {
    try {
        fs.writeFileSync(VISITOR_STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error writing visitor stats:', error);
    }
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*"]
        }
    }
}));

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.API_RATE_LIMIT_MAX) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/services', express.static(path.join(__dirname, 'services')));

// Track unique visitors using session storage
const visitedSessions = new Set();

// Visitor tracking middleware - only count on main page load
app.use((req, res, next) => {
    // Only track HTML page requests, not API or asset requests
    if (req.path === '/' || req.path === '/index.html') {
        const sessionId = req.ip + ':' + req.get('user-agent');

        // Only count if this session hasn't been counted yet
        if (!visitedSessions.has(sessionId)) {
            visitedSessions.add(sessionId);

            const stats = readVisitorStats();
            stats.totalVisitors = (stats.totalVisitors || 0) + 1;

            // Track daily visitors
            const today = new Date().toISOString().split('T')[0];
            if (!stats.dailyVisitors) {
                stats.dailyVisitors = {};
            }
            stats.dailyVisitors[today] = (stats.dailyVisitors[today] || 0) + 1;

            writeVisitorStats(stats);
        }
    }
    next();
});

// API Routes - Azure OpenAI
app.post('/api/openai/chat', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        const { messages, temperature = 1, max_tokens = 1000 } = req.body;
        
        const completion = await client.chat.completions.create({
            messages,
            temperature,
            max_tokens,
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
        });

        res.json({ 
            success: true, 
            data: completion.choices[0].message 
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process OpenAI request',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Azure OpenAI Realtime (Speech & Audio)
app.post('/api/openai/realtime', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const { message, outputModalities = ['text', 'audio'] } = req.body;
        
        // Create OpenAI client for regular chat (text response)
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        // Get text response from chat API
        const completion = await client.chat.completions.create({
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
            max_tokens: 500,
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
        });

        const textResponse = completion.choices[0].message.content;

        // For now, simulate audio generation (in production, this would use the actual Realtime API)
        // The actual implementation would use WebSockets and the Realtime API endpoint
        // This is a simplified version for demonstration
        let audioData = null;
        if (outputModalities.includes('audio')) {
            // In a real implementation, you would:
            // 1. Connect to the Realtime API WebSocket endpoint
            // 2. Send the message and receive both text and audio streams
            // 3. Convert the audio stream to base64
            // For demo purposes, we'll return null to indicate no audio is available yet
            audioData = null;
        }

        res.json({ 
            success: true, 
            data: {
                text: textResponse,
                audioData: audioData,
                message: outputModalities.includes('audio') ? 
                    'Note: Audio generation requires WebSocket connection to Realtime API. Text response provided.' : 
                    undefined
            }
        });
    } catch (error) {
        console.error('Realtime API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to process realtime request',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Azure OpenAI Assistant
app.post('/api/openai/assistant/create', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        const { instructions = "", tools = [], tool_resources = {}, temperature = 1, top_p = 1 } = req.body;
        
        const assistant = await client.beta.assistants.create({
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            instructions,
            tools,
            tool_resources,
            temperature,
            top_p
        });

        res.json({ 
            success: true, 
            data: assistant 
        });
    } catch (error) {
        console.error('Assistant Create Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create assistant',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.post('/api/openai/assistant/thread', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        const thread = await client.beta.threads.create();

        res.json({ 
            success: true, 
            data: thread 
        });
    } catch (error) {
        console.error('Thread Create Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create thread',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.post('/api/openai/assistant/message', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        const { thread_id, content } = req.body;

        const message = await client.beta.threads.messages.create(
            thread_id,
            {
                role: "user",
                content
            }
        );

        res.json({ 
            success: true, 
            data: message 
        });
    } catch (error) {
        console.error('Message Create Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create message',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

app.post('/api/openai/assistant/run', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY }
        });

        const { thread_id, assistant_id } = req.body;

        const run = await client.beta.threads.runs.create(
            thread_id,
            {
                assistant_id
            }
        );

        // Poll for completion
        let runStatus = run;
        while (runStatus.status === 'queued' || runStatus.status === 'in_progress' || runStatus.status === 'cancelling') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await client.beta.threads.runs.retrieve(
                thread_id,
                run.id
            );
        }

        if (runStatus.status === 'completed') {
            const messages = await client.beta.threads.messages.list(thread_id);
            res.json({ 
                success: true, 
                data: {
                    run: runStatus,
                    messages: messages.data
                }
            });
        } else {
            res.json({ 
                success: false, 
                error: `Run failed with status: ${runStatus.status}`,
                data: runStatus
            });
        }
    } catch (error) {
        console.error('Run Create Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to run assistant',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Image Generation (DALL-E 3)
app.post('/api/image-generation/generate', async (req, res) => {
    try {
        const { OpenAI } = require('openai');
        const { prompt, size = '1024x1024', quality = 'standard', style = 'vivid', n = 1 } = req.body;
        
        // Validate prompt
        if (!prompt || prompt.trim().length < 5) {
            return res.status(400).json({
                success: false,
                error: 'Prompt must be at least 5 characters long'
            });
        }
        
        // Create OpenAI client for image generation
        const client = new OpenAI({
            apiKey: process.env.AZURE_OPENAI_IMAGE_API_KEY,
            baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME}`,
            defaultQuery: { 'api-version': process.env.AZURE_OPENAI_IMAGE_API_VERSION },
            defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_IMAGE_API_KEY }
        });

        // Generate image using DALL-E 3
        const result = await client.images.generate({
            model: process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME || 'dall-e-3',
            prompt: prompt.trim(),
            size,
            quality,
            style,
            n
        });

        // Extract image URL from response
        const imageData = result.data[0];
        
        res.json({ 
            success: true, 
            data: {
                image_url: imageData.url,
                prompt: prompt.trim(),
                size,
                quality,
                style,
                model: process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME || 'dall-e-3'
            }
        });
    } catch (error) {
        console.error('Image Generation API Error:', error);
        
        // Provide user-friendly error messages
        let errorMessage = 'Failed to generate image';
        if (error.message.includes('content_policy_violation')) {
            errorMessage = 'The image prompt was rejected due to content policy. Please try a different description.';
        } else if (error.message.includes('insufficient_quota')) {
            errorMessage = 'Insufficient quota to generate image. Please try again later.';
        } else if (error.message.includes('rate_limit')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before generating another image.';
        }
        
        res.status(500).json({ 
            success: false, 
            error: errorMessage,
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Image Generation Samples
app.get('/api/image-generation/samples', async (req, res) => {
    try {
        const samples = [
            {
                title: "Artistic Landscape",
                prompt: "A serene mountain landscape at sunset with vibrant orange and purple skies, painted in watercolor style",
                category: "Art"
            },
            {
                title: "Futuristic City",
                prompt: "A futuristic cityscape with flying cars and neon lights, cyberpunk style, highly detailed",
                category: "Sci-Fi"
            },
            {
                title: "Abstract Art",
                prompt: "An abstract composition with flowing geometric shapes in blue and gold, modern minimalist style",
                category: "Abstract"
            },
            {
                title: "Fantasy Character",
                prompt: "A magical wizard casting spells in an enchanted forest, fantasy art style with glowing effects",
                category: "Fantasy"
            },
            {
                title: "Photorealistic Portrait",
                prompt: "A professional headshot of a confident business person in modern office setting, photorealistic",
                category: "Portrait"
            },
            {
                title: "Nature Scene",
                prompt: "A peaceful zen garden with cherry blossoms, stone pathway, and koi pond, Japanese style",
                category: "Nature"
            }
        ];
        
        res.json({
            success: true,
            data: { samples }
        });
    } catch (error) {
        console.error('Image Generation Samples Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load sample prompts'
        });
    }
});

// API Routes - Image Generation Health Check
app.get('/api/image-generation/health', async (req, res) => {
    try {
        const configured = !!(
            process.env.AZURE_OPENAI_IMAGE_API_KEY && 
            process.env.AZURE_OPENAI_ENDPOINT
        );
        
        res.json({
            service: "Azure OpenAI Image Generation",
            configured: configured,
            deployment: process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT_NAME || "Not configured",
            api_version: process.env.AZURE_OPENAI_IMAGE_API_VERSION || "Not configured"
        });
    } catch (error) {
        console.error('Image Generation Health Check Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Health check failed'
        });
    }
});

// API Routes - Computer Vision
app.post('/api/vision/analyze', async (req, res) => {
    try {
        const axios = require('axios');
        const { image_url, features = ['Description', 'Tags', 'Objects'] } = req.body;
        
        const response = await axios.post(
            `${process.env.AZURE_VISION_ENDPOINT}/vision/v3.2/analyze`,
            { url: image_url },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_VISION_API_KEY,
                    'Content-Type': 'application/json'
                },
                params: {
                    visualFeatures: features.join(',')
                }
            }
        );

        res.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        console.error('Vision API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze image',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Speech Services
app.post('/api/speech/token', async (req, res) => {
    try {
        const axios = require('axios');
        
        const response = await axios.post(
            `${process.env.AZURE_SPEECH_ENDPOINT}/sts/v1.0/issueToken`,
            null,
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        res.json({ 
            success: true, 
            token: response.data,
            region: process.env.AZURE_SPEECH_REGION
        });
    } catch (error) {
        console.error('Speech Token Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to get speech token',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Language Services
app.post('/api/language/sentiment', async (req, res) => {
    try {
        const axios = require('axios');
        const { documents } = req.body;
        
        const response = await axios.post(
            `${process.env.AZURE_LANGUAGE_ENDPOINT}/language/:analyze-text/jobs?api-version=2023-04-01`,
            {
                displayName: 'Sentiment Analysis',
                analysisInput: { documents },
                tasks: [{
                    kind: 'SentimentAnalysis',
                    taskName: 'Sentiment Analysis'
                }]
            },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_LANGUAGE_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        console.error('Language API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze sentiment',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Translator
app.post('/api/translator/translate', async (req, res) => {
    try {
        const axios = require('axios');
        const { text, from = 'auto-detect', to } = req.body;
        
        const response = await axios.post(
            `${process.env.AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=${to}${from !== 'auto-detect' ? `&from=${from}` : ''}`,
            [{ text }],
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_TRANSLATOR_API_KEY,
                    'Ocp-Apim-Subscription-Region': process.env.AZURE_TRANSLATOR_REGION,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        console.error('Translator API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to translate text',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// API Routes - Content Safety
app.post('/api/content-safety/analyze', async (req, res) => {
    try {
        const axios = require('axios');
        const { text } = req.body;
        
        const response = await axios.post(
            `${process.env.AZURE_CONTENT_SAFETY_ENDPOINT}/contentsafety/text:analyze?api-version=2023-10-01`,
            {
                text,
                categories: ['Hate', 'Violence', 'Sexual', 'SelfHarm']
            },
            {
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZURE_CONTENT_SAFETY_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({ 
            success: true, 
            data: response.data 
        });
    } catch (error) {
        console.error('Content Safety API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze content',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Visitor stats endpoint
app.get('/api/visitor-stats', (req, res) => {
    try {
        const stats = readVisitorStats();
        res.json({
            success: true,
            totalVisitors: stats.totalVisitors || 0
        });
    } catch (error) {
        console.error('Error reading visitor stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve visitor stats'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Configuration status endpoint (no sensitive data)
app.get('/api/config/status', (req, res) => {
    res.json({
        configured: {
            openai: !!(process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_ENDPOINT),
            vision: !!(process.env.AZURE_VISION_API_KEY && process.env.AZURE_VISION_ENDPOINT),
            speech: !!(process.env.AZURE_SPEECH_API_KEY && process.env.AZURE_SPEECH_ENDPOINT),
            language: !!(process.env.AZURE_LANGUAGE_API_KEY && process.env.AZURE_LANGUAGE_ENDPOINT),
            translator: !!(process.env.AZURE_TRANSLATOR_API_KEY && process.env.AZURE_TRANSLATOR_ENDPOINT),
            contentSafety: !!(process.env.AZURE_CONTENT_SAFETY_API_KEY && process.env.AZURE_CONTENT_SAFETY_ENDPOINT)
        }
    });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    🚀 AI Services Showcase Server
    ================================
    Environment: ${process.env.NODE_ENV || 'development'}
    Port: ${PORT}
    URL: http://localhost:${PORT}
    
    API Endpoints:
    - POST /api/openai/chat
    - POST /api/openai/assistant/create
    - POST /api/openai/assistant/thread
    - POST /api/openai/assistant/message
    - POST /api/openai/assistant/run
    - POST /api/vision/analyze
    - POST /api/speech/token
    - POST /api/language/sentiment
    - POST /api/translator/translate
    - POST /api/content-safety/analyze
    - GET  /api/health
    - GET  /api/config/status
    `);
});