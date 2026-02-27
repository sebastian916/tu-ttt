// Variables globales
let capasActivas = ['cultural', 'publico', 'natural', 'religioso'];
let zoomActual = 1;
let lugarActual = null;
let popupAbierto = false;
let mapaImagenCargada = false;

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function () {
    // crearParticulas(); // Handled by global.js
    actualizarContadorPuntos();
    actualizarContadoresCategorias();
    inicializarPopup();
    inicializarMapa();

    // Animación inicial de los puntos del mapa
    setTimeout(() => {
        const puntos = document.querySelectorAll('.punto-mapa');
        puntos.forEach((punto, index) => {
            setTimeout(() => {
                punto.style.animation = 'bounce 0.5s ease-out';
                setTimeout(() => {
                    punto.style.animation = '';
                }, 500);
            }, index * 200);
        });
    }, 1000);

    // Scroll listener removed - handled by global.js

    // Ajustar mapa al cambiar el tamaño de la ventana
    window.addEventListener('resize', ajustarMapaResponsivo);
});

// ========== NUEVA FUNCIÓN: INICIALIZAR MAPA ==========
function inicializarMapa() {
    const mapaImagen = document.getElementById('mapaImagen');
    const mapaBasico = document.getElementById('historicalMap');
    const puntosContainer = document.querySelector('.puntos-container');

    if (!mapaImagen || !mapaBasico || !puntosContainer) {
        console.error('No se encontraron elementos del mapa');
        return;
    }

    // Asegurar que la imagen se cargue completamente
    if (mapaImagen.complete) {
        ajustarMapaResponsivo();
        mapaImagenCargada = true;
    } else {
        mapaImagen.addEventListener('load', function () {
            ajustarMapaResponsivo();
            mapaImagenCargada = true;
        });

        // Timeout de seguridad
        setTimeout(() => {
            if (!mapaImagenCargada) {
                ajustarMapaResponsivo();
                mapaImagenCargada = true;
            }
        }, 2000);
    }
}

// ========== NUEVA FUNCIÓN: AJUSTAR MAPA RESPONSIVO ==========
function ajustarMapaResponsivo() {
    const mapaImagen = document.getElementById('mapaImagen');
    const mapaBasico = document.getElementById('historicalMap');
    const puntosContainer = document.querySelector('.puntos-container');

    if (!mapaImagen || !mapaBasico || !puntosContainer) return;

    // Obtener dimensiones de la imagen
    const imgWidth = mapaImagen.naturalWidth || mapaImagen.width;
    const imgHeight = mapaImagen.naturalHeight || mapaImagen.height;

    if (imgWidth && imgHeight) {
        // Calcular la relación de aspecto
        const aspectRatio = imgHeight / imgWidth;

        // Ajustar el contenedor de puntos para que coincida con la imagen visible
        const displayedWidth = mapaImagen.offsetWidth;
        const displayedHeight = displayedWidth * aspectRatio;

        // Asegurar que el contenedor de puntos tenga la misma altura que la imagen
        puntosContainer.style.height = `${displayedHeight}px`;

        console.log(`Mapa ajustado: ${displayedWidth}x${displayedHeight}px (ratio: ${aspectRatio.toFixed(2)})`);
    }

    // Asegurar que los puntos estén visibles
    const puntos = document.querySelectorAll('.punto-mapa');
    puntos.forEach(punto => {
        punto.style.visibility = 'visible';
        punto.style.opacity = '1';
    });
}

// Crear partículas flotantes en el fondo
// function creating particles removed - handled by global.js

// Actualizar contador de puntos visibles
function actualizarContadoresCategorias() {
    const categorias = {
        'cultural': 3,
        'publico': 2,
        'natural': 1,
        'religioso': 2
    };

    document.getElementById('contador-cultural').textContent = `${categorias.cultural} lugar${categorias.cultural !== 1 ? 'es' : ''}`;
    document.getElementById('contador-publico').textContent = `${categorias.publico} lugar${categorias.publico !== 1 ? 'es' : ''}`;
    document.getElementById('contador-natural').textContent = `${categorias.natural} lugar${categorias.natural !== 1 ? 'es' : ''}`;
    document.getElementById('contador-religioso').textContent = `${categorias.religioso} lugar${categorias.religioso !== 1 ? 'es' : ''}`;
}

