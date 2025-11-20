// ===================================
// MOBILE WORLD - Advanced Animations Engine
// Particle system, 3D effects, scroll animations
// ===================================

// ===================================
// PARTICLE SYSTEM
// ===================================
class ParticleSystem {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.options = {
            particleCount: options.particleCount || 30,
            particleSize: options.particleSize || 20,
            particleColor: options.particleColor || 'rgba(255, 255, 255, 0.8)',
            particleSymbols: options.particleSymbols || ['📱', '🔧', '🔨', '⚡', '✨'],
            speed: options.speed || 0.5,
            ...options
        };

        this.resizeCanvas();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        for (let i = 0; i < this.options.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.options.speed,
            vy: (Math.random() - 0.5) * this.options.speed,
            symbol: this.options.particleSymbols[Math.floor(Math.random() * this.options.particleSymbols.length)],
            size: this.options.particleSize + Math.random() * 10,
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * 360
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Wrap around edges
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
            if (particle.y < -50) particle.y = this.canvas.height + 50;
            if (particle.y > this.canvas.height + 50) particle.y = -50;

            // Draw particle
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation * Math.PI / 180);
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.font = `${particle.size}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.symbol, 0, 0);
            this.ctx.restore();

            particle.rotation += 0.5;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// SCROLL ANIMATION CONTROLLER
// ===================================
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        // Observe all scroll-reveal elements
        document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-scale').forEach(el => {
            this.observer.observe(el);
        });
    }

    // Count up animation for numbers
    static countUp(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// ===================================
// 3D TILT EFFECT
// ===================================
class TiltEffect {
    constructor(elements) {
        this.elements = typeof elements === 'string' ?
            document.querySelectorAll(elements) : elements;
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
            element.addEventListener('mouseleave', () => this.handleMouseLeave(element));
        });
    }

    handleMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    handleMouseLeave(element) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
}

// ===================================
// RIPPLE EFFECT
// ===================================
class RippleEffect {
    static add(element) {
        element.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    }

    static init(selector = '.btn-primary, .btn-secondary') {
        document.querySelectorAll(selector).forEach(button => {
            if (!button.classList.contains('ripple-container')) {
                button.classList.add('ripple-container');
                this.add(button);
            }
        });
    }
}

// ===================================
// CONFETTI ANIMATION
// ===================================
class Confetti {
    static create(count = 50) {
        const colors = ['#667eea', '#764ba2', '#f5576c', '#4facfe', '#00f2fe'];
        const container = document.createElement('div');
        container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
        document.body.appendChild(container);

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: ${Math.random() * 0.8 + 0.2};
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            `;
            container.appendChild(confetti);
        }

        setTimeout(() => container.remove(), 5000);
    }
}

// ===================================
// PARALLAX SCROLL EFFECT
// ===================================
class Parallax {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        this.init();
    }

    init() {
        if (this.elements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;

            this.elements.forEach(element => {
                const speed = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });
    }
}

// ===================================
// MAGNETIC CURSOR EFFECT
// ===================================
class MagneticEffect {
    constructor(elements) {
        this.elements = typeof elements === 'string' ?
            document.querySelectorAll(elements) : elements;
        this.strength = 0.3;
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                element.style.transform = `translate(${x * this.strength}px, ${y * this.strength}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ===================================
// ANIMATED NUMBER COUNTER
// ===================================
class NumberCounter {
    static observe() {
        const counters = document.querySelectorAll('[data-count]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.dataset.count);
                    this.animate(entry.target, target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    static animate(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target).toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
}

// ===================================
// STAGGER ANIMATION HELPER
// ===================================
class StaggerAnimation {
    static apply(selector, delay = 100) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.style.animationDelay = `${index * delay}ms`;
        });
    }
}

// ===================================
// CURSOR TRAIL EFFECT
// ===================================
class CursorTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 10;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: fixed;
                width: 5px;
                height: 5px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                opacity: 0.6;
                animation: fadeOut 1s ease-out forwards;
            `;

            document.body.appendChild(dot);
            this.trail.push(dot);

            if (this.trail.length > this.maxTrail) {
                const old = this.trail.shift();
                old.remove();
            }

            setTimeout(() => dot.remove(), 1000);
        });
    }
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function () {
    // Initialize particle system on hero section
    const heroCanvas = document.getElementById('particleCanvas');
    if (heroCanvas) {
        new ParticleSystem('particleCanvas', {
            particleCount: 25,
            particleSize: 20,
            particleSymbols: ['📱', '🔧', '🔨', '⚡', '✨', '💫', '🛠️'],
            speed: 0.3
        });
    }

    // Initialize scroll animations
    new ScrollAnimations();

    // Initialize 3D tilt effect on cards
    const cards = document.querySelectorAll('.card, .pricing-card');
    if (cards.length > 0) {
        new TiltEffect(cards);
    }

    // Initialize ripple effects
    RippleEffect.init();

    // Initialize parallax scrolling
    new Parallax();

    // Initialize magnetic effect on buttons
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-large');
    if (magneticButtons.length > 0) {
        new MagneticEffect(magneticButtons);
    }

    // Initialize number counters
    NumberCounter.observe();

    // Apply stagger animations to feature boxes
    StaggerAnimation.apply('.feature-box', 150);

    // Add floating animation to icons
    document.querySelectorAll('.feature-icon, .card-icon').forEach((icon, index) => {
        icon.classList.add('animate-float');
        icon.style.animationDelay = `${index * 0.2}s`;
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Export for global access
window.AnimationEngine = {
    ParticleSystem,
    ScrollAnimations,
    TiltEffect,
    RippleEffect,
    Confetti,
    Parallax,
    MagneticEffect,
    NumberCounter,
    StaggerAnimation,
    CursorTrail
};

// Add fadeOut animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);
