// Service Showcase Components
class ServiceShowcase {
    constructor() {
        this.currentService = null;
        this.isLoading = false;
        this.audioEnabled = true;
        this.realtimeConnection = null;
        this.voiceType = 'azure'; // 'browser' or 'azure'
        this.selectedVoice = 'en-US-AriaNeural';
        this.recognition = null; // For speech recognition
        this.isRecording = false;
    }

    getHTML(service) {
        switch (service) {
            case 'openai':
                return this.getOpenAIShowcase();
            case 'openai-realtime':
                return this.getRealtimeShowcase();
            case 'image-generation':
                return this.getImageGenerationShowcase();
            case 'document-intelligence':
                return this.getDocumentIntelligenceShowcase();
            default:
                return '<div class="error">Service not available in this demo</div>';
        }
    }

    initialize(service) {
        this.currentService = service;
        this.setupEventListeners(service);
    }

    setupEventListeners(service) {
        // Close button
        const closeBtn = document.querySelector('.showcase__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.app.closeServiceShowcase();
            });
        }

        // Business info icon handlers
        this.setupBusinessInfoIcons();

        // Service-specific event listeners
        switch (service) {
            case 'openai':
            case 'openai-realtime':
                this.setupOpenAIListeners();
                break;
            case 'image-generation':
                this.setupImageGenerationListeners();
                break;
            case 'document-intelligence':
                this.setupDocumentIntelligenceListeners();
                break;
            default:
                // No listeners for other services in this focused demo
                break;
        }
    }

    getOpenAIShowcase() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure OpenAI Service - Text Generation</h2>
                        <p class="showcase__description">
                            Experience the power of advanced language models for intelligent text generation, chat conversations, and content creation using GPT models
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content showcase__content--fullwidth">
                        <!-- Text Generation Demo with ChatGPT-like Interface -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                Text Generation (Chat Completions)
                                <button class="business-info-icon" data-feature="text-generation" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Generate creative and professional content from simple prompts that do not save conversation history
                            </p>
                            
                            <div class="text-generation-container">
                                <div class="text-generation-output" id="textGenerationOutput">
                                    <div class="generated-text-item">
                                        <strong>AI Assistant:</strong> Ready to help you generate content. Enter your prompt below to get started!
                                    </div>
                                </div>

                                <div class="text-generation-input">
                                    <!-- Action buttons positioned above the input area -->
                                    <div class="chatgpt-actions">
                                        <button id="useTextSample" class="btn btn--outline">Use Sample</button>
                                        <button id="newChatButton" class="btn btn--ghost">Clear</button>
                                    </div>

                                    <div class="input-group" style="display: flex; gap: 8px; align-items: flex-end;">
                                        <textarea
                                            id="textPrompt"
                                            class="input-group__textarea"
                                            placeholder="Message AI Assistant..."
                                            style="flex: 1; resize: none; min-height: 44px; max-height: 200px;"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <button id="generateText" class="btn btn--primary" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Chat Demo -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                AI Chat Interface
                                <button class="business-info-icon" data-feature="ai-chat" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Have natural conversations with AI for questions, advice, and assistance
                            </p>
                            
                            <div class="chat-container">
                                <div id="chatMessages" class="chat-messages">
                                    <div class="chat-message chat-message--ai">
                                        <div class="chat-message__content">
                                            Hello! I'm your AI assistant. Ask me anything about business, technology, or general topics.
                                        </div>
                                    </div>
                                </div>

                                <!-- Action buttons positioned above the input area -->
                                <div class="chatgpt-actions">
                                    <button id="clearChatButton" class="btn btn--ghost">Clear</button>
                                    <button id="copyChatButton" class="btn btn--outline">Copy</button>
                                    <button id="downloadChatButton" class="btn btn--outline">Download</button>
                                </div>

                                <div class="chat-input" style="display: flex; gap: 8px; align-items: center; padding: 12px;">
                                    <input 
                                        type="text" 
                                        id="chatInput" 
                                        placeholder="Type your message..."
                                        class="chat-input__field"
                                        style="flex: 1; border: none; outline: none; background: transparent;"
                                    >
                                    <button id="sendChat" class="btn btn--primary" style="width: 36px; height: 36px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Summarization Demo -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                Content Summarization
                                <button class="business-info-icon" data-feature="content-summarization" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Automatically summarize long documents and articles
                            </p>
                            
                            <div class="text-generation-container">
                                <div class="text-generation-output" id="summaryOutput">
                                    <div class="generated-text-item">
                                        <strong>AI Summarizer:</strong> Ready to summarize your documents. Paste your text below to get a concise summary!
                                    </div>
                                </div>
                                
                                <div class="text-generation-input">
                                    <!-- Action button positioned above the input area -->
                                    <div class="chatgpt-actions">
                                        <button id="useSummarySample" class="btn btn--outline">Use Sample</button>
                                    </div>
                                    
                                    <div class="input-group" style="display: flex; gap: 8px; align-items: flex-end;">
                                        <textarea
                                            id="summaryText"
                                            class="input-group__textarea"
                                            placeholder="Paste a long article, report, or document here..."
                                            style="flex: 1; resize: none; min-height: 100px; max-height: 300px;"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <button id="summarizeText" class="btn btn--primary" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getRealtimeShowcase() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Speech & Audio Generation</h2>
                        <p class="showcase__description">
                            Experience real-time speech synthesis with text-to-speech and speech-to-text capabilities using Azure OpenAI's Realtime API
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content showcase__content--fullwidth">
                        <!-- Speech/Audio Realtime Demo -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                Real-time Speech & Audio Generation
                                <button class="business-info-icon" data-feature="speech-audio-generation" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Type your message and receive both text and audio responses in real-time using Azure OpenAI's Realtime API
                            </p>
                            
                            <div class="realtime-container">
                                <div class="realtime-output" id="realtimeOutput">
                                    <div class="realtime-message">
                                        <strong>AI Assistant:</strong> Ready for real-time conversation. Type a message below and receive both text and video avatar responses!
                                    </div>
                                </div>

                                <div class="media-player-container" id="mediaPlayerContainer" style="display: none;">
                                    <audio id="realtimeAudioPlayer" controls style="width: 100%; margin: 10px 0;"></audio>
                                </div>

                                <div class="realtime-input">
                                    <!-- Voice Selection Tabs -->
                                    <div class="voice-selection-tabs" style="margin-bottom: 15px;">
                                        <div class="voice-tabs" style="display: flex; background: var(--color-bg-secondary); border-radius: 8px; padding: 4px; margin-bottom: 10px;">
                                            <button id="browserVoiceTab" class="voice-tab" style="flex: 1; padding: 8px 16px; border: none; background: var(--color-bg-primary); border-radius: 6px; font-size: 0.9rem; cursor: pointer;">
                                                🌐 Browser TTS
                                            </button>
                                            <button id="azureVoiceTab" class="voice-tab voice-tab--active" style="flex: 1; padding: 8px 16px; border: none; background: var(--color-primary); color: white; border-radius: 6px; font-size: 0.9rem; cursor: pointer;">
                                                🎤 Azure Neural
                                            </button>
                                        </div>
                                        
                                        <!-- Azure Voice Selector -->
                                        <div id="azureVoiceSelector" class="voice-selector" style="display: block;">
                                            <select id="azureVoiceSelect" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary); margin-bottom: 10px;">
                                                <option value="en-US-AriaNeural">🎭 Aria (Female, Conversational)</option>
                                                <option value="en-US-DavisNeural">👨 Davis (Male, Professional)</option>
                                                <option value="en-US-JennyNeural">👩 Jenny (Female, Natural)</option>
                                                <option value="en-US-GuyNeural">🎯 Guy (Male, Clear)</option>
                                                <option value="en-US-AmberNeural">🌟 Amber (Female, Warm)</option>
                                                <option value="en-US-AnaNeural">✨ Ana (Female, Cheerful)</option>
                                                <option value="en-US-BrandonNeural">💼 Brandon (Male, Business)</option>
                                                <option value="en-US-ChristopherNeural">🎬 Christopher (Male, Actor)</option>
                                                <option value="en-US-CoraNeural">🌸 Cora (Female, Young)</option>
                                                <option value="en-US-ElizabethNeural">👑 Elizabeth (Female, Elegant)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="realtime-actions">
                                        <button id="clearRealtimeChat" class="btn btn--ghost">Clear Chat</button>
                                        <button id="toggleAudioPlayback" class="btn btn--outline">
                                            <span id="audioPlaybackStatus">🔊 Audio On</span>
                                        </button>
                                    </div>

                                    <div class="input-group" style="display: flex; gap: 8px; align-items: flex-end;">
                                        <textarea
                                            id="realtimePrompt"
                                            class="input-group__textarea"
                                            placeholder="Type your message for real-time text and audio response..."
                                            style="flex: 1; resize: none; min-height: 44px; max-height: 200px;"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <button id="sendRealtimeMessage" class="btn btn--primary" style="width: 44px; height: 44px; padding: 0; display: flex; align-items: center; justify-content: center; border-radius: 8px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Speech-to-Text and Translation Service -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                Speech Translation Service
                                <button class="business-info-icon" data-feature="speech-translation" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Speak or type in any language and get instant translations using Azure Speech Services and Azure Translator
                            </p>
                            
                            <div class="speech-recognition-container">
                                <!-- Input Methods Tabs -->
                                <div style="margin-bottom: 20px;">
                                    <div style="display: flex; border-bottom: 1px solid var(--color-border-primary); margin-bottom: 15px;">
                                        <button id="voiceInputTab" class="tab-button active" style="padding: 10px 20px; border: none; background: none; cursor: pointer; border-bottom: 2px solid var(--color-accent-primary); color: var(--color-accent-primary); font-weight: 600;">
                                            🎤 Voice Input
                                        </button>
                                        <button id="textInputTab" class="tab-button" style="padding: 10px 20px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; color: var(--color-text-secondary);">
                                            ✏️ Text Input
                                        </button>
                                    </div>

                                    <!-- Voice Input Panel -->
                                    <div id="voiceInputPanel" class="input-panel" style="display: block;">
                                        <div class="speech-actions" style="display: flex; flex-direction: column; align-items: center; gap: 15px;">
                                            <div class="recording-indicator" id="recordingIndicator" style="display: none;">
                                                <div class="recording-pulse"></div>
                                                <span>Recording...</span>
                                            </div>

                                            <button id="pushToTalkBtn" class="btn btn--primary"
                                                style="width: 120px; height: 120px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; font-size: 14px; touch-action: none; user-select: none; -webkit-user-select: none;">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M12 19V23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    <path d="M8 23H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                                <span id="micButtonText">Hold to Talk</span>
                                            </button>
                                            <p style="text-align: center; color: var(--color-text-secondary); margin: 0;">Hold the microphone button and speak</p>
                                        </div>
                                    </div>

                                    <!-- Text Input Panel -->
                                    <div id="textInputPanel" class="input-panel" style="display: none;">
                                        <div style="display: flex; flex-direction: column; gap: 15px;">
                                            <textarea id="textToTranslate" placeholder="Type or paste text to translate..."
                                                style="min-height: 120px; padding: 15px; border: 1px solid var(--color-border-primary); border-radius: 8px; resize: vertical; font-family: inherit; font-size: 14px; background: var(--color-bg-primary);"></textarea>
                                            <div style="display: flex; gap: 10px; justify-content: center;">
                                                <button id="translateTextBtn" class="btn btn--primary">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 8px;">
                                                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                    </svg>
                                                    Translate Text
                                                </button>
                                                <button id="clearTextBtn" class="btn btn--secondary">Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Translation Output -->
                                <div class="speech-recognition-output" id="speechRecognitionOutput">
                                    <div class="speech-recognition-message">
                                        <strong>Translation Service:</strong> Choose voice or text input above, select your languages, and start translating.
                                    </div>
                                </div>

                                <div style="text-align: center; margin-top: 15px;">
                                    <button id="clearTranscription" class="btn btn--ghost">Clear Results</button>
                                </div>

                                    <div class="language-selection" style="margin-top: 15px; display: flex; flex-direction: column; gap: 10px;">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <label for="recognitionLanguage" style="min-width: 150px;">Speech Language:</label>
                                            <select id="recognitionLanguage" style="flex: 1; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                <option value="en-US">English (US)</option>
                                                <option value="en-GB">English (UK)</option>
                                                <option value="es-ES">Spanish (Spain)</option>
                                                <option value="fr-FR">French (France)</option>
                                                <option value="de-DE">German (Germany)</option>
                                                <option value="it-IT">Italian (Italy)</option>
                                                <option value="pt-BR">Portuguese (Brazil)</option>
                                                <option value="ja-JP">Japanese</option>
                                                <option value="ko-KR">Korean</option>
                                                <option value="zh-CN">Chinese (Simplified)</option>
                                                <option value="zh-TW">Chinese (Traditional)</option>
                                                <option value="ru-RU">Russian</option>
                                                <option value="ar-SA">Arabic</option>
                                                <option value="hi-IN">Hindi</option>
                                                <option value="nl-NL">Dutch</option>
                                                <option value="sv-SE">Swedish</option>
                                                <option value="da-DK">Danish</option>
                                                <option value="nb-NO">Norwegian</option>
                                                <option value="fi-FI">Finnish</option>
                                                <option value="pl-PL">Polish</option>
                                                <option value="tr-TR">Turkish</option>
                                                <option value="he-IL">Hebrew</option>
                                                <option value="th-TH">Thai</option>
                                                <option value="vi-VN">Vietnamese</option>
                                            </select>
                                        </div>

                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <label for="translationLanguage" style="min-width: 150px;">Translate To:</label>
                                            <select id="translationLanguage" style="flex: 1; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                <option value="">No Translation</option>
                                                <option value="af">Afrikaans</option>
                                                <option value="sq">Albanian</option>
                                                <option value="am">Amharic</option>
                                                <option value="ar">Arabic</option>
                                                <option value="hy">Armenian</option>
                                                <option value="az">Azerbaijani</option>
                                                <option value="bn">Bangla</option>
                                                <option value="bs">Bosnian</option>
                                                <option value="bg">Bulgarian</option>
                                                <option value="ca">Catalan</option>
                                                <option value="zh-Hans">Chinese (Simplified)</option>
                                                <option value="zh-Hant">Chinese (Traditional)</option>
                                                <option value="hr">Croatian</option>
                                                <option value="cs">Czech</option>
                                                <option value="da">Danish</option>
                                                <option value="nl">Dutch</option>
                                                <option value="en">English</option>
                                                <option value="et">Estonian</option>
                                                <option value="fi">Finnish</option>
                                                <option value="fr">French</option>
                                                <option value="de">German</option>
                                                <option value="el">Greek</option>
                                                <option value="he">Hebrew</option>
                                                <option value="hi">Hindi</option>
                                                <option value="hu">Hungarian</option>
                                                <option value="id">Indonesian</option>
                                                <option value="it">Italian</option>
                                                <option value="ja">Japanese</option>
                                                <option value="ko">Korean</option>
                                                <option value="lv">Latvian</option>
                                                <option value="lt">Lithuanian</option>
                                                <option value="ms">Malay</option>
                                                <option value="mt">Maltese</option>
                                                <option value="nb">Norwegian</option>
                                                <option value="fa">Persian</option>
                                                <option value="pl">Polish</option>
                                                <option value="pt">Portuguese (Brazil)</option>
                                                <option value="pt-pt">Portuguese (Portugal)</option>
                                                <option value="ro">Romanian</option>
                                                <option value="ru">Russian</option>
                                                <option value="sr">Serbian</option>
                                                <option value="sk">Slovak</option>
                                                <option value="sl">Slovenian</option>
                                                <option value="es">Spanish</option>
                                                <option value="sw">Swahili</option>
                                                <option value="sv">Swedish</option>
                                                <option value="th">Thai</option>
                                                <option value="tr">Turkish</option>
                                                <option value="uk">Ukrainian</option>
                                                <option value="ur">Urdu</option>
                                                <option value="vi">Vietnamese</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        `;
    }

    getImageGenerationShowcase() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure OpenAI Image Generation</h2>
                        <p class="showcase__description">
                            Create stunning images from text descriptions using DALL-E 3, the latest AI image generation model
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content showcase__content--fullwidth">
                        <!-- Image Generation Demo -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">
                                DALL-E 3 Image Generation
                                <button class="business-info-icon" data-feature="dalle3-image-generation" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Describe your vision in text and watch as DALL-E 3 creates a unique, high-quality image
                            </p>
                            
                            <div class="image-generation-container">
                                <!-- Image Output Area -->
                                <div class="image-generation-output" id="imageGenerationOutput">
                                    <div class="image-placeholder">
                                        <div class="placeholder-icon">
                                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <polyline points="21,15 16,10 5,21"/>
                                            </svg>
                                        </div>
                                        <h4>Ready to Generate</h4>
                                        <p>Enter a prompt below to create your image</p>
                                    </div>
                                </div>

                                <!-- Image Generation Input -->
                                <div class="image-generation-input">
                                    <!-- Sample Prompts -->
                                    <div class="sample-prompts" style="margin-bottom: 20px;">
                                        <h4 style="margin-bottom: 15px; font-size: 1rem; color: var(--color-text);">✨ Try These Sample Prompts:</h4>
                                        <div class="sample-buttons" style="display: flex; flex-wrap: wrap; gap: 10px;">
                                            <button onclick="window.imageGenUI && window.imageGenUI.useSample('A serene mountain landscape at sunset with vibrant orange and purple skies, painted in watercolor style')" class="btn btn--outline btn--small">🏔️ Watercolor Landscape</button>
                                            <button onclick="window.imageGenUI && window.imageGenUI.useSample('A futuristic cityscape with flying cars and neon lights, cyberpunk style, highly detailed')" class="btn btn--outline btn--small">🌃 Cyberpunk City</button>
                                            <button onclick="window.imageGenUI && window.imageGenUI.useSample('An abstract composition with flowing geometric shapes in blue and gold, modern minimalist style')" class="btn btn--outline btn--small">🎨 Abstract Art</button>
                                            <button onclick="window.imageGenUI && window.imageGenUI.useSample('A magical wizard casting spells in an enchanted forest, fantasy art style with glowing effects')" class="btn btn--outline btn--small">🧙‍♂️ Fantasy Character</button>
                                        </div>
                                    </div>

                                    <!-- Generation Options -->
                                    <div class="generation-options" style="margin-bottom: 20px;">
                                        <div class="options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                                            <div class="option-group">
                                                <label style="display: block; margin-bottom: 5px; font-weight: 500; font-size: 0.9rem;">Size:</label>
                                                <select id="imageSizeSelect" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                    <option value="1024x1024">Square (1024×1024)</option>
                                                    <option value="1024x1792">Portrait (1024×1792)</option>
                                                    <option value="1792x1024">Landscape (1792×1024)</option>
                                                </select>
                                            </div>
                                            <div class="option-group">
                                                <label style="display: block; margin-bottom: 5px; font-weight: 500; font-size: 0.9rem;">Quality:</label>
                                                <select id="imageQualitySelect" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                    <option value="standard">Standard</option>
                                                    <option value="hd">HD (Higher Quality)</option>
                                                </select>
                                            </div>
                                            <div class="option-group">
                                                <label style="display: block; margin-bottom: 5px; font-weight: 500; font-size: 0.9rem;">Style:</label>
                                                <select id="imageStyleSelect" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                    <option value="vivid">Vivid (More Creative)</option>
                                                    <option value="natural">Natural (More Realistic)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Prompt Input -->
                                    <div class="input-group" style="display: flex; gap: 8px; align-items: flex-end;">
                                        <textarea
                                            id="imagePrompt"
                                            class="input-group__textarea"
                                            placeholder="Describe the image you want to create... Be creative and detailed!"
                                            style="flex: 1; resize: none; min-height: 44px; max-height: 200px;"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <button id="generateImageBtn" class="btn btn--primary" style="width: auto; height: 44px; padding: 0 20px; display: flex; align-items: center; justify-content: center; border-radius: 8px; gap: 8px;">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                                <polyline points="21,15 16,10 5,21"/>
                                            </svg>
                                            Generate Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getVisionShowcase() {
        return `
            <div class="showcase">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure AI Vision</h2>
                        <p class="showcase__description">
                            Analyze images, extract text, and identify objects with powerful computer vision
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content">
                        <!-- Image Analysis Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">
                                Image Analysis
                                <button class="business-info-icon" data-feature="image-analysis" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Upload an image to get detailed descriptions, tags, and object detection
                            </p>
                            
                            <div class="input-group">
                                <label class="input-group__label" for="imageUrl">Image URL or upload:</label>
                                <input 
                                    type="url" 
                                    id="imageUrl" 
                                    class="input-group__input" 
                                    placeholder="https://example.com/image.jpg"
                                >
                                <div class="input-group__actions">
                                    <button id="analyzeImage" class="btn btn--primary">Analyze Image</button>
                                    <button id="useImageSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>
                            
                            <div id="imagePreview" class="image-preview" style="display: none;">
                                <img id="previewImg" src="" alt="Preview" style="max-width: 100%; height: auto; border-radius: 8px;">
                            </div>
                            
                            <div id="imageResult" class="results" style="display: none;">
                                <h4 class="results__title">Analysis Results:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>

                        <!-- OCR Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">
                                Text Recognition (OCR)
                                <button class="business-info-icon" data-feature="text-recognition-ocr" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                                    </svg>
                                </button>
                            </h3>
                            <p class="demo-section__description">
                                Extract text from images, documents, and handwritten notes
                            </p>
                            
                            <div class="input-group">
                                <label class="input-group__label" for="ocrImageUrl">Image with text:</label>
                                <input 
                                    type="url" 
                                    id="ocrImageUrl" 
                                    class="input-group__input" 
                                    placeholder="URL of image containing text"
                                >
                                <div class="input-group__actions">
                                    <button id="extractText" class="btn btn--primary">Extract Text</button>
                                    <button id="useOCRSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>
                            
                            <div id="ocrResult" class="results" style="display: none;">
                                <h4 class="results__title">Extracted Text:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSpeechShowcase() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure AI Speech</h2>
                        <p class="showcase__description">
                            Convert speech to text, text to speech, and translate spoken languages
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content showcase__content--fullwidth">
                        <!-- Speech to Text Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Speech to Text</h3>
                            <p class="demo-section__description">
                                Convert audio recordings to accurate text transcriptions
                            </p>
                            
                            <div class="text-generation-container">
                                <div class="text-generation-output" id="speechOutput">
                                    <div class="generated-text-item">
                                        <strong>Speech Recognition:</strong> Ready to transcribe your speech. Click "Start Recording" or use a sample audio file.
                                    </div>
                                </div>
                                
                                <div class="text-generation-input">
                                    <div class="audio-controls">
                                        <button id="startRecording" class="btn btn--primary">🎤 Start Recording</button>
                                        <button id="stopRecording" class="btn btn--secondary" disabled>⏹️ Stop Recording</button>
                                        <button id="useSpeechSample" class="btn btn--outline">Use Sample Audio</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Text to Speech Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Text to Speech</h3>
                            <p class="demo-section__description">
                                Convert text to natural-sounding speech with various voices
                            </p>
                            
                            <div class="text-generation-container">
                                <div class="text-generation-output" id="ttsOutput">
                                    <div class="generated-text-item">
                                        <strong>Speech Synthesizer:</strong> Ready to convert your text to speech. Enter text below and select a voice.
                                    </div>
                                </div>
                                
                                <div class="text-generation-input">
                                    <div class="input-group">
                                        <textarea
                                            id="ttsText"
                                            class="input-group__textarea"
                                            placeholder="Enter text to convert to speech..."
                                            style="min-height: 80px;"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <div class="input-group__actions">
                                            <select id="voiceSelect" class="voice-select">
                                                <option value="aria">Aria (Female)</option>
                                                <option value="davis">Davis (Male)</option>
                                                <option value="jenny">Jenny (Female)</option>
                                                <option value="guy">Guy (Male)</option>
                                            </select>
                                            <button id="generateSpeech" class="btn btn--primary">🔊 Generate Speech</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getLanguageShowcase() {
        return `
            <div class="showcase">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure AI Language</h2>
                        <p class="showcase__description">
                            Analyze sentiment, extract key phrases, and understand text meaning
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content">
                        <!-- Sentiment Analysis Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Sentiment Analysis</h3>
                            <p class="demo-section__description">
                                Determine if text expresses positive, negative, or neutral sentiment
                            </p>
                            
                            <div class="input-group">
                                <label class="input-group__label" for="sentimentText">Text to analyze:</label>
                                <textarea
                                    id="sentimentText"
                                    class="input-group__textarea"
                                    placeholder="Enter customer feedback, reviews, or any text..."
                                    x-webkit-speech
                                    webkitspeech
                                    speech
                                    lang="en-US"
                                ></textarea>
                                <div class="input-group__actions">
                                    <button id="analyzeSentiment" class="btn btn--primary">Analyze Sentiment</button>
                                    <button id="useSentimentSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>
                            
                            <div id="sentimentResult" class="results" style="display: none;">
                                <h4 class="results__title">Sentiment Analysis:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>

                        <!-- Key Phrases Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Key Phrase Extraction</h3>
                            <p class="demo-section__description">
                                Identify the main topics and concepts in your text
                            </p>
                            
                            <div class="input-group">
                                <label class="input-group__label" for="keyPhrasesText">Text to extract key phrases:</label>
                                <textarea
                                    id="keyPhrasesText"
                                    class="input-group__textarea"
                                    placeholder="Enter articles, documents, or any text content..."
                                    x-webkit-speech
                                    webkitspeech
                                    speech
                                    lang="en-US"
                                ></textarea>
                                <div class="input-group__actions">
                                    <button id="extractKeyPhrases" class="btn btn--primary">Extract Key Phrases</button>
                                    <button id="useKeyPhrasesSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>
                            
                            <div id="keyPhrasesResult" class="results" style="display: none;">
                                <h4 class="results__title">Key Phrases:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>

                        <!-- Entity Recognition Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Entity Recognition</h3>
                            <p class="demo-section__description">
                                Identify people, places, organizations, and other entities in text
                            </p>
                            
                            <div class="input-group">
                                <label class="input-group__label" for="entitiesText">Text to analyze for entities:</label>
                                <textarea
                                    id="entitiesText"
                                    class="input-group__textarea"
                                    placeholder="Enter text containing names, places, organizations..."
                                    x-webkit-speech
                                    webkitspeech
                                    speech
                                    lang="en-US"
                                ></textarea>
                                <div class="input-group__actions">
                                    <button id="extractEntities" class="btn btn--primary">Extract Entities</button>
                                    <button id="useEntitiesSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>
                            
                            <div id="entitiesResult" class="results" style="display: none;">
                                <h4 class="results__title">Identified Entities:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getTranslatorShowcase() {
        return `
            <div class="showcase">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure AI Translator</h2>
                        <p class="showcase__description">
                            Translate text between 100+ languages instantly and accurately
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    
                    <div class="showcase__content">
                        <div class="demo-section">
                            <h3 class="demo-section__title">Text Translation</h3>
                            <p class="demo-section__description">
                                Translate text between multiple languages with high accuracy
                            </p>
                            
                            <div class="translation-interface">
                                <div class="translation-controls">
                                    <div class="language-selector">
                                        <label for="sourceLanguage">From:</label>
                                        <select id="sourceLanguage">
                                            <option value="auto">Auto-detect</option>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="it">Italian</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="ru">Russian</option>
                                            <option value="ja">Japanese</option>
                                            <option value="ko">Korean</option>
                                            <option value="zh">Chinese</option>
                                        </select>
                                    </div>
                                    
                                    <button id="swapLanguages" class="btn btn--ghost">⇄</button>
                                    
                                    <div class="language-selector">
                                        <label for="targetLanguage">To:</label>
                                        <select id="targetLanguage">
                                            <option value="es">Spanish</option>
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="it">Italian</option>
                                            <option value="pt">Portuguese</option>
                                            <option value="ru">Russian</option>
                                            <option value="ja">Japanese</option>
                                            <option value="ko">Korean</option>
                                            <option value="zh">Chinese</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="translation-panels">
                                    <div class="translation-panel">
                                        <textarea
                                            id="sourceText"
                                            placeholder="Enter text to translate..."
                                            class="translation-input"
                                            x-webkit-speech
                                            webkitspeech
                                            speech
                                            lang="en-US"
                                        ></textarea>
                                        <div class="panel-actions">
                                            <button id="translateText" class="btn btn--primary">Translate</button>
                                            <button id="useTranslationSample" class="btn btn--outline">Use Sample</button>
                                        </div>
                                    </div>
                                    
                                    <div class="translation-panel">
                                        <div id="translationResult" class="translation-output">
                                            Translation will appear here...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getContentSafetyShowcase() {
        return `
            <div class="showcase">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Azure AI Content Safety</h2>
                        <p class="showcase__description">
                            Detect and moderate harmful content to keep your platforms safe
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>

                    <div class="showcase__content">
                        <!-- Text Moderation Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Text Content Moderation</h3>
                            <p class="demo-section__description">
                                Analyze text for harmful content including hate speech, violence, and inappropriate material
                            </p>

                            <div class="input-group">
                                <label class="input-group__label" for="moderationText">Text to moderate:</label>
                                <textarea
                                    id="moderationText"
                                    class="input-group__textarea"
                                    placeholder="Enter text content to check for safety..."
                                    x-webkit-speech
                                    webkitspeech
                                    speech
                                    lang="en-US"
                                ></textarea>
                                <div class="input-group__actions">
                                    <button id="moderateText" class="btn btn--primary">Check Content</button>
                                    <button id="useModerationSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>

                            <div id="moderationResult" class="results" style="display: none;">
                                <h4 class="results__title">Content Safety Analysis:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>

                        <!-- Image Moderation Demo -->
                        <div class="demo-section">
                            <h3 class="demo-section__title">Image Content Moderation</h3>
                            <p class="demo-section__description">
                                Analyze images for inappropriate or harmful visual content
                            </p>

                            <div class="input-group">
                                <label class="input-group__label" for="moderationImageUrl">Image URL to moderate:</label>
                                <input
                                    type="url"
                                    id="moderationImageUrl"
                                    class="input-group__input"
                                    placeholder="https://example.com/image.jpg"
                                >
                                <div class="input-group__actions">
                                    <button id="moderateImage" class="btn btn--primary">Check Image</button>
                                    <button id="useImageModerationSample" class="btn btn--outline">Use Sample</button>
                                </div>
                            </div>

                            <div id="imageModerationResult" class="results" style="display: none;">
                                <h4 class="results__title">Image Safety Analysis:</h4>
                                <div class="results__content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Event Listeners for OpenAI Service
    setupOpenAIListeners() {
        // Text Generation
        const generateBtn = document.getElementById('generateText');
        const sampleBtn = document.getElementById('useTextSample');
        const newChatBtn = document.getElementById('newChatButton');
        const promptInput = document.getElementById('textPrompt');

        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                const prompt = promptInput.value.trim();
                if (!prompt) return;
                await this.handleTextGeneration(prompt);
            });
        }

        // Also allow Enter key to send message
        if (promptInput) {
            promptInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const prompt = promptInput.value.trim();
                    if (!prompt) return;
                    await this.handleTextGeneration(prompt);
                }
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                const samples = [
                    'Write a professional email about a project update',
                    'Create a product description for a smart home device',
                    'Draft a social media post about environmental sustainability',
                    'Write a brief introduction for a company newsletter',
                    'Create a compelling headline for a technology blog post'
                ];
                promptInput.value = samples[Math.floor(Math.random() * samples.length)];
                promptInput.focus();
            });
        }

        if (newChatBtn) {
            newChatBtn.addEventListener('click', () => {
                // Clear the conversation output
                const outputArea = document.getElementById('textGenerationOutput');
                outputArea.innerHTML = `
                    <div class="generated-text-item">
                        <strong>AI Assistant:</strong> Ready to help you generate content. Enter your prompt below to get started!
                    </div>
                `;
                // Clear the input field
                promptInput.value = '';
                promptInput.focus();
            });
        }

        // Chat Interface
        const sendBtn = document.getElementById('sendChat');
        const chatInput = document.getElementById('chatInput');
        const clearChatBtn = document.getElementById('clearChatButton');
        const copyChatBtn = document.getElementById('copyChatButton');
        const downloadChatBtn = document.getElementById('downloadChatButton');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.handleChatMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleChatMessage();
                }
            });
        }

        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                // Clear the chat messages
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.innerHTML = `
                    <div class="chat-message chat-message--ai">
                        <div class="chat-message__content">
                            Hello! I'm your AI assistant. Ask me anything about business, technology, or general topics.
                        </div>
                    </div>
                `;
                // Clear the input field
                chatInput.value = '';
                chatInput.focus();
            });
        }

        if (downloadChatBtn) {
            downloadChatBtn.addEventListener('click', () => {
                // Get all chat messages
                const chatMessages = document.getElementById('chatMessages');
                const messages = chatMessages.querySelectorAll('.chat-message');

                let chatContent = 'AI Chat Conversation\n' + '='.repeat(50) + '\n\n';

                messages.forEach(msg => {
                    const isUser = msg.classList.contains('chat-message--user');
                    const content = msg.querySelector('.chat-message__content').textContent.trim();
                    chatContent += `${isUser ? 'User' : 'AI Assistant'}: ${content}\n\n`;
                });

                // Create and download the file
                const blob = new Blob([chatContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `chat-conversation-${new Date().toISOString().split('T')[0]}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }

        if (copyChatBtn) {
            copyChatBtn.addEventListener('click', () => {
                // Get all chat messages
                const chatMessages = document.getElementById('chatMessages');
                const messages = chatMessages.querySelectorAll('.chat-message');

                let chatContent = 'AI Chat Conversation\n' + '='.repeat(50) + '\n\n';

                messages.forEach(msg => {
                    const isUser = msg.classList.contains('chat-message--user');
                    const contentElement = msg.querySelector('.chat-message__content');

                    if (contentElement) {
                        // For AI messages, try to get the formatted content
                        let content = '';
                        if (!isUser) {
                            const aiResponseContent = contentElement.querySelector('.ai-response-content');
                            if (aiResponseContent) {
                                // Create a temporary div to extract clean text from formatted content
                                const tempDiv = document.createElement('div');
                                tempDiv.innerHTML = aiResponseContent.innerHTML;

                                // Remove any copy buttons
                                const copyButtons = tempDiv.querySelectorAll('.copy-code-btn, .copy-message-btn, .simple-copy-btn');
                                copyButtons.forEach(btn => btn.remove());

                                // Handle code blocks
                                const codeBlocks = tempDiv.querySelectorAll('.code-block code');
                                codeBlocks.forEach(block => {
                                    const codeText = block.textContent || block.innerText;
                                    const wrapper = block.closest('.code-block-wrapper');
                                    if (wrapper) {
                                        const textNode = document.createTextNode('\n```\n' + codeText + '\n```\n');
                                        wrapper.parentNode.replaceChild(textNode, wrapper);
                                    }
                                });

                                // Handle inline code
                                const inlineCodes = tempDiv.querySelectorAll('.inline-code');
                                inlineCodes.forEach(code => {
                                    const codeText = code.textContent || code.innerText;
                                    const textNode = document.createTextNode('`' + codeText + '`');
                                    code.parentNode.replaceChild(textNode, code);
                                });

                                // Convert <br> tags to newlines
                                tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');

                                content = tempDiv.textContent || tempDiv.innerText || '';
                                content = content.replace(/\n{3,}/g, '\n\n').trim();
                            } else {
                                content = contentElement.textContent.trim();
                            }
                        } else {
                            content = contentElement.textContent.trim();
                        }

                        chatContent += `${isUser ? 'User' : 'AI Assistant'}: ${content}\n\n`;
                    }
                });

                // Copy to clipboard
                navigator.clipboard.writeText(chatContent).then(() => {
                    // Show visual feedback
                    const originalText = copyChatBtn.textContent;
                    copyChatBtn.textContent = 'Copied!';
                    copyChatBtn.classList.add('copied');

                    setTimeout(() => {
                        copyChatBtn.textContent = originalText;
                        copyChatBtn.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy conversation:', err);
                });
            });
        }

        // Summarization
        const summarizeBtn = document.getElementById('summarizeText');
        const summarySampleBtn = document.getElementById('useSummarySample');
        const summaryInput = document.getElementById('summaryText');

        // Realtime API (Speech & Audio)
        const realtimeSendBtn = document.getElementById('sendRealtimeMessage');
        const realtimePrompt = document.getElementById('realtimePrompt');
        const clearRealtimeBtn = document.getElementById('clearRealtimeChat');
        const toggleAudioBtn = document.getElementById('toggleAudioPlayback');

        if (realtimeSendBtn) {
            realtimeSendBtn.addEventListener('click', async () => {
                const prompt = realtimePrompt.value.trim();
                if (!prompt) return;
                await this.handleRealtimeMessage(prompt);
            });
        }

        if (realtimePrompt) {
            realtimePrompt.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const prompt = realtimePrompt.value.trim();
                    if (!prompt) return;
                    await this.handleRealtimeMessage(prompt);
                }
            });
        }

        if (clearRealtimeBtn) {
            clearRealtimeBtn.addEventListener('click', () => {
                const outputArea = document.getElementById('realtimeOutput');
                outputArea.innerHTML = `
                    <div class="realtime-message">
                        <strong>AI Assistant:</strong> Ready for real-time conversation. Type a message below and receive both text and audio responses!
                    </div>
                `;
                realtimePrompt.value = '';
                document.getElementById('audioPlayerContainer').style.display = 'none';
            });
        }

        if (toggleAudioBtn) {
            toggleAudioBtn.addEventListener('click', () => {
                this.audioEnabled = !this.audioEnabled;
                const statusSpan = document.getElementById('audioPlaybackStatus');
                statusSpan.textContent = this.audioEnabled ? '🔊 Audio On' : '🔇 Audio Off';
            });
        }

        // Voice selection tabs
        const browserVoiceTab = document.getElementById('browserVoiceTab');
        const azureVoiceTab = document.getElementById('azureVoiceTab');
        const azureVoiceSelector = document.getElementById('azureVoiceSelector');
        const azureVoiceSelect = document.getElementById('azureVoiceSelect');

        if (browserVoiceTab) {
            browserVoiceTab.addEventListener('click', () => {
                this.voiceType = 'browser';
                browserVoiceTab.style.background = 'var(--color-primary)';
                browserVoiceTab.style.color = 'white';
                azureVoiceTab.style.background = 'var(--color-bg-primary)';
                azureVoiceTab.style.color = '';
                azureVoiceSelector.style.display = 'none';
            });
        }

        if (azureVoiceTab) {
            azureVoiceTab.addEventListener('click', () => {
                this.voiceType = 'azure';
                azureVoiceTab.style.background = 'var(--color-primary)';
                azureVoiceTab.style.color = 'white';
                browserVoiceTab.style.background = 'var(--color-bg-primary)';
                browserVoiceTab.style.color = '';
                azureVoiceSelector.style.display = 'block';
            });
        }

        if (azureVoiceSelect) {
            azureVoiceSelect.addEventListener('change', () => {
                this.selectedVoice = azureVoiceSelect.value;
            });
        }

        // Translation Service event listeners
        const pushToTalkBtn = document.getElementById('pushToTalkBtn');
        const clearTranscriptionBtn = document.getElementById('clearTranscription');
        const recognitionLanguageSelect = document.getElementById('recognitionLanguage');

        // Tab switching for voice/text input
        const voiceInputTab = document.getElementById('voiceInputTab');
        const textInputTab = document.getElementById('textInputTab');
        const voiceInputPanel = document.getElementById('voiceInputPanel');
        const textInputPanel = document.getElementById('textInputPanel');

        // Text translation elements
        const translateTextBtn = document.getElementById('translateTextBtn');
        const clearTextBtn = document.getElementById('clearTextBtn');
        const textToTranslate = document.getElementById('textToTranslate');

        // Tab switching functionality
        if (voiceInputTab && textInputTab) {
            voiceInputTab.addEventListener('click', () => {
                // Switch to voice input
                voiceInputTab.style.borderBottomColor = 'var(--color-accent-primary)';
                voiceInputTab.style.color = 'var(--color-accent-primary)';
                voiceInputTab.style.fontWeight = '600';

                textInputTab.style.borderBottomColor = 'transparent';
                textInputTab.style.color = 'var(--color-text-secondary)';
                textInputTab.style.fontWeight = 'normal';

                voiceInputPanel.style.display = 'block';
                textInputPanel.style.display = 'none';
            });

            textInputTab.addEventListener('click', () => {
                // Switch to text input
                textInputTab.style.borderBottomColor = 'var(--color-accent-primary)';
                textInputTab.style.color = 'var(--color-accent-primary)';
                textInputTab.style.fontWeight = '600';

                voiceInputTab.style.borderBottomColor = 'transparent';
                voiceInputTab.style.color = 'var(--color-text-secondary)';
                voiceInputTab.style.fontWeight = 'normal';

                voiceInputPanel.style.display = 'none';
                textInputPanel.style.display = 'block';
            });
        }

        // Text translation functionality
        if (translateTextBtn) {
            translateTextBtn.addEventListener('click', async () => {
                const text = textToTranslate.value.trim();
                if (!text) {
                    alert('Please enter text to translate');
                    return;
                }
                await this.handleTextTranslation(text);
            });
        }

        if (clearTextBtn) {
            clearTextBtn.addEventListener('click', () => {
                textToTranslate.value = '';
            });
        }

        // Enter key support for text area
        if (textToTranslate) {
            textToTranslate.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    const text = textToTranslate.value.trim();
                    if (text) {
                        await this.handleTextTranslation(text);
                    }
                }
            });
        }

        if (pushToTalkBtn) {
            // Prevent context menu on long press
            pushToTalkBtn.addEventListener('contextmenu', (e) => e.preventDefault());

            // Mouse events
            pushToTalkBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startPushToTalk();
            });

            pushToTalkBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.stopPushToTalk();
            });

            pushToTalkBtn.addEventListener('mouseleave', (e) => {
                if (this.isRecording) {
                    this.stopPushToTalk();
                }
            });

            // Touch events for mobile
            pushToTalkBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startPushToTalk();
            });

            pushToTalkBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopPushToTalk();
            });

            pushToTalkBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                if (this.isRecording) {
                    this.stopPushToTalk();
                }
            });
        }

        if (clearTranscriptionBtn) {
            clearTranscriptionBtn.addEventListener('click', () => {
                const outputArea = document.getElementById('speechRecognitionOutput');
                const translationLanguage = document.getElementById('translationLanguage')?.value;

                outputArea.innerHTML = `
                    <div class="speech-recognition-message">
                        <strong>Speech Recognizer:</strong> Hold down the microphone button and speak. Release when done.
                        ${translationLanguage ? '<br><em style="color: var(--color-accent-primary);">Translation enabled: Speech will be automatically translated.</em>' : ''}
                    </div>
                `;
            });
        }

        if (summarizeBtn) {
            summarizeBtn.addEventListener('click', async () => {
                const text = summaryInput.value.trim();
                if (!text) {
                    alert('Please enter text to summarize');
                    return;
                }
                await this.handleSummarization(text);
            });
        }

        if (summarySampleBtn) {
            summarySampleBtn.addEventListener('click', () => {
                const sample = `Microsoft Corporation is an American multinational technology company headquartered in Redmond, Washington. Microsoft's best-known software products are the Windows line of operating systems, the Microsoft Office suite, and the Internet Explorer and Edge web browsers. Its flagship hardware products are the Xbox video game consoles and the Microsoft Surface lineup of touchscreen personal computers. Microsoft ranked No. 14 in the 2022 Fortune 500 rankings of the largest United States corporations by total revenue; it was the world's largest software maker by revenue as of 2022. The company was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During the 1980s, Microsoft rose to dominate the home computer operating system market with MS-DOS. The company went public in 1986, raising $61 million in its initial public offering. Microsoft has made numerous acquisitions, including GitHub for $7.5 billion in 2018, and ZeniMax Media for $7.5 billion in 2021.`;
                summaryInput.value = sample;
            });
        }
    }

    // Event Listeners for Image Generation Service
    setupImageGenerationListeners() {
        const generateBtn = document.getElementById('generateImageBtn');
        const promptInput = document.getElementById('imagePrompt');
        const sizeSelect = document.getElementById('imageSizeSelect');
        const qualitySelect = document.getElementById('imageQualitySelect');
        const styleSelect = document.getElementById('imageStyleSelect');

        if (generateBtn) {
            generateBtn.addEventListener('click', async () => {
                const prompt = promptInput.value.trim();
                if (!prompt) return;
                
                const options = {
                    size: sizeSelect?.value || '1024x1024',
                    quality: qualitySelect?.value || 'standard',
                    style: styleSelect?.value || 'vivid'
                };
                
                if (window.imageGenUI) {
                    await window.imageGenUI.generateImage(prompt, options);
                }
            });
        }

        if (promptInput) {
            promptInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const prompt = promptInput.value.trim();
                    if (!prompt) return;
                    
                    const options = {
                        size: sizeSelect?.value || '1024x1024',
                        quality: qualitySelect?.value || 'standard',
                        style: styleSelect?.value || 'vivid'
                    };
                    
                    if (window.imageGenUI) {
                        await window.imageGenUI.generateImage(prompt, options);
                    }
                }
            });
        }

        // Initialize image generation UI
        if (window.imageGenUI) {
            window.imageGenUI.initialize();
        }
    }

    // Event Listeners for Vision Service
    setupVisionListeners() {
        // Image Analysis
        const analyzeBtn = document.getElementById('analyzeImage');
        const imageSampleBtn = document.getElementById('useImageSample');
        const imageUrlInput = document.getElementById('imageUrl');

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', async () => {
                const imageUrl = imageUrlInput.value.trim();
                if (!imageUrl) {
                    alert('Please enter an image URL');
                    return;
                }
                await this.handleImageAnalysis(imageUrl);
            });
        }

        if (imageSampleBtn) {
            imageSampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.vision.imageAnalysis.sampleImages[0];
                imageUrlInput.value = sample.url;
                this.showImagePreview(sample.url);
            });
        }

        // OCR
        const extractBtn = document.getElementById('extractText');
        const ocrSampleBtn = document.getElementById('useOCRSample');

        if (extractBtn) {
            extractBtn.addEventListener('click', async () => {
                const imageUrl = document.getElementById('ocrImageUrl').value.trim();
                if (!imageUrl) {
                    alert('Please enter an image URL');
                    return;
                }
                await this.handleOCR(imageUrl);
            });
        }

        if (ocrSampleBtn) {
            ocrSampleBtn.addEventListener('click', async () => {
                await this.handleOCR('sample');
            });
        }
    }

    // Event Listeners for Speech Service
    setupSpeechListeners() {
        // Speech to Text
        const startRecordingBtn = document.getElementById('startRecording');
        const stopRecordingBtn = document.getElementById('stopRecording');
        const speechSampleBtn = document.getElementById('useSpeechSample');

        if (speechSampleBtn) {
            speechSampleBtn.addEventListener('click', async () => {
                await this.handleSpeechToText('sample');
            });
        }

        // Text to Speech
        const generateSpeechBtn = document.getElementById('generateSpeech');
        const ttsInput = document.getElementById('ttsText');

        if (generateSpeechBtn) {
            generateSpeechBtn.addEventListener('click', async () => {
                const text = ttsInput.value.trim();
                if (!text) {
                    alert('Please enter text to convert to speech');
                    return;
                }
                await this.handleTextToSpeech(text);
            });
        }
    }

    // Business info icon handlers
    setupBusinessInfoIcons() {
        const businessInfoIcons = document.querySelectorAll('.business-info-icon');
        businessInfoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent any parent element clicks
                const feature = icon.dataset.feature;
                if (window.app && window.app.openBusinessModal) {
                    window.app.openBusinessModal(feature);
                }
            });

            // Hover effect for info icons
            icon.addEventListener('mouseenter', () => {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'rgba(102, 126, 234, 0.1)';
            });

            icon.addEventListener('mouseleave', () => {
                icon.style.opacity = '0.7';
                icon.style.transform = 'scale(1)';
                icon.style.background = 'none';
            });
        });
    }

    // Event Listeners for Language Service
    setupLanguageListeners() {
        // Sentiment Analysis
        const sentimentBtn = document.getElementById('analyzeSentiment');
        const sentimentSampleBtn = document.getElementById('useSentimentSample');
        const sentimentInput = document.getElementById('sentimentText');

        if (sentimentBtn) {
            sentimentBtn.addEventListener('click', async () => {
                const text = sentimentInput.value.trim();
                if (!text) {
                    alert('Please enter text to analyze');
                    return;
                }
                await this.handleSentimentAnalysis(text);
            });
        }

        if (sentimentSampleBtn) {
            sentimentSampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.language.sentiment.sampleTexts[0];
                sentimentInput.value = sample.text;
            });
        }

        // Key Phrases
        const keyPhrasesBtn = document.getElementById('extractKeyPhrases');
        const keyPhrasesSampleBtn = document.getElementById('useKeyPhrasesSample');
        const keyPhrasesInput = document.getElementById('keyPhrasesText');

        if (keyPhrasesBtn) {
            keyPhrasesBtn.addEventListener('click', async () => {
                const text = keyPhrasesInput.value.trim();
                if (!text) {
                    alert('Please enter text to analyze');
                    return;
                }
                await this.handleKeyPhraseExtraction(text);
            });
        }

        if (keyPhrasesSampleBtn) {
            keyPhrasesSampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.language.keyPhrases.sampleTexts[0];
                keyPhrasesInput.value = sample.text;
            });
        }

        // Entity Recognition
        const entitiesBtn = document.getElementById('extractEntities');
        const entitiesSampleBtn = document.getElementById('useEntitiesSample');
        const entitiesInput = document.getElementById('entitiesText');

        if (entitiesBtn) {
            entitiesBtn.addEventListener('click', async () => {
                const text = entitiesInput.value.trim();
                if (!text) {
                    alert('Please enter text to analyze');
                    return;
                }
                await this.handleEntityRecognition(text);
            });
        }

        if (entitiesSampleBtn) {
            entitiesSampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.language.entities.sampleTexts[0];
                entitiesInput.value = sample.text;
            });
        }
    }

    // Event Listeners for Translator Service
    setupTranslatorListeners() {
        const translateBtn = document.getElementById('translateText');
        const sampleBtn = document.getElementById('useTranslationSample');
        const swapBtn = document.getElementById('swapLanguages');
        const sourceText = document.getElementById('sourceText');

        if (translateBtn) {
            translateBtn.addEventListener('click', async () => {
                const text = sourceText.value.trim();
                if (!text) {
                    alert('Please enter text to translate');
                    return;
                }
                await this.handleTranslation(text);
            });
        }

        if (sampleBtn) {
            sampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.translator.sampleTranslations[0];
                sourceText.value = sample.original;
            });
        }

        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const sourceSelect = document.getElementById('sourceLanguage');
                const targetSelect = document.getElementById('targetLanguage');
                const temp = sourceSelect.value;
                sourceSelect.value = targetSelect.value;
                targetSelect.value = temp;
            });
        }
    }

    // Event Listeners for Content Safety Service
    setupContentSafetyListeners() {
        // Text Moderation
        const moderateTextBtn = document.getElementById('moderateText');
        const textSampleBtn = document.getElementById('useModerationSample');
        const moderationInput = document.getElementById('moderationText');

        if (moderateTextBtn) {
            moderateTextBtn.addEventListener('click', async () => {
                const text = moderationInput.value.trim();
                if (!text) {
                    alert('Please enter text to moderate');
                    return;
                }
                await this.handleTextModeration(text);
            });
        }

        if (textSampleBtn) {
            textSampleBtn.addEventListener('click', () => {
                const sample = window.AIServices.dummyData.contentSafety.textModeration.sampleTexts[0];
                moderationInput.value = sample.text;
            });
        }

        // Image Moderation
        const moderateImageBtn = document.getElementById('moderateImage');
        const imageSampleBtn = document.getElementById('useImageModerationSample');

        if (moderateImageBtn) {
            moderateImageBtn.addEventListener('click', async () => {
                const imageUrl = document.getElementById('moderationImageUrl').value.trim();
                if (!imageUrl) {
                    alert('Please enter an image URL');
                    return;
                }
                await this.handleImageModeration(imageUrl);
            });
        }

        if (imageSampleBtn) {
            imageSampleBtn.addEventListener('click', async () => {
                await this.handleImageModeration('sample');
            });
        }
    }

    // Handler Methods
    formatMessageContent(content) {
        // Enhanced HTML formatting for better text display
        let formatted = this.escapeHtml(content);

        // Convert markdown headers to HTML headers
        formatted = formatted.replace(/^### (.*$)/gm, '<h3 style="margin: 16px 0 8px 0; font-weight: 600; color: var(--color-text);">$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gm, '<h2 style="margin: 20px 0 12px 0; font-weight: 700; color: var(--color-text);">$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gm, '<h1 style="margin: 24px 0 16px 0; font-weight: 800; color: var(--color-text);">$1</h1>');

        // Convert markdown bold to HTML bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600;">$1</strong>');

        // Convert markdown italic to HTML italic
        formatted = formatted.replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>');

        // Convert markdown lists to HTML lists
        formatted = formatted.replace(/^- (.*$)/gm, '<li style="margin: 4px 0; padding-left: 8px;">$1</li>');
        formatted = formatted.replace(/^(\d+)\. (.*$)/gm, '<li style="margin: 4px 0; padding-left: 8px; list-style-type: decimal;">$2</li>');

        // Wrap consecutive list items in ul tags
        formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/g, (match) => {
            return '<ul style="margin: 12px 0; padding-left: 24px; list-style-type: disc;">' + match + '</ul>';
        });

        // Convert code blocks to styled HTML
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            const language = lang || 'text';
            const trimmedCode = code.trim();
            return `<div style="margin: 16px 0; background: rgba(0, 0, 0, 0.05); border-radius: 8px; overflow: hidden;">
                <div style="background: rgba(0, 0, 0, 0.1); padding: 8px 16px; font-size: 12px; font-weight: 500; color: var(--color-text-secondary);">
                    ${language.toUpperCase()}
                </div>
                <pre style="margin: 0; padding: 16px; overflow-x: auto; background: none; color: var(--color-text);"><code>${this.escapeHtml(trimmedCode)}</code></pre>
            </div>`;
        });

        // Convert inline code to styled spans
        formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(0, 0, 0, 0.08); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em;">$1</code>');

        // Convert double line breaks to paragraphs
        formatted = formatted.replace(/\n\n/g, '</p><p style="margin: 12px 0; line-height: 1.6;">');
        formatted = '<p style="margin: 12px 0 0 0; line-height: 1.6;">' + formatted + '</p>';

        // Convert single line breaks to <br> within paragraphs
        formatted = formatted.replace(/(?<!<\/p>)\n(?!<p)/g, '<br>');

        // Clean up empty paragraphs
        formatted = formatted.replace(/<p[^>]*><\/p>/g, '');

        return formatted;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    copyToClipboard(button, text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Copied!</span>
            `;
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
    
    copyMessage(button, messageContent) {
        // Extract text content without HTML for message copy
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = messageContent;
        
        // Remove copy buttons from the content
        const copyButtons = tempDiv.querySelectorAll('.copy-message-btn, .copy-code-btn');
        copyButtons.forEach(btn => btn.remove());
        
        // Get plain text
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        navigator.clipboard.writeText(textContent.trim()).then(() => {
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy message:', err);
        });
    }
    
    copyAIResponse(messageId) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;

        // Get the formatted content element
        const contentElement = messageElement.querySelector('.ai-response-content');

        // Create a temporary div to extract clean text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentElement.innerHTML;

        // Remove all copy buttons from the content
        const copyButtons = tempDiv.querySelectorAll('.copy-code-btn, .copy-message-btn');
        copyButtons.forEach(btn => btn.remove());

        // Handle code blocks specially to preserve formatting
        const codeBlocks = tempDiv.querySelectorAll('.code-block code');
        codeBlocks.forEach(block => {
            const codeText = block.textContent || block.innerText;
            // Replace the entire code block wrapper with just the code text
            const wrapper = block.closest('.code-block-wrapper');
            if (wrapper) {
                const textNode = document.createTextNode('\n```\n' + codeText + '\n```\n');
                wrapper.parentNode.replaceChild(textNode, wrapper);
            }
        });
        
        // Handle inline code
        const inlineCodes = tempDiv.querySelectorAll('.inline-code');
        inlineCodes.forEach(code => {
            const codeText = code.textContent || code.innerText;
            const textNode = document.createTextNode('`' + codeText + '`');
            code.parentNode.replaceChild(textNode, code);
        });
        
        // Convert <br> tags to newlines
        tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        
        // Get the clean text content
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';
        
        // Clean up extra whitespace while preserving code block formatting
        cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();
        
        // Copy to clipboard
        navigator.clipboard.writeText(cleanText).then(() => {
            const button = messageElement.querySelector('.simple-copy-btn');
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy response:', err);
        });
    }

    copyChatMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (!messageElement) return;

        // Get the formatted content element
        const contentElement = messageElement.querySelector('.ai-response-content');

        // Create a temporary div to extract clean text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = contentElement.innerHTML;

        // Remove all copy buttons from the content
        const copyButtons = tempDiv.querySelectorAll('.copy-code-btn, .copy-message-btn');
        copyButtons.forEach(btn => btn.remove());

        // Handle code blocks specially to preserve formatting
        const codeBlocks = tempDiv.querySelectorAll('.code-block code');
        codeBlocks.forEach(block => {
            const codeText = block.textContent || block.innerText;
            // Replace the entire code block wrapper with just the code text
            const wrapper = block.closest('.code-block-wrapper');
            if (wrapper) {
                const textNode = document.createTextNode('\n```\n' + codeText + '\n```\n');
                wrapper.parentNode.replaceChild(textNode, wrapper);
            }
        });

        // Handle inline code
        const inlineCodes = tempDiv.querySelectorAll('.inline-code');
        inlineCodes.forEach(code => {
            const codeText = code.textContent || code.innerText;
            const textNode = document.createTextNode('`' + codeText + '`');
            code.parentNode.replaceChild(textNode, code);
        });

        // Convert <br> tags to newlines
        tempDiv.innerHTML = tempDiv.innerHTML.replace(/<br\s*\/?>/gi, '\n');

        // Get the clean text content
        let cleanText = tempDiv.textContent || tempDiv.innerText || '';

        // Clean up extra whitespace while preserving code block formatting
        cleanText = cleanText.replace(/\n{3,}/g, '\n\n').trim();

        // Copy to clipboard
        navigator.clipboard.writeText(cleanText).then(() => {
            const button = messageElement.querySelector('.simple-copy-btn');
            const originalContent = button.innerHTML;
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            button.classList.add('copied');

            setTimeout(() => {
                button.innerHTML = originalContent;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy chat message:', err);
        });
    }

    async handleTextGeneration(prompt) {
        const outputArea = document.getElementById('textGenerationOutput');
        const promptInput = document.getElementById('textPrompt');
        
        // Create unique ID for this message
        const aiMessageId = 'msg-' + Date.now();
        
        // Add simple user prompt display (no container)
        const userDiv = document.createElement('div');
        userDiv.className = 'generated-text-item';
        userDiv.innerHTML = `<strong>You:</strong> ${this.escapeHtml(prompt)}`;
        outputArea.appendChild(userDiv);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'generated-text-item';
        loadingDiv.id = aiMessageId;
        loadingDiv.innerHTML = '<strong>AI Assistant:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);
        
        // Scroll to bottom
        outputArea.scrollTop = outputArea.scrollHeight;
        
        try {
            const response = await fetch('/api/openai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Format the response content
                const formattedContent = this.formatMessageContent(data.data.content);
                
                // Replace loading with actual response with simple copy button
                loadingDiv.className = 'generated-text-item ai-response-item';
                loadingDiv.innerHTML = `
                    <div class="ai-response-header">
                        <strong>AI Assistant:</strong>
                        <button class="simple-copy-btn" onclick="window.ServiceShowcase.copyAIResponse('${aiMessageId}')" title="Copy response">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ai-response-content">${formattedContent}</div>
                `;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
            // Clear input
            promptInput.value = '';
            
            // Scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        } catch (error) {
            console.error('Text generation error:', error);
            loadingDiv.innerHTML = `<strong>AI Assistant:</strong> <span style="color: var(--color-error);">Failed to generate text. Please try again.</span>`;
        }
    }

    async handleChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        this.addChatMessage('<div class="typing-indicator"><span></span><span></span><span></span></div>', 'ai');

        try {
            const response = await fetch('/api/openai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.8,
                    max_tokens: 800
                })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            const messages = document.getElementById('chatMessages');
            messages.removeChild(messages.lastChild);
            
            if (data.success) {
                this.addChatMessage(data.data.content, 'ai');
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Chat error:', error);
            const messages = document.getElementById('chatMessages');
            if (messages.lastChild && messages.lastChild.querySelector('.typing-indicator')) {
                messages.removeChild(messages.lastChild);
            }
            this.addChatMessage('Sorry, I encountered an error. Please try again.', 'ai');
        }
    }

    addChatMessage(content, sender) {
        const messages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message--${sender}`;

        if (sender === 'ai' && !content.includes('typing-indicator')) {
            // Create unique ID for this AI message
            const messageId = 'chat-msg-' + Date.now();
            messageDiv.id = messageId;

            // Format the content using the same formatter as text generation
            const formattedContent = this.formatMessageContent(content);

            messageDiv.innerHTML = `
                <div class="chat-message__content">
                    <div class="ai-response-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="font-size: 0.9rem; color: var(--color-text-secondary);">AI Assistant</strong>
                        <button class="simple-copy-btn" onclick="window.ServiceShowcase.copyChatMessage('${messageId}')" title="Copy message" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="ai-response-content">${formattedContent}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="chat-message__content">${content}</div>`;
        }

        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    async handleSummarization(text) {
        const outputArea = document.getElementById('summaryOutput');
        const summaryInput = document.getElementById('summaryText');
        
        // Add user's text (truncated for display)
        const userDiv = document.createElement('div');
        userDiv.className = 'generated-text-item';
        const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;
        userDiv.innerHTML = `<strong>Your Document:</strong> <em>${truncatedText}</em>`;
        outputArea.appendChild(userDiv);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'generated-text-item';
        loadingDiv.innerHTML = '<strong>AI Summarizer:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);
        
        // Scroll to bottom
        outputArea.scrollTop = outputArea.scrollHeight;
        
        try {
            const response = await fetch('/api/openai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI assistant that creates concise, informative summaries of text content. Provide a summary that captures the main points and key information."
                        },
                        {
                            role: "user",
                            content: `Please summarize the following text:\n\n${text}`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 500
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Replace loading with actual summary
                loadingDiv.innerHTML = `<strong>AI Summarizer:</strong> ${data.data.content}`;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
            // Clear input
            summaryInput.value = '';
            
            // Scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        } catch (error) {
            console.error('Summarization error:', error);
            loadingDiv.innerHTML = `<strong>AI Summarizer:</strong> <span style="color: var(--color-error);">Failed to summarize text. Please try again.</span>`;
        }
    }

    async handleRealtimeMessage(prompt) {
        const outputArea = document.getElementById('realtimeOutput');
        const realtimePrompt = document.getElementById('realtimePrompt');
        
        // Clear input immediately when sending
        realtimePrompt.value = '';
        realtimePrompt.style.height = 'auto'; // Reset textarea height
        
        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'realtime-message';
        userDiv.innerHTML = `<strong>You:</strong> ${prompt}`;
        outputArea.appendChild(userDiv);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'realtime-message';
        loadingDiv.innerHTML = '<strong>AI Assistant:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);
        
        // Scroll to bottom
        outputArea.scrollTop = outputArea.scrollHeight;
        
        try {
            // Call the Realtime API endpoint
            const response = await fetch('/api/openai/realtime', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt,
                    outputModalities: ['text', 'audio'],
                    voiceType: this.voiceType,
                    voiceName: this.selectedVoice
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Replace loading with text response
                loadingDiv.innerHTML = `<strong>AI Assistant:</strong> ${data.data.text}`;
                
                // Handle audio response based on voice type
                if (this.audioEnabled) {
                    if (this.voiceType === 'azure' && data.data.audioData) {
                        // Use Azure-generated audio (from avatar synthesis or direct TTS)
                        const mediaContainer = document.getElementById('mediaPlayerContainer');
                        const audioPlayer = document.getElementById('realtimeAudioPlayer');
                        
                        // Even if it's a video (avatar), we'll play it as audio only
                        let mimeType = 'audio/mpeg';
                        if (data.data.isVideo) {
                            // Avatar synthesis returns video, but we'll treat it as audio
                            mimeType = 'video/mp4';
                            console.log('Avatar video received, extracting audio...');
                        }
                        
                        const mediaBlob = this.base64ToBlob(data.data.audioData, mimeType);
                        const mediaUrl = URL.createObjectURL(mediaBlob);
                        
                        // Always use audio player, even for video content (audio will still play)
                        audioPlayer.src = mediaUrl;
                        mediaContainer.style.display = 'block';
                        
                        // Auto-play if enabled
                        audioPlayer.play().catch(e => console.log('Audio autoplay prevented:', e));
                        
                    } else if (this.voiceType === 'browser') {
                        // Use browser Text-to-Speech
                        this.speakText(data.data.text);
                        // Hide media player for browser TTS
                        document.getElementById('mediaPlayerContainer').style.display = 'none';
                    } else if (this.voiceType === 'azure' && !data.data.audioData) {
                        // Azure was requested but failed, fallback to browser
                        console.log('Azure Speech Service not available, using browser TTS');
                        this.speakText(data.data.text);
                        document.getElementById('mediaPlayerContainer').style.display = 'none';
                    }
                }
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
            // Scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        } catch (error) {
            console.error('Realtime API error:', error);
            loadingDiv.innerHTML = `<strong>AI Assistant:</strong> <span style="color: var(--color-error);">Failed to process realtime request. Please try again.</span>`;
        }
    }

    base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    // Push-to-Talk Methods
    startPushToTalk() {
        const outputArea = document.getElementById('speechRecognitionOutput');
        const pushToTalkBtn = document.getElementById('pushToTalkBtn');
        const recordingIndicator = document.getElementById('recordingIndicator');
        const languageSelect = document.getElementById('recognitionLanguage');
        const micButtonText = document.getElementById('micButtonText');
        const selectedLanguage = languageSelect ? languageSelect.value : 'en-US';

        // Check for browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>Not Supported:</strong> Your browser doesn't support speech recognition.
                </div>
            `;
            return;
        }

        // Visual feedback
        pushToTalkBtn.style.backgroundColor = 'var(--color-error)';
        micButtonText.textContent = 'Recording...';
        recordingIndicator.style.display = 'flex';

        // Clear previous output
        outputArea.innerHTML = `
            <div class="speech-recognition-message">
                <strong>Speech Recognizer:</strong> <em>Listening... Speak now!</em>
            </div>
        `;

        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configure for single utterance capture
        this.recognition.continuous = false;  // Stop after getting result
        this.recognition.interimResults = true;
        this.recognition.lang = selectedLanguage;
        this.recognition.maxAlternatives = 1;

        this.finalTranscript = '';
        this.isRecording = true;

        this.recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;

                if (event.results[i].isFinal) {
                    this.finalTranscript = transcript;
                } else {
                    interimTranscript = transcript;
                }
            }

            // Single update per event
            outputArea.innerHTML = `
                <div class="speech-recognition-message">
                    <strong>Speech Recognizer:</strong> <em>Listening... Speak now!</em>
                </div>
                ${this.finalTranscript ? `<div class="speech-recognition-message">
                    <strong>Recognized Text:</strong> ${this.finalTranscript}
                </div>` : ''}
                ${interimTranscript ? `<div class="speech-recognition-message" style="opacity: 0.7;">
                    <strong>Processing:</strong> <em>${interimTranscript}</em>
                </div>` : ''}
            `;
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);

            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
                outputArea.innerHTML = `
                    <div class="speech-recognition-message" style="color: var(--color-error);">
                        <strong>Microphone Permission Denied</strong>
                    </div>
                    <div class="speech-recognition-message">
                        <p>Please enable microphone access in your browser settings.</p>
                    </div>
                `;
            } else if (event.error === 'no-speech') {
                // This is normal when user releases button without speaking
                if (!this.finalTranscript) {
                    outputArea.innerHTML = `
                        <div class="speech-recognition-message">
                            <strong>No speech detected.</strong> Hold the button and speak clearly.
                        </div>
                    `;
                }
            }

            this.resetPushToTalkButton();
        };

        this.recognition.onend = () => {
            // Recognition ended (either by release or error)
            if (!this.isRecording) {
                // User released button, process the transcript
                if (this.finalTranscript) {
                    this.processSpeechTranscript(this.finalTranscript);
                }
            }
        };

        // Start recognition
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Failed to start recognition:', error);
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>Error:</strong> Failed to start speech recognition.
                </div>
            `;
            this.resetPushToTalkButton();
        }
    }

    stopPushToTalk() {
        if (!this.isRecording || !this.recognition) return;

        this.isRecording = false;

        // Stop recognition
        try {
            this.recognition.stop();
        } catch (error) {
            console.error('Error stopping recognition:', error);
        }

        this.resetPushToTalkButton();
    }

    resetPushToTalkButton() {
        const pushToTalkBtn = document.getElementById('pushToTalkBtn');
        const recordingIndicator = document.getElementById('recordingIndicator');
        const micButtonText = document.getElementById('micButtonText');

        // Reset visual state
        pushToTalkBtn.style.backgroundColor = '';
        micButtonText.textContent = 'Hold to Talk';
        recordingIndicator.style.display = 'none';
    }

    async processSpeechTranscript(transcript) {
        const outputArea = document.getElementById('speechRecognitionOutput');
        const translationLanguage = document.getElementById('translationLanguage')?.value;
        const recognitionLanguage = document.getElementById('recognitionLanguage')?.value || 'en-US';

        // Extract language code from recognition language (e.g., "ja-JP" -> "ja")
        const sourceLangCode = recognitionLanguage.split('-')[0];

        // Show initial recognized text
        outputArea.innerHTML = `
            <div class="speech-recognition-message">
                <strong>Recognized Text (${this.getLanguageName(recognitionLanguage)}):</strong> ${transcript}
            </div>
            ${translationLanguage ? `<div class="speech-recognition-message" style="color: var(--color-accent-primary);">
                <strong>Translating:</strong> <em>Processing translation...</em>
            </div>` : ''}
        `;

        // If translation is requested
        if (translationLanguage && translationLanguage !== sourceLangCode) {
            try {
                // Call translation API
                const response = await fetch('/api/translator/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: transcript,
                        from: sourceLangCode,
                        to: translationLanguage
                    })
                });

                const data = await response.json();

                if (data.success && data.data) {
                    // Show both original and translated text
                    outputArea.innerHTML = `
                        <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px; margin-bottom: 10px;">
                            <strong style="color: var(--color-accent-primary);">Original (${this.getLanguageName(recognitionLanguage)}):</strong>
                            <div style="margin-top: 8px; font-size: 1.1em;">${transcript}</div>
                        </div>
                        <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-tertiary); border-radius: 8px;">
                            <strong style="color: var(--color-success);">Translation (${this.getLanguageNameFromCode(translationLanguage)}):</strong>
                            <div style="margin-top: 8px; font-size: 1.1em;">${data.data.translation || data.data}</div>
                        </div>
                    `;
                } else {
                    throw new Error(data.error || 'Translation failed');
                }
            } catch (error) {
                console.error('Translation error:', error);
                // Fallback to simulated translation for demo
                const simulatedTranslation = this.simulateTranslation(transcript, sourceLangCode, translationLanguage);
                outputArea.innerHTML = `
                    <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px; margin-bottom: 10px;">
                        <strong style="color: var(--color-accent-primary);">Original (${this.getLanguageName(recognitionLanguage)}):</strong>
                        <div style="margin-top: 8px; font-size: 1.1em;">${transcript}</div>
                    </div>
                    <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-tertiary); border-radius: 8px;">
                        <strong style="color: var(--color-success);">Translation (${this.getLanguageNameFromCode(translationLanguage)}):</strong>
                        <div style="margin-top: 8px; font-size: 1.1em;">${simulatedTranslation}</div>
                        <div style="margin-top: 5px; font-size: 0.9em; opacity: 0.7;">(Demo translation)</div>
                    </div>
                `;
            }
        } else if (!translationLanguage) {
            // No translation requested, just show the recognized text
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px;">
                    <strong style="color: var(--color-accent-primary);">Recognized Text (${this.getLanguageName(recognitionLanguage)}):</strong>
                    <div style="margin-top: 8px; font-size: 1.1em;">${transcript}</div>
                </div>
            `;
        } else {
            // Same language selected for translation
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px;">
                    <strong style="color: var(--color-accent-primary);">Recognized Text (${this.getLanguageName(recognitionLanguage)}):</strong>
                    <div style="margin-top: 8px; font-size: 1.1em;">${transcript}</div>
                </div>
                <div class="speech-recognition-message" style="color: var(--color-warning); margin-top: 10px;">
                    <em>Translation not needed - same language selected</em>
                </div>
            `;
        }
    }

    getLanguageName(langCode) {
        const languages = {
            'en-US': 'English (US)',
            'en-GB': 'English (UK)',
            'es-ES': 'Spanish',
            'fr-FR': 'French',
            'de-DE': 'German',
            'it-IT': 'Italian',
            'pt-BR': 'Portuguese',
            'ja-JP': 'Japanese',
            'ko-KR': 'Korean',
            'zh-CN': 'Chinese (Simplified)'
        };
        return languages[langCode] || langCode;
    }

    getLanguageNameFromCode(langCode) {
        const languages = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh-Hans': 'Chinese (Simplified)',
            'zh-Hant': 'Chinese (Traditional)',
            'ru': 'Russian',
            'ar': 'Arabic',
            'hi': 'Hindi'
        };
        return languages[langCode] || langCode;
    }

    simulateTranslation(text, from, to) {
        // Simple demo translations for common phrases
        const translations = {
            'ja': {
                'en': {
                    'こんにちは': 'Hello',
                    'ありがとう': 'Thank you',
                    'さようなら': 'Goodbye',
                    'おはよう': 'Good morning',
                    'こんばんは': 'Good evening'
                }
            },
            'en': {
                'ja': {
                    'hello': 'こんにちは',
                    'thank you': 'ありがとう',
                    'goodbye': 'さようなら',
                    'good morning': 'おはよう',
                    'good evening': 'こんばんは'
                },
                'es': {
                    'hello': 'hola',
                    'thank you': 'gracias',
                    'goodbye': 'adiós',
                    'good morning': 'buenos días',
                    'good evening': 'buenas tardes'
                },
                'fr': {
                    'hello': 'bonjour',
                    'thank you': 'merci',
                    'goodbye': 'au revoir',
                    'good morning': 'bonjour',
                    'good evening': 'bonsoir'
                }
            },
            'es': {
                'en': {
                    'hola': 'hello',
                    'gracias': 'thank you',
                    'adiós': 'goodbye',
                    'buenos días': 'good morning',
                    'buenas tardes': 'good evening'
                }
            }
        };

        // Try to find a translation
        const lowerText = text.toLowerCase();
        if (translations[from] && translations[from][to] && translations[from][to][lowerText]) {
            return translations[from][to][lowerText];
        }

        // Return a generic simulated translation
        return `[Translated from ${from} to ${to}]: ${text}`;
    }

    async handleTextTranslation(text) {
        const outputArea = document.getElementById('speechRecognitionOutput');
        const translationLanguage = document.getElementById('translationLanguage')?.value;
        const recognitionLanguage = document.getElementById('recognitionLanguage')?.value || 'en-US';

        // Extract source language code from recognition language for text input
        const sourceLangCode = recognitionLanguage.split('-')[0];

        if (!translationLanguage) {
            // No translation requested, just show the original text
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px;">
                    <strong style="color: var(--color-accent-primary);">Input Text:</strong>
                    <div style="margin-top: 8px; font-size: 1.1em;">${text}</div>
                    <div style="margin-top: 10px; color: var(--color-warning); font-size: 0.9em;">
                        <em>Select a target language to enable translation</em>
                    </div>
                </div>
            `;
            return;
        }

        // Show processing state
        outputArea.innerHTML = `
            <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px;">
                <strong style="color: var(--color-accent-primary);">Input Text:</strong>
                <div style="margin-top: 8px; font-size: 1.1em;">${text}</div>
            </div>
            <div class="speech-recognition-message" style="color: var(--color-accent-primary); margin-top: 10px;">
                <strong>Translating:</strong> <em>Processing translation...</em>
            </div>
        `;

        try {
            // Call translation API with auto-detection
            const response = await fetch('/api/translator/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    from: 'auto-detect', // Let Azure detect the language
                    to: translationLanguage
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const detectedLang = data.data.detectedLanguage?.language || 'unknown';
                const translation = data.data.translation || data.data;

                // Show both original and translated text
                outputArea.innerHTML = `
                    <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px; margin-bottom: 10px;">
                        <strong style="color: var(--color-accent-primary);">Original Text${detectedLang !== 'unknown' ? ` (${this.getLanguageNameFromCode(detectedLang)})` : ''}:</strong>
                        <div style="margin-top: 8px; font-size: 1.1em;">${text}</div>
                    </div>
                    <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-tertiary); border-radius: 8px;">
                        <strong style="color: var(--color-success);">Translation (${this.getLanguageNameFromCode(translationLanguage)}):</strong>
                        <div style="margin-top: 8px; font-size: 1.1em;">${translation}</div>
                        ${data.data.isDemo ? '<div style="margin-top: 5px; font-size: 0.9em; opacity: 0.7;">(Demo translation)</div>' : ''}
                    </div>
                `;
            } else {
                throw new Error(data.error || 'Translation failed');
            }
        } catch (error) {
            console.error('Text translation error:', error);
            // Show error message
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="padding: 15px; background: var(--color-bg-secondary); border-radius: 8px; margin-bottom: 10px;">
                    <strong style="color: var(--color-accent-primary);">Original Text:</strong>
                    <div style="margin-top: 8px; font-size: 1.1em;">${text}</div>
                </div>
                <div class="speech-recognition-message" style="color: var(--color-error); margin-top: 10px;">
                    <strong>Translation Error:</strong> ${error.message || 'Failed to translate text'}
                </div>
            `;
        }
    }

    startSpeechRecognition() {
        const outputArea = document.getElementById('speechRecognitionOutput');
        const startBtn = document.getElementById('startSpeechRecognition');
        const stopBtn = document.getElementById('stopSpeechRecognition');
        const recordingIndicator = document.getElementById('recordingIndicator');
        const languageSelect = document.getElementById('recognitionLanguage');
        const selectedLanguage = languageSelect ? languageSelect.value : 'en-US';

        // Check for browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            // Simulate Azure Speech SDK behavior for demo purposes
            this.simulateAzureSpeechRecognition(outputArea, startBtn, stopBtn, recordingIndicator, selectedLanguage);
            return;
        }

        // Show permission request message
        outputArea.innerHTML = `
            <div class="speech-recognition-message">
                <strong>Speech Recognizer:</strong> <em>Requesting microphone permission...</em>
            </div>
        `;

        // Check for microphone permission first using MediaDevices API
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Permission granted, stop the stream immediately
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Now start speech recognition
                    this.initiateSpeechRecognition(outputArea, startBtn, stopBtn, recordingIndicator, selectedLanguage);
                })
                .catch(err => {
                    console.error('Microphone permission error:', err);
                    this.handlePermissionError(err, outputArea);
                });
        } else {
            // Fallback for older browsers - try direct speech recognition
            this.initiateSpeechRecognition(outputArea, startBtn, stopBtn, recordingIndicator, selectedLanguage);
        }
    }

    handlePermissionError(err, outputArea) {
        let errorMessage = '';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>Microphone Permission Required</strong>
                </div>
                <div class="speech-recognition-message">
                    <p>To use speech recognition, please allow microphone access:</p>
                    <ol style="margin: 10px 0; padding-left: 20px;">
                        <li><strong>Chrome/Edge:</strong> Look for the microphone icon 🎤 in the address bar and click "Allow"</li>
                        <li><strong>Firefox:</strong> Click on the shield icon and enable microphone permissions</li>
                        <li><strong>Safari:</strong> Go to Safari → Settings → Websites → Microphone</li>
                        <li>Reload the page and try "Start Recording" again</li>
                    </ol>
                    <p style="margin-top: 15px; padding: 10px; background: var(--color-bg-secondary); border-radius: 6px; font-size: 0.9rem;">
                        💡 <strong>Tip:</strong> This demo uses your browser's speech recognition as a demonstration of Azure Speech Services capabilities.
                    </p>
                </div>
            `;
        } else if (err.name === 'NotFoundError') {
            errorMessage = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>No Microphone Found</strong>
                </div>
                <div class="speech-recognition-message">
                    <p>Please ensure a microphone is connected to your device and try again.</p>
                </div>
            `;
        } else {
            errorMessage = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>Error:</strong> ${err.message || 'Failed to access microphone'}
                </div>
            `;
        }
        
        outputArea.innerHTML = errorMessage;
    }

    initiateSpeechRecognition(outputArea, startBtn, stopBtn, recordingIndicator, selectedLanguage) {
        // Use browser's Web Speech API as a demonstration
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configure recognition settings (simulating Azure Speech SDK config)
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = selectedLanguage;
        
        // Show recording state
        this.isRecording = true;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        recordingIndicator.style.display = 'flex';
        
        // Clear previous output and show listening state
        outputArea.innerHTML = `
            <div class="speech-recognition-message">
                <strong>Speech Recognizer:</strong> <em>Listening... Speak into your microphone.</em>
            </div>
        `;
        
        let finalTranscript = '';
        let interimTranscript = '';
        
        this.recognition.onresult = (event) => {
            interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';

                    // Simulating Azure SDK's RecognizedSpeech result
                    console.log('Recognized:', transcript);
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Update output with both final and interim results - single update per event
            outputArea.innerHTML = `
                <div class="speech-recognition-message">
                    <strong>Speech Recognizer:</strong> <em>Listening... Speak into your microphone.</em>
                </div>
                ${finalTranscript ? `<div class="speech-recognition-message">
                    <strong>Recognized Text:</strong> ${finalTranscript}
                </div>` : ''}
                ${interimTranscript ? `<div class="speech-recognition-message" style="opacity: 0.7;">
                    <strong>Processing:</strong> <em>${interimTranscript}</em>
                </div>` : ''}`;
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            
            // Provide user-friendly error messages
            let errorMessage = '';
            switch(event.error) {
                case 'no-speech':
                    errorMessage = `
                        <div class="speech-recognition-message" style="color: var(--color-error);">
                            <strong>No Speech Detected</strong>
                        </div>
                        <div class="speech-recognition-message">
                            <p>No speech could be recognized. Please try:</p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Speaking closer to your microphone</li>
                                <li>Speaking more clearly</li>
                                <li>Checking that your microphone is working</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'audio-capture':
                    errorMessage = `
                        <div class="speech-recognition-message" style="color: var(--color-error);">
                            <strong>Microphone Not Found</strong>
                        </div>
                        <div class="speech-recognition-message">
                            <p>No microphone was found. Please:</p>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Ensure a microphone is connected to your device</li>
                                <li>Check your system audio settings</li>
                                <li>Refresh the page and try again</li>
                            </ul>
                        </div>
                    `;
                    break;
                case 'not-allowed':
                    errorMessage = `
                        <div class="speech-recognition-message" style="color: var(--color-error);">
                            <strong>Microphone Permission Required</strong>
                        </div>
                        <div class="speech-recognition-message">
                            <p>Microphone access was denied. To enable speech recognition:</p>
                            <ol style="margin: 10px 0; padding-left: 20px;">
                                <li><strong>Chrome/Edge:</strong> Look for the microphone icon 🎤 in the address bar and click "Allow"</li>
                                <li><strong>Firefox:</strong> Click on the shield icon and enable microphone permissions</li>
                                <li><strong>Safari:</strong> Go to Safari → Settings → Websites → Microphone</li>
                                <li>Reload the page and try again</li>
                            </ol>
                            <p style="margin-top: 10px; font-size: 0.9rem; color: var(--color-text-secondary);">
                                <em>Note: This demo simulates Azure Speech Services for educational purposes.</em>
                            </p>
                        </div>
                    `;
                    break;
                case 'network':
                    errorMessage = `
                        <div class="speech-recognition-message" style="color: var(--color-error);">
                            <strong>Network Error</strong>
                        </div>
                        <div class="speech-recognition-message">
                            <p>Network connection issue. Please check your internet connection and try again.</p>
                        </div>
                    `;
                    break;
                default:
                    errorMessage = `
                        <div class="speech-recognition-message" style="color: var(--color-error);">
                            <strong>Speech Recognition Error</strong>
                        </div>
                        <div class="speech-recognition-message">
                            <p>Error: ${event.error}</p>
                            <p>Please try refreshing the page and starting again.</p>
                        </div>
                    `;
            }
            
            outputArea.innerHTML = errorMessage;
            this.stopSpeechRecognition();
        };
        
        this.recognition.onend = () => {
            if (this.isRecording) {
                // Restart if still recording (continuous mode)
                this.recognition.start();
            }
        };
        
        // Start recognition
        try {
            this.recognition.start();
            console.log('Speech recognition started');
        } catch (error) {
            console.error('Failed to start recognition:', error);
            outputArea.innerHTML = `
                <div class="speech-recognition-message" style="color: var(--color-error);">
                    <strong>Error:</strong> Failed to start speech recognition. Please check your microphone permissions.
                </div>
            `;
            this.stopSpeechRecognition();
        }
    }
    
    stopSpeechRecognition() {
        const startBtn = document.getElementById('startSpeechRecognition');
        const stopBtn = document.getElementById('stopSpeechRecognition');
        const recordingIndicator = document.getElementById('recordingIndicator');
        const outputArea = document.getElementById('speechRecognitionOutput');
        
        this.isRecording = false;
        
        if (this.recognition) {
            this.recognition.stop();
            this.recognition = null;
        }
        
        // Update UI
        startBtn.style.display = 'flex';
        stopBtn.style.display = 'none';
        recordingIndicator.style.display = 'none';
        
        // Add completion message
        const currentContent = outputArea.innerHTML;
        if (!currentContent.includes('Error:') && !currentContent.includes('Recognized Text:')) {
            outputArea.innerHTML = `
                <div class="speech-recognition-message">
                    <strong>Speech Recognizer:</strong> No speech was detected. Ready to try again.
                </div>
            `;
        } else if (currentContent.includes('Recognized Text:')) {
            outputArea.innerHTML = currentContent.replace('Listening... Speak into your microphone.', 'Recording stopped. Click the microphone button to start a new recording.');
        }
    }
    
    simulateAzureSpeechRecognition(outputArea, startBtn, stopBtn, recordingIndicator, language) {
        // Simulate Azure Speech SDK for browsers that don't support Web Speech API
        this.isRecording = true;
        startBtn.style.display = 'none';
        stopBtn.style.display = 'flex';
        recordingIndicator.style.display = 'flex';
        
        outputArea.innerHTML = `
            <div class="speech-recognition-message">
                <strong>Speech Recognizer:</strong> <em>Simulating Azure Speech Services... (Web Speech API not available in this browser)</em>
            </div>
        `;
        
        // Simulate recognition after 2 seconds
        setTimeout(() => {
            if (this.isRecording) {
                const sampleTexts = {
                    'en-US': 'Hello, this is a simulated speech recognition result from Azure Cognitive Services.',
                    'es-ES': 'Hola, este es un resultado simulado de reconocimiento de voz de Azure Cognitive Services.',
                    'fr-FR': 'Bonjour, ceci est un résultat simulé de reconnaissance vocale d\'Azure Cognitive Services.',
                    'de-DE': 'Hallo, dies ist ein simuliertes Spracherkennungsergebnis von Azure Cognitive Services.',
                    'ja-JP': 'こんにちは、これはAzure Cognitive Servicesからのシミュレートされた音声認識結果です。',
                    'zh-CN': '你好，这是来自Azure认知服务的模拟语音识别结果。'
                };
                
                const recognizedText = sampleTexts[language] || sampleTexts['en-US'];
                
                outputArea.innerHTML = `
                    <div class="speech-recognition-message">
                        <strong>Speech Recognizer:</strong> <em>Recognition complete (simulated)</em>
                    </div>
                    <div class="speech-recognition-message">
                        <strong>Recognized Text:</strong> ${recognizedText}
                    </div>
                    <div class="speech-recognition-message" style="color: var(--color-text-secondary); font-size: 0.9rem;">
                        <em>Note: This is a simulated result. In production, this would use Azure Speech SDK with actual microphone input.</em>
                    </div>
                `;
                
                this.stopSpeechRecognition();
            }
        }, 3000);
    }

    speakText(text) {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            console.log('🔊 Browser TTS: Starting speech synthesis for text:', text.substring(0, 50) + '...');
            
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure voice settings
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            
            // Handle voice loading (voices might not be immediately available)
            const loadVoicesAndSpeak = () => {
                const voices = window.speechSynthesis.getVoices();
                console.log('🔊 Available voices:', voices.length);
                
                if (voices.length > 0) {
                    const preferredVoice = voices.find(voice => 
                        voice.name.includes('Google') || 
                        voice.name.includes('Microsoft') || 
                        voice.lang.startsWith('en-US')
                    );
                    
                    if (preferredVoice) {
                        utterance.voice = preferredVoice;
                        console.log('🔊 Using voice:', preferredVoice.name);
                    } else {
                        console.log('🔊 Using default voice');
                    }
                }
                
                // Add event listeners for debugging
                utterance.onstart = () => console.log('🔊 Speech started');
                utterance.onend = () => console.log('🔊 Speech ended');
                utterance.onerror = (event) => console.error('🔊 Speech error:', event);
                
                // Speak the text
                window.speechSynthesis.speak(utterance);
                console.log('🔊 Speech synthesis initiated');
            };
            
            // Check if voices are already loaded
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                loadVoicesAndSpeak();
            } else {
                // Wait for voices to load
                window.speechSynthesis.onvoiceschanged = loadVoicesAndSpeak;
                // Fallback timeout in case onvoiceschanged doesn't fire
                setTimeout(loadVoicesAndSpeak, 100);
            }
            
        } else {
            console.log('🔊 Speech synthesis not supported in this browser');
        }
    }

    async handleImageAnalysis(imageUrl) {
        this.showImagePreview(imageUrl);
        this.showLoading('imageResult');
        try {
            const result = await window.AIServices.simulateAPICall('vision', 'imageAnalysis', imageUrl);
            const html = `
                <div class="results__item">
                    <div class="results__item-title">Description:</div>
                    <div class="results__item-value">${result.description}</div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Tags:</div>
                    <div class="results__item-value">
                        ${result.tags.map(tag => `<span class="feature-tag">${tag}</span>`).join(' ')}
                    </div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Objects Detected:</div>
                    <div class="results__item-value">
                        <ul>
                            ${result.objects.map(obj => `<li>${obj.name} (${Math.round(obj.confidence * 100)}% confidence)</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            this.showResult('imageResult', html);
        } catch (error) {
            this.showError('imageResult', 'Failed to analyze image');
        }
    }

    showImagePreview(imageUrl) {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        if (preview && img) {
            img.src = imageUrl;
            preview.style.display = 'block';
        }
    }

    async handleOCR(imageUrl) {
        this.showLoading('ocrResult');
        try {
            const result = await window.AIServices.simulateAPICall('vision', 'ocr', imageUrl);
            this.showResult('ocrResult', `
                <div class="results__item">
                    <div class="results__item-title">Document Type:</div>
                    <div class="results__item-value">${result.type}</div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Extracted Text:</div>
                    <div class="results__item-value">
                        <pre style="white-space: pre-wrap; font-family: inherit; background: var(--color-bg-tertiary); padding: var(--spacing-md); border-radius: var(--radius-md);">${result.text}</pre>
                    </div>
                </div>
            `);
        } catch (error) {
            this.showError('ocrResult', 'Failed to extract text');
        }
    }

    async handleSpeechToText(audioData) {
        const outputArea = document.getElementById('speechOutput');
        
        // Add audio input indicator
        const audioDiv = document.createElement('div');
        audioDiv.className = 'generated-text-item';
        audioDiv.innerHTML = `<strong>Audio Input:</strong> <em>Processing audio recording...</em>`;
        outputArea.appendChild(audioDiv);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'generated-text-item';
        loadingDiv.innerHTML = '<strong>Speech Recognition:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);
        
        // Scroll to bottom
        outputArea.scrollTop = outputArea.scrollHeight;
        
        try {
            const result = await window.AIServices.simulateAPICall('speech', 'speechToText', audioData);
            
            // Replace loading with transcription result
            loadingDiv.innerHTML = `<strong>Speech Recognition:</strong> "${result.transcript}" <br><small style="color: var(--color-text-secondary);">Confidence: ${Math.round(result.confidence * 100)}%</small>`;
            
            // Scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        } catch (error) {
            loadingDiv.innerHTML = `<strong>Speech Recognition:</strong> <span style="color: var(--color-error);">Failed to transcribe speech. Please try again.</span>`;
        }
    }

    async handleTextToSpeech(text) {
        const outputArea = document.getElementById('ttsOutput');
        const ttsInput = document.getElementById('ttsText');
        const voiceSelect = document.getElementById('voiceSelect');
        const selectedVoice = voiceSelect.options[voiceSelect.selectedIndex].text;
        
        // Add user text
        const userDiv = document.createElement('div');
        userDiv.className = 'generated-text-item';
        userDiv.innerHTML = `<strong>Your Text:</strong> "${text}" <br><small style="color: var(--color-text-secondary);">Voice: ${selectedVoice}</small>`;
        outputArea.appendChild(userDiv);
        
        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'generated-text-item';
        loadingDiv.innerHTML = '<strong>Speech Synthesizer:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);
        
        // Scroll to bottom
        outputArea.scrollTop = outputArea.scrollHeight;
        
        try {
            const result = await window.AIServices.simulateAPICall('speech', 'textToSpeech', text);
            
            // Replace loading with audio result
            loadingDiv.innerHTML = `
                <strong>Speech Synthesizer:</strong> Audio generated successfully!
                <audio controls style="width: 100%; margin-top: var(--spacing-sm); border-radius: var(--radius-md);">
                    <source src="${result.audioUrl}" type="audio/wav">
                    Your browser does not support the audio element.
                </audio>
                <small style="color: var(--color-text-secondary); display: block; margin-top: var(--spacing-sm);">Voice: ${result.voice.name} (${result.voice.language})</small>
            `;
            
            // Clear input
            ttsInput.value = '';
            
            // Scroll to bottom
            outputArea.scrollTop = outputArea.scrollHeight;
        } catch (error) {
            loadingDiv.innerHTML = `<strong>Speech Synthesizer:</strong> <span style="color: var(--color-error);">Failed to generate speech. Please try again.</span>`;
        }
    }

    async handleSentimentAnalysis(text) {
        this.showLoading('sentimentResult');
        try {
            const result = await window.AIServices.simulateAPICall('language', 'sentiment', text);
            const sentimentColor = result.sentiment === 'Positive' ? 'var(--color-success)' :
                                  result.sentiment === 'Negative' ? 'var(--color-error)' : 'var(--color-neutral-600)';

            this.showResult('sentimentResult', `
                <div class="results__item">
                    <div class="results__item-title">Sentiment:</div>
                    <div class="results__item-value">
                        <span style="color: ${sentimentColor}; font-weight: var(--font-weight-semibold);">
                            ${result.sentiment}
                        </span>
                    </div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Confidence:</div>
                    <div class="results__item-value">${Math.round(result.confidence * 100)}%</div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Score:</div>
                    <div class="results__item-value">${result.score.toFixed(2)} (Range: -1 to +1)</div>
                </div>
            `);
        } catch (error) {
            this.showError('sentimentResult', 'Failed to analyze sentiment');
        }
    }

    async handleKeyPhraseExtraction(text) {
        this.showLoading('keyPhrasesResult');
        try {
            const result = await window.AIServices.simulateAPICall('language', 'keyPhrases', text);
            this.showResult('keyPhrasesResult', `
                <div class="results__item">
                    <div class="results__item-title">Key Phrases:</div>
                    <div class="results__item-value">
                        ${result.keyPhrases.map(phrase => `<span class="feature-tag">${phrase}</span>`).join(' ')}
                    </div>
                </div>
            `);
        } catch (error) {
            this.showError('keyPhrasesResult', 'Failed to extract key phrases');
        }
    }

    async handleEntityRecognition(text) {
        this.showLoading('entitiesResult');
        try {
            const result = await window.AIServices.simulateAPICall('language', 'entities', text);
            const entitiesByType = {};
            result.entities.forEach(entity => {
                if (!entitiesByType[entity.type]) {
                    entitiesByType[entity.type] = [];
                }
                entitiesByType[entity.type].push(entity);
            });

            let html = '';
            Object.keys(entitiesByType).forEach(type => {
                html += `
                    <div class="results__item">
                        <div class="results__item-title">${type}:</div>
                        <div class="results__item-value">
                            <ul>
                                ${entitiesByType[type].map(entity =>
                                    `<li>${entity.text} (${Math.round(entity.confidence * 100)}% confidence)</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                `;
            });

            this.showResult('entitiesResult', html);
        } catch (error) {
            this.showError('entitiesResult', 'Failed to recognize entities');
        }
    }

    async handleTranslation(text) {
        const sourceLanguage = document.getElementById('sourceLanguage').value;
        const targetLanguage = document.getElementById('targetLanguage').value;

        this.showTranslationLoading();
        try {
            const result = await window.AIServices.simulateAPICall('translator', 'translate', {
                text, sourceLanguage, targetLanguage
            });

            document.getElementById('translationResult').innerHTML = result.translatedText;
        } catch (error) {
            document.getElementById('translationResult').innerHTML = 'Translation failed. Please try again.';
        }
    }

    async handleTextModeration(text) {
        this.showLoading('moderationResult');
        try {
            const result = await window.AIServices.simulateAPICall('contentSafety', 'textModeration', text);
            const resultColor = result.result === 'Safe' ? 'var(--color-success)' : 'var(--color-error)';

            let categoriesHtml = '';
            Object.keys(result.categories).forEach(category => {
                const cat = result.categories[category];
                const status = cat.filtered ? 'Flagged' : 'Safe';
                const statusColor = cat.filtered ? 'var(--color-error)' : 'var(--color-success)';

                categoriesHtml += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <span style="text-transform: capitalize;">${category}:</span>
                        <span style="color: ${statusColor}; font-weight: var(--font-weight-medium);">
                            ${status} (Level ${cat.severity})
                        </span>
                    </div>
                `;
            });

            this.showResult('moderationResult', `
                <div class="results__item">
                    <div class="results__item-title">Overall Result:</div>
                    <div class="results__item-value">
                        <span style="color: ${resultColor}; font-weight: var(--font-weight-semibold);">
                            ${result.result}
                        </span>
                    </div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Category Analysis:</div>
                    <div class="results__item-value">
                        ${categoriesHtml}
                    </div>
                </div>
            `);
        } catch (error) {
            this.showError('moderationResult', 'Failed to moderate content');
        }
    }

    async handleImageModeration(imageUrl) {
        this.showLoading('imageModerationResult');
        try {
            const result = await window.AIServices.simulateAPICall('contentSafety', 'imageModeration', imageUrl);
            const resultColor = result.result === 'Safe' ? 'var(--color-success)' : 'var(--color-error)';

            let categoriesHtml = '';
            Object.keys(result.categories).forEach(category => {
                const cat = result.categories[category];
                const status = cat.filtered ? 'Flagged' : 'Safe';
                const statusColor = cat.filtered ? 'var(--color-error)' : 'var(--color-success)';

                categoriesHtml += `
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-sm);">
                        <span style="text-transform: capitalize;">${category}:</span>
                        <span style="color: ${statusColor}; font-weight: var(--font-weight-medium);">
                            ${status} (Level ${cat.severity})
                        </span>
                    </div>
                `;
            });

            this.showResult('imageModerationResult', `
                <div class="results__item">
                    <div class="results__item-title">Overall Result:</div>
                    <div class="results__item-value">
                        <span style="color: ${resultColor}; font-weight: var(--font-weight-semibold);">
                            ${result.result}
                        </span>
                    </div>
                </div>
                <div class="results__item">
                    <div class="results__item-title">Category Analysis:</div>
                    <div class="results__item-value">
                        ${categoriesHtml}
                    </div>
                </div>
            `);
        } catch (error) {
            this.showError('imageModerationResult', 'Failed to moderate image');
        }
    }

    // Utility Methods
    showLoading(resultId) {
        const resultElement = document.getElementById(resultId);
        if (resultElement) {
            resultElement.style.display = 'block';
            resultElement.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span>Processing...</span>
                </div>
            `;
        }
    }

    showResult(resultId, content) {
        const resultElement = document.getElementById(resultId);
        if (resultElement) {
            resultElement.style.display = 'block';
            resultElement.innerHTML = `
                <h4 class="results__title">Results:</h4>
                <div class="results__content">${content}</div>
            `;
        }
    }

    showError(resultId, message) {
        const resultElement = document.getElementById(resultId);
        if (resultElement) {
            resultElement.style.display = 'block';
            resultElement.innerHTML = `
                <div class="error">
                    <div class="error__title">Error</div>
                    <div class="error__message">${message}</div>
                </div>
            `;
        }
    }

    showTranslationLoading() {
        const resultElement = document.getElementById('translationResult');
        if (resultElement) {
            resultElement.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <span>Translating...</span>
                </div>
            `;
        }
    }

    getDocumentIntelligenceShowcase() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">Document Intelligence - Secure Translation</h2>
                        <p class="showcase__description">
                            Upload documents and translate them to 130+ languages with enterprise-grade security. Files are stored in private Azure blob storage with managed identity authentication.
                        </p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>

                    <div class="showcase__content showcase__content--fullwidth">
                        <!-- File Upload Section -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">Document Upload & Translation</h3>
                            <p class="demo-section__description">
                                Upload documents (PDF, DOCX, PPTX, etc.) or try our sample documents to see the translation in action
                            </p>

                            <div class="document-intelligence-container">
                                <!-- Sample Documents -->
                                <div class="sample-documents-section" style="margin-bottom: 30px;">
                                    <h4 style="margin-bottom: 15px; color: var(--color-text-primary);">Try Sample Documents</h4>
                                    <div class="sample-documents-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-bottom: 20px;">
                                        <button id="useSampleBusiness" class="sample-doc-btn btn btn--outline" style="text-align: left; padding: 15px; height: auto;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="font-size: 24px;">📊</div>
                                                <div>
                                                    <div style="font-weight: 600; margin-bottom: 5px;">Business Report</div>
                                                    <div style="font-size: 0.875rem; opacity: 0.8;">Financial analysis with charts and tables</div>
                                                </div>
                                            </div>
                                        </button>
                                        <button id="useSampleLegal" class="sample-doc-btn btn btn--outline" style="text-align: left; padding: 15px; height: auto;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="font-size: 24px;">⚖️</div>
                                                <div>
                                                    <div style="font-weight: 600; margin-bottom: 5px;">Legal Contract</div>
                                                    <div style="font-size: 0.875rem; opacity: 0.8;">Complex legal document with clauses</div>
                                                </div>
                                            </div>
                                        </button>
                                        <button id="useSampleTechnical" class="sample-doc-btn btn btn--outline" style="text-align: left; padding: 15px; height: auto;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <div style="font-size: 24px;">🔧</div>
                                                <div>
                                                    <div style="font-weight: 600; margin-bottom: 5px;">Technical Manual</div>
                                                    <div style="font-size: 0.875rem; opacity: 0.8;">User guide with code and images</div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <!-- File Upload Zone -->
                                <div class="upload-section">
                                    <div id="uploadDropZone" class="upload-drop-zone" style="
                                        border: 2px dashed var(--color-border-secondary);
                                        border-radius: 12px;
                                        padding: 40px 20px;
                                        text-align: center;
                                        background: var(--color-bg-secondary);
                                        transition: all 0.3s ease;
                                        cursor: pointer;
                                        margin-bottom: 20px;
                                    ">
                                        <div class="upload-icon" style="font-size: 48px; margin-bottom: 15px;">📄</div>
                                        <h4 style="margin-bottom: 10px; color: var(--color-text-primary);">Drop your document here</h4>
                                        <p style="color: var(--color-text-secondary); margin-bottom: 15px;">
                                            Support for PDF, DOCX, PPTX, XLSX, HTML, TXT, RTF, ODT (max 100MB)
                                        </p>
                                        <button class="btn btn--primary">Browse Files</button>
                                        <input type="file" id="fileInput" style="display: none;" accept=".pdf,.docx,.pptx,.xlsx,.html,.txt,.rtf,.odt">
                                    </div>

                                    <!-- Upload Progress -->
                                    <div id="uploadProgress" class="upload-progress" style="display: none; margin-bottom: 20px;">
                                        <div class="progress-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                            <span class="progress-filename" style="font-weight: 600;"></span>
                                            <span class="progress-percentage">0%</span>
                                        </div>
                                        <div class="progress-bar" style="width: 100%; height: 8px; background: var(--color-bg-secondary); border-radius: 4px; overflow: hidden;">
                                            <div class="progress-fill" style="height: 100%; background: var(--color-primary); width: 0%; transition: width 0.3s ease;"></div>
                                        </div>
                                        <div class="progress-status" style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 5px;"></div>
                                    </div>
                                </div>

                                <!-- Translation Configuration -->
                                <div id="translationConfig" class="translation-config" style="display: none; margin-bottom: 30px;">
                                    <h4 style="margin-bottom: 15px; color: var(--color-text-primary);">Translation Settings</h4>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                        <div>
                                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Target Language</label>
                                            <select id="targetLanguage" class="form-select" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                <option value="">Loading languages...</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style="display: block; margin-bottom: 5px; font-weight: 500;">Source Language</label>
                                            <select id="sourceLanguage" class="form-select" style="width: 100%; padding: 8px 12px; border: 1px solid var(--color-border-primary); border-radius: 6px; background: var(--color-bg-primary);">
                                                <option value="">Auto-detect</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="translation-actions" style="display: flex; gap: 10px; align-items: center;">
                                        <button id="startTranslation" class="btn btn--primary">
                                            Start Translation
                                        </button>
                                        <button id="cancelTranslation" class="btn btn--ghost">
                                            Cancel
                                        </button>
                                    </div>
                                </div>

                                <!-- Translation Progress -->
                                <div id="translationProgress" class="translation-progress" style="display: none; margin-bottom: 30px;">
                                    <h4 style="margin-bottom: 15px; color: var(--color-text-primary);">Translation in Progress</h4>
                                    <div class="translation-status-card" style="background: var(--color-bg-secondary); border-radius: 8px; padding: 20px;">
                                        <div class="status-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                                            <span class="status-text" style="font-weight: 600;">Processing document...</span>
                                            <span class="status-badge" style="padding: 4px 12px; background: var(--color-warning); color: white; border-radius: 12px; font-size: 0.75rem;">RUNNING</span>
                                        </div>
                                        <div class="progress-bar" style="width: 100%; height: 6px; background: var(--color-bg-primary); border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
                                            <div class="progress-fill" style="height: 100%; background: var(--color-primary); width: 0%; transition: width 0.3s ease;"></div>
                                        </div>
                                        <div class="status-details" style="font-size: 0.875rem; color: var(--color-text-secondary);">
                                            <div>Job ID: <span class="job-id">-</span></div>
                                            <div>Documents: <span class="doc-count">0/0</span></div>
                                            <div>Estimated time: <span class="estimated-time">Calculating...</span></div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Translation Results -->
                                <div id="translationResults" class="translation-results" style="display: none;">
                                    <h4 style="margin-bottom: 15px; color: var(--color-text-primary);">Translation Complete</h4>
                                    <div class="results-card" style="background: var(--color-bg-secondary); border-radius: 8px; padding: 20px;">
                                        <div class="result-header" style="display: flex; justify-content: between; align-items: center; margin-bottom: 15px;">
                                            <div>
                                                <div class="result-filename" style="font-weight: 600; margin-bottom: 5px;"></div>
                                                <div class="result-details" style="font-size: 0.875rem; color: var(--color-text-secondary);"></div>
                                            </div>
                                            <div class="success-badge" style="padding: 4px 12px; background: var(--color-success); color: white; border-radius: 12px; font-size: 0.75rem;">COMPLETED</div>
                                        </div>
                                        <div class="result-actions" style="display: flex; gap: 10px;">
                                            <button id="downloadTranslated" class="btn btn--primary">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 8px;">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
                                                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2"/>
                                                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
                                                </svg>
                                                Download Translated Document
                                            </button>
                                            <button id="translateAnother" class="btn btn--outline">
                                                Translate Another Document
                                            </button>
                                        </div>
                                        <div class="download-info" style="margin-top: 15px; padding: 10px; background: var(--color-bg-tertiary); border-radius: 6px; font-size: 0.875rem; color: var(--color-text-secondary);">
                                            🔐 Download link expires in <span class="expiry-time">1 hour</span> for security
                                        </div>
                                    </div>
                                </div>

                                <!-- Error State -->
                                <div id="translationError" class="translation-error" style="display: none;">
                                    <div class="error-card" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px;">
                                        <div class="error-header" style="display: flex; align-items: center; margin-bottom: 10px;">
                                            <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                                            <span style="font-weight: 600; color: var(--color-error);">Translation Failed</span>
                                        </div>
                                        <div class="error-message" style="margin-bottom: 15px; color: var(--color-text-secondary);"></div>
                                        <button id="retryTranslation" class="btn btn--primary">Try Again</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Translation History -->
                        <div class="demo-section demo-card">
                            <h3 class="demo-section__title">Translation History</h3>
                            <p class="demo-section__description">
                                View and re-download your recent translations
                            </p>

                            <div id="translationHistory" class="translation-history">
                                <div class="history-empty" style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                                    <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
                                    <p>No translations yet. Upload a document to get started!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupDocumentIntelligenceListeners() {
        // File upload listeners
        this.setupFileUploadListeners();

        // Sample document listeners
        this.setupSampleDocumentListeners();

        // Translation listeners
        this.setupTranslationListeners();

        // Load supported languages
        this.loadSupportedLanguages();
    }

    setupFileUploadListeners() {
        const dropZone = document.getElementById('uploadDropZone');
        const fileInput = document.getElementById('fileInput');

        if (!dropZone || !fileInput) return;

        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--color-primary)';
            dropZone.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--color-border-secondary)';
            dropZone.style.backgroundColor = 'var(--color-bg-secondary)';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--color-border-secondary)';
            dropZone.style.backgroundColor = 'var(--color-bg-secondary)';

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileUpload(files[0]);
            }
        });

        // Click to upload
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
    }

    setupSampleDocumentListeners() {
        const sampleButtons = ['useSampleBusiness', 'useSampleLegal', 'useSampleTechnical'];

        sampleButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    this.handleSampleDocument(buttonId);
                });
            }
        });
    }

    setupTranslationListeners() {
        const startBtn = document.getElementById('startTranslation');
        const cancelBtn = document.getElementById('cancelTranslation');
        const downloadBtn = document.getElementById('downloadTranslated');
        const retryBtn = document.getElementById('retryTranslation');
        const anotherBtn = document.getElementById('translateAnother');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startTranslation();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelTranslation();
            });
        }

        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadTranslatedDocument();
            });
        }

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryTranslation();
            });
        }

        if (anotherBtn) {
            anotherBtn.addEventListener('click', () => {
                this.resetInterface();
            });
        }
    }

    async loadSupportedLanguages() {
        try {
            const response = await fetch('/api/document-intelligence/languages');
            const data = await response.json();

            if (data.translation) {
                this.populateLanguageSelectors(data.translation);
            }
        } catch (error) {
            console.error('Failed to load supported languages:', error);
        }
    }

    populateLanguageSelectors(languages) {
        const targetSelect = document.getElementById('targetLanguage');
        const sourceSelect = document.getElementById('sourceLanguage');

        if (!targetSelect || !sourceSelect) return;

        // Clear existing options
        targetSelect.innerHTML = '<option value="">Select target language...</option>';
        sourceSelect.innerHTML = '<option value="">Auto-detect</option>';

        // Popular languages first
        const popularLanguages = {
            'es': languages['es'],
            'fr': languages['fr'],
            'de': languages['de'],
            'it': languages['it'],
            'pt': languages['pt'],
            'zh-Hans': languages['zh-Hans'],
            'ja': languages['ja'],
            'ko': languages['ko'],
            'ru': languages['ru'],
            'ar': languages['ar']
        };

        // Add popular languages
        Object.entries(popularLanguages).forEach(([code, lang]) => {
            if (lang) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${lang.name} (${lang.nativeName})`;
                targetSelect.appendChild(option);

                const sourceOption = option.cloneNode(true);
                sourceSelect.appendChild(sourceOption);
            }
        });

        // Add separator
        const separator = document.createElement('option');
        separator.disabled = true;
        separator.textContent = '──────────────────────';
        targetSelect.appendChild(separator);

        const sourceSeparator = separator.cloneNode(true);
        sourceSelect.appendChild(sourceSeparator);

        // Add all other languages
        Object.entries(languages).forEach(([code, lang]) => {
            if (!popularLanguages[code]) {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = `${lang.name} (${lang.nativeName})`;
                targetSelect.appendChild(option);

                const sourceOption = option.cloneNode(true);
                sourceSelect.appendChild(sourceOption);
            }
        });
    }

    async handleFileUpload(file) {
        // Validate file
        const validation = await this.validateFile(file);
        if (!validation.valid) {
            this.showError(validation.errors.join(', '));
            return;
        }

        // Show upload progress
        this.showUploadProgress(file);

        try {
            // Upload file
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/document-intelligence/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.currentFile = {
                    name: file.name,
                    blobName: result.blob_name,
                    size: result.file_size
                };
                this.showUploadSuccess(result);
            } else {
                throw new Error(result.error || 'Upload failed');
            }
        } catch (error) {
            this.showError(`Upload failed: ${error.message}`);
        }
    }

    async validateFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/document-intelligence/validate', {
                method: 'POST',
                body: formData
            });

            return await response.json();
        } catch (error) {
            return {
                valid: false,
                errors: [`Validation failed: ${error.message}`]
            };
        }
    }

    handleSampleDocument(buttonId) {
        const sampleDocs = {
            'useSampleBusiness': {
                name: 'business-report-sample.docx',
                description: 'Q4 Financial Analysis Report with charts and data tables'
            },
            'useSampleLegal': {
                name: 'legal-contract-sample.docx',
                description: 'Software License Agreement with terms and conditions'
            },
            'useSampleTechnical': {
                name: 'technical-manual-sample.docx',
                description: 'API Documentation with code examples and diagrams'
            }
        };

        const doc = sampleDocs[buttonId];
        if (doc) {
            this.currentFile = {
                name: doc.name,
                blobName: doc.name, // Assume samples are pre-uploaded
                size: 'Sample document',
                isSample: true
            };
            this.showTranslationConfig();
        }
    }

    showUploadProgress(file) {
        const progressDiv = document.getElementById('uploadProgress');
        const filename = progressDiv.querySelector('.progress-filename');
        const percentage = progressDiv.querySelector('.progress-percentage');
        const fill = progressDiv.querySelector('.progress-fill');
        const status = progressDiv.querySelector('.progress-status');

        filename.textContent = file.name;
        progressDiv.style.display = 'block';

        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                status.textContent = 'Upload complete!';
            }

            percentage.textContent = `${Math.round(progress)}%`;
            fill.style.width = `${progress}%`;

            if (progress < 100) {
                status.textContent = 'Uploading document...';
            }
        }, 200);
    }

    showUploadSuccess(result) {
        const progressDiv = document.getElementById('uploadProgress');
        const filename = progressDiv.querySelector('.progress-filename');
        const percentage = progressDiv.querySelector('.progress-percentage');
        const fill = progressDiv.querySelector('.progress-fill');
        const status = progressDiv.querySelector('.progress-status');

        // Show 100% completion
        percentage.textContent = '100%';
        fill.style.width = '100%';
        status.textContent = `✅ Upload successful! File: ${result.blob_name}`;

        // Auto-transition to translation config after showing success
        setTimeout(() => {
            this.showTranslationConfig();
        }, 2000);
    }

    showTranslationConfig() {
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('translationConfig').style.display = 'block';
    }

    async startTranslation() {
        const targetLang = document.getElementById('targetLanguage').value;
        const sourceLang = document.getElementById('sourceLanguage').value;

        if (!targetLang) {
            this.showError('Please select a target language');
            return;
        }

        if (!this.currentFile) {
            this.showError('Please upload a file first');
            return;
        }

        try {
            // Hide config, show progress
            document.getElementById('translationConfig').style.display = 'none';
            document.getElementById('translationProgress').style.display = 'block';

            // Start translation
            const response = await fetch('/api/document-intelligence/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    source_blob_name: this.currentFile.blobName,
                    translation_config: {
                        target_language: targetLang,
                        source_language: sourceLang || null
                    }
                })
            });

            const result = await response.json();

            if (result.success || result.job_id) {
                this.currentJobId = result.job_id;
                this.pollTranslationStatus();
            } else {
                throw new Error(result.error || 'Translation failed to start');
            }
        } catch (error) {
            this.showError(`Translation failed: ${error.message}`);
        }
    }

    async pollTranslationStatus() {
        if (!this.currentJobId) return;

        try {
            const response = await fetch(`/api/document-intelligence/job/${this.currentJobId}`);
            const job = await response.json();

            this.updateTranslationProgress(job);

            if (job.status === 'completed') {
                this.showTranslationResults(job);
            } else if (job.status === 'failed') {
                this.showError(job.error_details ? job.error_details.join(', ') : 'Translation failed');
            } else if (job.status === 'running' || job.status === 'pending') {
                // Continue polling
                setTimeout(() => this.pollTranslationStatus(), 3000);
            }
        } catch (error) {
            this.showError(`Status check failed: ${error.message}`);
        }
    }

    updateTranslationProgress(job) {
        const statusText = document.querySelector('.translation-progress .status-text');
        const progressFill = document.querySelector('.translation-progress .progress-fill');
        const jobIdSpan = document.querySelector('.job-id');
        const docCount = document.querySelector('.doc-count');

        if (statusText) {
            statusText.textContent = `${job.status.charAt(0).toUpperCase() + job.status.slice(1)} - ${Math.round(job.progress_percentage)}% complete`;
        }

        if (progressFill) {
            progressFill.style.width = `${job.progress_percentage}%`;
        }

        if (jobIdSpan) {
            jobIdSpan.textContent = job.job_id;
        }

        if (docCount) {
            docCount.textContent = `${job.documents_completed}/${job.documents_total}`;
        }
    }

    showTranslationResults(job) {
        document.getElementById('translationProgress').style.display = 'none';
        document.getElementById('translationResults').style.display = 'block';

        const filename = document.querySelector('.result-filename');
        const details = document.querySelector('.result-details');

        if (filename && this.currentFile) {
            filename.textContent = `translated_${this.currentFile.name}`;
        }

        if (details) {
            details.textContent = `Translated to ${job.target_language.toUpperCase()} • Completed ${new Date().toLocaleString()}`;
        }

        // Store download info
        this.currentTranslation = {
            jobId: job.job_id,
            targetBlob: job.target_blob,
            filename: `translated_${this.currentFile.name}`
        };
    }

    async downloadTranslatedDocument() {
        if (!this.currentTranslation) return;

        try {
            const response = await fetch(`/api/document-intelligence/download/${this.currentTranslation.targetBlob}`);
            const result = await response.json();

            if (result.success) {
                // Create download link
                const link = document.createElement('a');
                link.href = result.download_url;
                link.download = this.currentTranslation.filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                throw new Error(result.error || 'Download failed');
            }
        } catch (error) {
            this.showError(`Download failed: ${error.message}`);
        }
    }

    resetInterface() {
        // Hide all sections
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('translationConfig').style.display = 'none';
        document.getElementById('translationProgress').style.display = 'none';
        document.getElementById('translationResults').style.display = 'none';
        document.getElementById('translationError').style.display = 'none';

        // Reset file input
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';

        // Clear current file and job
        this.currentFile = null;
        this.currentJobId = null;
        this.currentTranslation = null;
    }

    showError(message) {
        const errorDiv = document.getElementById('translationError');
        const errorMessage = errorDiv.querySelector('.error-message');

        if (errorMessage) {
            errorMessage.textContent = message;
        }

        // Hide other sections
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('translationConfig').style.display = 'none';
        document.getElementById('translationProgress').style.display = 'none';
        document.getElementById('translationResults').style.display = 'none';

        errorDiv.style.display = 'block';
    }

    retryTranslation() {
        document.getElementById('translationError').style.display = 'none';
        if (this.currentFile) {
            this.showTranslationConfig();
        } else {
            this.resetInterface();
        }
    }

    cancelTranslation() {
        if (this.currentJobId) {
            fetch(`/api/document-intelligence/job/${this.currentJobId}`, {
                method: 'DELETE'
            }).catch(console.error);
        }
        this.resetInterface();
    }
}

// Add additional CSS for showcase components
const showcaseStyle = document.createElement('style');
showcaseStyle.textContent = `
    /* Demo Card Styling for Visual Separation */
    .demo-card {
        background: var(--color-bg-primary);
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        margin-bottom: var(--spacing-xl);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.3s ease;
    }

    .demo-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .demo-card .demo-section__title {
        margin-top: 0;
        padding-bottom: var(--spacing-md);
        border-bottom: 2px solid var(--color-border-secondary);
        margin-bottom: var(--spacing-md);
    }

    .demo-card .demo-section__description {
        margin-bottom: var(--spacing-lg);
    }

    /* Adjust containers within demo-cards to avoid double borders */
    .demo-card .text-generation-container,
    .demo-card .realtime-container {
        border: none;
        padding: 0;
        background: transparent;
    }

    .demo-card .text-generation-output,
    .demo-card .realtime-output {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        margin-bottom: var(--spacing-md);
    }

    .chat-container {
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: var(--color-bg-primary);
    }

    /* Speech Recognition Styles */
    .speech-recognition-container {
        /* Removed border since parent has demo-card styling */
        padding: 0;
        background: transparent;
    }

    .speech-recognition-output {
        min-height: 150px;
        max-height: 300px;
        overflow-y: auto;
        padding: var(--spacing-md);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
    }

    .speech-recognition-message {
        margin-bottom: var(--spacing-sm);
        line-height: var(--line-height-relaxed);
    }

    .speech-recognition-controls {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .speech-actions {
        display: flex;
        gap: var(--spacing-md);
        flex-wrap: wrap;
        align-items: center;
    }

    .recording-indicator {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: rgba(255, 0, 0, 0.1);
        border: 1px solid rgba(255, 0, 0, 0.3);
        border-radius: var(--radius-md);
        color: var(--color-error);
        font-weight: var(--font-weight-medium);
    }

    .recording-pulse {
        width: 12px;
        height: 12px;
        background: var(--color-error);
        border-radius: 50%;
        animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
        }
    }

    /* ChatGPT-style button positioning */
    .text-generation-input .chatgpt-actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        justify-content: flex-start;
        align-items: center;
        padding-top: 4px;
    }

    .text-generation-input .chatgpt-actions .btn {
        padding: 8px 14px;
        font-size: 13px;
        border-radius: 20px;
        transition: all 0.2s ease;
        font-weight: 500;
        min-height: auto;
        height: auto;
        line-height: 1.2;
    }

    .text-generation-input .chatgpt-actions .btn--outline {
        background-color: transparent;
        border: 1px solid var(--color-border-secondary);
        color: var(--color-text-secondary);
    }

    .text-generation-input .chatgpt-actions .btn--outline:hover {
        background-color: var(--color-bg-secondary);
        border-color: var(--color-border-primary);
        color: var(--color-text-primary);
        transform: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .text-generation-input .chatgpt-actions .btn--ghost {
        background-color: transparent;
        border: 1px solid transparent;
        color: var(--color-text-secondary);
    }

    .text-generation-input .chatgpt-actions .btn--ghost:hover {
        background-color: var(--color-bg-secondary);
        color: var(--color-text-primary);
        transform: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    /* Improve the input area styling to match ChatGPT */
    .text-generation-input {
        background: var(--color-bg-primary);
        border-top: 1px solid var(--color-border-secondary);
        padding: var(--spacing-lg);
    }

    .chat-messages {
        height: 300px;
        overflow-y: auto;
        padding: var(--spacing-lg);
        background: var(--color-bg-secondary);
    }

    .chat-message {
        margin-bottom: var(--spacing-md);
        display: flex;
    }

    .chat-message--user {
        justify-content: flex-end;
    }

    .chat-message--ai {
        justify-content: flex-start;
    }

    .chat-message__content {
        max-width: 70%;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-lg);
        line-height: var(--line-height-relaxed);
    }

    .chat-message--user .chat-message__content {
        background: var(--color-primary);
        color: var(--color-text-inverse);
        border-bottom-right-radius: var(--radius-sm);
    }

    .chat-message--ai .chat-message__content {
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
        border: 1px solid var(--color-border-secondary);
        border-bottom-left-radius: var(--radius-sm);
    }

    .chat-input {
        display: flex;
        padding: var(--spacing-md);
        gap: var(--spacing-sm);
        background: var(--color-bg-primary);
    }

    .chat-input__field {
        flex: 1;
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        padding: var(--spacing-sm) var(--spacing-md);
    }

    /* AI Chat Interface button styling - make them compact like Use Sample buttons */
    .demo-container .chatgpt-actions {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        justify-content: flex-start;
        align-items: center;
        padding-top: 4px;
    }

    .demo-container .chatgpt-actions .btn {
        padding: 8px 14px;
        font-size: 13px;
        border-radius: 20px;
        transition: all 0.2s ease;
        font-weight: 500;
        min-height: auto;
        height: auto;
        line-height: 1.2;
    }

    .demo-container .chatgpt-actions .btn--outline {
        background-color: transparent;
        border: 1px solid var(--color-border-secondary);
        color: var(--color-text-secondary);
    }

    .demo-container .chatgpt-actions .btn--outline:hover {
        background-color: var(--color-bg-secondary);
        border-color: var(--color-border-primary);
        color: var(--color-text-primary);
        transform: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .demo-container .chatgpt-actions .btn--ghost {
        background-color: transparent;
        border: 1px solid transparent;
        color: var(--color-text-secondary);
    }

    .demo-container .chatgpt-actions .btn--ghost:hover {
        background-color: var(--color-bg-secondary);
        color: var(--color-text-primary);
        transform: none;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .translation-interface {
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-lg);
        overflow: hidden;
    }

    .translation-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background: var(--color-bg-secondary);
        border-bottom: 1px solid var(--color-border-secondary);
    }

    .language-selector {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .language-selector label {
        font-weight: var(--font-weight-medium);
        color: var(--color-text-primary);
    }

    .language-selector select {
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--color-border-primary);
        border-radius: var(--radius-md);
        background: var(--color-bg-primary);
    }

    .translation-panels {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .translation-panel {
        padding: var(--spacing-lg);
    }

    .translation-panel:first-child {
        border-right: 1px solid var(--color-border-secondary);
    }

    .translation-input {
        width: 100%;
        min-height: 150px;
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        resize: vertical;
        font-family: inherit;
        margin-bottom: var(--spacing-md);
    }

    .translation-output {
        min-height: 150px;
        padding: var(--spacing-md);
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        color: var(--color-text-primary);
        line-height: var(--line-height-relaxed);
    }

    .panel-actions {
        display: flex;
        gap: var(--spacing-sm);
    }

    .audio-controls {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
    }

    .voice-select {
        padding: var(--spacing-sm) var(--spacing-md);
        border: 1px solid var(--color-border-primary);
        border-radius: var(--radius-md);
        background: var(--color-bg-primary);
        margin-right: var(--spacing-md);
    }

    /* Simplified AI Response Styles */
    .ai-response-item {
        position: relative;
        padding-right: 40px;
    }
    
    .ai-response-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-sm);
    }
    
    .simple-copy-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: transparent;
        border: 1px solid var(--color-border-secondary);
        cursor: pointer;
        padding: 6px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        transition: all 0.2s ease;
        opacity: 0.7;
    }
    
    .simple-copy-btn:hover {
        opacity: 1;
        background: var(--color-bg-secondary);
        border-color: var(--color-primary);
    }
    
    .simple-copy-btn.copied {
        background: var(--color-success);
        border-color: var(--color-success);
        color: white;
        opacity: 1;
    }
    
    .ai-response-content {
        margin-top: var(--spacing-xs);
        line-height: var(--line-height-relaxed);
    }
    
    /* Code Block Styles */
    .code-block-wrapper {
        margin: var(--spacing-md) 0;
        border: 1px solid var(--color-border-secondary);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--color-bg-secondary);
    }
    
    .code-block-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-md);
        background: var(--color-bg-tertiary);
        border-bottom: 1px solid var(--color-border-secondary);
    }
    
    .code-language {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
        font-weight: var(--font-weight-medium);
        text-transform: uppercase;
    }
    
    .copy-code-btn {
        background: transparent;
        border: 1px solid var(--color-border-secondary);
        color: var(--color-text-secondary);
        cursor: pointer;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: all 0.2s ease;
    }
    
    .copy-code-btn:hover {
        background: var(--color-bg-primary);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }
    
    .copy-code-btn.copied {
        background: var(--color-success);
        border-color: var(--color-success);
        color: white;
    }
    
    .code-block {
        margin: 0;
        padding: var(--spacing-md);
        overflow-x: auto;
        background: #1e1e1e;
    }
    
    .code-block code {
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #d4d4d4;
    }
    
    /* Inline Code Styles */
    .inline-code {
        background: var(--color-bg-tertiary);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 0.9em;
        color: var(--color-primary);
        border: 1px solid var(--color-border-secondary);
    }
    
    /* Syntax Highlighting Colors */
    .language-javascript,
    .language-js {
        color: #f7df1e;
    }
    
    .language-python,
    .language-py {
        color: #3776ab;
    }
    
    .language-html {
        color: #e34c26;
    }
    
    .language-css {
        color: #1572b6;
    }
    
    .language-json {
        color: #90a959;
    }
    
    .language-sql {
        color: #4479a1;
    }
    
    .language-bash,
    .language-shell {
        color: #4eaa25;
    }

    @media (max-width: 768px) {
        .translation-panels {
            grid-template-columns: 1fr;
        }

        .translation-panel:first-child {
            border-right: none;
            border-bottom: 1px solid var(--color-border-secondary);
        }

        .translation-controls {
            flex-direction: column;
            align-items: stretch;
        }

        .audio-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .message-container {
            margin-bottom: var(--spacing-md);
        }
        
        .message-content {
            padding: var(--spacing-sm) var(--spacing-md);
        }
        
        .code-block {
            padding: var(--spacing-sm);
        }
    }
`;
document.head.appendChild(showcaseStyle);

// Initialize and export
window.ServiceShowcase = new ServiceShowcase();