function actualizarContadorPuntos() {
    const puntosVisibles = 8;
    const elemento = document.getElementById('puntosVisibles');
    if (elemento) {
        elemento.textContent = puntosVisibles;
    }
}

// ===== FUNCIONES PARA EL POPUP EMERGENTE =====

// Inicializar eventos del popup
function inicializarPopup() {
    const closeBtn = document.getElementById('closePopup');
    const popup = document.getElementById('popupContainer');

    if (!closeBtn || !popup) return;

    // Evento para cerrar con el botón
    closeBtn.addEventListener('click', cerrarPopup);

    // Evento para cerrar haciendo clic fuera del contenido
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            cerrarPopup();
        }
    });

    // Evento para cerrar con Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popupAbierto) {
            cerrarPopup();
        }
    });

    // Eventos para los botones del footer
    const btnCompartir = document.querySelector('.popup-btn.compartir');
    const btnFavorito = document.querySelector('.popup-btn.favorito');

    if (btnCompartir) {
        btnCompartir.addEventListener('click', function () {
            const lugar = document.getElementById('popupLugar').textContent;
            const descripcion = document.getElementById('popupDescripcion').textContent;
            compartirLugar(lugar, descripcion);
        });
    }

    if (btnFavorito) {
        btnFavorito.addEventListener('click', function () {
            const lugar = document.getElementById('popupLugar').textContent;
            agregarAFavoritos(lugar);
        });
    }
}

// Función para abrir el popup con los datos del lugar
function mostrarDetallesPopup(lugarId) {
    // Obtener datos del lugar
    const detalleElemento = document.getElementById(`detalles-${lugarId}`);

    if (detalleElemento) {
        const imagen = detalleElemento.querySelector('img');
        const titulo = detalleElemento.querySelector('h3').textContent;
        const categoriaElemento = detalleElemento.querySelector('.categoria-lugar');
        const descripcion = detalleElemento.querySelector('p').textContent;

        // Obtener los datos adicionales
        const datosContainer = detalleElemento.querySelector('.datos-lista-contenedor');
        let datosHTML = '';

        if (datosContainer) {
            const datosItems = datosContainer.querySelectorAll('.dato-item');
            if (datosItems.length > 0) {
                datosHTML = '<div class="datos-popup">';
                datosItems.forEach(item => {
                    datosHTML += `<div class="dato-item">${item.textContent}</div>`;
                });
                datosHTML += '</div>';
            }
        }

        const categoria = categoriaElemento ?
            categoriaElemento.textContent.trim().replace(/^\s*\S+\s*/, '') :
            'Patrimonio Cultural';

        const categoriaIcono = categoriaElemento ?
            categoriaElemento.querySelector('i').className :
            'fas fa-landmark';

        // Abrir popup con los datos
        abrirPopup(
            lugarId,
            titulo,
            imagen.src,
            categoria,
            categoriaIcono,
            descripcion,
            datosHTML
        );

        // Marcar el punto como seleccionado
        marcarPuntoSeleccionado(lugarId);
    }
}

