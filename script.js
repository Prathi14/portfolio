// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getInitialTheme();
        this.init();
    }

    getInitialTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    init() {
        this.applyTheme();
        this.setupToggle();
        this.setupMediaQuery();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
    }

    setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => this.toggle());
        }
    }

    setupMediaQuery() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 20) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        if (this.mobileToggle && this.navMenu) {
            this.mobileToggle.addEventListener('click', () => {
                this.mobileToggle.classList.toggle('active');
                this.navMenu.classList.toggle('mobile-open');
            });

            // Close mobile menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.mobileToggle.classList.remove('active');
                    this.navMenu.classList.remove('mobile-open');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.header.contains(e.target)) {
                    this.mobileToggle.classList.remove('active');
                    this.navMenu.classList.remove('mobile-open');
                }
            });
        }
    }

    setupSmoothScroll() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = this.header.offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + this.header.offsetHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    this.navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateSkillBars();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll(
            '.highlight-card, .skill-card, .project-card, .education-card, .certification-card'
        );
        
        animateElements.forEach(el => observer.observe(el));
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const formData = new FormData(this.form);
        
        // Disable button and show loading state
        submitButton.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `form-message form-message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            padding: '12px 16px',
            borderRadius: '8px',
            marginTop: '16px',
            fontSize: '14px',
            fontWeight: '500',
            backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
            color: 'white',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease'
        });
        
        // Add to form
        this.form.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
        const header = document.getElementById('header');
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Performance Optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize managers
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new ContactFormManager();
    
    // Initialize utilities
    initializeLucideIcons();
    optimizeImages();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .highlight-card,
        .skill-card,
        .project-card,
        .education-card,
        .certification-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions after resize
        const event = new Event('scroll');
        window.dispatchEvent(event);
    }, 250);
});

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadCriticalResources();