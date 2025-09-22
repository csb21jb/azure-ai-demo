// Modern AI Showcase Application
class ModernAIApp {
    constructor() {
        this.currentTheme = 'light';
        this.scrollPosition = 0;
        this.isLoading = false;
        this.activeService = null;
        this.animations = [];
        this.businessScenarios = this.getBusinessScenarios();
        this.init();
    }

    // Business Value Proposition Data
    getBusinessScenarios() {
        return {
            'openai': {
                title: 'Azure OpenAI Service - Business Value',
                scenarios: [
                    {
                        title: 'Customer Service Automation',
                        description: 'Deploy AI-powered chatbots that handle 80% of customer inquiries, reducing support costs by 60% while providing 24/7 availability.',
                        roi: 'ROI: 300% within 12 months',
                        implementation: 'Implementation: 2-4 weeks integration with existing CRM systems'
                    },
                    {
                        title: 'Content Generation & Marketing',
                        description: 'Automate content creation for marketing campaigns, social media, and documentation, increasing content output by 400%.',
                        roi: 'ROI: 250% cost savings on content creation',
                        implementation: 'Implementation: Seamless API integration with content management systems'
                    },
                    {
                        title: 'Code Development Assistance',
                        description: 'Accelerate software development with AI-assisted coding, reducing development time by 30-50% and improving code quality.',
                        roi: 'ROI: $500K+ annual savings per 10-developer team',
                        implementation: 'Implementation: IDE integration and developer workflow optimization'
                    }
                ]
            },
            'openai-realtime': {
                title: 'Speech & Audio Generation - Business Value',
                scenarios: [
                    {
                        title: 'Accessibility Solutions',
                        description: 'Create inclusive digital experiences with real-time text-to-speech and speech-to-text capabilities, expanding market reach by 15%.',
                        roi: 'ROI: Increased customer base and regulatory compliance',
                        implementation: 'Implementation: Web and mobile app integration with accessibility APIs'
                    },
                    {
                        title: 'Call Center Automation',
                        description: 'Transform customer support with AI voice agents that handle routine calls, reducing wait times by 70% and costs by 45%.',
                        roi: 'ROI: $2M+ annual savings for enterprise call centers',
                        implementation: 'Implementation: 6-8 weeks telephony system integration'
                    },
                    {
                        title: 'Multilingual Support',
                        description: 'Provide instant voice translation and multilingual support, enabling global market expansion without language barriers.',
                        roi: 'ROI: 200% faster international market entry',
                        implementation: 'Implementation: Real-time translation API integration'
                    }
                ]
            },
            'image-generation': {
                title: 'Image Generation - Business Value',
                scenarios: [
                    {
                        title: 'Marketing Content Creation',
                        description: 'Generate custom marketing visuals, product mockups, and campaign assets instantly, reducing creative production costs by 70%.',
                        roi: 'ROI: $150K+ annual savings on design resources',
                        implementation: 'Implementation: Brand guideline integration with DALL-E 3 API'
                    },
                    {
                        title: 'E-commerce Product Visualization',
                        description: 'Create product variations, lifestyle images, and contextual visuals without photoshoots, increasing conversion rates by 25%.',
                        roi: 'ROI: 40% increase in online sales conversion',
                        implementation: 'Implementation: E-commerce platform integration for automated image generation'
                    },
                    {
                        title: 'Rapid Prototyping & Design',
                        description: 'Accelerate design iterations and concept visualization, reducing design cycle time from weeks to hours.',
                        roi: 'ROI: 80% faster time-to-market for new products',
                        implementation: 'Implementation: Design workflow integration with existing tools'
                    }
                ]
            },
            'speech-services': {
                title: 'Speech Services - Business Value',
                scenarios: [
                    {
                        title: 'Voice Interface Development',
                        description: 'Build intuitive voice-controlled applications and IoT devices, capturing the growing $8B voice interface market.',
                        roi: 'ROI: 150% increase in user engagement',
                        implementation: 'Implementation: SDK integration for voice-enabled applications'
                    },
                    {
                        title: 'Meeting Transcription & Analytics',
                        description: 'Automate meeting documentation and extract actionable insights, saving 10+ hours per week per employee.',
                        roi: 'ROI: $50K+ annual productivity gains per team',
                        implementation: 'Implementation: Meeting platform integration with transcription APIs'
                    },
                    {
                        title: 'Real-time Translation Services',
                        description: 'Enable seamless global communication with instant speech translation, breaking down language barriers in business.',
                        roi: 'ROI: 300% improvement in international collaboration efficiency',
                        implementation: 'Implementation: Communication platform integration'
                    }
                ]
            },
            'vision-services': {
                title: 'Vision Services - Business Value',
                scenarios: [
                    {
                        title: 'Quality Control Automation',
                        description: 'Implement AI-powered visual inspection systems that detect defects with 99.5% accuracy, reducing quality issues by 85%.',
                        roi: 'ROI: $2M+ annual savings in quality control costs',
                        implementation: 'Implementation: Manufacturing line integration with computer vision APIs'
                    },
                    {
                        title: 'Document Processing Automation',
                        description: 'Extract and process information from invoices, contracts, and forms automatically, reducing processing time by 90%.',
                        roi: 'ROI: 400% efficiency improvement in document workflows',
                        implementation: 'Implementation: Document management system integration'
                    },
                    {
                        title: 'Retail Analytics & Insights',
                        description: 'Analyze customer behavior, inventory levels, and store layouts through computer vision, optimizing sales by 20%.',
                        roi: 'ROI: $500K+ annual revenue increase per store',
                        implementation: 'Implementation: Camera system integration with analytics platform'
                    }
                ]
            },
            'language-services': {
                title: 'Language Services - Business Value',
                scenarios: [
                    {
                        title: 'Intelligent Document Analysis',
                        description: 'Automatically classify, extract insights, and process legal documents, contracts, and reports, reducing review time by 75%.',
                        roi: 'ROI: $1M+ annual savings in legal and compliance costs',
                        implementation: 'Implementation: Document management and workflow system integration'
                    },
                    {
                        title: 'Sentiment Analysis & Brand Monitoring',
                        description: 'Monitor brand sentiment across social media and customer feedback in real-time, enabling proactive reputation management.',
                        roi: 'ROI: 200% improvement in brand response time',
                        implementation: 'Implementation: Social media monitoring and CRM integration'
                    },
                    {
                        title: 'Automated Content Moderation',
                        description: 'Scale content moderation across platforms with AI-powered text analysis, reducing moderation costs by 60%.',
                        roi: 'ROI: $800K+ annual savings on moderation workforce',
                        implementation: 'Implementation: Platform API integration for real-time content analysis'
                    }
                ]
            },
            'translator-service': {
                title: 'Translator Service - Business Value',
                scenarios: [
                    {
                        title: 'Global Market Expansion',
                        description: 'Instantly localize content, websites, and applications for global markets, reducing time-to-market by 80%.',
                        roi: 'ROI: 350% faster international expansion',
                        implementation: 'Implementation: CMS and application integration for automatic translation'
                    },
                    {
                        title: 'Multilingual Customer Support',
                        description: 'Provide customer support in 100+ languages without hiring multilingual staff, expanding customer base globally.',
                        roi: 'ROI: 250% increase in international customer satisfaction',
                        implementation: 'Implementation: Support platform integration with real-time translation'
                    },
                    {
                        title: 'Document Translation Automation',
                        description: 'Automate translation of technical documentation, legal contracts, and business materials with enterprise-grade accuracy.',
                        roi: 'ROI: 90% reduction in translation costs and time',
                        implementation: 'Implementation: Document workflow integration with translation APIs'
                    }
                ]
            }
        };
    }

