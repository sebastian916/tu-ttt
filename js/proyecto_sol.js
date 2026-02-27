// proyecto-juan-lorenzo.js
'use strict';

/**
 * Clase principal para la página del proyecto
 * Gestiona toda la interactividad y funcionalidades
 */
class ProyectoPage {
    constructor() {
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        this.init();
    }

    /**
     * Inicializa todos los componentes
     */
    init() {
        this.setupEventListeners();
        this.animateElements();
        this.markActivePage();
        this.setupVideoPlayer();
        this.updateCopyrightYear();
        this.setupMobileMenu();
        this.setupAccessibilityFeatures();
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Botón de descarga
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => this.handleDownload(e));
        }

        // Botón de compartir
        const shareBtn = document.getElementById('shareBtn');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => this.handleShare(e));
        }

        // Botón de comentarios
        const commentBtn = document.getElementById('commentBtn');
        if (commentBtn) {
            commentBtn.addEventListener('click', (e) => this.handleComment(e));
        }

        // Scroll del header
        window.addEventListener('scroll', () => this.handleScroll());

        // Resize para detectar cambios de tamaño
        window.addEventListener('resize', () => this.handleResize());

        // Carga completa
        window.addEventListener('load', () => this.handleLoad());
    }

    /**
     * Configura el menú móvil
     */
    setupMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('show');
            
            // Actualizar icono
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-bars' : 'fas fa-times';
            }
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });

        // Cerrar menú al presionar Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    /**
     * Configura el reproductor de video
     */
    setupVideoPlayer() {
        const video = document.querySelector('.video-real');
        if (!video) return;

        const playBtn = document.querySelector('.video-control[aria-label*="Reproducir"]');
        const muteBtn = document.querySelector('.video-control[aria-label*="Silenciar"]');
        const progressBar = document.querySelector('.video-progress__bar');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '<i class="fas fa-pause" aria-hidden="true"></i>';
                    playBtn.setAttribute('aria-label', 'Pausar video');
                } else {
                    video.pause();
                    playBtn.innerHTML = '<i class="fas fa-play" aria-hidden="true"></i>';
                    playBtn.setAttribute('aria-label', 'Reproducir video');
                }
            });
        }

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                video.muted = !video.muted;
                muteBtn.innerHTML = video.muted 
                    ? '<i class="fas fa-volume-mute" aria-hidden="true"></i>'
                    : '<i class="fas fa-volume-up" aria-hidden="true"></i>';
                muteBtn.setAttribute('aria-label', video.muted 
                    ? 'Activar sonido' 
                    : 'Silenciar video');
            });
        }

        if (progressBar) {
            video.addEventListener('timeupdate', () => {
                const percent = (video.currentTime / video.duration) * 100;
                progressBar.style.width = `${percent}%`;
            });

            const progressContainer = document.querySelector('.video-progress');
            if (progressContainer) {
                progressContainer.addEventListener('click', (e) => {
                    const rect = progressContainer.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    video.currentTime = percent * video.duration;
                });
            }
        }

        // Manejo de errores del video
        video.addEventListener('error', () => {
            this.showVideoError();
        });

        video.addEventListener('loadeddata', () => {
            console.log('✅ Video cargado correctamente');
        });
    }

    /**
     * Muestra error si el video no se carga
     */
    showVideoError() {
        const videoContainer = document.querySelector('.video-container');
        if (!videoContainer) return;

        videoContainer.innerHTML = `
            <div class="video-fallback" role="alert">
                <i class="fas fa-exclamation-triangle fa-3x" aria-hidden="true"></i>
                <h3>Video no disponible</h3>
                <p>El contenido de video no se puede cargar en este momento.</p>
                <button onclick="location.reload()" class="btn btn--primary">
                    <i class="fas fa-redo" aria-hidden="true"></i> Reintentar
                </button>
            </div>
        `;
    }

    /**
     * Animación de elementos al entrar en viewport
     */
    animateElements() {
        // Verificar si IntersectionObserver está disponible
        if (!('IntersectionObserver' in window)) {
            // Fallback para navegadores antiguos
            document.querySelectorAll('.content-card, .video-section, .proyecto-hero')
                .forEach(el => el.classList.add('animate-in'));
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.content-card, .video-section, .proyecto-hero').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Maneja la descarga de documentos
     */
    async handleDownload(e) {
        e.preventDefault();
        const btn = e.currentTarget;
        
        // Guardar estado original
        const originalHTML = btn.innerHTML;
        const originalText = btn.querySelector('span').textContent;
        
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Preparando...</span>';
        btn.disabled = true;
        btn.classList.add('loading');
        
        try {
            // Simular tiempo de procesamiento
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Simular descarga
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'proyecto-juan-lorenzo.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Mostrar confirmación
            this.showNotification('Documentos preparados para descarga', 'success');
            
        } catch (error) {
            console.error('Error en descarga:', error);
            this.showNotification('Error al preparar la descarga', 'error');
            
        } finally {
            // Restaurar estado original
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            btn.classList.remove('loading');
            btn.querySelector('span').textContent = originalText;
        }
    }

    /**
     * Maneja el compartir contenido
     */
    async handleShare(e) {
        e.preventDefault();
        
        const shareData = {
            title: document.title,
            text: 'Mira este proyecto de investigación sobre patrimonio cultural',
            url: window.location.href
        };

        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
            } else {
                // Fallback: copiar al portapapeles
                await navigator.clipboard.writeText(window.location.href);
                this.showNotification('Enlace copiado al portapapeles', 'success');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error al compartir:', err);
                this.showNotification('Error al compartir', 'error');
            }
        }
    }

    /**
     * Maneja los comentarios
     */
    handleComment(e) {
        e.preventDefault();
        
        // Crear modal de comentarios
        const modalHTML = `
            <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <div class="modal__content">
                    <button class="modal__close" aria-label="Cerrar">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                    <h2 id="modal-title" class="modal__title">Dejar comentario</h2>
                    <textarea class="modal__textarea" 
                              placeholder="Escribe tu comentario sobre este proyecto..." 
                              rows="5"></textarea>
                    <div class="modal__actions">
                        <button class="btn btn--secondary modal__cancel">Cancelar</button>
                        <button class="btn btn--primary modal__submit">Enviar</button>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Configurar eventos del modal
        const modal = document.querySelector('.modal');
        const closeBtn = modal.querySelector('.modal__close');
        const cancelBtn = modal.querySelector('.modal__cancel');
        const submitBtn = modal.querySelector('.modal__submit');
        const textarea = modal.querySelector('.modal__textarea');
        
        // Enfocar textarea
        textarea.focus();
        
        // Funciones de cierre
        const closeModal = () => {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        
        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        document.addEventListener('keydown', handleEscape);
        
        // Clic fuera del modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        // Enviar comentario
        submitBtn.addEventListener('click', () => {
            const comment = textarea.value.trim();
            if (comment) {
                // Aquí enviarías el comentario al servidor
                this.showNotification('¡Gracias por tu comentario!', 'success');
                closeModal();
            } else {
                textarea.focus();
            }
        });
    }

    /**
     * Maneja el scroll para efectos en el header
     */
    handleScroll() {
        const header = document.querySelector('.modern-header');
        if (!header) return;

        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.backgroundColor = '';
            header.style.backdropFilter = '';
        }
    }

    /**
     * Maneja el resize de la ventana
     */
    handleResize() {
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        // Cerrar menú móvil si se cambia a desktop
        if (!this.isMobile) {
            const navMenu = document.querySelector('.nav-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            
            if (navMenu) navMenu.classList.remove('show');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.querySelector('i').className = 'fas fa-bars';
            }
        }
    }

    /**
     * Maneja la carga completa
     */
    handleLoad() {
        // Marcar que la página está completamente cargada
        document.documentElement.classList.add('loaded');
        
        // Actualizar estado de carga de recursos
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => img.classList.add('loaded'));
            }
        });
    }

    /**
     * Marca la página activa en la navegación
     */
    markActivePage() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath && currentPath.includes(linkPath.replace('.html', ''))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /**
     * Actualiza el año de copyright
     */
    updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    /**
     * Muestra notificaciones al usuario
     */
    showNotification(message, type = 'info') {
        // Remover notificaciones anteriores
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Crear nueva notificación
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Icono según tipo
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        
        notification.innerHTML = `
            <i class="fas fa-${icons[type] || 'info-circle'}" aria-hidden="true"></i>
            <span>${message}</span>
            <button class="notification__close" aria-label="Cerrar notificación">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar animación
        requestAnimationFrame(() => {
            notification.classList.add('notification--show');
        });
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('notification--show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    /**
     * Configura mejoras de accesibilidad
     */
    setupAccessibilityFeatures() {
        // Mejorar focus para elementos interactivos
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.classList.add('focused');
            });
            
            el.addEventListener('blur', () => {
                el.classList.remove('focused');
            });
        });
        
        // Polyfill para :focus-visible en navegadores antiguos
        if (!CSS.supports('selector(:focus-visible)')) {
            document.addEventListener('focus', (e) => {
                if (e.target.matches('button, a, input, textarea, select, [tabindex]')) {
                    e.target.classList.add('focus-visible');
                }
            }, true);
            
            document.addEventListener('blur', (e) => {
                e.target.classList.remove('focus-visible');
            }, true);
        }
        
        // Prevenir zoom en inputs en iOS
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si JavaScript está habilitado
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');
    
    // Inicializar la aplicación
    try {
        const app = new ProyectoPage();
        
        // Hacer disponible globalmente para debugging
        window.app = app;
        
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        
        // Mostrar error amigable al usuario
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <span>Hubo un error al cargar la página. Por favor, recarga.</span>
        `;
        document.querySelector('.main-content')?.prepend(errorDiv);
    }
});

// Polyfills para funcionalidades modernas
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}

// Manejar errores no capturados
window.addEventListener('error', (e) => {
    console.error('Error no capturado:', e.error);
    // Aquí podrías enviar el error a un servicio de monitoreo
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesa rechazada no capturada:', e.reason);
    e.preventDefault();
});