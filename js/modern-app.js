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
            'text-generation': {
                title: 'Text Generation - Business Implementation',
                scenarios: [
                    {
                        title: 'Content Marketing Automation',
                        description: 'Transform your content strategy by generating high-quality blog posts, social media content, product descriptions, and marketing copy at unprecedented scale. This AI-powered approach ensures brand consistency across all channels while dramatically reducing the time and resources traditionally required for content creation. Teams can focus on strategy and creative direction while AI handles the heavy lifting of content production, enabling faster campaign launches and more diverse content portfolios.'
                    },
                    {
                        title: 'Technical Documentation Generation',
                        description: 'Revolutionize documentation workflows by automatically creating comprehensive user manuals, API documentation, troubleshooting guides, and product specifications from technical inputs. This intelligent system can transform complex technical information into clear, accessible documentation that serves both internal teams and end users. The AI understands technical context and can adapt writing style for different audiences, from developer documentation to customer-facing help guides.'
                    },
                    {
                        title: 'Personalized Communication at Scale',
                        description: 'Deploy intelligent communication systems that generate personalized emails, proposals, customer responses, and sales materials tailored to individual recipients and contexts. This approach goes beyond simple template filling to create genuinely personalized content that reflects customer history, preferences, and business needs. The system can maintain consistent brand voice while adapting tone and content to specific audiences, relationship stages, and communication objectives.'
                    }
                ]
            },
            'ai-chat': {
                title: 'AI Chat Interface - Business Implementation',
                scenarios: [
                    {
                        title: 'Intelligent Customer Support Automation',
                        description: 'Deploy sophisticated conversational AI that handles complex customer inquiries with human-level understanding and empathy. These intelligent systems can resolve technical issues, process returns, explain policies, and even handle sensitive situations with appropriate escalation protocols. The AI maintains conversation context, accesses customer history, and can seamlessly hand off to human agents when needed, ensuring customers receive consistent, high-quality support around the clock.'
                    },
                    {
                        title: 'Enterprise Self-Service Hub',
                        description: 'Create comprehensive internal AI assistants that serve as the first point of contact for employee questions across HR policies, IT support, benefits information, and company procedures. These intelligent systems can guide employees through complex processes like expense reporting, time-off requests, or troubleshooting technical issues. The AI learns from organizational knowledge bases and can provide personalized responses based on employee roles, departments, and access levels.'
                    },
                    {
                        title: 'Intelligent Sales & Lead Qualification',
                        description: 'Implement conversational AI that engages prospects through natural dialogue, qualifying leads based on sophisticated criteria while gathering valuable insights about customer needs and pain points. The system can conduct initial discovery conversations, schedule appropriate follow-up meetings, and provide sales teams with rich context about prospect requirements. This intelligent qualification process ensures sales professionals focus their time on the most promising opportunities.'
                    }
                ]
            },
            'content-summarization': {
                title: 'Content Summarization - Business Implementation',
                scenarios: [
                    {
                        title: 'Executive Intelligence & Decision Support',
                        description: 'Transform how leadership consumes information by automatically processing lengthy reports, market research, meeting transcripts, and strategic documents into concise, actionable summaries. The AI identifies key insights, trends, and decision points while preserving critical context and nuance. Executives receive tailored briefings that highlight the most relevant information for their specific roles and responsibilities, enabling faster, more informed strategic decisions across complex business landscapes.'
                    },
                    {
                        title: 'Legal Document Intelligence',
                        description: 'Streamline legal workflows by intelligently summarizing contracts, legal briefs, regulatory filings, and case law documents while maintaining precision and legal accuracy. The system can identify key clauses, potential risks, compliance requirements, and actionable items across large document sets. Legal professionals can quickly understand document implications, compare contract terms, and focus their detailed review efforts on the most critical sections identified by the AI.'
                    },
                    {
                        title: 'Market Intelligence & Research Analysis',
                        description: 'Process comprehensive market research, competitor analysis, industry reports, and customer feedback into strategic intelligence that drives business growth. The AI can synthesize information from multiple sources, identify emerging trends, extract competitive insights, and highlight market opportunities or threats. This intelligent analysis helps teams stay ahead of market dynamics and make data-driven strategic decisions based on comprehensive yet digestible market intelligence.'
                    }
                ]
            },
            'speech-audio-generation': {
                title: 'Speech & Audio Generation - Business Implementation',
                scenarios: [
                    {
                        title: 'Voice-Enabled Digital Experiences',
                        description: 'Transform user interactions by integrating natural voice interfaces into mobile applications, smart devices, and accessibility features. This technology enables hands-free operation, improves accessibility for users with disabilities, and creates more intuitive user experiences. Voice-enabled applications can provide audio feedback, accept voice commands, and create more engaging interactions that feel natural and conversational, opening new possibilities for user interface design and accessibility compliance.'
                    },
                    {
                        title: 'Scalable Audio Content Production',
                        description: 'Revolutionize content creation by generating high-quality podcasts, audiobooks, training materials, and voiceovers directly from text sources. This approach enables rapid content localization, consistent brand voice across materials, and the ability to update audio content as quickly as text. Organizations can produce professional-quality audio content in multiple languages and voices, supporting diverse learning styles and global reach without traditional production constraints.'
                    },
                    {
                        title: 'Natural Voice Customer Interactions',
                        description: 'Deploy conversational voice systems that provide human-like customer service, sales support, and virtual assistance through natural speech patterns and intonation. These systems can handle complex customer inquiries through voice, maintain conversation context, and provide emotionally appropriate responses. The technology enables more personal customer relationships while scaling support capabilities across multiple channels and languages.'
                    }
                ]
            },
            'speech-translation': {
                title: 'Speech Translation - Business Implementation',
                scenarios: [
                    {
                        title: 'Real-Time Global Collaboration',
                        description: 'Enable seamless international business communication by providing instant speech translation during meetings, conferences, and collaborative sessions. This technology breaks down language barriers in real-time, allowing teams to speak in their native languages while ensuring everyone understands the conversation. The system preserves nuance and context while facilitating natural conversation flow, making global collaboration as effective as local teamwork.'
                    },
                    {
                        title: 'Universal Customer Support',
                        description: 'Expand customer service capabilities to support global audiences without requiring multilingual staff. The system provides real-time translation during phone calls, video chats, and voice interactions, allowing support teams to assist customers in their preferred language. This approach maintains the personal touch of voice communication while eliminating language barriers that traditionally limit customer service reach and effectiveness.'
                    },
                    {
                        title: 'Enhanced Travel & Hospitality Services',
                        description: 'Transform tourist and business traveler experiences by providing instant translation services for hospitality interactions, guided tours, and local service navigation. This technology enables service providers to communicate effectively with international visitors, enhancing satisfaction and enabling more personalized service delivery. Travelers can access local services, understand cultural information, and navigate new environments with confidence through intelligent translation assistance.'
                    }
                ]
            },
            'dalle3-image-generation': {
                title: 'DALL-E 3 Image Generation - Business Implementation',
                scenarios: [
                    {
                        title: 'Creative Marketing Asset Generation',
                        description: 'Transform marketing workflows by generating custom visuals, social media content, advertising materials, and campaign assets on-demand. This AI-powered approach enables rapid creation of diverse visual content while maintaining brand consistency across all marketing channels. Teams can explore creative concepts quickly, test multiple visual approaches, and produce professional-quality imagery for campaigns without traditional design constraints or lengthy approval processes.'
                    },
                    {
                        title: 'Dynamic E-commerce Visualization',
                        description: 'Revolutionize product marketing by generating lifestyle images, contextual product shots, and seasonal variations without expensive photography sessions. This technology enables businesses to showcase products in diverse settings, create compelling visual narratives, and rapidly adapt imagery for different markets or campaigns. The AI can maintain product accuracy while creating engaging contexts that help customers visualize products in their own environments.'
                    },
                    {
                        title: 'Rapid Concept & Design Visualization',
                        description: 'Accelerate innovation and design processes by instantly visualizing product concepts, architectural ideas, interior designs, and creative proposals. This capability enables rapid prototyping of visual concepts, facilitating faster decision-making and stakeholder communication. Design teams can explore multiple creative directions simultaneously, test visual concepts with clients, and iterate on ideas without traditional design timeline constraints.'
                    }
                ]
            },
            'image-analysis': {
                title: 'Image Analysis - Business Implementation',
                scenarios: [
                    {
                        title: 'Intelligent Quality Control Systems',
                        description: 'Deploy sophisticated computer vision systems that automatically detect product defects, manufacturing anomalies, and quality variations with precision that often exceeds human inspection capabilities. These systems can analyze products at high speed, identify subtle defects across multiple parameters, and maintain consistent quality standards throughout production processes. The technology learns from historical data to improve detection accuracy and can adapt to new product lines or quality criteria.'
                    },
                    {
                        title: 'Smart Retail Operations Management',
                        description: 'Transform retail operations through intelligent visual monitoring of shelf stock levels, product placement, pricing accuracy, and visual merchandising compliance. The system can track inventory in real-time, identify misplaced products, monitor competitor pricing, and ensure planogram compliance across multiple store locations. This comprehensive visual intelligence enables proactive inventory management and optimized store operations without manual oversight.'
                    },
                    {
                        title: 'Automated Content Governance',
                        description: 'Implement intelligent content moderation systems that automatically identify inappropriate content, safety violations, brand guideline compliance, and policy adherence across digital platforms and user-generated content. The AI can detect nuanced violations, maintain consistent moderation standards, and scale content review processes to handle large volumes while preserving user experience and platform safety standards.'
                    }
                ]
            },
            'text-recognition-ocr': {
                title: 'Text Recognition (OCR) - Business Implementation',
                scenarios: [
                    {
                        title: 'Comprehensive Document Digitization',
                        description: 'Transform paper-based workflows by intelligently extracting and processing text from invoices, contracts, forms, and business documents with high accuracy across multiple languages and formats. This system can handle handwritten notes, printed documents, and complex layouts while preserving document structure and context. The extracted information integrates seamlessly with existing business systems, enabling fully digital workflows and eliminating manual data entry bottlenecks.'
                    },
                    {
                        title: 'Automated Identity & Compliance Processing',
                        description: 'Streamline customer onboarding and compliance processes by automatically extracting and verifying information from identity documents, passports, financial statements, and regulatory filings. The system can validate document authenticity, cross-reference information against databases, and flag inconsistencies for human review. This intelligent processing ensures compliance requirements are met while significantly accelerating customer acquisition and verification workflows.'
                    },
                    {
                        title: 'Intelligent Expense & Financial Processing',
                        description: 'Automate financial document processing by extracting relevant information from receipts, invoices, bank statements, and expense reports with sophisticated understanding of financial document structures. The system can categorize expenses, validate amounts against policies, detect potential fraud indicators, and integrate with accounting systems for seamless financial management. This intelligent processing reduces errors and accelerates reimbursement cycles.'
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
                e.stopPropagation(); // Prevent service card click or showcase interaction
                const feature = icon.dataset.feature;
                this.openBusinessModal(feature);
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

    openBusinessModal(feature) {
        const modal = document.getElementById('businessValueModal');
        const modalTitle = document.getElementById('businessModalTitle');
        const modalContent = document.getElementById('businessModalContent');

        if (!modal || !modalTitle || !modalContent) return;

        const businessData = this.businessScenarios[feature];
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