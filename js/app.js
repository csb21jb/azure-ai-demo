// Microsoft AI Showcase Tool - Main Application
class AIShowcaseApp {
    constructor() {
        this.currentService = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupHeroInteractions();
        this.setupServiceCards();
        this.setupSmoothScrolling();
        this.initializeAnimations();
    }

    setupEventListeners() {
        // Service card clicks
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const service = card.dataset.service;
                this.openServiceShowcase(service);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', (e) => {
                const service = button.dataset.service;
                this.openServiceShowcase(service);
            });
        });

        // Hero search
        const heroSearch = document.getElementById('heroSearch');
        if (heroSearch) {
            heroSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleHeroSearch(heroSearch.value);
                }
            });
        }

        // Search button
        const searchButton = document.querySelector('.search-box__button');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const searchInput = document.getElementById('heroSearch');
                if (searchInput) {
                    this.handleHeroSearch(searchInput.value);
                }
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                this.scrollToSection(target);
            });
        });

        // Close showcase on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentService) {
                this.closeServiceShowcase();
            }
        });
    }

    setupMobileMenu() {
        const menuToggle = document.querySelector('.header__menu-toggle');
        const nav = document.querySelector('.header__nav');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('is-open');
                menuToggle.setAttribute('aria-expanded', 
                    nav.classList.contains('is-open'));
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
                    nav.classList.remove('is-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    setupHeroInteractions() {
        // Animate typing indicator
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            setTimeout(() => {
                this.showAIResponse();
            }, 2000);
        }

        // Search box focus effects
        const searchInput = document.getElementById('heroSearch');
        if (searchInput) {
            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                searchInput.parentElement.classList.remove('focused');
            });
        }
    }

    setupServiceCards() {
        // Add hover effects and accessibility
        document.querySelectorAll('.service-card').forEach(card => {
            // Keyboard navigation
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const service = card.dataset.service;
                    this.openServiceShowcase(service);
                }
            });

            // Add ripple effect on click
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe service cards
        document.querySelectorAll('.service-card').forEach(card => {
            observer.observe(card);
        });
    }

    handleHeroSearch(query) {
        if (!query.trim()) return;

        // Simulate AI response
        this.showLoadingState();
        
        setTimeout(() => {
            this.showAISearchResponse(query);
        }, 1500);
    }

    showAIResponse() {
        const typingIndicator = document.querySelector('.typing-indicator');
        const chatBubble = typingIndicator?.parentElement;
        
        if (chatBubble) {
            chatBubble.innerHTML = `
                <div class="ai-response">
                    I can help you explore Microsoft's AI services! Try asking about:
                    <br><br>
                    • Text generation and chat capabilities
                    <br>
                    • Image analysis and computer vision
                    <br>
                    • Speech recognition and synthesis
                    <br>
                    • Language understanding and translation
                </div>
            `;
        }
    }

    showLoadingState() {
        const searchButton = document.querySelector('.search-box__button');
        if (searchButton) {
            searchButton.innerHTML = '<div class="loading-spinner"></div>';
            searchButton.disabled = true;
        }
    }

    showAISearchResponse(query) {
        const searchButton = document.querySelector('.search-box__button');
        if (searchButton) {
            searchButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12l5 5L20 7"/>
                </svg>
            `;
            searchButton.disabled = false;
        }

        // Show response based on query
        const response = this.generateAIResponse(query);
        this.displaySearchResponse(response);
    }

    generateAIResponse(query) {
        const responses = {
            'surface': 'I can help you choose the perfect Surface device! Our Computer Vision AI can analyze your usage patterns, and our Language AI can understand your specific needs to recommend the ideal Surface for you.',
            'microsoft 365': 'Microsoft 365 integrates powerful AI features including Editor for writing assistance, Designer for presentations, and Copilot for productivity. Our AI services showcase how these technologies work behind the scenes.',
            'azure': 'Azure AI services can transform your business with intelligent document processing, customer sentiment analysis, automated content moderation, and multilingual support. Let me show you how!',
            'default': `Based on your question "${query}", I can help you explore relevant AI services. Our showcase demonstrates real-world applications of Microsoft AI that can address your specific needs.`
        };

        const lowerQuery = query.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerQuery.includes(key)) {
                return response;
            }
        }
        return responses.default;
    }

    displaySearchResponse(response) {
        // Create or update response area
        let responseArea = document.querySelector('.hero__response');
        if (!responseArea) {
            responseArea = document.createElement('div');
            responseArea.className = 'hero__response';
            document.querySelector('.hero__search').appendChild(responseArea);
        }

        responseArea.innerHTML = `
            <div class="ai-response-card">
                <div class="ai-response-content">
                    ${response}
                </div>
                <div class="ai-response-actions">
                    <button class="btn btn--secondary" onclick="app.scrollToSection('#services')">
                        Explore AI Services
                    </button>
                </div>
            </div>
        `;

        responseArea.style.display = 'block';
        responseArea.classList.add('fade-in-up');
    }

    openServiceShowcase(service) {
        this.currentService = service;
        const showcaseContainer = document.getElementById('showcase-container');
        
        if (showcaseContainer) {
            showcaseContainer.style.display = 'block';
            showcaseContainer.innerHTML = this.getServiceShowcaseHTML(service);
            
            // Scroll to showcase
            showcaseContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Initialize service-specific functionality
            this.initializeServiceShowcase(service);
        }
    }

    closeServiceShowcase() {
        const showcaseContainer = document.getElementById('showcase-container');
        if (showcaseContainer) {
            showcaseContainer.style.display = 'none';
            showcaseContainer.innerHTML = '';
        }
        this.currentService = null;
    }

    scrollToSection(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    getServiceShowcaseHTML(service) {
        // This will be implemented in showcase.js
        return window.ServiceShowcase ? 
            window.ServiceShowcase.getHTML(service) : 
            '<div class="loading">Loading showcase...</div>';
    }

    initializeServiceShowcase(service) {
        // This will be implemented in showcase.js
        if (window.ServiceShowcase) {
            window.ServiceShowcase.initialize(service);
        }
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ai-response-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: var(--radius-xl);
        padding: var(--spacing-lg);
        margin-top: var(--spacing-lg);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: var(--shadow-fluent-4);
    }
    
    .ai-response-content {
        color: var(--color-text-primary);
        margin-bottom: var(--spacing-md);
        line-height: var(--line-height-relaxed);
    }
    
    .ai-response-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
    }
`;
document.head.appendChild(style);

// Initialize the application
const app = new AIShowcaseApp();

// Export for global access
window.app = app;
