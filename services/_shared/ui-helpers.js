/**
 * UI Helpers Utility
 * Common UI components and helpers for AI service showcases
 */
class UIHelpers {
    /**
     * Create a loading spinner element
     */
    static createLoadingSpinner(message = 'Processing...') {
        return `
            <div class="loading-indicator">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Create an error message element
     */
    static createErrorMessage(message) {
        return `
            <div class="error-message">
                <p>❌ ${message}</p>
            </div>
        `;
    }

    /**
     * Create a success message element
     */
    static createSuccessMessage(message) {
        return `
            <div class="success-message">
                <p>✅ ${message}</p>
            </div>
        `;
    }

    /**
     * Create demo section HTML structure
     */
    static createDemoSection(title, description, content, businessInfoFeature = null) {
        const businessIcon = businessInfoFeature ?
            `<button class="business-info-icon" data-feature="${businessInfoFeature}" aria-label="View business implementation scenarios" style="background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; opacity: 0.7; transition: opacity 0.2s; margin-left: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
            </button>` : '';

        return `
            <div class="demo-section demo-card">
                <h3 class="demo-section__title">
                    ${title}
                    ${businessIcon}
                </h3>
                <p class="demo-section__description">${description}</p>
                ${content}
            </div>
        `;
    }

    /**
     * Create input field with label
     */
    static createInputField(id, label, type = 'text', options = {}) {
        const {
            placeholder = '',
            required = false,
            value = '',
            className = '',
            rows = null
        } = options;

        const isTextarea = type === 'textarea';
        const inputElement = isTextarea ?
            `<textarea id="${id}" name="${id}" class="form-control ${className}" placeholder="${placeholder}" ${required ? 'required' : ''} ${rows ? `rows="${rows}"` : ''}>${value}</textarea>` :
            `<input type="${type}" id="${id}" name="${id}" class="form-control ${className}" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>`;

        return `
            <div class="form-group">
                <label for="${id}" class="form-label">${label}</label>
                ${inputElement}
            </div>
        `;
    }

    /**
     * Create button element
     */
    static createButton(text, id = null, options = {}) {
        const {
            type = 'button',
            className = 'btn btn--primary',
            disabled = false,
            onclick = null,
            style = ''
        } = options;

        const idAttr = id ? `id="${id}"` : '';
        const onclickAttr = onclick ? `onclick="${onclick}"` : '';
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <button ${idAttr} type="${type}" class="${className}" ${onclickAttr} ${disabledAttr} style="${style}">
                ${text}
            </button>
        `;
    }

    /**
     * Create file upload area
     */
    static createFileUploadArea(id, acceptedTypes = '', multiple = false) {
        const multipleAttr = multiple ? 'multiple' : '';
        const acceptAttr = acceptedTypes ? `accept="${acceptedTypes}"` : '';

        return `
            <div class="file-upload-area" id="${id}Container">
                <input type="file" id="${id}" class="file-input" ${acceptAttr} ${multipleAttr} style="display: none;">
                <div class="file-upload-zone" onclick="document.getElementById('${id}').click()">
                    <div class="file-upload-icon">📁</div>
                    <p class="file-upload-text">Click to select file or drag and drop</p>
                    <p class="file-upload-hint">Supported formats: ${acceptedTypes || 'All files'}</p>
                </div>
                <div class="file-upload-result" id="${id}Result" style="display: none;"></div>
            </div>
        `;
    }

    /**
     * Create result container
     */
    static createResultContainer(id, title = 'Result') {
        return `
            <div class="result-container">
                <h4 class="result-title">${title}</h4>
                <div class="result-content" id="${id}">
                    <p class="result-placeholder">Results will appear here...</p>
                </div>
            </div>
        `;
    }

    /**
     * Create progress bar
     */
    static createProgressBar(id, label = 'Progress') {
        return `
            <div class="progress-container" id="${id}Container" style="display: none;">
                <label class="progress-label">${label}</label>
                <div class="progress-bar">
                    <div class="progress-fill" id="${id}Fill" style="width: 0%;"></div>
                </div>
                <span class="progress-text" id="${id}Text">0%</span>
            </div>
        `;
    }

