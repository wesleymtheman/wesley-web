// Games Section JavaScript
// WesleyDude.com Games

document.addEventListener('DOMContentLoaded', function() {
    initGamesAnimations();
    initGameCardInteractions();
});

// Initialize games page animations
function initGamesAnimations() {
    // Animate game cards on scroll
    const gameCards = document.querySelectorAll('.game-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    gameCards.forEach(card => {
        observer.observe(card);
    });
}

// Initialize game card interactions
function initGameCardInteractions() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function(e) {
            // Don't animate if it's a coming soon card
            if (this.classList.contains('coming-soon')) {
                return;
            }
            
            // Create ripple effect
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
                z-index: 1;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Game card click tracking (for analytics if needed)
function trackGameClick(gameName) {
    console.log(`🎮 Game clicked: ${gameName}`);
    // Here you could add analytics tracking
}

// Add click tracking to play buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('play-btn')) {
        const gameCard = e.target.closest('.game-card');
        if (gameCard) {
            const gameName = gameCard.querySelector('h3').textContent;
            trackGameClick(gameName);
        }
    }
});

console.log('🎮 Games section loaded successfully!');
