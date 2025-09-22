/**
 * Azure OpenAI Service - UI Module
 * Handles all UI interactions for Azure OpenAI service
 */

class AzureOpenAIUI {
    constructor() {
        this.apiBaseUrl = '/api/openai';
        this.currentAssistant = null;
        this.currentThread = null;
    }

    /**
     * Initialize the service UI
     */
    async initialize() {
        // Check service configuration
        const health = await this.checkHealth();
        if (!health.configured) {
            this.showConfigurationWarning();
        }
    }

    /**
     * Check service health
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { configured: false };
        }
    }

    /**
     * Show configuration warning
     */
    showConfigurationWarning() {
        const warningHtml = `
            <div class="alert alert-warning">
                <strong>Configuration Required:</strong> 
                Azure OpenAI service is not properly configured. 
                Please check your environment variables.
            </div>
        `;
        // Insert warning at the top of the service container
        const container = document.querySelector('.service-openai-container');
        if (container) {
            container.insertAdjacentHTML('afterbegin', warningHtml);
        }
    }

    /**
     * Send chat message
     */
    async sendChatMessage(messages, temperature = 1.0, maxTokens = 1000) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages,
                    temperature,
                    max_tokens: maxTokens
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Chat error:', error);
            throw error;
        }
    }

    /**
     * Create an assistant
     */
    async createAssistant(instructions = "", tools = [], temperature = 1.0) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/assistant/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    instructions,
                    tools,
                    temperature
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentAssistant = data.data.assistant_id;
            return data.data;
        } catch (error) {
            console.error('Assistant creation error:', error);
            throw error;
        }
    }

    /**
     * Create a thread
     */
    async createThread() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/assistant/thread`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.currentThread = data.data.thread_id;
            return data.data;
        } catch (error) {
            console.error('Thread creation error:', error);
            throw error;
        }
    }

    /**
     * Add message to thread
     */
    async addMessage(content, threadId = null) {
        try {
            const thread = threadId || this.currentThread;
            if (!thread) {
                throw new Error('No thread available. Create a thread first.');
            }

            const response = await fetch(`${this.apiBaseUrl}/assistant/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    thread_id: thread,
                    content
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Message error:', error);
            throw error;
        }
    }

    /**
     * Run assistant
     */
    async runAssistant(assistantId = null, threadId = null) {
        try {
            const assistant = assistantId || this.currentAssistant;
            const thread = threadId || this.currentThread;

            if (!assistant || !thread) {
                throw new Error('Assistant and thread are required');
            }

            const response = await fetch(`${this.apiBaseUrl}/assistant/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    assistant_id: assistant,
                    thread_id: thread
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Run error:', error);
            throw error;
        }
    }

    /**
     * Render chat UI
     */
    renderChatUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="openai-chat-container">
                <div class="chat-messages" id="openai-chat-messages">
                    <div class="chat-message assistant">
                        <strong>AI Assistant:</strong> Hello! How can I help you today?
                    </div>
                </div>
                <div class="chat-input-container">
                    <textarea 
                        id="openai-chat-input" 
                        class="chat-input" 
                        placeholder="Type your message..."
                        rows="3"
                    ></textarea>
                    <div class="chat-controls">
                        <button id="openai-send-btn" class="btn btn-primary">Send</button>
                        <button id="openai-clear-btn" class="btn btn-secondary">Clear</button>
                    </div>
                </div>
                <div class="chat-settings">
                    <label>
                        Temperature: 
                        <input type="range" id="temperature-slider" min="0" max="2" step="0.1" value="1">
                        <span id="temperature-value">1.0</span>
                    </label>
                </div>
            </div>
        `;

        this.attachChatEventListeners();
    }

    /**
     * Attach event listeners for chat
     */
    attachChatEventListeners() {
        const sendBtn = document.getElementById('openai-send-btn');
        const clearBtn = document.getElementById('openai-clear-btn');
        const input = document.getElementById('openai-chat-input');
        const tempSlider = document.getElementById('temperature-slider');
        const tempValue = document.getElementById('temperature-value');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearChat());
        }

        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }

        if (tempSlider) {
            tempSlider.addEventListener('input', (e) => {
                tempValue.textContent = e.target.value;
            });
        }
    }

    /**
     * Handle send message
     */
    async handleSendMessage() {
        const input = document.getElementById('openai-chat-input');
        const messagesContainer = document.getElementById('openai-chat-messages');
        const tempSlider = document.getElementById('temperature-slider');
        
        const message = input.value.trim();
        if (!message) return;

        // Add user message to UI
        this.addMessageToUI('user', message);
        input.value = '';

        // Show loading
        this.addMessageToUI('assistant', '...', true);

        try {
            // Prepare messages history
            const messages = this.getMessagesHistory();
            messages.push({ role: 'user', content: message });

            // Send to API
            const response = await this.sendChatMessage(
                messages,
                parseFloat(tempSlider.value)
            );

            // Remove loading and add response
            this.removeLoadingMessage();
            this.addMessageToUI('assistant', response.content);
        } catch (error) {
            this.removeLoadingMessage();
            this.addMessageToUI('assistant', `Error: ${error.message}`);
        }
    }

    /**
     * Get messages history from UI
     */
    getMessagesHistory() {
        const messages = [];
        const messageElements = document.querySelectorAll('.chat-message');
        
        messageElements.forEach(el => {
            if (!el.classList.contains('loading')) {
                const role = el.classList.contains('user') ? 'user' : 'assistant';
                const content = el.textContent.replace(/^(User:|AI Assistant:)\s*/, '');
                messages.push({ role, content });
            }
        });

        return messages.slice(-10); // Keep last 10 messages for context
    }

    /**
     * Add message to UI
     */
    addMessageToUI(role, content, isLoading = false) {
        const messagesContainer = document.getElementById('openai-chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}${isLoading ? ' loading' : ''}`;
        
        const roleLabel = role === 'user' ? 'You' : 'AI Assistant';
        messageDiv.innerHTML = `<strong>${roleLabel}:</strong> ${content}`;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Remove loading message
     */
    removeLoadingMessage() {
        const loadingMessage = document.querySelector('.chat-message.loading');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    /**
     * Clear chat
     */
    clearChat() {
        const messagesContainer = document.getElementById('openai-chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="chat-message assistant">
                    <strong>AI Assistant:</strong> Chat cleared. How can I help you today?
                </div>
            `;
        }
    }

    /**
     * Render assistant UI
     */
    renderAssistantUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="assistant-container">
                <div class="assistant-setup">
                    <h3>Assistant Configuration</h3>
                    <textarea 
                        id="assistant-instructions" 
                        placeholder="Enter assistant instructions..."
                        rows="4"
                        class="form-control"
                    ></textarea>
                    <button id="create-assistant-btn" class="btn btn-primary mt-2">
                        Create Assistant
                    </button>
                </div>
                
                <div class="assistant-chat" style="display: none;">
                    <h3>Assistant Chat</h3>
                    <div class="assistant-info">
                        <span>Assistant ID: <code id="assistant-id"></code></span>
                        <span>Thread ID: <code id="thread-id"></code></span>
                    </div>
                    <div class="chat-messages" id="assistant-messages"></div>
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="assistant-input" 
                            placeholder="Ask your assistant..."
                            class="form-control"
                        >
                        <button id="assistant-send-btn" class="btn btn-primary">Send</button>
                    </div>
                </div>
            </div>
        `;

        this.attachAssistantEventListeners();
    }

    /**
     * Attach assistant event listeners
     */
    attachAssistantEventListeners() {
        const createBtn = document.getElementById('create-assistant-btn');
        const sendBtn = document.getElementById('assistant-send-btn');
        
        if (createBtn) {
            createBtn.addEventListener('click', () => this.handleCreateAssistant());
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleAssistantMessage());
        }
    }

    /**
     * Handle create assistant
     */
    async handleCreateAssistant() {
        const instructions = document.getElementById('assistant-instructions').value;
        
        try {
            // Create assistant
            const assistant = await this.createAssistant(instructions);
            
            // Create thread
            const thread = await this.createThread();
            
            // Update UI
            document.getElementById('assistant-id').textContent = assistant.assistant_id;
            document.getElementById('thread-id').textContent = thread.thread_id;
            
            // Show chat interface
            document.querySelector('.assistant-setup').style.display = 'none';
            document.querySelector('.assistant-chat').style.display = 'block';
            
        } catch (error) {
            alert(`Error creating assistant: ${error.message}`);
        }
    }

    /**
     * Handle assistant message
     */
    async handleAssistantMessage() {
        const input = document.getElementById('assistant-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        try {
            // Add message to thread
            await this.addMessage(message);
            
            // Run assistant
            const result = await this.runAssistant();
            
            // Display messages
            this.displayAssistantMessages(result.messages);
            
            input.value = '';
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    /**
     * Display assistant messages
     */
    displayAssistantMessages(messages) {
        const container = document.getElementById('assistant-messages');
        if (!container) return;
        
        container.innerHTML = messages.map(msg => `
            <div class="chat-message ${msg.role}">
                <strong>${msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
                ${msg.content}
            </div>
        `).reverse().join('');
    }
}

// Export for use
window.AzureOpenAIUI = AzureOpenAIUI;