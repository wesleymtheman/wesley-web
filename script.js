// WesleyDude.com - Interactive JavaScript
// A website built by Wesley to do cool stuff

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initHeroAnimations();
    initStatsCounter();
    initScrollAnimations();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });
}

// Hero section animations and interactions
function initHeroAnimations() {
    const exploreBtn = document.getElementById('exploreBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Explore button functionality
    exploreBtn.addEventListener('click', function() {
        const aboutSection = document.querySelector('#about');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = aboutSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Learn more button functionality
    learnMoreBtn.addEventListener('click', function() {
        const aboutSection = document.querySelector('#about');
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = aboutSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Interactive floating cards
    floatingCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-30px) rotate(10deg) scale(1.1)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg) scale(1)';
        });
        
        // Random movement on click
        card.addEventListener('click', function() {
            const randomX = Math.random() * 200 - 100;
            const randomY = Math.random() * 200 - 100;
            const randomRotate = Math.random() * 360;
            
            this.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
            this.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                this.style.transform = 'translateY(0) rotate(0deg)';
            }, 2000);
        });
    });
}

// Animated statistics counter
function initStatsCounter() {
    const stats = [
        { element: document.getElementById('projectsCount'), target: 12 },
        { element: document.getElementById('linesOfCode'), target: 15420 }
    ];
    
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        const aboutSection = document.querySelector('#about');
        const rect = aboutSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            hasAnimated = true;
            
            stats.forEach(stat => {
                if (stat.element) {
                    animateNumber(stat.element, stat.target);
                }
            });
        }
    }
    
    function animateNumber(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
        }, 20);
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load
}


// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-text');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = this.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (this.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on links
        const mobileLinks = navLinks.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                
                const spans = navToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#6366f1',
        warning: '#f59e0b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    showNotification('🎉 Easter egg activated! Wesley is impressed!', 'success');
    
    // Add some fun effects
    document.body.style.animation = 'rainbow 2s ease-in-out';
    
    // Create floating emojis
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingEmoji();
        }, i * 100);
    }
}

function createFloatingEmoji() {
    const emojis = ['🚀', '💡', '⚡', '🎨', '🤖', '💻', '🌟', '🎉'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    const floatingEmoji = document.createElement('div');
    floatingEmoji.textContent = emoji;
    floatingEmoji.style.cssText = `
        position: fixed;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 50}px;
        font-size: 2rem;
        pointer-events: none;
        z-index: 10000;
        animation: floatUp 3s ease-out forwards;
    `;
    
    document.body.appendChild(floatingEmoji);
    
    setTimeout(() => {
        document.body.removeChild(floatingEmoji);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes floatUp {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        gap: 1rem;
    }
    
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        
        .nav-links.active {
            display: flex;
        }
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations can be added here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('🚀 WesleyDude.com loaded successfully!');
console.log('💡 Try the Konami code for a surprise!');
console.log('⚡ Built with ❤️ by Wesley');
