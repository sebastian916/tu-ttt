// Eliminar loader
window.addEventListener('load', function() {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Animaciones de contadores
function animateCounter(elementId, targetValue, duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const increment = targetValue / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        element.textContent = Math.floor(currentValue);
    }, 16);
}

// Iniciar contadores cuando se hace scroll a la sección
const observerOptions = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter('mapPoints', 15);
            animateCounter('studentWorks', 128);
            animateCounter('activeUsers', 543);
            animateCounter('badgesAwarded', 289);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar la sección de contadores
const counterSection = document.querySelector('.counter-section');
if (counterSection) {
    observer.observe(counterSection);
}

// Efecto de escritura para el título
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < originalText.length) {
            heroTitle.textContent += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 1200);
}

// Animación de elementos al hacer scroll
const fadeElements = document.querySelectorAll('.feature-card, .preview-content');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(element => {
    if (element) {
        element.style.opacity = '0';
        fadeObserver.observe(element);
    }
});

// Efecto de partículas flotantes
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const colors = ['rgba(231, 76, 60, 0.1)', 'rgba(52, 152, 219, 0.1)', 'rgba(46, 204, 113, 0.1)'];
    
    // Limpiar partículas existentes
    container.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-element';
        
        const size = Math.random() * 40 + 20;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 3 + 3}s`;
        
        container.appendChild(particle);
    }
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Actualizar URL sin recargar la página
            history.pushState(null, null, targetId);
        }
    });
});

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.modern-header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--gradient-primary)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
});

// Activar enlaces de navegación actuales
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref.includes(currentPage.replace('.html', '')) && linkHref !== '#')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Inicializar funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    setActiveNavLink();
    
    // Manejar redimensionamiento de ventana
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            createParticles();
        }, 250);
    });
    
    // Prevenir envío de formularios por defecto (si los hubiera)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Aquí iría la lógica de envío del formulario
        });
    });
});

// Añadir funcionalidad al botón CTA
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#explorar') {
            e.preventDefault();
            const exploreSection = document.querySelector('#explorar');
            if (exploreSection) {
                window.scrollTo({
                    top: exploreSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        }
    });
}