// WesleyDude.com - Interactive JavaScript
// A website built by Wesley to do cool stuff

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initBirthdayBanner();
    initNavigation();
    initHeroAnimations();
    initLieDetector();
    initScrollAnimations();
    initMobileMenu();
});

function nextWesleyBirthday(from = new Date()) {
    const year = from.getFullYear();
    let next = new Date(year, 4, 29); // May 29
    // After May 29, count down to next year's birthday
    const startOfToday = new Date(year, from.getMonth(), from.getDate());
    if (startOfToday > next) next = new Date(year + 1, 4, 29);
    return next;
}

function daysUntilWesleyBirthday(from = new Date()) {
    const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    const next = nextWesleyBirthday(from);
    return Math.round((next - today) / 86400000);
}

// Every May 29 — Happy Birthday Wesley! Otherwise show days until May 29.
function initBirthdayBanner() {
    if (document.getElementById('birthdayBanner')) return;

    const now = new Date();
    const isBirthday = now.getMonth() === 4 && now.getDate() === 29;
    const days = daysUntilWesleyBirthday(now);

    const banner = document.createElement('div');
    banner.id = 'birthdayBanner';
    banner.className = 'birthday-banner' + (isBirthday ? '' : ' birthday-countdown');
    banner.setAttribute('role', 'status');

    if (isBirthday) {
        banner.innerHTML = `
            <span class="birthday-banner-sparkle" aria-hidden="true">🎂</span>
            <span class="birthday-banner-text">Happy Birthday Wesley!</span>
            <span class="birthday-banner-sparkle" aria-hidden="true">🎉</span>
        `;
        document.body.classList.add('birthday-today');
    } else {
        const dayWord = days === 1 ? 'day' : 'days';
        banner.innerHTML = `
            <span class="birthday-banner-sparkle" aria-hidden="true">🎂</span>
            <span class="birthday-banner-text">${days} ${dayWord} until May 29 — Wesley’s birthday!</span>
            <span class="birthday-banner-sparkle" aria-hidden="true">🎈</span>
        `;
        document.body.classList.add('birthday-countdown-on');
    }

    document.body.insertBefore(banner, document.body.firstChild);
}

// Navigation functionality
function initNavigation() {
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only handle hash links for smooth scrolling
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For file paths, let the browser handle navigation normally
        });
    });
    
    // Header background on scroll
    if (nav) {
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
}

// Hero section animations and interactions
function initHeroAnimations() {
    const exploreBtn = document.getElementById('exploreBtn');
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const floatingCards = document.querySelectorAll('.floating-card');

    // Game pages also load this script — skip hero wiring when absent
    if (!exploreBtn && !learnMoreBtn) return;
    
    // Explore button functionality
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            // Navigate to games page
            window.location.href = 'games/index.html';
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }
    
    // Learn more button functionality
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            const aboutSection = document.querySelector('#about') || document.querySelector('#lie-detector');
            if (!aboutSection) return;
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
    }
    
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

