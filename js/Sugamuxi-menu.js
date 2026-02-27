document.addEventListener('DOMContentLoaded', () => {
    initTypeWriterEffect();
    initFilterTabs();
    initAnimations();
    initHoverEffects();
    initCurrentYear();
    // global.js handles Nav, Mobile Menu, etc.
});

/**
 * Efecto de escritura para el título Hero
 */
function initTypeWriterEffect() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent.trim();
    heroTitle.textContent = '';

    let charIndex = 0;

    function typeWriter() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }

    setTimeout(typeWriter, 300);
}

/**
 * Sistema de filtrado por pestañas
 */
function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.media-card');
    const resultsCount = document.getElementById('results-count');
    const noResults = document.getElementById('noResults');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Activar pestaña
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.getAttribute('data-filter');
            let visibleCount = 0;

            // Filtrar tarjetas
            cards.forEach(card => {
                const type = card.getAttribute('data-type');

                if (filter === 'todos' || type === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'scaleIn 0.4s ease forwards';
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                    card.style.animation = 'none';
                }
            });

            // Actualizar contador
            if (resultsCount) resultsCount.textContent = visibleCount;

            // Mostrar mensaje si no hay resultados
            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    });
}

/**
 * Animaciones al hacer scroll usando Intersection Observer
 */
function initAnimations() {
    const cards = document.querySelectorAll('.media-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

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
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

/**
 * Efectos visuales de hover y touch
 */
function initHoverEffects() {
    // Interacción simple con botones de audio (simulación)
    const audioBtns = document.querySelectorAll('.btn-audio-play');

    audioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const icon = this.querySelector('i');

            if (icon.classList.contains('fa-play')) {
                icon.classList.replace('fa-play', 'fa-pause');
                this.classList.add('playing');
            } else {
                icon.classList.replace('fa-pause', 'fa-play');
                this.classList.remove('playing');
            }
        });
    });
}

/**
 * Actualiza el año actual en el footer
 */
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}