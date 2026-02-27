// ============================================
// INICIALIZACIÓN
// ============================================

// Crear partículas flotantes
function createParticles() {
    const container = document.querySelector('.particles-container');
    if (!container) return;
    
    const colors = ['rgba(231, 76, 60, 0.1)', 'rgba(52, 152, 219, 0.1)', 'rgba(46, 204, 113, 0.1)'];
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
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        const targetId = e.target.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }
});

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.modern-header');
    if (header) {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(44, 62, 80, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }
});

// ============================================
// DATOS DE ARCHIVOS
// ============================================

const documentos = [
    { nombre: 'Informe_Patrimonio_2024.pdf', tipo: 'pdf', tamaño: 2457600 },
    { nombre: 'Investigacion_Colonial.docx', tipo: 'docx', tamaño: 1536000 },
    { nombre: 'Memoria_Historica.pdf', tipo: 'pdf', tamaño: 3891200 },
    { nombre: 'Proyecto_Educativo.doc', tipo: 'doc', tamaño: 1024000 },
    { nombre: 'Analisis_Arquitectonico.pdf', tipo: 'pdf', tamaño: 5242880 },
    { nombre: 'Propuesta_Conservacion.docx', tipo: 'docx', tamaño: 2048000 }
];

const imagenes = [
    { nombre: 'Catedral_Sogamoso.jpg', tipo: 'jpg', tamaño: 3145728 },
    { nombre: 'Plaza_Villa.png', tipo: 'png', tamaño: 4194304 },
    { nombre: 'Museo_Arqueologico.jpeg', tipo: 'jpeg', tamaño: 2621440 },
    { nombre: 'Iglesia_San_Martin.jpg', tipo: 'jpg', tamaño: 2883584 },
    { nombre: 'Templo_Sol.png', tipo: 'png', tamaño: 5767168 },
    { nombre: 'Centro_Historico.jpg', tipo: 'jpg', tamaño: 3670016 },
    { nombre: 'Parque_Sugamuxi.jpeg', tipo: 'jpeg', tamaño: 2097152 }
];

const videos = [
    { nombre: 'Recorrido_Virtual.mp4', tipo: 'mp4', tamaño: 15728640 },
    { nombre: 'Entrevista_Historiador.mov', tipo: 'mov', tamaño: 20971520 },
    { nombre: 'Documental_Patrimonio.avi', tipo: 'avi', tamaño: 25165824 },
    { nombre: 'Taller_Estudiantes.mp4', tipo: 'mp4', tamaño: 12582912 }
];

const todosLosArchivos = [...documentos, ...imagenes, ...videos];