// Lie Detector functionality — uses the real microphone
function initLieDetector() {
    const detectBtn = document.getElementById('detectBtn');
    const detectorDisplay = document.getElementById('detectorDisplay');
    const detectorNeedle = document.getElementById('detectorNeedle');
    const detectorStatus = document.getElementById('detectorStatus');
    const soundToggle = document.getElementById('soundToggle');
    const volumeSlider = document.getElementById('volumeSlider');
    const voiceMeter = document.getElementById('voiceMeter');
    const voiceMeterFill = document.getElementById('voiceMeterFill');
    const detectorScreen = document.querySelector('.detector-screen');

    if (!detectBtn || !detectorDisplay) return;

    let isDetecting = false;
    let detectionCount = 0;
    let soundEnabled = true;
    let volume = 0.5;
    let audioContext = null;
    let micStream = null;
    let analyser = null;
    let meterRaf = null;

    const truthResults = [
        { text: 'Truth Detected', color: '#10b981', needle: '45deg' },
        { text: 'Truth!', color: '#10b981', needle: '30deg' },
        { text: 'Honest Answer', color: '#10b981', needle: '60deg' }
    ];
    const lieResults = [
        { text: 'Lie Detected!', color: '#ef4444', needle: '135deg' },
        { text: 'Definitely Lying', color: '#ef4444', needle: '150deg' }
    ];
    const weakResult = { text: 'Signal Weak — speak louder', color: '#8b5cf6', needle: '180deg' };
    const inconclusiveResult = { text: 'Inconclusive', color: '#f59e0b', needle: '90deg' };

    function ensureAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            return audioContext.resume();
        }
        return Promise.resolve();
    }

    function createBeepSound(frequency, duration, waveType) {
        if (!audioContext || !soundEnabled) return;

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = waveType;

        gainNode.gain.setValueAtTime(Math.max(volume * 0.1, 0.001), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }

    function triggerSoundEffect() {
        if (!detectorScreen) return;
        detectorScreen.classList.add('sound-active');
        setTimeout(() => detectorScreen.classList.remove('sound-active'), 800);
    }

    function playStartupSound() {
        if (!audioContext || !soundEnabled) return;
        setTimeout(() => createBeepSound(400, 0.1, 'sine'), 0);
        setTimeout(() => createBeepSound(600, 0.1, 'sine'), 100);
        setTimeout(() => createBeepSound(800, 0.2, 'sine'), 200);
    }

    function playResultSound(result) {
        if (!soundEnabled || !audioContext) return;
        triggerSoundEffect();

        if (result.text.includes('Truth') || result.text.includes('Honest')) {
            setTimeout(() => createBeepSound(523, 0.2, 'sine'), 0);
            setTimeout(() => createBeepSound(659, 0.2, 'sine'), 150);
            setTimeout(() => createBeepSound(784, 0.3, 'sine'), 300);
        } else if (result.text.includes('Lie') || result.text.includes('Lying')) {
            setTimeout(() => createBeepSound(400, 0.3, 'sawtooth'), 0);
            setTimeout(() => createBeepSound(300, 0.3, 'sawtooth'), 200);
            setTimeout(() => createBeepSound(200, 0.4, 'sawtooth'), 400);
        } else if (result.text.includes('Inconclusive')) {
            createBeepSound(500, 0.4, 'triangle');
        } else {
            createBeepSound(350, 0.6, 'sine');
        }
    }

    function stopMic() {
        if (meterRaf) {
            cancelAnimationFrame(meterRaf);
            meterRaf = null;
        }
        if (micStream) {
            micStream.getTracks().forEach((track) => track.stop());
            micStream = null;
        }
        analyser = null;
        if (voiceMeter) voiceMeter.classList.remove('active');
        if (voiceMeterFill) voiceMeterFill.style.width = '0%';
        if (detectorScreen) detectorScreen.classList.remove('listening');
    }

    function getVoiceLevel() {
        if (!analyser) return 0;
        const data = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(data);

        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) {
            const sample = (data[i] - 128) / 128;
            sumSquares += sample * sample;
        }
        return Math.sqrt(sumSquares / data.length);
    }

    function updateVoiceMeter() {
        const level = getVoiceLevel();
        const percent = Math.min(100, Math.round(level * 450));
        if (voiceMeterFill) voiceMeterFill.style.width = `${percent}%`;
        meterRaf = requestAnimationFrame(updateVoiceMeter);
    }

    async function startMicrophone() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Microphone not supported in this browser.');
        }

        await ensureAudioContext();

        micStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            video: false
        });

        const source = audioContext.createMediaStreamSource(micStream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;
        source.connect(analyser);

        if (voiceMeter) voiceMeter.classList.add('active');
        if (detectorScreen) detectorScreen.classList.add('listening');
        updateVoiceMeter();
    }

    function analyzeVoiceSample(samples) {
        if (!samples.length) {
            return { kind: 'weak', score: 0 };
        }

        const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
        const peak = Math.max(...samples);
        const variance = samples.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / samples.length;
        const spokenFrames = samples.filter((value) => value > 0.02).length;
        const speechRatio = spokenFrames / samples.length;

        // Too quiet / almost no speech
        if (avg < 0.015 || speechRatio < 0.12 || peak < 0.03) {
            return { kind: 'weak', score: avg };
        }

        // Fun voice "tell" score: shaky or very loud bursts lean lie; steady speech leans truth
        let lieScore = 0;
        lieScore += Math.min(variance * 800, 0.45);
        if (peak > 0.22) lieScore += 0.2;
        if (avg > 0.12) lieScore += 0.1;
        if (speechRatio > 0.35 && variance < 0.0025) lieScore -= 0.25;
        if (avg > 0.03 && avg < 0.09 && variance < 0.003) lieScore -= 0.2;

        // Small wobble so repeats aren't identical, but still driven by mic
        lieScore += (Math.random() - 0.5) * 0.18;

        if (lieScore > 0.28) return { kind: 'lie', score: lieScore };
        if (lieScore < -0.05) return { kind: 'truth', score: lieScore };
        if (Math.abs(lieScore) < 0.08 && speechRatio < 0.28) return { kind: 'inconclusive', score: lieScore };
        return lieScore >= 0.1 ? { kind: 'lie', score: lieScore } : { kind: 'truth', score: lieScore };
    }

    function pickResult(analysis) {
        if (analysis.kind === 'weak') return weakResult;
        if (analysis.kind === 'inconclusive') return inconclusiveResult;
        if (analysis.kind === 'lie') {
            return lieResults[Math.floor(Math.random() * lieResults.length)];
        }
        return truthResults[Math.floor(Math.random() * truthResults.length)];
    }

    function showResult(result) {
        detectorDisplay.textContent = result.text;
        detectorDisplay.style.color = result.color;
        detectorNeedle.style.transform = `rotate(${result.needle})`;
        detectorStatus.textContent = `Status: Detection #${detectionCount} complete (mic scan)`;
        playResultSound(result);
        createColorfulBurst(detectBtn);
    }

    function resetButton() {
        detectBtn.textContent = 'Start Detection';
        detectBtn.disabled = false;
        isDetecting = false;
    }

    if (soundToggle) {
        soundToggle.addEventListener('click', function () {
            soundEnabled = !soundEnabled;
            this.textContent = soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
            this.style.background = soundEnabled
                ? 'linear-gradient(135deg, rgba(255, 107, 107, 0.2), rgba(72, 219, 251, 0.2), rgba(255, 159, 243, 0.2))'
                : 'linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.2))';
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            volume = this.value / 100;
        });
    }

    detectBtn.addEventListener('click', async function () {
        if (isDetecting) return;
        isDetecting = true;
        detectionCount++;

        this.textContent = 'Listening...';
        this.disabled = true;
        detectorDisplay.textContent = 'Speak your answer...';
        detectorDisplay.style.color = '#48dbfb';
        detectorNeedle.style.transform = 'rotate(0deg)';
        detectorStatus.textContent = 'Status: Requesting microphone...';

        try {
            await startMicrophone();
            playStartupSound();
            detectorStatus.textContent = 'Status: Listening — answer now!';

            const samples = [];
            const listenMs = 3200;
            const sampleEvery = 50;
            const startedAt = performance.now();

            await new Promise((resolve) => {
                const sampleTimer = setInterval(() => {
                    samples.push(getVoiceLevel());
                    const elapsed = performance.now() - startedAt;
                    const left = Math.max(0, Math.ceil((listenMs - elapsed) / 1000));
                    detectorDisplay.textContent = `Listening... ${left || 1}`;
                    detectorNeedle.style.transform = `rotate(${Math.min(180, elapsed / listenMs * 90)}deg)`;

                    if (elapsed >= listenMs) {
                        clearInterval(sampleTimer);
                        resolve();
                    }
                }, sampleEvery);
            });

            detectorDisplay.textContent = 'Analyzing voice...';
            detectorDisplay.style.color = '#6366f1';
            detectorStatus.textContent = 'Status: Scanning voice patterns...';
            createBeepSound(800, 0.1, 'sine');

            await new Promise((resolve) => setTimeout(resolve, 700));

            const analysis = analyzeVoiceSample(samples);
            stopMic();
            showResult(pickResult(analysis));

            setTimeout(resetButton, 2200);
        } catch (error) {
            stopMic();
            detectorDisplay.textContent = 'Mic blocked';
            detectorDisplay.style.color = '#ef4444';
            detectorNeedle.style.transform = 'rotate(180deg)';
            detectorStatus.textContent = 'Status: Allow microphone access, then try again';
            console.warn('Lie detector mic error:', error);
            setTimeout(resetButton, 2500);
        }
    });
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
    const animateElements = document.querySelectorAll('.lie-detector-text');
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

