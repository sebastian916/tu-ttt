document.addEventListener('DOMContentLoaded', () => {
    initTypeWriterEffect();
    initAnimations();
    initHoverEffects();
    initCurrentYear();
    // Navigation, Mobile Menu, Smooth Scrolling, Page Load Effect handled by global.js
});

function initTypeWriterEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent.trim();
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '3px solid #ffd166';

    let charIndex = 0;

    function typeWriter() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        } else {
            heroTitle.style.borderRight = 'none';
        }
    }

    // Iniciar después de un breve retraso
    setTimeout(typeWriter, 300);
}

/**
 * Inicializar animaciones de las tarjetas
 */
function initAnimations() {
    const cards = document.querySelectorAll('.proyecto-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Usar Intersection Observer para animaciones al hacer scroll
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    } else {

        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.style.animation = 'fadeIn 0.8s ease-out forwards';
        });
    }
}

function initHoverEffects() {
    const cards = document.querySelectorAll('.proyecto-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                card.style.transform = 'translateY(-10px)';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.matchMedia('(hover: hover)').matches) {
                card.style.transform = 'translateY(0)';
            }
        });


        card.addEventListener('touchstart', () => {
            card.classList.add('hover');
        }, { passive: true });

        card.addEventListener('touchend', () => {
            setTimeout(() => card.classList.remove('hover'), 150);
        }, { passive: true });
    });
}

function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}