    /**
     * Update progress bar
     */
    static updateProgressBar(id, percentage) {
        const container = document.getElementById(`${id}Container`);
        const fill = document.getElementById(`${id}Fill`);
        const text = document.getElementById(`${id}Text`);

        if (container && fill && text) {
            container.style.display = 'block';
            fill.style.width = `${percentage}%`;
            text.textContent = `${Math.round(percentage)}%`;

            if (percentage >= 100) {
                setTimeout(() => {
                    container.style.display = 'none';
                }, 2000);
            }
        }
    }

    /**
     * Create accordion section
     */
    static createAccordion(sections) {
        const accordionItems = sections.map((section, index) => `
            <div class="accordion-item">
                <div class="accordion-header" onclick="UIHelpers.toggleAccordion('accordion-${index}')">
                    <h4 class="accordion-title">${section.title}</h4>
                    <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-content" id="accordion-${index}" style="display: none;">
                    ${section.content}
                </div>
            </div>
        `).join('');

        return `<div class="accordion">${accordionItems}</div>`;
    }

    /**
     * Toggle accordion section
     */
    static toggleAccordion(contentId) {
        const content = document.getElementById(contentId);
        const header = content.previousElementSibling;
        const icon = header.querySelector('.accordion-icon');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.textContent = '▲';
        } else {
            content.style.display = 'none';
            icon.textContent = '▼';
        }
    }

    /**
     * Create tabs component
     */
    static createTabs(tabs, activeTab = 0) {
        const tabHeaders = tabs.map((tab, index) => `
            <button class="tab-header ${index === activeTab ? 'active' : ''}"
                    onclick="UIHelpers.switchTab('${tab.id}', ${index})">
                ${tab.title}
            </button>
        `).join('');

        const tabContents = tabs.map((tab, index) => `
            <div class="tab-content ${index === activeTab ? 'active' : ''}" id="${tab.id}">
                ${tab.content}
            </div>
        `).join('');

        return `
            <div class="tabs-container">
                <div class="tabs-headers">
                    ${tabHeaders}
                </div>
                <div class="tabs-content">
                    ${tabContents}
                </div>
            </div>
        `;
    }

    /**
     * Switch active tab
     */
    static switchTab(activeTabId, activeIndex) {
        const container = document.querySelector('.tabs-container');
        if (!container) return;

        // Update headers
        const headers = container.querySelectorAll('.tab-header');
        headers.forEach((header, index) => {
            header.classList.toggle('active', index === activeIndex);
        });

        // Update content
        const contents = container.querySelectorAll('.tab-content');
        contents.forEach(content => {
            content.classList.remove('active');
        });

        const activeContent = document.getElementById(activeTabId);
        if (activeContent) {
            activeContent.classList.add('active');
        }
    }

    /**
     * Create modal dialog
     */
    static createModal(id, title, content, options = {}) {
        const {
            size = 'medium',
            closable = true,
            actions = []
        } = options;

        const closeButton = closable ?
            `<button class="modal-close" onclick="UIHelpers.closeModal('${id}')">×</button>` : '';

        const actionButtons = actions.map(action =>
            `<button class="btn ${action.className || 'btn--secondary'}" onclick="${action.onclick || ''}">${action.text}</button>`
        ).join('');

        return `
            <div class="modal-overlay" id="${id}" style="display: none;" onclick="UIHelpers.closeModal('${id}')">
                <div class="modal modal--${size}" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        ${closeButton}
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${actions.length > 0 ? `<div class="modal-footer">${actionButtons}</div>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Show modal
     */
    static showModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    static closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Format timestamp for display
     */
    static formatTimestamp(date = new Date()) {
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Truncate text with ellipsis
     */
    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Format file size for display
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Make available globally
window.UIHelpers = UIHelpers;