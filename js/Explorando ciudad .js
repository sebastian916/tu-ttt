// ============================================
// EXPLORANDO CIUDAD .JS — Lógica de la página Explorando la Ciudad
//
// Funcionalidades:
// - Animación de timeline con Intersection Observer
// - Manejo de errores en imágenes
// - Active nav link (ya manejado por global.js si coincide)
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initTimeline();
    initImageHandling();
});

// ============================================
// TIMELINE — Animaciones al hacer scroll
// ============================================
function initTimeline() {
    const timelineEvents = document.querySelectorAll('.timeline-event');

    if (!timelineEvents.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    timelineEvents.forEach((event, index) => {
        // Stagger delay for sequential animation
        event.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(event);
    });
}

// ============================================
// IMÁGENES — Manejo de errores y lazy loading
// ============================================
function initImageHandling() {
    const images = document.querySelectorAll('.timeline-media img');

    images.forEach(img => {
        img.addEventListener('error', function () {
            console.warn(`Error cargando imagen: ${this.src}`);

            const parent = this.parentElement;
            if (parent) {
                const placeholder = document.createElement('div');
                placeholder.style.cssText = `
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 200px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    color: #999;
                    font-size: 1rem;
                    font-weight: 500;
                    text-align: center;
                    padding: 20px;
                `;
                placeholder.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; margin-right: 10px;"></i> Imagen no disponible';
                parent.innerHTML = '';
                parent.appendChild(placeholder);
            }
        });

        // Lazy loading nativo
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
}

console.log('Explorando Ciudad - Script cargado');