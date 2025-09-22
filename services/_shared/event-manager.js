/**
 * Event Manager Utility
 * Provides common event handling patterns for AI service showcases
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Add event listener with automatic cleanup
     */
    addListener(element, event, handler, options = {}) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }

        if (!element) {
            console.warn('EventManager: Element not found for listener');
            return null;
        }

        const listenerId = this.generateListenerId();
        element.addEventListener(event, handler, options);

        this.listeners.set(listenerId, {
            element,
            event,
            handler,
            options
        });

        return listenerId;
    }

    /**
     * Remove specific event listener
     */
    removeListener(listenerId) {
        const listener = this.listeners.get(listenerId);
        if (listener) {
            listener.element.removeEventListener(listener.event, listener.handler, listener.options);
            this.listeners.delete(listenerId);
        }
    }

    /**
     * Remove all event listeners
     */
    removeAllListeners() {
        for (const [id, listener] of this.listeners) {
            listener.element.removeEventListener(listener.event, listener.handler, listener.options);
        }
        this.listeners.clear();
    }

    /**
     * Setup form submission handler
     */
    setupFormSubmission(formSelector, submitHandler) {
        const form = document.querySelector(formSelector);
        if (!form) return null;

        const handler = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            submitHandler(data, form);
        };

        return this.addListener(form, 'submit', handler);
    }

    /**
     * Setup button click handler with loading state
     */
    setupButtonWithLoading(buttonSelector, clickHandler, loadingText = 'Processing...') {
        const button = document.querySelector(buttonSelector);
        if (!button) return null;

        const originalText = button.textContent;

        const handler = async (e) => {
            e.preventDefault();

            if (button.disabled) return;

            // Set loading state
            button.disabled = true;
            button.textContent = loadingText;

            try {
                await clickHandler(e, button);
            } finally {
                // Reset button state
                button.disabled = false;
                button.textContent = originalText;
            }
        };

        return this.addListener(button, 'click', handler);
    }

    /**
     * Setup file upload handler
     */
    setupFileUpload(inputSelector, uploadHandler, options = {}) {
        const input = document.querySelector(inputSelector);
        if (!input) return null;

        const {
            allowedTypes = [],
            maxSize = 10 * 1024 * 1024, // 10MB default
            multiple = false
        } = options;

        const handler = (e) => {
            const files = Array.from(e.target.files);

            // Validate files
            for (const file of files) {
                if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                    alert(`File type ${file.type} is not allowed`);
                    return;
                }

                if (file.size > maxSize) {
                    alert(`File ${file.name} is too large. Maximum size is ${this.formatFileSize(maxSize)}`);
                    return;
                }
            }

            uploadHandler(multiple ? files : files[0], input);
        };

        return this.addListener(input, 'change', handler);
    }

    /**
     * Setup drag and drop file handler
     */
    setupDragAndDrop(containerSelector, dropHandler, options = {}) {
        const container = document.querySelector(containerSelector);
        if (!container) return [];

        const {
            allowedTypes = [],
            maxSize = 10 * 1024 * 1024,
            multiple = false,
            dragClass = 'drag-over'
        } = options;

        const listeners = [];

        // Prevent default drag behaviors
        const preventDefaults = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            listeners.push(this.addListener(container, eventName, preventDefaults));
        });

        // Highlight drop area
        const highlight = () => container.classList.add(dragClass);
        const unhighlight = () => container.classList.remove(dragClass);

        listeners.push(this.addListener(container, 'dragenter', highlight));
        listeners.push(this.addListener(container, 'dragover', highlight));
        listeners.push(this.addListener(container, 'dragleave', unhighlight));

        // Handle dropped files
        const handleDrop = (e) => {
            unhighlight();

            const files = Array.from(e.dataTransfer.files);

            // Validate files
            for (const file of files) {
                if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
                    alert(`File type ${file.type} is not allowed`);
                    return;
                }

                if (file.size > maxSize) {
                    alert(`File ${file.name} is too large. Maximum size is ${this.formatFileSize(maxSize)}`);
                    return;
                }
            }

            dropHandler(multiple ? files : files[0]);
        };

        listeners.push(this.addListener(container, 'drop', handleDrop));

        return listeners;
    }

    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Generate unique listener ID
     */
    generateListenerId() {
        return 'listener_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Debounce function for limiting rapid events
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for limiting event frequency
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Make available globally
window.EventManager = EventManager;