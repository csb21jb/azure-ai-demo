/**
 * Base Showcase Service Class
 * Provides common functionality for all AI service showcases
 */
class ShowcaseBase {
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.isLoading = false;
    }

    /**
     * Initialize the showcase service
     * Override in child classes for service-specific initialization
     */
    initialize() {
        this.setupEventListeners();
        this.setupBusinessInfoIcons();
    }

    /**
     * Setup base event listeners
     * Override in child classes for service-specific listeners
     */
    setupEventListeners() {
        // Close button
        const closeBtn = document.querySelector('.showcase__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (window.app) {
                    window.app.closeServiceShowcase();
                }
            });
        }
    }

    /**
     * Setup business info icons for modal display
     */
    setupBusinessInfoIcons() {
        const businessInfoIcons = document.querySelectorAll('.business-info-icon');
        businessInfoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const feature = icon.dataset.feature;
                if (feature && window.app) {
                    window.app.showBusinessInfo(feature);
                }
            });
        });
    }

    /**
     * Copy AI response to clipboard
     */
    copyAIResponse(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            const text = messageElement.textContent || messageElement.innerText;
            navigator.clipboard.writeText(text).then(() => {
                this.showTemporaryFeedback('Copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }

    /**
     * Copy chat message to clipboard
     */
    copyChatMessage(messageId) {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            const messageContent = messageElement.querySelector('.message-content');
            const text = messageContent ?
                (messageContent.textContent || messageContent.innerText) :
                (messageElement.textContent || messageElement.innerText);

            navigator.clipboard.writeText(text).then(() => {
                this.showTemporaryFeedback('Message copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    }

    /**
     * Show loading state for a result container
     */
    showLoading(resultId) {
        const container = document.getElementById(resultId);
        if (container) {
            container.innerHTML = `
                <div class="loading-indicator">
                    <div class="loading-spinner"></div>
                    <p>Processing...</p>
                </div>
            `;
        }
    }

    /**
     * Show result content in a container
     */
    showResult(resultId, content) {
        const container = document.getElementById(resultId);
        if (container) {
            container.innerHTML = content;
        }
    }

    /**
     * Show error message in a container
     */
    showError(resultId, message) {
        const container = document.getElementById(resultId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>❌ ${message}</p>
                </div>
            `;
        }
    }

    /**
     * Show temporary feedback message
     */
    showTemporaryFeedback(message, duration = 2000) {
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'temporary-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: opacity 0.3s ease;
        `;

        // Add to document
        document.body.appendChild(feedback);

        // Remove after duration
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, duration);
    }

    /**
     * Generate business info icon HTML
     */
    getBusinessInfoIcon(feature) {
        return `
            <button class="business-info-icon" data-feature="${feature}" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
            </button>
        `;
    }

    /**
     * Generate copy button HTML
     */
    getCopyButtonHTML(targetId, title = "Copy") {
        return `
            <button class="simple-copy-btn" onclick="window.ServiceShowcase.copyAIResponse('${targetId}')" title="${title}" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; opacity: 0.7; transition: opacity 0.2s;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
            </button>
        `;
    }

    /**
     * Generate common showcase header HTML
     */
    getShowcaseHeader(title, description, isFullwidth = true) {
        const fullwidthClass = isFullwidth ? 'showcase--fullwidth' : '';
        return `
            <div class="showcase ${fullwidthClass}">
                <div class="container">
                    <div class="showcase__header">
                        <h2 class="showcase__title">${title}</h2>
                        <p class="showcase__description">${description}</p>
                        <button class="showcase__close btn btn--ghost">✕ Close</button>
                    </div>
                    <div class="showcase__content ${isFullwidth ? 'showcase__content--fullwidth' : ''}">
        `;
    }

    /**
     * Generate common showcase footer HTML
     */
    getShowcaseFooter() {
        return `
                    </div>
                </div>
            </div>
        `;
    }
}

// Make available globally
window.ShowcaseBase = ShowcaseBase;