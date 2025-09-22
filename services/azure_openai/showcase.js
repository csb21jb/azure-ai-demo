/**
 * Azure OpenAI Service Showcase
 * Handles text generation, chat, and summarization demonstrations
 */
class AzureOpenAIShowcase extends ShowcaseBase {
    constructor() {
        super('azure_openai');
    }

    /**
     * Get the complete showcase HTML
     */
    getHTML() {
        return `
            <div class="showcase showcase--fullwidth">
                <div class="container">
                    ${this.getShowcaseHeader(
                        'Azure OpenAI Service - Text Generation',
                        'Experience the power of advanced language models for intelligent text generation, chat conversations, and content creation using GPT models'
                    )}
                        ${this.getTextGenerationDemo()}
                        ${this.getChatDemo()}
                        ${this.getSummarizationDemo()}
                    ${this.getShowcaseFooter()}
        `;
    }

    /**
     * Setup service-specific event listeners
     */
    setupEventListeners() {
        super.setupEventListeners();
        this.setupTextGenerationListeners();
        this.setupChatListeners();
        this.setupSummarizationListeners();
    }

    /**
     * Get text generation demo HTML
     */
    getTextGenerationDemo() {
        return `
            <div class="demo-section demo-card">
                <h3 class="demo-section__title">
                    Text Generation (Chat Completions)
                    ${this.getBusinessInfoIcon('text-generation')}
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
        `;
    }

    /**
     * Get chat demo HTML
     */
    getChatDemo() {
        return `
            <div class="demo-section demo-card">
                <h3 class="demo-section__title">
                    AI Chat Interface
                    ${this.getBusinessInfoIcon('ai-chat')}
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
        `;
    }

    /**
     * Get summarization demo HTML
     */
    getSummarizationDemo() {
        return `
            <div class="demo-section demo-card">
                <h3 class="demo-section__title">
                    Content Summarization
                    ${this.getBusinessInfoIcon('content-summarization')}
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
        `;
    }

