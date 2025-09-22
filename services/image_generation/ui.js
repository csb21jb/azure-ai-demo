/**
 * Image Generation Service - UI Module
 * Handles all UI interactions for Azure OpenAI DALL-E 3 image generation
 */

class ImageGenerationUI {
    constructor() {
        this.apiBaseUrl = '/api/image-generation';
        this.currentImage = null;
        this.isGenerating = false;
        this.samples = [];
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
        
        // Load sample prompts
        await this.loadSamples();
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
     * Load sample prompts
     */
    async loadSamples() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/samples`);
            const result = await response.json();
            if (result.success) {
                this.samples = result.data.samples;
            }
        } catch (error) {
            console.error('Failed to load samples:', error);
        }
    }

    /**
     * Show configuration warning
     */
    showConfigurationWarning() {
        const warningHtml = `
            <div class="alert alert-warning">
                <strong>Configuration Required:</strong> 
                Azure OpenAI Image Generation service is not properly configured. 
                Please check your environment variables.
            </div>
        `;
        // Insert warning at the top of the service container
        const container = document.querySelector('.service-image-generation-container');
        if (container) {
            container.insertAdjacentHTML('afterbegin', warningHtml);
        }
    }

    /**
     * Generate image from prompt
     */
    async generateImage(prompt, options = {}) {
        if (this.isGenerating) {
            return;
        }

        if (!prompt || prompt.trim().length < 5) {
            this.showError('Please enter a prompt with at least 5 characters.');
            return;
        }

        this.isGenerating = true;
        this.showGenerating();

        try {
            const requestBody = {
                prompt: prompt.trim(),
                size: options.size || "1024x1024",
                quality: options.quality || "standard",
                style: options.style || "vivid",
                n: 1
            };

            const response = await fetch(`${this.apiBaseUrl}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (result.success) {
                this.currentImage = result.data;
                this.displayImage(result.data);
            } else {
                throw new Error(result.error || 'Failed to generate image');
            }

        } catch (error) {
            console.error('Image generation error:', error);
            this.showError(error.message || 'Failed to generate image. Please try again.');
        } finally {
            this.isGenerating = false;
            this.hideGenerating();
        }
    }

    /**
     * Display generated image
     */
    displayImage(imageData) {
        const container = document.getElementById('imageGenerationOutput');
        if (!container) return;

        const imageHtml = `
            <div class="generated-image-container">
                <div class="generated-image-header">
                    <h4>Generated Image</h4>
                    <div class="image-actions">
                        <button onclick="window.imageGenUI.downloadImage()" class="btn btn--outline btn--small">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7,10 12,15 17,10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                        </button>
                        <button onclick="window.imageGenUI.regenerateImage()" class="btn btn--primary btn--small">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="23,4 23,10 17,10"/>
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                            </svg>
                            Regenerate
                        </button>
                    </div>
                </div>
                <div class="generated-image-display">
                    <img src="${imageData.image_url}" alt="${imageData.prompt}" class="generated-image" />
                </div>
                <div class="generated-image-details">
                    <div class="image-metadata">
                        <span class="metadata-item"><strong>Prompt:</strong> ${imageData.prompt}</span>
                        <span class="metadata-item"><strong>Size:</strong> ${imageData.size}</span>
                        <span class="metadata-item"><strong>Quality:</strong> ${imageData.quality}</span>
                        <span class="metadata-item"><strong>Style:</strong> ${imageData.style}</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = imageHtml;
    }

    /**
     * Show generating state
     */
    showGenerating() {
        const container = document.getElementById('imageGenerationOutput');
        const button = document.getElementById('generateImageBtn');
        
        if (container) {
            container.innerHTML = `
                <div class="generating-state">
                    <div class="generating-animation">
                        <div class="spinner"></div>
                    </div>
                    <h4>Generating Image...</h4>
                    <p>This may take 10-30 seconds. Please wait.</p>
                </div>
            `;
        }
        
        if (button) {
            button.disabled = true;
            button.innerHTML = `
                <div class="spinner-small"></div>
                Generating...
            `;
        }
    }

    /**
     * Hide generating state
     */
    hideGenerating() {
        const button = document.getElementById('generateImageBtn');
        if (button) {
            button.disabled = false;
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                </svg>
                Generate Image
            `;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById('imageGenerationOutput');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h4>Generation Failed</h4>
                    <p>${message}</p>
                    <button onclick="window.imageGenUI.clearOutput()" class="btn btn--outline">Try Again</button>
                </div>
            `;
        }
    }

    /**
     * Clear output container
     */
    clearOutput() {
        const container = document.getElementById('imageGenerationOutput');
        if (container) {
            container.innerHTML = `
                <div class="image-placeholder">
                    <div class="placeholder-icon">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21,15 16,10 5,21"/>
                        </svg>
                    </div>
                    <h4>Ready to Generate</h4>
                    <p>Enter a prompt above to create your image</p>
                </div>
            `;
        }
    }

    /**
     * Use sample prompt
     */
    useSample(prompt) {
        const input = document.getElementById('imagePrompt');
        if (input) {
            input.value = prompt;
            input.focus();
        }
    }

    /**
     * Download generated image
     */
    async downloadImage() {
        if (!this.currentImage || !this.currentImage.image_url) {
            return;
        }

        try {
            const response = await fetch(this.currentImage.image_url);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try right-clicking and saving the image manually.');
        }
    }

    /**
     * Regenerate current image
     */
    regenerateImage() {
        if (!this.currentImage || !this.currentImage.prompt) {
            return;
        }

        const options = {
            size: this.currentImage.size,
            quality: this.currentImage.quality,
            style: this.currentImage.style
        };

        this.generateImage(this.currentImage.prompt, options);
    }

    /**
     * Get random sample prompt
     */
    getRandomSample() {
        if (this.samples.length === 0) {
            return "A beautiful sunset over mountains";
        }
        
        const randomIndex = Math.floor(Math.random() * this.samples.length);
        return this.samples[randomIndex].prompt;
    }
}

// Initialize the UI when DOM is ready
if (typeof window !== 'undefined') {
    window.imageGenUI = new ImageGenerationUI();
}