let archivosFiltrados = [...todosLosArchivos];
let filtroActual = 'all';
let ordenActual = 'name';

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatearTamaño(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function obtenerIcono(tipo) {
    const iconos = {
        pdf: 'fa-file-pdf',
        doc: 'fa-file-word',
        docx: 'fa-file-word',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        png: 'fa-file-image',
        mp4: 'fa-file-video',
        mov: 'fa-file-video',
        avi: 'fa-file-video'
    };
    return iconos[tipo] || 'fa-file';
}

function obtenerColorTipo(tipo) {
    if (['pdf'].includes(tipo)) return '#d32f2f';
    if (['doc', 'docx'].includes(tipo)) return '#1976d2';
    if (['jpg', 'jpeg', 'png'].includes(tipo)) return '#388e3c';
    if (['mp4', 'mov', 'avi'].includes(tipo)) return '#7b1fa2';
    return '#757575';
}

function generarMiniatura(archivo) {
    if (['jpg', 'jpeg', 'png'].includes(archivo.tipo)) {
        return `https://via.placeholder.com/400x250/${Math.random().toString(16).substr(2, 6)}/ffffff?text=${encodeURIComponent(archivo.nombre)}`;
    }
    return null;
}

// ============================================
// RENDERIZADO Y FILTRADO
// ============================================

function renderizarArchivos() {
    const fileList = document.getElementById('fileList');
    const fileCount = document.getElementById('fileCount');
    
    if (!fileList || !fileCount) return;
    
    if (archivosFiltrados.length === 0) {
        fileList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No se encontraron archivos</p>
            </div>
        `;
        fileCount.textContent = '';
        return;
    }

    fileCount.textContent = `Mostrando ${archivosFiltrados.length} archivo${archivosFiltrados.length !== 1 ? 's' : ''}`;

    fileList.innerHTML = archivosFiltrados.map(archivo => {
        const miniatura = generarMiniatura(archivo);
        const color = obtenerColorTipo(archivo.tipo);
        
        return `
            <li class="file-item" data-tipo="${archivo.tipo}">
                <div class="file-icon">
                    ${miniatura 
                        ? `<img src="${miniatura}" alt="${archivo.nombre}" loading="lazy" />` 
                        : `<i class="fas ${obtenerIcono(archivo.tipo)}" style="color: ${color}"></i>`
                    }
                </div>
                <div class="file-info">
                    <div class="file-name" title="${archivo.nombre}">${archivo.nombre}</div>
                    <div class="file-meta">
                        <span class="file-type" style="background: ${color}20; color: ${color}">
                            <i class="fas fa-file"></i>
                            ${archivo.tipo.toUpperCase()}
                        </span>
                        <span class="file-size">${formatearTamaño(archivo.tamaño)}</span>
                    </div>
                </div>
                <div class="file-actions">
                    ${['jpg', 'jpeg', 'png', 'pdf', 'mp4', 'mov', 'avi'].includes(archivo.tipo)
                        ? `<button class="action-btn btn-preview" onclick="previsualizarArchivo('${archivo.nombre}', '${archivo.tipo}')">
                            <i class="fas fa-eye"></i> Ver
                           </button>`
                        : `<div class="file-info-badge">
                            <i class="fas fa-file"></i> Archivo de documento
                           </div>`
                    }
                </div>
            </li>
        `;
    }).join('');
}

function filtrarArchivos(filtro) {
    filtroActual = filtro;
    
    if (filtro === 'all') {
        archivosFiltrados = [...todosLosArchivos];
    } else if (filtro === 'docs') {
        archivosFiltrados = todosLosArchivos.filter(a => ['pdf', 'doc', 'docx'].includes(a.tipo));
    } else if (filtro === 'images') {
        archivosFiltrados = todosLosArchivos.filter(a => ['jpg', 'jpeg', 'png'].includes(a.tipo));
    } else if (filtro === 'videos') {
        archivosFiltrados = todosLosArchivos.filter(a => ['mp4', 'mov', 'avi'].includes(a.tipo));
    }
    
    aplicarBusqueda();
    ordenarArchivos(ordenActual);
}

function aplicarBusqueda() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm === '') {
        if (filtroActual === 'all') {
            archivosFiltrados = [...todosLosArchivos];
        } else {
            filtrarArchivos(filtroActual);
            return;
        }
    } else {
        const base = filtroActual === 'all' ? todosLosArchivos : archivosFiltrados;
        archivosFiltrados = base.filter(a => 
            a.nombre.toLowerCase().includes(searchTerm)
        );
    }
    
    renderizarArchivos();
}

function ordenarArchivos(criterio) {
    ordenActual = criterio;
    
    if (criterio === 'name') {
        archivosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (criterio === 'size') {
        archivosFiltrados.sort((a, b) => b.tamaño - a.tamaño);
    }
    
    renderizarArchivos();
}

// ============================================
// PREVIEW Y DESCARGA
// ============================================

function previsualizarArchivo(nombre, tipo) {
    const modal = document.getElementById('previewModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    let contenido = '';
    
    if (['jpg', 'jpeg', 'png'].includes(tipo)) {
        const miniatura = generarMiniatura({ nombre, tipo });
        contenido = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 20px; color: var(--primary-color);">${nombre}</h3>
                <img src="${miniatura}" alt="${nombre}" style="max-width: 100%; height: auto;" />
            </div>
        `;
    } else if (tipo === 'pdf') {
        contenido = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 20px; color: var(--primary-color);">${nombre}</h3>
                <iframe src="https://mozilla.github.io/pdf.js/web/viewer.html" style="width: 100%; height: 70vh; border: none; border-radius: 10px;"></iframe>
                <p style="margin-top: 15px; color: #666;">Vista previa de PDF (simulación)</p>
            </div>
        `;
    } else if (['mp4', 'mov', 'avi'].includes(tipo)) {
        contenido = `
            <div style="text-align: center;">
                <h3 style="margin-bottom: 20px; color: var(--primary-color);">${nombre}</h3>
                <video controls style="width: 100%; max-width: 800px; border-radius: 10px; background: black;">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
                <p style="margin-top: 15px; color: #666;">Video de demostración</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = contenido;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    const modal = document.getElementById('previewModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Crear partículas
    createParticles();
    
    // Renderizar archivos iniciales
    renderizarArchivos();
    
    // Filtros
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filtrarArchivos(this.dataset.filter);
        });
    });
    
    // Búsqueda
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', aplicarBusqueda);
    }
    
    // Ordenamiento
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            ordenarArchivos(this.value);
        });
    }
    
    // Cerrar modal
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', cerrarModal);
    }
    
    const modal = document.getElementById('previewModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarModal();
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    });
    
    // Ajustar hero según tamaño de imagen
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        heroImage.addEventListener('load', function() {
            const hero = document.querySelector('.hero');
            if (hero) {
                const maxHeight = Math.min(this.naturalHeight, 600);
                hero.style.minHeight = Math.max(maxHeight * 0.6, 300) + 'px';
            }
        });
        
        if (heroImage.complete) {
            heroImage.dispatchEvent(new Event('load'));
        }
    }
});

// Animaciones de entrada
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

setTimeout(() => {
    const fileItems = document.querySelectorAll('.file-item');
    fileItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animationDelay = `${index * 0.05}s`;
        observer.observe(item);
    });
}, 100);