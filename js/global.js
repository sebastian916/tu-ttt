/* ============================================
   GLOBAL.JS — Funcionalidad compartida del proyecto Soy Patrimonio
   
   Este archivo contiene:
   - Loader de carga (fade-out)
   - Creación de partículas flotantes
   - Menú hamburguesa móvil
   - Cambio de estilo del header al hacer scroll
   - Detección de enlace activo en navegación
   - Navegación suave para anclas (#)
   ============================================ */

'use strict';

/* ============================================
   LOADER — Ocultar pantalla de carga
   ============================================ */
window.addEventListener('load', function () {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add('loaded');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 800);
});

/* ============================================
   PARTÍCULAS FLOTANTES
   ============================================ */
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;

    const colors = [
        'rgba(231, 76, 60, 0.1)',
        'rgba(52, 152, 219, 0.1)',
        'rgba(46, 204, 113, 0.1)'
    ];

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

/* ============================================
   MENÚ HAMBURGUESA — Toggle menú móvil
   ============================================ */
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav-container');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        this.classList.toggle('active');
        nav.classList.toggle('active');

        // Bloquear/desbloquear scroll del body
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';

        // Actualizar aria-expanded
        const expanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', expanded);
    });

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
            // Solo cerrar si el menú está abierto (modo móvil)
            if (window.innerWidth <= 768) {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Toggle del submenú en móvil
    nav.querySelectorAll('.nav-item').forEach(item => {
        const submenu = item.querySelector('.submenu');
        if (!submenu) return;

        const link = item.querySelector('.nav-link');
        const chevron = link.querySelector('.fa-chevron-down');

        // Note: For mobile, we will allow clicking the link to go to the page,
        // and clicking the chevron to toggle the submenu.
        if (chevron) {
            chevron.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    submenu.classList.toggle('active');
                    this.classList.toggle('rotate'); // Optional: rotate arrow
                }
            });
        }
    });
}

/* ============================================
   HEADER SCROLL — Cambiar estilo al desplazarse
   ============================================ */
function initHeaderScroll() {
    const header = document.querySelector('.modern-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* ============================================
   NAV ACTIVA — Detectar página actual
   ============================================ */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        if (
            linkHref === currentPage ||
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref.includes(currentPage.replace('.html', '')) && linkHref !== '#')
        ) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   SCROLL SUAVE — Para enlaces con ancla (#)
   ============================================ */
function initSmoothScroll() {
    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            history.pushState(null, null, targetId);
        }
    });
}




/* ============================================
   INICIALIZACIÓN — Ejecutar cuando el DOM esté listo
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initMobileMenu();
    initHeaderScroll();
    setActiveNavLink();
    initSmoothScroll();


    // Recrear partículas al redimensionar la ventana
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(createParticles, 250);
    });
});