// Colorful particle system
function createColorfulParticles() {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createParticle(colors[Math.floor(Math.random() * colors.length)]);
        }, i * 200);
    }
}

function createParticle(color) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${window.innerHeight + 20}px;
        box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        animation: particleFloat 4s ease-out forwards;
    `;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (document.body.contains(particle)) {
            document.body.removeChild(particle);
        }
    }, 4000);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Colorful cursor trail
let mouseTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', function(e) {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const dot = document.createElement('div');
    dot.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 3}px;
        top: ${e.clientY - 3}px;
        box-shadow: 0 0 8px ${color};
        animation: trailFade 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(dot);
    mouseTrail.push(dot);
    
    if (mouseTrail.length > maxTrailLength) {
        const oldDot = mouseTrail.shift();
        if (document.body.contains(oldDot)) {
            document.body.removeChild(oldDot);
        }
    }
    
    setTimeout(() => {
        if (document.body.contains(dot)) {
            document.body.removeChild(dot);
        }
    }, 500);
});

// Add trail animation CSS
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.3);
        }
    }
`;
document.head.appendChild(trailStyle);

// Enhanced floating card interactions
document.addEventListener('DOMContentLoaded', function() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random color changes on click
        card.addEventListener('click', function() {
            const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            this.style.background = `linear-gradient(135deg, ${randomColor}40, ${randomColor}20, ${randomColor}30)`;
            this.style.boxShadow = `0 0 30px ${randomColor}60, 0 0 60px ${randomColor}40, inset 0 0 20px rgba(255, 255, 255, 0.3)`;
            
            // Create colorful burst effect
            createColorfulBurst(this);
        });
    });
});

function createColorfulBurst(element) {
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43', '#ee5a24', '#0abde3'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const burst = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        
        burst.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 8px ${color};
            animation: burstOut 0.8s ease-out forwards;
            --end-x: ${centerX + Math.cos(angle) * distance}px;
            --end-y: ${centerY + Math.sin(angle) * distance}px;
        `;
        
        document.body.appendChild(burst);
        
        setTimeout(() => {
            if (document.body.contains(burst)) {
                document.body.removeChild(burst);
            }
        }, 800);
    }
}

// Add burst animation CSS
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes burstOut {
        0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(var(--end-x) - var(--start-x)), calc(var(--end-y) - var(--start-y))) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

// Start particle system on page load
setTimeout(createColorfulParticles, 2000);

console.log('🚀 WesleyDude.com loaded successfully!');
console.log('💡 Try the Konami code for a surprise!');
console.log('⚡ Built with ❤️ by Wesley');
console.log('🌈 Now with extra colorful magic!');