    /**
     * Setup text generation event listeners
     */
    setupTextGenerationListeners() {
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
                const outputArea = document.getElementById('textGenerationOutput');
                outputArea.innerHTML = `
                    <div class="generated-text-item">
                        <strong>AI Assistant:</strong> Ready to help you generate content. Enter your prompt below to get started!
                    </div>
                `;
                promptInput.value = '';
                promptInput.focus();
            });
        }
    }

    /**
     * Setup chat event listeners
     */
    setupChatListeners() {
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
                const chatMessages = document.getElementById('chatMessages');
                chatMessages.innerHTML = `
                    <div class="chat-message chat-message--ai">
                        <div class="chat-message__content">
                            Hello! I'm your AI assistant. Ask me anything about business, technology, or general topics.
                        </div>
                    </div>
                `;
                chatInput.value = '';
                chatInput.focus();
            });
        }

        if (downloadChatBtn) {
            downloadChatBtn.addEventListener('click', () => {
                this.downloadChatHistory();
            });
        }

        if (copyChatBtn) {
            copyChatBtn.addEventListener('click', () => {
                this.copyChatHistory(copyChatBtn);
            });
        }
    }

    /**
     * Setup summarization event listeners
     */
    setupSummarizationListeners() {
        const summarizeBtn = document.getElementById('summarizeText');
        const summarySampleBtn = document.getElementById('useSummarySample');
        const summaryInput = document.getElementById('summaryText');

        if (summarizeBtn) {
            summarizeBtn.addEventListener('click', async () => {
                const text = summaryInput.value.trim();
                if (!text) return;
                await this.handleSummarization(text);
            });
        }

        if (summaryInput) {
            summaryInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    const text = summaryInput.value.trim();
                    if (!text) return;
                    await this.handleSummarization(text);
                }
            });
        }

        if (summarySampleBtn) {
            summarySampleBtn.addEventListener('click', () => {
                const sampleText = `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of the 21st century, reshaping industries and revolutionizing how we work, communicate, and live. From its humble beginnings in the 1950s as a theoretical concept, AI has evolved into a practical reality that powers everything from smartphone assistants to autonomous vehicles.

The current AI landscape is dominated by machine learning, particularly deep learning neural networks that can process vast amounts of data to identify patterns and make predictions. Companies like Google, Microsoft, Amazon, and OpenAI have invested billions in developing sophisticated AI models that can understand natural language, generate human-like text, recognize images, and even create art and music.

In healthcare, AI is being used to diagnose diseases more accurately than human doctors in some cases, analyze medical images, and accelerate drug discovery. The financial sector leverages AI for fraud detection, algorithmic trading, and risk assessment. Manufacturing industries use AI for predictive maintenance, quality control, and supply chain optimization.

However, the rapid advancement of AI also brings challenges and ethical considerations. Concerns about job displacement, privacy, algorithmic bias, and the potential for misuse have led to calls for regulation and responsible AI development. The debate around AI safety and alignment continues to intensify as systems become more capable and autonomous.

Looking ahead, experts predict that AI will continue to advance rapidly, with potential breakthroughs in areas like artificial general intelligence (AGI), quantum computing integration, and brain-computer interfaces. The key to harnessing AI's benefits while mitigating risks lies in thoughtful development, robust governance frameworks, and ensuring that AI remains aligned with human values and interests.`;

                summaryInput.value = sampleText;
                summaryInput.focus();
            });
        }
    }

    /**
     * Handle text generation request
     */
    async handleTextGeneration(prompt) {
        const outputArea = document.getElementById('textGenerationOutput');
        const promptInput = document.getElementById('textPrompt');

        const aiMessageId = 'msg-' + Date.now();

        // Add user prompt
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
                    temperature: 0.8,
                    max_tokens: 1000
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const formattedContent = this.formatMessageContent(data.data.content);
                loadingDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <strong style="color: var(--color-text-secondary);">AI Assistant:</strong>
                        ${this.getCopyButtonHTML(aiMessageId, 'Copy response')}
                    </div>
                    <div class="ai-response-content" id="${aiMessageId}">${formattedContent}</div>
                `;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Text generation error:', error);
            loadingDiv.innerHTML = '<strong>AI Assistant:</strong> <span class="error-text">Sorry, I encountered an error. Please try again.</span>';
        }

        promptInput.value = '';
        outputArea.scrollTop = outputArea.scrollHeight;
    }

    /**
     * Handle chat message
     */
    async handleChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        if (!message) return;

        this.addChatMessage(message, 'user');
        chatInput.value = '';

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

            const messages = document.getElementById('chatMessages');
            if (messages.lastChild && messages.lastChild.querySelector('.typing-indicator')) {
                messages.removeChild(messages.lastChild);
            }

            if (data.success && data.data) {
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

    /**
     * Handle summarization request
     */
    async handleSummarization(text) {
        const outputArea = document.getElementById('summaryOutput');
        const summaryInput = document.getElementById('summaryText');

        const aiMessageId = 'summary-' + Date.now();

        // Add user text preview
        const userDiv = document.createElement('div');
        userDiv.className = 'generated-text-item';
        const truncatedText = text.length > 200 ? text.substring(0, 200) + '...' : text;
        userDiv.innerHTML = `<strong>Document to summarize:</strong> ${this.escapeHtml(truncatedText)}`;
        outputArea.appendChild(userDiv);

        // Add loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'generated-text-item';
        loadingDiv.id = aiMessageId;
        loadingDiv.innerHTML = '<strong>AI Summarizer:</strong> <div class="typing-indicator"><span></span><span></span><span></span></div>';
        outputArea.appendChild(loadingDiv);

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
                            content: "You are a helpful assistant that creates concise, well-structured summaries of text content. Focus on the key points, main arguments, and important details while maintaining clarity and readability."
                        },
                        {
                            role: "user",
                            content: `Please provide a comprehensive summary of the following text:\n\n${text}`
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 800
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const formattedContent = this.formatMessageContent(data.data.content);
                loadingDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <strong style="color: var(--color-text-secondary);">AI Summarizer:</strong>
                        ${this.getCopyButtonHTML(aiMessageId, 'Copy summary')}
                    </div>
                    <div class="ai-response-content" id="${aiMessageId}">${formattedContent}</div>
                `;
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Summarization error:', error);
            loadingDiv.innerHTML = '<strong>AI Summarizer:</strong> <span class="error-text">Sorry, I encountered an error while summarizing. Please try again.</span>';
        }

        outputArea.scrollTop = outputArea.scrollHeight;
    }

    /**
     * Add chat message to chat interface
     */
    addChatMessage(content, sender) {
        const messages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message--${sender}`;

        if (sender === 'ai' && !content.includes('typing-indicator')) {
            const messageId = 'chat-msg-' + Date.now();
            messageDiv.id = messageId;

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

    /**
     * Download chat history
     */
    downloadChatHistory() {
        const chatMessages = document.getElementById('chatMessages');
        const messages = chatMessages.querySelectorAll('.chat-message');

        let chatContent = 'AI Chat Conversation\n' + '='.repeat(50) + '\n\n';

        messages.forEach(msg => {
            const isUser = msg.classList.contains('chat-message--user');
            const content = msg.querySelector('.chat-message__content').textContent.trim();
            chatContent += `${isUser ? 'User' : 'AI Assistant'}: ${content}\n\n`;
        });

        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-conversation-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Copy chat history to clipboard
     */
    copyChatHistory(button) {
        const chatMessages = document.getElementById('chatMessages');
        const messages = chatMessages.querySelectorAll('.chat-message');

        let chatContent = 'AI Chat Conversation\n' + '='.repeat(50) + '\n\n';

        messages.forEach(msg => {
            const isUser = msg.classList.contains('chat-message--user');
            const contentElement = msg.querySelector('.chat-message__content');

            if (contentElement) {
                let content = '';
                if (!isUser) {
                    const aiResponseContent = contentElement.querySelector('.ai-response-content');
                    if (aiResponseContent) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = aiResponseContent.innerHTML;

                        const copyButtons = tempDiv.querySelectorAll('.copy-code-btn, .copy-message-btn, .simple-copy-btn');
                        copyButtons.forEach(btn => btn.remove());

                        const codeBlocks = tempDiv.querySelectorAll('.code-block code');
                        codeBlocks.forEach(block => {
                            const codeText = block.textContent || block.innerText;
                            const wrapper = block.closest('.code-block-wrapper');
                            if (wrapper) {
                                const textNode = document.createTextNode('\n```\n' + codeText + '\n```\n');
                                wrapper.parentNode.replaceChild(textNode, wrapper);
                            }
                        });

                        const inlineCodes = tempDiv.querySelectorAll('.inline-code');
                        inlineCodes.forEach(code => {
                            const codeText = code.textContent || code.innerText;
                            const textNode = document.createTextNode('`' + codeText + '`');
                            code.parentNode.replaceChild(textNode, code);
                        });

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

        navigator.clipboard.writeText(chatContent).then(() => {
            this.showTemporaryFeedback('Chat conversation copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy conversation:', err);
        });
    }

    /**
     * Format message content with markdown-like styling
     */
    formatMessageContent(content) {
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

        // Convert code blocks with copy functionality
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
            const trimmedCode = code.trim();
            const copyId = 'code-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            return `<div class="code-block-wrapper" style="margin: 16px 0; position: relative;">
                <div class="code-block" style="background: var(--color-bg-secondary); border-radius: 8px; overflow: hidden; border: 1px solid var(--color-border);">
                    <div class="code-header" style="padding: 8px 12px; background: var(--color-bg-tertiary); border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.8rem; color: var(--color-text-secondary);">${language || 'Code'}</span>
                        <button class="copy-code-btn" onclick="navigator.clipboard.writeText(document.getElementById('${copyId}').textContent)" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <pre style="margin: 0; padding: 16px; overflow-x: auto; background: none; color: var(--color-text);"><code id="${copyId}">${trimmedCode}</code></pre>
                </div>
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

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Make available globally
window.AzureOpenAIShowcase = AzureOpenAIShowcase;