    init() {
        this.detectSystemTheme();
        this.setupThemeToggle();
        this.setupScrollEffects();
        this.setupRevealAnimations();
        this.setupServiceCards();
        this.setupParallaxEffects();
        this.setupMicroInteractions();
        this.setupSearchInteraction();
        this.setupQuickActions();
        this.setupNavigationHighlight();
        this.setupMobileMenu();
        this.initPerformanceOptimizations();
        this.setupAccessibility();
    }

    // Theme Management
    detectSystemTheme() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
            return;
        }

        // Check if data-theme is already set on HTML element
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme) {
            this.currentTheme = currentTheme;
            this.setTheme(currentTheme);
            return;
        }

        // Detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        } else {
            this.setTheme('light');
        }

        // Listen for system preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        toggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;

        // Remove any existing theme attributes first
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');

        // Force a reflow
        document.documentElement.offsetHeight;

        // Set the new theme
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);

        // Force background color change
        if (theme === 'dark') {
            document.body.style.backgroundColor = '#0a0a0a';
            document.body.style.color = '#ffffff';
            document.documentElement.style.backgroundColor = '#0a0a0a';
        } else {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#323130';
            document.documentElement.style.backgroundColor = '#ffffff';
        }

        const toggle = document.getElementById('themeToggle');
        const slider = document.getElementById('themeToggleSlider');

        if (toggle && slider) {
            if (theme === 'dark') {
                // Move slider to right for dark mode
                const toggleWidth = toggle.offsetWidth;
                const sliderWidth = slider.offsetWidth;
                const translateDistance = toggleWidth - sliderWidth - 4; // 4px for padding
                slider.style.transform = `translateX(${translateDistance}px)`;
                toggle.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
                toggle.style.borderColor = '#333';

                // Update icon opacities
                const sunIcon = toggle.querySelector('svg:first-child');
                const moonIcon = toggle.querySelector('svg:last-child');
                if (sunIcon) sunIcon.style.opacity = '0.3';
                if (moonIcon) moonIcon.style.opacity = '1';
            } else {
                // Move slider to left for light mode
                slider.style.transform = 'translateX(0)';
                toggle.style.background = '#e0e0e0';
                toggle.style.borderColor = '#ccc';

                // Update icon opacities
                const sunIcon = toggle.querySelector('svg:first-child');
                const moonIcon = toggle.querySelector('svg:last-child');
                if (sunIcon) sunIcon.style.opacity = '1';
                if (moonIcon) moonIcon.style.opacity = '0.3';
            }
        }

        // Update header background for new theme
        this.updateScrollEffects();

        // Save preference
        localStorage.setItem('theme', theme);
    }

    // Scroll Effects
    setupScrollEffects() {
        let ticking = false;

        const handleScroll = () => {
            this.scrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateScrollEffects() {
        // Header glass effect with consistent navigation colors
        const header = document.querySelector('.header');

        if (header) {
            if (this.scrollPosition > 50) {
                header.style.backdropFilter = 'blur(20px)';
                // Use theme-aware background that maintains good contrast
                if (this.currentTheme === 'dark') {
                    header.style.background = 'rgba(26, 26, 26, 0.9)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.9)';
                }
            } else {
                header.style.backdropFilter = 'blur(12px)';
                // Use glassmorphism effect that maintains good contrast
                if (this.currentTheme === 'dark') {
                    header.style.background = 'rgba(26, 26, 26, 0.6)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.6)';
                }
            }
        }

        // Parallax effects
        this.updateParallax();
    }

    // Reveal Animations
    setupRevealAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add stagger effect for grids
                    if (entry.target.closest('.services-grid')) {
                        const cards = entry.target.closest('.services-grid').querySelectorAll('.reveal');
                        cards.forEach((card, index) => {
                            setTimeout(() => {
                                card.classList.add('active');
                            }, index * 100);
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal').forEach(el => {
            observer.observe(el);
        });
    }

    // Service Cards
    setupServiceCards() {
        const cards = document.querySelectorAll('.service-card');

        cards.forEach(card => {
            // 3D tilt effect on hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;

                // Glow effect follow mouse
                const glow = card.querySelector('div[style*="radial-gradient"]');
                if (glow) {
                    glow.style.opacity = '1';
                    glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(102, 126, 234, 0.3) 0%, transparent 50%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                const glow = card.querySelector('div[style*="radial-gradient"]');
                if (glow) {
                    glow.style.opacity = '0';
                }
            });

            // Click handler for card (service demo)
            card.addEventListener('click', (e) => {
                // Don't open service if clicking on business info icon
                if (!e.target.closest('.business-info-icon')) {
                    this.openService(card.dataset.service);
                }
            });
        });

        // Business info icon handlers
        const businessInfoIcons = document.querySelectorAll('.business-info-icon');
        businessInfoIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent service card click
                const service = icon.dataset.service;
                this.openBusinessModal(service);
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

        // Business modal setup
        this.setupBusinessModal();
    }

    // Parallax Effects
    setupParallaxEffects() {
        this.parallaxElements = document.querySelectorAll('.parallax-element, .blob, .floating');
    }

    updateParallax() {
        if (!this.parallaxElements) return;
        
        this.parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(this.scrollPosition * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Micro Interactions
    setupMicroInteractions() {
        // Ripple effect on buttons
        document.querySelectorAll('.micro-interaction, .liquid-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        if (!document.querySelector('#ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Search Interaction
    setupSearchInteraction() {
        const searchInput = document.getElementById('aiSearch');
        const searchButton = searchInput?.nextElementSibling;
        
        if (!searchInput || !searchButton) return;
        

        
        // Search functionality
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (!query) return;
            
            this.showSearchResults(query);
        };
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    showSearchResults(query) {
        // Simulate search with loading state
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;
        
        demoContainer.innerHTML = `
            <div class="search-results" style="width: 100%;">
                <h3 style="margin-bottom: 30px;">Search Results for: "${query}"</h3>
                <div class="skeleton" style="height: 60px; margin-bottom: 20px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 60px; margin-bottom: 20px; border-radius: 12px;"></div>
                <div class="skeleton" style="height: 60px; margin-bottom: 20px; border-radius: 12px;"></div>
            </div>
        `;
        
        // Scroll to demo section
        document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
        
        // Simulate loading
        setTimeout(() => {
            this.displaySearchResults(query);
        }, 1500);
    }

    displaySearchResults(query) {
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;
        
        const results = this.getAIResponse(query);
        
        demoContainer.innerHTML = `
            <div class="search-results" style="width: 100%;">
                <h3 style="margin-bottom: 30px;">AI Response</h3>
                <div class="result-card glass-card" style="padding: 30px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: start; gap: 20px;">
                        <div class="ai-avatar" style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                                <path d="M2 17L12 22L22 17"/>
                                <path d="M2 12L12 17L22 12"/>
                            </svg>
                        </div>
                        <div style="flex: 1;">
                            <p style="line-height: 1.8; color: var(--color-text);">${results.response}</p>
                            <div style="margin-top: 20px; display: flex; gap: 10px;">
                                <span class="feature-badge" style="padding: 6px 12px; background: rgba(102, 126, 234, 0.1); border-radius: 20px; font-size: 0.875rem;">
                                    ${results.service}
                                </span>
                                <span class="feature-badge" style="padding: 6px 12px; background: rgba(102, 126, 234, 0.1); border-radius: 20px; font-size: 0.875rem;">
                                    Confidence: ${results.confidence}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <button class="liquid-button" onclick="window.app.resetDemo()">Try Another Query</button>
            </div>
        `;
    }

    getAIResponse(query) {
        const responses = {
            image: {
                response: "I can help you generate images using DALL-E 3. Simply describe what you'd like to see, including style, colors, and composition. For example: 'A serene mountain landscape at sunset with vibrant orange and purple skies, painted in watercolor style.'",
                service: "Azure OpenAI - DALL-E 3",
                confidence: 95
            },
            translate: {
                response: "I can translate text between 100+ languages with high accuracy. Our translation service supports real-time translation, document translation, and even maintains context and tone. Which languages would you like to translate between?",
                service: "Azure Translator",
                confidence: 98
            },
            sentiment: {
                response: "Our sentiment analysis can determine emotional tone in text with high precision. We analyze positive, negative, and neutral sentiments, along with emotional intensity scores. We can also identify mixed sentiments and sarcasm in context.",
                service: "Azure Language AI",
                confidence: 92
            },
            speech: {
                response: "Our speech services offer both speech-to-text and text-to-speech capabilities. We support 140+ languages and dialects, real-time transcription, custom voice models, and can handle multiple speakers with speaker diarization.",
                service: "Azure Speech Services",
                confidence: 96
            },
            default: {
                response: "I'm here to help you explore Microsoft's AI capabilities. I can assist with text generation, image creation, translation, speech processing, sentiment analysis, and much more. What specific AI task would you like to explore?",
                service: "Azure AI Platform",
                confidence: 100
            }
        };
        
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('image') || lowerQuery.includes('picture') || lowerQuery.includes('generate')) {
            return responses.image;
        } else if (lowerQuery.includes('translate') || lowerQuery.includes('spanish') || lowerQuery.includes('french')) {
            return responses.translate;
        } else if (lowerQuery.includes('sentiment') || lowerQuery.includes('emotion') || lowerQuery.includes('feeling')) {
            return responses.sentiment;
        } else if (lowerQuery.includes('speech') || lowerQuery.includes('voice') || lowerQuery.includes('audio')) {
            return responses.speech;
        }
        
        return responses.default;
    }

    resetDemo() {
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;
        
        demoContainer.innerHTML = `
            <div class="demo-placeholder" style="text-align: center;">
                <div class="icon-container pulse" style="width: 120px; height: 120px; margin: 0 auto 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 30px; display: flex; align-items: center; justify-content: center;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                </div>
                <h3 style="font-size: 1.75rem; font-weight: 600; margin-bottom: 20px;">Select a Service to Begin</h3>
                <p style="color: var(--color-text-secondary); max-width: 500px; margin: 0 auto;">
                    Click on any service card above to launch an interactive demonstration and explore AI capabilities in real-time.
                </p>
            </div>
        `;
        
        // Clear search input
        const searchInput = document.getElementById('aiSearch');
        if (searchInput) searchInput.value = '';
    }

    // Quick Actions
    setupQuickActions() {
        document.querySelectorAll('.quick-actions button').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.textContent.trim();
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const searchInput = document.getElementById('aiSearch');
        if (!searchInput) return;
        
        const queries = {
            '💬 Chat with AI': 'Start a conversation with AI assistant',
            '🎨 Generate Images': 'Generate an image of a futuristic city',
            '🔊 Speech Recognition': 'Convert speech to text in real-time'
        };
        
        searchInput.value = queries[action] || '';
        this.showSearchResults(queries[action] || action);
    }

    // Navigation
    setupNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const observerOptions = {
            rootMargin: '-50% 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.remove('nav-link--active');
                        if (link.getAttribute('href') === `#${entry.target.id}`) {
                            link.classList.add('nav-link--active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Mobile Menu
    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav__menu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
            toggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = toggle.querySelectorAll('span');
            if (toggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(7px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('active')) {
                menu.classList.remove('active');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Service Modal
    openService(serviceName) {
        if (!serviceName) return;
        
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;
        
        // Show loading state
        demoContainer.innerHTML = `
            <div style="text-align: center;">
                <div class="skeleton" style="width: 100%; height: 400px; border-radius: 20px;"></div>
            </div>
        `;
        
        // Scroll to demo
        document.getElementById('demos')?.scrollIntoView({ behavior: 'smooth' });
        
        // Initialize showcase if not already done
        if (!window.showcase) {
            window.showcase = new ServiceShowcase();
        }
        
        // Initialize services if not already done
        if (!window.services) {
            window.services = new AIServices();
        }
        
        // Load service demo
        setTimeout(() => {
            this.loadServiceDemo(serviceName);
        }, 1000);
    }

    loadServiceDemo(serviceName) {
        const demoContainer = document.getElementById('demoContainer');
        if (!demoContainer) return;
        
        // Use the existing showcase functionality
        if (window.ServiceShowcase) {
            demoContainer.innerHTML = window.ServiceShowcase.getHTML(serviceName);
            window.ServiceShowcase.initialize(serviceName);
        } else {
            // Fallback demo content
            demoContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <h3 style="font-size: 2rem; margin-bottom: 20px;">${this.formatServiceName(serviceName)} Demo</h3>
                    <p style="color: var(--color-text-secondary); margin-bottom: 30px;">
                        Interactive demonstration loading...
                    </p>
                    <button class="liquid-button" onclick="window.app.resetDemo()">Back to Services</button>
                </div>
            `;
        }
    }

    formatServiceName(name) {
        const names = {
            'openai': 'Azure OpenAI',
            'vision': 'Computer Vision',
            'speech': 'Speech Services',
            'language': 'Language AI',
            'translator': 'Translation',
            'content-safety': 'Content Safety'
        };
        return names[name] || name;
    }

    // Performance
    initPerformanceOptimizations() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
        
        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-smooth', 'none');
            document.documentElement.style.setProperty('--transition-bounce', 'none');
        }
    }

    // Accessibility
    setupAccessibility() {
        // Skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        const showcase = document.getElementById('serviceShowcase');
        if (showcase) showcase.style.display = 'none';
        this.resetDemo();
    }
    
    // Method expected by showcase.js
    closeServiceShowcase() {
        this.resetDemo();
    }

    // Business Modal Methods
    setupBusinessModal() {
        const modal = document.getElementById('businessValueModal');
        const backdrop = document.querySelector('.business-modal__backdrop');
        const closeBtn = document.querySelector('.business-modal__close');

        if (!modal || !backdrop || !closeBtn) return;

        // Close modal handlers
        closeBtn.addEventListener('click', () => this.closeBusinessModal());
        backdrop.addEventListener('click', () => this.closeBusinessModal());

        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                this.closeBusinessModal();
            }
        });
    }

    openBusinessModal(service) {
        const modal = document.getElementById('businessValueModal');
        const modalTitle = document.getElementById('businessModalTitle');
        const modalContent = document.getElementById('businessModalContent');

        if (!modal || !modalTitle || !modalContent) return;

        const businessData = this.businessScenarios[service];
        if (!businessData) return;

        // Set title
        modalTitle.textContent = businessData.title;

        // Build content
        const contentHTML = `
            <div class="business-modal__intro">
                <p style="font-size: 1.1rem; margin-bottom: 30px; color: var(--color-text-secondary);">
                    Discover how this AI service creates tangible business value through real-world implementation scenarios.
                </p>
            </div>
            <div class="business-scenarios">
                ${businessData.scenarios.map(scenario => `
                    <div class="business-scenario">
                        <h3 class="scenario-title">${scenario.title}</h3>
                        <p class="scenario-description">${scenario.description}</p>
                        <div class="scenario-metrics">
                            <div class="metric-item">
                                <strong>💰 ${scenario.roi}</strong>
                            </div>
                            <div class="metric-item">
                                <strong>⚡ ${scenario.implementation}</strong>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="business-modal__footer">
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--color-border-secondary); color: var(--color-text-secondary); font-style: italic;">
                    Ready to implement AI solutions that drive real business results? These scenarios represent proven pathways to AI adoption success.
                </p>
            </div>
        `;

        modalContent.innerHTML = contentHTML;

        // Show modal with animation
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('business-modal--active');
        });
    }

    closeBusinessModal() {
        const modal = document.getElementById('businessValueModal');
        if (!modal) return;

        modal.classList.remove('business-modal--active');
        document.body.style.overflow = '';

        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new ModernAIApp();
    });
} else {
    window.app = new ModernAIApp();
}