// Abrir popup con datos específicos
function abrirPopup(lugarId, titulo, imagenSrc, categoria, categoriaIcono, descripcion, datosHTML) {
    const popup = document.getElementById('popupContainer');
    const imagen = document.getElementById('popupImagen');
    const popupTitulo = document.getElementById('popupTitulo');
    const popupLugar = document.getElementById('popupLugar');
    const popupCategoria = document.getElementById('popupCategoria');
    const popupDescripcion = document.getElementById('popupDescripcion');
    const popupDatos = document.getElementById('popupDatos');

    // Establecer los datos
    imagen.src = imagenSrc;
    imagen.alt = titulo;
    popupTitulo.textContent = 'Patrimonio Cultural de Sogamoso';
    popupLugar.textContent = titulo;
    popupCategoria.innerHTML = `<i class="${categoriaIcono}"></i> ${categoria}`;
    popupDescripcion.textContent = descripcion;

    // Agregar datos adicionales si existen
    if (datosHTML) {
        popupDatos.innerHTML = datosHTML;
        popupDatos.style.display = 'block';
    } else {
        popupDatos.innerHTML = '';
        popupDatos.style.display = 'none';
    }

    // Mostrar popup
    popup.style.display = 'flex';
    popupAbierto = true;
    lugarActual = lugarId;

    // Deshabilitar scroll del body
    document.body.style.overflow = 'hidden';

    // Animación de entrada
    setTimeout(() => {
        const contenido = document.querySelector('.popup-content');
        if (contenido) {
            contenido.style.transform = 'translateY(0) scale(1)';
        }
    }, 10);

    // Enfocar el botón de cerrar para accesibilidad
    setTimeout(() => {
        document.getElementById('closePopup').focus();
    }, 100);
}

// Función para cerrar el popup
function cerrarPopup() {
    const popup = document.getElementById('popupContainer');
    const contenido = document.querySelector('.popup-content');

    // Animación de salida
    if (contenido) {
        contenido.style.transform = 'translateY(20px) scale(0.95)';
        contenido.style.opacity = '0.7';
    }

    setTimeout(() => {
        popup.style.display = 'none';
        popupAbierto = false;
        lugarActual = null;

        // Restaurar scroll del body
        document.body.style.overflow = 'auto';

        // Restaurar transformación
        if (contenido) {
            contenido.style.transform = 'translateY(0) scale(1)';
            contenido.style.opacity = '1';
        }

        // Quitar selección del punto
        quitarSeleccionPuntos();
    }, 300);
}

// Marcar punto como seleccionado
function marcarPuntoSeleccionado(lugarId) {
    // Quitar selección anterior
    quitarSeleccionPuntos();

    // Agregar clase seleccionada al punto correspondiente
    const puntos = document.querySelectorAll('.punto-mapa');
    puntos.forEach(punto => {
        const onclickStr = punto.getAttribute('onclick');
        if (onclickStr && onclickStr.includes(lugarId)) {
            punto.classList.add('seleccionado');
            const marcador = punto.querySelector('.marcador');
            if (marcador) {
                marcador.style.animation = 'pulse 1s infinite';
            }
        }
    });
}

// Quitar selección de todos los puntos
function quitarSeleccionPuntos() {
    const puntos = document.querySelectorAll('.punto-mapa');
    puntos.forEach(punto => {
        punto.classList.remove('seleccionado');
        const marcador = punto.querySelector('.marcador');
        if (marcador) {
            marcador.style.animation = 'float 5s ease-in-out infinite';
        }
    });
}

// ===== FUNCIONALIDADES ADICIONALES =====

