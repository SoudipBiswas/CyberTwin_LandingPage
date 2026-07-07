/**
 * CyberTwin AI - Landing Page JavaScript
 * Premium interactions and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initLoader();
    initNavigation();
    initParticles();
    initScrollAnimations();
    initFAQ();
    initSmoothScroll();
    initDashboardTabs();
});

/**
 * Page Loader
 */
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500);
    });
}

/**
 * Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Sticky navbar on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
}

/**
 * Particle System
 */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    let animationId;
    let isActive = true;
    
    // Check for touch device - disable on mobile
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
        canvas.style.display = 'none';
        return;
    }
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    function createParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor(width * height / 15000), 50);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
            ctx.fill();
            
            // Draw connections
            particles.slice(i + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
        });
    }
    
    function animate() {
        if (!isActive) return;
        drawParticles();
        animationId = requestAnimationFrame(animate);
    }
    
    // Initialize
    resize();
    createParticles();
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
    
    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isActive = false;
            cancelAnimationFrame(animationId);
        } else {
            isActive = true;
            animate();
        }
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Animate trust score circle when visible
                if (entry.target.querySelector('.score-progress')) {
                    animateTrustScore();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
}

/**
 * Animate Trust Score
 */
function animateTrustScore() {
    const circle = document.querySelector('.score-progress');
    const scoreValue = document.querySelector('.score-value');
    if (!circle || circle.dataset.animated) return;
    
    circle.dataset.animated = 'true';
    const circumference = 2 * Math.PI * 45;
    const score = scoreValue ? Number(scoreValue.textContent) || 94 : 94;
    const targetOffset = circumference * (1 - score / 100);
    
    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.5s ease';
        circle.style.strokeDashoffset = targetOffset;
    }, 100);
}

/**
 * Dashboard Preview Tabs
 */
function initDashboardTabs() {
    const tabs = document.querySelectorAll('.dashboard-tabs .tab');
    const scoreValue = document.querySelector('.score-value');
    const scoreLabel = document.querySelector('.score-label');
    const scoreProgress = document.querySelector('.score-progress');
    const scoreDetails = document.querySelector('.score-details');
    const reasoningTitle = document.querySelector('.ai-reasoning h4');
    const reasoningText = document.querySelector('.ai-reasoning p');
    const dashboardContent = document.querySelector('.dashboard-content');

    if (!tabs.length || !scoreValue || !scoreLabel || !scoreProgress || !scoreDetails || !reasoningTitle || !reasoningText || !dashboardContent) {
        return;
    }

    const dashboardStates = {
        'Trust Analysis': {
            score: 94,
            label: 'Trust Score',
            title: 'AI Analysis',
            text: 'This email appears legitimate. The sender domain matches the organization, authentication protocols are properly configured, and content analysis shows no social engineering indicators. However, this is a new sender account created recently.',
            details: [
                { tone: 'safe', icon: '✓', text: 'Domain verified' },
                { tone: 'safe', icon: '✓', text: 'SPF/DKIM valid' },
                { tone: 'warning', icon: '!', text: 'New sender (3 days)' }
            ]
        },
        'AI Reasoning': {
            score: 87,
            label: 'AI Confidence',
            title: 'AI Reasoning',
            text: 'The AI compares sender identity, authentication records, writing patterns, link reputation, and message intent before producing a confidence score. The result is strong, but the recent sender history keeps the recommendation slightly cautious.',
            details: [
                { tone: 'safe', icon: '✓', text: 'Identity signals aligned' },
                { tone: 'safe', icon: '✓', text: 'Language risk low' },
                { tone: 'warning', icon: '!', text: 'Limited sender history' }
            ]
        },
        'Attack Journey': {
            score: 72,
            label: 'Risk Path',
            title: 'Attack Journey',
            text: 'CyberTwin maps the possible path from sender to user action, highlighting where risk can enter the message flow. The current journey shows no dangerous payload, but the new sender status remains the point to watch.',
            details: [
                { tone: 'safe', icon: '✓', text: 'No malicious payload' },
                { tone: 'safe', icon: '✓', text: 'Links scanned clean' },
                { tone: 'warning', icon: '!', text: 'Sender reputation forming' }
            ]
        }
    };

    function renderDashboardState(label) {
        const state = dashboardStates[label];
        if (!state) return;

        tabs.forEach(tab => {
            const isActive = tab.textContent.trim() === label;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-pressed', String(isActive));
        });

        dashboardContent.classList.remove('dashboard-content-ready');
        dashboardContent.classList.add('dashboard-content-switching');

        window.setTimeout(() => {
            scoreValue.textContent = state.score;
            scoreLabel.textContent = state.label;
            reasoningTitle.textContent = state.title;
            reasoningText.textContent = state.text;
            scoreDetails.innerHTML = state.details.map(item => `
                <div class="detail-item ${item.tone}">
                    <span class="detail-icon">${item.icon}</span>
                    <span>${item.text}</span>
                </div>
            `).join('');

            const circumference = 2 * Math.PI * 45;
            scoreProgress.style.strokeDasharray = circumference;
            scoreProgress.style.strokeDashoffset = circumference * (1 - state.score / 100);

            dashboardContent.classList.remove('dashboard-content-switching');
            dashboardContent.classList.add('dashboard-content-ready');
        }, 140);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => renderDashboardState(tab.textContent.trim()));
    });

    renderDashboardState('Trust Analysis');
}

/**
 * FAQ Accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Download Extension Handler
 */
document.getElementById('downloadExtension')?.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Show coming soon notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 16px 24px;
        background: rgba(139, 92, 246, 0.9);
        color: white;
        border-radius: 12px;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    notification.textContent = 'Extension download coming soon!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

/**
 * Parallax Effect for Floating Cards
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const cards = document.querySelectorAll('.float-card');
    
    cards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/**
 * Typing Effect for Hero (optional enhancement)
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// Console easter egg
console.log('%c🔒 CyberTwin AI', 'font-size: 24px; font-weight: bold; color: #8B5CF6;');
console.log('%cThink Before You Trust.', 'font-size: 14px; color: #3B82F6;');
console.log('%cBuilt with ❤️ by Gublet Gang', 'font-size: 12px; color: #10B981;');