// Función para compartir lugar
function compartirLugar(titulo, descripcion) {
    const texto = `🔍 Descubre "${titulo}" en el patrimonio cultural de Sogamoso:\n${descripcion.substring(0, 100)}...`;
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: `Soy Patrimonio Sogamoso - ${titulo}`,
            text: texto,
            url: url
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        const textoCompleto = `${texto}\n\n🔗 ${url}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textoCompleto)
                .then(() => mostrarNotificacion('¡Enlace copiado al portapapeles! 📋', 'success'))
                .catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = textoCompleto;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    mostrarNotificacion('¡Enlace copiado! 📋', 'success');
                });
        } else {
            prompt('Comparte este lugar:', textoCompleto);
        }
    }
}

// Agregar a favoritos
function agregarAFavoritos(lugar) {
    let favoritos = JSON.parse(localStorage.getItem('sogamosoFavoritos') || '[]');

    if (!favoritos.includes(lugar)) {
        favoritos.push(lugar);
        localStorage.setItem('sogamosoFavoritos', JSON.stringify(favoritos));
        mostrarNotificacion(`"${lugar}" añadido a favoritos ❤️`, 'success');
    } else {
        mostrarNotificacion('¡Ya está en favoritos!', 'info');
    }
}

// ===== FUNCIONES DEL MAPA =====

function zoomIn() {
    if (zoomActual < 1.5) {
        zoomActual += 0.1;
        aplicarZoom();
        mostrarNotificacion('🔍 Zoom acercado', 'info');
    }
}

function zoomOut() {
    if (zoomActual > 0.7) {
        zoomActual -= 0.1;
        aplicarZoom();
        mostrarNotificacion('🔎 Zoom alejado', 'info');
    }
}

function resetMap() {
    zoomActual = 1;
    aplicarZoom();
    capasActivas = ['cultural', 'publico', 'natural', 'religioso'];

    document.querySelectorAll('.capa-item').forEach(capa => {
        capa.classList.add('activa');
    });

    quitarSeleccionPuntos();
    ajustarMapaResponsivo(); // Reajustar el mapa
    mostrarNotificacion('🗺️ Mapa restablecido', 'success');
}

function aplicarZoom() {
    const puntos = document.querySelectorAll('.punto-mapa');
    puntos.forEach(punto => {
        punto.style.transform = `translate(-50%, -50%) scale(${zoomActual})`;

        const marcador = punto.querySelector('.marcador');
        const etiqueta = punto.querySelector('.etiqueta-mapa');

        if (marcador) {
            marcador.style.width = `${55 * zoomActual}px`;
            marcador.style.height = `${55 * zoomActual}px`;
            marcador.style.fontSize = `${1.5 * zoomActual}rem`;
        }

        if (etiqueta) {
            etiqueta.style.fontSize = `${0.95 * zoomActual}rem`;
            etiqueta.style.padding = `${10 * zoomActual}px ${18 * zoomActual}px`;
        }
    });
}

function mostrarTodos() {
    capasActivas = ['cultural', 'publico', 'natural', 'religioso'];
    document.querySelectorAll('.capa-item').forEach(capa => {
        capa.classList.add('activa');
    });

    quitarSeleccionPuntos();
    mostrarNotificacion('✨ Mostrando todos los puntos patrimoniales', 'info');
}

function activarCapa(nombreCapa) {
    const capaElemento = document.getElementById(`capa-${nombreCapa}`);
    if (!capaElemento) return;

    if (capasActivas.includes(nombreCapa)) {
        capasActivas = capasActivas.filter(c => c !== nombreCapa);
        capaElemento.classList.remove('activa');
    } else {
        capasActivas.push(nombreCapa);
        capaElemento.classList.add('activa');
    }

    quitarSeleccionPuntos();
    actualizarContadorPuntos();
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo) {
    // Remover notificaciones anteriores
    const notificacionesAnteriores = document.querySelectorAll('.notificacion');
    notificacionesAnteriores.forEach(notif => notif.remove());

    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${mensaje}</span>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.style.opacity = '0';
        notificacion.style.transform = 'translateX(100%)';
        setTimeout(() => notificacion.remove(), 300);
    }, 4000);
}

// Funciones adicionales
function crearRutaTuristica() {
    mostrarNotificacion('🗺️ Ruta turística creada. ¡Comienza tu recorrido!', 'info');
}

function compartirMapa() {
    const texto = '🗺️ Explora el Mapa Histórico de Sogamoso y descubre su patrimonio cultural.';
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: 'Mapa Histórico de Sogamoso',
            text: texto,
            url: url
        }).catch(err => console.log('Error al compartir:', err));
    } else {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(`${texto}\n\n${url}`)
                .then(() => mostrarNotificacion('¡Enlace del mapa copiado!', 'success'))
                .catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = `${texto}\n\n${url}`;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    mostrarNotificacion('¡Enlace copiado!', 'success');
                });
        } else {
            prompt('Comparte el mapa:', `${texto}\n\n${url}`);
        }
    }
}

function descargarGuia() {
    mostrarNotificacion('📥 Descargando guía turística...', 'info');

    setTimeout(() => {
        mostrarNotificacion('✅ Guía descargada correctamente', 'success');
    }, 1500);
}